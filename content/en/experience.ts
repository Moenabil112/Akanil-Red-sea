import type { ExperienceContent } from "../types";

/** English — gateway experience layer (status, audiences, summaries, routes). */
export const enExperience: ExperienceContent = {
  status: {
    eyebrow: "Current status",
    title: "What is active today — and what remains conceptual.",
    items: [
      {
        label: "Institutional model",
        state: "Approved baseline",
        kind: "approved",
        note: "Governed by Akanil's approved strategic and knowledge baselines.",
      },
      {
        label: "Public introduction window",
        state: "Live",
        kind: "live",
        note: "This trilingual website is the Gateway's public introduction.",
      },
      {
        label: "Institutional reception",
        state: "Active",
        kind: "active",
        note: "Requests are received by email and telephone through the reception desk.",
      },
      {
        label: "Qualification",
        state: "Human-reviewed",
        kind: "controlled",
        note: "Every request is reviewed by an authorized person; nothing is automatic.",
      },
      {
        label: "Corridor scenarios",
        state: "Conceptual / under study",
        kind: "conceptual",
        note: "No route is presented as operationally verified without current evidence.",
      },
      {
        label: "Forum participation",
        state: "Private, qualification-controlled",
        kind: "controlled",
        note: "Invitation-based; there is no public registration.",
      },
      {
        label: "Full digital operating portal",
        state: "Not publicly active",
        kind: "future",
        note: "The operating model is presented as a vision; portal features are not live.",
      },
    ],
  },
  summaries: {
    value: {
      title: "What the Gateway provides",
      text: "Organized access to qualified counterparts, documented opportunity files, defined responsibilities and followed results — on both sides of the corridor.",
      linkLabel: "Explore the Gateway model",
      morocco: {
        title: "For Morocco",
        text: "Industry and processing, standards and quality, finance and insurance, logistics and export, technology and skills, regional distribution.",
        linkLabel: "Value for Morocco",
      },
      sudan: {
        title: "With Sudan",
        text: "A value-chain partner: production capability, resources, market demand, local value addition and the Red Sea–East Africa bridge.",
        linkLabel: "Partnership with Sudan",
      },
    },
    journey: {
      title: "How a request progresses",
      text: "Every engagement becomes a governed case: reception, verification, qualification, controlled introductions, then documented decisions and follow-up.",
      linkLabel: "See the full operating model",
      stepsShown: 5,
    },
    chains: {
      title: "Priority value chains",
      text: "Feed and livestock · oilseeds and food processing · water, energy and agritech · mining and value addition.",
      linkLabel: "Explore the value chains",
    },
    corridor: {
      title: "Corridor intelligence",
      text: "A network of conceptual route scenarios — designed per opportunity, never one fixed line.",
      linkLabel: "Explore the corridor",
    },
    forum: {
      title: "Morocco–Sudan Economic Forum",
      text: "The first activation programme of the permanent Gateway: private, invitation-based and qualified, with follow-up after the programme days.",
      linkLabel: "About the Forum",
    },
    trust: {
      title: "Trust, data and AI",
      text: "Purpose, consent, least privilege and auditability. AI proposes; an authorized human reviews and decides.",
      linkLabel: "Read the trust principles",
    },
    about: {
      title: "Akanil for Development and Investment",
      text: "Moroccan enterprise established in 2014 — founder and executive operator of the Gateway, keeper of its operating model and institutional memory.",
      linkLabel: "About Akanil",
    },
  },
  receptionCta: {
    eyebrow: "Institutional reception",
    title: "Initiate a controlled request.",
    text: "The reception desk receives structured requests by email and telephone. Reception does not mean acceptance: every request is reviewed by an authorized person.",
    emailLabel: "Institutional email",
    phoneLabel: "Direct telephone",
    openLabel: "Start an institutional request",
    reviewNote: "Human-reviewed · no automatic qualification",
  },
  pages: {
    gateway: {
      title: "The Gateway model — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "What the Gateway is, how Akanil operates it, and how a request progresses from reception to documented follow-up.",
    },
    morocco: {
      title: "Value for Morocco — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "How the Gateway serves Moroccan institutions, manufacturers, exporters, banks and service providers across six capability pillars.",
    },
    sudan: {
      title: "Partnership with Sudan — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "Sudan as a value-chain partner: production capability, resources, market, local value addition and the Red Sea–East Africa bridge.",
    },
    corridor: {
      title: "Corridor intelligence — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "Conceptual corridor scenarios between Morocco, Sudan and the Red Sea, with explicit route states and verification discipline.",
    },
    "value-chains": {
      title: "Priority value chains — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "Detailed profiles of the four priority chains: feed and livestock, oilseeds and food, water-energy-agritech, mining and value addition.",
    },
    forum: {
      title: "Morocco–Sudan Economic Forum — first activation programme",
      description:
        "A private, invitation-based and qualified programme activating the permanent Gateway through meetings, visits and structured follow-up.",
    },
    trust: {
      title: "Trust, data and AI — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "How information is governed: purpose, consent, classification, least privilege, source attribution, human review and auditability.",
    },
    portfolio: {
      title: "Portfolio platforms — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "The platforms operating under the Gateway: Trade-Chain Africa, Valura, RWAFID and IBRIZ/GAAS, each with an explicit public status and evidence state.",
    },
    "about-akanil": {
      title: "About Akanil — founder and executive operator of the Gateway",
      description:
        "Akanil for Development and Investment: Moroccan enterprise established in 2014, business-development and economic-corridor operator.",
    },
    reception: {
      title: "Institutional reception — Akanil Morocco–Red Sea Economic Gateway",
      description:
        "Initiate a controlled institutional request by structured email or direct telephone. Every request is human-reviewed.",
    },
  },
  gatewayPage: {
    eyebrow: "The Gateway model",
    heading: "A permanent infrastructure — explained.",
    lead: "This page brings together the institutional architecture, the reason the Gateway exists and the governed journey every request follows.",
  },
  navGroups: [
    { href: "/gateway", label: "Gateway" },
    { href: "/morocco", label: "Morocco" },
    { href: "/sudan", label: "Sudan" },
    { href: "/value-chains", label: "Value chains" },
    { href: "/forum", label: "Forum" },
    { href: "/reception", label: "Reception" },
  ],
  footerNav: [
    { href: "/gateway", label: "The Gateway model" },
    { href: "/morocco", label: "Value for Morocco" },
    { href: "/sudan", label: "Partnership with Sudan" },
    { href: "/corridor", label: "Corridor intelligence" },
    { href: "/value-chains", label: "Priority value chains" },
    { href: "/forum", label: "Economic Forum" },
    { href: "/trust", label: "Trust, data and AI" },
    { href: "/about-akanil", label: "About Akanil" },
    { href: "/reception", label: "Institutional reception" },
  ],
  learnMore: "Learn more",
};
