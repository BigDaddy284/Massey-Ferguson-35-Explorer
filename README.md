# MF35 Explorer: The Complete Tractor Anatomy

An interactive digital anatomy and parts catalogue for a **1958 Massey Ferguson 35 diesel**
(Standard 23C engine), built to run locally in a web browser.

**Status:** Phase 9 (final polish) built on top of Phase 8 and the AGCO MF35/35X parts book 819045. 141 components show their original part number and quantity from the book and are marked verified. The owner's serial plate (SDM 105284: a 1958 Coventry 23C diesel with the dual-stage clutch) and engine number (SJ 64975 ES) decide which side of the book's serial and engine-number splits applies; composite sets list every candidate and stay partially verified. A completeness report (`npm run report`) and the Research Status page list what is still missing. The parts books themselves (purchased PDFs) are not in this repository.

## Open the app

Open `app/index.html` in any modern browser. It needs no server or install. Alternatively, run
`npm run serve` and visit http://localhost:8035.

## Using the app

| Where | What you can do |
|---|---|
| **Tractor Anatomy** | Drag to rotate, scroll or pinch to zoom, right-drag or two-finger drag to pan. Click a part to open its record; double-click to isolate it. The toolbar has Reset, Up one level, Zoom to part, Isolate, Hide, Show all, X-ray, the explode slider and camera presets. On a phone or tablet the assembly tree is behind the ☰ button and the record behind the ⓘ button. |
| **Parts Catalogue** | Every component with its original number, assembly, quantity, status and UK supplier count. Filter by system, status and level, or tick *Fitted to shown configuration*. On a phone each row becomes a card. |
| **Exploded Views** | Seventeen original numbered line diagrams drawn from the model. Hover a number to light up the part, click to open its record, or open the same assembly exploded in 3D. |
| **Technical Information** | Sourced figures with their status, power-flow diagrams for the PTO and hydraulic lift, and a glossary of terms (live PTO, draft control and so on) linked to the parts involved. |
| **Identification / My Tractor** | How to read the serial plate and engine number, and a form to record yours. Entries are kept in this browser only. |
| **Research Status** | Coverage by system, the completeness report, the source register and the UK suppliers checked. |
| **Search** (press `/`) | Names, original, TO35, AGCO and supplier numbers, descriptions, technical figures and glossary terms, with spelling tolerance. *See all* sends the query to the Parts Catalogue. |

Every record starts with a one-line description and links to the same part in 3D, its drawn diagram and the
catalogue. Long lists of parts-book numbers are folded; *Show more* opens them. Missing information always reads
"Not yet documented".

## Phase 1 deliverables

| Deliverable | Document | Data |
|---|---|---|
| Tractor specification | [docs/research/01-tractor-specification.md](docs/research/01-tractor-specification.md) | — |
| Research source register | [docs/research/02-source-register.md](docs/research/02-source-register.md) | [data/sources.json](data/sources.json) |
| Configuration & compatibility rules | [docs/research/03-configuration-rules.md](docs/research/03-configuration-rules.md) | [data/configurations.json](data/configurations.json) |
| Initial component hierarchy | [docs/research/04-component-hierarchy.md](docs/research/04-component-hierarchy.md) | [data/hierarchy.json](data/hierarchy.json) |
| Documentation, suppliers & 3D resources | [docs/research/05-documentation-and-modelling-resources.md](docs/research/05-documentation-and-modelling-resources.md) | — |
| AGCO Heritage 2008 replacement numbers | [docs/research/06-agco-heritage-2008.md](docs/research/06-agco-heritage-2008.md) | `replacementReferences` in [data/hierarchy.json](data/hierarchy.json) |
| UK suppliers | [docs/research/07-uk-suppliers.md](docs/research/07-uk-suppliers.md) | [data/suppliers.json](data/suppliers.json) |
| Completeness report | [docs/research/08-completeness-report.md](docs/research/08-completeness-report.md) | `npm run report` |
| Parts book 819045 method and page map | [docs/research/09-parts-book-819045.md](docs/research/09-parts-book-819045.md) | `partsBookReferences` (`book: 'MF35'`) |
| 3D model notes | [docs/model/README.md](docs/model/README.md) | `app/js/model.js` |

Specifications: [docs/spec/PRODUCT_SPEC.md](docs/spec/PRODUCT_SPEC.md) (governing) and
[docs/spec/DESIGN.md](docs/spec/DESIGN.md).

## Development

```bash
npm run build   # validate data/*.json and regenerate app/data/mf35-data.js
npm test        # core logic tests
npm run report  # rewrite the completeness report
npm run smoke   # browser check of every view at desktop, tablet and phone widths (needs Playwright)
```

Performance notes (Phase 9): the 3D view draws a frame only when something changes, and the page appears before the
model is built, so the interface is usable at once and idle tabs use almost no GPU.

## Accuracy policy

Nothing is shown as verified unless it has been checked against an original Massey Ferguson
publication. Supplier part numbers are recorded as claims until then. Every record carries its
sources and a verification status.
