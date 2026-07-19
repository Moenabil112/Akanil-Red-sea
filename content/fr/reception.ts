import type { ReceptionContent } from "../types";

/** Français — bureau d'accueil (taxonomie de demandes P0, ADR-014). */
export const frReception: ReceptionContent = {
  eyebrow: "Accueil institutionnel",
  heading: "Accueil institutionnel structuré",
  lead: "Un bureau institutionnel contrôlé — pas un portail ouvert. Vous préparez une demande structurée, vous la relisez, puis vous l'envoyez via votre propre service d'email. Les demandes sont examinées par une équipe pluridisciplinaire autorisée ; la réception ne vaut pas acceptation.",
  channelsTitle: "Canaux directs",
  emailChannelLabel: "Email institutionnel",
  phoneChannelLabel: "Téléphone direct",
  phoneNote: "Le téléphone reste disponible comme canal direct distinct.",
  noJsNote:
    "Si le formulaire structuré n'est pas disponible dans votre navigateur, contactez directement le bureau par email ou téléphone via les canaux ci-dessus.",
  requestTypes: {
    "institutional-cooperation": {
      label: "Coopération institutionnelle",
      description:
        "Pour les ministères, institutions publiques, associations et organismes de développement.",
      expectedReviewOutput: [
        "Briefing institutionnel préliminaire",
        "Clarification du périmètre de coopération",
        "Demande de compléments de preuve ou de mandat",
        "Recommandation d'une discussion spécialisée si elle est justifiée",
      ],
      preparationRequirements: [
        "Identité institutionnelle et mandat",
        "Objet de la coopération et périmètre envisagé",
      ],
    },
    "market-expansion": {
      label: "Expansion de marché",
      description:
        "Pour les entreprises marocaines et internationales visant le Soudan, la mer Rouge ou la Corne de l'Afrique.",
      expectedReviewOutput: [
        "Revue préliminaire de pertinence d'entrée sur le marché",
        "Catégories de parties prenantes requises",
        "Lacunes de marché et de preuve",
        "Étape de qualification recommandée",
      ],
      preparationRequirements: [
        "Profil de l'entreprise et secteur",
        "Définition du marché cible",
      ],
    },
    "project-investment-review": {
      label: "Revue de projet d'investissement",
      description:
        "Pour les banques, investisseurs, institutions et porteurs de projets qualifiés.",
      expectedReviewOutput: [
        "Revue préliminaire d'adéquation du projet",
        "Exigences de preuve contrôlées",
        "Parcours de revue du projet",
        "Passage possible à une phase ultérieure de revue des preuves",
      ],
      preparationRequirements: [
        "Identification du projet",
        "Aperçu des preuves disponibles",
      ],
      disclaimer:
        "La réception d'une demande de revue de projet ne constitue ni une approbation d'investissement, ni une sollicitation d'investissement, ni une disponibilité de financement, ni un cautionnement du projet.",
    },
    "supply-offtake-requirement": {
      label: "Besoin d'approvisionnement ou d'enlèvement",
      description:
        "Pour les acheteurs, producteurs, exportateurs et industriels.",
      expectedReviewOutput: [
        "Besoin d'achat ou d'approvisionnement structuré",
        "Clarification des volumes, normes et lacunes de preuve",
        "Parcours de chaîne de valeur pertinent",
      ],
      preparationRequirements: [
        "Type de produit ou d'actif",
        "Volumes et normes indicatifs si disponibles",
      ],
    },
    "industrial-partnership": {
      label: "Partenariat industriel",
      description:
        "Pour la coopération en transformation, fabrication, conditionnement, mines, agriculture et industrie.",
      expectedReviewOutput: [
        "Évaluation préliminaire du rôle industriel",
        "Capacités et preuves requises",
        "Position proposée dans la chaîne de valeur",
      ],
      preparationRequirements: [
        "Profil de capacité industrielle",
        "Rôle de coopération envisagé",
      ],
    },
    "port-logistics-cooperation": {
      label: "Coopération portuaire et logistique",
      description:
        "Pour les ports, terminaux, opérateurs logistiques, zones économiques et transporteurs.",
      expectedReviewOutput: [
        "Évaluation préliminaire du rôle dans le corridor",
        "Exigences de données logistiques",
        "Parcours de plateforme et de parties prenantes pertinent",
      ],
      preparationRequirements: [
        "Profil de l'organisation et rôle opérationnel",
        "Corridor ou zone d'intérêt",
      ],
    },
    "technology-data-partnership": {
      label: "Partenariat technologique et de données",
      description:
        "Pour les partenaires IA, télécoms, traçabilité, automatisation, infrastructure bancaire, recherche et techniques — y compris la discussion d'infrastructures réglementées.",
      expectedReviewOutput: [
        "Évaluation préliminaire du rôle technique",
        "Exigences d'intégration et de preuve",
        "Considérations réglementaires ou de gouvernance des données",
      ],
      preparationRequirements: [
        "Profil de capacités et cas d'usage de référence",
        "Rôle envisagé dans l'écosystème",
      ],
    },
    "forum-qualification": {
      label: "Qualification pour le Forum",
      description:
        "Pour les participants potentiels au Forum Économique Maroc–Soudan.",
      expectedReviewOutput: [
        "Revue de qualification",
        "Demande de preuves d'entreprise, d'institution, de capacité ou de besoin",
        "Clarification de la pertinence pour le programme",
      ],
      preparationRequirements: [
        "Profil de l'organisation",
        "Capacité ou besoin à apporter au programme",
      ],
      disclaimer:
        "La revue de qualification ne promet ni participation ni invitation.",
    },
    "submit-project-asset": {
      label: "Soumettre un projet ou un actif",
      description:
        "Pour les porteurs de projets, propriétaires d'actifs, propriétaires fonciers, propriétaires d'usines, producteurs et aménageurs de zones économiques.",
      expectedReviewOutput: [
        "Classification préliminaire",
        "Revue de complétude des preuves",
        "Identification des documents juridiques, techniques, financiers ou de marché manquants",
        "Décision sur l'ouverture éventuelle d'une revue de projet contrôlée",
      ],
      preparationRequirements: [
        "Identification et localisation du projet ou de l'actif",
        "Aperçu des preuves disponibles",
      ],
      disclaimer:
        "La soumission ne publie pas le projet et ne vaut pas acceptation ; aucune publication n'est jamais automatique.",
    },
  },
  audienceLabel: "Parcours d'entrée",
  chainLabel: "Chaîne de valeur concernée",
  audienceNames: {
    "moroccan-institutions": "Institutions marocaines",
    "moroccan-industry-exporters": "Industrie et exportateurs marocains",
    "moroccan-finance-investment": "Finance et investissement marocains",
    "sudanese-decision-makers": "Décideurs soudanais",
    "sudanese-producers-asset-owners":
      "Producteurs, exportateurs et propriétaires d'actifs soudanais",
    "red-sea-ports-economic-zones": "Ports et zones économiques de la mer Rouge",
    "technology-logistics-knowledge-partners":
      "Partenaires technologiques, logistiques et de savoir",
  },
  fieldLabels: {
    organization: "Nom de l'organisation",
    organizationType: "Type d'organisation",
    country: "Pays de l'organisation",
    region: "Région",
    sector: "Secteur",
    contactName: "Personne de contact (nom professionnel)",
    role: "Fonction ou autorité professionnelle",
    email: "Email professionnel",
    phone: "Numéro de téléphone",
    website: "Site web de l'organisation",
    audience: "Parcours d'entrée",
    requestType: "Type de demande",
    platform: "Plateforme concernée",
    projectName: "Nom du projet ou de l'actif",
    assetType: "Type d'actif ou de produit",
    location: "Localisation",
    productionCapacity: "Capacité de production (indicative)",
    requiredVolume: "Volume requis (indicatif)",
    targetMarket: "Marché cible",
    requiredPartner: "Catégorie de partenaire recherchée",
    investmentRange: "Fourchette d'investissement indicative",
    evidenceAvailable: "Preuves disponibles",
    licenceStatus: "Statut des licences ou permis",
    summary: "Résumé concis de la demande",
    requestedNextStep: "Prochaine étape demandée",
    preferredLanguage: "Langue préférée",
    consent: "Consentement",
  },
  fieldHints: {
    summary:
      "Quelques phrases : qui vous êtes, ce que vous demandez, et pourquoi.",
    evidenceAvailable:
      "Indiquez ce qui existe — aucun document n'est téléversé ni envoyé automatiquement par email ; un processus contrôlé suit si la revue se poursuit.",
    productionCapacity:
      "Chiffres approximatifs uniquement ; aucune affirmation vérifiée n'est impliquée.",
    requiredVolume:
      "Chiffres approximatifs uniquement ; aucune affirmation vérifiée n'est impliquée.",
    investmentRange:
      "Indicatif uniquement ; aucune disponibilité de financement n'est impliquée.",
  },
  evidenceOptions: [
    { id: "company-profile", label: "Profil de l'entreprise" },
    { id: "legal-documents", label: "Documents juridiques" },
    { id: "land-asset-documents", label: "Documents fonciers ou d'actifs" },
    { id: "licence-permit", label: "Licences ou permis" },
    { id: "technical-study", label: "Étude technique" },
    { id: "financial-model", label: "Modèle financier" },
    { id: "market-study", label: "Étude de marché" },
    { id: "esg-study", label: "Étude environnementale ou sociale" },
    { id: "product-specs", label: "Spécifications produit" },
    { id: "certifications", label: "Certifications" },
    { id: "logistics-data", label: "Données logistiques" },
  ],
  expectedReviewLabel: "Résultat de revue attendu",
  preparationLabel: "À préparer avant la demande",
  form: {
    legend: "Demande structurée",
    optionalLegend: "Détails optionnels",
    consentLabel: "Consentement",
    consentText:
      "Je consens à l'utilisation des informations ci-dessus pour examiner cette demande et y répondre.",
    requiredMark: "requis",
    optionalMark: "optionnel",
    errors: {
      required: "Ce champ est requis.",
      email: "Saisissez une adresse email professionnelle valide.",
      consent: "Le consentement est requis pour préparer la demande.",
      summaryLength:
        "Merci de rédiger un court résumé (au moins 20 caractères).",
    },
    reviewButton: "Relire la demande",
    backButton: "Retour",
  },
  review: {
    title: "Relecture avant envoi",
    lead: "Vérifiez le résumé structuré ci-dessous. Rien n'a encore été envoyé.",
    whatHappens: "Ce qui va se passer",
    steps: [
      "Votre application d'email s'ouvre avec cette demande pré-remplie, adressée au bureau d'accueil.",
      "Vous envoyez l'email vous-même, via votre propre service d'email — le site ne transmet rien.",
      "L'équipe spécialisée examine la demande et répond par un canal contrôlé.",
    ],
    openEmailButton: "Ouvrir la demande dans mon application d'email",
    editButton: "Modifier la demande",
    copySubjectButton: "Copier l'objet",
    copyBodyButton: "Copier la demande structurée",
    downloadDraftButton: "Télécharger un brouillon local (.txt)",
    copiedAnnouncement: "Copié dans le presse-papiers.",
    downloadedAnnouncement: "Brouillon local téléchargé.",
    missingOptionalNote:
      "Les informations optionnelles non fournies sont simplement omises ; la revue pourra les demander ultérieurement.",
  },
  afterOpen: {
    title: "Votre application d'email devrait maintenant être ouverte.",
    text: "La demande a été préparée et transmise à votre application d'email. Elle ne part que lorsque vous appuyez sur Envoyer.",
    notSentWarning:
      "Rien n'a été soumis via ce site — si votre application d'email ne s'est pas ouverte, utilisez les canaux directs ci-dessous ou les actions de copie et de téléchargement ci-dessus.",
    directLine: "Canaux directs",
  },
  privacy: {
    title: "Confidentialité et statut de revue",
    points: [
      "Les informations saisies ici restent sur cette page jusqu'à l'ouverture de votre application d'email ; ce site ne les stocke pas et ne les transmet pas.",
      "Aucun cookie, stockage navigateur ou outil analytique n'est utilisé pour ce formulaire, et aucun fichier ne peut être téléversé.",
      "La transmission s'effectue via votre propre service d'email, sous votre contrôle.",
      "La réception ne vaut ni acceptation, ni qualification, ni cautionnement, ni partenariat — chaque demande est examinée par une équipe pluridisciplinaire autorisée.",
    ],
  },
  email: {
    subjectPrefix: "[Accueil Passerelle]",
    intro:
      "Demande institutionnelle structurée préparée sur la fenêtre publique :",
    fieldLabels: {
      organization: "Organisation",
      organizationType: "Type d'organisation",
      country: "Pays",
      region: "Région",
      sector: "Secteur",
      contactName: "Personne de contact",
      role: "Fonction / autorité",
      email: "Email professionnel",
      phone: "Téléphone",
      website: "Site web",
      audience: "Parcours d'entrée",
      requestType: "Type de demande",
      platform: "Plateforme concernée",
      projectName: "Nom du projet / actif",
      assetType: "Type d'actif / produit",
      location: "Localisation",
      productionCapacity: "Capacité de production (indicative)",
      requiredVolume: "Volume requis (indicatif)",
      targetMarket: "Marché cible",
      requiredPartner: "Catégorie de partenaire recherchée",
      investmentRange: "Fourchette d'investissement indicative",
      evidenceAvailable: "Preuves disponibles",
      licenceStatus: "Statut licences / permis",
      summary: "Résumé de la demande",
      requestedNextStep: "Prochaine étape demandée",
      preferredLanguage: "Langue préférée",
      consent: "Consentement",
    },
    outro:
      "Cette demande a été préparée sur la fenêtre publique et envoyée par le service d'email du demandeur. Elle est soumise à une revue humaine spécialisée ; la réception ne vaut pas acceptation.",
  },
};
