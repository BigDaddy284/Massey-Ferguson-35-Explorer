# MF35 Explorer: The Complete Tractor Anatomy

An interactive digital anatomy and parts catalogue for a **1958 Massey Ferguson 35 diesel**
(Standard 23C engine), built to run locally in a web browser.

**Status:** Phase 6 built. Seventeen original exploded line diagrams (engine, cylinder head, block,
crankshaft, timing, injection, cooling, clutch, gearbox, differential, rear axle, hydraulic lift and
pump, PTO, front axle, brakes, linkage) are generated from the 3D model, numbered to match the 3D
exploded views, and linked both ways to the component records. They need no WebGL. Every one of the
247 catalogued parts has a plain-English description, function, location, failure note and links to
connected parts (Phase 5). The separable 3D model (Phase 3–4) can be rotated, selected, hidden,
isolated, X-rayed and exploded. Original part numbers and quantities still wait for the AGCO parts
book (819045M4). UK supplier references (Phase 7) come next.

## Open the app

Open `app/index.html` in any modern browser. It needs no server or install. Alternatively, run
`npm run serve` and visit http://localhost:8035.

## Phase 1 deliverables

| Deliverable | Document | Data |
|---|---|---|
| Tractor specification | [docs/research/01-tractor-specification.md](docs/research/01-tractor-specification.md) | — |
| Research source register | [docs/research/02-source-register.md](docs/research/02-source-register.md) | [data/sources.json](data/sources.json) |
| Configuration & compatibility rules | [docs/research/03-configuration-rules.md](docs/research/03-configuration-rules.md) | [data/configurations.json](data/configurations.json) |
| Initial component hierarchy | [docs/research/04-component-hierarchy.md](docs/research/04-component-hierarchy.md) | [data/hierarchy.json](data/hierarchy.json) |
| Documentation, suppliers & 3D resources | [docs/research/05-documentation-and-modelling-resources.md](docs/research/05-documentation-and-modelling-resources.md) | — |
| AGCO Heritage 2008 replacement numbers | [docs/research/06-agco-heritage-2008.md](docs/research/06-agco-heritage-2008.md) | `replacementReferences` in [data/hierarchy.json](data/hierarchy.json) |

Specifications: [docs/spec/PRODUCT_SPEC.md](docs/spec/PRODUCT_SPEC.md) (governing) and
[docs/spec/DESIGN.md](docs/spec/DESIGN.md).

## Development

```bash
npm run build   # validate data/*.json and regenerate app/data/mf35-data.js
npm test        # core logic tests
```

## Accuracy policy

Nothing is shown as verified unless it has been checked against an original Massey Ferguson
publication. Supplier part numbers are recorded as claims until then. Every record carries its
sources and a verification status.
