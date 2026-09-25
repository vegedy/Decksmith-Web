# Decksmith Web

A local Slidev template for technical talks. Phase 1 provides Markdown content,
Vue 3 layouts, strict TypeScript, a light theme, static hosting and PDF export.
Scientific components, citation rendering and interactive visualizations belong to later phases.

## Start on Linux

Use Node **22.12 or newer** (`.nvmrc`) and npm. Install dependencies once with network
access, then present and export locally:

```sh
npm install
npm run dev
```

Open <http://localhost:3030>. The same command starts the appendix at
<http://localhost:3031>; Ctrl+C stops both. Keep these ports free. Slidev owns arrow-key
navigation, click steps, overview and presenter mode. Configuration changes require
restarting the dev command; Markdown, components and CSS update through Vite HMR.

For repeatable installation use `npm ci` and commit `package-lock.json` when updating
dependencies. Exact direct versions and the lockfile define the build inputs.

## Commands

| Command                   | Result                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`             | Main and appendix development servers                                                       |
| `npm run build`           | Offline static site in `dist/`, appendix in `dist/appendix/`                                |
| `npm run export:pdf`      | `output/decksmith-foundation.pdf`, name controlled by configuration                         |
| `npm run check`           | Strict types, lint, formatting, unit tests, both production builds and browser smoke checks |
| `npm run test:foundation` | Check an existing build with external requests blocked; screenshots in `output/smoke/`      |
| `npm run format`          | Format framework code and documentation                                                     |

PDF export and browser checks require Chromium. They prefer Playwright's bundled
browser, then `/usr/bin/chromium` on Linux. If neither is present:

```sh
npx playwright install chromium
# If Chromium reports missing system libraries, provision them once:
npx playwright install-deps chromium
```

Some npm versions block browser installation scripts; the explicit command above works
independently of lifecycle-script settings. Optional speaker-notes export always
requires this bundled browser because Slidev does not expose a system-browser option
for its notes command. An existing browser can be selected with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium`. Browser version can affect PDF
bytes; PDFs contain timestamps and are not claimed to be byte-identical. Production
static assets are reproducible with the locked toolchain and identical inputs.

Serve `dist/` with any static HTTP server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

Open <http://localhost:8080>. All runtime files are local; no internet is needed.
Hash routing and relative build URLs support a hosting subdirectory. Opening
`index.html` directly with `file://` is not supported by browser ES modules.

## Make a new talk

1. Copy/fork this repository, excluding `node_modules`, `dist` and `output`.
2. Edit `deck.config.ts`: title, subtitle, author, institution, date, language, appearance and export name.
3. Edit `slides.md` (first/title slide and main import order), `slides/*.md`, and `appendix.md`.
4. Put local images in `public/images/`, then run `npm run check` and `npm run export:pdf`.

No framework change is needed. The smoke test derives the slide count from Slidev's
parser and the title/font settings from configuration; it does not require the demo's
text. Review its screenshots and your PDF after changing content. Keep a title layout
as the first slide, and keep content within the slide's available space.

Content belongs in `slides/` and `public/`; generic code belongs in `components/`,
`layouts/`, `setup/` and `theme/`. `scripts/` contains build/export validation support.
`docs/SPEC.md` remains authoritative; `PLAN.md` and `docs/REQUIREMENTS.md` track later work.

## Configuration and metadata

`types/deck.ts` documents the central contract. `setup/preparser.ts` maps the
`decksmith: true` entry marker to native Slidev headmatter. `setup/main.ts` maps central
colors and font families to semantic CSS variables. Avoid duplicating central settings
in slide frontmatter. Only `academic-light` is implemented; the type deliberately does
not advertise future themes. `16:9` is the default; `4:3` selects Slidev's taller canvas.

Footers, slide numbers and progress are independently controlled by configuration.
`showSourceFooters` and `citations` preserve the specification's future integration
contract; Phase 1 does not render citations or require the reserved bibliography file.
`renderFinalAnimationState` maps to Slidev's single-page export versus click-step export;
no custom animations are introduced. `includeNotes: true` additionally produces a
`-notes.pdf` companion using Slidev's notes exporter. Static builds exclude speaker notes.

Per-slide frontmatter supports `title`, `layout`, `chapter`, `citations`, `tags`,
`timeBudget` (seconds), `variant` and `appendix`; see `types/deck.ts` and the demo.
Custom metadata is carried by Slidev; it does not yet select content variants or
validate citation IDs. See [Slidev's syntax](https://sli.dev/guide/syntax) and
[configuration](https://sli.dev/custom/).

## Layouts and structural components

| Layout / component            | Contract                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title` / `TitleSlide`        | Central metadata in layout; component props: required `title`, `author`, `date`, optional `subtitle`, `institution`; default content and optional `hero` slots |
| `section` / `SectionSlide`    | Frontmatter `title`, optional `number` (string/number) and `question`; component accepts those same props and a default slot                                   |
| `default`                     | Standard padded content frame and footer                                                                                                                       |
| `two-column` / `TwoColumn`    | `ratio`: `equal` (default), `wide-left`, `wide-right`; default/left and `right` slots; Markdown separates them with `::right::`                                |
| `appendix` / `AppendixMarker` | Standard frame with optional-detail label; marker has optional `label` prop                                                                                    |
| `DeckFrame`                   | Shared content frame, footer and progress from native Slidev context; default slot                                                                             |
| `DeckLink`                    | Required `target`: `main` or `appendix`; default slot supplies link text; links become plain text in PDF                                                       |

Agenda content is ordinary Markdown. Every foundation component is stateless: navigation
and re-entry cannot retain component interaction state. The same content renders in PDF.
There is no custom navigation engine or animation library.

Appendix slides form a separate Slidev entry. They never appear in the main talk's
linear navigation, but `DeckLink` opens them and returns to the main title slide.
The default PDF includes both entries; set `export.includeAppendix` to `false` for
main slides only. The ignored `.export.md` manifest is generated from the current main
entry plus the appendix entry, so there is no second content source to maintain.

## Theme, fonts and validation boundaries

Semantic tokens cover colors, typography, spacing, radius, shadow, stacking and motion.
CSS layers separate reset, tokens, theme, typography, layout and print. The Vite adapter
places Slidev's unlayered reset beneath these layers. New themes should override tokens,
not hardcode component colors. Reduced motion disables transitions and animations globally.

Inter Variable and JetBrains Mono are imported from pinned Fontsource packages, copied
into the build by Vite, and licensed under the bundled OFL notices in `public/licenses/`.
KaTeX's own local fonts are included automatically for native math (appendix smoke example).
Changing a font family requires bundling that font's CSS/assets in `style.css`; naming a
remote font does not download it. No font CDN is configured.

Vite fails unresolved imports. The foundation build hook rejects missing or remote literal
images extracted by Slidev, including images under `public/`. Browser checks also fail
on HTTP errors, broken rendered images, external requests, runtime errors or warnings,
and content overlapping the footer. These checks cover the current deck, not every
possible dynamic asset expression. Full source/asset validators remain in Phase 2.

See `docs/VALIDATION.md` for measured evidence and limitations, including upstream npm
advisories. See `docs/DECISIONS.md` for the appendix, configuration and CSS/type boundaries.
