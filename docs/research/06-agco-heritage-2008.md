# 06 — AGCO Heritage parts catalogue (2008): current AGCO numbers for 35 / 23C parts

**Source:** SRC-038, *2008 AGCO Heritage Parts and Merchandise Catalog* (AGCO Corporation, 342 pages),
supplied by the owner as `mfheritage.pdf` on 2026-11-07. Every page carrying "35", "35X", "TO35",
"FE 35", "TE35" or "23C" was read from the layout text and the ambiguous tables were checked
against rendered page images. Page numbers below are the catalogue's **printed** page numbers
(PDF page = printed page + 2).

## What these numbers are, and are not

- They are the numbers AGCO used **in 2008** to supply the part. Most carry a `V91`/`V92`/`V1`
  suffix, AGCO's Heritage-line coding; the catalogue itself prints the "OEM equivalent" with an
  `M` suffix beside some of them (e.g. clutch cover 180263V91 = 180263M91). A Heritage number may
  supersede the number printed in the 1958 parts book 819045M4.
- They are therefore recorded as **`replacementReferences`** on the hierarchy node, never as
  `oemPartNumber`. A node's `oemPartNumber` stays empty until checked in 819045M4 (SRC-032).
- The catalogue is US-oriented. Model lists mix the US-built TO35/MF35 (Continental petrol and
  Perkins A3.152 diesel) with the Coventry FE35/35 (23C and 87 mm Standard engines). A row is
  quoted here only where it names the 23C, "35 Diesel", "FE 35", or the 35/35X without an
  engine restriction. Rows that name a Perkins or Continental engine are left out even when "35"
  appears in the model list.
- **Serial breaks in this catalogue are US TO35/MF35 serials** (e.g. "35 Eff. SN 232850",
  "35 SN 207753–219470"). They must not be applied to Coventry serials (CLAUDE.md rule). Where a
  row only covers a serial range, that is said in the notes and the reference is kept as a
  *possible* fit.
- Engine serial breaks such as "Eff. Eng. SN SJ37180E" are 23C engine numbers (the SJ prefix is a
  Standard engine series). The owner's engine number is not yet known, so both sides of such a
  break are recorded.

## Engine (Standard 23C)

| Part | Heritage no. | Catalogue row (models / notes) | Page | Node |
|---|---|---|---|---|
| Piston kit | **830972V92** | "Standard Motor Diesel - 23C", MF35X; TO35 row shows *na* | 168 | `piston` |
| Ring kit | **836117V91** | same row (Ring Kit column; **not** a liner, correcting the text-extract guess in SRC-038) | 168 | `piston-rings` |
| Liner | — | No 23C liner listed (liner table is 3.152 only) | 168 | — |
| Inlet valve | **1884123V1** | 35, 35X, TO35 Standard Motors Diesel | 171 | `inlet-valve` |
| Exhaust valve | **1884124V1** | 35, 35X, TO35 Standard Motors Diesel | 171 | `exhaust-valve` |
| Inlet valve guide | **825259V1** | TEA20, 35, 35X, TO35, 135 UK (engine not stated; the TEA20/135 UK pairing points to the Standard family) | 172 | `inlet-valve-guide` |
| Top gasket set | **1810028V91** | "35 and 35X (Eff. Eng. SN SJ41890E), TO35 - 23C Diesel" | 175 | `cylinder-head-assy` |
| Bottom gasket set | **1810027V91** | Printed MUO "175 23C Diesel Engine"; the 175 never had a 23C, so "175" is almost certainly a misprint for 35. Treated as the 23C bottom set with that caveat | 176 | `engine-block-assy` |
| Big-end bearing set, standard | **830899V91** | "23C Diesel - Standard Motors Diesel", 35, 35X, TO35; undersizes *na*. The table is headed "Large end bushings" but its columns are Std / −.010 / −.020 / −.030, i.e. bearing shells | 178 | `big-end-bearings` |
| Timing chain | **826094V1** | 35, 35X, TO35 (23C Engine) | 183 | `timing-chain` |
| Flywheel ring gear, 132 teeth | 741138V1 | MH50, MF50, TE20, TO20, TO30, TO35, 35, 20, 30, 40, 50, 65, 135… (engine not stated) | 183 | `ring-gear` (possible) |
| Fan belt | **826960V1** | "FE 35 Diesel (23C)". The same table also lists 184930V1 for "TO 35 Diesel (23C)" and 186976V1 for "35 Diesel": three numbers for apparently the same application, recorded as a conflict | 188 | `fan-belt` |
| Engine oil filter element | **1018121V91** | FE 35 Diesel (7.5 qt / 7.0 L, 100 hr); TO35 Standard Motors Diesel (10 qt). Capacity conflict noted | 92 | `oil-filter` |
| Crankshaft front seal | 825740V1 | TE20, 35, 35X, TO35, 135 UK "80mm, 87mm Engines" (petrol sizes; 23C not named) | 180 | doc only |
| Crankshaft rear seal | 825208V1 | same row wording | 181 | doc only |
| Governor assembly | 825890V91 | 35, 35X, 135 UK (87MM Engine) — petrol, not applicable | 183 | — |
| Engine overhaul kits | — | MF35 kits are Continental / A3.152 only; **no 23C overhaul kit** | 142 | — |
| Connecting rod | 3637439V91 | 202, 203, 205, 35, 50, 65 — Perkins list, not applicable | 177 | — |

## Fuel system

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Fuel filter, primary | **1012006V2** | FE 35 Diesel; also TO35 Standard Motors Diesel | 92 | `fuel-filters` |
| Fuel filter, secondary | **1850450V2** | FE 35 Diesel (500 hr) | 92 | `fuel-filters` |
| Sediment bowl element | **632952M1** | FE 35 "Gas Sediment Bowl: Element" | 92 | `sediment-bowl` |
| Sediment bowl glass | **1004498V1** | Diesel - TO35, 35, 35X, MF50… | 208 | `sediment-bowl` |
| Fuel tap | **1851653V91** | TE 20, TEA 20, 35, 35X, 65, 135 UK, 165 UK… (UK list) | 205 | `fuel-tap` |
| Fuel lift pump | **1884857V91** | 35 & 35X (Eff. Eng. SN SJ37180E) - 23C Engine | 209 | `fuel-lift-pump` |
| Fuel lift pump, early | **826154V91** | 35 & 35X (Prior to Eng. SN SJ37180E) - 23C Engine | 209 | `fuel-lift-pump` |
| Injection pump | 881306V91 | "35 C.A.V. # 3230030, 50 MF & 50 Harris" DPA 32.30.F030 — engine not stated; MF50 is Perkins, so not attached | 210 | doc only |
| Injector nozzle | 1447252V1, 1851744V1 | "202, 203, 205, 35, 35X FE, 50" — Perkins list, not attached | 210 | doc only |
| Fuel tank webbing | 520948V91 | Pony… TO35, 40, 50, 65… (tank strap webbing) | 204 | `fuel-tank` |
| Air cleaner hose to manifold | **890258V1** | 35, 35X (FE) | 256 | `air-intake-pipe` |
| Air cleaner hose connection | **1884897V1** | 35, 35X (FE), TO 35 | 256 | `air-intake-pipe` |
| Air cleaner bottom oil cup, 12 in | 71125804V | 35 Diesel, 65 Gas, 85, 88… ("12" Diameter, 3" to 4" inlet") | 256 | `air-cleaner` |
| Intake (pre-cleaner) assembly | 001210V91 | 35, 35X, 135 UK, 231, 240… | 256 | `air-intake-pipe` |

## Cooling

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Radiator cap | **3475308V1** | 35, 35X, TO35, 135 UK, 165 UK, 175 UK (pressurised) | 195 | `radiator-cap` |
| Radiator | 186830V91 (cap 180224V92) | "TO35, 35 (Eff. Tr. SN 204181), 202" — US serial; a second row "35: 894319V92" has no notes | 195 | `radiator` (possible) |
| Bottom hose | 826988V1 | TO35 (all); 35, 35X (FE) 87 mm petrol and A3.152 rows. 23C not listed separately, lower hose common to all | 198 | `bottom-hose` (possible) |
| Top hose | — | Only 87 mm petrol (826775V1) and A3.152 (890195V1) rows | 198 | — |
| Fan shroud | 194379V93 | 35, 135, 235, 230, 2135 | 195 | doc only |
| Fan belt | see engine table | | 188 | |

## Clutch and gearbox

The catalogue lists only the **single-plate** clutch for the 35/TO35 (pages 284 and 286). No dual-stage
(live-PTO) clutch set is listed for the 35, so nothing is attached to the `clutch-dual-*` nodes.

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Clutch set (cover + disc) | 79022255 | TO 35 and 35 (no serial note) | 286 | `clutch-single` |
| Clutch cover | **180263V91** (OEM equivalent 180263M91) | TO 35, 35, 50, 135 | 286 | `clutch-single-cover` |
| Clutch disc | **181114V91** (OEM 181114M91) | TO 35, 35 | 286 | `clutch-single-plate` |
| Release bearing | **833085V2** (1.526 in wide) or **894303V1** (1.53 in wide) | TO 35, 35 | 286 | `release-bearing` |
| Clutch set, late | 79022262: cover 526666V91, disc 516068V93 | "35 SN 177395–177819, Eff. SN 177358" — US serials | 286 | doc only |
| Countershaft, 15 teeth | **183054V92** | 35, 35X, TO35 (Eff. SN 171549), MF50, 65… | 185 | `countershaft` |
| Reverse idler shaft | 180445V1 | 35, 35X, TO35… | 185 | `gearbox-gears` |
| Pinion, 3rd, 33 splines | 180415V1 | 35, 35X, TO35, 50, 65… | 186 | `gearbox-gears` |
| Gear, 45 teeth, 18 splines | 1682688V1 | 35, 35X, TO35 (Eff. SN 171549)… | 186 | `gearbox-gears` |
| Gear, 46 and 36 teeth, 18 splines | 1682691V2 | 35, 35X, MF50/MH50 (Eff. Trans. SN CN13566)… | 186 | `gearbox-gears` |
| Reverse cluster gear, 21 and 13 teeth | 183040V1 | 35, 35X, TO35… | 187 | `gearbox-gears` |
| Oil-level indicator cover gasket | 181217M3 | TE35, TO35, 35… | 185 | `gearbox-top-cover` |
| Gear lever knob, 3 speed | 180006V91 | Pony, TO20, TEA20, TO30, 35… | 62 | `gear-lever-main` |
| Gear shift boot | 180579V3 | TE20, TO20, TO30, TO35, TE35, 35… (also 520858V1 for 35, 50, 65…) | 62 | `gear-lever-main` |

## Rear axle, differential and brakes

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Crown wheel and pinion, matched, light duty | 1683757V91 | 35, 35X, MF50, MH50, TO35 (Eff. SN 169467)… | 315 | `differential` |
| Differential pinion nut, 1-3/4 in NF tapered | 532956V1 | …35, TO35… | 316 | `pinion` |
| Differential lock fork | 190968V1 | …35X (Eff. SN 383201), 35, MF50, MH50 | 316 | `diff-lock` |
| Axle collar bearing | 180596V1 | …35, 35X, MF50, MH50, TO30, TO35 | 316 | `half-shaft` |
| Rear axle seal, 2-3/4 × 3-5/8 × 19/32 in | **195677V1** | …35, 35X, MH50, MF50, TO20, TO30, TO35 | 317 | `axle-seals` |
| Rear axle seal, 2-1/8 × 2-7/8 × 1/2 in | **195678V2** | …35X, MF50, MH50, TO35 | 317 | `axle-seals` |
| Differential housing gasket | 183254V1 | …35, 35X, MF50, MH50, 65, TO30, TO35 | 317 | `centre-housing` |
| Lift cover gasket | **886549V2** | …35, 35X, MF50, MH50, 65, TO30 | 317 | `lift-cover-gasket` |
| Axle assembly kit | 183256V92 | …35, MF50, MH50, TO35 (contents not stated) | 314 | doc only |
| Brake shoes, lined | **830480V93** | "TO35 (23C & A3-152), 35" | 319 | `brake-shoes` |
| Brake drum | **827707V5** | same row | 319 | `brake-drum` |
| Brake springs | **180815M1** (anchor), **180832M1** ×2 (return) | same row | 319 | `brake-springs` |

## PTO

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| PTO shaft, 540 rpm, 10 spline | **181204V92** | 35, 35FE, 50 MF, 50 MH, 65, TO35, 135… | 309 | `pto-output-shaft` |
| PTO cap | **1868778V1** | TO 35, 35, 35X, MF 50… | 309 | `pto-guard` |
| PTO retainer housing | 1860889V91 | 35, 35X, MF50, MH50, 65… (the list includes "150 Eff. Trans. SN CY2318 w/live PTO") | 309 | `pto-housing` |
| PTO retainer housing | 1867223V1 | 20 (Eff. SN 9A159958)… 35, 35X, MF50, MH50, 65, TO35 | 309 | `pto-housing` |
| PTO retainer | 180465V1 | 20, 202, 203… 35, 35X, MF50, MH50, 65, TO35 | 310 | `pto-housing` |

Two retainer housings are listed for the 35 without a stated difference; recorded as a conflict.

## Hydraulic lift

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Lift cylinder, 3 in | 190859V1 | "35 (Eff. SN 232850), 35X, MF50, 65, TO35 (Prior to SN 165554)" — **US serials**; early TO35 (prior to SN 179304) used a 2-1/2 in piston 79024381V / rings 180898V1 | 304 | `lift-cylinder` (possible) |
| Lift piston, 3 in | 184443V91 | same row | 304 | `lift-piston` (possible) |
| Lift piston rings | 830741V91 | same row | 304 | `lift-piston-rings` (possible) |
| Lift shaft (rockshaft) | **184359V91** | TO35, 35, 50, 65, 135, 150, 165, 230 | 304 | `rockshaft` |
| Stand pipe cover | 182373V91 | …35, MF50, MH50, 65, 85, 88 | 304 | doc only |
| Relief valve, 2500–3000 psi | **883402V92** | 35, 35X, TO35 (Eff. Tractor SN 168853), MF50 & MH50… | 305 | `hyd-relief-valve` |
| Quadrant stop kit | 825753V1 | MH50, TO20, TE20, TEA20, TO30, TO35, TE35, MF35, 40, 50, 65 | 305 | `quadrant` |
| Valve chamber repair kit | 830997V91 | 202, 204, 35 Turf, 302, 304, 35, MF50, MH50, 65 | 305 | `hyd-valve-chamber` |
| Pump repair kit (.91 mm piston) | 7928769V | TO35, 35, 50, 65: cam blocks, valve chambers, pistons, rings, O-ring kit | 306 | `hyd-pump` |
| Pump O-ring kit (.91 mm piston) | 1810684V92 | TO35, 35, 50, 65 | 307 | `hyd-pump` |
| Pump piston, .91 mm | **190799V1** | …35, 35X (Eff. SN 65684), MF50, MH50, TO35 (Eff. SN 179304) | 307 | `hyd-pump-pistons` |
| Pump cam block, front / rear | 180924V2 / 180925V2 | "Fits most MF style lift pumps - MK I, II, III" | 307 | `hyd-pump-cam-blocks` |
| Control valve | **189427V92** | 202, 204, 302, 304, 35, 35X, MF50, MH50, 65, 85, 88, Super 90, TO35 | 307 | `hyd-control-valve` |
| Hydraulic oil dipstick | 193400V1 | MH50, TO20, TE20, TEA20, TO30, TO35, TE35, 40, 50, 65… | 307 | `centre-housing` |
| Auxiliary hydraulic valve | 184472V93 | 35, 35X (Eff. SN 65684) | 306 | doc only |

## Three-point linkage

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Top link, Cat 1 & 2 | **1870075V91** | 135 UK (Prior to SN 439191), 35, 35X (FE) | 311 | `top-link` |
| Top link centre tube | 184891V91 | …135 UK, 35, 35X, TE20, TEA20, TO20, TO30 | 311 | `top-link` |
| Lower lift arm, left / right | 191114V91 / 191115V91 | "35 (SN 207753–219470), 35XE, TO35 (Eff. SN 165750), MF50, MH50, 135 UK" — US serials | 311 | `lower-link-lh` / `-rh` (possible) |
| Lower lift arm, left / right, later | 510584V92 / 510585V92 | "35 (Eff. SN 219471)…" — US serials | 311 | doc only |
| Levelling box hand crank, right | **182642V93** | TE20, TEA20, TO20, TO30, TO35, MF35, 40, 50, 202, 204 | 312 | `levelling-box` |
| Levelling box gear | 181345V2 | Cat 1 & 2 assemblies | 313 | `levelling-box` |
| Lift rod, left, Cat 1 | 182554V92 | 202, 204, 2135, 135, 150, 35, 35X, MF50, MH50, TO35 | 313 | `lift-rod-lh` |
| Stabiliser lower stay / upper stay | 181985V1 / 181986V1 | 35, 35X, TO35 (Prior to SN 182870), 135 UK, 202… | 314 | `check-chains` |
| Stabiliser kit, Cat 1 | 79024570V | TE20… TO35, 35, 40 Utility, 50 Utility | 314 | `check-chains` |
| Swinging drawbar | 184611V1 | 20, 30, 35, TO35, 65… | 310 | `drawbar` |
| Three-point drawbar, Cat 2 | 180485V1 | 35, 35X, TO30, TO20, TE20, TEA20, TO35… | 310 | `drawbar` |
| Swinging drawbar kit | 79026403V | TE20… TO35, TE35, 35, 50 | 310 | `drawbar` |

## Front axle and steering

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Axle beam | **183219V91** | TO20, TE20, TEA20, TO30, TO35, 35, 135, 235 | 279 | `front-axle-beam` |
| Front axle pivot | **182850V1** | TO35, FE35, 35, 135, 230, 235, 2135, 20 | 279 | `front-axle-pivot-pin` |
| Spindle, left / right, 11 in upright | 180349V92 / 180346V92 | TO35 and 35 rows | 267 | `stub-axle` |
| Steering arm | 180350M1 | TO20… TO35, 35, 135 UK, 240S Turkey, 240 | 272 | `steering-arms` |
| Steering wheel, black ribbed, 17-5/8 in | 79024602V | TE20, TO20, TO30, TE35, 35, 40, 50… | 265 | `steering-wheel` |
| Steering wheel nut, chrome, 13/16 in NF | 1870806V92 | TE20… TE35, 35… | 265 | `steering-wheel` |
| Inner steering column assembly | **1850003V92** | 135 UK (Prior to SN 400001), 35, 35X (FE) | 272 | `steering-column` |
| Rocker shaft, secondary (manual steering) | 1861704V1 | 135 UK, 240S Turkey, 35, 35X FE | 272 | `steering-box` |
| Rocker shaft, primary (manual steering) | 1850017V1 | 135 UK, 240…, 35, 35X FE | 272 | `steering-box` |
| Steering shaft bearing kit | 79028716V | 35, 135, 2135, 20, 202… | 271 | `steering-box` |
| Pitman gear, left / right | 180557V1 / 180558V1 | TO35, 35, 135, 2135… | 272 | `steering-box` |
| Front wheel hub | **180338V92** | TO30, TO20, TE20, TEA20, TO35, MF35, MF50, MH50, 65, FE35, 135 UK | 337 | `front-hub` |
| Front hub cap | 191142V1 | …35, 35X… TO35 | 337 | `front-hub` |
| Front hub seal | 897363V1 | 35, 35X, 130 French, 135, 235, 245 | 337 | `front-hub` |
| Wheel bearing kit (per wheel) | 79024599V | TE20… TE35, TO35, MF, 35, 40, 50, 65 | 337 | `front-hub` |

## Electrical and instruments

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Starter switch | **883928V91** | FE35 Diesel 23C (and Diesel A3-152) | 241 | `starter-switch` |
| Intake heater (Thermostart) | **893501V91** | 35 Diesel, 50 MF & MH, 65, 85, 88, Super 90, 130 French, 135 UK… | 257 | `intake-heater` |
| Tachometer (tractormeter) | **1850092V93** | 35 / 35X: "23C Diesel, 87 M/M Gas & 87 M/M V.O./L.O. Eng. (Prior to SN 307657)" | 67 | `tractormeter` |
| Tachometer cable | 827855V1 (also 890420V91) | 35, 35X (FE), TO 35 / 135 UK, 35, 35X (FE) | 71 | `tractormeter` |
| Water temperature gauge | 881396V91 | 35 / 35X "For 87 M/M V.O./L.L. Eng."; the "35 Diesel" row gives 30V3485587 | 67 | `temp-gauge` |
| Oil pressure gauge | 1853097V91 | 35 / 35X and TO35 Standard Motors Diesel; "35 Diesel" row gives 506902V92 | 66–67 | `oil-pressure-gauge` |
| Ammeter | 1073455V91 | 35, 35X, 35 Diesel, TO35 | 66–67 | `ammeter` |
| Headlamp, 5-3/4 in sealed beam | 79028720V (6 V) / 79028721V (12 V) | MH50, TO20… TO35, 35… | 253 | `headlamps` |
| Headlamp wing, LH / RH | 1750676V1 / 1750675V1 | TE20… 35, 40, 50… | 50 | `headlamps` |
| Battery cable, 15-1/2 in | 181572V91 | 35 (Prior to SN 216684 Deluxe and 220038 Special), TO35 Deluxe… | 252 | `battery-cables` |
| Battery to solenoid cable | 180099V1 | 35, MF 50, MH 50 | 252 | `battery-cables` |
| Rear work light | 231495V91 | TO35 | 255 | `rear-lamp` |
| Push-button starter switch (universal) | 79024378V | generic | 241 | — |

## Bodywork and seat

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Side panel, RH / LH (23C & 87 mm) | **826815V91** / **826816V91** | 35, 35X (With 23C & 87 M/M Eng.) | 56 | `side-panels` |
| Side panel | 826817V92 | 35, 35X | 56 | `side-panels` |
| Front grille | 826812V91 | 35, 35X (a second row "35: 180657V91" is the US grille) | 58 | `grille` |
| Hood catch rod | 826870V1 | 35, 35X | 55 | `bonnet` |
| Bonnet pivot bolt | 180718M1 | 202, 35, 35X, TO20, TO30, TO35 | 55 | `bonnet` |
| Front emblem | 187990V1 | MF35, MF 35 Utility & Turf | 50 | `front-badge` |
| "Ferguson 35" side emblems | 79024624V | TO35, Ferguson 35 (red background, 3 pegs) | 50 | `front-badge` |
| Decal set, 35 hood / complete / Deluxe Diesel hood | 79024491V / 79024503V / 79024559V | 35 | 48 | `bonnet` |
| Fender skin, less bracket | 526904V91 | TO20… 35… | 56 | `mudguards` |
| Seat pan | 825577V91 | TE20, TO20, TEA20, TO30, TO35, TE35, 35, 40, 50, MH50 | 63 | `seat` |
| Seat spring | 825608V1 | same row | 63 | `seat-support` |
| Seat spring repair kit | 79024779V | same row | 63 | `seat-support` |
| De Luxe seat pan / cushion | 181313V93 / 30093V91 | TE20… TO35, 35, 35X… | 63 | `seat` |

## Wheels

| Part | Heritage no. | Catalogue row | Page | Node |
|---|---|---|---|---|
| Front wheel, 4.5 × 16, 6 bolt | 195638V91 | MH 50; MF TE20… TE 35, TO35, MF35… | 334 | `front-wheel` |
| Rear rim, 12 × 24, 6 loops | 79024704V | 35, 50, 65, 135… | 335 | `rear-rim` |
| Lug bolt, 1/2 in-20 × 1-3/4 in serrated | 181328V1 | MH 50; MF TE20… TO35, MF35… | 337 | `front-wheel-nuts` |
| Lug nut, 1/2 in NF hex | 195490V1 | TO20… 35, 35X… | 337 | `front-wheel-nuts` |
| Lug bolt, 9/16 in × 2 in NF | 185400V2 | 35, 50, 135… TO35 | 337 | `rear-wheel-nuts` |
| Lug nut (for 9/16 in bolt) | 180004V1 | 35, 50, 135… TO35 | 337 | `rear-wheel-nuts` |
| Front wheel weight | 79024818V | …TE35, TO35… | 336 | `front-weights` |

## Items the catalogue does not cover for the 23C

No 23C entries exist for: cylinder liners, camshaft, crankshaft, main bearings, oil pump, water pump,
thermostat, injectors (23C-specific), injection pump (23C-specific), dynamo, starter motor, heater
plugs, or any dual-stage clutch part. These stay "Not yet documented" until parts book 819045M4 is
checked.
