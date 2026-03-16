import { Qualification, Unit, EvidenceItem, QualificationId } from "./types";

/**
 * Source: training.gov.au (national register of VET)
 * Last verified: 2026-03-13
 * https://training.gov.au
 */
export const TGA_SOURCE = {
  name: "training.gov.au",
  url: "https://training.gov.au",
  lastVerified: "2026-03-13",
} as const;

const CPC40120_CORE = [
  "CPCCBC4001", "CPCCBC4002", "CPCCBC4007", "CPCCBC4008",
  "CPCCBC4009", "CPCCBC4010", "CPCCBC4012", "CPCCBC4014",
  "CPCCBC4018", "CPCCBC4021", "CPCCBC4053",
] as const;

const CPC40120_ELECTIVE = [
  "BSBLDR413", "BSBPMG422", "BSBWRT411", "CPCCBC4003",
  "CPCCBC4004", "CPCCBC4005", "CPCCBC4006", "CPCSUS4002",
] as const;

const CPC50220_CORE = [
  "BSBOPS504", "BSBWHS513",
  "CPCCBC4001", "CPCCBC4003", "CPCCBC4004", "CPCCBC4005",
  "CPCCBC4008", "CPCCBC4009", "CPCCBC4010", "CPCCBC4012",
  "CPCCBC4013", "CPCCBC4014", "CPCCBC4018", "CPCCBC4053",
  "CPCCBC5001", "CPCCBC5002", "CPCCBC5003", "CPCCBC5005",
  "CPCCBC5007", "CPCCBC5010", "CPCCBC5011", "CPCCBC5013",
  "CPCCBC5018", "CPCCBC5019",
] as const;

const CPC50220_ELECTIVE = [
  "CPCCBC5004", "CPCCBC5006", "CPCCBC5009",
] as const;

const CPC60220_CORE = [
  "BSBWHS516", "CPCCBC6001", "CPCCBC6003", "CPCCBC6018",
] as const;

const CPC60220_ELECTIVE = [
  "BSBOPS504", "CPCCBC6007", "CPCCBC6009",
  "CPCCBC6014", "CPCCBC6016", "CPCCBC6017",
] as const;

export const QUALIFICATIONS: Qualification[] = [
  {
    id: "CPC40120",
    code: "CPC40120",
    title: "Certificate IV in Building and Construction (Building)",
    level: "Certificate IV",
    coreUnits: [...CPC40120_CORE],
    electiveUnits: [...CPC40120_ELECTIVE],
    units: [...CPC40120_CORE, ...CPC40120_ELECTIVE],
    tgaUrl: "https://training.gov.au/training/details/CPC40120",
  },
  {
    id: "CPC50220",
    code: "CPC50220",
    title: "Diploma of Building and Construction (Building)",
    level: "Diploma",
    coreUnits: [...CPC50220_CORE],
    electiveUnits: [...CPC50220_ELECTIVE],
    units: [...CPC50220_CORE, ...CPC50220_ELECTIVE],
    tgaUrl: "https://training.gov.au/training/details/CPC50220",
  },
  {
    id: "CPC60220",
    code: "CPC60220",
    title: "Advanced Diploma of Building and Construction (Management)",
    level: "Advanced Diploma",
    coreUnits: [...CPC60220_CORE],
    electiveUnits: [...CPC60220_ELECTIVE],
    units: [...CPC60220_CORE, ...CPC60220_ELECTIVE],
    tgaUrl: "https://training.gov.au/training/details/CPC60220",
  },
];

export const UNITS: Unit[] = [
  // CPC40120 – Certificate IV (19 units: 11 core + 8 elective)
  { code: "CPCCBC4001", title: "Apply building codes and standards to the construction process for Class 1 and 10 buildings", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4002", title: "Manage work health and safety in the building and construction workplace", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4007", title: "Plan building and construction work", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4008", title: "Supervise site communication and administration processes for building and construction projects", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4009", title: "Apply legal requirements to building and construction projects", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4010", title: "Apply structural principles to residential and commercial constructions", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4012", title: "Read and interpret plans and specifications", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4014", title: "Prepare simple building sketches and drawings", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4018", title: "Apply site surveys and set-out procedures to building and construction projects", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4021", title: "Minimise waste on the building and construction site", qualification: "CPC40120", isCore: true },
  { code: "CPCCBC4053", title: "Apply building codes and standards to the construction process for Class 2 to 9 Type C buildings", qualification: "CPC40120", isCore: true },
  { code: "BSBLDR413", title: "Lead effective workplace relationships", qualification: "CPC40120", isCore: false },
  { code: "BSBPMG422", title: "Apply project quality management techniques", qualification: "CPC40120", isCore: false },
  { code: "BSBWRT411", title: "Write complex documents", qualification: "CPC40120", isCore: false },
  { code: "CPCCBC4003", title: "Select, prepare and administer a construction contract", qualification: "CPC40120", isCore: false },
  { code: "CPCCBC4004", title: "Identify and produce estimated costs for building and construction projects", qualification: "CPC40120", isCore: false },
  { code: "CPCCBC4005", title: "Produce labour and material schedules for ordering", qualification: "CPC40120", isCore: false },
  { code: "CPCCBC4006", title: "Select, procure and store construction materials for building and construction projects", qualification: "CPC40120", isCore: false },
  { code: "CPCSUS4002", title: "Use building science principles to construct energy efficient buildings", qualification: "CPC40120", isCore: false },

  // CPC50220 – Diploma (27 units: 24 core + 3 elective)
  { code: "BSBOPS504", title: "Manage business risk", qualification: "CPC50220", isCore: true },
  { code: "BSBWHS513", title: "Lead WHS risk management", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4001", title: "Apply building codes and standards to the construction process for Class 1 and 10 buildings", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4003", title: "Select, prepare and administer a construction contract", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4004", title: "Identify and produce estimated costs for building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4005", title: "Produce labour and material schedules for ordering", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4008", title: "Supervise site communication and administration processes for building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4009", title: "Apply legal requirements to building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4010", title: "Apply structural principles to residential and commercial constructions", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4012", title: "Read and interpret plans and specifications", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4013", title: "Prepare and evaluate tender documentation", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4014", title: "Prepare simple building sketches and drawings", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4018", title: "Apply site surveys and set-out procedures to building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC4053", title: "Apply building codes and standards to the construction process for Class 2 to 9 Type C buildings", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5001", title: "Apply building codes and standards to the construction process for Type B construction", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5002", title: "Monitor costing systems on complex building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5003", title: "Supervise the planning of on-site building and construction work", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5005", title: "Select and manage building and construction contractors", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5007", title: "Administer the legal obligations of a building and construction contractor", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5010", title: "Manage construction work", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5011", title: "Manage environmental management practices and processes in building and construction", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5013", title: "Manage professional technical and legal reports on building and construction projects", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5018", title: "Apply structural principles to the construction of buildings up to three storeys", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5019", title: "Manage building and construction business finances", qualification: "CPC50220", isCore: true },
  { code: "CPCCBC5004", title: "Supervise and apply quality standards to the selection of building and construction materials", qualification: "CPC50220", isCore: false },
  { code: "CPCCBC5006", title: "Apply site surveys and set-out procedures to building projects up to three storeys", qualification: "CPC50220", isCore: false },
  { code: "CPCCBC5009", title: "Identify services layout and connection methods for Type B and C constructions", qualification: "CPC50220", isCore: false },

  // CPC60220 – Advanced Diploma (10 units: 4 core + 6 elective)
  { code: "BSBWHS516", title: "Contribute to developing, implementing and maintaining an organisation's WHS management system", qualification: "CPC60220", isCore: true },
  { code: "CPCCBC6001", title: "Apply building codes and standards to the construction process for large building projects", qualification: "CPC60220", isCore: true },
  { code: "CPCCBC6003", title: "Establish, maintain and review contract administration procedures and frameworks", qualification: "CPC60220", isCore: true },
  { code: "CPCCBC6018", title: "Manage processes for complying with legal obligations of a building and construction contractor", qualification: "CPC60220", isCore: true },
  { code: "BSBOPS504", title: "Manage business risk", qualification: "CPC60220", isCore: false },
  { code: "CPCCBC6007", title: "Develop, plan and implement building and construction environmental management processes", qualification: "CPC60220", isCore: false },
  { code: "CPCCBC6009", title: "Develop, plan and implement a building and construction planning process", qualification: "CPC60220", isCore: false },
  { code: "CPCCBC6014", title: "Apply structural principles to the construction of large, high-rise and complex buildings", qualification: "CPC60220", isCore: false },
  { code: "CPCCBC6016", title: "Assess construction faults in large building projects", qualification: "CPC60220", isCore: false },
  { code: "CPCCBC6017", title: "Evaluate services layout and connection methods for the planning of large building projects", qualification: "CPC60220", isCore: false },
];

/*
  COLOUR CODE LEGEND (by transferability / number of units mapped):
  ─────────────────────────────────────────────────────────────────
  GOLD   (#FFD700) — Maps to 15+ units  (highest transferability, upload first)
  AMBER  (#FF8C00) — Maps to 10–14 units
  CYAN   (#06B6D4) — Maps to 6–9 units
  LIME   (#84CC16) — Maps to 3–5 units
  SLATE  (#94A3B8) — Maps to 1–2 units  (most specific)
*/

export const COLOUR_LEGEND = [
  { colour: "#FFD700", bg: "bg-yellow-400/20", border: "border-yellow-400", text: "text-yellow-400", label: "Gold — 15+ units", min: 15 },
  { colour: "#FF8C00", bg: "bg-orange-400/20", border: "border-orange-400", text: "text-orange-400", label: "Amber — 10–14 units", min: 10 },
  { colour: "#06B6D4", bg: "bg-cyan-400/20", border: "border-cyan-400", text: "text-cyan-400", label: "Cyan — 6–9 units", min: 6 },
  { colour: "#84CC16", bg: "bg-lime-400/20", border: "border-lime-400", text: "text-lime-400", label: "Lime — 3–5 units", min: 3 },
  { colour: "#94A3B8", bg: "bg-slate-400/20", border: "border-slate-400", text: "text-slate-400", label: "Slate — 1–2 units", min: 1 },
];

function getColourCode(unitCount: number): { colour: string; label: string } {
  if (unitCount >= 15) return { colour: "#FFD700", label: "Gold" };
  if (unitCount >= 10) return { colour: "#FF8C00", label: "Amber" };
  if (unitCount >= 6) return { colour: "#06B6D4", label: "Cyan" };
  if (unitCount >= 3) return { colour: "#84CC16", label: "Lime" };
  return { colour: "#94A3B8", label: "Slate" };
}

interface RawEvidence {
  id: string;
  name: string;
  description: string;
  category: string;
  unitMappings: string[];
}

const RAW_EVIDENCE: RawEvidence[] = [
  {
    id: "EV01",
    name: "Building Plans & Architectural Drawings",
    description: "Approved architectural plans showing floor plans, elevations, sections and site plans for residential or commercial projects",
    category: "Plans & Specifications",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4007", "CPCCBC4010", "CPCCBC4012", "CPCCBC4014", "CPCCBC4018", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5003", "CPCCBC5009", "CPCCBC5019", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6014", "CPCCBC6016",
    ],
  },
  {
    id: "EV02",
    name: "Site Photos — Construction Stages",
    description: "Photographic evidence of construction progress at key stages: footings, framing, lock-up, fixing, and completion",
    category: "Site Documentation",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4007", "CPCCBC4008", "CPCCBC4010", "CPCCBC4012", "CPCCBC4018", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5003", "CPCCBC5004", "CPCCBC5010", "CPCCBC5019",
      "CPCCBC6001", "CPCCBC6009", "CPCCBC6016",
    ],
  },
  {
    id: "EV03",
    name: "SWMS — Safe Work Method Statements",
    description: "Completed SWMS for high-risk construction work including demolition, scaffolding, excavation, crane work and working at heights",
    category: "WHS Documentation",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4008", "CPCCBC4009", "CPCCBC4002", "BSBWRT411",
      "CPCCBC5003", "CPCCBC5007", "CPCCBC5010", "CPCCBC5011",
      "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV04",
    name: "Construction Contracts (Signed)",
    description: "Executed building contracts (HIA, MBA or custom) including scope of works, contract sum, variations clause and payment schedule",
    category: "Contracts & Legal",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4009", "CPCCBC4013", "BSBWRT411",
      "CPCCBC5005", "CPCCBC5007", "CPCCBC5010", "CPCCBC5013",
      "CPCCBC6003", "CPCCBC6018",
    ],
  },
  {
    id: "EV05",
    name: "Contract Variations & Claims",
    description: "Documented variations to original contract including scope changes, cost adjustments, client approvals and time extensions",
    category: "Contracts & Legal",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4004", "CPCCBC4009",
      "CPCCBC5002", "CPCCBC5007", "CPCCBC5013",
      "CPCCBC6003",
    ],
  },
  {
    id: "EV06",
    name: "Cost Estimates & Quantity Surveys",
    description: "Detailed cost estimates, quantity take-offs and pricing schedules for building projects including labour, materials and margins",
    category: "Costing & Finance",
    unitMappings: [
      "CPCCBC4004", "CPCCBC4005", "CPCCBC4013",
      "CPCCBC5002", "CPCCBC5019",
    ],
  },
  {
    id: "EV07",
    name: "Project Schedules & Programmes",
    description: "Construction programmes, Gantt charts or bar charts showing project timeline, critical path, milestones and task dependencies",
    category: "Project Management",
    unitMappings: [
      "CPCCBC4005", "CPCCBC4007", "CPCCBC4008",
      "CPCCBC5003", "CPCCBC5010", "CPCCBC5019",
      "CPCCBC6016",
    ],
  },
  {
    id: "EV08",
    name: "Material Orders & Purchase Orders",
    description: "Purchase orders, delivery dockets and material requisitions showing procurement of construction materials and supplies",
    category: "Procurement",
    unitMappings: [
      "CPCCBC4004", "CPCCBC4005",
      "CPCCBC5002", "CPCCBC5004", "CPCCBC5010",
    ],
  },
  {
    id: "EV09",
    name: "Site Inspection Reports",
    description: "Inspection records from council, private certifier or internal QA checks at mandatory hold points and completion stages",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4008", "CPCCBC4009", "CPCCBC4010", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5003", "CPCCBC5004", "CPCCBC5010",
      "CPCCBC6001", "CPCCBC6009", "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV10",
    name: "Council / DA Approvals",
    description: "Development application approvals, construction certificates and complying development certificates from local council or accredited certifier",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4009", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5007",
      "CPCCBC6001", "CPCCBC6018",
    ],
  },
  {
    id: "EV11",
    name: "Building Permits & Compliance Certificates",
    description: "Building permits, occupation certificates, compliance certificates and final inspection certificates",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4009", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5007", "CPCCBC5010",
      "CPCCBC6001", "CPCCBC6009", "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV12",
    name: "Toolbox Talk Records",
    description: "Records of pre-start meetings, toolbox talks and safety briefings conducted on-site with worker sign-on sheets",
    category: "WHS Documentation",
    unitMappings: [
      "CPCCBC4008", "CPCCBC4002", "BSBLDR413",
      "CPCCBC5003", "CPCCBC5010",
      "CPCCBC6018",
    ],
  },
  {
    id: "EV13",
    name: "Quality Assurance Checklists",
    description: "Completed QA checklists for construction stages including waterproofing, concrete pours, framing checks and finishing standards",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4008", "CPCCBC4010", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5004", "CPCCBC5010",
      "CPCCBC6001", "CPCCBC6009", "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV14",
    name: "Subcontractor Agreements",
    description: "Signed subcontractor agreements including scope, rates, insurance requirements, safety obligations and payment terms",
    category: "Contracts & Legal",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4008", "CPCCBC4009", "BSBLDR413",
      "CPCCBC5005", "CPCCBC5007", "CPCCBC5010", "CPCCBC5013",
      "CPCCBC6003",
    ],
  },
  {
    id: "EV15",
    name: "Progress Claims & Payment Schedules",
    description: "Progress payment claims, payment certificates and payment schedule documentation aligned with contract milestones",
    category: "Costing & Finance",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4004",
      "CPCCBC5002", "CPCCBC5007", "CPCCBC5013",
      "CPCCBC6003",
    ],
  },
  {
    id: "EV16",
    name: "Defects & Snagging Lists",
    description: "Defects lists, rectification records and snagging reports identifying construction faults and remediation actions taken",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4010",
      "CPCCBC5001", "CPCCBC5004", "CPCCBC5010",
      "CPCCBC6001", "CPCCBC6009", "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV17",
    name: "Handover Documentation",
    description: "Practical completion certificates, handover packs, warranty documentation, maintenance manuals and as-built drawings provided at project completion",
    category: "Project Management",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4008", "BSBWRT411",
      "CPCCBC5010", "CPCCBC5013", "CPCCBC5019",
      "CPCCBC6003", "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV18",
    name: "Environmental Management Plans",
    description: "Site-specific environmental management plans addressing erosion control, dust suppression, waste management and stormwater protection",
    category: "Environmental",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4009", "CPCCBC4002",
      "CPCCBC5003", "CPCCBC5011",
      "CPCCBC6018",
    ],
  },
  {
    id: "EV19",
    name: "Risk Assessments & Risk Registers",
    description: "Project risk assessments, risk registers and risk treatment plans covering construction, financial, contractual and safety risks",
    category: "WHS Documentation",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4009", "CPCCBC4002", "BSBWRT411",
      "CPCCBC5003", "CPCCBC5007", "CPCCBC5010", "CPCCBC5011",
      "CPCCBC6018",
    ],
  },
  {
    id: "EV20",
    name: "Tender Submissions & Evaluation",
    description: "Tender documents prepared or evaluated including tender schedules, selection criteria, comparative analysis and recommendation reports",
    category: "Contracts & Legal",
    unitMappings: [
      "CPCCBC4004", "CPCCBC4013", "BSBWRT411",
      "CPCCBC5002", "CPCCBC5005", "CPCCBC5013",
      "CPCCBC6003",
    ],
  },
  {
    id: "EV21",
    name: "Site Meeting Minutes",
    description: "Minutes from site meetings, progress meetings and client meetings documenting decisions, actions and project status updates",
    category: "Site Documentation",
    unitMappings: [
      "CPCCBC4008", "BSBLDR413", "BSBWRT411",
      "CPCCBC5003", "CPCCBC5005", "CPCCBC5010",
    ],
  },
  {
    id: "EV22",
    name: "Building Code Compliance Reports",
    description: "Reports demonstrating compliance with the National Construction Code (NCC), BCA and relevant Australian Standards",
    category: "Compliance & Quality",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4010", "CPCCBC4053",
      "CPCCBC5001", "CPCCBC5009", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6009", "CPCCBC6018", "CPCCBC6014",
    ],
  },
  {
    id: "EV23",
    name: "Supervisor / Third-Party References",
    description: "Signed reference letters or verification statements from supervisors, clients or industry peers confirming construction experience and competency",
    category: "Verification",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4008", "BSBLDR413",
      "CPCCBC5003", "CPCCBC5005", "CPCCBC5010",
      "CPCCBC6016",
    ],
  },
  {
    id: "EV24",
    name: "Budget Reports & Financial Summaries",
    description: "Project budget reports, cost-to-complete analyses, financial forecasts and margin summaries for building projects",
    category: "Costing & Finance",
    unitMappings: [
      "CPCCBC4004", "CPCCBC4005",
      "CPCCBC5002", "CPCCBC5019",
    ],
  },
  {
    id: "EV25",
    name: "As-Built Drawings",
    description: "As-built drawings and marked-up plans reflecting actual construction dimensions, service locations and any deviations from original design",
    category: "Plans & Specifications",
    unitMappings: [
      "CPCCBC4012", "CPCCBC4014",
      "CPCCBC5001", "CPCCBC5009", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6014", "CPCCBC6016",
    ],
  },
  {
    id: "EV26",
    name: "Soil & Geotechnical Reports",
    description: "Geotechnical investigation reports including soil classification, bearing capacity, reactive soil assessment and foundation recommendations",
    category: "Technical Reports",
    unitMappings: [
      "CPCCBC4010", "CPCCBC4018",
      "CPCCBC5001", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6014",
    ],
  },
  {
    id: "EV27",
    name: "Survey Plans & Set-Out Documentation",
    description: "Registered survey plans, site set-out sheets, boundary identification and level datum documentation",
    category: "Plans & Specifications",
    unitMappings: [
      "CPCCBC4012", "CPCCBC4014", "CPCCBC4018",
      "CPCCBC5003", "CPCCBC5009",
    ],
  },
  {
    id: "EV28",
    name: "WHS Management Plans",
    description: "Project-specific WHS management plans including emergency procedures, hazard identification, PPE requirements and incident reporting protocols",
    category: "WHS Documentation",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4008", "CPCCBC4009", "CPCCBC4002", "BSBWRT411",
      "CPCCBC5003", "CPCCBC5007", "CPCCBC5010", "CPCCBC5011",
      "CPCCBC6018", "CPCCBC6016",
    ],
  },
  {
    id: "EV29",
    name: "Structural Engineering Calculations",
    description: "Structural engineering computations, load path analyses, member sizing calculations and connection design details",
    category: "Technical Reports",
    unitMappings: [
      "CPCCBC4010", "CPCCBC4012",
      "CPCCBC5001", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6014",
    ],
  },
  {
    id: "EV30",
    name: "Practical Completion Certificates",
    description: "Formal practical completion certificates issued by superintendent or contract administrator confirming project completion to contract requirements",
    category: "Project Management",
    unitMappings: [
      "CPCCBC4003",
      "CPCCBC5010", "CPCCBC5013", "CPCCBC5019",
      "CPCCBC6003", "CPCCBC6018",
    ],
  },
  {
    id: "EV31",
    name: "Construction Management Plans",
    description: "Comprehensive construction management plans including methodology, staging, logistics, traffic management and site establishment",
    category: "Project Management",
    unitMappings: [
      "CPCCBC4007", "CPCCBC4008",
      "CPCCBC5003", "CPCCBC5010", "CPCCBC5019",
      "CPCCBC6016",
    ],
  },
  {
    id: "EV32",
    name: "Insurance & Licensing Documentation",
    description: "Evidence of current builder's licence, home warranty insurance, public liability, workers compensation and professional indemnity insurance",
    category: "Contracts & Legal",
    unitMappings: [
      "CPCCBC4003", "CPCCBC4009",
      "CPCCBC5007",
      "CPCCBC6003", "CPCCBC6018",
    ],
  },
  {
    id: "EV33",
    name: "Material Specifications & Test Certificates",
    description: "Material compliance certificates, concrete test results, steel mill certificates and product technical data sheets",
    category: "Technical Reports",
    unitMappings: [
      "CPCCBC4001", "CPCCBC4010",
      "CPCCBC5001", "CPCCBC5004", "CPCCBC5018",
      "CPCCBC6001", "CPCCBC6007", "CPCCBC6009", "CPCCBC6014",
    ],
  },
  {
    id: "EV34",
    name: "Services Layout & Connection Plans",
    description: "Hydraulic, electrical, mechanical and fire services layout drawings and connection point documentation",
    category: "Plans & Specifications",
    unitMappings: [
      "CPCCBC4012",
      "CPCCBC5009",
      "CPCCBC6001", "CPCCBC6007",
    ],
  },
  {
    id: "EV35",
    name: "Incident & Hazard Reports",
    description: "Workplace incident reports, near-miss reports, hazard notifications and corrective action records from construction sites",
    category: "WHS Documentation",
    unitMappings: [
      "CPCCBC4009", "CPCCBC4002", "BSBWRT411",
      "CPCCBC5007", "CPCCBC5011",
      "CPCCBC6018",
    ],
  },
];

export const EVIDENCE_ITEMS: EvidenceItem[] = RAW_EVIDENCE.map((ev) => {
  const { colour, label } = getColourCode(ev.unitMappings.length);
  return {
    ...ev,
    colourCode: colour,
    colourLabel: label,
    transferabilityScore: ev.unitMappings.length,
  };
}).sort((a, b) => b.transferabilityScore - a.transferabilityScore);

export function getUnitsByQualification(qualId: QualificationId): Unit[] {
  return UNITS.filter((u) => u.qualification === qualId);
}

export function getEvidenceForUnit(unitCode: string): EvidenceItem[] {
  return EVIDENCE_ITEMS.filter((ev) => ev.unitMappings.includes(unitCode));
}

export function getQualificationsForEvidence(ev: EvidenceItem): QualificationId[] {
  const quals = new Set<QualificationId>();
  for (const unitCode of ev.unitMappings) {
    const unit = UNITS.find((u) => u.code === unitCode);
    if (unit) quals.add(unit.qualification);
  }
  return Array.from(quals);
}

export const EVIDENCE_CATEGORIES = Array.from(
  new Set(EVIDENCE_ITEMS.map((e) => e.category))
).sort();
