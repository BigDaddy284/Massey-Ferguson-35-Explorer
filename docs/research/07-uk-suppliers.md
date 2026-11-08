# 07 – UK supplier references (Phase 7)

Researched 8 November 2026. Data: `data/suppliers.json`; sources SRC-039 (Anglo Agriparts) and SRC-040
(Agriline Products).

## What was read

| Supplier | Pages read | Products seen | References taken |
|---|---|---|---|
| Anglo Agriparts, `tractor-parts-ferguson-fe35` | both listing pages (196 products) and three product pages (A57146 pump, A65600 top gasket set, A67170 lift arm) | 196 | 117 on 100 parts |
| Agriline Products, `ferguson/ferguson/fe35-4cyl` | hydraulics, clutch, brakes, transmission and PTO, cooling, linkage, electrical, rear wheel and axle, body; product pages 7008 and 6227 | about 390 | 118 on 98 parts |

The Agriline **engine** and **front axle and steering** category pages returned a server error on the day and
were not read. Anglo product pages are rate-limited, so only three were opened for their OEM numbers; the
others were taken from the listing pages (name, number, ex/inc VAT price, stock).

Also checked: `mfparts.co.uk` has no FE35 or 35 section; `nctractorspares.co.uk` has an FE35 data page but no
product listing that could be tied to a part here; Sparex kits are sold through dealers (farmingparts.com,
masseytractorparts.com) and are not referenced yet.

## Grading

- **agco-ref** (4): the supplier quotes an OEM number equal to a 2008 Heritage number on the record, with the
  M/V suffix letter treated as the same: Agriline brake drum 5666 (827707M5 = 827707V5), Agriline water hose kit
  106-KIT (826988M1 = 826988V1, lower hose), Agriline gear lever boot 5190 (180579M3 = 180579V3), Anglo top
  gasket set A65600 (1810028M91 = 1810028V91).
- **listed-fit** (216): listed by the supplier for the FE35 / 23C; the fit is the supplier's claim.
- **check-fit** (15): listed, but with a known reason to check (16 in front wheel against the 19 in 1958
  specification; two starters, two release-bearing carriers, a 9 in single clutch cover; PTO items quoting MF135
  serial breaks; a gearbox input housing listed up to serial 121069, inside the 1958 range; 12 V battery while the
  electrics axis is unconfirmed; reproduction commission plates).

No reference is graded exact. That needs parts book 819045M4.

## Near misses worth knowing

- Agriline brake shoe 5143 quotes 830480M92; Heritage lists 830480V93 (later revision of the same number).
- Agriline levelling box 4003 quotes 182642M94; Heritage lists 182642V93.
- Agriline ignition switch 74911 quotes 883920M1; Heritage lists 883928V91 for the 35 starter switch.
- Agriline front badge 6231 quotes 826686M1 (Ferguson-era); Heritage lists 187990V1 / 79024624V.
- Hydraulic pumps (Anglo A57146, Agriline 6227) quote 184472M93 / 184473M93; Heritage lists only repair kits
  for the 35 pump, so there is nothing to match yet.

## Not done

- Price and stock are a snapshot; there is no live checking (the app must work from `file://`).
- Fasteners are barely covered: suppliers list them as kits (bonnet, wing, front axle bolt kits) that do not
  map to single records.
