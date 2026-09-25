import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse as yaml } from 'yaml'
import { parse, NodeTypes } from '@vue/compiler-dom'
import { load, extractImagesUsage } from '@slidev/parser/fs'
import deck from '../deck.config.ts'
import type { ReferenceEntry, ScientificManifest } from '../types/science.ts'
import { validateImage } from './assets.ts'

export function parseReferences(input: string): ReferenceEntry[] {
  const value: unknown = yaml(input)
  if (!Array.isArray(value))
    throw new Error('Bibliography must be a YAML array')
  const ids = new Set<string>()
  for (const item of value as unknown[]) {
    if (!item || typeof item !== 'object')
      throw new Error('Invalid reference record')
    const r = item as Record<string, unknown>
    if (typeof r.id !== 'string' || !/^[\w-]+$/.test(r.id) || ids.has(r.id))
      throw new Error(`Invalid or duplicate reference ID: ${r.id}`)
    ids.add(r.id)
    if (
      typeof r.title !== 'string' ||
      !r.title.trim() ||
      !['article', 'book', 'web', 'dataset', 'image', 'software'].includes(
        String(r.type),
      )
    )
      throw new Error(`Invalid reference: ${r.id}`)
    if (
      r.authors !== undefined &&
      (!Array.isArray(r.authors) ||
        !r.authors.every((a: unknown) => typeof a === 'string' && a.trim()))
    )
      throw new Error(`Invalid authors: ${r.id}`)
    if (
      r.year !== undefined &&
      (typeof r.year !== 'number' || !Number.isInteger(r.year))
    )
      throw new Error(`Invalid year: ${r.id}`)
    for (const key of [
      'containerTitle',
      'publisher',
      'doi',
      'url',
      'accessedAt',
      'license',
    ])
      if (
        r[key] !== undefined &&
        (typeof r[key] !== 'string' || !r[key].trim())
      )
        throw new Error(`Invalid ${key}: ${r.id}`)
    if (r.url && !/^https?:\/\//.test(String(r.url)))
      throw new Error(`Invalid URL: ${r.id}`)
    if (r.doi && !/^10\.\d{4,9}\/.+/.test(String(r.doi)))
      throw new Error(`Invalid DOI: ${r.id}`)
    if (
      r.accessedAt &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(String(r.accessedAt)) ||
        Number.isNaN(Date.parse(String(r.accessedAt))) ||
        new Date(String(r.accessedAt)).toISOString().slice(0, 10) !==
          r.accessedAt)
    )
      throw new Error(`Invalid access date: ${r.id}`)
  }
  return value as ReferenceEntry[]
}

/** Ignore fenced/inline examples and comments, so documentation is never a citation. */
export function withoutExamples(content: string): string {
  return content
    .replace(/<!--[^]*?-->/g, '')
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[^]*?^\s*\1\s*$/gm, '')
    .replace(/(`+)[^]*?\1/g, '')
}
export function normalizeMath(content: string): string {
  // Protect code fences and inline code before adapting the specification's delimiters.
  return content
    .split(
      /(^\s*`{3,}[^]*?^\s*`{3,}\s*$|^\s*~{3,}[^]*?^\s*~{3,}\s*$|`+[^`]*`+)/gm,
    )
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/\\\(([^]*?)\\\)/g, (_, tex: string) => `$${tex}$`)
            .replace(
              /\\\[([^]*?)\\\]/g,
              (_, tex: string) => `\n$$\n${tex.trim()}\n$$\n`,
            ),
    )
    .join('')
}

export interface ScienceSlide {
  content: string
  frontmatter: Record<string, unknown>
  file: string
  images?: string[]
}
export function collectScience(
  slides: ScienceSlide[],
  references: ReferenceEntry[],
  root: string,
): ScientificManifest {
  const result: ScientificManifest = {
    references,
    used: [],
    assets: [],
    equations: {},
  }
  const equationRefs: string[] = []
  function add(id: string, asset = false) {
    const entry = references.find((r) => r.id === id)
    if (!entry) throw new Error(`Unknown reference: ${id}`)
    const list = asset || entry.type === 'image' ? result.assets : result.used
    if (!list.includes(id)) list.push(id)
  }
  for (const slide of slides) {
    try {
      const citations = slide.frontmatter.citations
      if (citations !== undefined) {
        if (
          !Array.isArray(citations) ||
          !citations.every((id: unknown) => typeof id === 'string')
        )
          throw new Error('citations must be a string array')
        citations.forEach((id: string) => add(id))
      }
      for (const url of slide.images ?? []) validateImage(url, slide.file, root)
      const content = withoutExamples(slide.content)
      for (const match of content.matchAll(
        /<(ImageCompare|image-compare|Cite|SourceFooter|Figure|GlossaryTerm|EquationRef|Equation|source-footer|glossary-term|equation-ref|equation)\b(?:[^>"']|"[^"]*"|'[^']*')*\/?\s*>/g,
      )) {
        const tag = match[0].replace(/\/?\s*>$/, '/>')
        const node = parse(tag).children[0]
        if (!node || node.type !== NodeTypes.ELEMENT) continue
        const name = node.tag.replace(/-/g, '').toLowerCase()
        const attrs: Record<string, string> = {}
        for (const prop of node.props) {
          if (prop.type === NodeTypes.ATTRIBUTE)
            attrs[prop.name] = prop.value?.content ?? ''
          else if (
            prop.name === 'bind' &&
            (!prop.arg ||
              prop.arg.type !== NodeTypes.SIMPLE_EXPRESSION ||
              ['id', 'ids', 'source', 'src', 'before', 'after'].includes(
                prop.arg.content,
              ))
          )
            throw new Error(
              `${node.tag}: IDs, sources and asset paths must be literal attributes`,
            )
        }
        if (name === 'cite') {
          if (!attrs.id) throw new Error('Cite needs id')
          add(attrs.id)
        }
        if (name === 'sourcefooter' && attrs.ids)
          attrs.ids.split(/\s*,\s*/).forEach((id) => add(id))
        if (['figure', 'glossaryterm'].includes(name) && attrs.source)
          add(attrs.source, name === 'figure')
        if (name === 'imagecompare') {
          for (const key of ['before', 'after']) {
            const src = attrs[key]
            if (!src || !src.startsWith('/'))
              throw new Error(
                'ImageCompare needs literal public-root before/after paths',
              )
            validateImage(src, slide.file, root)
          }
          if (!attrs['before-alt'] || !attrs['after-alt'] || !attrs.caption)
            throw new Error(
              'ImageCompare needs before-alt, after-alt and caption',
            )
        }
        if (name === 'figure') {
          if (!attrs.src || !attrs.alt || !attrs.caption)
            throw new Error('Figure needs src, alt and caption')
          validateImage(attrs.src, slide.file, root)
          if (!attrs.src.startsWith('/'))
            throw new Error(
              'Figure src must use a public-root path, e.g. /images/figure.svg',
            )
        }
        if (name === 'equation') {
          if (
            !attrs.id ||
            !/^[\w-]+$/.test(attrs.id) ||
            attrs.id === '__proto__' ||
            Object.hasOwn(result.equations, attrs.id)
          )
            throw new Error(`Missing or duplicate equation ID: ${attrs.id}`)
          result.equations[attrs.id] = Object.keys(result.equations).length + 1
        }
        if (name === 'equationref') {
          if (!attrs.id) throw new Error('EquationRef needs id')
          equationRefs.push(attrs.id)
        }
      }
    } catch (error) {
      throw new Error(`${slide.file}: ${String(error)}`, { cause: error })
    }
  }
  for (const id of equationRefs)
    if (!Object.hasOwn(result.equations, id))
      throw new Error(`Unknown equation: ${id}`)
  return result
}
export async function scientificManifest(root = process.cwd()) {
  const references = parseReferences(
    readFileSync(resolve(root, deck.citations.bibliographyFile), 'utf8'),
  )
  const slides: ScienceSlide[] = []
  for (const entry of ['slides.md', 'appendix.md']) {
    const data = await load(
      { roots: [root], userRoot: root },
      resolve(root, entry),
    )
    for (const [file, markdown] of Object.entries(data.markdownFiles)) {
      if (markdown.errors?.length)
        throw new Error(
          `${file}: ${markdown.errors.map((error) => error.message).join('; ')}`,
        )
    }
    slides.push(
      ...data.slides.map((s) => ({
        content: s.content,
        frontmatter: s.frontmatter as Record<string, unknown>,
        file: s.source.filepath,
        images: extractImagesUsage(withoutExamples(s.content), s.frontmatter),
      })),
    )
  }
  return collectScience(slides, references, root)
}
