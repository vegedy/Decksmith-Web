# Architecture interpretation log

The architecture prescribed by `SPEC.md` is binding and is not restated here as a new
decision. Phase 1 resolutions are recorded below the original planning questions.
The original questions and their current statuses follow; none authorizes relaxing a requirement.
Record the resolution, rationale, affected IDs and validation evidence before implementing
the affected behavior. No unavoidable contradiction has yet been established.

## DEC-01 — Central configuration example is incomplete

**Status:** Resolved; see Phase 1 resolutions below. **Affected:** A-05, D-02, D-04.

A-05 requires colors, fonts and footers in the central configuration, but the example
`DeckConfig` has only a theme selector and footer visibility flags, without color/font
values or footer content. Define how the central contract provides all required
settings and feeds theme tokens; document any extension to the example interface.
Do not treat the example as permission to omit the stated settings.

## DEC-02 — Appendix navigation and export membership

**Status:** Resolved for Phase 1; later export coverage remains planned.
**Affected:** I-05, I-06, E-02, E-03.

I-05 excludes backup slides from the linear main talk while requiring navigation or
direct-link access. The example config also exposes `includeAppendix`, and E-02 requires
all standard slides in PDF. The spec does not define which slides count as standard,
default appendix inclusion, or how navigation and export selections interact. Document
these semantics and demonstrate them using Slidev extension points without a custom engine.

## DEC-03 — Formula input syntax and rendering fidelity

**Status:** Resolved in Phase 2; see resolutions below. **Affected:** M-01, M-02, M-05, M-06, E-02.

The acceptance/example syntax uses LaTeX `\(...\)` and `\[...\]`, including inside
`Equation`. Confirm the chosen Slidev/KaTeX integration preserves this input through
Markdown and Vue processing. If adaptation is needed, document it rather than silently
requiring different author syntax. The general export discussion allows selective
rasterization, while M-02 specifically rejects screenshot formulas; preserve sharp
KaTeX output and verify formulas separately from optional rasterization of other visuals.

## DEC-04 — Citation example and reference collection boundaries

**Status:** Resolved in Phase 2; see resolutions below. **Affected:** Q-01–Q-04, Q-07–Q-09, I-05.

Q-01 contains an empty alternative example. Q-07 explicitly names all three required
styles and author-year is the stated default; the empty example does not define a fourth
style. The spec does not define whether “used in the deck” includes excluded appendix
slides or how frontmatter citations and component citations are combined. Record
collection/order semantics, including stable numeric citations and source validation,
consistent with the resolved appendix/export policy.

## DEC-05 — Visual acceptance thresholds and optional aspect ratio

**Status:** Resolved in Phase 4; criteria and evidence below.
**Affected:** D-05–D-08, IA-04.

“High contrast”, projector readability and usable narrow views have no numeric thresholds
or reference viewports. Record measurable evaluation criteria without replacing the
qualitative requirements. D-06 calls 4:3 optional, while the example configuration lists
both ratios; document the supported behavior without making 4:3 a new mandatory feature.
Reduced motion appears in Phase 4's checklist but is mandatory for animation: it must
already work when animation is introduced, with the full review in Phase 4.

## Phase 1 resolutions (2026-09-24)

### DEC-01 resolution — explicit appearance contract

**Status:** Resolved for Phase 1. `types/deck.ts` extends the example with
`display.colors`, `display.fonts` and `display.footer`. The pre-parser supplies native
Slidev headmatter; app setup applies color/font tokens. Only the implemented
`academic-light` theme is selectable. Citation/source-footer settings remain explicitly
reserved for Phase 2, not silently implemented as no-ops with completion claims.
Fontsource packages provide local, licensed, lockfile-pinned font assets; the exact
`public/fonts` folder from the example is unnecessary because Vite bundles the imports.
Evidence: central-config tests, browser font checks and PDF font inspection.

### DEC-02 resolution — separate native appendix entry

**Status:** Resolved for Phase 1. Slidev 53's next/previous navigation advances through
all enabled slides; `skip` is not supported, and `disabled` removes direct access.
Use two native entries: main `slides.md`, optional `appendix.md`. `DeckLink` connects
them at fixed local dev ports and relative static URLs. Navigation remains entirely
Slidev-owned. The main entry's slides are standard slides and always exported.
`includeAppendix` defaults to true; PDF export generates an ignored combined import
manifest when enabled. Links become descriptive plain text in print/export, avoiding
localhost links in the PDF. Appendix slide numbering is independent on the website
and continuous in the combined PDF. Main/appendix separation also separates presenter
sessions. This is a deliberate deviation from a single-entry example, preserving I-05.

### DEC-05 baseline — readable fixed canvas

**Status:** Baseline retained and extended in Phase 4. Use a 980px-wide
Slidev canvas: 24px body text, 38px content headings, 60px title/section headings,
18px secondary labels and 14px footers. Normal and muted text target at least 4.5:1
contrast on the light canvas; primary headings exceed that baseline. Meaningful links
are underlined and optional slides are text-labeled. Review at 1440×900 and 390×844;
Slidev scales its canvas to fit a narrow viewport without changing slide order/layout.
Small portrait screens are a viewing compromise, not a promise of full projector-size
text. Optional 4:3 uses the same width with extra vertical space. No custom animations
are present; reduced-motion CSS is installed before later animation work.

### DEC-06 — CSS and public client type boundaries

**Status:** Adopted for Phase 1. Slidev imports its Tailwind reset without a CSS layer,
which overrides layered typography regardless of specificity. A narrow Vite transform
wraps only that reset in the `reset` layer; all Decksmith styling stays layered.
Slidev's client package exports raw TS and traverses internal files relying on private
build globals. `tsconfig.json` maps the public `useSlideContext` import to a small
local declaration of only the fields used here. Runtime imports remain untouched.
This prevents checking upstream internals while preserving strict checks for all local
TS/Vue sources. Browser tests verify current-page/total and export verifies print mode.
Recheck this boundary on Slidev upgrades; do not expand it to an untyped catch-all.

### DEC-07 — dependency and scope decisions

**Status:** Adopted for Phase 1. Dependencies are the specified toolchain, local fonts,
ESLint/Prettier (with compatibility config), Vue type checking and Slidev's documented
Playwright export dependency. The already-transitive Slidev parser is declared directly
for smoke checks. Node's test runner avoids another test framework. No charting,
citation, component-test or UI library is added.
`floating-vue` is overridden to 5.2.2 because 5.4.0 causes Slidev/Shiki's bundled
Twoslash client to throw `Failed to patch FloatingVue` even with Twoslash disabled.
The pinned version removes that observed runtime error; browser checks reject errors.
Known npm advisories in other upstream transitive features are recorded in validation;
no forced downgrade or unverified major override is applied.

Slidev 53's notes exporter also assumes a history-route URL and does not expose
`--executable-path`. The pre-parser selects native history routing only for the
`export-notes` process, while presentation/build remain hash-routed. Notes export
requires Playwright's matching browser. No custom PDF renderer is introduced.

## Phase 2 resolutions (2026-09-25)

### DEC-03 resolution — native math with delimiter adaptation

The preparser maps the specification's `\(...\)` and `\[...\]` to native
Slidev delimiters outside code examples. `Equation` is a typed semantic wrapper around
native math in its slot; `NotationTable` calls the same KaTeX renderer directly.
`setup/katex.ts` enables strict errors and disables trusted HTML commands. KaTeX HTML,
MathML and bundled fonts remain text/vector output in PDF, with no screenshots.
Long equations use explicit `aligned` breaks and an optional compact size. Native
Slidev click directives demonstrate formula sequencing without a Phase 3 subsystem.
The build-time equation registry assigns numbers in main/appendix order, rejects
missing/duplicate IDs and unresolved references, and supports forward references.
Evidence: `tests/science.test.ts`, scientific slides, browser/PDF checks.

### DEC-04 resolution — declarative collection across both entries

`data/references.yaml` implements the specification's typed model. The build collector
uses Slidev's resolved main and appendix slides, frontmatter citations followed by
literal component references. The manifest always includes both entries even when
appendix PDF output is disabled; this preserves IDs across the website, appendix and
PDF. It contains only used records. Literature is numbered first, assets next, each
in first-use order; duplicates share a number. Figure sources and image-type records
are collected separately; shared literature/asset use is allowed. Bibliographies
render all collected records by default with explicit pagination props for long lists.

Code examples/comments are excluded. Reference keys and Figure paths must be literal
attributes, not arbitrary Vue expressions. PascalCase and kebab-case are accepted.
This restriction enables build diagnostics; custom Vue-generated citations must be
predeclared in frontmatter. `citationStyle` avoids Vue's reserved `style` attribute.
The short-footnote style includes the stable number, author/year and short title;
full provenance stays in the bibliography. `showSourceFooters` controls automatic and
explicit source rows, independently of inline citations and Figure attribution.

### DEC-08 — dependencies, scope and static interactions

YAML, KaTeX and Vue compiler-dom were already installed through Slidev; they are now
declared directly at their existing locked versions because framework code imports
them. No new renderer or highlighting engine is added. CodeBlock decorates native
Slidev/Shiki output; NotationTable uses KaTeX. Poppler is an explicit Linux validation
prerequisite, not a presentation runtime dependency.

The user explicitly included GlossaryTerm in Phase 2, moving K-21 implementation
forward from Phase 4; broader catalog/accessibility review stays in Phase 4. Figure
uses a native modal dialog with keyboard dismissal, close/reset and slide-leave reset.
Glossary definitions remain visible, with native title tooltips as an additional aid.
Neither requires animation. Scientific styles use existing semantic tokens/layers.
No Phase 3 visualization or animation library has been implemented.

### DEC-09 — native browser print route

Slidev 53 normally only includes its print route in export mode or builds requesting
an automatic downloadable PDF; its dev route is otherwise absent. `vite.config.ts`
sets Slidev's existing `__SLIDEV_FEATURE_PRINT__` define to retain that native route
in dev/static builds without a second automatic export. The query `?print=true` is
required before the hash route to select final click states and suppress controls.
App setup supplies a CSS page size from the central aspect ratio for browser printing.
This is a narrow upstream integration boundary, like DEC-06: verify it on upgrades.
The native route, layout, slide rendering, click state and PDF pipeline remain Slidev's.

## Phase 3 resolutions (2026-09-25)

### DEC-10 — additive visualization scope and rendering

The user explicitly requested QrLink in Phase 3, bringing K-19 forward; other Phase 4
work remains unauthorized. Existing component contracts are preserved. HTML handles
cards, tables, pipelines, timelines, procedure steps and matrices; SVG handles charts,
architecture and QR. No Canvas or charting engine is necessary. Diagram coordinates
are explicit author data so trust boundaries and flow labels remain predictable in
export. Charts use numeric x/y points, labeled series and a common scale; radar inputs
must share axes. Author-provided details are optional; labels, values, axes and legends
carry the message without hover. Dense content requires author pagination, not silent
clipping or automatic font reduction.

`@vueuse/motion` is declared directly at the already-installed 3.0.3 version to use
the prescribed Vue Motion stack. `qrcode-generator` 2.0.4 is the only new runtime
package: a small local encoder avoids an external QR service or a bespoke error-
correction implementation. Vue renders the encoded module path as SVG without HTML
injection; URLs are validated and canonicalized. The printable quiet zone is explicit.

### DEC-11 — native clicks, local reset and static states

InteractiveReveal registers absolute click positions with native `v-click`; it does
not create a second step engine. Reset writes Slidev's writable click context back to
`clicksStart`. Forward entry, backward entry (final step) and explicit click URLs retain
native Slidev semantics. ProcessSteps delegates to these same reveals. Transient image
position and chart detail panels reset on native page changes, with no shared state or
implicit persistence. The public client declaration adds only `$clicks` and
`$clicksContext.clicksStart`, verified against the installed client and browser tests.

Vue Motion owns opacity/transform interpolation; CSS owns highlight, path drawing and
stagger. Reduced-motion changes stop active interpolation and disable CSS animation.
Static props and native print mode bypass animation. All reveal steps are shown in
print, slider controls disappear, and comparison renders complete before/after images
side by side. Chart detail tables are supplemental, so print retains the labeled SVG
and legend and omits the expandable panel. Screenshot callers select the native print
route for a complete static state. Live screenshots naturally capture the current step.

ImageCompare extends the existing build-time literal asset validation to both image
paths and requires descriptive alt strings and a caption in Markdown. Public-root
paths are consistent with Figure. Source data remains text and the new artwork is SVG.

## Phase 4 resolutions (2026-09-25)

### DEC-12 — theme and accessibility maturity

All three palettes are selected by central `defaultTheme`; `display.colors` is now
optional so selecting dark does not retain light overrides. Existing full override
objects still work. Local fonts and the existing grid are unchanged. The optional
4:3 canvas is supported at the same 980px width with greater height; no content is
silently shrunk to fit. Normal/semantic text colors target >=4.5:1 on both surfaces;
body/secondary/footer sizes retain DEC-05. Narrow screens use native Slidev scaling.
Browser checks verify names, focus outlines, native keyboard activation, descriptions,
all final layouts, local fonts and reduced motion. These are concrete acceptance
criteria, not a claim of comprehensive WCAG certification or physical projector testing.

GitHub-alert color CSS used an unlayered `--color-warning` that overrode the palette.
The Vite layer adapter now places those upstream color styles alongside the reset in
the low-priority layer; all theme palettes retain their semantic tokens. Print preserves
the chosen theme. `minimal-print` explicitly supplies white paper/monochrome ink.

### DEC-13 — exports and emergency package

PNG uses native Slidev export, always at the final animation state, with a one-based
single-slide selector or whole series. PDF retains its configurable native click export.
The emergency package rebuilds the static site and PDF, optionally exports all PNGs,
and copies the deployable files and instructions into a fresh directory. This directory
is the package (no archive dependency); it includes local licenses/fonts. A PDF viewer
works without JavaScript; the site uses a minimal HTTP server as allowed by E-04.
Unique output directories avoid stale images or partial overwrites of earlier packages.

### DEC-14 — reuse and final catalog

The starter CLI copies the full working showcase as editable examples with renamed
metadata/package identity; authoring only requires configuration, Markdown, bibliography
and assets. Destination overwrite is an error. No editor/backend or additional runtime
dependency is introduced. Agenda/QuestionSlide are stateless typed components. Existing
GlossaryTerm and QrLink retain their always-readable definitions/destinations.

The specification's `PipelineDiagram :nodes` string-array/`animated` example is
illustrative: the established API is `label` plus typed `steps` with IDs, labels and
optional details, while ProcessSteps/InteractiveReveal provide native-click sequencing.
This preserves process visualization and animation requirements without a second API.
The source scanner checks literal runtime dependencies; hyperlinks remain allowed.
Dynamically computed dependencies are covered by blocked-network browser checks.

The final visual review also found that Slidev's default code size was 12px despite
the surrounding secondary text tokens. The shared frame now binds native code size
to 18px and its line height to 1.5. Shiki uses bundled GitHub high-contrast light/dark
palettes; rendered token contrast and size are tested, and minimal-print renders
monochrome code. Line focus retains its explicit border without a contrast-reducing tint.
