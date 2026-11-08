# 08 – Completeness report (Phase 8)

Generated 2026-11-08 by `npm run report` (`scripts/completeness-report.mjs`) from `data/*.json`, `app/js/model.js` and `app/data/mf35-diagrams.js`. Spec §16 asks for this breakdown; the application never claims to hold every component, and this report says what is still missing.

## Totals

| Measure | Count |
|---|---|
| Items identified (systems, assemblies, components) | 255 |
| Components | 222 |
| Verified | 0 (nothing is verified until FE35 parts book 819045M4 is read) |
| Partially verified | 155 (61%) |
| Variant dependent | 8 |
| Unverified | 92 (36%) |
| Confirmed original (FE35) part numbers | 0 |
| With TO35 parts-book numbers (SRC-041) | 180 (71%) – 521 numbers, 270 on 23C engine pages, 37 also in the 2008 AGCO catalogue |
| With 2008 AGCO replacement references (SRC-038) | 90 (35%) |
| With description and function | 255 (100%) |
| In drawn exploded diagrams | 166 (65%) (17 diagrams) |
| Represented in 3D | 216 (85%) |
| With UK purchase references | 149 (58%) (235 references, 2 suppliers) |
| Fastener and small-part records (studs, bolts, nuts, pins, seals, gaskets, bushes, bearings, springs…) | 50, of which 42 carry parts-book numbers |

## By system

| System | Items | Partial | Variant | Unverified | Parts book | AGCO 2008 | Described | Diagram | 3D | UK refs |
|---|---|---|---|---|---|---|---|---|---|---|
| Engine: Standard 23C diesel | 69 | 64 | 0 | 5 | 61 | 11 | 69 | 64 | 55 | 30 |
| Diesel fuel system | 20 | 13 | 0 | 7 | 15 | 7 | 20 | 6 | 15 | 9 |
| Cooling system | 11 | 9 | 1 | 1 | 9 | 4 | 11 | 9 | 10 | 8 |
| Clutch | 12 | 5 | 3 | 4 | 10 | 4 | 12 | 7 | 9 | 9 |
| Gearbox | 12 | 6 | 0 | 6 | 10 | 4 | 12 | 11 | 11 | 6 |
| Rear axle, differential and brakes | 24 | 7 | 1 | 16 | 21 | 9 | 24 | 19 | 20 | 16 |
| PTO system | 9 | 4 | 0 | 5 | 8 | 3 | 9 | 8 | 8 | 2 |
| Hydraulic lift system | 33 | 27 | 0 | 6 | 28 | 12 | 33 | 20 | 30 | 22 |
| Three-point linkage | 11 | 8 | 0 | 3 | 7 | 7 | 11 | 10 | 10 | 9 |
| Front axle and steering | 13 | 0 | 0 | 13 | 0 | 8 | 13 | 12 | 12 | 7 |
| Electrical system | 19 | 9 | 2 | 8 | 10 | 9 | 19 | 0 | 16 | 16 |
| Bodywork and operator area | 12 | 1 | 1 | 10 | 1 | 8 | 12 | 0 | 11 | 10 |
| Wheels and tyres | 10 | 2 | 0 | 8 | 0 | 4 | 10 | 0 | 9 | 5 |

## Missing components and fasteners

The hierarchy was compared with the TO35 parts book tables that were read (36 pages). Components the book lists that the hierarchy lacked were added in Phase 8: sump strainer, throttle lever, throttle rods and bellcrank, fuel shut-off control, heater plug resistor, heater plug warning light and brake backing plate. Individual fasteners are recorded as rows inside the component they belong to (for example the nine long and eight short cylinder head bolts under *Head studs / bolts and nuts*), not yet as separate records; the spec's goal of one record per documented nut, bolt and fitting remains open until the FE35 parts book is available.

Components without any part-number reference yet (22): `silencer`, `coolant-heater`, `hyd-pump-piston-rings`, `hyd-strainer`, `lift-rod-rh`, `ball-ends`, `front-axle-extensions`, `radius-rods`, `kingpin-bushes`, `drag-links`, `starter-motor`, `dynamo`, `regulator`, `battery`, `horn`, `serial-plate`, `footplates`, `rear-wheel-centre`, `rear-rim-clamps`, `front-tyre`, `rear-tyre`, `tyre-valves`.

Components with no UK purchase reference (81): see the catalogue's "UK suppliers" column. Items without a description or function: none.

## Part numbers and quantities

No original FE35 number is confirmed (0). 521 numbers with quantities were read from the Ferguson TO35 parts book page images and stored as `partsBookReferences`. Rows from the Standard Motors Diesel engine sections are graded `listed` (270); chassis, electrical and installation rows are graded `possible` because the TO35 was US-built. 37 of them share their base number with a 2008 AGCO Heritage listing for the 35, which corroborates them (for example brake drum 827707M1 → 827707V5, timing chain 826094M1 → 826094V1, bottom hose 826988M1 → 826988V1). Where the book gives several numbers for one part (bore grades, weight grades, serial breaks) every number is kept with its condition. Quantities on the component records themselves (`quantity`) were left as they were; the per-reference `qty` carries the book's figure.

## Model relationships

775 "connected parts" links; 209 are one-way (A lists B but B does not list A). One-way links are shown in both directions by the record panel's related chips only from the side that declares them; making them reciprocal is a Phase 9 polish item. All related ids resolve (validator).

## Variant compatibility

| Axis | Meaning | Nodes restricted by option | Owner's tractor |
|---|---|---|---|
| engine | Engine | std-23c-diesel: 1, std-petrol: 0, std-tvo: 0, perkins-3-152: 0 | std-23c-diesel |
| clutch | Clutch | single-stage: 1, dual-stage: 1 | dual-stage |
| pto | PTO drive | transmission-pto: 0, live-pto: 0 | unknown (default live-pto) |
| chassis | Chassis | standard: 0, vineyard: 0, industrial: 0 | standard |
| electrics | Charging system voltage | 12v: 0, 6v: 0 | unknown (default 12v) |
| coldStart | Cold-start equipment | standard-uk: 0, cold-climate: 2 | unknown (default standard-uk) |
| diffLock | Differential lock | fitted: 1, not-fitted: 0 | unknown (default not-fitted) |

The configuration rules are in `03-configuration-rules.md`. Only the clutch, cold-start, diff-lock and engine axes restrict nodes; chassis (standard / vineyard / industrial) and electrics do not yet, because no chassis-specific or 6 V/12 V-specific component has been documented.

## Supplier links

| Supplier | References | Matches AGCO no. | Matches TO35 book | Listed for FE35 | Check fit | Last checked |
|---|---|---|---|---|---|---|
| Anglo Agriparts | 117 | 1 | 2 | 108 | 6 | 2026-11-08 |
| Agriline Products | 118 | 3 | 5 | 102 | 8 | 2026-11-08 |

Links were live when captured (SRC-039, SRC-040). This container cannot open the supplier sites directly for a bulk re-check, so broken-link detection remains a manual task: open the Research Status page and spot-check. Seven references were upgraded to `book-ref` in Phase 8 because the number the supplier quotes equals a TO35 parts-book number (lift arm 180910M1, top hose 827496M1, brake shoe set 830480M92, PTO cap 180313M1, hydraulic pump camshaft bearing 1000251M1, control spring seat 182581M1).

## Diagrams

17 drawn diagrams cover these scopes: `engine`, `cylinder-head-assy`, `engine-block-assy`, `crank-assy`, `timing-assy`, `fuel-injection`, `cooling`, `clutch`, `transmission`, `differential`, `rear-axle`, `lift-cover`, `hyd-pump`, `pto`, `front-axle`, `brakes`, `linkage`.

Spec §5.3 list:

| Spec item | Hierarchy scope | Diagram |
|---|---|---|
| Complete engine | `engine` | yes |
| Cylinder head | `cylinder-head-assy` | yes |
| Cylinder block | `engine-block-assy` | yes |
| Crankshaft assembly | `crank-assy` | yes |
| Piston and connecting rod assembly | `crank-assy` | yes |
| Fuel injection system | `fuel-injection` | yes |
| Cooling system | `cooling` | yes |
| Clutch | `clutch` | yes |
| Gearbox | `transmission` | yes |
| Differential | `differential` | yes |
| Rear axle | `rear-axle` | yes |
| Hydraulic lift | `lift-cover` | yes |
| Hydraulic pump | `hyd-pump` | yes |
| PTO | `pto` | yes |
| Front axle | `front-axle` | yes |
| Steering | `front-axle` | yes |
| Braking system | `brakes` | yes |

Assemblies without their own diagram (16): `valvetrain`, `lubrication-assy`, `flywheel-assy`, `manifolds`, `engine-controls`, `fuel`, `fuel-tank-assy`, `fuel-low-pressure`, `air-intake`, `clutch-single`, `clutch-dual`, `hydraulics`, `hyd-controls`, `electrical`, `bodywork`, `wheels`. Most are small sub-assemblies whose parts appear in their parent's diagram.

## 3D placement

Model outline: 3.07 m long, 1.65 m wide, 1.79 m high (workshop manual B.1: 117 × 64 × 54 in = 2.97 × 1.63 × 1.37 m to the bonnet; the model's height includes the exhaust stack and steering wheel). Front axle centre at x = 1.829 m against a 72 in (1.829 m) wheelbase.

Each modelled part's centre was checked against the region its system occupies on the real tractor. No part sits outside its system's region. Shapes and internal positions remain approximate as listed in `docs/model/README.md`.

Components not represented in 3D (7): `oil-strainer`, `throttle-lever`, `throttle-linkage`, `stop-control`, `brake-backing-plate`, `heater-plug-resistor`, `heater-warning-light`.

## Unresolved items

- FE35 parts book 819045M4 (SRC-032): needed to confirm every number, quantity and status; the owner has ordered a PDF copy.
- Owner's serial number and prefix letters: still unknown, so the clutch and PTO axes stay owner-reported.
- AGCO Parts Books site (parts.agcocorp.com): reachable, but its parts-book search reported "currently unavailable" on 2026-11-08; retry.
- UK FE35 electrical equipment (Lucas) is not covered by the TO35 book, which lists Delco-Remy equipment.
- Agriline engine and front-axle category pages could not be loaded (SRC-040); their references are missing.

