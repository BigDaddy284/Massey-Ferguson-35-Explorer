# 02 — Research source register

The machine-readable register is [`data/sources.json`](../../data/sources.json). It is the
single source of truth: every record lists what was extracted, the date it was read and any
conflicts. This page is a readable index and records how sources are graded.

## Reliability grades

| Grade | Meaning | Can it make a record "verified"? |
|---|---|---|
| `primary` | Factory/AGCO publication: parts book, service manual, operator book | Yes, once actually read (`accessed: true`) |
| `secondary-reference` | Published book, encyclopaedia, club or heritage article | No: partially verified at best |
| `supplier` | Parts vendor listing | No. Supplier "OEM" numbers are claims, stored as `supplierClaimedOem` |
| `community` | Forum post | No. Used to find leads and conflicts |
| `aggregator` | Spec website of unknown provenance | No. Often mixes petrol and diesel data (see SRC-027) |

`scripts/validate-data.mjs` enforces this rule. A node marked `verified` must cite at least one
accessed primary source.

## Index

| Id | Source | Grade | Main use |
|---|---|---|---|
| SRC-001 | Wikipedia: Massey Ferguson 35 (cites Thorne 2014) | secondary | Dates, naming, colours, De Luxe dual clutch |
| SRC-002 | Anglo Agriparts: MF35/FE35/35X serial numbers | supplier | Serial-by-year, Perkins break, plate location |
| SRC-003 | Anglo Agriparts: FE35 serial numbers | supplier | Prefix letter code, engine number location, casting codes |
| SRC-004 | TractorData: FE-35 | aggregator | Gearbox, PTO type, brakes, weight |
| SRC-005 | TractorData: FE-35 engine | aggregator | 23C displacement, CR, firing order |
| SRC-006 | Agriline (ZA): Standard 23C data | supplier | Bore/stroke, clearances, journals, DPA pump, Lucas units, torques (suspect) |
| SRC-007 | Wikipedia: Standard wet liner engine | secondary | 23C origin, Leyland OE.138 |
| SRC-008 | Walt's Tractors: 23C parts | supplier | Dry liner, timing chain, bearing undersizes |
| SRC-009 | Ferguson Club: Coldridge Collection | secondary | Freeman Sanders chamber, starting, Perkins trials |
| SRC-010 | Southern Star: MF35 feature | secondary | Standard vs De Luxe, levers, dual clutch action |
| SRC-011 | tractordata.co.uk: MF35 4-cyl diesel 1958 | aggregator | Power figures, De Luxe equipment |
| SRC-012 | Agriline Products (UK): FE35 4-cyl hydraulics | supplier | Pump/ram serial break 65685, control parts |
| SRC-013 | Sparex S.40843 pump kit | supplier | Pump kit contents |
| SRC-014 | TractorByNet: MF35 hydraulic pump | community | Pump versions, part number leads |
| SRC-015 | Ferguson Enthusiasts: manuals list (2010) | secondary | Publication numbers |
| SRC-016 | FarmingParts: parts book 819045M4 | supplier | Availability of parts book |
| SRC-017 | masseytractorparts.com: operator book 819046M1 | supplier | Availability of operator book |
| SRC-018 | Anglo Agriparts: 23C overhaul kit A67254 | supplier | Kit contents, slip-fit liners, sample supplier record |
| SRC-019 | Anglo Agriparts: FE35 engine components | supplier | 23C parts range, supplier category tree |
| SRC-020 | Reliable Aftermarket Parts: heater plug 829162M1 | supplier | Cold-start variant |
| SRC-021 | TractorByNet: TO35 diesel 23C | community | FE35/TO35 engine commonality, thread warning |
| SRC-022 | TractorByNet: cold starting | community | Cold-climate equipment |
| SRC-023 | fergy.com.au: Positioner | community | Position control on FE35 |
| SRC-024 | Ferguson Enthusiasts: serial post | community | Plate-only serial record, heritage records |
| SRC-025 | Thorne, *MF35 & 65 Models in Detail* (2014) | secondary | **Not yet consulted** |
| SRC-026 | Histoparts: Ferguson 35 categories | supplier (NL) | Category structure |
| SRC-027 | manytractors.com: FE-35 | aggregator | Gear count only; engine data unreliable |
| SRC-030 | Service manual 1448811M1 | primary | **Not yet obtained** |
| SRC-031 | Diesel supplement 690560M1 | primary | **Not yet obtained** |
| SRC-032 | Parts book 819045M4 | primary | **Not yet obtained.** Highest priority |
| SRC-033 | Operator book 819046M1 | primary | **Not yet obtained** |
| SRC-034 | 23C engine operator manual 819050M1 | primary | **Not yet obtained** |
| SRC-035 | MF35 Workshop Service Manual (FE-35), scanned copy at nrgsurveys.co.uk | primary | **Read 2026-11-07.** Specs, torques, clutch, gearbox, PTO, hydraulics. Publication number not visible; may be SRC-030 |
| SRC-036 | SlideShare / Scribd preview of a "MF 35X parts catalogue 819045" upload | aggregator | Cover and Perkins-looking pages only; not usable for the 23C |
| SRC-037 | AGCO Technical Publication Catalog 79017810B | primary | **Read 2026-11-07.** FE 35 4-cyl diesel: operator manual 690274M2, repair manual 819146M4, parts book 819045M4 |
| SRC-038 | 2008 AGCO Heritage Parts and Merchandise Catalog (PDF from the owner) | primary | **Read 2026-11-07.** Current AGCO supply numbers for 35/23C parts, recorded as `replacementReferences`. See `06-agco-heritage-2008.md` |

## Sources tried but not readable from this environment

These may be worth reading manually or in a later session: tractorandmachinery.co.uk (FE35
buying guide and MF35 story), vintagetractorengineer.com (23C data and torques), Ferguson
Club "Ferguson System" article, smokstak.com "Ferguson diesels" thread, Yesterday's Tractors
parts catalogue pages, and the de.wikibooks Traktorenlexikon page.

## Adding a source

Give it the next free `SRC-NNN` id. Never renumber. Fill in `extracted` with the specific
facts taken and `conflicts` with any disagreement, then run `node scripts/validate-data.mjs`.
