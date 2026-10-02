// Compile from the repository root:
// typst compile --root . notes/vortrag.typ notes/vortrag.pdf
// Read the speech directly: no second copy of its wording is maintained here.
#let source = read("../vortrag.md")
#let paragraphs = source.trim().split("\n\n")
#let title = paragraphs.first().trim("# ", at: start)

#set document(title: title, author: "Benito Zenz")
#set page(
  paper: "a4",
  margin: (top: 20mm, bottom: 22mm, left: 23mm, right: 23mm),
  numbering: "1 / 1",
  number-align: center,
)
#set text(font: "Libertinus Serif", size: 17pt, lang: "de", hyphenate: false)
#set par(justify: false, leading: 0.7em, spacing: 0.9em)

// This deliberately handles the Markdown constructs present in vortrag.md:
// title, chapter headings, slide cues, inline code and the quoted source URL.
// text() preserves literal punctuation, including straight quotation marks.
#let chapter = none
#let first-slide = true
#for paragraph in paragraphs.slice(1) {
  let paragraph = paragraph.trim()
  if paragraph.starts-with("## ") {
    // Defer the chapter until after the upcoming slide's page break.
    chapter = paragraph.slice(3)
  } else if paragraph.starts-with("**▶ Folie ") {
    if first-slide {
      block(above: 0pt, below: 10mm, text(size: 20pt, weight: "bold", title))
      first-slide = false
    } else {
      pagebreak()
    }
    if chapter != none {
      block(above: 0pt, below: 4mm, text(size: 12pt, weight: "bold", chapter))
      chapter = none
    }
    block(
      width: 100%,
      above: 0pt,
      below: 7mm,
      inset: (bottom: 3mm),
      stroke: (bottom: 0.6pt),
      text(size: 20pt, weight: "bold", paragraph.slice(2, -2)),
    )
  } else {
    // A blockquote follows the final paragraph of slide 10 without a blank line.
    for part in paragraph.split("\n> ") {
      let wording = part.replace("\n", " ").replace("`", "")
      if wording.starts-with("https://") {
        par(link(wording, text(size: 11pt, wording)))
      } else {
        par(text(wording))
      }
    }
  }
}
