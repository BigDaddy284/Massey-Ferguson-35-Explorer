# 08 – Completeness report (Phase 8, updated after reading parts book 819045)

Generated 2026-11-08 by `npm run report` (`scripts/completeness-report.mjs`) from `data/*.json`, `app/js/model.js` and `app/data/mf35-diagrams.js`. Spec §16 asks for this breakdown; the application never claims to hold every component, and this report says what is still missing.

## Totals

| Measure | Count |
|---|---|
| Items identified (systems, assemblies, components) | 268 |
| Components | 235 |
| Verified | 146 (54%) (original number and quantity read from parts book 819045) |
| Partially verified | 91 (34%) |
| Variant dependent | 9 |
| Unverified | 22 (8%) |
| Original part numbers from parts book 819045 (SRC-032) | 147 – 1932 819045 rows stored on 226 items, 147 of them primary, 468 carrying a serial or engine-number condition |
| With parts-book numbers (either book) | 235 (88%) |
| TO35 parts-book numbers (SRC-041) | 521 numbers, 270 on 23C engine pages, 37 also in the 2008 AGCO catalogue, 301 also found in 819045 |
| With 2008 AGCO replacement references (SRC-038) | 90 (34%) |
| With description and function | 268 (100%) |
| In drawn exploded diagrams | 177 (66%) (17 diagrams) |
| Represented in 3D | 232 (87%) |
| With UK purchase references | 149 (56%) (235 references, 2 suppliers) |
| Fastener and small-part records (studs, bolts, nuts, pins, seals, gaskets, bushes, bearings, springs…) | 54, of which 54 carry parts-book numbers |

## By system

| System | Items | Verified | Partial | Variant | Unverified | Original no. | Parts book | AGCO 2008 | Described | Diagram | 3D | UK refs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Engine: Standard 23C diesel | 70 | 41 | 24 | 0 | 5 | 41 | 63 | 11 | 70 | 69 | 60 | 30 |
| Diesel fuel system | 21 | 8 | 8 | 0 | 5 | 8 | 16 | 7 | 21 | 6 | 16 | 9 |
| Cooling system | 11 | 9 | 0 | 1 | 1 | 9 | 9 | 4 | 11 | 9 | 10 | 8 |
| Clutch | 12 | 8 | 1 | 3 | 0 | 8 | 10 | 4 | 12 | 7 | 9 | 9 |
| Gearbox | 12 | 6 | 6 | 0 | 0 | 6 | 11 | 4 | 12 | 11 | 11 | 6 |
| Rear axle, differential and brakes | 26 | 13 | 9 | 1 | 3 | 13 | 24 | 9 | 26 | 22 | 23 | 16 |
| PTO system | 9 | 5 | 4 | 0 | 0 | 5 | 8 | 3 | 9 | 8 | 8 | 2 |
| Hydraulic lift system | 34 | 25 | 7 | 0 | 2 | 25 | 31 | 12 | 34 | 21 | 30 | 22 |
| Three-point linkage | 11 | 6 | 5 | 0 | 0 | 6 | 9 | 7 | 11 | 10 | 10 | 9 |
| Front axle and steering | 15 | 6 | 8 | 0 | 1 | 6 | 14 | 8 | 15 | 14 | 14 | 7 |
| Electrical system | 22 | 13 | 4 | 3 | 2 | 14 | 21 | 9 | 22 | 0 | 19 | 16 |
| Bodywork and operator area | 14 | 4 | 8 | 1 | 1 | 4 | 12 | 8 | 14 | 0 | 13 | 10 |
| Wheels and tyres | 11 | 2 | 7 | 0 | 2 | 2 | 7 | 4 | 11 | 0 | 9 | 5 |

## Missing components and fasteners

The hierarchy was compared with the TO35 parts book tables that were read (36 pages). Components the book lists that the hierarchy lacked were added in Phase 8: sump strainer, throttle lever, throttle rods and bellcrank, fuel shut-off control, heater plug resistor, heater plug warning light and brake backing plate. Individual fasteners are recorded as rows inside the component they belong to (for example the nine long and eight short cylinder head bolts under *Head studs / bolts and nuts*), not yet as separate records; the spec's goal of one record per documented nut, bolt and fitting remains open; the 819045 fastener rows (studs, bolts, washers) are now attached to their parent components as references.

Components without any part-number reference yet (6): `coolant-heater`, `ball-ends`, `serial-plate`, `front-tyre`, `rear-tyre`, `tyre-valves`.

Components with no UK purchase reference (94): see the catalogue's "UK suppliers" column. Items without a description or function: none.

## Part numbers and quantities

147 components carry their original part number and quantity read from the AGCO MF35 / 35X parts book 819045 (SRC-032, the owner's copy); they are the only records marked verified. A number was taken as the 1958 original only when its row names the 23C (or no engine) and any serial condition covers the whole 1958 Coventry range 79553-125067; the earlier (J)/(N) service-engine rows were preferred over the later (K)/(P) rows. 79 components have 819045 rows but no settled number because they are composite sets, grade-selected parts, or alternatives the book lists without a condition: `core-plugs`, `block-studs-dowels`, `head-studs-nuts`, `combustion-chamber-insert`, `valve-spring-inner`, `valve-spring-outer`, `valve-cap-collets`, `rocker-arm`, `thrust-washers`, `gudgeon-pin`, `conrod`, `camshaft-bearings`, `injection-pump-drive`, `oil-strainer`, `oil-pipes`, `oil-pressure-relief`, `flywheel`, `throttle-linkage`, `stop-control`, `fuel-tap`, `fuel-tank-mountings`, `fuel-pipes-lp`, `injector-pipes`, `injector-seals`, `fuel-leak-off`, `air-cleaner`, `air-intake-pipe`, `clutch-housing`, `gearbox-gears`, `range-gears`, `selector-forks`, `gearbox-bearings`, `gearbox-top-cover`, `diff-gears`, `diff-lock`, `wheel-studs-rear`, `axle-seals`, `brake-backing-plate`, `brake-springs`, `brake-pedals`, `brake-linkage`, `parking-brake`, `pto-gears`, `pto-bearings`, `pto-guard`, `hyd-pump-cam-blocks`, `hyd-control-valve`, `hyd-pump-body`, `internal-control-linkage`, `lift-rod-rh`, `check-chains`, `linkage-pins`, `front-axle-extensions`, `front-axle-pivot-pin`, `stub-axle`, `kingpin-bushes`, `front-hub`, `steering-box`, `steering-column-bearing`, `front-axle-support`, `battery-cables`, `headlamps`, `rear-lamp`, `tractormeter`, `horn`, `heater-plug-wiring`, `bonnet`, `side-panels`, `dashboard`, `seat`, `seat-support`, `footplates`, `front-weights`, `dashboard-supports`, `rear-wheel-centre`, `rear-rim-clamps`, `front-wheel-nuts`, `rear-wheel-nuts`, `wheel-brace`. 9 components have no 819045 row at all: `coolant-heater`, `rear-hub`, `lift-cover-gasket`, `ball-ends`, `temp-gauge`, `serial-plate`, `front-tyre`, `rear-tyre`, `tyre-valves`. 521 numbers with quantities were read earlier from the Ferguson TO35 parts book page images and stored as `partsBookReferences`. Rows from the Standard Motors Diesel engine sections are graded `listed` (270); chassis, electrical and installation rows are graded `possible` because the TO35 was US-built. 37 of them share their base number with a 2008 AGCO Heritage listing for the 35, which corroborates them (for example brake drum 827707M1 → 827707V5, timing chain 826094M1 → 826094V1, bottom hose 826988M1 → 826988V1). Where the book gives several numbers for one part (bore grades, weight grades, serial breaks) every number is kept with its condition. 301 of the TO35 numbers also appear in 819045 (flagged `inBook819045`); the rest are mostly superseded by later numbers in 819045 (cylinder block 827483M91 → 1884088M91, exhaust valve 826169M1 → 1884124M1, conrod bolt 826081M1 → 1884110M1). Quantities on verified records come from the 819045 row (per tractor where the book lists per-bank or per-rod figures, with a note).

## Model relationships

842 "connected parts" links; 228 are one-way (A lists B but B does not list A). One-way links are shown in both directions by the record panel's related chips only from the side that declares them; making them reciprocal is a Phase 9 polish item. All related ids resolve (validator).

## Variant compatibility

| Axis | Meaning | Nodes restricted by option | Owner's tractor |
|---|---|---|---|
| engine | Engine | std-23c-diesel: 1, std-petrol: 0, std-tvo: 0, perkins-3-152: 0 | std-23c-diesel |
| clutch | Clutch | single-stage: 1, dual-stage: 1 | dual-stage |
| pto | PTO drive | transmission-pto: 0, live-pto: 0 | unknown (default live-pto) |
| chassis | Chassis | standard: 0, vineyard: 0, industrial: 0 | standard |
| electrics | Charging system voltage | 12v: 0, 6v: 0 | unknown (default 12v) |
| coldStart | Cold-start equipment | standard-uk: 0, cold-climate: 3 | unknown (default standard-uk) |
| diffLock | Differential lock | fitted: 1, not-fitted: 0 | unknown (default not-fitted) |

The configuration rules are in `03-configuration-rules.md`. Only the clutch, cold-start, diff-lock and engine axes restrict nodes; chassis (standard / vineyard / industrial) and electrics do not yet, because no chassis-specific or 6 V/12 V-specific component has been documented.

## Supplier links

| Supplier | References | Exact (819045) | Matches AGCO no. | Matches a book no. | Listed for FE35 | Check fit | Last checked |
|---|---|---|---|---|---|---|---|
| Anglo Agriparts | 117 | 3 | 1 | 0 | 107 | 6 | 2026-11-08 |
| Agriline Products | 118 | 8 | 2 | 4 | 96 | 8 | 2026-11-08 |

Links were live when captured (SRC-039, SRC-040). This container cannot open the supplier sites directly for a bulk re-check, so broken-link detection remains a manual task: open the Research Status page and spot-check. A reference is `exact` when the supplier quotes the original 819045 number (lift arms 180910M1, top and bottom hoses 827496M1 / 826988M1, clutch pedal 1861169M1, brake shoes 1810348M91, hydraulic pump camshaft bearing 1000251M1, levelling box 182642M94); `book-ref` now means a match with a TO35 number or a non-primary 819045 row.

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

Model outline: 3.09 m long, 1.67 m wide, 1.78 m high (workshop manual B.1: 117 × 64 × 54 in = 2.97 × 1.63 × 1.37 m; the model's height includes the exhaust stack and steering wheel). Front wheel centre at x = 1.829 m against a 72 in (1.829 m) wheelbase.

Each modelled part's centre was checked against the region its system occupies on the real tractor. No part sits outside its system's region. Shapes and internal positions remain approximate as listed in `docs/model/README.md`.

Components not represented in 3D (3): `heater-plug-resistor`, `heater-warning-light`, `wheel-brace`.

## Unresolved items

- Owner's plates read on 2026-11-08: prefix SDM (standard chassis, 23C diesel, dual-stage clutch) with a 1958 serial, and a 23C engine number; the numbers themselves are kept by the owner and are not in the repository. They settled the lift pump, injectors, dipstick, oil filter, head bolts, gasket set, nose badge and De Luxe gearbox rows. The trailing S on the engine number is unexplained.
- AGCO Parts Books site (parts.agcocorp.com): reachable, but its parts-book search reported "currently unavailable" on 2026-11-08; retry.
- UK FE35 electrical equipment (Lucas) is not covered by the TO35 book, which lists Delco-Remy equipment.
- Agriline engine and front-axle category pages could not be loaded (SRC-040); their references are missing.

