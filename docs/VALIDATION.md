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

# Phase 3 validation

Recorded 2026-09-25 on the same Linux / Node 26.10.0 environment. Phase 3 preserves
all existing public component contracts and adds the requested visualization and
interaction suite, including user-requested QrLink. Phase 4 is not implemented.

## Commands and automated evidence

- Dependency installation passed: `@vueuse/motion` 3.0.3 (already transitive) is now
  direct; `qrcode-generator` 2.0.4 is pinned. npm reported 13 dependency advisories;
  no forced dependency upgrades were applied in this milestone.
- `npm run check` passed: strict Vue/TypeScript, ESLint, Prettier, 15 unit tests,
  both production builds, offline smoke and interaction suites, reference/asset
  validation, and a fresh 30-page PDF regression (29 main slides + one appendix).
- `npm run dev` started both entries; `SMOKE_URL=http://localhost:3030 npm run test:foundation` passed all 29 main slides and appendix navigation.
- `npm run build` and `npm run export:pdf` also passed independently. PDF has no
  JavaScript, retains selectable text and embedded KaTeX fonts, and includes all
  representative diagram/chart/reveal/comparison/QR content without controls.
- Browser smoke blocks external requests and rejects page errors, console warnings,
  failed images and content/footer overflow. It covers all main slides, appendix
  links, local fonts, narrow viewport and native browser print (29 pages).
- `npm run test:interaction` passes native forward/reverse clicks and reset, normal
  and reduced motion, all preset reveal steps, keyboard slider changes, explicit
  reset, slide re-entry, chart detail-panel reset, and complete print final states.
- Unit tests include negative/constant chart domains, invalid chart/radar inputs,
  QR URL validation/quiet zone and missing/dynamic ImageCompare asset diagnostics.
- Loopback servers and Chromium required execution outside this environment's sandbox;
  an initial sandbox `listen EPERM` was resolved using approved execution. No runtime
  service or network dependency was introduced. The Browser skill found no connected
  browser; repository Playwright/Chromium provided automated interaction and screenshots.

## Visual evidence

Inspected browser screenshots and Poppler-rendered PDF pages 15–28 covering every new
component: pipeline and process steps, trust boundaries/data flows, timeline/comparison
table, all four chart types, matrix/shade legend, metric context, complete reveals,
all motion vocabulary content, before/after static pairs and QR URL. Layout review
caught and corrected dense examples, radar label placement, chart legend spacing and overlapping live comparison labels
(the slider label supplies both names; static pairs retain individual labels);
all smoke bounds subsequently passed. The final PDF's reveal status explicitly says
static export, and no slider or reset controls appear in print.

Local ignored artifacts: `output/smoke/` (browser screenshots, motion/compare checks,
`browser-print.pdf`), `output/phase3-review/` (rendered pages/contact sheets), and
`output/decksmith-foundation.pdf`. Reproduce with `npm run check` and render with
`pdftoppm -png output/decksmith-foundation.pdf output/review`.

The QR was checked as an SVG with a quiet zone and visible URL; no physical camera
scan was performed. General accessibility/theme/aspect-ratio review, packaging and
starter workflows remain Phase 4 scope. Tests validate this bundled showcase; authors
must inspect new dense datasets and coordinate-based diagrams for their own layouts.
