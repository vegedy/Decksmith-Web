# Implementation plan

`docs/SPEC.md` is authoritative. **Phases 1–4 and the final requirements audit are complete and verified** (2026-09-25). Validation evidence is in `docs/VALIDATION.md`.
The repository began with documentation only.

## Planned architecture and boundaries

Slidev owns routing, navigation, click steps, slide state and export. Markdown content
and slide metadata feed Vue 3 components with strict TypeScript contracts. Vite builds
the static site. KaTeX renders mathematics; Shiki renders code. Semantic CSS custom
properties and layers define themes; CSS and Vue Motion provide reusable animation.
SVG is preferred for diagrams. Content, configuration, reference data, assets,
components, layouts and themes remain separate, following the specification's reference
structure where useful. All runtime resources are local; interactive content has a
meaningful static export state. No custom slide engine or external runtime services.

Requirements can span phases: the first phase establishes a capability and later phases
complete or validate it. The matrix in `docs/REQUIREMENTS.md` lists these relationships.
All 87 identified requirements are mandatory; optional behavior within a requirement
retains the qualification in the specification. Unnumbered phase deliverables, such as
the starter CLI and showcase, are tracked below without inventing new requirement IDs.

## Validation contract

The Phase 1 commands `npm run dev`, `npm run build`, `npm run check` and
`npm run export:pdf` are implemented and verified. All export, starter and validation commands described below are implemented.
`npm run check` must run strict type checking, ESLint, formatting checks and the production
build, plus every additional automated validation/test introduced in later phases.
Avoid recursive script wiring. Each phase runs the four baseline commands on Linux;
`dev` is a startup/render smoke check and is stopped afterward. Record results and
manual visual evidence before marking a phase complete. `npm install` is an additional
clean setup check. Installation may obtain dependencies; presentations must work offline.
Offline validation serves the built artifact using a minimal local HTTP server with
external network access disabled. Inspect PDFs and browser output visually, since a
successful process exit alone cannot establish readability or export fidelity.

## Phase 1 — Foundation

**Status:** Complete for the foundation scope (2026-09-24).

**Evidence:** `docs/VALIDATION.md`; `package.json`, `deck.config.ts`, `slides.md`,
`appendix.md`, `components/`, `layouts/`, `theme/`, `setup/`, `scripts/`, `tests/`.
All baseline checks passed, including offline browser inspection and six-page PDF export.
DEC-01/DEC-02 are resolved; DEC-05 has baseline thresholds. Shared requirement IDs
retain later-phase work in the traceability matrix.

**Scope:** Establish the empty, reusable offline deck template and its build/export
pipeline. No scientific component suite or interactive visualization suite yet.

**Affected IDs:** A-01–A-07; I-01–I-07; K-01, K-02, K-04, K-27;
D-01, D-02, D-04–D-08, D-10; E-01, E-02, E-04, E-06, E-09.
Some content/export IDs receive only foundational coverage here.

**Deliverables:**

- Slidev/Vue 3/TypeScript/Vite setup, documented Node/Linux prerequisites and dependency lockfile.
- Central `deck.config.ts` integrating metadata, appearance, export and citation settings;
  resolve DEC-01 before defining the public contract.
- Split Markdown content, declared slide metadata and appendix navigation strategy
  using Slidev; resolve DEC-02 before implementing appendix behavior.
- Generic typed `TitleSlide`, `SectionSlide`, `TwoColumn`, `AppendixMarker` and
  `default`, `title`, `section`, `two-column`, `appendix` layouts.
- Semantic tokens, CSS layers, local fonts (including math/code resources),
  `academic-light`, reusable grid and foundational responsive/projector styles.
- Static offline build, baseline PDF command and local quality command.
- README setup, configuration, template/fork workflow and export instructions;
  traceability links to actual files and evidence as work lands.

**Validation commands:** `npm install`; all four baseline commands.

**Acceptance criteria:** Clean Linux setup starts and renders the split deck; a fresh
copy changes only metadata/content/assets to become a new talk. Configuration controls
the promised settings, layouts stay generic, and appendix behavior meets I-05. The
baseline static artifact works offline and its PDF contains all baseline slides and
local fonts. Source inputs are Git-friendly text. Strict types, lint, formatting and
build pass in one command. This establishes baseline export fidelity, not completion
of later scientific/interactive export requirements.

## Phase 2 — Scientific foundation

**Status:** Complete (2026-09-25). **Depends on:** Phase 1.

**Evidence:** `docs/VALIDATION.md`; typed scientific components, `data/references.yaml`,
`lib/`, `scripts/science.ts`, `scripts/test-pdf.ts`, scientific Markdown slides and tests.
DEC-03/04 are resolved; DEC-08/09 document scope and print integration.
All Phase 2 commands and browser/PDF inspections pass. GlossaryTerm is included at
the user’s explicit request; broader Phase 4 catalog review remains planned.

**Scope:** Mathematical content, citations, scientific content components, input
validation and print fidelity. Formula sequencing must remain compatible with Phase 3.

**Affected IDs:** I-01, I-02, I-06, I-07; M-01–M-07; Q-01–Q-09;
K-03, K-11–K-18, K-21 (user-authorized early implementation); D-09; E-01, E-02, E-06–E-09.

**Deliverables:**

- `Equation` with numbering/references, `NotationTable`, KaTeX configuration and
  examples covering the specified mathematical notation and long formulas.
- Central bibliography in YAML or BibTeX, typed reference records, `Cite`,
  `SourceFooter`, `ReferencesSlide`, deduplicated used-reference collection,
  all three citation styles and separate asset-source reporting.
- `Figure` with accessible caption/source/license/zoom, Shiki-backed `CodeBlock`,
  `Callout`, `Takeaway` and user-requested `GlossaryTerm`, each with documented typed props.
- Reference and asset validators, print CSS and browser print fallback;
  PDF regression examples for formulas, text, images and sources.
- Initial scientific smoke deck, expanded to full E-08 coverage in Phase 3.

**Validation commands:** All baseline commands; add `npm run validate:references`,
`npm run validate:assets` and `npm run test:pdf` and include them in `npm run check`.

**Acceptance criteria:** Inline/block formulas, matrices and other M-07 constructs
render correctly, long equations fit, equation references resolve and formula steps
can be shown sequentially. Citations support author-year, numeric and compact footnote
styles, collect only used entries without duplicates, and retain optional provenance.
Invalid reference/asset fixtures yield observable diagnostics; missing images/imports
cannot pass unnoticed. Export regression checks plus visual inspection show sharp
formulas, complete sources and readable images without interactive chrome. PDF content
remains useful without JavaScript. Resolve DEC-03/DEC-04 before affected parser work.

## Phase 3 — Visualization and interaction

**Status:** Complete (2026-09-25). **Depends on:** Phase 2.

**Evidence:** Additive typed components, `types/visualization.ts`, `lib/chart.ts`,
`lib/motion.ts`, `lib/qr.ts`, `composables/interaction.ts`, motion/visualization CSS,
showcase slides 14–26 and browser/PDF regression checks. DEC-10/11 record scope,
native click lifecycle and static-state semantics. `npm run check`, production builds,
offline interactive/static browser checks and 30-page PDF export pass; visual evidence
is recorded in `docs/VALIDATION.md`. QrLink is included at the user’s
explicit request; no other Phase 4 feature is included.

**Scope:** Generic diagrams, charts, interaction and reusable animation with explicit
lifecycle and export behavior. Reduced motion is required as animation is introduced.

**Affected IDs:** I-02, I-06, I-07; M-06; K-05–K-10, K-20, K-24–K-26;
IA-01–IA-10; E-02, E-03, E-06, E-08.

**Deliverables:**

- Typed `MetricCard`, `ComparisonTable`, `PipelineDiagram`, `ArchitectureDiagram`,
  `Timeline`, `ProcessSteps`, `Chart`, `ConfusionMatrix`, `InteractiveReveal`, `ImageCompare`, user-requested `QrLink`.
- All four required chart types; labels, legends and optional details/tooltips;
  architecture data flows and trust boundaries.
- Central `fade`, `slide-up`, `slide-left`, `scale-in`, `highlight`, `draw-path`,
  `stagger` patterns built on Slidev steps, Vue Motion and CSS.
- Reduced-motion behavior, reproducible reset, documented slide transition lifecycle,
  and meaningful final/static states for every interactive component.
- Full E-08 smoke deck combining formula, source, image, diagram, animation and interaction.

**Validation commands:** All baseline commands; scientific validators and PDF tests;
add `npm run test:interaction` and `npm run test:smoke` to `npm run check`.

**Acceptance criteria:** Components accept generic data and work offline. All specified
animation patterns function and honor reduced motion. Reset and slide re-entry produce
defined state, with persistence only when explicit. Disabling/skipping animation leaves
the message understandable. Browser/PDF comparison confirms the relevant final content
and static fallbacks. Each required chart type and interactive component has a smoke
example and documented typed props; the complete smoke deck builds and exports.

## Phase 4 — Maturity

**Status:** Complete (2026-09-25). **Depends on:** Phase 3.

**Evidence:** `docs/VALIDATION.md` (Phase 4), `docs/COMPONENTS.md`,
`theme/variants/`, `scripts/accessibility.ts`, `scripts/test-themes.ts`,
`scripts/export-png.ts`, `scripts/export-emergency.ts`, `scripts/new-deck.ts`.
All six theme/ratio builds and PDFs pass; the clean generated-deck walkthrough
passes the complete suite without framework edits. DEC-12–14 record final choices.

**Scope:** Complete the component catalog, theme suite, packaging, accessibility and
reuse workflow. No editor, backend, accounts or cloud features.

**Affected IDs:** A-01–A-07; I-04–I-07; K-01–K-27 (catalog review), with
K-22–K-23 newly delivered and K-19/K-21 reviewed; D-01–D-10; IA-04–IA-06; E-01–E-10.

**Deliverables:**

- `QuestionSlide`, `Agenda`; review Phase 2 `GlossaryTerm` and Phase 3 `QrLink`; complete documented component showcase.
- `academic-dark`, `minimal-print`, layout variants and verification across aspect
  ratios, projector display and narrow browser widths. Preserve the optional status of 4:3.
- Accessibility/contrast checks and full reduced-motion/export review.
- Individual-slide PNG and image-series exports, emergency package containing the
  static site and PDF, with optional images.
- Starter CLI (`npm run new:deck -- --name seminar-ml`) and documented template/fork path.
- Completed README workflows and requirement evidence. An optional external-resource
  scanner may support E-09; known external runtime dependencies are still prohibited.

**Validation commands:** All baseline commands and existing validators/tests;
`npm run export:png -- --slide 1`; `npm run export:png` (series);
`npm run export:emergency`; `npm run new:deck -- --name acceptance-deck`;
add `npm run test:accessibility` and packaging/starter validation to `npm run check`.
Run generated-deck setup/check/build/PDF commands in an isolated temporary directory.

**Acceptance criteria:** All three themes render the showcase readably with local fonts;
print hides controls. Keyboard-accessible interactions, contrast, non-color cues and
reduced motion are reviewed against documented criteria (DEC-05). PNG selection and
series work; the emergency package opens offline and contains the expected complete
PDF. A generated deck needs only configuration, content and assets changed; adding a
generic component/theme preserves existing slide formats. A timed template walkthrough
supports the specification's approximately 30-minute new-talk success criterion.

## Final requirements audit

**Status:** Complete (2026-09-25). **Depends on:** Phases 1–4.

**Evidence:** All 87 rows in `docs/REQUIREMENTS.md` link to concrete implementation
and validation. `docs/VALIDATION.md` records the fresh Linux install, full quality
suites in both source and generated repositories, offline emergency package, PDF/PNG
and notes/click-state variants, visual inspection and content-only authoring walkthrough.
No remaining mandatory implementation work; no unrelated features added.

**Scope:** Audit every numbered requirement and the unnumbered architecture, data
contracts, phase deliverables, non-goals and success criteria. This is verification and
closure of specified work, not a feature expansion phase.

**Affected IDs:** A-01–A-07; I-01–I-07; M-01–M-07; Q-01–Q-09;
K-01–K-27; D-01–D-10; IA-01–IA-10; E-01–E-10 (all 87).

**Deliverables:** Completed traceability with implementation paths and reproducible
validation evidence; resolved or explicitly documented specification questions;
clean-install, offline, export and template walkthrough records; final usage documentation.
Defects return to their owning phase and are fixed/revalidated before closure.

**Validation commands:** `npm install`; all baseline commands; every validation/export/
starter command introduced above, including a clean generated-deck check. Review
`npm run check` to ensure it includes every added automated validation command.

**Acceptance criteria:** Every requirement has evidence against its full specification
acceptance criteria; no mandatory requirement is waived or marked done based only on
planning. All required checks pass on Linux. Visual inspection confirms text, math,
fonts, graphics, sources and final states in all outputs. The offline artifact and
emergency package work without external services. No unresolved conflict undermines
conformance. README, plan, decisions and traceability match the delivered repository.
