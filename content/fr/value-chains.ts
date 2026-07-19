import type { ValueChainsContent } from "../value-chains-types";

/**
 * Contenu français des chaînes de valeur — édité indépendamment (P2, ADR-018).
 * Chaque parcours est un scénario ancré dans les référentiels approuvés
 * d'Akanil et la logique de valeur partagée (ressource soudanaise +
 * transformation et expertise marocaines + financement et logistique +
 * distribution régionale = valeur partagée mesurable). Aucun itinéraire,
 * volume, tarif, délai, coût, agrément ou partenariat n'est confirmé.
 */
export const frValueChains: ValueChainsContent = {
  overviewEyebrow: "Chaînes de valeur et parcours économiques",
  overviewTitle: "Six parcours, de la ressource à la valeur partagée mesurable.",
  overviewLead:
    "Chaque parcours montre comment une ressource ou une capacité soudanaise peut se combiner à la transformation et à l'expertise marocaines, au financement et à la logistique, puis à la distribution régionale. Ce sont des parcours potentiels à étudier — des scénarios indicatifs, non des itinéraires, volumes ou accords confirmés.",
  chainsListLabel: "Chaînes de valeur prioritaires",
  profileHeroEyebrow: "Parcours de chaîne de valeur",
  profileLinkLabel: "Ouvrir le parcours",
  learnMoreLabel: "Lire le parcours complet",
  scenarioNote:
    "Chaque parcours de cette page est un scénario à étudier. Les chiffres, itinéraires et relations sont indicatifs et soumis à une revue commerciale, réglementaire et logistique actuelle. Rien ici ne confirme un partenaire, un acheteur, un financeur, un itinéraire, un tarif, un délai ou un agrément.",

  categoryLabel: "Type de parcours",
  scenarioStatusLabel: "Statut du scénario",
  sourceBasisLabel: "Base documentaire",
  lastReviewedLabel: "Dernière revue",
  problemLabel: "Le problème structurel",
  opportunityLabel: "L'opportunité de valeur partagée",
  flowLabel: "Flux de valeur partagée",
  flowRoleLabel: "Ce qui se passe",
  flowContributionLabel: "Contribution de valeur",
  relatedPlatformsLabel: "Plateformes du portefeuille liées",
  geographicLabel: "Contribution géographique à la valeur",
  enablingLayersLabel: "Couches habilitantes",
  publicScopeLabel: "Ce qui est un aperçu public du parcours aujourd'hui",
  verificationScopeLabel: "Ce qui nécessite une vérification actuelle",
  limitationsLabel: "Limites du scénario",
  prepLabel: "À préparer avant une demande de revue",
  regulatoryLabel: "Note réglementaire",

  scenarioStatus: {
    "public-pathway-overview": "Aperçu public du parcours",
    "requires-current-verification": "Nécessite une vérification actuelle",
    "additional-information-after-review":
      "Informations complémentaires disponibles après revue",
    "regulated-or-sensitive-elements":
      "Comporte des éléments réglementés ou sensibles",
  },

  enabling: {
    eyebrow: "Couches habilitantes transversales",
    title: "Les couches dont dépend chaque parcours.",
    lead: "Aucun parcours ne repose sur les seules ressources. Ces couches traversent les six chaînes ; c'est là que la Passerelle concentre la qualification, la structuration et le suivi.",
    layers: [
      {
        title: "Qualification et confiance",
        text: "Identité, propriété et documentation vérifiées avant toute discussion — pas de flux anonymes.",
      },
      {
        title: "Financement et structuration du risque",
        text: "Structures de paiement, assurance et répartition du risque conçues au cas par cas ; aucune disponibilité de financement n'est sous-entendue.",
      },
      {
        title: "Logistique et corridors",
        text: "Scénarios d'itinéraire, de stockage et de chaîne du froid étudiés au cas par cas ; les corridors présentés sont conceptuels, non opérationnels.",
      },
      {
        title: "Normes et traçabilité",
        text: "Spécifications, tests, conformité et origine documentée tout au long de la chaîne.",
      },
      {
        title: "Technologie et données",
        text: "Enregistrements, suivi et aide à la décision au service des spécialistes ; les systèmes proposent, les humains décident.",
      },
      {
        title: "Capacité humaine et suivi",
        text: "Compétences locales, exploitation et suivi structuré pour que la valeur reste là où elle est créée.",
      },
    ],
  },

  geographic: {
    eyebrow: "Les deux rives du pont",
    title: "Où la valeur est apportée le long de chaque parcours.",
    lead: "La Passerelle lit les deux rives du corridor. La valeur est créée au Soudan, ajoutée au Maroc, puis acheminée et distribuée à travers l'espace de la mer Rouge — chaque rive conservant la valeur qu'elle apporte.",
    groups: [
      {
        title: "Soudan",
        items: [
          "Ressources et capacités agricoles, animales et minérales",
          "Régions de production, propriétaires d'actifs et producteurs",
          "Valeur d'origine conservée par la qualification et la documentation",
        ],
      },
      {
        title: "Maroc",
        items: [
          "Capacités de transformation, industrielles et technologiques",
          "Expertise en financement, assurance et normes",
          "Nœuds de fabrication et d'accès aux marchés",
        ],
      },
      {
        title: "Corridor de la mer Rouge",
        items: [
          "Ports, zones économiques et nœuds logistiques",
          "Itinéraires de distribution régionaux et internationaux",
          "Coordination entre parties prenantes qualifiées",
        ],
      },
    ],
  },

  items: [
    {
      id: "oilseeds-agro-processing",
      name: "Parcours oléagineux et agro-transformation",
      shortName: "Oléagineux et agro-transformation",
      category: "Valorisation des oléagineux, huiles et tourteaux",
      summary:
        "Un parcours potentiel menant les oléagineux soudanais de la qualification à la trituration, au raffinage et au conditionnement dans des installations marocaines, vers les marchés alimentaires et industriels régionaux — en conservant la valeur d'origine au lieu de l'exporter brute.",
      scenarioStatus: "public-pathway-overview",
      sourceBasis:
        "Référentiel de chaîne de valeur approuvé d'Akanil et plan préliminaire VALURA",
      lastReviewed: "Juillet 2026",
      problem:
        "Les oléagineux comme le sésame et l'arachide sont exportés surtout à l'état brut ; la valeur du tri, de la trituration, du raffinage et du conditionnement est créée ailleurs et perdue à l'origine.",
      opportunity:
        "Associer une offre soudanaise d'oléagineux documentée aux capacités marocaines de trituration, de raffinage et de fabrication alimentaire pourrait conserver plus de valeur des deux côtés — un scénario à étudier, non un programme engagé.",
      flow: [
        {
          title: "Source et capacité soudanaises",
          role: "Producteurs et fournisseurs d'oléagineux qualifiés, origine documentée.",
          contribution: "Soudan — ressource et valeur d'origine.",
        },
        {
          title: "Qualification et normes",
          role: "Classement, analyses de laboratoire et conformité sanitaire.",
          contribution: "Partagée — confiance et traçabilité.",
        },
        {
          title: "Transformation et expertise marocaines",
          role: "Trituration, raffinage et fabrication alimentaire au Maroc.",
          contribution: "Maroc — transformation et valeur ajoutée.",
        },
        {
          title: "Financement et logistique",
          role: "Financement du commerce, assurance et scénarios de transport étudiés.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Distribution régionale",
          role: "Industries alimentaires et marchés de consommation de la région.",
          contribution: "Corridor — accès aux marchés.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Produits à plus forte valeur, résultats consignés des deux côtés.",
          contribution: "Les deux rives — valeur conservée.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours se relie aux plateformes qui qualifient l'offre, ajoutent de la transformation et structurent le corridor. Les relations sont des rôles d'écosystème, non des opérations confirmées.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Production d'oléagineux et origine documentée",
            "Qualification des producteurs et fournisseurs",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Trituration, raffinage et fabrication alimentaire",
            "Normes sanitaires et conditionnement",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Scénarios de transport et de stockage",
            "Marchés alimentaires et industriels régionaux",
          ],
        },
      ],
      enablingLayers: [
        "Qualification et confiance",
        "Normes et traçabilité",
        "Financement et structuration du risque",
        "Logistique et corridors",
      ],
      publicScope: [
        "Le concept du parcours et ses étapes de valeur partagée",
        "Les catégories de partenaires et capacités recherchées",
        "Les plateformes liées au parcours",
      ],
      verificationScope: [
        "Tout volume, prix ou scénario de transport spécifique",
        "Faisabilité, financement et structures d'écoulement pour un cas donné",
      ],
      limitations: [
        "Aucun volume, prix, tarif, délai ou marge n'est indiqué ni sous-entendu.",
        "Aucun acheteur, financeur ou logisticien n'est confirmé.",
        "Il s'agit d'un scénario à étudier, soumis à une revue commerciale et réglementaire actuelle.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle dans la chaîne des oléagineux",
        "La capacité que vous apporteriez — offre, transformation, écoulement ou financement",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "supply-offtake-requirement",
      },
    },

    {
      id: "food-cold-chain",
      name: "Parcours transformation alimentaire et chaîne du froid",
      shortName: "Alimentaire et chaîne du froid",
      category: "Fabrication et conservation alimentaires",
      summary:
        "Un parcours potentiel menant les matières premières alimentaires soudanaises (fruits, légumes) de la stérilisation à la transformation, au conditionnement et au stockage réfrigéré, vers les marchés régionaux — en réduisant les pertes et en ajoutant une valeur stable.",
      scenarioStatus: "public-pathway-overview",
      sourceBasis:
        "Référentiel de chaîne de valeur approuvé d'Akanil et cadre de sécurité alimentaire",
      lastReviewed: "Juillet 2026",
      problem:
        "La production alimentaire périssable est perdue ou vendue à faible valeur faute de stérilisation, de transformation, de conditionnement et de stockage réfrigéré près de la production.",
      opportunity:
        "Associer les matières premières alimentaires soudanaises aux capacités marocaines de fabrication et de conservation pourrait réduire les pertes et ajouter une valeur stable — un scénario à étudier, pertinent pour la sécurité alimentaire des deux pays.",
      flow: [
        {
          title: "Source et capacité soudanaises",
          role: "Fruits, légumes et matières premières alimentaires, origine documentée.",
          contribution: "Soudan — ressource et valeur d'origine.",
        },
        {
          title: "Qualification et normes",
          role: "Tests de sécurité alimentaire, classement et conformité.",
          contribution: "Partagée — confiance et traçabilité.",
        },
        {
          title: "Transformation et expertise marocaines",
          role: "Stérilisation, transformation, conditionnement et fabrication.",
          contribution: "Maroc — transformation et conservation.",
        },
        {
          title: "Financement et logistique",
          role: "Scénarios de chaîne du froid, assurance et financement au cas par cas.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Distribution régionale",
          role: "Marchés alimentaires de consommation et institutionnels de la région.",
          contribution: "Corridor — accès aux marchés.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Pertes réduites et produits stables, résultats consignés.",
          contribution: "Les deux rives — valeur de sécurité alimentaire.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours se relie aux plateformes qui qualifient l'offre, ajoutent transformation et conservation et structurent le corridor. Les relations sont des rôles d'écosystème, non des opérations confirmées.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Matières premières alimentaires et origine documentée",
            "Qualification et agrégation des producteurs",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Stérilisation, transformation et conditionnement",
            "Normes sanitaires et expertise de conservation",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Scénarios de chaîne du froid et de stockage",
            "Marchés régionaux de consommation et institutionnels",
          ],
        },
      ],
      enablingLayers: [
        "Normes et traçabilité",
        "Logistique et corridors",
        "Qualification et confiance",
        "Financement et structuration du risque",
      ],
      publicScope: [
        "Le concept du parcours et ses étapes de valeur partagée",
        "Les catégories de partenaires et capacités recherchées",
        "Les plateformes liées au parcours",
      ],
      verificationScope: [
        "Tout scénario spécifique de chaîne du froid, de volume ou de marché",
        "Faisabilité, financement et structures d'écoulement pour un cas donné",
      ],
      limitations: [
        "Aucun volume, prix, taux de perte, performance de froid ou délai n'est indiqué ni sous-entendu.",
        "Aucun acheteur, financeur ou logisticien n'est confirmé.",
        "Il s'agit d'un scénario à étudier, soumis à une revue commerciale et réglementaire actuelle.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle dans la chaîne alimentaire",
        "La capacité que vous apporteriez — offre, transformation, chaîne du froid ou financement",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "industrial-partnership",
      },
    },

    {
      id: "feed-livestock",
      name: "Parcours aliments du bétail et élevage",
      shortName: "Aliments et élevage",
      category: "Aliments pour animaux, production et transformation",
      summary:
        "Un parcours potentiel reliant le bétail et les intrants soudanais à la fabrication d'aliments, aux normes vétérinaires et à l'accès aux marchés marocains — en répartissant valeur et risque entre partenaires qualifiés.",
      scenarioStatus: "requires-current-verification",
      sourceBasis: "Référentiel de chaîne de valeur approuvé d'Akanil",
      lastReviewed: "Juillet 2026",
      problem:
        "Les chaînes de l'élevage et de l'alimentation animale sont fragmentées, avec des liens faibles entre intrants, production animale, transformation, qualité et accès documenté aux marchés.",
      opportunity:
        "Relier la capacité d'élevage soudanaise à la fabrication d'aliments, aux normes vétérinaires et à l'accès aux marchés marocains pourrait répartir plus équitablement valeur et risque — un scénario dont les structures précises nécessitent une vérification actuelle.",
      flow: [
        {
          title: "Source et capacité soudanaises",
          role: "Producteurs qualifiés et intrants d'alimentation, identité documentée.",
          contribution: "Soudan — ressource et valeur d'origine.",
        },
        {
          title: "Qualification et normes",
          role: "Spécifications, continuité, contrôles vétérinaires et conformité.",
          contribution: "Partagée — confiance et traçabilité.",
        },
        {
          title: "Transformation et expertise marocaines",
          role: "Fabrication d'aliments, normes vétérinaires et conditionnement.",
          contribution: "Maroc — transformation et normes.",
        },
        {
          title: "Financement et logistique",
          role: "Structures de paiement, assurance et corridor conçu au cas par cas.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Distribution régionale",
          role: "Demande documentée sur les marchés marocains, africains et du Golfe.",
          contribution: "Corridor — accès aux marchés.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Résultats traçables, valeur des deux côtés de la chaîne.",
          contribution: "Les deux rives — valeur conservée.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours se relie aux plateformes qui qualifient l'offre et structurent le corridor. Les relations sont des rôles d'écosystème, non des opérations confirmées.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Capacité d'élevage et intrants d'alimentation",
            "Qualification et documentation des producteurs",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Fabrication d'aliments et normes vétérinaires",
            "Expertise qualité, conditionnement et transformation",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Scénarios de transport, de stockage et d'assurance",
            "Accès aux marchés régionaux et du Golfe",
          ],
        },
      ],
      enablingLayers: [
        "Qualification et confiance",
        "Normes et traçabilité",
        "Financement et structuration du risque",
        "Logistique et corridors",
      ],
      publicScope: [
        "Le concept du parcours et ses étapes de valeur partagée",
        "Les catégories de partenaires et capacités recherchées",
      ],
      verificationScope: [
        "Scénarios actuels d'offre, de normes sanitaires et de marché",
        "Faisabilité, financement et structures d'écoulement pour un cas donné",
      ],
      limitations: [
        "Aucune taille de cheptel, volume, prix ou allégation sanitaire n'est indiqué ni sous-entendu.",
        "Aucun producteur, acheteur ou financeur n'est confirmé.",
        "Les structures précises nécessitent une revue commerciale, vétérinaire et réglementaire actuelle.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle dans la chaîne aliments et élevage",
        "La capacité que vous apporteriez — offre, transformation, normes ou financement",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "supply-offtake-requirement",
      },
    },

    {
      id: "water-energy-agritech",
      name: "Parcours eau, énergie et agritech",
      shortName: "Eau, énergie et agritech",
      category: "Irrigation, énergie renouvelable et agriculture numérique",
      summary:
        "Un parcours potentiel appariant les capacités marocaines d'irrigation, d'énergie renouvelable et d'agritech à des besoins soudanais diagnostiqués — livrées avec exploitation et formation pour que la capacité reste locale.",
      scenarioStatus: "requires-current-verification",
      sourceBasis:
        "Référentiel de chaîne de valeur approuvé d'Akanil et concept de la plateforme RWAFID",
      lastReviewed: "Juillet 2026",
      problem:
        "La productivité est limitée par les déficits d'eau, d'énergie et de savoir-faire, et les solutions sont souvent livrées sans exploitation locale ni transfert de compétences.",
      opportunity:
        "Apparier les capacités marocaines d'irrigation, d'énergie renouvelable et d'agritech à des besoins soudanais diagnostiqués — formation incluse — pourrait bâtir une capacité locale durable. Les besoins et contreparties précis nécessitent une vérification actuelle.",
      flow: [
        {
          title: "Diagnostic du besoin",
          role: "Besoins soudanais documentés en eau, énergie et agriculture.",
          contribution: "Soudan — besoin et contexte.",
        },
        {
          title: "Qualification et normes",
          role: "Vérification du site, de la faisabilité et de la contrepartie.",
          contribution: "Partagée — confiance et diligence.",
        },
        {
          title: "Solutions et expertise marocaines",
          role: "Équipements, ingénierie et agriculture numérique.",
          contribution: "Maroc — solutions et expertise.",
        },
        {
          title: "Financement et logistique",
          role: "Financement de projet et livraison structurés au cas par cas.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Exploitation et formation",
          role: "Installation, exploitation locale et transfert de compétences.",
          contribution: "Soudan — capacité conservée.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Productivité, résilience et capacité locale durable.",
          contribution: "Les deux rives — valeur durable.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours se relie aux plateformes qui diagnostiquent les besoins, fournissent des capacités et soutiennent l'exploitation. Les relations sont des rôles d'écosystème, non des opérations confirmées.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Besoins diagnostiqués en eau, énergie et agriculture",
            "Exploitation locale et compétences conservées",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Capacités d'irrigation, d'énergie renouvelable et d'agritech",
            "Ingénierie, formation et agriculture numérique",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Scénarios de livraison et de logistique de projet",
            "Échange régional de savoirs et de technologies",
          ],
        },
      ],
      enablingLayers: [
        "Technologie et données",
        "Capacité humaine et suivi",
        "Financement et structuration du risque",
        "Normes et traçabilité",
      ],
      publicScope: [
        "Le concept du parcours et ses étapes de valeur partagée",
        "Les catégories de capacités appariables aux besoins",
      ],
      verificationScope: [
        "Besoins, sites et contreparties soudanais précis",
        "Faisabilité, financement et structures de livraison pour un cas donné",
      ],
      limitations: [
        "Aucun rendement, capacité, économie ou performance n'est indiqué ni sous-entendu.",
        "Aucun site, contrepartie ou financeur n'est confirmé.",
        "Les besoins et structures précis nécessitent une vérification actuelle.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle en eau, énergie ou agritech",
        "Le besoin ou la capacité que vous souhaitez discuter",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "technology-data-partnership",
      },
    },

    {
      id: "mining-mineral-value",
      name: "Parcours mines et valorisation minérale",
      shortName: "Mines et valeur minérale",
      category: "Valorisation minérale responsable",
      summary:
        "Un parcours potentiel menant une ressource minérale soudanaise qualifiée de l'analyse et des normes aux étapes de valorisation, vers une voie de marché responsable et traçable — identité et conformité de bout en bout.",
      scenarioStatus: "regulated-or-sensitive-elements",
      sourceBasis: "Référentiel de chaîne de valeur approuvé d'Akanil",
      lastReviewed: "Juillet 2026",
      problem:
        "Les ressources minérales circulent par des voies fragmentées, parfois non documentées, la valeur étant ajoutée ailleurs et la traçabilité faible.",
      opportunity:
        "Mener une ressource minérale qualifiée de l'analyse et des normes aux étapes de valorisation vers un marché responsable et traçable pourrait élever la valeur à l'origine — strictement dans le cadre des exigences réglementaires et de diligence.",
      flow: [
        {
          title: "Qualification de la source",
          role: "Propriété, identité et documentation vérifiées d'abord.",
          contribution: "Soudan — ressource et valeur d'origine.",
        },
        {
          title: "Analyse et normes",
          role: "Essais, classification et conformité réglementaire.",
          contribution: "Partagée — confiance et conformité.",
        },
        {
          title: "Transformation et valorisation",
          role: "Étapes de valorisation avec équipements ou expertise marocains.",
          contribution: "Maroc — valeur ajoutée.",
        },
        {
          title: "Financement et logistique",
          role: "Financement structuré et évaluation documentée du risque.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Voie de marché responsable",
          role: "Acheteurs industriels qualifiés selon des règles de traçabilité.",
          contribution: "Corridor — accès aux marchés.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Des voies responsables qui élèvent la valeur à l'origine.",
          contribution: "Les deux rives — valeur conservée.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours se relie aux plateformes qui structurent le corridor et, potentiellement, une couche habilitante réglementée. Aucun service de financement ou de conservation n'est actif ni offert.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Ressource minérale à propriété vérifiée",
            "Valeur d'origine conservée par la qualification",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Équipements et expertise de valorisation",
            "Normes, essais et appui à la diligence",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Voies de marché traçables et documentées",
            "Acheteurs industriels qualifiés",
          ],
        },
      ],
      enablingLayers: [
        "Qualification et confiance",
        "Normes et traçabilité",
        "Financement et structuration du risque",
        "Logistique et corridors",
      ],
      publicScope: [
        "Le concept du parcours et ses étapes responsables et traçables",
        "Les principes de qualification et de conformité appliqués",
      ],
      verificationScope: [
        "Toute ressource, propriété ou scénario de marché spécifique",
        "Structures réglementaires, de diligence et de financement pour un cas donné",
      ],
      limitations: [
        "Aucune réserve, teneur, volume, prix ou rendement n'est indiqué ni sous-entendu.",
        "Aucune ressource, acheteur, financeur ou arrangement de conservation n'est confirmé.",
        "Pas de flux anonymes : identité, conformité et traçabilité sont des prérequis.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle, et la nature de la ressource ou capacité",
        "Le statut de propriété, de licence et de documentation démontrable dans un processus contrôlé",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "submit-project-asset",
      },
      regulatoryNote:
        "Les chaînes de valeur minérales sont réglementées et sensibles. Tout parcours est strictement soumis à la vérification de la propriété, à la licence, à la conformité et à la traçabilité, ainsi qu'à une revue réglementaire actuelle. La réception d'une demande n'est pas une acceptation, et aucun financement, conservation ou convertibilité n'est offert.",
    },

    {
      id: "ports-logistics-corridors",
      name: "Parcours ports, logistique et corridors",
      shortName: "Ports et logistique",
      category: "Conception de corridors et coordination des chaînes",
      summary:
        "Un parcours potentiel structurant la circulation des produits qualifiés entre régions de production, ports, zones économiques et marchés de l'espace de la mer Rouge — la couche connective sous les cinq autres parcours.",
      scenarioStatus: "requires-current-verification",
      sourceBasis:
        "Référentiel de chaîne de valeur approuvé d'Akanil et architecture de corridor Trade-Chain Africa",
      lastReviewed: "Juillet 2026",
      problem:
        "La production atteint les marchés de la mer Rouge et internationaux par des voies fragmentées et non documentées, aux normes, au stockage et à la coordination flous.",
      opportunity:
        "Concevoir des scénarios de corridor et coordonner des parties prenantes qualifiées — ports, zones, stockage et documentation — pourrait rendre les autres parcours exécutables. Les itinéraires présentés sont conceptuels et nécessitent une vérification actuelle.",
      flow: [
        {
          title: "Origine et qualification",
          role: "Régions de production qualifiées et expéditions documentées.",
          contribution: "Soudan — origine et préparation.",
        },
        {
          title: "Normes et documentation",
          role: "Préparation des douanes, des normes et de la documentation.",
          contribution: "Partagée — confiance et conformité.",
        },
        {
          title: "Conception du corridor et des nœuds",
          role: "Scénarios d'itinéraire, de port, de zone et de stockage étudiés au cas par cas.",
          contribution: "Corridor — conception connective.",
        },
        {
          title: "Financement et coordination",
          role: "Assurance, risque et coordination des parties prenantes qualifiées.",
          contribution: "Partagée — structuration, au cas par cas.",
        },
        {
          title: "Accès aux marchés",
          role: "Nœuds de fabrication marocains et marchés internationaux.",
          contribution: "Maroc / corridor — accès aux marchés.",
        },
        {
          title: "Valeur partagée mesurable",
          role: "Mouvement documenté et coordonné, valeur des deux côtés.",
          contribution: "Les deux rives — valeur rendue possible.",
        },
      ],
      relatedPlatformsNote:
        "Ce parcours est la couche corridor sous les autres parcours, reliée aux plateformes qui structurent les itinéraires et, potentiellement, une couche habilitante réglementée. Les corridors sont conceptuels, non opérationnels.",
      geographicContribution: [
        {
          title: "Soudan",
          items: [
            "Régions de production et expéditions documentées",
            "Préparation et qualification à l'origine",
          ],
        },
        {
          title: "Maroc",
          items: [
            "Nœuds de fabrication et d'accès aux marchés",
            "Expertise en normes et documentation",
          ],
        },
        {
          title: "Corridor de la mer Rouge",
          items: [
            "Scénarios de ports, de zones économiques et de stockage",
            "Coordination des parties prenantes qualifiées",
          ],
        },
      ],
      enablingLayers: [
        "Logistique et corridors",
        "Normes et traçabilité",
        "Technologie et données",
        "Financement et structuration du risque",
      ],
      publicScope: [
        "Le concept de conception de corridor et ses étapes de coordination",
        "Les catégories de nœuds et de parties prenantes concernées",
      ],
      verificationScope: [
        "Tout itinéraire, port, stockage ou scénario de délai spécifique",
        "Structures de normes, d'assurance et de coordination pour un cas donné",
      ],
      limitations: [
        "Aucun itinéraire n'est opérationnel, et aucun délai, tarif, capacité ou coût n'est indiqué ni sous-entendu.",
        "Aucun port, zone, transporteur ou autorité n'est présenté comme partenaire confirmé.",
        "Les visuels de corridor sont conceptuels et nécessitent une revue logistique et réglementaire actuelle.",
      ],
      preparationRequirements: [
        "Le profil de votre organisation et votre rôle dans les ports, la logistique ou le commerce",
        "Le besoin ou la capacité de corridor que vous souhaitez discuter",
      ],
      cta: {
        label: "Discuter de ce parcours",
        requestType: "port-logistics-cooperation",
      },
    },
  ],
};
