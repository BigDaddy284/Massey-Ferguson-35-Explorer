# MF35 EXPLORER
## Complete Product Design & Development Specification

**Project:** MF35 Explorer – The Complete Tractor Anatomy  
**Target machine:** 1958 Massey Ferguson 35  
**Platform:** Browser-based HTML application  
**Primary technology:** Three.js, HTML5, CSS3, JavaScript/TypeScript  
**Development approach:** Autonomous, research-led development

---

# 1. Project Overview

MF35 Explorer is an interactive digital representation and technical encyclopaedia of the 1958 Massey Ferguson 35 tractor.

The application allows users to explore the tractor in 3D, investigate its construction, dismantle individual assemblies, identify components and access detailed information about every documented part.

The experience should combine:

- Interactive 3D tractor exploration.
- Mechanical assembly and disassembly.
- Exploded technical diagrams.
- Detailed component identification.
- Original Massey Ferguson part numbers.
- Technical descriptions and specifications.
- Component compatibility information.
- UK replacement parts purchasing references.

The application must concentrate exclusively on the 1958 MF35.

It is not intended to become a general tractor parts website.

It is not intended to reproduce an entire agricultural supply chain.

It is intended to provide the equivalent of having the complete tractor, an illustrated parts catalogue and a technical encyclopaedia available in one interactive application.

# 2. Design Inspiration

Reference website:

https://robodienst.com/

Use Robodienst as inspiration for:
- 3D anatomy exploration.
- Individual component identification.
- Interactive exploded views.
- Component information panels.
- Visual navigation between assemblies.
- Educational presentation of complex machinery.

The tractor application should retain the simplicity of exploring a robot but apply it to an agricultural machine.

The tractor itself must remain the centre of attention.

Do not implement unrelated Robodienst features such as company directories, supply-chain maps, market-share analysis or industry statistics.

# 3. Target Tractor and Historical Accuracy

The application targets the Coventry-built 1958 Massey Ferguson 35.

Research must establish the correct configuration before assigning parts to the model.

The commonly documented 1958 serial range is:

**79553–125067**

The application must recognise that 1958 tractors could have different engine and equipment configurations.

Potential configurations include:
- Standard petrol.
- Standard TVO/petrol-paraffin.
- Standard 23C four-cylinder diesel.

Additional variations include:
- Standard or vineyard/industrial chassis where applicable.
- Single or dual clutch.
- Transmission and PTO options.
- Production and serial-number changes.

The later Perkins A3.152 engine must not be presented as original 1958 equipment.

The application should initially support a default 1958 configuration and allow the tractor specification to be refined as reliable documentation becomes available.

## 3.1 Tractor Identification

Include a tractor identification section.

It should explain:
- Where to locate the tractor serial number.
- How to identify engine type.
- How to interpret the model prefix.
- How to identify relevant optional equipment.
- How to determine which components apply to the user's tractor.

Allow the user to enter their own tractor serial number.

Where the exact configuration is unknown, clearly explain that compatibility must be checked.

# 4. Main Application Layout

The home screen should feature a large interactive tractor model.

Suggested desktop layout:

**Header**
- MF35 Explorer logo.
- Home.
- Tractor Anatomy.
- Parts Catalogue.
- Exploded Views.
- Search.
- About.

**Main workspace**

Left panel:
- Assembly navigation.
- Mechanical systems.
- Expandable component lists.

Centre:
- Large interactive 3D tractor.
- Rotation and zoom controls.
- Exploded view controls.
- Visibility controls.
- Component selection.

Right panel:
- Selected component information.
- Part number.
- Description.
- Technical information.
- Compatibility.
- Purchase references.

Bottom:
- Breadcrumb navigation.
- Current assembly.
- Component identification.
- Model view controls.

The layout should prioritise the 3D model, with information panels appearing when required.

On smaller screens, panels should become collapsible.

# 5. Main Navigation

Create the following main sections.

## 5.1 Tractor Anatomy

The main interactive 3D tractor.

Users can:
- Rotate the tractor.
- Zoom in and out.
- Move the viewing position.
- Select components.
- Isolate assemblies.
- Hide components.
- Explode assemblies.
- Restore the original assembly.
- Switch between different viewing angles.

This is the primary feature of the application.

## 5.2 Parts Catalogue

A searchable database of all documented tractor components.

Users can search using:
- Component name.
- Part number.
- Assembly.
- Mechanical system.
- Description.
- Aftermarket reference.

Results should display:
- Component name.
- Part number.
- Assembly.
- Quantity.
- Verification status.
- Link to view component in 3D.

## 5.3 Exploded Views

A dedicated section containing illustrated breakdowns of mechanical assemblies.

Examples:
- Complete engine.
- Cylinder head.
- Cylinder block.
- Crankshaft assembly.
- Piston and connecting rod assembly.
- Fuel injection system.
- Cooling system.
- Clutch.
- Gearbox.
- Differential.
- Rear axle.
- Hydraulic lift.
- Front axle.
- Steering.
- Braking system.

Each exploded diagram should contain numbered component references.

Selecting a reference should open the corresponding component record and highlight it in the 3D model.

## 5.4 Technical Information

A reference library containing:
- Engine specifications.
- Gearbox specifications.
- Electrical system.
- Hydraulic system.
- Lubrication information.
- Capacities.
- Adjustment information.
- Torque specifications where documented.
- Maintenance information.
- Technical terminology.

Only include specifications supported by appropriate documentation.

Do not turn this section into a substitute for a complete copyrighted workshop manual.

## 5.5 Tractor Identification

A dedicated guide explaining how to identify the exact tractor specification.

Include serial number, engine, chassis and equipment identification.

# 6. Complete Tractor Component Structure

Build the component database around the following major systems.

The list represents the intended catalogue scope, not an assertion that every component has already been verified.

## 6.1 Engine Assembly

Include:

- Engine block.
- Cylinder liners.
- Cylinder head.
- Cylinder head gasket.
- Head studs and nuts.
- Pistons.
- Piston rings.
- Gudgeon pins.
- Connecting rods.
- Connecting rod bearings.
- Crankshaft.
- Main bearings.
- Crankshaft thrust washers.
- Camshaft.
- Camshaft bearings.
- Timing gears.
- Timing gear cover.
- Valves.
- Valve guides.
- Valve springs.
- Valve retainers.
- Rocker shaft.
- Rocker arms.
- Pushrods.
- Tappets.
- Sump.
- Oil pump.
- Oil filter.
- Oil pipes.
- Dipstick.
- Breather.
- Flywheel.
- Flywheel bolts.
- Engine mounting hardware.
- All documented gaskets, seals and fasteners.

## 6.2 Fuel System

Include:

- Fuel tank.
- Fuel tank cap.
- Fuel tap.
- Fuel pipes.
- Fuel filter.
- Sediment bowl.
- Fuel lift pump where applicable.
- Injection pump and associated components for diesel configurations.
- Injector pipes.
- Injectors.
- Injector seals.
- Air intake.
- Air cleaner.
- Carburettor and associated parts for applicable petrol configurations.
- TVO-related components where applicable.

## 6.3 Cooling System

Include:

- Radiator.
- Radiator cap.
- Top hose.
- Bottom hose.
- Water pump.
- Water pump pulley.
- Fan.
- Fan belt.
- Thermostat where fitted.
- Water connections.
- Engine coolant passages and relevant fittings.
- Mounting hardware.

## 6.4 Clutch and Transmission

Include:

- Clutch housing.
- Clutch assembly.
- Clutch plate.
- Pressure plate.
- Release bearing.
- Release fork.
- Clutch pedal.
- Clutch linkage.
- Gearbox casing.
- Input shaft.
- Main shaft.
- Countershaft.
- Gears.
- Selector forks.
- Gear selectors.
- Bearings.
- Bushes.
- Gearbox covers.
- Gaskets.
- Seals.
- Fasteners.

Document differences between single and dual clutch configurations.

## 6.5 Rear Axle and Differential

Include:

- Rear axle housing.
- Differential casing.
- Crown wheel.
- Pinion.
- Differential gears.
- Differential bearings.
- Half shafts.
- Rear hubs.
- Wheel studs.
- Brake assemblies.
- Axle seals.
- Retaining hardware.

## 6.6 PTO System

Include:

- PTO shaft.
- PTO gears.
- PTO bearings.
- PTO engagement mechanism.
- PTO housing.
- Seals.
- Associated linkage and fasteners.

## 6.7 Hydraulic System

Include:

- Hydraulic pump.
- Pump components.
- Hydraulic control mechanism.
- Control valves.
- Lift cylinder.
- Piston.
- Piston seals.
- Hydraulic filter or strainer where applicable.
- Hydraulic pipes.
- Internal passages.
- Lift cover.
- Position control components.
- Draft control components.
- Lift arms.
- Associated pins and bushes.

## 6.8 Front Axle and Steering

Include:

- Front axle beam.
- Front axle pivot.
- Pivot pin.
- Front wheel hubs.
- Stub axles.
- Spindles.
- Kingpins.
- Bushes.
- Bearings.
- Steering box.
- Steering column.
- Steering wheel.
- Drag links.
- Track rod.
- Steering arms.
- Associated fasteners.

## 6.9 Braking System

Include:

- Brake pedals.
- Brake shafts.
- Brake linkages.
- Brake housings.
- Brake shoes.
- Brake linings.
- Springs.
- Pins.
- Adjusters.
- Associated hardware.

## 6.10 Electrical System

Include:

- Starter motor.
- Generator or alternator, as applicable to the documented specification.
- Voltage regulator.
- Battery.
- Battery cables.
- Ignition components.
- Glow-start or heater components where applicable.
- Wiring.
- Headlights.
- Rear lights.
- Instruments.
- Ammeter.
- Temperature gauge.
- Oil pressure gauge.
- Switches.
- Horn.
- Wiring connectors and terminals.

## 6.11 Bodywork and Operator Area

Include:

- Bonnet.
- Side panels.
- Grille.
- Front badge.
- Mudguards.
- Dashboard.
- Instrument panel.
- Steering wheel.
- Seat.
- Seat support.
- Footplates.
- Pedals.
- Controls.
- Drawbar.
- Three-point linkage.
- Steps.
- Brackets.
- Mounting hardware.

## 6.12 Wheels and Tyres

Include:
- Front wheels.
- Rear wheels.
- Rims.
- Wheel centres.
- Wheel bolts.
- Wheel nuts.
- Tyres.
- Valve assemblies.
- Relevant mounting components.

## 6.13 Fasteners and Small Components

This is an especially important part of the project.

The application must catalogue documented small components, not just major assemblies.

Examples:
- Nuts.
- Bolts.
- Studs.
- Washers.
- Lock washers.
- Circlips.
- Split pins.
- Roll pins.
- Dowel pins.
- Bearings.
- Bushes.
- Oil seals.
- O-rings.
- Gaskets.
- Springs.
- Clips.
- Retaining plates.
- Spacers.
- Shims.
- Grease nipples.
- Pipe unions.
- Electrical terminals.

Where documentation identifies the original fastener specification, include thread, dimensions, material and quantity.

Do not assume all visually similar fasteners are interchangeable.

# 7. Interactive 3D Experience

The 3D model must be constructed from individual identifiable components.

A tractor made from one combined mesh is not acceptable.

The model should use a hierarchical assembly structure.

Example:

Tractor
- Engine
  - Cylinder head
  - Cylinder block
  - Pistons
  - Crankshaft
  - Valves
  - Timing assembly
- Transmission
  - Clutch
  - Gearbox
  - Differential
- Front axle
- Rear axle
- Hydraulic system
- Electrical system
- Bodywork

Each component should have its own unique ID.

## 7.1 Interaction Controls

Provide:
- Left mouse drag: rotate.
- Scroll wheel: zoom.
- Right mouse drag: pan.
- Click: select component.
- Double-click: isolate component or enter assembly.
- Dedicated controls: explode, restore and reset view.

Provide touch equivalents for tablets.

## 7.2 Exploded Assembly Mode

Allow the user to progressively separate components from their assembled positions.

The explosion should preserve the logical arrangement of components so users can understand how the tractor is constructed.

Include:
- Explosion slider.
- Full explosion.
- Restore assembly.
- Isolate selected component.
- Hide selected component.
- Show all components.

Where possible, explosion should be available at both assembly and subassembly levels.

## 7.3 Selection Behaviour

When selecting a component:

1. Highlight it in the 3D model.
2. Identify it by name.
3. Display its information panel.
4. Show its position within the assembly hierarchy.
5. Provide links to the corresponding exploded diagram.
6. Provide access to related components.

The selected component should remain identifiable when the user switches between views.

# 8. Component Information Panel

Every component must have a standard information layout.

Example:

**Component:** Engine Oil Pump

**Assembly:** Engine Lubrication System

**Original part number:** Verified number where available.

**Alternative references:** Superseded or aftermarket numbers.

**Quantity:** Number fitted to the applicable configuration.

**Function:** Explanation of what the component does.

**Location:** Where it is fitted.

**Specifications:** Dimensions, material, thread or other relevant information.

**Compatibility:** Applicable engine, serial range and tractor configuration.

**Replacement information:** Suitable replacement references.

**Sources:** Documentation used to identify the component.

**Purchase options:** Verified UK suppliers.

Include a component verification indicator.

Possible statuses:
- Verified.
- Partially verified.
- Unverified.
- Variant dependent.

Never display missing information as though it were confirmed.

# 9. UK Parts Purchasing References

The application is not a shop and will not sell components.

Its purpose is to help users identify the correct part and find a legitimate supplier.

Potential UK sources include:

- https://mfparts.co.uk/
- https://www.anglo-agriparts.com/
- https://www.nctractorspares.co.uk/

Additional suppliers may be added after research.

Each component should support multiple supplier records.

A supplier entry should contain:
- Supplier name.
- Product description.
- Supplier part number.
- Matching OEM reference.
- Product URL.
- Price, if available and verified.
- Stock status, if available and verified.
- Date last checked.

Clearly distinguish an exact match from a possible alternative.

Do not automatically recommend a part solely because a supplier lists it for a generic MF35.

Compatibility must be checked against the target configuration.

# 10. Search System

Create a global search accessible from every main section.

Search should support:
- Part name.
- OEM number.
- Aftermarket number.
- Component description.
- Assembly.
- Technical term.

Search results should allow the user to jump directly to:
- The selected component in 3D.
- The relevant exploded diagram.
- Its complete information record.

Include sensible spelling tolerance and partial matching.

# 11. Data Architecture

Keep all tractor information separate from the interface and 3D rendering code.

Use structured JSON records initially.

Suggested component record:

```json
{
  "id": "engine-oil-pump-001",
  "name": "Engine Oil Pump",
  "system": "Engine",
  "assembly": "Lubrication",
  "subassembly": "Oil Pump",
  "oemPartNumber": null,
  "alternativePartNumbers": [],
  "aftermarketReferences": [],
  "quantity": 1,
  "description": "",
  "function": "",
  "location": "",
  "specifications": {},
  "compatibility": {
    "tractorModel": "MF35",
    "year": 1958,
    "engineTypes": [],
    "serialRanges": []
  },
  "verificationStatus": "unverified",
  "sources": [],
  "suppliers": [],
  "modelReference": "engine-oil-pump-001",
  "diagramReference": null
}
```

The example is a structural template, not a verified historical part record.

Support relationships between:
- Components.
- Assemblies.
- Subassemblies.
- Exploded diagrams.
- 3D model objects.
- Sources.
- Suppliers.

Use stable internal IDs that never depend on a supplier's part number.

# 12. Visual Design

The interface should look like a modern engineering and restoration reference tool.

Suggested styling:

- Light neutral background.
- Dark charcoal text.
- Massey Ferguson red as the main accent.
- Industrial grey panels.
- Subtle borders.
- Clear typography.
- Minimal unnecessary decoration.

Use the appearance of the tractor as inspiration for the colour palette.

The 3D model should have a neutral studio background with good lighting and clear component visibility.

Avoid excessive animations, cluttered menus or distracting effects.

The interface must feel like a polished professional application rather than a basic website.

# 13. Learning and Explanatory Content

Every component should have a plain-English explanation.

A user should be able to understand:
- What the component is.
- What it does.
- Why it is needed.
- What it connects to.
- What happens if it fails.

Where appropriate, provide links to related components.

For example, selecting a piston could provide links to:
- Piston rings.
- Gudgeon pin.
- Connecting rod.
- Cylinder liner.
- Crankshaft.

This should create an interconnected learning experience.

# 14. Research and Asset Management

Maintain a dedicated research database.

Every researched component should have:
- Source name.
- Source URL.
- Source type.
- Relevant page or diagram reference.
- Date researched.
- Information extracted.
- Verification status.
- Any conflicting information.

Maintain separate records for:
- Confirmed 1958 parts.
- Variant-dependent parts.
- Later replacement parts.
- Unidentified components.

Original manuals and diagrams may be used as research references, subject to access and licensing restrictions.

Do not reproduce copyrighted diagrams without permission.

Create original diagrams and 3D assets where required.

# 15. Development Roadmap

Development must proceed in the following order.

## Phase 1 – Historical Research and Identification

Establish:
- Correct 1958 tractor identity.
- Production serial range.
- Engine variants.
- Chassis variations.
- Clutch variations.
- Transmission options.
- Available original parts catalogues.
- Available workshop documentation.
- Available 3D reference material.

Deliverables:
- Tractor specification document.
- Initial research source register.
- Configuration and compatibility rules.
- Initial component hierarchy.

## Phase 2 – Application Foundation

Build:
- HTML application.
- Navigation.
- Main layout.
- Responsive interface.
- Search infrastructure.
- Component information panel.
- Data-loading architecture.

Use placeholder content only where clearly labelled.

## Phase 3 – 3D Tractor Model

Create or source an appropriately detailed 1958 MF35 model.

Separate the model into mechanical assemblies and identifiable components.

Implement:
- Rotation.
- Zoom.
- Pan.
- Selection.
- Highlighting.
- Visibility controls.
- Assembly isolation.

The model must be recognisably accurate, not a generic tractor.

## Phase 4 – Exploded View System

Implement:
- Component separation.
- Assembly explosion.
- Subassembly explosion.
- Reset and restoration.
- Exploded assembly navigation.
- Diagram and 3D selection synchronisation.

## Phase 5 – Component Catalogue

Populate the component database using verified documentation.

Start with major assemblies and work progressively towards smaller components and fasteners.

Implement all component information fields and cross-references.

## Phase 6 – Technical Diagrams

Create and integrate exploded diagrams for the major systems.

Link diagram identification numbers to the component database.

## Phase 7 – Supplier References

Research relevant UK parts suppliers.

Add verified purchase references to appropriate components.

Include compatibility checks and source information.

## Phase 8 – Completeness and Quality Assurance

Review the entire application.

Check:
- Missing components.
- Missing fasteners.
- Incorrect part numbers.
- Incorrect quantities.
- Incorrect model relationships.
- Variant compatibility.
- Broken supplier links.
- Missing diagrams.
- Inaccurate 3D placement.

Create a completeness report.

## Phase 9 – Final Polish

Improve:
- Navigation.
- Loading performance.
- Mobile and tablet usability.
- Search experience.
- Visual presentation.
- Technical explanations.
- Documentation.

# 16. Completeness Measurement

The application must never claim to contain every tractor component unless this has been demonstrated against suitable source documentation.

Create a coverage report showing:

- Total identified components.
- Verified components.
- Partially verified components.
- Unverified components.
- Components with confirmed OEM numbers.
- Components with diagrams.
- Components represented in 3D.
- Components with UK purchase references.
- Documented fasteners.
- Missing or unresolved items.

Break this down by mechanical system.

The objective is to make progress towards the most complete possible digital catalogue of the 1958 MF35.

# 17. Final Acceptance Criteria

The application should ultimately allow a user to:

1. Open the application locally in a browser.
2. View a detailed 3D 1958 Massey Ferguson 35.
3. Rotate and inspect the complete tractor.
4. Select individual components.
5. Explore major mechanical systems.
6. Explode assemblies and investigate their construction.
7. Access detailed information about selected components.
8. Identify original part numbers where documented.
9. Understand compatibility and production variations.
10. View corresponding exploded diagrams.
11. Search for individual components and fasteners.
12. Find relevant UK replacement part suppliers.
13. Understand what each component does.
14. See where information is verified and where research remains incomplete.

The finished application should feel like having a complete digital MF35 sitting on the workbench, ready to be taken apart and examined.

---

# FINAL PRODUCT PRINCIPLE

**One tractor. Every assembly. Every identifiable component. Every documented nut, bolt and fitting.**

Build the most accurate and comprehensive interactive digital reference for the 1958 Massey Ferguson 35 that available documentation and suitable 3D assets will allow.

Accuracy comes before appearance. Completeness comes before convenience. Usability must never be sacrificed.