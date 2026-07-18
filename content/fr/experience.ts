import type { ExperienceContent } from "../types";

/** Français — couche d'expérience : statut, parcours d'entrée, résumés, pages. */
export const frExperience: ExperienceContent = {
  status: {
    eyebrow: "Statut actuel",
    title: "Ce qui est actif aujourd'hui — et ce qui reste conceptuel.",
    items: [
      {
        label: "Modèle institutionnel",
        state: "Référentiel approuvé",
        kind: "approved",
        note: "Gouverné par les référentiels stratégiques et de connaissance approuvés d'Akanil.",
      },
      {
        label: "Fenêtre publique de présentation",
        state: "En ligne",
        kind: "live",
        note: "Ce site trilingue constitue la présentation publique de la Passerelle.",
      },
      {
        label: "Accueil institutionnel",
        state: "Actif",
        kind: "active",
        note: "Les demandes sont reçues par email et téléphone via le bureau d'accueil.",
      },
      {
        label: "Qualification",
        state: "Revue humaine",
        kind: "controlled",
        note: "Chaque demande est examinée par une personne autorisée ; rien n'est automatique.",
      },
      {
        label: "Scénarios de corridor",
        state: "Conceptuels / à l'étude",
        kind: "conceptual",
        note: "Aucun itinéraire n'est présenté comme vérifié sans preuves actuelles.",
      },
      {
        label: "Participation au Forum",
        state: "Privée, contrôlée par qualification",
        kind: "controlled",
        note: "Sur invitation ; il n'existe pas d'inscription publique.",
      },
      {
        label: "Portail opérationnel numérique complet",
        state: "Non actif publiquement",
        kind: "future",
        note: "Le modèle opérationnel est présenté comme une vision ; les fonctions du portail ne sont pas actives.",
      },
    ],
  },
  audiences: {
    eyebrow: "Parcours d'entrée",
    title: "Choisissez votre parcours d'entrée institutionnel.",
    lead: "Identifiez-vous et accédez directement au bureau d'accueil avec le bon type de demande — sans lire tout le site.",
    statesLegend: {
      approved: "Approuvé",
      live: "En ligne",
      active: "Actif",
      controlled: "Contrôlé",
      conceptual: "Conceptuel",
      future: "Futur",
    },
    paths: [
      {
        id: "moroccan-institution",
        name: "Institution marocaine",
        forWho: "Institutions publiques, organismes de développement économique, corps professionnels et institutionnels.",
        purposes: [
          "Demander un briefing institutionnel",
          "Explorer un cadre de coopération",
          "Comprendre la fonction institutionnelle marocaine de la Passerelle",
        ],
        requestTypes: ["briefing", "meeting"],
        defaultRequestType: "briefing",
        ctaLabel: "Demander un briefing institutionnel",
      },
      {
        id: "moroccan-company",
        name: "Entreprise marocaine",
        forWho: "Fabricants, exportateurs, groupes industriels, fournisseurs de technologie, sociétés de logistique et de services.",
        purposes: [
          "Présenter une capacité industrielle ou de service",
          "Discuter la qualification de l'entreprise",
          "Explorer une chaîne de valeur prioritaire",
          "Répondre à une demande soudanaise qualifiée",
        ],
        requestTypes: ["qualification", "capability", "value-chain"],
        defaultRequestType: "qualification",
        ctaLabel: "Discuter la qualification",
      },
      {
        id: "sudanese-organization",
        name: "Organisation ou décideur soudanais",
        forWho: "Entreprises, institutions économiques, décideurs qualifiés et acteurs des secteurs productifs.",
        purposes: [
          "Présenter un besoin documenté",
          "Présenter une capacité",
          "Discuter une opportunité qualifiée",
          "Demander une discussion institutionnelle contrôlée",
        ],
        requestTypes: ["need-opportunity", "capability", "meeting"],
        defaultRequestType: "need-opportunity",
        ctaLabel: "Présenter un besoin ou une capacité",
      },
      {
        id: "financial-partner",
        name: "Partenaire financier ou d'investissement",
        forWho: "Banques, assureurs, investisseurs, conseillers financiers et acteurs de la finance structurée.",
        purposes: [
          "Demander un briefing sur la Passerelle",
          "Examiner des modèles documentés de chaînes de valeur",
          "Discuter un besoin de financement qualifié",
        ],
        requestTypes: ["briefing", "value-chain", "meeting"],
        defaultRequestType: "briefing",
        ctaLabel: "Demander un briefing",
        note: "Aucune opportunité d'investissement n'est automatiquement active ou approuvée ; chaque dossier reste soumis à revue humaine.",
      },
      {
        id: "sector-partner",
        name: "Partenaire industriel, logistique, technologique ou de savoir",
        forWho: "Opérateurs industriels, prestataires logistiques, sociétés technologiques, institutions de formation et partenaires de recherche.",
        purposes: [
          "Présenter une capacité pertinente",
          "Explorer un rôle de coopération défini",
          "Discuter une chaîne de valeur prioritaire",
        ],
        requestTypes: ["capability", "value-chain", "meeting"],
        defaultRequestType: "capability",
        ctaLabel: "Présenter une capacité",
      },
    ],
  },
  summaries: {
    value: {
      title: "Ce que la Passerelle apporte",
      text: "Un accès organisé à des interlocuteurs qualifiés, des dossiers d'opportunités documentés, des responsabilités définies et des résultats suivis — des deux côtés du corridor.",
      linkLabel: "Explorer le modèle de la Passerelle",
      morocco: {
        title: "Pour le Maroc",
        text: "Industrie et transformation, normes et qualité, finance et assurance, logistique et exportation, technologie et compétences, distribution régionale.",
        linkLabel: "La valeur pour le Maroc",
      },
      sudan: {
        title: "Avec le Soudan",
        text: "Un partenaire de chaînes de valeur : capacité de production, ressources, demande de marché, valeur ajoutée locale et pont mer Rouge–Afrique de l'Est.",
        linkLabel: "Le partenariat avec le Soudan",
      },
    },
    journey: {
      title: "Comment progresse une demande",
      text: "Chaque échange devient un dossier gouverné : accueil, vérification, qualification, mises en relation contrôlées, puis décisions documentées et suivi.",
      linkLabel: "Voir le modèle opérationnel complet",
      stepsShown: 5,
    },
    chains: {
      title: "Chaînes de valeur prioritaires",
      text: "Aliments et élevage · oléagineux et agroalimentaire · eau, énergie et agritech · mines et valeur ajoutée.",
      linkLabel: "Explorer les chaînes de valeur",
    },
    corridor: {
      title: "Intelligence du corridor",
      text: "Un réseau de scénarios d'itinéraires conceptuels — conçus par opportunité, jamais une ligne fixe.",
      linkLabel: "Explorer le corridor",
    },
    forum: {
      title: "Forum Économique Maroc–Soudan",
      text: "Premier programme d'activation de la Passerelle permanente : privé, sur invitation et qualifié, avec un suivi après les journées du programme.",
      linkLabel: "À propos du Forum",
    },
    trust: {
      title: "Confiance, données et IA",
      text: "Finalité, consentement, moindre privilège et auditabilité. L'IA propose ; une personne autorisée examine et décide.",
      linkLabel: "Lire les principes de confiance",
    },
    about: {
      title: "Akanil Développement et Investissement",
      text: "Entreprise marocaine fondée en 2014 — fondateur et opérateur exécutif de la Passerelle, gardien de son modèle opérationnel et de sa mémoire institutionnelle.",
      linkLabel: "À propos d'Akanil",
    },
  },
  receptionCta: {
    eyebrow: "Accueil institutionnel",
    title: "Initier une demande contrôlée.",
    text: "Le bureau d'accueil reçoit des demandes structurées par email et par téléphone. La réception ne vaut pas acceptation : chaque demande est examinée par une personne autorisée.",
    emailLabel: "Email institutionnel",
    phoneLabel: "Téléphone direct",
    openLabel: "Démarrer une demande institutionnelle",
    reviewNote: "Revue humaine · aucune qualification automatique",
  },
  pages: {
    gateway: {
      title: "Le modèle de la Passerelle — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Ce qu'est la Passerelle, comment Akanil l'opère, et comment une demande progresse de l'accueil au suivi documenté.",
    },
    morocco: {
      title: "La valeur pour le Maroc — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Comment la Passerelle sert les institutions, industriels, exportateurs, banques et prestataires marocains à travers six piliers de capacité.",
    },
    sudan: {
      title: "Le partenariat avec le Soudan — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Le Soudan, partenaire de chaînes de valeur : capacité de production, ressources, marché, valeur ajoutée locale et pont mer Rouge–Afrique de l'Est.",
    },
    corridor: {
      title: "Intelligence du corridor — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Scénarios conceptuels de corridor entre le Maroc, le Soudan et la mer Rouge, avec des états d'itinéraires explicites.",
    },
    "value-chains": {
      title: "Chaînes de valeur prioritaires — Passerelle économique Akanil",
      description:
        "Profils détaillés des quatre chaînes prioritaires : aliments et élevage, oléagineux et agroalimentaire, eau-énergie-agritech, mines et valeur ajoutée.",
    },
    forum: {
      title: "Forum Économique Maroc–Soudan — premier programme d'activation",
      description:
        "Un programme privé, sur invitation et qualifié, qui active la Passerelle permanente par des réunions, des visites et un suivi structuré.",
    },
    trust: {
      title: "Confiance, données et IA — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Comment l'information est gouvernée : finalité, consentement, classification, moindre privilège, attribution de source, revue humaine et auditabilité.",
    },
    "about-akanil": {
      title: "À propos d'Akanil — fondateur et opérateur exécutif de la Passerelle",
      description:
        "Akanil Développement et Investissement : entreprise marocaine fondée en 2014, opérateur de développement des affaires et de corridors économiques.",
    },
    reception: {
      title: "Accueil institutionnel — Passerelle économique Akanil Maroc–mer Rouge",
      description:
        "Initiez une demande institutionnelle contrôlée par email structuré ou téléphone direct. Chaque demande est soumise à revue humaine.",
    },
  },
  gatewayPage: {
    eyebrow: "Le modèle de la Passerelle",
    heading: "Une infrastructure permanente — expliquée.",
    lead: "Cette page réunit l'architecture institutionnelle, la raison d'être de la Passerelle et le parcours gouverné que suit chaque demande.",
  },
  navGroups: [
    { href: "/gateway", label: "Passerelle" },
    { href: "/morocco", label: "Maroc" },
    { href: "/sudan", label: "Soudan" },
    { href: "/value-chains", label: "Chaînes de valeur" },
    { href: "/forum", label: "Forum" },
    { href: "/reception", label: "Accueil" },
  ],
  footerNav: [
    { href: "/gateway", label: "Le modèle de la Passerelle" },
    { href: "/morocco", label: "La valeur pour le Maroc" },
    { href: "/sudan", label: "Le partenariat avec le Soudan" },
    { href: "/corridor", label: "Intelligence du corridor" },
    { href: "/value-chains", label: "Chaînes de valeur prioritaires" },
    { href: "/forum", label: "Forum Économique" },
    { href: "/trust", label: "Confiance, données et IA" },
    { href: "/about-akanil", label: "À propos d'Akanil" },
    { href: "/reception", label: "Accueil institutionnel" },
  ],
  learnMore: "En savoir plus",
};
