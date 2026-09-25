# Decksmith Web

A local Slidev template for technical talks. Phases 1–3 provide Markdown content,
Vue 3 layouts, strict TypeScript, scientific components, central citations, a light
theme, reusable visualizations, controlled interaction, static hosting and PDF export.

## Start on Linux

Use Node **22.12 or newer** (`.nvmrc`) and npm. Install dependencies once with network
access, then present and export locally:

```sh
npm install
npm run dev
```

Open <http://localhost:3030>. The same command starts the appendix at
<http://localhost:3031>; Ctrl+C stops both. Keep these ports free. Slidev owns arrow-key
navigation, click steps, overview and presenter mode. Configuration changes require
restarting the dev command; Markdown, components and CSS update through Vite HMR.

For repeatable installation use `npm ci` and commit `package-lock.json` when updating
dependencies. Exact direct versions and the lockfile define the build inputs.

## Commands

| Command                   | Result                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`             | Main and appendix development servers                                                   |
| `npm run build`           | Offline static site in `dist/`, appendix in `dist/appendix/`                            |
| `npm run export:pdf`      | `output/decksmith-foundation.pdf`, name controlled by configuration                     |
| `npm run check`           | Types, lint, formatting, tests, builds, source/asset validation, browser and PDF checks |
| `npm run test:foundation` | Check an existing build with external requests blocked; screenshots in `output/smoke/`  |
| `npm run format`          | Format framework code and documentation                                                 |

PDF export and browser checks require Chromium. They prefer Playwright's bundled
browser, then `/usr/bin/chromium` on Linux. If neither is present:

```sh
npx playwright install chromium
# If Chromium reports missing system libraries, provision them once:
npx playwright install-deps chromium
```

Some npm versions block browser installation scripts; the explicit command above works
independently of lifecycle-script settings. Optional speaker-notes export always
requires this bundled browser because Slidev does not expose a system-browser option
for its notes command. An existing browser can be selected with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium`. Browser version can affect PDF
bytes; PDFs contain timestamps and are not claimed to be byte-identical. Production
static assets are reproducible with the locked toolchain and identical inputs.

Serve `dist/` with any static HTTP server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

Open <http://localhost:8080>. All runtime files are local; no internet is needed.
Hash routing and relative build URLs support a hosting subdirectory. Opening
`index.html` directly with `file://` is not supported by browser ES modules.

## Make a new talk

1. Copy/fork this repository, excluding `node_modules`, `dist` and `output`.
2. Edit `deck.config.ts`: title, subtitle, author, institution, date, language, appearance and export name.
3. Edit `slides.md` (first/title slide and main import order), `slides/*.md`, and `appendix.md`.
4. Put local images in `public/images/`, then run `npm run check` and `npm run export:pdf`.

No framework change is needed. The smoke test derives the slide count from Slidev's
parser and the title/font settings from configuration; it does not require the demo's
text. Review its screenshots and your PDF after changing content. Keep a title layout
as the first slide, and keep content within the slide's available space.

Content belongs in `slides/` and `public/`; generic code belongs in `components/`,
`layouts/`, `setup/` and `theme/`. `scripts/` contains build/export validation support.
`docs/SPEC.md` remains authoritative; `PLAN.md` and `docs/REQUIREMENTS.md` track later work.

## Configuration and metadata

`types/deck.ts` documents the central contract. `setup/preparser.ts` maps the
`decksmith: true` entry marker to native Slidev headmatter. `setup/main.ts` maps central
colors and font families to semantic CSS variables. Avoid duplicating central settings
in slide frontmatter. Only `academic-light` is implemented; the type deliberately does
not advertise future themes. `16:9` is the default; `4:3` selects Slidev's taller canvas.

Footers, slide numbers and progress are independently controlled by configuration.
`showSourceFooters` controls source rows; `citations` selects the default citation
style and the central YAML bibliography file.
`renderFinalAnimationState` maps to Slidev's single-page export versus click-step export;
no custom animations are introduced. `includeNotes: true` additionally produces a
`-notes.pdf` companion using Slidev's notes exporter. Static builds exclude speaker notes.

Per-slide frontmatter supports `title`, `layout`, `chapter`, `citations`, `tags`,
`timeBudget` (seconds), `variant` and `appendix`; see `types/deck.ts` and the demo.
Custom metadata is carried by Slidev. `citations` is validated and renders a source
row automatically; other custom metadata does not select content variants. See [Slidev's syntax](https://sli.dev/guide/syntax) and
[configuration](https://sli.dev/custom/).

## Layouts and structural components

| Layout / component            | Contract                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title` / `TitleSlide`        | Central metadata in layout; component props: required `title`, `author`, `date`, optional `subtitle`, `institution`; default content and optional `hero` slots |
| `section` / `SectionSlide`    | Frontmatter `title`, optional `number` (string/number) and `question`; component accepts those same props and a default slot                                   |
| `default`                     | Standard padded content frame and footer                                                                                                                       |
| `two-column` / `TwoColumn`    | `ratio`: `equal` (default), `wide-left`, `wide-right`; default/left and `right` slots; Markdown separates them with `::right::`                                |
| `appendix` / `AppendixMarker` | Standard frame with optional-detail label; marker has optional `label` prop                                                                                    |
| `DeckFrame`                   | Shared content frame, footer and progress from native Slidev context; default slot                                                                             |
| `DeckLink`                    | Required `target`: `main` or `appendix`; default slot supplies link text; links become plain text in PDF                                                       |

Agenda content is ordinary Markdown. Every foundation component is stateless: navigation
and re-entry cannot retain component interaction state. The same content renders in PDF.
There is no custom navigation engine or animation library.

Appendix slides form a separate Slidev entry. They never appear in the main talk's
linear navigation, but `DeckLink` opens them and returns to the main title slide.
The default PDF includes both entries; set `export.includeAppendix` to `false` for
main slides only. The ignored `.export.md` manifest is generated from the current main
entry plus the appendix entry, so there is no second content source to maintain.

## Theme, fonts and validation boundaries

Semantic tokens cover colors, typography, spacing, radius, shadow, stacking and motion.
CSS layers separate reset, tokens, theme, typography, layout and print. The Vite adapter
places Slidev's unlayered reset beneath these layers. New themes should override tokens,
not hardcode component colors. Reduced motion disables transitions and animations globally.

Inter Variable and JetBrains Mono are imported from pinned Fontsource packages, copied
into the build by Vite, and licensed under the bundled OFL notices in `public/licenses/`.
KaTeX's own local fonts are included automatically for native math (appendix smoke example).
Changing a font family requires bundling that font's CSS/assets in `style.css`; naming a
remote font does not download it. No font CDN is configured.

Vite fails unresolved imports. The scientific build hook validates references, equations
and local assets. Browser checks reject HTTP errors, broken images, external requests,
runtime errors/warnings and scientific content overflowing the slide or its footer.
Checks cover presentation and native print routes, with external requests blocked.

See `docs/VALIDATION.md` for measured evidence and limitations, including upstream npm
advisories. See `docs/DECISIONS.md` for the appendix, configuration and CSS/type boundaries.

## Scientific authoring (Phase 2)

Central YAML data lives at `citations.bibliographyFile` (`data/references.yaml`). Each
record has `id`, `type` and `title`; optional fields are `authors: string[]`, `year`,
`containerTitle`, `publisher`, `doi`, `url`, `accessedAt` (ISO date) and `license`.
Types: article, book, web, dataset, image, software. See `types/science.ts`.
DOI/URL links are external navigation, never fetched runtime dependencies. The sample
artwork's record states that no reuse license is declared; replace provenance with
verified attribution for your own assets.

The collector scans the main entry followed by the appendix, in slide/source order.
Frontmatter citations come first within a slide. Only referenced records are included;
repeated keys are deduplicated. Literature numbers precede asset-only numbers, each in
first-use order. Both entries use this same manifest even when PDF appendix inclusion
is disabled, so numeric IDs never change between outputs. `type: image` and Figure
sources belong to the asset list. A paper used both in text and as a figure source can
appear in both lists with the same numeric ID.

Use literal IDs/source paths in Markdown. Dynamic `:id`, `:ids`, `:source`, `:src`
and object `v-bind` on scientific reference/asset components are rejected because
build-time validation must be complete. PascalCase and kebab-case tags are supported; use PascalCase for `Cite` and
`Figure` to distinguish them from native HTML elements.
Put reusable scientific content into imported Markdown slides; references hidden in
arbitrary Vue/JavaScript must be declared in slide frontmatter. Dynamic runtime images
outside `Figure` cannot be exhaustively checked statically; browser smoke checks
validate rendered images. Ordinary local image imports remain Vite-validated.

| Component         | Typed API / content                                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Cite`            | Required `id: string`; optional `citationStyle: 'author-year' \| 'numeric' \| 'short-footnote'`; defaults to central style. Use `citation-style` in Markdown.                                                                                          |
| `SourceFooter`    | Optional `ids: string` (comma-separated keys), `citationStyle`; default slot also accepts `Cite` children. Frontmatter `citations: [key]` adds an automatic row. Avoid an extra explicit row for those same keys.                                      |
| `ReferencesSlide` | `kind: 'literature' \| 'assets' \| 'all'` (literature default), `offset: number = 0`, optional `limit: number`. All used entries are shown by default. Split large bibliographies over slides with explicit offsets/limits; inspect each for overflow. |
| `Equation`        | Required `id: string`; optional `label`, `explanation`, `compact: boolean`, `numbered: boolean = true`; default slot contains native block math. IDs are unique across both entries. Unnumbered blocks reserve their ID/number for stable references.  |
| `EquationRef`     | Required `id`; optional `label = 'Eq.'`; renders the stable equation number, including forward references. It is a text reference, not a second navigation system.                                                                                     |
| `NotationTable`   | Required `entries: NotationEntry[]` with `symbol` (LaTeX), `meaning`, optional `domain` (plain text); optional `caption`.                                                                                                                              |
| `Figure`          | Required `src` (public-root path), `alt`, `caption`; optional reference `source`, `license` override, `zoom: boolean`. Source license is inherited.                                                                                                    |
| `CodeBlock`       | Default slot holds a native fenced block, rendered by Slidev/Shiki. Optional `filename`, `language` display labels, `lineNumbers: boolean = true`, `focus: number[] = []` (one-based lines). Fence language controls actual highlighting.              |
| `Callout`         | `kind: 'definition' \| 'assumption' \| 'limitation' \| 'risk' \| 'insight'` (insight default), optional `title`; default slot holds content. Kind is text-labeled as well as colored.                                                                  |
| `Takeaway`        | Optional `label = 'Takeaway'`; default slot is the core message.                                                                                                                                                                                       |
| `GlossaryTerm`    | Required `term`, `definition`; optional reference `source`. Native title tooltip plus a permanently visible definition, including print and keyboard use.                                                                                              |

Example:

```md
<Cite id="shannon1948" />

<Equation id="information" label="Information">

\[
I(p) = -\log_2 p
\]

</Equation>

See <EquationRef id="information" />.
```

Both specification delimiters `\(...\)` / `\[...\]` and native `$...$` /
`$$...$$` work. The preparser adapts delimiters outside code; leave blank lines around
block math inside component slots. KaTeX runs with `trust: false` and errors enabled.
Use `aligned` line breaks and optionally `compact` for long expressions, as in
`slides/07b-long.md`. Keep mathematical meaning intact when choosing line breaks;
there is no automatic formula rasterization or unreadable shrink-to-fit.

Use Slidev `v-click` on formula steps as in `slides/13-steps.md`. Slidev owns the
click lifecycle and final PDF state; InteractiveReveal adds reusable motion presets.
All other scientific components are stateless except Figure's native dialog: Escape,
Close, clicking the dialog, or leaving the slide closes it. Re-entry starts closed.
Zoom controls/dialogs are omitted from export. Code focus and glossary definitions
remain visible in print. Existing reduced-motion rules apply throughout.

## Scientific validation and browser print

`npm run validate:references` and `npm run validate:assets` run the shared scientific
validator (both intentionally check the complete dependency graph). Unknown reference
keys, duplicate/missing equation IDs, unresolved equation references, invalid records,
missing/remote figures and invalid frontmatter fail with source diagnostics. The same
collector runs in Vite's build hook, so `npm run build` alone rejects those inputs.
`npm run test:pdf` generates a fresh PDF, checks page count, embedded math fonts and
representative extractable content. It requires Poppler utilities (`pdfinfo`,
`pdftotext`, `pdffonts`; on Debian/Ubuntu install `poppler-utils`). Use `pdftoppm` for
visual review. `npm run check` includes all these validations, production builds,
offline browser checks, print bounds, and figure reset tests.

For an emergency browser print, open `http://localhost:3030/?print=true#/print`, wait for fonts
and images, then print with background graphics, no browser headers/footers, and the
slide paper size. Print the appendix separately at port 3031 if required; the standard
PDF command combines it automatically. `output/smoke/browser-print.pdf` exercises the
native print route during browser tests. Review PDFs visually after content changes;
text/font assertions are regression signals, not a full visual fidelity proof.

## Visualization and interaction (Phase 3)

All new components are additive; Phase 1–2 public contracts remain unchanged.
Data types live in `types/visualization.ts`. Components accept plain data, never
fetch resources, and render semantic HTML or SVG. Keep labels short and split dense
data across slides; the smoke checks reject showcase overflow.

| Component             | Required props                                                                                                     | Optional props / behavior                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MetricCard`          | `label`, `value: string \| number`, `interpretation`                                                               | `unit`, `trend` are visible text, not color-only indicators.                                                                                                                                                                                                                                                                                                                                  |
| `ComparisonTable`     | `caption`, `columns: { key, label }[]`, `rows: { label, values: Record<string, string \| number> }[]`              | Missing cells show an em dash; headers use semantic scopes.                                                                                                                                                                                                                                                                                                                                   |
| `PipelineDiagram`     | `label`, `steps: { id, label, detail? }[]`                                                                         | Ordered HTML nodes and directional connectors.                                                                                                                                                                                                                                                                                                                                                |
| `ArchitectureDiagram` | `label`, `nodes: { id, label, detail?, x, y }[]`, `edges: { from, to, label }[]`                                   | `boundaries: { id, label, x, y, width, height }[] = []`, `legend`, `width = 800`, `height = 260`. Coordinates are SVG units; nodes are 120×46 centered at x/y. Arrange nodes to leave room for edge labels; unknown endpoints fail. Dashed labeled rectangles denote trust boundaries.                                                                                                        |
| `Timeline`            | `label`, `events: { id, date, label, detail? }[]`                                                                  | Dates are display strings; order follows input.                                                                                                                                                                                                                                                                                                                                               |
| `ProcessSteps`        | `label`, `steps: { id, label, detail? }[]`                                                                         | `sequential = false`, `startAt = 1`; sequential mode uses native Slidev clicks.                                                                                                                                                                                                                                                                                                               |
| `Chart`               | `type: 'bar' \| 'line' \| 'scatter' \| 'radar'`, `title`, `series: { name, points: { x, y, label, detail? }[] }[]` | `xLabel`, `yLabel`, `details = false`. Finite values required. Line/scatter use numeric x; bars follow input order, support negative values and a zero baseline. Radar requires matching labels/order, at least three nonnegative axes, and uses a shared zero-based scale. SVG labels/legends persist in PDF; optional native tooltips and a keyboard-accessible data table supplement them. |
| `ConfusionMatrix`     | `caption`, `labels: string[]`, `values: number[][]`                                                                | `details = true` adds native cell tooltips. Matrix must be square, finite, nonnegative; rows are actual, columns predicted. Counts, axis labels and shade legend remain visible.                                                                                                                                                                                                              |
| `QrLink`              | `href`, `label`                                                                                                    | Absolute HTTP(S)/mailto URL; generates SVG locally with a four-module quiet zone. Human-readable URL is always included. Opening the link may require internet; rendering never does.                                                                                                                                                                                                         |
| `InteractiveReveal`   | Default slot                                                                                                       | `at = 1` (absolute positive Slidev click), `motion = 'fade'`, `static = false`, `controls = true`. Reset steps returns the whole slide to its native `clicksStart`.                                                                                                                                                                                                                           |
| `ImageCompare`        | `before`, `after`, `beforeAlt`, `afterAlt`, `caption`                                                              | `beforeLabel = 'Before'`, `afterLabel = 'After'`, `initial = 50` (clamped to 0–100), `static = false`. Paths must be literal `/images/...` assets in Markdown. Both images should use the same aspect ratio. Keyboard slider and Reset comparison; PDF/static shows both complete images side by side.                                                                                        |

Example (blank lines allow Markdown inside a slot):

```md
<InteractiveReveal :at="1" motion="slide-up">

Evidence first; the final export preserves this explanation.

</InteractiveReveal>
```

Motion presets are `fade`, `slide-up`, `slide-left`, `scale-in`, `highlight`,
`draw-path`, and `stagger`, in `lib/motion.ts` and `theme/motion.css`. Vue Motion
animates transforms/opacity; CSS handles highlight, normalized SVG paths and stagger.
For draw-path, set `pathLength="1"` on each SVG path. Stagger acts on direct slot
children. Durations use `--duration-base` / `--duration-slow` in milliseconds;
`--motion-stagger` controls delays. Reduced-motion preferences, including changes
while presenting, stop transform animation and CSS effects; clicks remain usable.
Animation carries no exclusive information. Use `static` for an always-visible
reveal or comparison, and the native print route for screenshots of complete slides.

Slidev owns click state: forward entry starts at the initial step; backward entry
uses Slidev's final step, and direct URLs can select explicit click states. Reset
steps and reverse navigation are deterministic. No component persists custom state
across slides: image comparison returns to `initial`, chart details close, and motion
follows the native click context. Print/export shows all reveal content, omits controls
and details panels, and preserves both comparison images. Static hosting retains live
interaction; PDF contains the meaningful final state without JavaScript.

`slides/14-pipeline.md` through `slides/26-qr.md` cover the complete suite, including
all four chart types, seven motions, a reduced-motion status indicator and explicit
static fallbacks. `npm run test:smoke` checks the built main/appendix deck offline and
browser printing; `npm run test:interaction` checks clicks, reset, keyboard comparison,
slide re-entry, reduced motion and print final states. Both are in `npm run check`.
`npm run test:foundation` remains a compatible alias for the general smoke check.
