
# Spezifikation: Lokales Präsentations-Framework

## Ziel und Geltungsbereich

Diese Spezifikation beschreibt ein modulares, lokal ausführbares Web-Präsentationsframework auf Basis von Slidev, Vue 3 und TypeScript. Slidev stellt die Folien- und Exportinfrastruktur bereit; Markdown dient als primäres Inhaltsformat, Vue-Komponenten und CSS-Themes bilden die Erweiterungspunkte.

Das Framework richtet sich an technische und wissenschaftliche Vorträge. Es muss Formeln, Quellen, Visualisierungen, Animationen sowie lokale und reproduzierbare Exporte unterstützen. Version 1 umfasst die als **Muss** gekennzeichneten Anforderungen. **Soll**- und **Kann**-Anforderungen sind nachrangige Erweiterungen.

## Architektur

### Zielarchitektur

```text
Markdown/MDX-ähnliche Folieninhalte
            │
            ▼
Slidev als Präsentations- und Build-Engine
            │
            ├── Vue-3-Komponenten
            ├── TypeScript-Logik
            ├── KaTeX für mathematische Formeln
            ├── CSS Design Tokens + Themes
            ├── SVG / Canvas / HTML-basierte Visualisierungen
            ├── lokale Assets, Fonts und Quellen
            └── Vite Build-Pipeline
                     │
                     ├── lokale Entwicklungsumgebung
                     ├── statische Offline-Webseite
                     ├── PDF-Export
                     └── Bildexport / Handout-Artefakte
```

Inhalte werden überwiegend in lesbaren Markdown-Dateien gepflegt. Wiederverwendbare, visuelle oder interaktive Elemente werden als Vue-Komponenten implementiert. Inhalt, Komponenten und Theme-Regeln bleiben getrennt.

Vite ist hier sinnvoll, weil es eine sehr schnelle lokale Entwicklungsumgebung mit Hot Module Replacement und einen optimierten statischen Produktions-Build bietet. Statische Assets können in den Build eingebunden, gehasht und dadurch zuverlässig referenziert werden.

### Architekturbegründung

Eine eigene Präsentationsengine liegt außerhalb des Geltungsbereichs. Folienrouting, Tastatursteuerung, Druckansichten, Export, Klickschritte und Folienzustände werden durch Slidev bereitgestellt. Projektspezifische Funktionen werden über Themes, Layouts, Setup-Dateien und Vue-Komponenten ergänzt.

Slidev bildet die Präsentationsbasis. Komponenten, Themes und Layouts lassen sich direkt in das Deck integrieren; Animationen werden über Vue-basierte Mechanismen oder klickbasierte Schritte umgesetzt.

### Technologiestack

| Bereich | Entscheidung | Begründung |
| :-- | :-- | :-- |
| Präsentations-Engine | Slidev | Folienmodell, Navigation, PDF-/Bildexport, Presenter-Funktionen später verfügbar |
| UI-Framework | Vue 3 | Native Slidev-Integration, komponentenorientiert, reaktiv |
| Sprache | TypeScript | Typisierte Konfigurationen, Datenmodelle und wiederverwendbare Komponenten |
| Build | Vite | Schneller lokaler Dev-Server, statischer Offline-Build, Asset-Pipeline  |
| Content | Markdown + Vue SFCs | Schnelle Textpflege plus maximale Erweiterbarkeit |
| Formeln | KaTeX / LaTeX | Eingebaut, performant, technisch-wissenschaftlich geeignet  |
| Styling | CSS Custom Properties + CSS Layers | Theme-System ohne unnötige Runtime-Abhängigkeiten |
| Animation | Vue Motion + CSS | Deklarative Übergänge, schrittweise Erklärungen, reduzierte Bewegungsoption |
| Diagramme | SVG primär; Canvas optional | Scharf im PDF, gut druckbar, animierbar und zugänglich |
| Code | Shiki | VS-Code-nahe, TextMate-basierte Syntax-Hervorhebung  |
| PDF | Slidev/Playwright + Print-CSS-Fallback | Reproduzierbarer Export und Browser-Notfallweg |
| Validierung | TypeScript, ESLint, Prettier, lokale Build-Checks | Weniger Fehler kurz vor dem Vortrag |
| Hosting | rein lokal / statisch | Offline-fähig, datensparsam, ohne Cloud-Zwang |

## Konkrete Anforderungsliste

Die Prioritätsstufen definieren den Umsetzungsumfang: **Muss** ist für Version 1 verpflichtend. **Soll** bezeichnet nachgelagerte Funktionen. **Kann** kennzeichnet optionale Erweiterungen.

### Muss: Projektgrundlage

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| A-01 | Das System muss vollständig lokal entwickelbar und ausführbar sein. | `npm install` und `npm run dev` reichen aus; für die Präsentation ist kein Internet erforderlich. |
| A-02 | Das System muss als statische Website baubar sein. | `npm run build` erzeugt ein vollständiges, offline nutzbares Artefakt. |
| A-03 | Das Projekt muss aus einem Template/Fork für neue Vorträge startbar sein. | Ein neues Deck benötigt nur neue Metadaten, Inhalte und Assets; keine Änderungen an der Kernarchitektur. |
| A-04 | Der Kern muss erweiterbar bleiben, ohne bestehende Vorträge zu brechen. | Neue Komponenten und Themes können ergänzt werden, ohne bestehende Folienformate ändern zu müssen. |
| A-05 | Die Konfiguration eines Vortrags muss zentral erfolgen. | Titel, Autor, Institution, Datum, Farben, Fonts, Exportname, Verhältnis und Fußzeilen sind in einer Konfigurationsdatei definiert. |
| A-06 | Der gesamte Quellcode und alle Inhalte müssen Git-fähig und textbasiert sein. | Folien, Konfiguration, Quellen und Komponenten liegen nachvollziehbar im Repository; keine binären Projektdateien als zentrale Quelle. |
| A-07 | Das System muss Linux-tauglich sein. | Entwicklung, Build und Export funktionieren unter einer üblichen Linux-Distribution mit Node.js und Chromium/Playwright. |

### Muss: Inhaltsmodell

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| I-01 | Folieninhalte müssen primär in Markdown gepflegt werden können. | Text, Listen, Zitate, Formeln, Bilder und Folienmetadaten sind ohne UI-Editor editierbar. |
| I-02 | Einzelne Folien müssen Vue-Komponenten einbetten können. | Eine Folie kann Markdown mit `<PipelineDiagram />`, `<Citation />` oder `<MetricCard />` kombinieren. |
| I-03 | Decks müssen in mehrere Dateien aufteilbar sein. | Inhaltsfolien, Appendix und Quellen können separat organisiert und zentral eingebunden werden. |
| I-04 | Folien müssen strukturierte Metadaten unterstützen. | Kapitel, Titel, Layout, Quellen, Tags, Zeitbudget und Varianten sind pro Folie deklarierbar. |
| I-05 | Ein Deck muss optionale Backup-/Appendix-Folien unterstützen. | Backup-Folien sind nicht Teil des linearen Hauptvortrags, aber über Navigation oder Direktlink erreichbar. |
| I-06 | Decks müssen mehrere Zielausgaben unterstützen. | Mindestens Präsentationsansicht, PDF und statische Website entstehen aus derselben Inhaltsquelle. |
| I-07 | Inhalte müssen ohne JavaScript lesbar bzw. exportierbar bleiben, soweit es das jeweilige Element zulässt. | Text, Formeln, zentrale Grafiken und Quellen erscheinen im PDF vollständig. |

### Muss: Mathematische Formeln

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| M-01 | Inline- und Blockformeln müssen LaTeX-kompatibel unterstützt werden. | `\(x \in \mathbb{R}^n\)` und abgesetzte Gleichungen werden korrekt gerendert. |
| M-02 | Formeln müssen in PDF-Exporten sauber und scharf erscheinen. | Keine Screenshot-Formeln; mathematische Ausdrücke bleiben vektorbasiert bzw. hochauflösend. |
| M-03 | Gleichungen müssen nummerierbar und referenzierbar sein. | Eine Komponente wie `<Equation id="norm">…</Equation>` erlaubt Referenzen wie „siehe Gl. (1)“. |
| M-04 | Formelnotationen müssen erklärbar sein. | Eine `NotationTable`-Komponente stellt Symbole, Bedeutung, Datentyp bzw. Definitionsbereich dar. |
| M-05 | Lange Formeln müssen lesbar umbrechen oder skalieren. | Kein Überlaufen am Folienrand; bei Bedarf automatische kompakte Darstellung oder alternative Zeilenumbrüche. |
| M-06 | Formelanimationen müssen möglich sein. | Terme, Schritte oder markierte Subausdrücke können sequenziell eingeblendet bzw. hervorgehoben werden. |
| M-07 | Formeln müssen für technische ML-/Data-Science-Themen geeignet sein. | Matrizen, Vektoren, Summen, Indizes, Fallunterscheidungen, Wahrscheinlichkeiten, Optimierungsprobleme und Tensorindizes sind praktisch nutzbar. |

Slidev verwendet KaTeX für LaTeX und unterstützt sowohl Inline- als auch Blocknotation; die Konfiguration kann bei Bedarf in einer eigenen KaTeX-Setup-Datei erweitert werden.

### Muss: Quellen und wissenschaftliche Nachweise

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| Q-01 | Quellen müssen direkt auf einer Folie zitierbar sein. | Kurzbelege wie `(Geirhos et al., 2020)` oder `` können einheitlich platziert werden. |
| Q-02 | Quellen müssen zentral verwaltet werden. | Literaturdaten liegen in `references.yaml`, `references.json` oder BibTeX vor, nicht verteilt als Freitext in Folien. |
| Q-03 | Quellen müssen per Schlüssel referenzierbar sein. | `<Cite id="geirhos2020" />` erzeugt den konfigurierten Kurzbeleg. |
| Q-04 | Das Projekt muss eine automatisch erzeugte Quellenfolie unterstützen. | Alle im Deck verwendeten Referenzen können gesammelt, dedupliziert und formatiert ausgegeben werden. |
| Q-05 | Bild-, Icon- und Diagrammquellen müssen separat erfassbar sein. | Bildquellen werden als Bildmetadaten geführt und können auf einer Asset-Quellenfolie erscheinen. |
| Q-06 | DOI, URL, Abrufdatum und Lizenz müssen optional speicherbar sein. | Wissenschaftliche Paper, Webseiten, Abbildungen und Creative-Commons-Material können korrekt nachgewiesen werden. |
| Q-07 | Quellen müssen in unterschiedlichen Stilen ausgebbar sein. | Mindestens „Autor Jahr“, nummerisch und kompakte Fußnote sind umschaltbar. |
| Q-08 | Quellen dürfen das visuelle Layout nicht dominieren. | Kurzbelege sind dezent, aber lesbar; Vollbelege stehen gesammelt im Anhang bzw. Handout. |
| Q-09 | Fehlende Referenzen müssen im Build erkennbar sein. | Ungültige Zitationsschlüssel erzeugen einen Fehler oder mindestens eine deutliche Warnung. |

Der Standard-Zitationsstil ist Autor-Jahr. Kurzbelege erscheinen im Fließtext oder als Folienbeleg; vollständige Angaben werden zentral verwaltet und für die Schlussfolie gesammelt ausgegeben.

### Muss: Wiederverwendbare Komponenten

Alle Komponenten müssen dokumentierte Vue-Komponenten mit typisierten Props sein. Sie dürfen keine vortragsspezifischen Inhalte voraussetzen.


| ID | Komponente | Zweck |
| :-- | :-- | :-- |
| K-01 | `TitleSlide` | Einheitliche Titelfolie mit Titel, Untertitel, Person, Institution, Datum und optionalem Hero-Visual |
| K-02 | `SectionSlide` | Kapitelwechsel mit Kapitelnummer, Leitfrage und visuellem Akzent |
| K-03 | `Takeaway` | Prägnante Kernaussage einer Folie oder eines Kapitels |
| K-04 | `TwoColumn` | Wiederverwendbares Text-/Visual-Layout mit variabler Breitenverteilung |
| K-05 | `MetricCard` | Kennzahl mit Wert, Einheit, Kurzinterpretation und Trend-/Kontextindikator |
| K-06 | `ComparisonTable` | Lesbare Vergleichstabelle für Methoden, Modelle, Werkzeuge oder Szenarien |
| K-07 | `PipelineDiagram` | Prozesskette für Datenpipelines, ML-Systeme, RAG-Architekturen oder Workflows |
| K-08 | `ArchitectureDiagram` | Komponenten-/Systemarchitektur mit Datenflüssen, Trust Boundaries und optionalen Legenden |
| K-09 | `Timeline` | Zeitachse für Projektphasen, Experimente, Roadmaps oder historische Entwicklungen |
| K-10 | `ProcessSteps` | Schrittweise Darstellung eines Verfahrens oder Algorithmus |
| K-11 | `Equation` | Formelblock mit Nummer, Titel, Referenz-ID und optionaler Erklärung |
| K-12 | `NotationTable` | Symbol- und Notationserklärung für mathematische Folien |
| K-13 | `Cite` | Inline-Kurzbeleg aus zentraler Literaturdatenbank |
| K-14 | `SourceFooter` | Dezente Quellenzeile für eine einzelne Folie |
| K-15 | `ReferencesSlide` | Automatisch generierte Literaturübersicht |
| K-16 | `CodeBlock` | Syntax-Highlighting, Zeilennummern, Line-Fokus, Datei-/Sprachlabel |
| K-17 | `Callout` | Hervorgehobene Definition, Annahme, Limitation, Risiko oder zentrale Erkenntnis |
| K-18 | `Figure` | Abbildung mit Alt-Text, Bildunterschrift, Quelle, Lizenz und Zoom-Option |
| K-19 | `QrLink` | QR-Code für Repository, Demo, Paper, Abgabe oder weiterführendes Material |
| K-20 | `InteractiveReveal` | Kontrolliertes Einblenden von Erklärschritten innerhalb einer Folie |
| K-21 | `GlossaryTerm` | Begriffe mit Tooltip, Kurzdefinition und optionaler Quellenreferenz |
| K-22 | `QuestionSlide` | Abschlussfolie für Diskussion, Q\&A oder Reflexionsfrage |
| K-23 | `Agenda` | Kapitelübersicht mit Fortschrittsmarkierung |
| K-24 | `ImageCompare` | Vorher-/Nachher- oder Modellvergleich per Slider bzw. Toggle |
| K-25 | `ConfusionMatrix` | ML-spezifische Visualisierung mit Beschriftung, Farblegende und Tooltips |
| K-26 | `Chart` | Einheitlicher Wrapper für Balken-, Linien-, Scatter- und Radar-Charts |
| K-27 | `AppendixMarker` | Kennzeichnung von Backup-, Detail- oder optionalen Folien |

Bei Codeblöcken bietet Shiki eine sehr genaue, VS-Code-nahe Syntax-Hervorhebung auf Basis von TextMate-Grammatiken und Themes.

### Muss: Design und Lesbarkeit

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| D-01 | Das Design muss modern, zurückhaltend und wissenschaftlich-professionell wirken. | Keine Standard-PowerPoint-Optik, keine übermäßigen Schatten, keine dekorativen Effekte ohne Informationswert. |
| D-02 | Das System muss ein tokenbasiertes Design-System verwenden. | Farben, Typografie, Abstände, Radien, Schatten, Z-Index und Animationsdauern sind zentral konfigurierbar. |
| D-03 | Das System muss mindestens drei Themes unterstützen. | `academic-light`, `academic-dark` und `minimal-print` sind vorhanden. |
| D-04 | Die Schriftfamilien müssen lokal eingebunden sein. | Deck bleibt ohne Internet visuell identisch; keine Abhängigkeit von Google Fonts. |
| D-05 | Das Standarddesign muss für Projektoren geeignet sein. | Hohe Kontraste, ausreichend große Schrift und keine filigranen Details als Voraussetzung. |
| D-06 | Das System muss 16:9 priorisieren und 4:3 optional ermöglichen. | Theme und Layout passen sich kontrolliert an das definierte Seitenverhältnis an. |
| D-07 | Das Design muss responsiv, aber nicht „mobile-first um jeden Preis“ sein. | Primär optimiert für Beamer/Monitor; eine schmale Browseransicht bleibt dennoch nutzbar. |
| D-08 | Barrierearme Kontraste müssen als Standard gelten. | Text-Hintergrund-Kombinationen erfüllen ein hohes Kontrastniveau; Farbe ist nie der einzige Informationsträger. |
| D-09 | Das System muss eine Druckansicht besitzen. | Navigation, Fortschritt und interaktive Bedienelemente verschwinden im PDF; Inhalte bleiben lesbar. |
| D-10 | Das System muss ein Grid-System für konsistente Folienlayouts definieren. | Neue Folien lassen sich über vorgegebene Layouts statt über ad-hoc-Pixelwerte bauen. |

### Muss: Interaktivität und Animation

Interaktion und Animationen müssen inhaltlich begründet, reduzierbar und exportrobust sein.


| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| IA-01 | Folien müssen schrittweise Inhalte einblenden können. | Begriffe, Diagrammteile oder Argumentationsschritte erscheinen kontrolliert nacheinander. |
| IA-02 | Interaktive Komponenten müssen ohne externe Dienste funktionieren. | Diagramme, Simulationen und Slider laufen rein lokal im Browser. |
| IA-03 | Animationen müssen deklarativ und wiederverwendbar sein. | Standardanimationen werden über Komponenten oder Klassen verwendet, nicht als individuelle Inline-Hacks. |
| IA-04 | Animationen müssen einen reduzierten Modus unterstützen. | Bei `prefers-reduced-motion` werden Animationen vereinfacht oder deaktiviert. |
| IA-05 | Interaktive Visualisierungen müssen einen statischen Fallback besitzen. | PDF und Screenshot zeigen mindestens den fachlich relevanten Endzustand. |
| IA-06 | Animationen dürfen die Kernbotschaft nicht voraussetzen. | Die Folie bleibt verständlich, wenn Animationen ausfallen oder übersprungen werden. |
| IA-07 | Nutzerinteraktionen müssen zurücksetzbar sein. | Ein Reset der Folie stellt Ausgangszustand und Animationen reproduzierbar wieder her. |
| IA-08 | Diagramme müssen Tooltips oder Detailansichten optional erlauben. | Bei Hover/Klick können Datenpunkte erläutert werden, ohne die Hauptansicht zu überladen. |
| IA-09 | Der Zustand interaktiver Komponenten darf nicht unkontrolliert zwischen Folien weiterleben. | Beim Wechsel wird der Zustand definiert zurückgesetzt oder explizit persistiert. |
| IA-10 | Es muss eine zentrale Animationsbibliothek geben. | Mindestens `fade`, `slide-up`, `slide-left`, `scale-in`, `highlight`, `draw-path` und `stagger` sind standardisiert. |

Slidev unterstützt klickbasierte Inhaltsstufen direkt und erlaubt auch animierte Elemente über Vue-basierte Motion-Mechanismen. Für PDF-Export kann es zudem interaktive Elemente wie SVG, Canvas, Videos, KaTeX und CSS-Effekte gezielt als Bilder rendern, statt die gesamte Folie zu rasterisieren.

### Muss: Export, Qualität und Resilienz

| ID | Anforderung | Akzeptanzkriterium |
| :-- | :-- | :-- |
| E-01 | Das Deck muss als PDF exportierbar sein. | Ein dokumentierter Befehl erzeugt eine vollständige PDF ohne manuelle Browser-Schritte. |
| E-02 | Der PDF-Export muss alle Standardfolien enthalten. | Text, Formeln, Bilder, SVGs, Quellen und statische Diagramme erscheinen korrekt. |
| E-03 | Der Export muss einen „finalen Animationszustand“ unterstützen. | Die PDF zeigt standardmäßig alle relevanten Inhalte einer Folie. |
| E-04 | Das Deck muss als statische Offline-Website exportierbar sein. | Der Build läuft vom lokalen Dateisystem oder über einen minimalen lokalen HTTP-Server. |
| E-05 | Es muss ein Screenshot-/PNG-Export für einzelne Folien geben. | Einzelne Folien können für LMS, Dokumentation oder Social Media exportiert werden. |
| E-06 | Jeder Build muss auf Fehler geprüft werden. | TypeScript, Linting, Formatierung und Produktions-Build laufen über einen Befehl. |
| E-07 | Fehlende Assets müssen sichtbar fehlschlagen. | Nicht vorhandene Bilder, falsche Referenzen oder unaufgelöste Imports dürfen nicht unbemerkt in den Vortrag gelangen. |
| E-08 | Das Projekt muss einen Demo-/Smoke-Test enthalten. | Ein Beispielsatz aus Formel, Quelle, Bild, Diagramm, Animation und interaktiver Komponente baut erfolgreich. |
| E-09 | Externe Ressourcen müssen vermieden oder explizit gekennzeichnet werden. | Build prüft optional, ob externe Bild-, Font- oder Script-URLs verwendet werden. |
| E-10 | Das Deck muss ein Notfallpaket erzeugen können. | Ausgabe enthält mindestens statischen Build, PDF und optional gerenderte Folienbilder. |

Vite verarbeitet und versioniert importierte statische Assets im Build; Dateien aus dem konfigurierten öffentlichen Verzeichnis werden unverändert in das Ausgabe-Verzeichnis kopiert. Das ist hilfreich für lokale Schriften, Logos, Bilder und ein offline funktionierendes Deck.

## Referenz-Projektstruktur

```text
webdeck-starter/
├── slides/
│   ├── 00-frontmatter.md
│   ├── 01-title.md
│   ├── 02-agenda.md
│   ├── 03-problem.md
│   ├── 04-method.md
│   ├── 05-results.md
│   ├── 06-conclusion.md
│   └── 90-appendix.md
│
├── components/
│   ├── content/
│   │   ├── Takeaway.vue
│   │   ├── Callout.vue
│   │   ├── GlossaryTerm.vue
│   │   └── Figure.vue
│   ├── citations/
│   │   ├── Cite.vue
│   │   ├── SourceFooter.vue
│   │   └── ReferencesSlide.vue
│   ├── diagrams/
│   │   ├── PipelineDiagram.vue
│   │   ├── ArchitectureDiagram.vue
│   │   ├── Timeline.vue
│   │   ├── Chart.vue
│   │   └── ConfusionMatrix.vue
│   ├── math/
│   │   ├── Equation.vue
│   │   └── NotationTable.vue
│   ├── layouts/
│   │   ├── TwoColumn.vue
│   │   ├── SplitHero.vue
│   │   └── GridLayout.vue
│   └── interaction/
│       ├── InteractiveReveal.vue
│       ├── ImageCompare.vue
│       └── Stepper.vue
│
├── layouts/
│   ├── default.vue
│   ├── title.vue
│   ├── section.vue
│   ├── image-right.vue
│   ├── chart-focus.vue
│   ├── appendix.vue
│   └── print.vue
│
├── theme/
│   ├── tokens.css
│   ├── typography.css
│   ├── motion.css
│   ├── global.css
│   ├── print.css
│   └── variants/
│       ├── academic-light.css
│       ├── academic-dark.css
│       └── minimal-print.css
│
├── data/
│   ├── references.yaml
│   ├── glossary.yaml
│   ├── deck.config.ts
│   └── charts/
│
├── public/
│   ├── fonts/
│   ├── images/
│   ├── icons/
│   └── favicon.svg
│
├── setup/
│   ├── katex.ts
│   ├── citations.ts
│   ├── shiki.ts
│   └── slidev.ts
│
├── scripts/
│   ├── export-pdf.mjs
│   ├── export-png.mjs
│   ├── validate-references.mjs
│   ├── validate-assets.mjs
│   └── create-emergency-pack.mjs
│
├── tests/
│   ├── components/
│   └── smoke/
│
├── slides.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── prettier.config.mjs
├── README.md
└── LICENSE
```


## Datenverträge und Erweiterungspunkte

Der Schlüssel zur späteren Flexibilität sind nicht nur viele Komponenten, sondern **klare Datenverträge**. Komponenten dürfen nicht auf spezielle Inhalte eines einzelnen Vortrags zugeschnitten sein.

### Zentrale Vortragkonfiguration

```ts
export interface DeckConfig {
  meta: {
    title: string
    subtitle?: string
    author: string
    institution?: string
    date: string
    language: 'de' | 'en'
    version?: string
  }

  display: {
    aspectRatio: '16:9' | '4:3'
    showProgress: boolean
    showSlideNumbers: boolean
    showSourceFooters: boolean
    defaultTheme: 'academic-light' | 'academic-dark' | 'minimal-print'
  }

  export: {
    pdfFileName: string
    includeAppendix: boolean
    renderFinalAnimationState: boolean
    includeNotes: boolean
  }

  citations: {
    style: 'author-year' | 'numeric' | 'short-footnote'
    bibliographyFile: string
  }
}
```


### Quellenmodell

```ts
export interface ReferenceEntry {
  id: string
  type: 'article' | 'book' | 'web' | 'dataset' | 'image' | 'software'
  authors?: string[]
  year?: number
  title: string
  containerTitle?: string
  publisher?: string
  doi?: string
  url?: string
  accessedAt?: string
  license?: string
}
```


### Beispiel für eine wissenschaftliche Folie

```md
---
layout: two-column
title: Kanalweise Normalisierung
chapter: Methode
citations:
  - imagenet-normalization
---

# Vorverarbeitung

Für jeden Pixel \(x_{i,j} \in \mathbb{R}^{3}\) und Farbkanal
\(c \in \{R, G, B\}\) gilt:

<Equation id="channel-normalization" label="Kanalweise Normalisierung">

\[
x'_{i,j,c}
=
\frac{\frac{x_{i,j,c}}{255} - \mu_c}{\sigma_c}
\]

</Equation>

<NotationTable
  :entries="[
    { symbol: 'x_{i,j,c}', meaning: 'ursprünglicher Pixelwert des Kanals c' },
    { symbol: '\\mu_c', meaning: 'kanalweiser Mittelwert der Trainingsdaten' },
    { symbol: '\\sigma_c', meaning: 'kanalweise Standardabweichung' }
  ]"
/>

::right::

<PipelineDiagram
  :nodes="['RGB-Bild', 'Resize', 'Skalierung', 'Normalisierung', 'CNN']"
  animated
/>

<Takeaway>
Die Normalisierung bringt alle Farbkanäle auf eine vergleichbare Skala und
stabilisiert damit das Modelltraining.
</Takeaway>

<SourceFooter>
<Cite id="imagenet-normalization" />
</SourceFooter>
```

Damit sind Formel, Notationserklärung, Prozessvisualisierung, Kernaussage und Quellenbeleg sauber getrennt, aber in einer Folie kombinierbar.

## Design-System

Das Theme-System muss semantische Tokens verwenden. Theme-Varianten müssen ohne Änderungen an den Komponenten erstellt werden können.

```css
:root {
  --color-canvas: oklch(98% 0.01 260);
  --color-surface: oklch(100% 0 0);
  --color-text: oklch(20% 0.03 260);
  --color-text-muted: oklch(48% 0.03 260);
  --color-primary: oklch(55% 0.20 255);
  --color-accent: oklch(70% 0.16 160);
  --color-warning: oklch(73% 0.16 80);
  --color-danger: oklch(58% 0.21 25);

  --font-sans: "Inter Variable", "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-math: "KaTeX_Main", serif;

  --text-xs: clamp(0.8rem, 1vw, 1rem);
  --text-sm: clamp(1rem, 1.25vw, 1.25rem);
  --text-base: clamp(1.25rem, 1.7vw, 1.7rem);
  --text-lg: clamp(1.8rem, 2.6vw, 2.8rem);
  --text-xl: clamp(2.6rem, 4.5vw, 5.25rem);

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;

  --duration-fast: 140ms;
  --duration-base: 260ms;
  --duration-slow: 500ms;
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Gestaltungsrichtlinien:

- **Inter Variable** für Fließtext, Labels, Tabellen und UI-nahe Elemente.
- Eine markantere, aber trotzdem gut lesbare Display-Schrift nur optional für Titel.
- Lokale Webfonts im Projekt, damit das Deck offline identisch rendert.
- Viel freie Fläche statt vollgestopfter „Karten-Dashboards“.
- Ein klarer Informationsfokus pro Folie.
- Große Überschriften, geringe Textmenge und stark reduzierte Fußnoten.
- Akzentfarben nur für Bedeutung: Datenfluss, Hervorhebung, Ergebnis, Warnung oder Entscheidung.
- SVG-basierte Diagramme sind für Visualisierungen zu bevorzugen, die erläutert oder animiert werden müssen.


## Nicht-Ziele für Version 1

Folgende Funktionen sind nicht Bestandteil von Version 1:

- Kein eigener WYSIWYG-Editor.
- Kein Cloud-CMS und keine Datenbank.
- Keine Benutzerverwaltung, Accounts oder Kollaboration in Echtzeit.
- Kein verpflichtendes Live-Backend.
- Keine selbst entwickelte Folien-Navigationsengine.
- Kein vollständiger Ersatz für Figma, PowerPoint oder wissenschaftliche Publikationssoftware.
- Keine Abhängigkeit von externen Font-CDNs, Bild-CDNs oder SaaS-APIs.
- Keine Animation um der Animation willen.


## Umsetzungsphasen

### Phase 1: Fundament

- Slidev-, Vue- und TypeScript-Projekt aufsetzen.
- Lokale Schriftarten, Basis-Theme und Design Tokens einrichten.
- Zentrale `deck.config.ts` implementieren.
- Markdown-Slides in mehrere Dateien organisieren.
- Grundlayouts `default`, `title`, `section`, `two-column`, `appendix`.
- Lokaler Build, statischer Export und PDF-Export.
- CI-ähnlichen lokalen Qualitätsbefehl `npm run check` definieren.

**Ergebnis:** Ein robustes, leeres und offline-fähiges Deck-Template.

### Phase 2: Wissenschaftliche Basis

- `Cite`, `SourceFooter` und `ReferencesSlide`.
- Zentral gepflegte Literaturdaten in YAML oder BibTeX.
- `Equation` und `NotationTable`.
- `Figure`, `CodeBlock`, `Callout`, `Takeaway`.
- Asset- und Quellenvalidierung.
- Druckansicht und PDF-Regressionstest mit Beispielfolien.

**Ergebnis:** Für technische und wissenschaftliche Studienvorträge unmittelbar nutzbar.

### Phase 3: Visualisierung und Interaktion

- `PipelineDiagram`, `ArchitectureDiagram`, `Timeline`, `Chart`.
- Einheiten für abgestufte Animationen und Motion Tokens.
- `InteractiveReveal`, `ImageCompare` und `ConfusionMatrix`.
- SVG-Animationen für Datenflüsse, Architekturen und algorithmische Schritte.
- Static-Fallbacks für PDF und Notfallbetrieb.

**Ergebnis:** Ein moderner Web-Deck-Baukasten für erklärungsstarke Vorträge.

### Phase 4: Reifegrad

- Weitere Themes und Layoutvarianten.
- Export als Bildserie und Notfallpaket.
- Accessibility-Checks, Kontrastprüfung und `prefers-reduced-motion`.
- Komponenten-Galerie bzw. internes „Showcase-Deck“.
- Starter-CLI, beispielsweise `npm run new:deck -- --name seminar-ml`.

**Ergebnis:** Ein wiederverwendbares Präsentations-Framework, aus dem neue Vorträge per Template oder Fork erstellt werden können.

## Erfolgskriterien

Das Projekt gilt als erfolgreich, wenn ein neuer Studienvortrag innerhalb von etwa 30 Minuten:

1. Ein neues Repository aus dem Template erzeugst.
2. Titel, Autor, Theme und Quellenstil in einer Datei konfigurierst.
3. Die Storyline als Markdown-Folien anlegst.
4. Formeln, Quellen, Diagramme und Code ohne Layout-Frickelei einfügst.
5. Bei Bedarf eine neue Vue-Komponente ergänzen kannst, ohne die Folienarchitektur umzubauen.
6. Eine lokale, offline funktionierende Website und ein sauberes PDF erzeugst.
7. Das Ergebnis sichtbar moderner wirkt als ein Standard-Foliensatz, dabei aber auf einem Beamer besser lesbar bleibt als eine überladene „Showcase“-Website.

Die Architektur ist **inhaltsorientiert, komponentenfähig und lokal reproduzierbar**. Slidev stellt die Folieninfrastruktur bereit; Vue und TypeScript dienen als Erweiterungspunkte für projektspezifische Funktionen.
