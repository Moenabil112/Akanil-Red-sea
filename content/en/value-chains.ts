import type { ValueChainsContent } from "../value-chains-types";

/**
 * English value-chain content — independently edited (P2, ADR-018).
 * Every pathway is a scenario grounded in Akanil's approved baselines and
 * the shared-value logic (Sudanese resource + Moroccan processing +
 * finance and logistics + regional distribution = measurable shared
 * value). No confirmed routes, volumes, tariffs, transit times, costs,
 * approvals or partnerships are stated.
 */
export const enValueChains: ValueChainsContent = {
  overviewEyebrow: "Value chains and economic pathways",
  overviewTitle: "Six pathways from resource to measurable shared value.",
  overviewLead:
    "Each pathway shows how a Sudanese resource or capability can be combined with Moroccan processing and expertise, finance and logistics, and regional distribution. These are potential pathways for study — indicative scenarios, not confirmed routes, volumes or agreements.",
  chainsListLabel: "Priority value chains",
  profileHeroEyebrow: "Value-chain pathway",
  profileLinkLabel: "Open the pathway",
  learnMoreLabel: "Read the full pathway",
  scenarioNote:
    "Every pathway on this page is a scenario for study. Figures, routes and relationships are indicative and subject to current commercial, regulatory and logistics review. Nothing here confirms a partner, buyer, financier, route, tariff, transit time or approval.",

  categoryLabel: "Pathway type",
  scenarioStatusLabel: "Scenario status",
  sourceBasisLabel: "Source basis",
  lastReviewedLabel: "Last reviewed",
  problemLabel: "The structural problem",
  opportunityLabel: "The shared-value opportunity",
  flowLabel: "Shared-value flow",
  flowRoleLabel: "What happens",
  flowContributionLabel: "Value contribution",
  relatedPlatformsLabel: "Related portfolio platforms",
  geographicLabel: "Geographic value contribution",
  enablingLayersLabel: "Enabling layers",
  publicScopeLabel: "What is a public pathway overview now",
  verificationScopeLabel: "What requires current verification",
  limitationsLabel: "Scenario boundaries",
  prepLabel: "Prepare before requesting a review",
  regulatoryLabel: "Regulatory note",

  scenarioStatus: {
    "public-pathway-overview": "Public pathway overview",
    "requires-current-verification": "Requires current verification",
    "additional-information-after-review":
      "Additional information available after review",
    "regulated-or-sensitive-elements": "Contains regulated or sensitive elements",
  },

  enabling: {
    eyebrow: "Cross-cutting enabling layers",
    title: "The layers every pathway depends on.",
    lead: "No pathway works on resources alone. These layers cut across all six chains and are where the Gateway concentrates qualification, structuring and follow-up.",
    layers: [
      {
        title: "Qualification and trust",
        text: "Verified identity, ownership and documentation before any pathway is discussed — no anonymous flows.",
      },
      {
        title: "Finance and risk structuring",
        text: "Payment structures, insurance and risk allocation designed per case; financing availability is never implied.",
      },
      {
        title: "Logistics and corridors",
        text: "Route, storage and cold-chain scenarios studied per case; corridors shown are conceptual, not operational.",
      },
      {
        title: "Standards and traceability",
        text: "Specifications, testing, compliance and documented origin carried through the whole chain.",
      },
      {
        title: "Technology and data",
        text: "Records, monitoring and decision support that assist specialists; systems propose, humans decide.",
      },
      {
        title: "Human capability and follow-up",
        text: "Local skills, operation and structured follow-up so value stays where it is built.",
      },
    ],
  },

  geographic: {
    eyebrow: "Both sides of the bridge",
    title: "Where value is contributed along each pathway.",
    lead: "The Gateway reads both sides of the corridor. Value is created in Sudan, added in Morocco, and moved and distributed across the Red Sea space — with each side keeping the value it contributes.",
    groups: [
      {
        title: "Sudan",
        items: [
          "Agricultural, livestock and mineral resources and capability",
          "Production regions, asset owners and producers",
          "Origin value retained through qualification and documentation",
        ],
      },
      {
        title: "Morocco",
        items: [
          "Processing, industrial and technological capability",
          "Finance, insurance and standards expertise",
          "Manufacturing and market-access nodes",
        ],
      },
      {
        title: "Red Sea corridor",
        items: [
          "Ports, economic zones and logistics nodes",
          "Regional and international distribution routes",
          "Coordination between qualified stakeholders",
        ],
      },
    ],
  },

  items: [
    {
      id: "oilseeds-agro-processing",
      name: "Oilseeds and agro-processing pathway",
      shortName: "Oilseeds and agro-processing",
      category: "Oilseeds, oils and meal value addition",
      summary:
        "A potential pathway taking Sudanese oilseeds through qualification, crushing, refining and packaging in Moroccan facilities toward regional food and industrial markets — with origin value retained rather than exported raw.",
      scenarioStatus: "public-pathway-overview",
      sourceBasis:
        "Akanil approved value-chain baseline and the VALURA preliminary blueprint",
      lastReviewed: "July 2026",
      problem:
        "Oilseeds such as sesame and groundnut are exported largely as raw commodities, so grading, crushing, refining and packaging value is created elsewhere and lost at origin.",
      opportunity:
        "Combining documented Sudanese oilseed supply with Moroccan crushing, refining and food-manufacturing capability could retain more value on both sides — a scenario to study, not a committed programme.",
      flow: [
        {
          title: "Sudanese source and capability",
          role: "Qualified oilseed producers and suppliers with documented origin.",
          contribution: "Sudan — resource and origin value.",
        },
        {
          title: "Qualification and standards",
          role: "Grading, laboratory testing and food-safety compliance.",
          contribution: "Shared — trust and traceability.",
        },
        {
          title: "Moroccan processing and expertise",
          role: "Crushing, refining and food manufacturing in Moroccan facilities.",
          contribution: "Morocco — processing and value addition.",
        },
        {
          title: "Finance and logistics",
          role: "Trade finance, insurance and studied transport scenarios.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Regional distribution",
          role: "Food industries and consumer markets across the region.",
          contribution: "Corridor — market access.",
        },
        {
          title: "Measurable shared value",
          role: "Higher-value products with recorded outcomes on both sides.",
          contribution: "Both sides — retained value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway connects to platforms that qualify supply, add processing value and structure the corridor. Relationships are ecosystem roles, not confirmed operations.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Oilseed production and documented origin",
            "Producer and supplier qualification",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Crushing, refining and food manufacturing",
            "Food-safety standards and packaging",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Transport and storage scenarios",
            "Regional food and industrial markets",
          ],
        },
      ],
      enablingLayers: [
        "Qualification and trust",
        "Standards and traceability",
        "Finance and risk structuring",
        "Logistics and corridors",
      ],
      publicScope: [
        "The pathway concept and its shared-value stages",
        "The partner categories and capabilities being sought",
        "The platforms that relate to the pathway",
      ],
      verificationScope: [
        "Any specific supply volume, price or transport scenario",
        "Feasibility, financing and offtake structures for a given case",
      ],
      limitations: [
        "No supply volume, price, tariff, transit time or margin is stated or implied.",
        "No buyer, financier or logistics provider is confirmed.",
        "This is a scenario for study, subject to current commercial and regulatory review.",
      ],
      preparationRequirements: [
        "Your organization profile and role in the oilseed value chain",
        "The capability you would bring — supply, processing, offtake or finance",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "supply-offtake-requirement",
      },
    },

    {
      id: "food-cold-chain",
      name: "Food processing and cold-chain pathway",
      shortName: "Food and cold chain",
      category: "Food manufacturing and preservation",
      summary:
        "A potential pathway from Sudanese fruit, vegetable and food raw materials through sterilization, processing, packaging and cold storage toward regional markets — reducing loss and adding shelf-stable value.",
      scenarioStatus: "public-pathway-overview",
      sourceBasis:
        "Akanil approved value-chain baseline and food-security framing",
      lastReviewed: "July 2026",
      problem:
        "Perishable food output is lost or sold at low value for want of sterilization, processing, packaging and cold storage close to production.",
      opportunity:
        "Pairing Sudanese food raw materials with Moroccan food-manufacturing and preservation capability could reduce loss and add shelf-stable value — a scenario to study, with food-security relevance for both countries.",
      flow: [
        {
          title: "Sudanese source and capability",
          role: "Fruit, vegetable and food raw materials with documented origin.",
          contribution: "Sudan — resource and origin value.",
        },
        {
          title: "Qualification and standards",
          role: "Food-safety testing, grading and compliance.",
          contribution: "Shared — trust and traceability.",
        },
        {
          title: "Moroccan processing and expertise",
          role: "Sterilization, processing, packaging and food manufacturing.",
          contribution: "Morocco — processing and preservation.",
        },
        {
          title: "Finance and logistics",
          role: "Cold-chain scenarios, insurance and trade finance per case.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Regional distribution",
          role: "Consumer and institutional food markets across the region.",
          contribution: "Corridor — market access.",
        },
        {
          title: "Measurable shared value",
          role: "Reduced loss and shelf-stable products with recorded outcomes.",
          contribution: "Both sides — food-security value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway connects to platforms that qualify supply, add processing and preservation value and structure the corridor. Relationships are ecosystem roles, not confirmed operations.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Food raw materials and documented origin",
            "Producer qualification and aggregation",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Sterilization, processing and packaging",
            "Food-safety standards and shelf-life expertise",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Cold-chain and storage scenarios",
            "Regional consumer and institutional markets",
          ],
        },
      ],
      enablingLayers: [
        "Standards and traceability",
        "Logistics and corridors",
        "Qualification and trust",
        "Finance and risk structuring",
      ],
      publicScope: [
        "The pathway concept and its shared-value stages",
        "The partner categories and capabilities being sought",
        "The platforms that relate to the pathway",
      ],
      verificationScope: [
        "Any specific cold-chain, volume or market scenario",
        "Feasibility, financing and offtake structures for a given case",
      ],
      limitations: [
        "No volume, price, loss rate, cold-chain performance or transit time is stated or implied.",
        "No buyer, financier or logistics provider is confirmed.",
        "This is a scenario for study, subject to current commercial and regulatory review.",
      ],
      preparationRequirements: [
        "Your organization profile and role in the food value chain",
        "The capability you would bring — supply, processing, cold chain or finance",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "industrial-partnership",
      },
    },

    {
      id: "feed-livestock",
      name: "Feed and livestock pathway",
      shortName: "Feed and livestock",
      category: "Animal feed, production and processing",
      summary:
        "A potential pathway connecting Sudanese livestock and feed inputs with Moroccan feed manufacturing, veterinary standards and market access — distributing value and risk across qualified partners.",
      scenarioStatus: "requires-current-verification",
      sourceBasis: "Akanil approved value-chain baseline",
      lastReviewed: "July 2026",
      problem:
        "Livestock and feed value chains are fragmented, with weak links between inputs, animal production, processing, quality and documented market access.",
      opportunity:
        "Linking Sudanese livestock capacity with Moroccan feed manufacturing, veterinary standards and market access could distribute value and risk more fairly — a scenario whose specific structures require current verification.",
      flow: [
        {
          title: "Sudanese source and capability",
          role: "Qualified producers and feed inputs with documented identity.",
          contribution: "Sudan — resource and origin value.",
        },
        {
          title: "Qualification and standards",
          role: "Specifications, continuity, veterinary and compliance checks.",
          contribution: "Shared — trust and traceability.",
        },
        {
          title: "Moroccan processing and expertise",
          role: "Feed manufacturing, veterinary standards and packaging.",
          contribution: "Morocco — processing and standards.",
        },
        {
          title: "Finance and logistics",
          role: "Payment structures, insurance and per-case corridor design.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Regional distribution",
          role: "Documented demand in Moroccan, African and Gulf markets.",
          contribution: "Corridor — market access.",
        },
        {
          title: "Measurable shared value",
          role: "Traceable results with value on both sides of the chain.",
          contribution: "Both sides — retained value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway connects to platforms that qualify supply and structure the corridor. Relationships are ecosystem roles, not confirmed operations.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Livestock capacity and feed inputs",
            "Producer qualification and documentation",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Feed manufacturing and veterinary standards",
            "Quality, packaging and processing expertise",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Transport, storage and insurance scenarios",
            "Regional and Gulf market access",
          ],
        },
      ],
      enablingLayers: [
        "Qualification and trust",
        "Standards and traceability",
        "Finance and risk structuring",
        "Logistics and corridors",
      ],
      publicScope: [
        "The pathway concept and its shared-value stages",
        "The partner categories and capabilities being sought",
      ],
      verificationScope: [
        "Current supply, health-standard and market scenarios",
        "Feasibility, financing and offtake structures for a given case",
      ],
      limitations: [
        "No herd size, volume, price or health claim is stated or implied.",
        "No producer, buyer or financier is confirmed.",
        "Specific structures require current commercial, veterinary and regulatory review.",
      ],
      preparationRequirements: [
        "Your organization profile and role in the feed and livestock chain",
        "The capability you would bring — supply, processing, standards or finance",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "supply-offtake-requirement",
      },
    },

    {
      id: "water-energy-agritech",
      name: "Water, energy and agritech pathway",
      shortName: "Water, energy and agritech",
      category: "Irrigation, renewable energy and digital agriculture",
      summary:
        "A potential pathway matching Moroccan irrigation, renewable-energy and agritech capability to diagnosed Sudanese needs — delivered with operation and training so capability stays local.",
      scenarioStatus: "requires-current-verification",
      sourceBasis:
        "Akanil approved value-chain baseline and the RWAFID platform concept",
      lastReviewed: "July 2026",
      problem:
        "Productivity is constrained by water, energy and know-how gaps, while solutions are often delivered without local operation or skills transfer.",
      opportunity:
        "Matching Moroccan irrigation, renewable-energy and agritech capability to diagnosed Sudanese needs — with training included — could build durable local capability. Specific needs and counterparts require current verification.",
      flow: [
        {
          title: "Need diagnosis",
          role: "Documented Sudanese requirements in water, energy and farming.",
          contribution: "Sudan — need and context.",
        },
        {
          title: "Qualification and standards",
          role: "Site, feasibility and counterpart verification.",
          contribution: "Shared — trust and diligence.",
        },
        {
          title: "Moroccan solutions and expertise",
          role: "Equipment, engineering and digital-agriculture capability.",
          contribution: "Morocco — solutions and expertise.",
        },
        {
          title: "Finance and logistics",
          role: "Project finance and delivery structured per case.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Operation and training",
          role: "Installation, local operation and skills transfer.",
          contribution: "Sudan — retained capability.",
        },
        {
          title: "Measurable shared value",
          role: "Productivity, resilience and durable local capability.",
          contribution: "Both sides — lasting value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway connects to platforms that diagnose needs, provide capability and support operation. Relationships are ecosystem roles, not confirmed operations.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Diagnosed water, energy and farming needs",
            "Local operation and retained skills",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Irrigation, renewable-energy and agritech capability",
            "Engineering, training and digital agriculture",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Delivery and project-logistics scenarios",
            "Regional knowledge and technology exchange",
          ],
        },
      ],
      enablingLayers: [
        "Technology and data",
        "Human capability and follow-up",
        "Finance and risk structuring",
        "Standards and traceability",
      ],
      publicScope: [
        "The pathway concept and its shared-value stages",
        "The capability categories that can be matched to needs",
      ],
      verificationScope: [
        "Specific Sudanese needs, sites and counterparts",
        "Feasibility, financing and delivery structures for a given case",
      ],
      limitations: [
        "No yield, capacity, savings or performance figure is stated or implied.",
        "No site, counterpart or financier is confirmed.",
        "Specific needs and structures require current verification.",
      ],
      preparationRequirements: [
        "Your organization profile and role in water, energy or agritech",
        "The need or capability you wish to discuss",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "technology-data-partnership",
      },
    },

    {
      id: "mining-mineral-value",
      name: "Mining and mineral value-addition pathway",
      shortName: "Mining and mineral value",
      category: "Responsible mineral value addition",
      summary:
        "A potential pathway from a qualified Sudanese mineral resource through analysis, standards, value-addition steps and a responsible, traceable market route — with identity and compliance throughout.",
      scenarioStatus: "regulated-or-sensitive-elements",
      sourceBasis: "Akanil approved value-chain baseline",
      lastReviewed: "July 2026",
      problem:
        "Mineral resources move through fragmented, sometimes undocumented routes, with value added elsewhere and traceability weak.",
      opportunity:
        "Taking a qualified mineral resource through analysis, standards and value-addition steps toward a responsible, traceable market could raise value at origin — strictly within regulatory and diligence requirements.",
      flow: [
        {
          title: "Source qualification",
          role: "Verified ownership, identity and documentation first.",
          contribution: "Sudan — resource and origin value.",
        },
        {
          title: "Analysis and standards",
          role: "Assaying, classification and regulatory compliance.",
          contribution: "Shared — trust and compliance.",
        },
        {
          title: "Processing and value addition",
          role: "Value-addition steps with Moroccan equipment or expertise.",
          contribution: "Morocco — value addition.",
        },
        {
          title: "Finance and logistics",
          role: "Structured finance with documented risk assessment.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Responsible market route",
          role: "Qualified industrial buyers under traceability rules.",
          contribution: "Corridor — market access.",
        },
        {
          title: "Measurable shared value",
          role: "Responsible pathways that raise value at origin.",
          contribution: "Both sides — retained value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway connects to platforms that structure the corridor and, potentially, a regulated enabling layer. No financing or custody service is active or offered.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Mineral resource with verified ownership",
            "Origin value retained through qualification",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Value-addition equipment and expertise",
            "Standards, assaying and diligence support",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Traceable, documented market routes",
            "Qualified industrial buyers",
          ],
        },
      ],
      enablingLayers: [
        "Qualification and trust",
        "Standards and traceability",
        "Finance and risk structuring",
        "Logistics and corridors",
      ],
      publicScope: [
        "The pathway concept and its responsible, traceable stages",
        "The qualification and compliance principles applied",
      ],
      verificationScope: [
        "Any specific resource, ownership or market scenario",
        "Regulatory, diligence and financing structures for a given case",
      ],
      limitations: [
        "No reserve, grade, volume, price or return is stated or implied.",
        "No resource, buyer, financier or custody arrangement is confirmed.",
        "No anonymous flows: identity, compliance and traceability are prerequisites.",
      ],
      preparationRequirements: [
        "Your organization profile and role, and the nature of the resource or capability",
        "Ownership, licence and documentation status you can evidence under a controlled process",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "submit-project-asset",
      },
      regulatoryNote:
        "Mineral value chains are regulated and sensitive. Any pathway is strictly subject to verified ownership, licensing, compliance and traceability, and to current regulatory review. Reception of a request is not acceptance, and no financing, custody or convertibility is offered.",
    },

    {
      id: "ports-logistics-corridors",
      name: "Ports, logistics and corridors pathway",
      shortName: "Ports and logistics",
      category: "Corridor design and supply-chain coordination",
      summary:
        "A potential pathway structuring how qualified products move between production regions, ports, economic zones and markets across the Red Sea space — the connective layer under the other five pathways.",
      scenarioStatus: "requires-current-verification",
      sourceBasis:
        "Akanil approved value-chain baseline and the Trade-Chain Africa corridor architecture",
      lastReviewed: "July 2026",
      problem:
        "Production reaches Red Sea and international markets through fragmented, undocumented routes with unclear standards, storage and stakeholder coordination.",
      opportunity:
        "Designing corridor scenarios and coordinating qualified stakeholders — ports, zones, storage and documentation — could make the other pathways executable. Routes shown are conceptual and require current verification.",
      flow: [
        {
          title: "Origin and qualification",
          role: "Qualified production regions and documented consignments.",
          contribution: "Sudan — origin and readiness.",
        },
        {
          title: "Standards and documentation",
          role: "Customs, standards and documentation preparation.",
          contribution: "Shared — trust and compliance.",
        },
        {
          title: "Corridor and node design",
          role: "Route, port, zone and storage scenarios studied per case.",
          contribution: "Corridor — connective design.",
        },
        {
          title: "Finance and coordination",
          role: "Insurance, risk and qualified stakeholder coordination.",
          contribution: "Shared — structuring, per case.",
        },
        {
          title: "Market access",
          role: "Moroccan manufacturing and international market nodes.",
          contribution: "Morocco / corridor — market access.",
        },
        {
          title: "Measurable shared value",
          role: "Documented, coordinated movement with value on both sides.",
          contribution: "Both sides — enabled value.",
        },
      ],
      relatedPlatformsNote:
        "This pathway is the corridor layer under the other pathways, connecting to platforms that structure routes and, potentially, a regulated enabling layer. Corridors are conceptual, not operational.",
      geographicContribution: [
        {
          title: "Sudan",
          items: [
            "Production regions and documented consignments",
            "Origin readiness and qualification",
          ],
        },
        {
          title: "Morocco",
          items: [
            "Manufacturing and market-access nodes",
            "Standards and documentation expertise",
          ],
        },
        {
          title: "Red Sea corridor",
          items: [
            "Ports, economic zones and storage scenarios",
            "Qualified stakeholder coordination",
          ],
        },
      ],
      enablingLayers: [
        "Logistics and corridors",
        "Standards and traceability",
        "Technology and data",
        "Finance and risk structuring",
      ],
      publicScope: [
        "The corridor-design concept and its coordination stages",
        "The node and stakeholder categories involved",
      ],
      verificationScope: [
        "Any specific route, port, storage or timing scenario",
        "Standards, insurance and coordination structures for a given case",
      ],
      limitations: [
        "No route is operational, and no transit time, tariff, capacity or cost is stated or implied.",
        "No port, zone, carrier or authority is presented as a confirmed partner.",
        "Corridor visuals are conceptual and require current logistics and regulatory review.",
      ],
      preparationRequirements: [
        "Your organization profile and role in ports, logistics or trade",
        "The corridor need or capability you wish to discuss",
      ],
      cta: {
        label: "Discuss this pathway",
        requestType: "port-logistics-cooperation",
      },
    },
  ],
};
