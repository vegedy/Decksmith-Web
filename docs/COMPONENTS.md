# Component showcase index

The [README](../README.md) documents every typed prop, slot and interaction contract.
Nested data contracts are in [visualization types](../types/visualization.ts) and
[science types](../types/science.ts). The editable showcase uses the following sources.
All examples are validated in all three themes and both aspect ratios; PDF and PNG
use native Slidev final states. Components contain no talk-specific content.

| Requirement | Implementation / typed props                                 | Editable showcase source                                                                 |
| ----------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| K-01        | [TitleSlide](../components/TitleSlide.vue)                   | `slides.md (title layout)`                                                               |
| K-02        | [SectionSlide](../components/SectionSlide.vue)               | `slides/03-section.md (section layout)`                                                  |
| K-03        | [Takeaway](../components/Takeaway.vue)                       | `slides/06b-notation.md`, `slides/08-figure.md`, `slides/10-citations.md`                |
| K-04        | [TwoColumn](../components/TwoColumn.vue)                     | `slides/04-content.md (two-column layout)`                                               |
| K-05        | [MetricCard](../components/MetricCard.vue)                   | `slides/21b-metric.md`                                                                   |
| K-06        | [ComparisonTable](../components/ComparisonTable.vue)         | `slides/16-timeline.md`                                                                  |
| K-07        | [PipelineDiagram](../components/PipelineDiagram.vue)         | `slides/14-pipeline.md`                                                                  |
| K-08        | [ArchitectureDiagram](../components/ArchitectureDiagram.vue) | `slides/15-architecture.md`                                                              |
| K-09        | [Timeline](../components/Timeline.vue)                       | `slides/16-timeline.md`                                                                  |
| K-10        | [ProcessSteps](../components/ProcessSteps.vue)               | `slides/14-pipeline.md`                                                                  |
| K-11        | [Equation](../components/Equation.vue)                       | `slides/06-math.md`, `slides/07-notation.md`, `slides/07b-long.md`, `slides/13-steps.md` |
| K-12        | [NotationTable](../components/NotationTable.vue)             | `slides/06b-notation.md`                                                                 |
| K-13        | [Cite](../components/Cite.vue)                               | `slides/10-citations.md`                                                                 |
| K-14        | [SourceFooter](../components/SourceFooter.vue)               | `slides/10-citations.md`                                                                 |
| K-15        | [ReferencesSlide](../components/ReferencesSlide.vue)         | `slides/11-references.md`, `slides/12-assets.md`                                         |
| K-16        | [CodeBlock](../components/CodeBlock.vue)                     | `slides/09-code.md`                                                                      |
| K-17        | [Callout](../components/Callout.vue)                         | `slides/09-code.md`                                                                      |
| K-18        | [Figure](../components/Figure.vue)                           | `slides/08-figure.md`                                                                    |
| K-19        | [QrLink](../components/QrLink.vue)                           | `slides/26-qr.md`                                                                        |
| K-20        | [InteractiveReveal](../components/InteractiveReveal.vue)     | `slides/22-reveal.md`, `slides/23-motion.md`, `slides/25-static.md`                      |
| K-21        | [GlossaryTerm](../components/GlossaryTerm.vue)               | `slides/09-code.md`                                                                      |
| K-22        | [QuestionSlide](../components/QuestionSlide.vue)             | `slides/05-close.md`                                                                     |
| K-23        | [Agenda](../components/Agenda.vue)                           | `slides/02-agenda.md`                                                                    |
| K-24        | [ImageCompare](../components/ImageCompare.vue)               | `slides/24-compare.md`, `slides/25-static.md`                                            |
| K-25        | [ConfusionMatrix](../components/ConfusionMatrix.vue)         | `slides/21-matrix.md`                                                                    |
| K-26        | [Chart](../components/Chart.vue)                             | `slides/17-bar.md`, `slides/18-line.md`, `slides/19-scatter.md`, `slides/20-radar.md`    |
| K-27        | [AppendixMarker](../components/AppendixMarker.vue)           | `slides/05-close.md`                                                                     |

`EquationRef`, `DeckLink` and `DeckFrame` are supporting components documented in the
README. `default`, `title`, `section`, `two-column` and `appendix` layouts share the
same semantic frame/grid. Compose content through slots; keep the default font sizes
and split dense content over slides instead of shrinking it. Images belong in
`public/`, bibliography in `data/`, and prose in Markdown.

A new component can be added to `components/` with typed props and slots without
changing existing slides. Add a Markdown example, a meaningful static state and
explicit reset behavior when interactive. A new theme should add semantic token
values and extend the central theme union/stylesheet imports; existing theme names
and slide formats remain stable. No new navigation engine is required.
