# Requirement traceability

`SPEC.md` is authoritative; the labels below reproduce its requirement/component names.
All 87 requirements are **Planned**, with no implementation or validation evidence yet.
Phase numbers refer to `../PLAN.md`; all rows also belong to the Final requirements audit.
Multiple phases indicate introduction, completion or later validation, not duplicate implementations.
Acceptance criteria remain those in the specification. Replace pending evidence with concrete
implementation paths and validation records only after delivery; planning is not implementation.

| ID | Requirement / component | Phases | Planned validation | Status | Implementation / evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-01 | Das System muss vollständig lokal entwickelbar und ausführbar sein. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-02 | Das System muss als statische Website baubar sein. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-03 | Das Projekt muss aus einem Template/Fork für neue Vorträge startbar sein. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-04 | Der Kern muss erweiterbar bleiben, ohne bestehende Vorträge zu brechen. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-05 | Die Konfiguration eines Vortrags muss zentral erfolgen. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-06 | Der gesamte Quellcode und alle Inhalte müssen Git-fähig und textbasiert sein. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| A-07 | Das System muss Linux-tauglich sein. | 1, 4 | Clean Linux setup; offline build; configuration and template reuse review | Planned | Pending |
| I-01 | Folieninhalte müssen primär in Markdown gepflegt werden können. | 1, 2 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-02 | Einzelne Folien müssen Vue-Komponenten einbetten können. | 1, 2, 3 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-03 | Decks müssen in mehrere Dateien aufteilbar sein. | 1 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-04 | Folien müssen strukturierte Metadaten unterstützen. | 1, 4 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-05 | Ein Deck muss optionale Backup-/Appendix-Folien unterstützen. | 1, 4 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-06 | Decks müssen mehrere Zielausgaben unterstützen. | 1, 2, 3, 4 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| I-07 | Inhalte müssen ohne JavaScript lesbar bzw. exportierbar bleiben, soweit es das jeweilige Element zulässt. | 1, 2, 3, 4 | Markdown/metadata examples; navigation and browser/PDF review | Planned | Pending |
| M-01 | Inline- und Blockformeln müssen LaTeX-kompatibel unterstützt werden. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-02 | Formeln müssen in PDF-Exporten sauber und scharf erscheinen. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-03 | Gleichungen müssen nummerierbar und referenzierbar sein. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-04 | Formelnotationen müssen erklärbar sein. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-05 | Lange Formeln müssen lesbar umbrechen oder skalieren. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-06 | Formelanimationen müssen möglich sein. | 2, 3 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| M-07 | Formeln müssen für technische ML-/Data-Science-Themen geeignet sein. | 2 | Math fixtures; PDF regression and visual inspection | Planned | Pending |
| Q-01 | Quellen müssen direkt auf einer Folie zitierbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-02 | Quellen müssen zentral verwaltet werden. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-03 | Quellen müssen per Schlüssel referenzierbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-04 | Das Projekt muss eine automatisch erzeugte Quellenfolie unterstützen. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-05 | Bild-, Icon- und Diagrammquellen müssen separat erfassbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-06 | DOI, URL, Abrufdatum und Lizenz müssen optional speicherbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-07 | Quellen müssen in unterschiedlichen Stilen ausgebbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-08 | Quellen dürfen das visuelle Layout nicht dominieren. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| Q-09 | Fehlende Referenzen müssen im Build erkennbar sein. | 2 | Reference validator; citation style/collection fixtures; PDF review | Planned | Pending |
| K-01 | `TitleSlide` | 1, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-02 | `SectionSlide` | 1, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-03 | `Takeaway` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-04 | `TwoColumn` | 1, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-05 | `MetricCard` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-06 | `ComparisonTable` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-07 | `PipelineDiagram` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-08 | `ArchitectureDiagram` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-09 | `Timeline` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-10 | `ProcessSteps` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-11 | `Equation` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-12 | `NotationTable` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-13 | `Cite` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-14 | `SourceFooter` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-15 | `ReferencesSlide` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-16 | `CodeBlock` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-17 | `Callout` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-18 | `Figure` | 2, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-19 | `QrLink` | 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-20 | `InteractiveReveal` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-21 | `GlossaryTerm` | 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-22 | `QuestionSlide` | 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-23 | `Agenda` | 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-24 | `ImageCompare` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-25 | `ConfusionMatrix` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-26 | `Chart` | 3, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| K-27 | `AppendixMarker` | 1, 4 | Typed props and documentation review; component showcase; browser/static export inspection | Planned | Pending |
| D-01 | Das Design muss modern, zurückhaltend und wissenschaftlich-professionell wirken. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-02 | Das System muss ein tokenbasiertes Design-System verwenden. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-03 | Das System muss mindestens drei Themes unterstützen. | 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-04 | Die Schriftfamilien müssen lokal eingebunden sein. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-05 | Das Standarddesign muss für Projektoren geeignet sein. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-06 | Das System muss 16:9 priorisieren und 4:3 optional ermöglichen. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-07 | Das Design muss responsiv, aber nicht „mobile-first um jeden Preis“ sein. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-08 | Barrierearme Kontraste müssen als Standard gelten. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-09 | Das System muss eine Druckansicht besitzen. | 2, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| D-10 | Das System muss ein Grid-System für konsistente Folienlayouts definieren. | 1, 4 | Theme/layout showcase; offline fonts; viewport, contrast and print review | Planned | Pending |
| IA-01 | Folien müssen schrittweise Inhalte einblenden können. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-02 | Interaktive Komponenten müssen ohne externe Dienste funktionieren. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-03 | Animationen müssen deklarativ und wiederverwendbar sein. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-04 | Animationen müssen einen reduzierten Modus unterstützen. | 3, 4 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-05 | Interaktive Visualisierungen müssen einen statischen Fallback besitzen. | 3, 4 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-06 | Animationen dürfen die Kernbotschaft nicht voraussetzen. | 3, 4 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-07 | Nutzerinteraktionen müssen zurücksetzbar sein. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-08 | Diagramme müssen Tooltips oder Detailansichten optional erlauben. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-09 | Der Zustand interaktiver Komponenten darf nicht unkontrolliert zwischen Folien weiterleben. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| IA-10 | Es muss eine zentrale Animationsbibliothek geben. | 3 | Interaction/reset tests; reduced-motion and final-state export comparison | Planned | Pending |
| E-01 | Das Deck muss als PDF exportierbar sein. | 1, 2, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-02 | Der PDF-Export muss alle Standardfolien enthalten. | 1, 2, 3, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-03 | Der Export muss einen „finalen Animationszustand“ unterstützen. | 3, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-04 | Das Deck muss als statische Offline-Website exportierbar sein. | 1, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-05 | Es muss ein Screenshot-/PNG-Export für einzelne Folien geben. | 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-06 | Jeder Build muss auf Fehler geprüft werden. | 1, 2, 3, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-07 | Fehlende Assets müssen sichtbar fehlschlagen. | 2, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-08 | Das Projekt muss einen Demo-/Smoke-Test enthalten. | 2, 3, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-09 | Externe Ressourcen müssen vermieden oder explizit gekennzeichnet werden. | 1, 2, 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
| E-10 | Das Deck muss ein Notfallpaket erzeugen können. | 4 | Build/validator smoke checks; export artifact and offline inspection | Planned | Pending |
