# MF35 EXPLORER
## Complete Product Design & Development Specification

**Project:** MF35 Explorer – The Complete Tractor Anatomy

**Target machine:** 1958 Massey Ferguson 35 Diesel

**Provisional engine:** Standard 23C four-cylinder diesel, approximately 2,258 cc

**Confirmed equipment:** Rear hydraulic lift, three-point linkage and PTO shaft

**Platform:** Browser-based HTML application

**Technology:** Three.js, HTML5, CSS3, TypeScript/JavaScript

**Development approach:** Autonomous, research-led development

---

# 1. PROJECT OVERVIEW

MF35 Explorer is an interactive digital representation and technical encyclopaedia of the 1958 Massey Ferguson 35 diesel tractor.

The application allows users to explore the tractor in 3D, investigate its construction, dismantle individual assemblies, identify components and access detailed information about every documented part.

The application combines:

- Interactive 3D tractor exploration.
- Mechanical assembly and disassembly.
- Exploded technical diagrams.
- Detailed component identification.
- Original Massey Ferguson part numbers.
- Technical descriptions and specifications.
- Component compatibility information.
- UK replacement parts purchasing references.

The application must concentrate exclusively on the 1958 MF35 diesel.

It is not a general tractor parts website.

It is not intended to reproduce an entire agricultural supply chain.

It should provide the equivalent of having the complete tractor, an illustrated parts catalogue and a technical encyclopaedia available in one interactive application.

# 2. DESIGN INSPIRATION

Reference:

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

Do not implement unrelated features such as company directories, supply-chain maps, market-share analysis or industry statistics.

# 3. TARGET TRACTOR SPECIFICATION

## 3.1 Initial Identification

The target is a 1958 Coventry-built Massey Ferguson 35 diesel.

The commonly documented 1958 production serial range is:

79553–125067

The owner has confirmed:

- The tractor is believed to be a 1958 MF35.
- It has a diesel engine.
- It has rear hydraulic lift equipment.
- It has rear three-point linkage.
- It has a rear PTO shaft.
- The serial number is currently unavailable.

The tractor is located on a farm and cannot currently be inspected.

## 3.2 Provisional Engine

The initial research and modelling target is the Standard Motor Company 23C diesel engine.

Expected specifications:

- Four cylinders.
- Approximately 2,258 cc displacement.
- Diesel fuel.
- Liquid cooling.
- Four-cylinder inline configuration.

The engine specification remains provisional until confirmed through physical identification or reliable historical documentation.

Do not substitute the later Perkins A3.152 engine as the original 1958 engine.

Build the data structure so engine specifications and associated component assemblies can be corrected without rebuilding the application.

## 3.3 Tractor Configuration

Research and document:

- Engine configuration.
- Chassis configuration.
- Transmission.
- Single or dual clutch.
- PTO arrangement.
- Hydraulic lift configuration.
- Three-point linkage.
- Electrical equipment.
- Steering.
- Braking.
- Wheel and tyre options.

Do not assume all tractors produced in 1958 have identical components.

## 3.4 Tractor Identification Section

Provide an identification guide covering:

- Tractor serial plate location.
- Engine identification.
- Engine prefix interpretation.
- Chassis identification.
- Equipment identification.
- Production changes.

Allow the owner to enter the tractor serial number in the future.

Where exact configuration is unknown, clearly explain that compatibility must be checked.

# 4. MAIN APPLICATION LAYOUT

The home screen should feature a large interactive tractor model.

## Header

- MF35 Explorer logo.
- Home.
- Tractor Anatomy.
- Parts Catalogue.
- Exploded Views.
- Technical Information.
- Search.

## Left Panel

- Mechanical assembly navigation.
- Expandable system categories.
- Subassembly navigation.
- Component lists.

## Centre Workspace

- Large interactive 3D tractor.
- Rotation and zoom.
- Exploded view controls.
- Visibility controls.
- Component selection.
- Camera presets.

## Right Panel

- Selected component information.
- Part number.
- Description.
- Technical information.
- Compatibility.
- Purchase references.
- Verification status.

## Bottom Navigation

- Breadcrumb navigation.
- Current assembly.
- Selected component identification.
- View controls.

The 3D model must receive the greatest visual emphasis.

Panels should be collapsible and responsive.

# 5. MAIN APPLICATION SECTIONS

## 5.1 Tractor Anatomy

The primary interactive 3D tractor.

Users can:

- Rotate the tractor.
- Zoom in and out.
- Pan around the tractor.
- Select components.
- Isolate assemblies.
- Hide components.
- Explode assemblies.
- Restore the original assembly.
- Switch between viewing angles.

This is the central feature of the application.

## 5.2 Parts Catalogue

A searchable database of documented tractor components.

Search using:

- Component name.
- Part number.
- Assembly.
- Mechanical system.
- Description.
- Aftermarket reference.

Results should display:

- Component name.
- Original part number, where verified.
- Assembly.
- Quantity.
- Verification status.
- Link to view the component in 3D.

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
- Hydraulic pump.
- PTO.
- Front axle.
- Steering.
- Braking system.

Each exploded diagram must contain numbered component references.

Selecting a reference opens the corresponding component record and highlights it in the 3D model.

## 5.4 Technical Information

A reference library containing:

- Engine specifications.
- Gearbox specifications.
- Electrical system.
- Hydraulic system.
- PTO operation.
- Lubrication information.
- Capacities.
- Adjustment information.
- Torque specifications where documented.
- Maintenance information.
- Technical terminology.

Only include specifications supported by suitable documentation.

Do not reproduce a complete copyrighted workshop manual.

## 5.5 Tractor Identification

A dedicated guide explaining how to identify the exact tractor specification.

Include serial number, engine, chassis and equipment identification.

# 6. COMPLETE TRACTOR COMPONENT STRUCTURE

The component catalogue must cover all major mechanical systems and work progressively towards individual internal parts and fasteners.

The following list defines the intended scope, not a claim that every listed component has already been verified.

## 6.1 Engine Assembly – Standard 23C Diesel

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
- Gaskets, seals and fasteners.

## 6.2 Diesel Fuel System

Include:

- Fuel tank.
- Fuel tank cap.
- Fuel tap.
- Fuel pipes.
- Fuel filter.
- Sediment bowl.
- Fuel lift pump, where fitted.
- Injection pump.
- Injection pump mounting.
- Pump drive components.
- Injector pipes.
- Injectors.
- Injector seals.
- Injector nozzles.
- Fuel return pipes.
- Air intake.
- Air cleaner.
- Associated connections and fittings.

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
- Thermostat, where fitted.
- Water connections.
- Mounting brackets.
- Associated hardware.

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

Document differences between single-stage and dual-stage clutch arrangements.

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

This is a confirmed feature of the owner's tractor and must receive dedicated modelling and research.

Include:

- PTO output shaft.
- PTO gears.
- PTO bearings.
- PTO engagement mechanism.
- PTO housing.
- PTO seals.
- Internal transmission components associated with PTO drive.
- Associated linkage.
- Retaining hardware.
- Fasteners.

Research the difference between:

- Transmission-driven PTO.
- Live PTO.
- Single-stage clutch.
- Dual-stage clutch.

Do not assume the tractor has live PTO without confirming the relevant transmission and clutch specification.

Include an explanatory section showing how engine power reaches the PTO shaft.

## 6.7 Hydraulic Lift System

This is a confirmed feature of the owner's tractor and must be treated as a major assembly.

Include:

- Hydraulic pump.
- Pump housing.
- Pump gears or pistons, as applicable.
- Pump drive mechanism.
- Control valves.
- Control linkage.
- Hydraulic lift cover.
- Lift cylinder.
- Lift piston.
- Piston seals.
- Hydraulic passages.
- Internal pipes.
- Hydraulic strainer or filter, where applicable.
- Position control components.
- Draft control components.
- Control spring and associated components.
- Lift arms.
- Rockshaft.
- Rockshaft bearings.
- Seals.
- Gaskets.
- Pins.
- Bushes.
- Fasteners.

Provide a visual explanation of how the hydraulic system raises and lowers attached implements.

Include the relationship between the engine, hydraulic pump, control mechanism and lift arms.

## 6.8 Three-Point Linkage

Include:

- Lower lift arms.
- Upper linkage mounting points.
- Top link connection.
- Lift rods.
- Levelling box.
- Linkage pins.
- Retaining clips.
- Ball ends.
- Bushes.
- Brackets.
- Associated fittings.

Explain how the linkage attaches implements and transfers lifting force.

Distinguish tractor-mounted linkage components from removable implement components.

## 6.9 Front Axle and Steering

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

## 6.10 Braking System

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

## 6.11 Electrical System

Include:

- Starter motor.
- Generator or alternator, as applicable.
- Voltage regulator.
- Battery.
- Battery cables.
- Ignition-related components where applicable.
- Diesel starting and cold-start equipment.
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

## 6.12 Bodywork and Operator Area

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

## 6.13 Wheels and Tyres

Include:

- Front wheels.
- Rear wheels.
- Rims.
- Wheel centres.
- Wheel bolts.
- Wheel nuts.
- Tyres.
- Valve assemblies.
- Mounting components.

## 6.14 Fasteners and Small Components

This is a particularly important part of the project.

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

Where documentation identifies the original fastener specification, include:

- Thread.
- Diameter.
- Length.
- Pitch.
- Head type.
- Material.
- Quantity.

Do not assume visually similar fasteners are interchangeable.

# 7. INTERACTIVE 3D EXPERIENCE

The tractor must be constructed from separate identifiable components.

A single combined tractor mesh is unacceptable.

Use a hierarchical assembly structure.

Example:

Tractor
- Engine
  - Cylinder head
  - Cylinder block
  - Pistons
  - Crankshaft
  - Valves
  - Timing assembly
- Fuel system
- Cooling system
- Clutch
- Gearbox
- Differential
- Rear axle
- Hydraulic system
- PTO
- Three-point linkage
- Front axle
- Steering
- Brakes
- Electrical system
- Bodywork

Each component must have a unique internal ID.

## 7.1 Interaction Controls

Provide:

- Left mouse drag: rotate.
- Scroll wheel: zoom.
- Right mouse drag: pan.
- Click: select component.
- Double-click: isolate component or enter assembly.
- Dedicated controls: explode, restore and reset view.

Provide equivalent touch controls for tablets.

## 7.2 Exploded Assembly Mode

Allow components to progressively separate from their assembled positions.

Preserve the logical arrangement of components so users can understand how the tractor is constructed.

Include:

- Explosion slider.
- Full explosion.
- Restore assembly.
- Isolate selected component.
- Hide selected component.
- Show all components.

Support assembly and subassembly explosion levels.

## 7.3 Selection Behaviour

When a component is selected:

1. Highlight it in the 3D model.
2. Identify it by name.
3. Display its information panel.
4. Show its assembly hierarchy.
5. Provide links to the relevant exploded diagram.
6. Provide access to related components.

The selected component must remain identifiable when switching between views.

# 8. COMPONENT INFORMATION PANEL

Every component must have a standard information layout.

Example:

**Component:** Hydraulic Lift Pump

**Assembly:** Rear Hydraulic System

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

Include a verification indicator.

Possible statuses:

- Verified.
- Partially verified.
- Unverified.
- Variant dependent.

Never display missing information as though it were confirmed.

# 9. UK PARTS PURCHASING REFERENCES

The application is not a shop and will not sell components.

Its purpose is to help users identify the correct part and find legitimate suppliers.

Potential UK sources:

- https://mfparts.co.uk/
- https://www.anglo-agriparts.com/
- https://www.nctractorspares.co.uk/

Additional suppliers may be added after research.

Each supplier entry should contain:

- Supplier name.
- Product description.
- Supplier part number.
- Matching OEM reference.
- Product URL.
- Price, if available and verified.
- Stock status, if available and verified.
- Date last checked.

Clearly distinguish exact matches from possible alternatives.

Compatibility must be checked against the target tractor configuration.

If no suitable purchase link is available, explain that rather than supplying an unrelated product.

# 10. SEARCH SYSTEM

Create global search accessible from every main section.

Search should support:

- Component name.
- OEM number.
- Aftermarket number.
- Component description.
- Assembly.
- Technical terminology.

Search results should allow the user to jump directly to:

- The selected component in 3D.
- The relevant exploded diagram.
- Its complete information record.

Include sensible spelling tolerance and partial matching.

# 11. DATA ARCHITECTURE

Keep tractor information separate from the interface and 3D rendering code.

Use structured JSON records initially.

Example component record:

```json
{
  "id": "hydraulic-pump-001",
  "name": "Hydraulic Lift Pump",
  "system": "Hydraulics",
  "assembly": "Rear Hydraulic Lift",
  "subassembly": "Pump",
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
    "engineTypes": ["Standard 23C Diesel"],
    "serialRanges": []
  },
  "verificationStatus": "unverified",
  "sources": [],
  "suppliers": [],
  "modelReference": "hydraulic-pump-001",
  "diagramReference": null
}
```

This is a structural template, not a verified historical part record.

Support relationships between:

- Components.
- Assemblies.
- Subassemblies.
- Exploded diagrams.
- 3D model objects.
- Sources.
- Suppliers.

Use stable internal IDs that never depend on supplier part numbers.

Support multiple compatible configurations without duplicating unrelated component records.

# 12. VISUAL DESIGN

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

Avoid excessive animation, cluttered menus or distracting effects.

The finished application should look like a professional digital parts reference rather than a basic website.

# 13. LEARNING AND EXPLANATORY CONTENT

Every component should have a plain-English explanation.

A user should be able to understand:

- What the component is.
- What it does.
- Why it is needed.
- What it connects to.
- What happens if it fails.

Where appropriate, provide links to related components.

For example, selecting the hydraulic lift pump could link to:

- Hydraulic control valve.
- Lift cylinder.
- Lift piston.
- Internal hydraulic passages.
- Rockshaft.
- Lift arms.

Selecting the PTO shaft could link to:

- PTO drive gears.
- Transmission.
- Clutch.
- PTO engagement mechanism.
- PTO housing.
- Associated bearings and seals.

This should create an interconnected learning experience.

# 14. RESEARCH AND ASSET MANAGEMENT

Maintain a dedicated research database.

Every researched component should have:

- Source name.
- Source URL.
- Source type.
- Relevant page or diagram reference.
- Date researched.
- Information extracted.
- Verification status.
- Conflicting information, where applicable.

Maintain separate records for:

- Confirmed 1958 components.
- Variant-dependent components.
- Later replacement components.
- Unidentified components.

Original manuals and diagrams may be used as research references, subject to access and licensing restrictions.

Do not reproduce copyrighted diagrams without permission.

Create original diagrams and 3D assets where required.

# 15. DEVELOPMENT ROADMAP

Development must proceed in the following order.

## Phase 1 – Historical Research and Identification

Establish:

- Correct 1958 tractor identity.
- Production serial range.
- Standard 23C diesel engine specification.
- Engine components.
- Fuel system.
- Cooling system.
- Clutch configuration.
- Transmission.
- PTO configuration.
- Hydraulic lift system.
- Three-point linkage.
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

Create or source an appropriately detailed 1958 MF35 diesel model.

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

Prioritise the Standard 23C engine, hydraulic lift and PTO assemblies.

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

# 16. COMPLETENESS MEASUREMENT

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

The objective is to make progress towards the most complete possible digital catalogue of the 1958 MF35 diesel.

# 17. FINAL ACCEPTANCE CRITERIA

The application should ultimately allow a user to:

1. Open the application locally in a browser.
2. View a detailed 3D 1958 Massey Ferguson 35 diesel.
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

Build the most accurate and comprehensive interactive digital reference for the 1958 Massey Ferguson 35 diesel that available documentation and suitable 3D assets will allow.

Accuracy comes before appearance.

Completeness comes before convenience.

Usability must never be sacrificed.