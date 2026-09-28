# Validation record

The independent final audit at the end of this file supersedes earlier blanket
completion claims. Prior phase sections are retained as historical records.

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

## Phase 4 — Maturity and final audit (2026-09-25)

**Result: complete.** All 87 requirements have implementation and validation evidence
in `REQUIREMENTS.md`; every required K-component has a typed API and editable example
in `COMPONENTS.md`. No mandatory requirement is waived. The six real theme/layout
builds and independent generated-presentation checks passed after the issues below
were fixed. No runtime dependency was added in this phase.

### Commands and results

- `npm install`: successful in the repository and a fresh generated directory using
  Node 26.10.0 on Linux. The existing lockfile is unchanged. Chromium was already
  installed locally; the documented explicit browser-install fallback remains valid.
- `npm run dev` plus `SMOKE_URL=http://localhost:3030 npm run test:foundation`:
  both main and appendix start and render; all 29 main slides, native links, local
  fonts and assets pass with external requests blocked. Servers were stopped afterward.
- `npm run check`: **exit 0**, as did the complete check in the independently installed
  generated deck. Includes strict Vue/TypeScript, ESLint, Prettier, **17 passing unit
  tests**, resource scanning, production main/appendix builds, scientific validators,
  browser smoke, interactions, PDF regression, accessibility, packaging and six-theme
  validation. No browser warnings, errors, failed resources or external requests.
- `npm run export:pdf` / `test:pdf`: **30 pages** (29 main + one appendix), selectable
  scientific content, embedded Inter and KaTeX, complete bibliography and SVG diagrams.
  Formula steps/reveals are final; comparison panels show both images; controls omitted.
- `npm run export:png -- --slide 1`: one image. `npm run export:png`: **30 images**.
  Manifests record slide numbering and final-state behavior. The packaging regression
  exercises both paths and checks the file counts. A fresh directory prevents stale pages.
- `npm run export:emergency -- --images`: fresh website, appendix, configured PDF,
  instructions and all PNGs. Packaged website passed the full offline smoke separately.
  `npm run export:emergency` without images also passed in the isolated variant fixture.
- Main-only, click-step PDF variant: **40 pages**, with `includeAppendix: false` and
  `renderFinalAnimationState: false`. Speaker-notes export with `includeNotes: true`
  produced the notes PDF; adding an actual comment note and extracting PDF text verified
  “Acceptance speaker note: explain the central scientific question.” The no-image
  emergency variant also included its notes companion.
- `npm run new:deck -- --name acceptance-deck`: created the default destination under
  `output/decks/`. `--output /tmp/decksmith-phase4-release` was independently installed,
  edited and fully checked. Existing destinations are rejected; no shared source files
  or dependencies are required by generated presentations.

### Six themes/layouts and accessibility

`test:themes` creates an isolated working copy, copies local installed dependencies
without Vite caches (preserving relative executable symlinks), then configures and
builds each combination. It runs offline browser smoke, accessibility, print bounds
and fresh PDF regression for **academic-light, academic-dark, minimal-print × 16:9, 4:3**.
Each output contains all 30 PDF pages with the expected fonts. All native print routes
pass footer/right-edge bounds. Browser views at 1440×900 and 390×844 retain the native
Slidev composition. Evidence: `output/themes/<theme>-<ratio>/showcase.pdf` and `smoke/`.

Every normal/semantic text token is tested at >=4.5:1 against canvas and surface.
Rendered Shiki tokens also pass >=4.5:1 and >=18px. Controls have accessible names,
visible outlines and programmatic keyboard focus; Enter activates buttons/details;
the existing interaction suite tests arrow-key slider changes, reset and re-entry.
Figure Escape dismissal, live/print alternatives, image descriptions, reduced-motion
and complete reveal/comparison print states pass. Agenda progress is text-labeled;
charts, metrics and matrix cells carry labels/values independently of color.
These tests implement the documented acceptance criteria; they are not a general
WCAG certification or a physical projector measurement.

Visual review used Poppler-rendered PDF pages, browser screenshots and full-deck
contact sheets. All 30 pages of the light and dark 16:9 decks and minimal-print 4:3
were reviewed, with additional chart views in the other three combinations and
full-size code slides in light/dark. Text, math, source footers, tables, chart labels,
QR quiet zone, static comparisons and closing/appendix layouts are readable and fit.
4:3 deliberately adds vertical breathing room rather than stretching the graphics.
Contact sheets and detailed views are in `output/review/`; no clipped/overlapping
content or interactive chrome was observed. The previously small code was corrected
and its latest export re-inspected.

### Fresh presentation walkthrough

The final walkthrough ran from approximately **11:32–11:36 UTC**, after framework
fixes, in `/tmp/decksmith-phase4-release`:

1. Generate `acceptance-deck`; run a fresh `npm install` with the lockfile.
2. Change title/export name, author, subtitle and footer in `deck.config.ts`.
3. Edit the agenda Markdown into a scientific question with inline `p = 1/2` math,
   `<Cite id="shannon1948" />`, a labeled three-step `PipelineDiagram`, and a Takeaway.
4. Run `npm run dev` and the development browser smoke, including appendix navigation.
5. Run the complete `npm run check`: static builds, all PDF/PNG/emergency paths,
   all six theme/ratio builds and the scientific/interactive checks pass.
6. Compare every file under components/layouts/setup/theme/lib/composables/scripts/types
   to the source repository: **identical**. Only configuration and Markdown were edited.

This supports the approximately 30-minute template success criterion for an existing
story and installed/cached toolchain. Network installation time and writing an original
scientific talk are not asserted to fit that time. The generated deck retains editable
examples and can be reduced/reordered through its Markdown import manifest.

### Defects found and fixed during acceptance

- Upstream unlayered GitHub-alert colors overrode the semantic warning token; their
  color CSS now enters the existing low-priority reset layer.
- Native Slidev code styling forced 12px text. The shared frame now binds native code
  variables to 18px and 1.5 line height; high-contrast Shiki palettes replace low-contrast
  token colors. Minimal-print uses monochrome code and focus keeps a visible border.
- The theme fixture initially retained absolute executable symlinks/cached source paths;
  dependency copying now preserves relative symlinks and omits caches. Final matrix
  exports have no Vite allow-list/font errors. Embedded-font checks were strengthened.

The existing npm audit reports 13 upstream findings (2 low, 1 moderate, 10 high),
as in prior-phase dependency review. No unrelated dependency migration was made.
Optional speaker-note generation uses Slidev's bundled Chromium path as documented.
The website requires a minimal HTTP server (ES modules); the PDF opens directly offline.

## Independent final audit (2026-09-25)

**Audit performed; project acceptance remains open.** All 87 SPEC IDs were reviewed
individually: **86 verified**, **0 partially implemented**, **0 not implemented**,
**D-05 not verifiable in the current environment**. A projector/room/viewing-distance
review is still needed; software contrast and size checks passed. This corrects the
earlier statement that every mandatory requirement was fully verified.

### Fresh command evidence

Linux x86_64, Node 26.10.0, existing locked dependencies and locally installed Chromium.
The first sandboxed check passed through production build, then failed to bind its
loopback server (`listen EPERM`). The approved rerun outside that restriction exited 0.
No reproducible application failure occurred and no runtime change was required.

| Command / suite                                                           | Observed result                                                                                                                                                                                          |
| :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                                                             | Exit 0 against existing installation; lockfile unchanged. npm warned that Playwright install scripts were blocked; the existing browser worked. This was not a fresh-cache install.                      |
| `npm run dev` + `SMOKE_URL=http://localhost:3030 npm run test:foundation` | Both entries started; all 29 main slides and appendix round trip passed with external requests blocked; servers stopped after review.                                                                    |
| `npm run check`                                                           | Exit 0; full log copied to `output/final-audit/check.log`.                                                                                                                                               |
| `typecheck`, `lint`, `format:check`                                       | Passed inside full check; final documentation formatting checked separately after edits.                                                                                                                 |
| `npm test`                                                                | 17 passing Node unit tests; config, asset/reference failures, math syntax, citation styles, chart inputs, QR and remote-resource fixtures.                                                               |
| `npm run build`                                                           | Main and appendix production builds passed, including scientific/resource build hooks.                                                                                                                   |
| `test:smoke`, `test:interaction`, `test:accessibility`                    | Passed real Slidev component/browser checks, native steps/reset/re-entry, print fallback, reduced motion, local assets, contrast, names and focus. No separate component-mount test runner is installed. |
| `validate:resources`, `validate:references`, `validate:assets`            | Passed. One used literature record, one asset record and four equations resolved. Negative inputs tested by unit fixtures.                                                                               |
| `test:pdf` / PDF export script                                            | Fresh 30-page PDF passed count/text/font/chrome assertions; native browser print produced 29 main pages.                                                                                                 |
| `test:packaging` / PNG export script                                      | Single-slide selection produced one PNG; full-series path produced 30 PNGs and manifest.                                                                                                                 |
| `test:packaging` / emergency export script                                | Fresh site, appendix, PDF, README and 30 optional PNGs; independently served copied site passed blocked-network smoke.                                                                                   |
| `test:packaging` / starter script                                         | Standalone renamed source copied, framework files matched, existing destination rejected.                                                                                                                |
| `test:themes`                                                             | Six generated-deck builds: three themes × two aspect ratios; offline browser, accessibility and fresh 30-page PDF regression passed for each.                                                            |

PDF/PNG/emergency generation above ran the actual export scripts through the complete
suite, not cached-artifact checks. `package.json` exposes the same scripts as
`export:pdf`, `export:png` and `export:emergency`. Full independent generated-deck
installation and optional notes/click-state variants remain historical Phase 4
evidence; they were not repeated in this audit.

### Artifact and visual evidence

- `output/decksmith-foundation.pdf`: all 30 pages freshly rendered with Poppler to
  `output/final-audit/page-*.png`; all pages reviewed in three contact sheets.
  Text, formulas, sources, diagrams, charts, QR and final comparisons were present
  with no observed clipping/overlap or interactive export controls.
- Additional full-size review: structured math page 7 and dark-theme code page 10.
  Browser code/chart screenshots from all six configurations were reviewed together
  in `output/final-audit/theme-browser-review.png`. Other theme pages receive automated
  bounds/text/font checks in this run; earlier full theme visual reviews remain historical.
- `output/themes/<theme>-<ratio>/showcase.pdf` and `smoke/` contain fresh matrix evidence.
  `output/latest-png.json` and `output/latest-emergency.json` identify fresh export
  directories; emergency manifest and PNG counts were checked by the suite.
- Individual requirement evidence now lives in `REQUIREMENTS.md`, replacing repeated
  blanket labels. README now includes an exact add-slide/import example, directory
  map, coverage limits and the open projector verification item.

### Architecture and limitations

Reviewed components, composable lifecycle, libraries, setup/preparser, Vite integration,
export scripts, dependency declarations, CSS layers/tokens and content separation.
No custom navigation engine, talk-specific component logic, unnecessary direct
dependency, remote runtime service or uncontrolled persistent component state was found.
Inline bindings represent geometry/state or token-based intensity. Known upstream
Slidev adapters and example deviations remain documented in DEC-02/03/06/09/14/15.
The scientific validators intentionally share one dependency graph; they are aliases,
not duplicated configuration implementations.

Boundaries: no physical projector/camera tests or minimum-Node run; the website needs
a local HTTP server and JavaScript, while PDF needs neither. Dense formulas and
bibliographies need author-selected line breaks/pagination. Screenshot/contrast tests
do not establish universal accessibility. Conditional showcase interaction/PDF
assertions stop applying when their examples are removed; new content needs review.
The external-resource scan cannot prove every computed, unvisited runtime branch.
Historical upstream dependency advisories are recorded above; no fresh registry
security audit or dependency migration was part of this run.

## Kassendaten talk implementation · 2026-09-27/28

The authorized content task is implemented: **14 main slides, 900 seconds, four
appendix slides, eight cited sources and eight original architecture figures**.
`vortrag.md` is byte-identical to the supplied input. Its SHA-256 before/after is
`b98a50bb525a8b0c79855447fe64acd9a841afd767af8b7d6cce03dff8245965`.
The creation stand remains 27 September, when authoring began.

### Automated evidence

- `npm run check` passed in the working tree (exit 0): strict Vue/TypeScript,
  ESLint, formatting, six test files, resource/source/asset validation, production
  build, offline browser smoke, interaction, PDF, accessibility, starter/packaging,
  and all six theme/ratio combinations (three themes × 16:9/4:3).
- `npm run dev` started both Slidev servers. `SMOKE_URL=http://localhost:3030
npm run test:foundation` passed against the final development state, including
  main/appendix navigation. The linked appendix opens outside the main sequence.
- `npm run export:pdf` (also invoked by the suite) produced
  `output/weltweite-kassendaten.pdf`: **18 pages**, approximately 16:9,
  selectable text, embedded Inter and JetBrains Mono. Poppler reports every font
  embedded, subsetted and Unicode-mapped. The PDF also embeds symbol fallback fonts.
- All eight full bibliography titles and URLs were matched in extracted PDF text.
  No unresolved `src:` imports or literal Timeline markup remained. All 14 main
  slides have notes and positive budgets summing to 900, verified by the new test.
- Packaging validation successfully generated an 18-image PNG series, a selected
  single PNG, and the offline emergency package. Output pointers remain in
  `output/latest-png.json` and the existing emergency-package pointer.
- Restored the four archived files in `/tmp/kassendaten-showcase` and ran its
  full `npm run check` to exit 0, including **30-page showcase PDFs** and all six
  theme/ratio combinations. English defaults, science, interaction and component
  coverage remain intact. Original showcase slides/assets were not replaced.

Logs are retained under `output/kassendaten-validation/` (`check.log`,
`showcase-check.log`, `dev.log`, `browser-bounds.log`, `input.sha256`). The isolated
showcase predates the final content-only spacing edits and content test; the shared
component/localization code is identical to the tested restored copy.

### Visual evidence and corrections

All **14 main + 4 appendix** browser pages were captured and reviewed, with a separate
bounds pass on headings, paragraphs, lists, tables, code, figures and sources.
All **18 PDF pages** were rasterized by Poppler at 1200-pixel width and visually
inspected. Evidence: `output/kassendaten-browser/`, `output/smoke/` (final main
browser view) and `output/kassendaten-pdf-review/` (all PDF pages and extracted text).
Titles, arrows, region boundary, clean-topic labels, German text, sources and footer
spacing are readable in these outputs. The figures list and literature pages fit.
Final figure 1 explicitly shows one repeated regional stack, avoiding a misleading
shared global ingestion cluster. PDF page numbering includes the appendix (1–18);
browser navigation counts the main deck (1–14) and appendix (1–4) separately.

Visual review caught and repaired source/footer collisions, adjacent component markup
rendering as literal Timeline text, and the appendix formatter changing Slidev
separators. The appendix now uses a single stable entry pointing to an imported
slide bundle under `slides/`; no extra global formatting exclusion was needed.
The return link was moved to the first appendix page to satisfy navigation checks.

The in-app browser reported no available browser, so the project's local Chromium
workflow was used. Sandbox-blocked local ports/Poppler subprocesses were rerun with
explicit execution approval. An overlapping standalone PNG export was invalidated
by Vite reloads during emergency packaging; the suite's sequential PNG export
succeeded, and standalone export was rerun after the suite. No validation was disabled.

### Remaining external acceptance

D-05 physical projector readability remains open. The absent assignment sheet and
examination guide prevent formal rubric verification. The proposed architecture's
latency, availability, loss, retention and scaling assumptions require actual load,
failure and recovery tests; this deck provides no operational measurement evidence.

### Final bibliography polish · 2026-09-28

Short citations now have a visible separator space. Full reference titles receive a
terminal period only when the original title has no terminal punctuation. This leaves
the IBM question mark intact. `npm run check` passed again (exit 0), including all six
theme/ratio variants. Browser slide 4 and PDF bibliography page 16 were inspected after
the edit. The latest complete log is `output/kassendaten-validation/check.log`.

### Presentation pacing revision · 2026-09-28

The active talk now uses native Slidev click steps across slides 2–14, including
optional stepwise rendering in `PipelineDiagram`. `vortrag.md`, the 14 slide entries
and their 900-second total are unchanged. `npm run typecheck`, `npm run lint`,
`npm run format:check` and `npm run build` passed after the change. The complete
`npm run check` stopped at `npm test`: this system's Node 22.22.1 binary reports
`ERR_NO_TYPESCRIPT` for `--experimental-strip-types`. Browser click inspection and
PDF export remain unverified in this run: Chromium is absent and
`npx playwright install chromium` was denied by the network with HTTP 403.
Repeat the full check, live click/reverse review and PDF final-state inspection in
an environment with a TypeScript-enabled Node build and Chromium before presenting.

### Speech slide-change cues · 2026-09-28

`vortrag.md` now marks the transition to each of the 14 main slides. The cue for
slide 7 splits one paragraph after the regional clean-topic output; the spoken
wording is otherwise untouched. The earlier byte-for-byte SHA-256 comparison above
describes the original talk implementation before this authorized annotation.

### Speech and slide alignment · 2026-09-28

DEC-19 supersedes the earlier claim that `vortrag.md` still has its original
wording. Its 14 marked segments were checked against the active numbered slides.
The edge-agent segment no longer contains later regional and batch details.
The slides introduce the clean stream, central replication, Kafka Connect,
forecast training, operating measures and CAP in the same order as the speech.
The spoken CAP, Cassandra, latency and reproducibility passages received targeted
factual corrections. The main deck remains 14 slides and 900 seconds; the PDF
contains four appendix pages.

`npm run check` passes on Node 26.10.0 (exit 0), including type checking, lint,
formatting, unit tests, production build, browser smoke and interaction checks,
reference and asset validation, PDF regression, accessibility, packaging and
all theme variants. The current Chromium environment resolves the browser and
export limitation noted above. Final-state PNGs for changed slides 3–9 and
11–14 were inspected for content order, text fit, figures, citations and footer
spacing. PDF page 11 was inspected after the CAP reveal order changed. This is
screen/export evidence; the physical projector check D-05 remains open.
