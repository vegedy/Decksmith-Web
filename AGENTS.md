# Decksmith Web

## Source of truth

`docs/SPEC.md` is the authoritative product and architecture specification.

Before implementing a task:
1. Read the relevant sections of `docs/SPEC.md`.
2. Read `PLAN.md`.
3. Inspect the existing implementation before changing it.

Do not silently weaken, reinterpret, or remove requirements from the specification.

## Engineering rules

- Keep the architecture based on Slidev, Vue 3, TypeScript, Markdown and Vite.
- Prefer simple solutions and existing Slidev/Vue capabilities over custom framework code.
- Do not build a custom slide engine.
- Keep presentation content separate from reusable framework components.
- Components must be generic and must not depend on one particular presentation.
- Prefer SVG for diagrams and visualizations that must export cleanly.
- Runtime presentation functionality must not depend on external services.
- Fonts, assets and presentation resources must work offline.
- Interactive components must provide a meaningful static/export state.
- Respect `prefers-reduced-motion`.
- Keep TypeScript strict and avoid `any` unless technically unavoidable and documented.
- Do not add dependencies without a concrete justification.

## Scope control

Implement only the current milestone from `PLAN.md`.

Do not implement future milestones opportunistically unless a minimal prerequisite is necessary for the current milestone.

Avoid speculative abstractions.

## Verification

After every milestone, run all checks applicable to that milestone.

At minimum maintain these commands:

- `npm run dev`
- `npm run build`
- `npm run check`
- `npm run export:pdf`

When additional tests or validation commands exist, include them in `npm run check`.

Never declare a milestone complete while its required validation is failing.

## Documentation

Keep these files current:

- `README.md`: user-facing setup and usage
- `PLAN.md`: milestone status and remaining work
- `docs/DECISIONS.md`: non-trivial architecture decisions
- `docs/REQUIREMENTS.md`: requirement-to-implementation traceability

When an implementation decision differs from an example in `docs/SPEC.md`, document why while preserving the actual requirement.

