# MF35 Explorer: The Complete Tractor Anatomy

An interactive digital anatomy and parts catalogue for a **1958 Massey Ferguson 35 diesel**
(Standard 23C engine), built to run locally in a web browser.

**Status:** Phase 1 (historical research and component identification) complete. The
application itself starts in Phase 2.

## Phase 1 deliverables

| Deliverable | Document | Data |
|---|---|---|
| Tractor specification | [docs/research/01-tractor-specification.md](docs/research/01-tractor-specification.md) | — |
| Research source register | [docs/research/02-source-register.md](docs/research/02-source-register.md) | [data/sources.json](data/sources.json) |
| Configuration & compatibility rules | [docs/research/03-configuration-rules.md](docs/research/03-configuration-rules.md) | [data/configurations.json](data/configurations.json) |
| Initial component hierarchy | [docs/research/04-component-hierarchy.md](docs/research/04-component-hierarchy.md) | [data/hierarchy.json](data/hierarchy.json) |
| Documentation, suppliers & 3D resources | [docs/research/05-documentation-and-modelling-resources.md](docs/research/05-documentation-and-modelling-resources.md) | — |

Specifications: [docs/spec/PRODUCT_SPEC.md](docs/spec/PRODUCT_SPEC.md) (governing) and
[docs/spec/DESIGN.md](docs/spec/DESIGN.md).

## Validate the data

```bash
npm run validate
```

## Accuracy policy

Nothing is shown as verified unless it has been checked against an original Massey Ferguson
publication. Supplier part numbers are recorded as claims until then. Every record carries its
sources and a verification status.
