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

**Status:** Open; resolve in Phase 2. **Affected:** M-01, M-02, M-05, M-06, E-02.

The acceptance/example syntax uses LaTeX `\(...\)` and `\[...\]`, including inside
`Equation`. Confirm the chosen Slidev/KaTeX integration preserves this input through
Markdown and Vue processing. If adaptation is needed, document it rather than silently
requiring different author syntax. The general export discussion allows selective
rasterization, while M-02 specifically rejects screenshot formulas; preserve sharp
KaTeX output and verify formulas separately from optional rasterization of other visuals.

## DEC-04 — Citation example and reference collection boundaries

**Status:** Open; resolve in Phase 2. **Affected:** Q-01–Q-04, Q-07–Q-09, I-05.

Q-01 contains an empty alternative example. Q-07 explicitly names all three required
styles and author-year is the stated default; the empty example does not define a fourth
style. The spec does not define whether “used in the deck” includes excluded appendix
slides or how frontmatter citations and component citations are combined. Record
collection/order semantics, including stable numeric citations and source validation,
consistent with the resolved appendix/export policy.

## DEC-05 — Visual acceptance thresholds and optional aspect ratio

**Status:** Baseline established below; complete the broader review in Phase 4.
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

**Status:** Baseline established; full Phase 4 review remains open. Use a 980px-wide
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
