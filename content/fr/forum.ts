import type { ForumContent } from "../forum-types";

/**
 * Contenu français du Forum — édité indépendamment (P3, ADR-019).
 * Le Forum économique Maroc–Soudan est un programme proposé de
 * qualification et d'engagement ; la participation est soumise à examen
 * et invitation. Aucune date, aucun lieu, intervenant, participant,
 * sponsor, ministère ou visite n'est présenté comme confirmé.
 */
export const frForum: ForumContent = {
  programmeName: "Forum économique Maroc–Soudan",
  publicStatus:
    "Programme proposé de qualification et d'engagement — participation soumise à examen et invitation.",
  positioningLead:
    "Un programme de qualification, de réunions et de décisions reliant institutions, entreprises et spécialistes régionaux qualifiés marocains et soudanais aux projets et chaînes de valeur pertinents. Il est privé, sur invitation et orienté projets et chaînes de valeur — ni conférence publique ouverte, ni place de marché, ni garantie de réunions, de contrats, de financement ou de partenariat.",
  gatewayRelationTitle: "La première activation de la Passerelle permanente",
  gatewayRelation:
    "Le Forum est le premier programme d'activation de la Passerelle économique permanente Akanil Maroc–Mer Rouge — non une institution distincte. Akanil en est le fondateur et l'opérateur exécutif : coordinateur de la qualification et du programme, coordinateur des parties prenantes et de la logique des réunions, opérateur d'alignement des projets et des chaînes de valeur, et propriétaire du cadre de suivi. Akanil n'est ni un ministère ni une autorité publique, et rien ici n'implique un aval gouvernemental.",
  qualificationFirstTitle: "Pourquoi la qualification précède la participation",
  qualificationFirst:
    "Les réunions ne sont utiles que si les deux parties sont préparées. La qualification établit l'identité, le mandat, l'objet et le projet, la plateforme ou la chaîne de valeur liés avant qu'une réunion ne soit proposée — pour que le temps du Forum serve des échanges préparés et pertinents plutôt qu'un réseautage ouvert.",

  navLabel: "Navigation du programme du Forum",
  nav: [
    { href: "/forum", label: "Accueil du Forum" },
    { href: "/forum/programme", label: "Programme" },
    { href: "/forum/participation", label: "Parcours de participation" },
    { href: "/forum/prepare", label: "Se préparer" },
  ],

  hub: {
    eyebrow: "Premier programme d'activation",
    title: "Forum économique Maroc–Soudan",
    lead: "Un programme privé, sur invitation et guidé par la qualification, articulé autour de la préparation, des réunions, des décisions et du suivi.",
    beforeDuringAfterTitle: "Avant, pendant et après le programme",
    phases: [
      {
        title: "Avant le Forum",
        items: [
          "Orientation des parties prenantes et qualification des participants",
          "Profilage institutionnel et des entreprises",
          "Alignement des besoins, capacités, projets et chaînes de valeur",
          "Préparation des réunions et revue des lacunes de preuve",
        ],
      },
      {
        title: "Pendant le Forum",
        items: [
          "Cadre institutionnel et ateliers sectoriels",
          "Réunions B2B et B2G préparées",
          "Catégories de visites industrielles et institutionnelles",
          "Discussions techniques, de financement et de chaînes de valeur",
        ],
      },
      {
        title: "Après le Forum",
        items: [
          "Catégories de résultats attendus consignées par un spécialiste",
          "Lacunes d'information identifiées",
          "Étape suivante recommandée par dossier",
          "Suivi structuré par des canaux approuvés",
        ],
      },
    ],
    participationOverviewTitle: "Quel parcours de participation vous concerne",
    participationOverviewLead:
      "Six parcours orientent institutions, entreprises, producteurs, financeurs et partenaires spécialisés vers la bonne préparation et le bon type de réunion.",
    tracksOverviewTitle: "Quelle filière sectorielle est pertinente",
    tracksOverviewLead:
      "Cinq filières sectorielles organisent les discussions et les réunions à travers les plateformes et les chaînes de valeur de la Passerelle. Les filières organisent l'engagement ; elles ne remplacent pas les six parcours de chaîne de valeur.",
    programmeSummaryTitle: "Un programme proposé sur cinq jours",
    programmeSummaryLead:
      "Une structure proposée, sous réserve de confirmation finale : cadre institutionnel, ateliers sectoriels, réunions préparées, catégories de visites, puis décisions et plan de suivi.",
    meetingLogicTitle: "Comment une réunion est préparée",
    meetingLogicLead:
      "Une réunion du Forum n'est proposée que si elle a un objet défini, des participants qualifiés, un projet ou une chaîne de valeur liés, une préparation minimale, les questions ou décisions recherchées et un résultat attendu réaliste — le tout sous revue humaine.",
    outcomeTitle: "Quel résultat peut suivre",
    outcomeLead:
      "Une revue par un spécialiste peut aboutir à l'une de plusieurs catégories d'étape suivante. Ce ne sont pas des décisions produites automatiquement par le site, et la participation ne garantit pas un résultat positif.",
    qualificationNoticeTitle: "Avant de demander une qualification",
    qualificationNotice: [
      "Soumettre une demande ne confirme pas la participation.",
      "La qualification ne garantit pas une invitation.",
      "Une invitation ne garantit pas une réunion avec une entité précise.",
      "Une réunion ne confirme ni partenariat, ni financement, ni contrat.",
      "Les détails du programme restent soumis à approbation finale.",
      "Les informations des participants ne sont pas publiées.",
    ],
    ctaLabel: "Demander la qualification au Forum",
    ctaExplanation:
      "Ouvre la réception contrôlée avec un contexte de qualification au Forum ; la réception n'est pas une acceptation.",
  },

  participation: {
    eyebrow: "Parcours de participation",
    title: "Six parcours vers un programme qualifié.",
    lead: "Chaque parcours précise qui il inclut, les objectifs qu'il peut servir et l'information à préparer. Choisir un parcours présélectionne un contexte de qualification ; il ne confirme pas la participation.",
    whoLabel: "Qui il inclut",
    objectivesLabel: "Objectifs potentiels",
    preparationLabel: "À préparer avant de demander",
    tracksLabel: "Filières sectorielles pertinentes",
    platformsLabel: "Plateformes liées",
    chainsLabel: "Chaînes de valeur liées",
    outcomesLabel: "Résultats possibles",
    ctaLabel: "Demander la qualification pour ce parcours",
    paths: [
      {
        id: "moroccan-institutions",
        title: "Institutions marocaines",
        summary:
          "Institutions publiques et semi-publiques, organismes de développement et de coopération, institutions de normalisation, de formation et sectorielles, et acteurs du développement territorial ou économique.",
        whoItIncludes: [
          "Institutions gouvernementales",
          "Institutions semi-publiques",
          "Organismes de développement et de coopération",
          "Institutions de normalisation, de formation et sectorielles",
          "Acteurs du développement territorial ou économique",
        ],
        potentialObjectives: [
          "Coopération institutionnelle et coordination sectorielle",
          "Coopération Sud–Sud et appui aux programmes",
          "Engagement technique et de renforcement des capacités",
          "Revue de besoins ou projets soudanais qualifiés",
        ],
        preparationRequirements: [
          "Identité et mandat de l'institution",
          "Secteur pertinent et objet de l'engagement",
          "Type de contrepartie soudanaise recherchée",
          "Résultat institutionnel attendu",
        ],
        expectedOutcomes: [
          "institutional-discussion-recommended",
          "specialist-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
      },
      {
        id: "moroccan-companies-exporters",
        title: "Entreprises, exportateurs et industriels marocains",
        summary:
          "Exportateurs, industriels, entreprises de transformation, fournisseurs d'équipements et d'intrants agricoles, entreprises alimentaires, fournisseurs miniers et industriels, fournisseurs de technologies et entreprises de logistique ou de chaîne du froid.",
        whoItIncludes: [
          "Exportateurs, industriels et entreprises de transformation",
          "Fournisseurs d'équipements et d'intrants agricoles",
          "Entreprises alimentaires et fournisseurs miniers ou industriels",
          "Entreprises de technologie, de logistique et de chaîne du froid",
        ],
        potentialObjectives: [
          "Expansion de marché et revue de demande qualifiée",
          "Discussion d'offre ou d'écoulement et coopération industrielle",
          "Distribution et déploiement de technologie",
          "Participation à des projets",
        ],
        preparationRequirements: [
          "Profil d'entreprise et produits ou capacités",
          "Marché cible et contrepartie requise",
          "Capacité de production ou de livraison",
          "Normes ou certifications le cas échéant, et résultat de réunion souhaité",
        ],
        expectedOutcomes: [
          "supply-offtake-discussion-recommended",
          "industrial-cooperation-review-recommended",
          "technical-meeting-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "La qualification n'implique pas un accès automatique au marché soudanais.",
      },
      {
        id: "sudanese-institutions-decision-makers",
        title: "Institutions et décideurs soudanais",
        summary:
          "Organismes publics et sectoriels, autorités régionales et locales, entités de développement, institutions aux besoins sectoriels documentés, et organisations porteuses ou coordinatrices de projets.",
        whoItIncludes: [
          "Organismes publics et sectoriels",
          "Autorités régionales et locales",
          "Entités de développement",
          "Institutions aux besoins sectoriels documentés ou aux rôles de coordination",
        ],
        potentialObjectives: [
          "Présentation de besoins qualifiés et coopération sectorielle",
          "Partenariats institutionnels",
          "Engagement technique et de renforcement des capacités",
          "Revue de projet ou d'infrastructure et sourcing de capacités marocaines",
        ],
        preparationRequirements: [
          "Identité, mandat et autorité institutionnels",
          "Besoin sectoriel et contexte du projet",
          "Capacité requise et géographie de mise en œuvre",
          "Décision institutionnelle attendue",
        ],
        expectedOutcomes: [
          "institutional-discussion-recommended",
          "project-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
        note: "Toute demande gouvernementale ou régionale n'est pas approuvée ; chacune est examinée au fond.",
      },
      {
        id: "sudanese-producers-project-sponsors",
        title: "Producteurs, porteurs de projet et propriétaires d'actifs soudanais",
        summary:
          "Producteurs, coopératives, exportateurs, porteurs de projets industriels, propriétaires de terrains ou d'installations, porteurs de projets miniers, opérateurs agricoles et d'élevage, et détenteurs d'opportunités de projet documentées.",
        whoItIncludes: [
          "Producteurs, coopératives et exportateurs",
          "Porteurs de projets industriels, miniers et d'infrastructure",
          "Propriétaires de terrains ou d'installations et opérateurs agricoles ou d'élevage",
          "Détenteurs d'opportunités de projet documentées",
        ],
        potentialObjectives: [
          "Revue de projet et partenariat industriel",
          "Discussion d'offre ou d'écoulement",
          "Accès à la technologie ou aux équipements",
          "Transformation et valorisation, logistique ou revue d'accès aux marchés",
        ],
        preparationRequirements: [
          "Identité et autorité",
          "Description du projet ou de l'actif et base de propriété ou de représentation",
          "Stade actuel et preuves disponibles",
          "Partenaire requis et étape suivante attendue",
        ],
        expectedOutcomes: [
          "project-review-recommended",
          "supply-offtake-discussion-recommended",
          "industrial-cooperation-review-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "Les actifs, minéraux, terrains ou projets anonymes ne sont jamais acceptés ni présentés ; l'identité et la documentation viennent d'abord.",
      },
      {
        id: "finance-investment-development",
        title: "Institutions de finance, d'investissement et de développement",
        summary:
          "Organismes de financement du développement, banques commerciales, institutions d'investissement, assureurs, spécialistes du financement du commerce et investisseurs stratégiques.",
        whoItIncludes: [
          "Organismes de financement du développement",
          "Banques commerciales et institutions d'investissement",
          "Assureurs et spécialistes du financement du commerce",
          "Investisseurs stratégiques",
        ],
        potentialObjectives: [
          "Revue de projets qualifiés",
          "Revue des besoins de financement et des lacunes de risque ou de preuve",
          "Discussion de parcours de financement du commerce",
          "Coopération de développement de projet",
        ],
        preparationRequirements: [
          "Mandat institutionnel, secteur et géographie",
          "Préférence de ticket ou de programme le cas échéant",
          "Exigences de risque et de preuve et limites réglementaires",
          "Type d'opportunité souhaité et résultat de revue attendu",
        ],
        expectedOutcomes: [
          "project-review-recommended",
          "specialist-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
        note: "Aucune opportunité n'est automatiquement prête à l'investissement, finançable, approuvée ou ouverte à la souscription publique.",
      },
      {
        id: "technology-logistics-knowledge",
        title: "Partenaires de technologie, de logistique et de savoir",
        summary:
          "Entreprises technologiques, prestataires logistiques, spécialistes portuaires et de stockage, institutions de recherche et de savoir, organismes de formation, laboratoires, et cabinets d'ingénierie ou de conseil.",
        whoItIncludes: [
          "Entreprises technologiques et prestataires logistiques",
          "Spécialistes portuaires et de stockage",
          "Institutions de recherche, de savoir et de formation",
          "Laboratoires et cabinets d'ingénierie ou de conseil",
        ],
        potentialObjectives: [
          "Partenariat de solution et revue technique",
          "Coopération de données et de technologie",
          "Conception logistique et appui aux tests ou aux normes",
          "Formation et développement des capacités",
        ],
        preparationRequirements: [
          "Profil de l'organisation et description des capacités",
          "Couverture géographique et références de mise en œuvre le cas échéant",
          "Contrepartie locale requise et projet ou chaîne cible",
          "Résultat de collaboration attendu",
        ],
        expectedOutcomes: [
          "technical-meeting-recommended",
          "specialist-review-recommended",
          "industrial-cooperation-review-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "Les prestataires de technologie ou de logistique proposés ne sont pas décrits comme des partenaires confirmés du Forum.",
      },
    ],
  },

  tracks: {
    eyebrow: "Filières sectorielles",
    title: "Cinq filières qui organisent discussions et réunions.",
    lead: "Les filières sectorielles regroupent la préparation et les réunions à travers les plateformes et les chaînes de valeur de la Passerelle. Elles organisent l'engagement ; elles ne remplacent pas les six parcours de chaîne de valeur.",
    discussionsLabel: "Discussions potentielles",
    platformsLabel: "Plateformes liées",
    chainsLabel: "Chaînes de valeur liées",
    ctaLabel: "Demander la qualification pour cette filière",
    items: [
      {
        id: "agriculture-food-industrialization",
        title: "Agriculture et industrialisation alimentaire",
        summary:
          "Production qualifiée, transformation d'huiles et d'aliments, conditionnement, intrants, stockage réfrigéré et exigences des acheteurs — de la source au partenariat industriel.",
        potentialDiscussions: [
          "Qualification de la production et intrants agricoles",
          "Transformation d'huiles et d'aliments et conditionnement",
          "Stockage réfrigéré et exigences des acheteurs",
          "Technologie et partenariats industriels",
        ],
      },
      {
        id: "feed-livestock-animal-value",
        title: "Aliments, élevage et valeur animale",
        summary:
          "Intrants d'alimentation, production animale, exigences vétérinaires et de traçabilité, transport, transformation et exigences de marché.",
        potentialDiscussions: [
          "Intrants d'alimentation et production animale",
          "Exigences vétérinaires, de quarantaine et de traçabilité",
          "Transport et transformation",
          "Exigences de marché",
        ],
        note: "Rien ici n'implique une approbation vétérinaire, de quarantaine ou d'importation.",
      },
      {
        id: "water-energy-agritech",
        title: "Eau, énergie et agritech",
        summary:
          "Irrigation, infrastructures agricoles solaires, données agricoles, suivi, agriculture numérique, énergie du stockage réfrigéré, et formation avec exploitation locale.",
        potentialDiscussions: [
          "Irrigation et infrastructures agricoles solaires",
          "Données agricoles, suivi et agriculture numérique",
          "Énergie du stockage réfrigéré",
          "Formation et exploitation locale",
        ],
      },
      {
        id: "mining-industrial-value",
        title: "Mines et valorisation industrielle",
        summary:
          "Preuves de projet, revue technique, essais et analyses, transformation et enrichissement, équipements, exigences environnementales et réglementaires, traçabilité et acheteurs industriels qualifiés.",
        potentialDiscussions: [
          "Preuves de projet et revue technique",
          "Essais, analyses, transformation et enrichissement",
          "Équipements et exigences environnementales ou réglementaires",
          "Traçabilité et acheteurs industriels qualifiés",
        ],
        note: "IBRIZ / GAAS n'apparaît ici que comme concept potentiel d'infrastructure réglementée — jamais comme financement de projet actif.",
      },
      {
        id: "ports-logistics-finance-technology",
        title: "Ports, logistique, finance et technologie",
        summary:
          "Parcours production-vers-port, stockage et chaîne du froid, documentation, préparation douanière et normative, exigences d'assurance et de financement du commerce, visibilité logistique, et technologie et données.",
        potentialDiscussions: [
          "Parcours production-vers-port et stockage ou chaîne du froid",
          "Documentation, préparation douanière et normative",
          "Exigences d'assurance et de financement du commerce",
          "Visibilité logistique et technologie ou données",
        ],
        note: "Aucun accord portuaire confirmé ni route active n'est impliqué ; les corridors sont conceptuels.",
      },
    ],
  },

  programme: {
    eyebrow: "Programme proposé",
    title: "Une structure proposée sur cinq jours.",
    lead: "Ce qui suit est une structure proposée, sous réserve de confirmation finale. Les formats sont indicatifs et aucune date, aucun lieu, intervenant, participant ou visite n'est confirmé.",
    statusNote:
      "Structure proposée — sous réserve de confirmation finale. Dates, lieu, participants et visites ne sont pas confirmés.",
    purposeLabel: "Objectif",
    formatsLabel: "Formats possibles",
    days: [
      {
        id: "institutional-framework",
        dayLabel: "Jour 1",
        title: "Cadre institutionnel et qualification",
        purpose: [
          "Aligner le Forum avec la Passerelle",
          "Présenter les participants qualifiés et les règles de travail",
          "Clarifier les besoins et capacités sectoriels",
          "Définir les objectifs de décision",
        ],
        formats: [
          "Ouverture institutionnelle",
          "Orientation sur l'écosystème",
          "Briefings des participants qualifiés",
          "Orientation projets et chaînes de valeur, et préparation des réunions",
        ],
      },
      {
        id: "sector-workshops",
        dayLabel: "Jour 2",
        title: "Ateliers sectoriels",
        purpose: [
          "Examiner problèmes, opportunités et lacunes de preuve par secteur",
          "Distinguer l'intérêt général des dossiers actionnables",
          "Préparer des questions de réunion pertinentes",
        ],
        formats: [
          "Atelier agriculture et alimentaire",
          "Atelier aliments et élevage",
          "Atelier eau, énergie et agritech",
          "Atelier mines et industrie",
          "Atelier logistique, finance et technologie",
        ],
      },
      {
        id: "b2b-b2g-meetings",
        dayLabel: "Jour 3",
        title: "Réunions B2B et B2G",
        purpose: [
          "Conduire des réunions préparées à objectif défini",
          "Relier chaque demande à une capacité, un projet ou une chaîne de valeur",
          "Identifier les lacunes de preuve et les actions suivantes",
        ],
        formats: [
          "Chaque réunion a un objet défini et des participants appropriés",
          "Un projet, une chaîne ou une demande institutionnelle liés",
          "Des notes de préparation et les questions ou décisions recherchées",
          "Une catégorie de résultat attendu",
        ],
        note: "Le site ne planifie ni ne confirme les réunions ; il n'y a pas de prise de rendez-vous.",
      },
      {
        id: "industrial-institutional-visits",
        dayLabel: "Jour 4",
        title: "Visites industrielles et institutionnelles",
        purpose: [
          "Exposer les participants qualifiés aux capacités marocaines pertinentes",
          "Soutenir la compréhension technique",
          "Examiner des contextes de coopération potentiels",
        ],
        formats: [
          "Catégories d'installations industrielles",
          "Installations de transformation",
          "Plateformes logistiques ou de stockage",
          "Organismes de technologie, de formation ou sectoriels pertinents",
        ],
        note: "Seules des catégories de visites potentielles sont présentées. Aucune installation ou institution n'est publiée comme visite confirmée.",
      },
      {
        id: "decisions-follow-up",
        dayLabel: "Jour 5",
        title: "Décisions et plan de suivi",
        purpose: [
          "Consigner le résultat des discussions",
          "Identifier les preuves manquantes et assigner l'étape suivante",
          "Distinguer l'intérêt de l'engagement",
          "Préparer le suivi post-Forum",
        ],
        formats: [
          "Informations complémentaires demandées",
          "Réunion technique ou revue de projet recommandée",
          "Discussion institutionnelle ou d'offre et d'écoulement recommandée",
          "Revue de coopération industrielle recommandée, ou aucune progression à ce stade",
        ],
        note: "P3 ne présente que des catégories de résultats ; il n'implémente ni registres de décision ni suivi d'engagements.",
      },
    ],
  },

  meeting: {
    eyebrow: "Préparation des réunions",
    title: "Ce qui rend une réunion du Forum utile.",
    lead: "Une réunion n'est proposée que si elle est préparée. Voici les conditions qu'une réunion devrait remplir avant d'occuper le temps de quiconque — le tout sous revue humaine.",
    criteria: [
      {
        title: "Un objet défini",
        text: "Une raison commerciale ou institutionnelle claire de se réunir.",
      },
      {
        title: "Des participants qualifiés",
        text: "Des catégories de participants appropriées de part et d'autre.",
      },
      {
        title: "Un dossier lié",
        text: "Un projet, une plateforme, une chaîne de valeur ou une demande liés.",
      },
      {
        title: "Une préparation minimale",
        text: "L'information minimale pour rendre la réunion utile.",
      },
      {
        title: "Des questions ou décisions",
        text: "Les questions ou décisions clés recherchées.",
      },
      {
        title: "Un résultat réaliste",
        text: "Une catégorie de résultat attendu, revue par une personne.",
      },
    ],
    checklistTitle: "Liste de préparation du visiteur",
    checklist: [
      "Je peux énoncer un objet défini pour la réunion.",
      "Je sais quelles catégories de participants sont pertinentes.",
      "Je peux relier un projet, une plateforme ou une chaîne de valeur.",
      "Je peux fournir l'information de préparation minimale.",
      "Je connais les questions ou décisions clés que je recherche.",
      "J'ai en tête un résultat attendu réaliste.",
    ],
    note: "Le site ne planifie ni ne confirme les réunions ; un spécialiste détermine si une réunion est appropriée.",
  },

  outcomes: {
    eyebrow: "Résultats attendus",
    title: "Catégories d'étape suivante possibles.",
    lead: "Une revue par un spécialiste peut aboutir à l'une des catégories suivantes. Ce sont des étapes possibles, non des décisions produites automatiquement par le site ; seuls des humains autorisés déterminent le résultat, et la participation n'en garantit pas un positif.",
    items: [
      {
        id: "additional-information-required",
        label: "Informations complémentaires requises",
      },
      {
        id: "specialist-review-recommended",
        label: "Revue par un spécialiste recommandée",
      },
      {
        id: "technical-meeting-recommended",
        label: "Réunion technique recommandée",
      },
      {
        id: "institutional-discussion-recommended",
        label: "Discussion institutionnelle recommandée",
      },
      { id: "project-review-recommended", label: "Revue de projet recommandée" },
      {
        id: "supply-offtake-discussion-recommended",
        label: "Discussion d'offre ou d'écoulement recommandée",
      },
      {
        id: "industrial-cooperation-review-recommended",
        label: "Revue de coopération industrielle recommandée",
      },
      { id: "follow-up-after-forum", label: "Suivi après le Forum" },
      {
        id: "no-progression-at-this-stage",
        label: "Aucune progression à ce stade",
      },
    ],
    note: "Ces catégories décrivent des revues et des discussions possibles. Elles ne créent ni engagements, ni échéances, ni états de flux de travail.",
  },

  prepare: {
    eyebrow: "Se préparer au Forum",
    title: "Un guide de préparation et de qualification.",
    lead: "Préparez l'information dont un spécialiste a besoin pour examiner votre demande. Aucun document n'est téléversé ou transmis par ce site — vous indiquez seulement ce qui existe.",
    stepsTitle: "Ce qu'il faut préparer",
    steps: [
      {
        title: "Identité organisationnelle",
        text: "Nom, type et pays de l'organisation.",
      },
      {
        title: "Autorité et représentant",
        text: "Nom du représentant et rôle ou autorité.",
      },
      {
        title: "Parcours de participation",
        text: "Le parcours qui vous décrit le mieux.",
      },
      {
        title: "Filière sectorielle",
        text: "La filière sectorielle pertinente.",
      },
      {
        title: "Projet ou plateforme lié",
        text: "Une plateforme du portefeuille liée, le cas échéant.",
      },
      {
        title: "Chaîne de valeur liée",
        text: "Un parcours de chaîne de valeur lié, le cas échéant.",
      },
      {
        title: "Objet de la participation",
        text: "Pourquoi vous souhaitez vous engager, et la contrepartie recherchée.",
      },
      {
        title: "Information disponible",
        text: "L'information dont vous disposez, et le résultat souhaité.",
      },
    ],
    evidenceTitle: "Preuves potentiellement pertinentes",
    evidenceLead:
      "Vous pouvez indiquer quelles preuves existent. Les documents ne sont jamais téléversés ou envoyés automatiquement ; un processus contrôlé suit seulement si la revue se poursuit.",
    evidenceItems: [
      "Profil d'organisation ou d'entreprise",
      "Mandat, autorité ou base de représentation",
      "Documentation de projet, d'actif ou de capacité",
      "Normes, certifications ou références techniques",
      "Statut de propriété, de licence ou de permis le cas échéant",
    ],
    privacyTitle: "Déclarations et confidentialité",
    privacy: [
      "Aucun annuaire de participants n'est public et aucune demande soumise n'est visible publiquement.",
      "Le profil de votre organisation n'est pas publié via le formulaire de qualification.",
      "Aucune introduction, mise en relation ou acceptation automatique n'est réalisée.",
      "N'entrez pas d'informations confidentielles ou sensibles dans le formulaire public.",
      "Un échange contrôlé supplémentaire peut avoir lieu plus tard par des canaux approuvés.",
    ],
    ctaLabel: "Demander la qualification au Forum",
  },

  metrics: {
    eyebrow: "Comment le Forum est mesuré",
    title: "Qualité des résultats, non volume de présence.",
    lead: "Le Forum se mesure à la qualité de ce qu'il produit, non au nombre de présents. Voici les catégories de valeur qu'il vise à créer.",
    items: [
      "Dossiers d'organisations qualifiés",
      "Besoins et capacités documentés",
      "Réunions préparées à objet défini",
      "Projets orientés vers une revue par un spécialiste",
      "Lacunes d'information identifiées",
      "Décisions ou étapes suivantes consignées",
      "Engagements nécessitant un suivi",
      "Progrès post-Forum",
    ],
    note: "Aucun objectif ni chiffre atteint n'est publié, et il n'y a pas de tableau de bord de mesures.",
  },

  crossLinks: {
    platformTitle: "S'engager avec cette plateforme via le Forum",
    platformLead:
      "Le Forum organise des réunions et discussions qualifiées autour de cette plateforme. Voici les filières sectorielles pertinentes ; la qualification précède toute réunion.",
    chainTitle: "Discuter de cette chaîne de valeur au Forum",
    chainLead:
      "Le Forum organise des discussions qualifiées le long de cette chaîne de valeur. Voici la filière sectorielle pertinente et les catégories de parties prenantes habituellement concernées ; la qualification précède toute réunion.",
    tracksLabel: "Filières sectorielles pertinentes",
    stakeholdersLabel: "Catégories de parties prenantes habituellement concernées",
    ctaLabel: "Demander la qualification au Forum",
    exploreLabel: "Explorer les parcours de participation",
  },

  pages: {
    hub: {
      title: "Forum économique Maroc–Soudan — programme de qualification et d'engagement",
      description:
        "Un programme privé, sur invitation et guidé par la qualification, activant la Passerelle permanente par la préparation, les réunions, les décisions et un suivi structuré.",
    },
    programme: {
      title: "Programme du Forum — une structure proposée sur cinq jours",
      description:
        "Une structure proposée sur cinq jours, sous réserve de confirmation finale : cadre institutionnel, ateliers sectoriels, réunions B2B et B2G préparées, catégories de visites, et décisions avec plan de suivi.",
    },
    participation: {
      title: "Parcours de participation au Forum — à qui s'adresse le Forum",
      description:
        "Six parcours pour institutions, entreprises, producteurs, financeurs et partenaires spécialisés marocains et soudanais — chacun avec objectifs, préparation et contexte de qualification.",
    },
    prepare: {
      title: "Se préparer au Forum — guide de qualification",
      description:
        "Un guide de préparation et de qualification pour le Forum économique Maroc–Soudan. Préparez l'information dont un spécialiste a besoin ; aucun document n'est téléversé par le site.",
    },
  },
};
