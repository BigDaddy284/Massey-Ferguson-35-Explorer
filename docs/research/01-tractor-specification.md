# 01 — Tractor specification: 1958 Massey Ferguson 35 diesel

Phase 1 deliverable. Researched 2026-11-07. Every figure cites a source id from
[`data/sources.json`](../../data/sources.json) (summarised in
[02-source-register.md](02-source-register.md)).

**Verification key:** **V** verified against a primary (factory/AGCO) source ·
**PV** partially verified (two or more independent secondary/supplier sources agree, or one good secondary source) ·
**U** unverified (single weak source, or inferred) · **VD** variant dependent.

> **Update 2026-11-07:** the FE-35/MF35 Workshop Service Manual (scan, SRC-035) has been read.
> See §0 below for what it verified and corrected. The tables in §1–§8 are the original
> Phase 1 findings; where §0 differs, §0 wins. The parts book (819045M4) is still needed for
> part numbers and quantities. See
> [05-documentation-and-modelling-resources.md](05-documentation-and-modelling-resources.md).

## 0. Workshop manual check (SRC-035)

Page references are the manual's own (section.page). Full figures are in
[`data/technical.json`](../../data/technical.json).

| Item | Manual says | Effect |
|---|---|---|
| Serial codes (B.1) | Chassis S/V/J; engine G, H, D (23C), N (3-A-152), K, L; clutch F single, M dual | **V.** Perkins letter is **N**, not P (SRC-003 wrong). Other supplier letters not in the manual |
| De Luxe (B.1) | Dual clutch, live PTO, Tractormeter, cushion seat | **V** |
| 23C data (B.29) | 3 5/16 × 4 in, 137.89 cu in (2,259 cc), 20:1, 1-3-4-2, 37.25 bhp, 35.9 belt hp, 100 lb ft at 1,600 rpm | **V** |
| Performance (B.2) | 34 hp at PTO, 31.5 drawbar hp | **V.** Resolves the "34 / 35.9 / 37 hp" question: they are different ratings |
| Combustion (C, B.38) | Indirect injection, Ricardo Comet pre-combustion chamber insert in the head | **V** |
| Liners (B.32–33) | Removable flanged sleeves, graded F/G/H, standard size only, stand-out .001–.004 in | Wet/dry **still not stated**; conflict stays open |
| Torques (B.29–30) | Head 100–105, con-rod 65–70, flywheel 90–100, centre main housing 39–42 lb ft, and others | **V.** SRC-006 mixed lb ft and Nm |
| Valves (B.37–38) | Inlet .012 in, exhaust .008 in cold; timing IO 10½° BTDC, IC 37½° ABDC, EO 45½° BBDC, EC 10½° ATDC | **V** |
| Fuel (B.41) | DPA 3240011/12/13/15 at 19° BTDC, 3242643/45 at 13°; Pintaux nozzles change at engines SJ 86046E and SJ 125725E; 130 atm; AC YD lift pump; Thermostart or Ki-gass; AC oil-bath air cleaner | **V** |
| Electrics (B.42) | 12 V from 2 × 6 V batteries; dynamo C39P2; starter M45G | **V** (12 V settled for the diesel) |
| Clutch (I.1, I.4) | Diesel single 10 in, 12 springs, ¾ in pedal free play; dual 11 in + 9 in, 2 Belleville springs, ⅜ in free play | **V** |
| Gearbox (J.4) | 6F/2R; overall reductions 205.5 … 18.7:1; road speeds 1.28–14.0 mph at 2,000 rpm; 6.6 gal oil | **V** |
| PTO (M.3) | 6-spline 1⅜ in shaft; 540 rpm at 1,500 engine rpm; ground-speed option | **V** |
| Hydraulics (L.5–6) | Four-cylinder pump, two yokes, two opposed valve chambers, relief 2,500 psi, no check valve | **V.** Supplier 2,300/2,800 psi valves are not the stated original |
| Dimensions, weight, capacities (B.1–2) | Wheelbase 72 in; 3,158 lb basic / 3,198 lb De Luxe; fuel 7½ gal; cooling 15 pints; sump 12 pints | **V** |


---

## 1. Identity

| Item | Finding | Status | Sources |
|---|---|---|---|
| Builder / factory | Massey-Harris-Ferguson, Banner Lane, Coventry, England | PV | SRC-001, SRC-004 |
| Model naming | Launched 1 Oct 1956 as Ferguson FE35. Rebadged MF35 during 1957. Ferguson branding on some new tractors into 1958 | PV | SRC-001, SRC-002, SRC-003 |
| Colour | Grey/gold at launch; MF red and grey from December 1957, so a 1958 tractor should be red tinwork and grey castings | PV | SRC-001, SRC-002, SRC-010 |
| 1958 serial range | **79553–125067**. Year-start figures: 1958 = 79553, 1959 = 125068 | PV | SRC-002, SRC-003, SRC-004, SRC-006 |
| Serial plate | On the dashboard / instrument console; position varies by model | PV | SRC-002, SRC-003 |
| Serial prefix | Letter code of chassis + fuel + clutch (see §8). For example SDM would read Standard chassis, Standard Diesel, dual-stage clutch. That example is decoded from the letter table; no 1958 plate reading SDM has been seen yet | U | SRC-003 |
| Production overlap | The 1958 range is entirely after the serial-65685 hydraulic change and before the Perkins 3.152 change (c.165596, 1959) | PV | SRC-002, SRC-012 |

**Conflicts recorded:** Wikipedia says the rebadge came "after 73,655 units", and
Anglo's identification table says FE35 "up to serial No 74655". Both disagree
with the 1957 year-start of 9226. These figures relate to the name change, not the
year. They don't affect the 1958 range, but the app's identification guide must not
use them to date a tractor.

## 2. Engine: Standard Motor Company 23C diesel

| Item | Finding | Status | Sources |
|---|---|---|---|
| Type | 4-cylinder in-line, 4-stroke diesel, liquid cooled | PV | SRC-005, SRC-006 |
| Introduced | 1956, successor to the 20C | PV | SRC-007 |
| Bore | 84.137 mm (3.3125 in / 3 5/16 in) | PV | SRC-006, SRC-007, SRC-008 |
| Stroke | 101.6 mm (4.0 in) | U | SRC-006 (single source; consistent with 137.89 cu in in SRC-005) |
| Swept volume | **2,259.6 cc** from bore × stroke. Quoted as 2,258 cc (product spec), 2,259 cc (SRC-006), 2,260 cc (SRC-007) and 137.89 cu in (SRC-005). These are rounding differences, not variants | PV | SRC-005, SRC-006, SRC-007 |
| Compression ratio | 20:1 | PV | SRC-005, SRC-006 |
| Firing order | 1-3-4-2 | PV | SRC-005, SRC-006 |
| Combustion system | Chamber developed by Freeman Sanders. Direct or indirect injection is **not yet established** | U | SRC-009 |
| Cylinder liners | **Conflict.** SRC-008 says dry liner, and SRC-018 sells pre-finished slip-fit liners (consistent with dry). SRC-007 places the 23C in a "wet liner" engine family article but gives no citation for the 23C | U | SRC-007, SRC-008, SRC-018 |
| Camshaft drive | Timing **chain** (62 pitches) with tensioner and sprockets, so the timing gears listed in the product spec are likely incorrect for the camshaft | PV | SRC-008 |
| Pistons | Two ring layouts exist (4-ring and 5-ring). Could be a supersession or a variant; unresolved | U | SRC-008, SRC-019 |
| Power | Quoted as 34 hp, 35.9 belt hp and 37 hp. The rating basis (belt, PTO, gross) differs and has not been resolved | U | SRC-005, SRC-006, SRC-011 |
| Injection pump | CAV DPA distributor pump, code 3240011 | U | SRC-006 |
| Injector break pressure | 130 atm | U | SRC-006 |
| Valve clearance (cold) | Inlet 0.305 mm (0.012 in), exhaust 0.203 mm (0.008 in) | U | SRC-006 |
| Journal sizes | Main 69.901 mm, big end 58.712 mm, gudgeon pin 28.579 mm | U | SRC-006 |
| Torque figures | Superseded: see §0. SRC-006's figures mixed lb ft and Nm | V | SRC-035 |
| Starting reputation | Poor cold starter; MF trialled Perkins conversions c.1958 | PV | SRC-009, SRC-021, SRC-022 |
| Cold-start aids | Most UK 23C 35s **lacked** per-cylinder heater plugs. Cold-climate tractors had them, plus a coolant heater. Intake manifold has a heater boss | VD | SRC-009, SRC-020, SRC-022 |
| Engine number | No plate. Stamped into the block **just above the generator, right-hand side** | PV | SRC-003 |
| Later history | Became the Leyland OE.138 after 1961 (relevant for parts interchange research only) | U | SRC-007 |

**Not the original engine:** the Perkins 3.152 (introduced 1959, c. serial 165596)
and the A3.152 (MF35X, 1962) are **not** 1958 equipment (SRC-001, SRC-002, SRC-009).
If the owner's tractor has a 3-cylinder engine, it has been re-engined.

## 3. Fuel, air and cooling

| Item | Finding | Status | Sources |
|---|---|---|---|
| Injection | CAV DPA pump, 4 injectors, high-pressure pipes, leak-off return | U | SRC-006 |
| Lift pump | Present; SRC-019 lists two different "fuel pump" items for the 23C | U | SRC-019 |
| Air cleaner | Oil-bath type assumed (period Ferguson practice). **Not sourced yet** | U | — |
| Cooling | Liquid cooled; pump, thermostat, radiator. Thermostat and water pump are listed in 23C rebuild kits | PV | SRC-005, SRC-018 |
| Capacities | **Not yet sourced.** Needs operator book 819046M1 | — | — |

## 4. Clutch, gearbox and PTO

| Item | Finding | Status | Sources |
|---|---|---|---|
| Clutch options | **Single-stage** (Standard model) or **dual-stage** (De Luxe model) | PV | SRC-001, SRC-003, SRC-010, SRC-011 |
| Dual-stage action | Pedal half-way disengages the gearbox but keeps PTO and hydraulic pump driven. Fully down disengages both | PV | SRC-001, SRC-010 |
| Gearbox | 6 forward, 2 reverse, unsynchronised: a 3-speed-and-reverse box with high/low range | PV | SRC-004, SRC-010, SRC-027 |
| Levers | Left (long) lever: 1–3 and reverse. Right (short) lever: high / low and a neutral "start" safety position. Gear pattern cast into housing | PV | SRC-010 |
| PTO speed | 540 rpm | PV | SRC-004, SRC-027 |
| PTO drive | Transmission-driven on single-clutch tractors (stops with the clutch). Live on dual-clutch tractors (keeps turning with the pedal half-way) | PV | SRC-004, SRC-010 |
| PTO shaft spline/size | **Not sourced** | — | — |
| Road speeds, ratios | **Not sourced** | — | — |

**Owner's tractor:** it has a PTO, but that is true of both clutch types. Whether
it has live PTO **cannot** be assumed. It is settled by:

1. The third letter of the serial prefix (M = dual-stage, F = single-stage; SRC-003).
2. A physical test. With the PTO engaged and engine running, press the clutch pedal
   half-way. If the PTO keeps turning while the tractor stops, it is dual-stage.
3. A tractormeter on the dash suggests the De Luxe package (SRC-010), but it is not proof.

## 5. Rear axle, differential and brakes

| Item | Finding | Status | Sources |
|---|---|---|---|
| Final drive | Spiral bevel crown wheel and pinion with differential in centre housing; half shafts in axle trumpets. Layout inferred from Ferguson system design; **gear type not sourced** | U | — |
| Brakes | Shoe brakes on the differential shafts ("differential shoe brakes"), independent pedals | PV | SRC-004 |
| Differential lock | A diff lock was "added" during the 35's life; **date not established**. Treated as variant until confirmed for 1958 | VD | SRC-010 |
| Casting date codes | Day/month/year on RH side of centre housing forward of the round port. Useful for dating | PV | SRC-003 |

## 6. Hydraulic lift and three-point linkage

| Item | Finding | Status | Sources |
|---|---|---|---|
| System | Ferguson System hydraulics with **draft control** (sensed through the top link and a main control spring) and **position control**, selected by twin levers on a quadrant | PV | SRC-009, SRC-010, SRC-012, SRC-023 |
| Pump drive | Driven with the PTO drive line, so it keeps working with the clutch half-way on dual-stage tractors and stops with the clutch on single-stage tractors | PV | SRC-001, SRC-010 |
| Pump type | Camshaft-driven piston pump; cam blocks (front/rear) sit inside the pistons; valve chamber(s) and strainer. Supplier kits supply **2 pistons**. Total piston count to be confirmed from the parts book | PV | SRC-012, SRC-013, SRC-014 |
| Pump version | Pistons and valve chamber changed **from serial 65685**, so all 1958 tractors have the later design | PV | SRC-012 |
| Lift ram | Single-acting ram in the lift cover; **3 in** piston ring set from serial 65685 (2.5 in before) | PV | SRC-012 |
| Rockshaft | Cross shaft in 4 bushes (60.2 × 50.8 × 35.8 mm); lift arms on 37 splines | U | SRC-012 |
| Relief valve | Supplier lists 2300/2800 psi relief valves. **Applicability and original pressure not established** | U | SRC-012 |
| Linkage | Category I three-point linkage: two lower links, top link, lift rods (RH with levelling box), check chains | PV | SRC-004 |
| Supplier-claimed OEM numbers | Pump 184472M93 / 184473M1 / 184473M93 / 184473M92; valve chamber 184471M1; cam blocks 180924M1 / 180925M1; piston 190799M1; rings 892604M1. **Not verified**: from suppliers and a forum post, pending the parts book | U | SRC-012, SRC-014 |

**How lift works (summary for the explainer, to be checked against the service manual):**
the engine drives the PTO drive line, which turns the pump camshaft. The pump pistons
deliver oil from the transmission/centre-housing sump to the ram cylinder in the lift
cover, through the control valve. The ram pushes the rockshaft round, and the lift arms
pull the lift rods and lower links up. In draft control, top-link compression acts on
the main control spring and moves the control valve. This raises the implement slightly
when soil resistance rises and lowers it when resistance falls. In position control,
the lever sets a lift-arm height and the valve holds it there.

## 7. Electrical

| Item | Finding | Status | Sources |
|---|---|---|---|
| Make | Lucas | PV | SRC-003 |
| Voltage | 12 V starter on the diesel (SRC-005). SRC-006 lists both a 6 V (C45X) and a 12 V (C39P/2) dynamo without assigning them | U | SRC-005, SRC-006 |
| Starter | Lucas M45G, 11-tooth pinion | U | SRC-006 |
| Instruments | Ammeter, temperature and oil pressure gauges assumed; tractormeter on De Luxe | U / VD | SRC-010 |

## 8. Identification guide (draft content for the app)

1. **Serial plate:** on the dash/instrument console (SRC-002, SRC-003). Record the full
   prefix and number. 79553–125067 dates the tractor to 1958.
2. **Prefix letters** (SRC-003, letter table, not yet confirmed against a UK plate):
   - 1st letter, chassis: S standard, C high clearance, R/T row crop, J industrial, V vineyard, U utility/turf
   - 2nd letter, fuel: D Standard diesel, G petrol, K TVO, L lamp oil, N Perkins 3-A-152 diesel (SRC-035; SRC-003 says P), B LPG, H high-altitude petrol
   - 3rd letter, clutch: M dual-stage, F single-stage, W Multi-Power (MF35X only, not 1958)
3. **Engine number:** stamped on the block above the dynamo, right-hand side (SRC-003).
   A 4-cylinder engine with that stamping is consistent with the 23C. A 3-cylinder engine
   means a Perkins replacement.
4. **Castings:** date codes on the centre housing (RH side) corroborate the build date (SRC-003).
5. **Plate missing:** the tractor serial was recorded only on the plate (SRC-024). Use
   casting dates and engine number, and contact Friends of Ferguson Heritage, who keep
   records of UK-built 35s (SRC-024).

## 9. Owner's tractor: what is known

| Attribute | Value | Status |
|---|---|---|
| Model / year | MF35, believed 1958 | Owner belief, unconfirmed |
| Engine | Diesel; Standard 23C provisional | Provisional |
| Hydraulic lift, 3-point linkage, rear PTO | Fitted | Owner confirmed |
| Serial number / prefix | Unknown (tractor not accessible) | — |
| Clutch / PTO type | **Dual-stage clutch, live PTO.** Owner reports (2026-11-07) that the tractor can be slowed with the clutch while attached equipment keeps working | Owner-reported; serial prefix (M) not yet seen |
| Electrics, cold start, diff lock, seat | Unknown | — |

## 10. Open questions (priority order)

1. Owner: serial plate prefix and number; engine number; clutch half-pedal PTO test.
2. Obtain parts book 819045M4 (in print from AGCO dealers, c. £136; SRC-016). This
   unlocks OEM numbers and quantities across the whole catalogue.
3. Obtain service manual 1448811M1 and diesel supplement 690560M1 for torques,
   clearances, capacities and the hydraulic and PTO internals.
4. Resolve: liner type (wet/dry), combustion system, piston ring variants, pump piston
   count, voltage, diff-lock fitment date, rated power basis.
5. Gather overall dimensions (wheelbase, track, heights, tyre sizes). Needed for an
   accurate 3D model and not available from any source read so far.
