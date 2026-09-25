# Phase 1 validation

Recorded 2026-09-24 on Linux x86_64, Node 26.10.0, npm 12.1.0,
Slidev 53.0.0 / Vue 3.5.43 / Vite 8.3.1. The declared minimum Node version is
22.12.0; this session did not independently run that minimum version.

## Reproduce

```sh
npm ci
npm run check
npm run dev
npm run export:pdf
```

Browser commands need Chromium and loopback ports. In this environment those operations
required execution outside the restricted sandbox. Both system Chromium 153 and
Playwright's matching browser are supported as described in README. No external service
is needed to display the built deck.

## Evidence

| Check                                         | Result / evidence                                                                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial empty-project dependency installation | `npm install` succeeded; exact dependencies and `package-lock.json` recorded in the repository                                                                                            |
| Type checking                                 | `npm run typecheck`: strict TS/Vue checks passed, including scripts and setup files                                                                                                       |
| Lint                                          | `npm run lint`: passed without warnings                                                                                                                                                   |
| Formatting                                    | `npm run format:check`: passed; source Markdown slides excluded to preserve Slidev syntax                                                                                                 |
| Unit tests                                    | `npm test`: config propagation, both appendix PDF selections, local resource settings, existing/missing/remote image fixtures passed                                                      |
| Production build                              | `npm run build`: main and appendix static sites built with local fonts, SVG and native KaTeX resources                                                                                    |
| Combined quality gate                         | `npm run check`: all of the above and browser smoke test passed                                                                                                                           |
| Development                                   | `npm run dev`: both localhost ports rendered; the browser smoke test also passed against port 3030, including appendix round trip                                                         |
| Offline production                            | `scripts/smoke.ts` served `dist` on loopback and blocked every nonlocal request; zero external requests, HTTP errors, JS errors or console warnings                                       |
| Navigation                                    | All five main pages rendered; advancing beyond the main talk did not open appendix; explicit appendix link and return link worked                                                         |
| Visuals                                       | Desktop screenshots of all five layouts, appendix and narrow portrait view inspected; no clipping/overlap in the baseline deck                                                            |
| Contrast                                      | Canvas/text 13.91:1, muted text 5.77:1, primary 8.34:1, calculated from central sRGB colors                                                                                               |
| Typography                                    | Browser asserted local Inter/JetBrains Mono loaded; `pdffonts` confirmed embedded Inter, JetBrains Mono and KaTeX fonts                                                                   |
| PDF                                           | `npm run export:pdf`: six pages, 16:9, metadata present, text extractable; all pages rendered with Poppler and visually inspected; progress hidden and cross-deck links become plain text |
| Reproducibility                               | Two consecutive production builds with identical inputs produced matching sorted SHA-256 manifests for every file in `dist`                                                               |
| Optional output settings                      | Isolated copy exported a five-page 4:3 main-only PDF plus a notes PDF; metadata, dimensions, speaker-note text, embedded fonts and representative rendered pages checked                  |
| Template reuse                                | Isolated copy in `/tmp/decksmith-acceptance`: changed only central metadata, optional 4:3 and Markdown content; full check passed using a copy of the locked installed dependencies       |

Screenshots and PDF are reproducible ignored artifacts under `output/`; sources and
validation scripts are tracked. The optional appendix baseline includes a native inline
formula to exercise local KaTeX assets; this is not the Phase 2 mathematics suite.

## Phase 1 limits and follow-up (historical)

- Static hosting means a local HTTP server; `file://` is not a supported deployment.
- Narrow portrait viewing retains Slidev's scaled canvas. Detailed accessibility,
  projector and theme reviews remain Phase 4 work.
- Literal image checks use Slidev's image extraction. Dynamic component assets and
  citations require the fuller Phase 2 validators; no completeness claim is made for them.
- Citation rendering, equation APIs, scientific components and interactive libraries are
  unimplemented. Phase 1 success does not complete requirements shared with later phases.
- PDFs have metadata timestamps and are not claimed to be byte reproducible. The
  static build is the reproducibility target.
- `npm audit` reported 13 upstream dependency advisories (10 high, 1 moderate, 2 low),
  chiefly through unused Mermaid/Chevrotain, Monaco and PPTX dependencies. The reported
  root packages include `lodash-es`, `dompurify` and `image-size`. The suggested fix
  changes Slidev versions; no forced downgrade or untested major override was applied.
  Reassess upstream patches before enabling those features. This record does not claim
  an advisory-free dependency graph.

## Phase 2 — Scientific foundation (2026-09-25)

Phase 2 is complete. Phase 1 architecture is retained; Phase 3 remains unimplemented.
Same Linux/Node/Chromium environment as Phase 1. Three existing transitive dependencies
are now direct/pinned: YAML 2.9.1, KaTeX 0.18.9, Vue compiler-dom 3.5.43.
Poppler provides PDF regression inspection. `npm install` completed; the existing
13 upstream advisories remain unchanged.

| Check              | Result / evidence                                                                                                                                                                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development        | `npm run dev` started both native entries on ports 3030/3031; `SMOKE_URL=http://localhost:3030 npm run test:foundation` passed; servers stopped afterward.                                                                                                                                                             |
| Full quality gate  | `npm run check`: strict types, lint, formatting, unit fixtures, both production builds, offline browser/print tests, reference/asset validators, fresh PDF regression.                                                                                                                                                 |
| Validators         | YAML schema, metadata, unknown/frontmatter keys, deduplication, asset separation, stable citation styles, forward/duplicate/missing equation IDs, dynamic-key rejection, code/comment exclusion, missing figures/imports. `tests/science.test.ts` and existing asset fixtures.                                         |
| Production/offline | 15 main slides plus one separately linked appendix. Both build entries render; fonts/images load with external requests blocked, zero console warnings/errors, no broken assets.                                                                                                                                       |
| Mathematics        | Both delimiter syntaxes; matrices/vectors, sums/indices, cases, probabilities, optimization and tensor indices. Long equations use aligned breaks/compact size. Native formula click and reverse-click checked; both formula steps appear in final PDF.                                                                |
| Scientific APIs    | Citation styles, automatic frontmatter source row, used-only literature, separate asset list, Equation/NotationTable/Figure/CodeBlock/Callout/Takeaway/GlossaryTerm all demonstrated. README documents typed APIs and constraints.                                                                                     |
| Figure lifecycle   | Native dialog opens, Escape closes, leaving slide closes and re-entry is reset; print omits dialog/buttons.                                                                                                                                                                                                            |
| PDF                | `npm run export:pdf` and `npm run test:pdf` produced 16-page combined PDF; text and math fonts embedded, expected scientific content extracted, no unused bibliography record or zoom chrome.                                                                                                                          |
| Browser print      | Native `?print=true#/print` route produces a 15-page main-only PDF, CSS page size follows aspect ratio; last-page blank regression fixed and page-count asserted.                                                                                                                                                      |
| Visual inspection  | All 16 exported pages rendered with Poppler and inspected, including close inspection of formulas/code. Sources, notation, figures, code focus, bibliography and final steps are present and legible. Browser tests inspect bounds of scientific blocks and math glyphs on every main slide in screen and print modes. |

Initial checks caught overflow on a crowded math slide and the figure slide, a reserved
Vue `style` prop collision, an unavailable native print route, and a trailing browser
print page. These are fixed; regression checks now cover each affected path. Poppler
may report a Type 3 glyph bounding-box warning for code-font ligatures; rendered code
and extracted content were inspected and remain readable.

Reproducible ignored artifacts: `output/decksmith-foundation.pdf`,
`output/smoke/slide-*.png`, `output/smoke/browser-print.pdf`, `output/pdf-review/`.
Scientific validator commands share one implementation intentionally. The Vite hook
also runs it on standalone builds. PDF tests export fresh output rather than reusing
an earlier successful artifact. Visual inspection complements content/font/bounds
checks; no pixel-identical or arbitrary-deck layout guarantee is claimed.

Remaining boundaries: long bibliographies need explicit pagination; long formulas need
semantic author-selected line breaks. Dynamic IDs/paths on scientific components are
rejected; custom Vue-hidden references must be predeclared in frontmatter. Full Phase 3
interaction/visualization coverage and Phase 4 theme/accessibility/catalog audits remain
planned. The native print feature define is an upstream boundary to recheck on upgrades
(DEC-09). No later-phase requirement is waived.
