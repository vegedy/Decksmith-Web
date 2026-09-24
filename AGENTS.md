# Decksmith Web

## Source of truth and scope

- `docs/SPEC.md` is authoritative. Before implementation, read its relevant sections,
  `PLAN.md`, and the existing implementation.
- Implement only the current authorized milestone; add future work only when it is a
  minimal prerequisite. Planning does not authorize starting Phase 1.
- Never silently weaken or remove requirements. Record conflicts and interpretations
  in `docs/DECISIONS.md`; document deviations from examples while preserving requirements.
- Avoid speculative abstractions and features outside the specification.

## Engineering

- Use Slidev, Vue 3, strict TypeScript, Markdown and Vite. Let Slidev own navigation,
  slide state, click steps and export; do not build a custom presentation engine.
- Prefer existing Slidev/Vue capabilities and simple solutions. Justify new dependencies.
- Separate deck content/data/assets from reusable components, layouts and themes.
- Components must be generic, documented and have typed props. Avoid `any` unless
  technically unavoidable and documented.
- Use semantic CSS tokens/layers; prefer SVG for exportable diagrams.
- Keep runtime functionality, fonts and resources offline-capable without external services.
- Give every interactive component a meaningful static/export state and defined reset/
  slide-transition behavior. Respect `prefers-reduced-motion` from the outset.
- Preserve text-based, Git-friendly sources and Linux development/build/export support.

## Validation and documentation

- From Phase 1, maintain `npm run dev`, `npm run build`, `npm run check` and
  `npm run export:pdf`.
- Run all applicable milestone checks. Include type checking, linting, formatting,
  production build and additional automated validations/tests in `npm run check`.
- Inspect visual/export results as well as command outcomes. Never mark a milestone
  complete with failing required validation or a requirement implemented without evidence.
- Keep `README.md` (setup/usage), `PLAN.md` (status/remaining work),
  `docs/DECISIONS.md` (interpretations) and `docs/REQUIREMENTS.md` (traceability) current.
