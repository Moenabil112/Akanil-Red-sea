import type { ReceptionContent } from "../types";

/** Français — bureau d'accueil numérique allégé. */
export const frReception: ReceptionContent = {
  eyebrow: "Accueil institutionnel",
  heading: "Accueil numérique allégé",
  lead: "Un bureau institutionnel contrôlé — pas un portail ouvert. Vous préparez une demande structurée, vous la relisez, puis vous l'envoyez vous-même via votre service d'email. Chaque demande est examinée par une personne autorisée ; la réception ne vaut pas acceptation.",
  channelsTitle: "Canaux directs",
  emailChannelLabel: "Email institutionnel",
  phoneChannelLabel: "Téléphone direct",
  phoneNote: "Le téléphone reste disponible comme canal direct distinct.",
  noJsNote:
    "Si le formulaire structuré n'est pas disponible dans votre navigateur, contactez directement le bureau par email ou téléphone via les canaux ci-dessus.",
  requestTypes: {
    briefing: {
      label: "Briefing institutionnel",
      description:
        "Une présentation structurée de la Passerelle pour une institution ou une organisation.",
    },
    qualification: {
      label: "Qualification d'entreprise",
      description:
        "Comprendre et engager le parcours de qualification de votre entreprise.",
    },
    "value-chain": {
      label: "Demande sur une chaîne de valeur prioritaire",
      description:
        "Un intérêt concret pour l'une des quatre chaînes de valeur prioritaires.",
    },
    meeting: {
      label: "Réunion contrôlée",
      description: "Une session ciblée et documentée, avec un ordre du jour défini.",
    },
    capability: {
      label: "Présentation de capacité",
      description:
        "Présenter une capacité industrielle, technologique, logistique ou de savoir.",
    },
    "need-opportunity": {
      label: "Discussion d'un besoin ou d'une opportunité qualifiés",
      description:
        "Présenter un besoin documenté ou discuter une opportunité qualifiée.",
    },
    forum: {
      label: "Demande de qualification pour le Forum",
      description:
        "Se renseigner sur la qualification pour le Forum Économique Maroc–Soudan privé.",
    },
  },
  audienceLabel: "Parcours d'entrée",
  form: {
    legend: "Demande structurée",
    requestType: "Type de demande",
    organization: "Nom de l'organisation",
    country: "Pays de l'organisation",
    sector: "Secteur",
    contactName: "Personne de contact (nom professionnel)",
    role: "Fonction ou autorité professionnelle",
    email: "Email professionnel",
    summary: "Résumé concis de la demande",
    summaryHint: "Quelques phrases : qui vous êtes, ce que vous demandez, et pourquoi.",
    phone: "Numéro de téléphone",
    website: "Site web de l'organisation",
    preferredLanguage: "Langue préférée",
    valueChain: "Chaîne de valeur concernée",
    valueChainNone: "Sans chaîne spécifique",
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
      summaryLength: "Merci de rédiger un court résumé (au moins 20 caractères).",
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
      "Une personne autorisée examine la demande et répond par un canal contrôlé.",
    ],
    openEmailButton: "Ouvrir la demande dans mon application d'email",
    editButton: "Modifier la demande",
  },
  afterOpen: {
    title: "Votre application d'email devrait maintenant être ouverte.",
    text: "La demande a été préparée et transmise à votre application d'email. Elle ne part que lorsque vous appuyez sur Envoyer.",
    notSentWarning:
      "Rien n'a été soumis via ce site — si votre application d'email ne s'est pas ouverte, utilisez les canaux directs ci-dessous.",
    directLine: "Canaux directs",
  },
  privacy: {
    title: "Confidentialité et statut de revue",
    points: [
      "Les informations saisies ici restent sur cette page jusqu'à l'ouverture de votre application d'email ; ce site ne les stocke pas et ne les transmet pas.",
      "Aucun cookie, stockage navigateur ou outil analytique n'est utilisé pour ce formulaire.",
      "La transmission s'effectue via votre propre service d'email, sous votre contrôle.",
      "La réception ne vaut ni acceptation, ni qualification, ni partenariat — chaque demande reste soumise à revue humaine.",
    ],
  },
  email: {
    subjectPrefix: "[Accueil Passerelle]",
    intro:
      "Demande institutionnelle structurée préparée via la fenêtre publique de présentation de la Passerelle :",
    fieldLabels: {
      requestType: "Type de demande",
      audience: "Parcours d'entrée",
      organization: "Organisation",
      country: "Pays",
      sector: "Secteur",
      contactName: "Personne de contact",
      role: "Fonction / autorité",
      email: "Email professionnel",
      phone: "Téléphone",
      website: "Site web",
      preferredLanguage: "Langue préférée",
      valueChain: "Chaîne de valeur concernée",
      summary: "Résumé de la demande",
    },
    outro:
      "Cette demande a été préparée sur la fenêtre publique de présentation et envoyée par le service d'email du demandeur. Elle est soumise à revue humaine ; la réception ne vaut pas acceptation.",
  },
};
