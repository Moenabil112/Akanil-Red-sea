import type { SiteContent } from "../types";

/**
 * Version française — édition indépendante, registre institutionnel
 * adapté aux institutions et entreprises marocaines (P2-16).
 */
export const fr: SiteContent = {
  meta: {
    title: "Passerelle économique Akanil Maroc–mer Rouge",
    description:
      "Une infrastructure marocaine permanente de développement des affaires, de qualification et de suivi, reliant les capacités industrielles, financières et technologiques marocaines aux opportunités qualifiées au Soudan et dans l'espace économique de la mer Rouge. Fondée et opérée par Akanil Développement et Investissement.",
    ogAlt:
      "Illustration conceptuelle de la Passerelle économique Akanil Maroc–mer Rouge.",
  },
  ui: {
    skipLink: "Aller au contenu",
    languageLabel: "Langue",
    languageNames: { ar: "العربية", fr: "Français", en: "English" },
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    close: "Fermer",
    sectionLabel: "Section",
    conceptArtLabel: "Illustration conceptuelle — non documentaire",
    navLabel: "Navigation principale",
    nav: [
      { anchor: "why", label: "La Passerelle" },
      { anchor: "morocco", label: "Maroc" },
      { anchor: "corridor", label: "Corridor" },
      { anchor: "chains", label: "Chaînes de valeur" },
      { anchor: "forum", label: "Forum" },
      { anchor: "trust", label: "Confiance" },
      { anchor: "about", label: "Akanil" },
      { anchor: "contact", label: "Contact" },
    ],
    footer: {
      entity: "Passerelle économique Akanil Maroc–mer Rouge",
      tagline: "Fenêtre de présentation institutionnelle",
      note: "Aucune institution, aucun partenaire, sponsor, investissement, itinéraire ou opportunité externe n'est présenté sur cette page comme confirmé. Les visuels du corridor sont conceptuels. Cette fenêtre s'appuie sur les référentiels stratégiques et de connaissance approuvés d'Akanil.",
      hierarchy: [
        "Akanil Développement et Investissement — fondateur et opérateur exécutif",
        "Passerelle économique Akanil Maroc–mer Rouge — infrastructure économique permanente",
        "Forum Économique Maroc–Soudan — premier programme d'activation",
      ],
    },
  },
  hero: {
    eyebrow: "Fenêtre de présentation institutionnelle",
    titleLines: [
      { text: "Passerelle économique Akanil", emphasis: false },
      { text: "Maroc–mer Rouge", emphasis: true },
    ],
    lead: "Une infrastructure marocaine permanente de développement des affaires, de qualification et de suivi — reliant les capacités industrielles, financières et technologiques marocaines aux opportunités qualifiées au Soudan et dans l'espace économique de la mer Rouge.",
    primary: {
      label: "Demander un briefing institutionnel",
      explanation:
        "Ouvre une note de contact décrivant le parcours contrôlé du briefing. Aucun engagement n'est créé.",
    },
    secondary: {
      label: "Explorer le modèle de la Passerelle",
      explanation: "Conduit à l'architecture institutionnelle ci-dessous.",
    },
    pillars: [
      {
        title: "Fondateur et opérateur exécutif",
        text: "Akanil Développement et Investissement détient le modèle opérationnel et la mémoire institutionnelle.",
      },
      {
        title: "Infrastructure permanente",
        text: "Conçue pour qualifier, connecter et suivre les opportunités bien au-delà d'un événement unique.",
      },
      {
        title: "Décisions sous autorité humaine",
        text: "Les données et l'IA appuient les personnes autorisées ; elles ne remplacent pas leur autorité.",
      },
    ],
    scopeLabel: "Périmètre économique",
    scopeNodes: ["Maroc", "Soudan", "Mer Rouge"],
    motto:
      "De l'accès à la confiance, et des ressources aux chaînes de valeur partagées.",
  },
  why: {
    eyebrow: "Pourquoi la Passerelle",
    title: "L'opportunité transfrontalière se perd dans des relations non structurées.",
    lead: "Entre le Maroc, le Soudan et les marchés de la mer Rouge, des entreprises capables et une demande réelle existent déjà. Ce qui manque, c'est un parcours gouverné qui les relie.",
    problemsTitle: "Le problème opérationnel",
    problems: [
      {
        title: "Accès fragmenté",
        text: "Les mises en relation dépendent de liens individuels plutôt que d'un canal institutionnel.",
      },
      {
        title: "Qualification insuffisante",
        text: "Entreprises et opportunités arrivent sans identité, capacité ni maturité vérifiées.",
      },
      {
        title: "Suivi perdu",
        text: "Décisions et engagements disparaissent dans les réunions et les fils de messages.",
      },
      {
        title: "Relations non structurées",
        text: "Aucun registre partagé n'établit qui détient une relation, son contexte et ses autorisations.",
      },
      {
        title: "Statut incertain",
        text: "Personne ne peut dire si une opportunité est une idée, à l'étude, ou prête à progresser.",
      },
    ],
    answerTitle: "Ce qu'Akanil opère à la place",
    answerLead:
      "La Passerelle est une mémoire opérationnelle : chaque organisation, demande et opportunité devient un dossier gouverné, avec une source, un responsable, un statut et une prochaine étape.",
    answers: [
      {
        title: "Mémoire opérationnelle",
        text: "Demandes, correspondances, réunions et engagements sont enregistrés et retrouvables — rien ne dépend d'une seule boîte de réception.",
      },
      {
        title: "Progression structurée",
        text: "Les opportunités franchissent des étapes explicites : enregistrement, vérification, qualification, mise en relation, réunion, suivi.",
      },
      {
        title: "Relations gouvernées",
        text: "Les introductions sont délibérées, avec consentement, finalité et un responsable documenté de chaque côté.",
      },
    ],
  },
  architecture: {
    eyebrow: "Une architecture, trois couches",
    title: "Une continuité institutionnelle avant et après tout événement.",
    lead: "Le fondateur, l'infrastructure permanente et le premier programme d'activation restent distincts, afin que la propriété, l'autorité et la mémoire institutionnelle demeurent claires.",
    layers: [
      {
        badge: "Fondateur et opérateur",
        name: "Akanil Développement et Investissement",
        role: "Entreprise marocaine fondée en 2014",
        text: "Fondateur et opérateur exécutif : propriétaire du modèle opérationnel, de la méthode de qualification, des règles de gouvernance des données et de la coordination des relations.",
        keywords: "Propriété · gouvernance · continuité",
      },
      {
        badge: "Infrastructure permanente",
        name: "Passerelle économique Akanil Maroc–mer Rouge",
        role: "Infrastructure économique active toute l'année",
        text: "Une structure permanente d'accueil, de qualification, de mise en relation et de suivi des organisations, demandes, opportunités et chaînes de valeur partagées.",
        keywords: "Accueil · qualification · suivi",
      },
      {
        badge: "Premier programme d'activation",
        name: "Forum Économique Maroc–Soudan",
        role: "Activation de la Passerelle permanente",
        text: "Un programme privé, sur invitation, réunissant décideurs, entreprises et institutions qualifiés dans des réunions, visites et engagements structurés.",
        keywords: "Activation · réunions · engagements",
      },
    ],
    chamberNote:
      "Le parcours futur vers une chambre d'affaires maroco-soudanaise constitue une voie juridique et institutionnelle distincte et ultérieure. Elle n'est pas présentée ici comme une entité existante.",
  },
  morocco: {
    eyebrow: "La proposition de valeur pour le Maroc",
    title: "Le Maroc est la plateforme industrielle et financière de la Passerelle.",
    lead: "Pour les institutions marocaines, les industriels, les exportateurs, les banques et les prestataires de services, la Passerelle est un instrument concret de coopération économique Sud–Sud : un accès organisé à des interlocuteurs qualifiés, des dossiers d'opportunités documentés et des résultats suivis.",
    statement:
      "Akanil offre aux acteurs marocains un mécanisme exécutable qui transforme des relations dispersées en un parcours organisé : décideurs qualifiés, opportunités documentées, responsabilités définies et résultats suivis.",
    pillars: [
      {
        title: "Industrie et transformation",
        text: "Les unités marocaines transforment des ressources qualifiées en produits à plus forte valeur : sous-traitance industrielle, raffinage, conditionnement et coproduction.",
      },
      {
        title: "Normes et qualité",
        text: "Essais, certification, traçabilité et accréditation ancrent chaque parcours qualifié dans une qualité vérifiable.",
      },
      {
        title: "Finance et assurance",
        text: "Banques, assureurs et conseils marocains structurent paiement, couverture et financement autour d'interlocuteurs documentés.",
      },
      {
        title: "Logistique et capacité d'exportation",
        text: "Des plateformes d'exportation vers l'Europe, l'Afrique de l'Ouest et les marchés atlantiques, avec des scénarios de corridor conçus par opportunité.",
      },
      {
        title: "Technologie et compétences",
        text: "Solutions d'eau, d'énergie, d'agritech et de numérique, ainsi que formation et développement de capacités exportés comme expertise.",
      },
      {
        title: "Distribution régionale",
        text: "Un accès structuré aux marchés africains et du Golfe par une distribution qualifiée et des chaînes de valeur multi-marchés.",
      },
    ],
    audienceTitle: "Conçue pour",
    audiences: [
      "Institutions publiques et économiques",
      "Groupes industriels et fabricants",
      "Exportateurs et investisseurs",
      "Banques et assureurs",
      "Opérateurs logistiques",
      "Fournisseurs de technologie et de formation",
    ],
  },
  sudan: {
    eyebrow: "La valeur partagée avec le Soudan",
    title: "Le Soudan est un partenaire de chaînes de valeur — pas une source de matières premières.",
    lead: "La Passerelle repose sur une logique de partenariat : capacités de production, ressources et profondeur de marché soudanaises, associées à la transformation, à la finance et à la technologie marocaines, avec une valeur mesurable retenue et ajoutée des deux côtés.",
    roles: [
      {
        title: "Capacité de production",
        text: "Des capacités agricoles, d'élevage et minières ouvertes au développement conjoint.",
      },
      {
        title: "Ressources",
        text: "Des ressources qualifiées entrant dans des chaînes de valeur documentées — jamais des flux anonymes.",
      },
      {
        title: "Un marché à part entière",
        text: "Une demande réelle de solutions marocaines : équipements, intrants, technologie, formation et services.",
      },
      {
        title: "Valeur ajoutée locale",
        text: "Transformation primaire, tri et agrégation au Soudan, pour retenir la valeur à l'origine.",
      },
      {
        title: "Pont mer Rouge et Afrique de l'Est",
        text: "Une connexion vers les routes commerciales de la mer Rouge et les marchés est-africains.",
      },
      {
        title: "Développement des capacités",
        text: "Formation, transfert de technologie et coentreprises qui bâtissent une capacité soudanaise durable.",
      },
    ],
    equationTitle: "La logique de valeur partagée",
    equationParts: [
      "Ressource ou capacité soudanaise",
      "Transformation et expertise marocaines",
      "Finance et logistique",
      "Distribution régionale",
    ],
    equationResult: "Valeur partagée mesurable",
    partnershipNote:
      "Chaque parcours est évalué selon la valeur qu'il retient au Soudan et qu'il ajoute au Maroc. Les modèles extractifs à sens unique sont exclus par conception.",
  },
  corridor: {
    eyebrow: "Intelligence du corridor",
    title: "Un réseau de scénarios — et non une route fixe unique.",
    lead: "Le corridor est une méthode pour choisir, opportunité par opportunité, le meilleur agencement de production, transformation, finance, transit et distribution. Chaque itinéraire est conçu par cas et réévalué lorsque les conditions changent.",
    disclaimer:
      "Schéma conceptuel. Aucun itinéraire présenté ici n'est vérifié opérationnellement à ce jour ; chaque scénario exige une vérification commerciale, logistique et de conformité actuelle avant usage. Il ne s'agit pas d'un suivi en temps réel.",
    mapAria:
      "Schéma conceptuel du réseau économique Maroc–mer Rouge avec des nœuds sélectionnables.",
    legendTitle: "États des itinéraires",
    states: {
      conceptual: {
        label: "Conceptuel",
        description: "Une possibilité stratégique seulement.",
      },
      "under-study": {
        label: "À l'étude",
        description: "Collecte de données ou analyse d'itinéraire en cours.",
      },
      "pilot-qualified": {
        label: "Qualifié pour pilote",
        description: "Prêt pour un test limité et contrôlé.",
      },
      verified: {
        label: "Vérifié opérationnellement",
        description: "Des preuves actuelles soutiennent l'exploitation.",
      },
      constrained: {
        label: "Contraint",
        description: "Une contrainte matérielle connue s'applique.",
      },
      alternative: {
        label: "Alternatif",
        description: "Un scénario de repli pour la résilience.",
      },
    },
    nodes: [
      {
        id: "morocco",
        name: "Maroc",
        role: "Nœud de valeur",
        description:
          "Transformation industrielle, normes, finance, technologie et plateforme d'exportation vers l'Europe, l'Afrique et les marchés atlantiques.",
      },
      {
        id: "egypt",
        name: "Égypte",
        role: "Nœud de transit potentiel",
        description:
          "Un nœud potentiel de transit, stockage, agrégation ou transformation partielle — utilisé uniquement là où il ajoute une valeur réelle.",
      },
      {
        id: "saudi",
        name: "Arabie saoudite",
        role: "Nœud d'investissement et de marché",
        description:
          "Un nœud potentiel d'investissement, de profondeur de marché du Golfe et de connectivité mer Rouge dans des modèles tripartites.",
      },
      {
        id: "red-sea",
        name: "Mer Rouge",
        role: "Corridor de commerce et d'investissement",
        description:
          "L'espace maritime reliant l'Afrique et le Golfe ; ports, transporteurs, assurance et coûts sont étudiés par scénario.",
      },
      {
        id: "sudan",
        name: "Soudan",
        role: "Partenaire de chaînes de valeur",
        description:
          "Production, ressources, marché et pont vers l'Afrique de l'Est — un partenaire de valeur partagée, pas une source de matières premières.",
      },
    ],
    routes: [
      {
        id: "CR-01",
        from: "sudan",
        to: "morocco",
        state: "conceptual",
        label: "Soudan ↔ Maroc direct",
        summary:
          "Échange direct : offre soudanaise qualifiée vers la transformation marocaine, et produits et solutions marocains vers le marché soudanais.",
      },
      {
        id: "CR-02",
        from: "sudan",
        to: "morocco",
        via: "egypt",
        state: "alternative",
        label: "Via l'Égypte",
        summary:
          "Un scénario de repli utilisant le transit, le stockage ou la transformation partielle en Égypte lorsqu'ils ajoutent une valeur mesurable.",
      },
      {
        id: "CR-03",
        from: "sudan",
        to: "morocco",
        via: "saudi",
        state: "conceptual",
        label: "Modèle tripartite avec l'Arabie saoudite",
        summary:
          "Un scénario triangulaire associant une opportunité soudanaise, une expertise marocaine et un investissement ou une profondeur de marché du Golfe.",
      },
      {
        id: "CR-05",
        from: "morocco",
        to: "sudan",
        state: "conceptual",
        label: "Solutions marocaines → Soudan",
        summary:
          "Équipements, intrants, technologie, formation et services marocains vers une demande soudanaise qualifiée.",
      },
    ],
    summaryTitle: "Nœud sélectionné",
    selectPrompt:
      "Sélectionnez un nœud pour lire son rôle et les scénarios d'itinéraires associés.",
    nodeListTitle: "Nœuds du réseau",
    principle:
      "La valeur avant la distance : aucune expédition sans modèle d'affaires, et chaque itinéraire reste révisable lorsque la sécurité, les coûts, les ports ou les marchés évoluent.",
  },
  chains: {
    eyebrow: "Chaînes de valeur prioritaires",
    title: "Des ressources à une valeur partagée mesurable.",
    lead: "Quatre chaînes où la production soudanaise et les capacités industrielles, financières et technologiques marocaines peuvent être combinées de façon responsable et exécutable.",
    tabListLabel: "Chaînes de valeur prioritaires",
    stageFlowLabel: "Étapes de la chaîne",
    chains: [
      {
        name: "Aliments du bétail et élevage",
        summary:
          "Relier intrants, production animale, transformation, qualité et accès au marché dans un modèle qui répartit valeur et risque entre partenaires.",
        stages: [
          {
            title: "Ressource et capacité",
            text: "Producteurs et fournisseurs qualifiés à l'identité vérifiée.",
          },
          {
            title: "Qualification",
            text: "Spécifications, volumes, continuité et contrôles de conformité.",
          },
          {
            title: "Transformation et expertise",
            text: "Fabrication d'aliments, normes vétérinaires et conditionnement au Maroc.",
          },
          {
            title: "Finance et logistique",
            text: "Structures de paiement, assurance et corridor conçu par cas.",
          },
          {
            title: "Marché",
            text: "Une demande documentée au Maroc, en Afrique et dans le Golfe.",
          },
          {
            title: "Valeur partagée",
            text: "Des résultats traçables, avec de la valeur des deux côtés.",
          },
        ],
        outcome:
          "Un parcours enregistré, de l'offre qualifiée aux résultats suivis.",
      },
      {
        name: "Oléagineux et transformation alimentaire",
        summary:
          "Des parcours pour graines, huiles et tourteaux à travers essais de qualité, raffinage, conditionnement et transformation partagée, avec des marchés clairs.",
        stages: [
          {
            title: "Ressource et capacité",
            text: "Sésame, arachide et oléagineux à l'origine documentée.",
          },
          {
            title: "Qualification",
            text: "Classement, essais en laboratoire et sécurité alimentaire.",
          },
          {
            title: "Transformation et expertise",
            text: "Trituration, raffinage et industrie alimentaire au Maroc.",
          },
          {
            title: "Finance et logistique",
            text: "Financement du commerce, assurance et scénarios de transport étudiés.",
          },
          {
            title: "Marché",
            text: "Industries alimentaires et marchés de consommation régionaux.",
          },
          {
            title: "Valeur partagée",
            text: "Des produits à plus forte valeur, avec une valeur retenue à l'origine.",
          },
        ],
        outcome:
          "Un enjeu de sécurité alimentaire, avec une valeur ajoutée mesurable dans les deux pays.",
      },
      {
        name: "Eau, énergie et agritech",
        summary:
          "Des solutions marocaines d'irrigation, d'énergie renouvelable et d'agritech répondant à des besoins soudanais diagnostiqués, exploitation et formation comprises.",
        stages: [
          {
            title: "Diagnostic du besoin",
            text: "Des besoins soudanais documentés en eau, énergie et agriculture.",
          },
          {
            title: "Qualification",
            text: "Vérification du site, de la faisabilité et de l'interlocuteur.",
          },
          {
            title: "Solutions et expertise",
            text: "Équipements, ingénierie marocaine et agriculture numérique.",
          },
          {
            title: "Finance et logistique",
            text: "Financement de projet et livraison structurés par cas.",
          },
          {
            title: "Exploitation et formation",
            text: "Installation, exploitation locale et transfert de compétences.",
          },
          {
            title: "Valeur partagée",
            text: "Productivité, résilience et capacité locale durable.",
          },
        ],
        outcome:
          "Des solutions livrées avec la formation — la capacité reste là où elle est bâtie.",
      },
      {
        name: "Mines et valeur ajoutée",
        summary:
          "D'une ressource ou opportunité minière vers l'analyse, les normes, la transformation, les équipements et un parcours de marché responsable et traçable.",
        stages: [
          {
            title: "Qualification de la source",
            text: "Propriété, identité et documentation vérifiées d'abord.",
          },
          {
            title: "Analyse et normes",
            text: "Essais, classification et conformité réglementaire.",
          },
          {
            title: "Transformation et équipements",
            text: "Étapes de valeur ajoutée et équipements ou expertise marocains.",
          },
          {
            title: "Finance et logistique",
            text: "Financement structuré avec évaluation documentée des risques.",
          },
          {
            title: "Marché",
            text: "Des acheteurs industriels qualifiés sous règles de traçabilité.",
          },
          {
            title: "Valeur partagée",
            text: "Des parcours responsables qui élèvent la valeur à l'origine.",
          },
        ],
        outcome:
          "Aucun flux anonyme : identité, conformité et traçabilité à chaque étape.",
      },
    ],
    outcomeLabel: "Résultat",
  },
  forum: {
    eyebrow: "Premier programme d'activation",
    title: "Forum Économique Maroc–Soudan",
    lead: "Un programme privé, sur invitation et qualifié, reliant les décideurs soudanais aux entreprises et institutions marocaines par des réunions B2B et B2G, des visites industrielles et un suivi structuré qui se poursuit après les journées du programme.",
    facts: [
      {
        title: "Position",
        text: "Une activation de la Passerelle permanente — ni un projet séparé, ni une conférence publique.",
      },
      {
        title: "Méthode",
        text: "Participation privée, qualifiée et sur invitation.",
      },
      {
        title: "Modes de travail",
        text: "Réunions B2B et B2G, ateliers et visites industrielles.",
      },
      {
        title: "Mesure du succès",
        text: "Décisions, engagements et progression suivie après l'événement.",
      },
    ],
    posterAlt:
      "Illustration conceptuelle d'identité du Forum Économique Maroc–Soudan.",
    posterLabel:
      "Illustration conceptuelle d'identité — non une preuve documentaire d'un événement.",
    cta: {
      label: "Voir le modèle de suivi",
      explanation: "Conduit à la couche opérationnelle numérique ci-dessous.",
    },
  },
  operating: {
    eyebrow: "La couche opérationnelle numérique",
    title: "Les relations ne disparaissent pas dans les conversations.",
    lead: "Le modèle opérationnel de la Passerelle transforme chaque échange en dossier gouverné, qui préserve la source, le contexte, les autorisations, les décisions et la prochaine étape.",
    statusNote:
      "Présenté comme le modèle opérationnel de la Passerelle. Les fonctionnalités de portail décrites ici constituent une vision d'exploitation — elles ne sont pas actives sur cette fenêtre de présentation.",
    steps: [
      {
        title: "Accueil",
        text: "Chaque organisation, demande et document entre par un canal enregistré.",
      },
      {
        title: "Vérification",
        text: "Identité professionnelle, autorité et source sont contrôlées avant toute suite.",
      },
      {
        title: "Qualification",
        text: "Besoin, capacité, maturité et risque sont classés selon des critères explicites.",
      },
      {
        title: "Mises en relation contrôlées",
        text: "Les interlocuteurs ne se rencontrent qu'après revue humaine et consentement mutuel.",
      },
      {
        title: "Réunions",
        text: "Chaque session a une finalité, des participants et un compte rendu.",
      },
      {
        title: "Décisions",
        text: "Les conclusions sont documentées avec un responsable et une date.",
      },
      {
        title: "Engagements",
        text: "Chaque engagement porte un responsable, une échéance et une preuve.",
      },
      {
        title: "Suivi",
        text: "La progression est suivie jusqu'aux résultats, à l'expansion ou à la clôture documentée.",
      },
      {
        title: "Piste d'audit",
        text: "Chaque étape reste attribuable, révisable et soumise à responsabilité.",
      },
    ],
  },
  trust: {
    eyebrow: "Confiance, données et IA",
    title: "Les données et l'IA appuient la décision. Elles ne remplacent pas l'autorité.",
    lead: "L'information au sein de la Passerelle est gouvernée par la finalité, le consentement et la responsabilité humaine, et l'intelligence artificielle opère dans des limites explicites.",
    quote: "L'IA propose ; une personne autorisée examine et décide.",
    principles: [
      {
        title: "Finalité définie",
        text: "Les données ne sont collectées et utilisées que pour une finalité déclarée.",
      },
      {
        title: "Consentement",
        text: "Le partage suit un consentement documenté du propriétaire des données.",
      },
      {
        title: "Classification",
        text: "Les dossiers portent des niveaux de confidentialité qui encadrent leur traitement.",
      },
      {
        title: "Moindre privilège",
        text: "L'accès est limité par rôle, finalité et durée.",
      },
      {
        title: "Attribution de la source",
        text: "L'origine des opportunités, relations et preuves reste traçable.",
      },
      {
        title: "Revue humaine",
        text: "La production de l'IA reste une proposition jusqu'à revue par une personne autorisée.",
      },
      {
        title: "Accès contrôlé",
        text: "Dossiers sensibles et data rooms ne s'ouvrent que sur autorisation documentée.",
      },
      {
        title: "Auditabilité",
        text: "Actions et décisions sont journalisées et révisables.",
      },
    ],
  },
  about: {
    eyebrow: "Fondateur et opérateur exécutif",
    title: "Akanil Développement et Investissement",
    paragraphs: [
      "Akanil Développement et Investissement est une entreprise marocaine fondée en 2014, spécialisée dans le développement des affaires, la structuration de corridors économiques et la mise en relation des capacités industrielles, financières et technologiques marocaines avec les opportunités et marchés africains et du Golfe, à travers la connaissance du terrain, les relations institutionnelles et la gouvernance numérique des données et des opérations.",
      "Au sein de la Passerelle, Akanil est le fondateur et l'opérateur exécutif : concepteur du modèle d'affaires et du corridor économique, gestionnaire des relations B2B et B2G, qualificateur des entreprises et des opportunités, et gardien de la mémoire opérationnelle selon des droits et consentements documentés.",
    ],
    rolesTitle: "Akanil opère comme",
    roles: [
      "Opérateur institutionnel marocain",
      "Plateforme de développement des affaires",
      "Concepteur de corridors économiques",
      "Opérateur d'intelligence de terrain et de relations",
      "Fondateur et opérateur exécutif de la Passerelle",
    ],
    founderQuote:
      "La Passerelle est conçue pour transformer les relations et la connaissance en parcours économiques qualifiés, gouvernés et suivis.",
    founderName: "Mohamed Nabil",
    founderRole: "Fondateur et CEO — Akanil",
  },
  contact: {
    eyebrow: "Contact institutionnel",
    title: "Un point d'entrée structuré pour la coopération économique.",
    lead: "Cette fenêtre présente le modèle institutionnel. La participation formelle, les partenariats, la qualification des opportunités et l'accès aux données restent soumis à une revue contrôlée et à une autorisation documentée.",
    actionsTitle: "Demandes appropriées",
    actions: [
      {
        title: "Demander un briefing institutionnel",
        text: "Pour les institutions et organisations marocaines souhaitant une présentation structurée de la Passerelle.",
      },
      {
        title: "Discuter la qualification d'une entreprise",
        text: "Pour les entreprises qui veulent comprendre le parcours de qualification avant toute mise en relation.",
      },
      {
        title: "Explorer une chaîne de valeur prioritaire",
        text: "Pour les interlocuteurs ayant un intérêt concret pour l'une des quatre chaînes.",
      },
      {
        title: "Demander une réunion contrôlée",
        text: "Pour les décideurs qualifiés recherchant une session ciblée et documentée.",
      },
    ],
    open: {
      label: "Ouvrir la note de contact institutionnel",
      explanation:
        "Ouvre une note locale décrivant l'établissement du canal de contact. Rien n'est transmis depuis cette page.",
    },
    modal: {
      title: "Note de contact institutionnel",
      body: "Le canal public de contact sera connecté après la revue finale du contenu, des aspects juridiques et de la publication. Les demandes suivront alors le parcours d'accueil et de vérification de la Passerelle : chaque requête reçoit une référence, un responsable et une prochaine étape définie.",
      privacyNote:
        "Cette fenêtre de présentation ne transmet ni ne stocke aucune donnée personnelle.",
      referenceLabel: "Référence",
      reference: "AKANIL-GATEWAY / INSTITUTIONAL-WINDOW / V1.0",
      close: "Fermer la note",
    },
  },
};
