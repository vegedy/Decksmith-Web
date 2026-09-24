# Architecture interpretation log

The architecture prescribed by `SPEC.md` is binding and is not restated here as a new
decision. No additional architecture decision has been adopted during planning.
The following interpretation questions remain open; none authorizes relaxing a requirement.
Record the resolution, rationale, affected IDs and validation evidence before implementing
the affected behavior. No unavoidable contradiction has yet been established.

## DEC-01 — Central configuration example is incomplete

**Status:** Open; resolve in Phase 1. **Affected:** A-05, D-02, D-04.

A-05 requires colors, fonts and footers in the central configuration, but the example
`DeckConfig` has only a theme selector and footer visibility flags, without color/font
values or footer content. Define how the central contract provides all required
settings and feeds theme tokens; document any extension to the example interface.
Do not treat the example as permission to omit the stated settings.

## DEC-02 — Appendix navigation and export membership

**Status:** Open; resolve in Phase 1, validate through export phases.
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

**Status:** Open; establish baseline criteria in Phase 1, complete in Phase 4.
**Affected:** D-05–D-08, IA-04.

“High contrast”, projector readability and usable narrow views have no numeric thresholds
or reference viewports. Record measurable evaluation criteria without replacing the
qualitative requirements. D-06 calls 4:3 optional, while the example configuration lists
both ratios; document the supported behavior without making 4:3 a new mandatory feature.
Reduced motion appears in Phase 4's checklist but is mandatory for animation: it must
already work when animation is introduced, with the full review in Phase 4.
