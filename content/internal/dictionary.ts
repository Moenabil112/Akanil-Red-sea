import type { Locale } from "@/content/types";

/**
 * Internal (employee-only) UI strings for the three supported locales
 * (P4-A §2). Arabic is native RTL. These strings are separate from the
 * public content and never appear on the public site.
 */
export interface InternalDict {
  appName: string;
  restricted: string;
  nav: {
    dashboard: string;
    cases: string;
    organizations: string;
    work: string;
    audit: string;
    users: string;
    newCase: string;
    logout: string;
    signedInAs: string;
  };
  login: {
    title: string;
    lead: string;
    email: string;
    password: string;
    submit: string;
    error: string;
    noSelfSignup: string;
  };
  changePassword: {
    title: string;
    lead: string;
    current: string;
    next: string;
    confirm: string;
    submit: string;
    policy: string;
    mismatch: string;
    invalidCurrent: string;
    weak: string;
  };
  denied: { title: string; body: string };
  dashboard: {
    title: string;
    myCases: string;
    newCases: string;
    awaitingQualification: string;
    openGaps: string;
    decisionsPending: string;
    commitmentsDue: string;
    recentlyUpdated: string;
  };
  cases: {
    title: string;
    reference: string;
    caseTitle: string;
    status: string;
    priority: string;
    classification: string;
    owner: string;
    organization: string;
    requestType: string;
    updated: string;
    search: string;
    filter: string;
    none: string;
    create: string;
    summary: string;
    source: string;
    save: string;
    sensitiveWarning: string;
    confirmChannel: string;
  };
  detail: {
    overview: string;
    context: string;
    qualification: string;
    assignments: string;
    notes: string;
    gaps: string;
    evidence: string;
    meetingPrep: string;
    meetingRecords: string;
    decisions: string;
    commitments: string;
    auditSummary: string;
    changeStatus: string;
    closureReason: string;
    addNote: string;
    noteBody: string;
    reassignOwner: string;
    recommend: string;
    approve: string;
    propose: string;
    resolve: string;
    add: string;
    conflict: string;
  };
  organizations: {
    title: string;
    workingName: string;
    country: string;
    verification: string;
    relatedCases: string;
    contacts: string;
    create: string;
    archive: string;
  };
  work: {
    title: string;
    assignedCases: string;
    myGaps: string;
    myCommitments: string;
    overdue: string;
    pendingDecisions: string;
  };
  audit: {
    title: string;
    when: string;
    actor: string;
    action: string;
    entity: string;
    summary: string;
    appendOnly: string;
  };
  users: {
    title: string;
    email: string;
    name: string;
    role: string;
    status: string;
    lastLogin: string;
    mustChange: string;
    adminOnly: string;
    noExternal: string;
  };
  privacyNote: string;
}

const en: InternalDict = {
  appName: "Akanil internal operations",
  restricted: "Restricted — authorized Akanil employees only.",
  nav: {
    dashboard: "Dashboard",
    cases: "Cases",
    organizations: "Organizations",
    work: "My work",
    audit: "Audit",
    users: "Users",
    newCase: "New case",
    logout: "Sign out",
    signedInAs: "Signed in as",
  },
  login: {
    title: "Employee sign-in",
    lead: "Authorized Akanil employees only. Accounts are provisioned by an administrator.",
    email: "Work email",
    password: "Password",
    submit: "Sign in",
    error: "Invalid email or password.",
    noSelfSignup: "There is no self-registration. Contact an administrator for access.",
  },
  changePassword: {
    title: "Set a new password",
    lead: "You must set a new password before continuing.",
    current: "Current password",
    next: "New password",
    confirm: "Confirm new password",
    submit: "Update password",
    policy: "At least 14 characters.",
    mismatch: "The new passwords do not match.",
    invalidCurrent: "Current password is incorrect.",
    weak: "The new password does not meet the policy.",
  },
  denied: {
    title: "Access denied",
    body: "Your role does not permit this operation.",
  },
  dashboard: {
    title: "Operational dashboard",
    myCases: "My open cases",
    newCases: "New cases",
    awaitingQualification: "Awaiting qualification",
    openGaps: "Open information gaps",
    decisionsPending: "Decisions pending",
    commitmentsDue: "Commitments due or overdue",
    recentlyUpdated: "Recently updated cases",
  },
  cases: {
    title: "Cases",
    reference: "Reference",
    caseTitle: "Title",
    status: "Status",
    priority: "Priority",
    classification: "Classification",
    owner: "Owner",
    organization: "Organization",
    requestType: "Request type",
    updated: "Updated",
    search: "Search reference, title or organization",
    filter: "Filter",
    none: "No cases match.",
    create: "Create case",
    summary: "Concise internal summary",
    source: "Source",
    save: "Create case",
    sensitiveWarning:
      "Do not copy unnecessary sensitive personal data, secrets or complete confidential documents.",
    confirmChannel: "I confirm this information was received through an authorized channel.",
  },
  detail: {
    overview: "Overview",
    context: "Context",
    qualification: "Qualification",
    assignments: "Assignments",
    notes: "Internal notes",
    gaps: "Information gaps",
    evidence: "Evidence references",
    meetingPrep: "Meeting preparation",
    meetingRecords: "Meeting records",
    decisions: "Decisions",
    commitments: "Commitments",
    auditSummary: "Audit summary",
    changeStatus: "Change status",
    closureReason: "Closure reason",
    addNote: "Add internal note",
    noteBody: "Note (do not paste secrets or full confidential documents)",
    reassignOwner: "Reassign owner",
    recommend: "Submit recommendation",
    approve: "Approve",
    propose: "Propose decision",
    resolve: "Resolve",
    add: "Add",
    conflict: "This record changed since you loaded it. Reload and review before saving.",
  },
  organizations: {
    title: "Organizations",
    workingName: "Working name",
    country: "Country",
    verification: "Verification",
    relatedCases: "Related cases",
    contacts: "Professional contacts",
    create: "Create organization",
    archive: "Archive",
  },
  work: {
    title: "My work queue",
    assignedCases: "Assigned cases",
    myGaps: "My information gaps",
    myCommitments: "My commitments",
    overdue: "Overdue commitments",
    pendingDecisions: "Decisions awaiting approval",
  },
  audit: {
    title: "Audit trail",
    when: "When",
    actor: "Actor",
    action: "Action",
    entity: "Entity",
    summary: "Summary",
    appendOnly: "The audit trail is append-only and cannot be edited or deleted.",
  },
  users: {
    title: "User administration",
    email: "Email",
    name: "Name",
    role: "Role",
    status: "Status",
    lastLogin: "Last login",
    mustChange: "Must change password",
    adminOnly: "Account creation and password reset are administrative operations.",
    noExternal: "No external invitations. No self-registration.",
  },
  privacyNote:
    "Collect only professional operational data. No participant directory, no external accounts, no uploads.",
};

const fr: InternalDict = {
  appName: "Opérations internes Akanil",
  restricted: "Restreint — employés autorisés d'Akanil uniquement.",
  nav: {
    dashboard: "Tableau de bord",
    cases: "Dossiers",
    organizations: "Organisations",
    work: "Mon travail",
    audit: "Audit",
    users: "Utilisateurs",
    newCase: "Nouveau dossier",
    logout: "Se déconnecter",
    signedInAs: "Connecté en tant que",
  },
  login: {
    title: "Connexion employé",
    lead: "Employés autorisés d'Akanil uniquement. Les comptes sont créés par un administrateur.",
    email: "Courriel professionnel",
    password: "Mot de passe",
    submit: "Se connecter",
    error: "Courriel ou mot de passe invalide.",
    noSelfSignup: "Aucune auto-inscription. Contactez un administrateur pour un accès.",
  },
  changePassword: {
    title: "Définir un nouveau mot de passe",
    lead: "Vous devez définir un nouveau mot de passe avant de continuer.",
    current: "Mot de passe actuel",
    next: "Nouveau mot de passe",
    confirm: "Confirmer le nouveau mot de passe",
    submit: "Mettre à jour",
    policy: "Au moins 14 caractères.",
    mismatch: "Les nouveaux mots de passe ne correspondent pas.",
    invalidCurrent: "Le mot de passe actuel est incorrect.",
    weak: "Le nouveau mot de passe ne respecte pas la politique.",
  },
  denied: {
    title: "Accès refusé",
    body: "Votre rôle n'autorise pas cette opération.",
  },
  dashboard: {
    title: "Tableau de bord opérationnel",
    myCases: "Mes dossiers ouverts",
    newCases: "Nouveaux dossiers",
    awaitingQualification: "En attente de qualification",
    openGaps: "Lacunes d'information ouvertes",
    decisionsPending: "Décisions en attente",
    commitmentsDue: "Engagements à échéance ou en retard",
    recentlyUpdated: "Dossiers récemment mis à jour",
  },
  cases: {
    title: "Dossiers",
    reference: "Référence",
    caseTitle: "Titre",
    status: "Statut",
    priority: "Priorité",
    classification: "Classification",
    owner: "Responsable",
    organization: "Organisation",
    requestType: "Type de demande",
    updated: "Mis à jour",
    search: "Rechercher référence, titre ou organisation",
    filter: "Filtrer",
    none: "Aucun dossier correspondant.",
    create: "Créer un dossier",
    summary: "Résumé interne concis",
    source: "Source",
    save: "Créer le dossier",
    sensitiveWarning:
      "Ne copiez pas de données personnelles sensibles inutiles, de secrets ou de documents confidentiels complets.",
    confirmChannel: "Je confirme que cette information provient d'un canal autorisé.",
  },
  detail: {
    overview: "Aperçu",
    context: "Contexte",
    qualification: "Qualification",
    assignments: "Affectations",
    notes: "Notes internes",
    gaps: "Lacunes d'information",
    evidence: "Références de preuve",
    meetingPrep: "Préparation de réunion",
    meetingRecords: "Comptes rendus de réunion",
    decisions: "Décisions",
    commitments: "Engagements",
    auditSummary: "Résumé d'audit",
    changeStatus: "Changer le statut",
    closureReason: "Motif de clôture",
    addNote: "Ajouter une note interne",
    noteBody: "Note (ne collez pas de secrets ni de documents confidentiels complets)",
    reassignOwner: "Réaffecter le responsable",
    recommend: "Soumettre une recommandation",
    approve: "Approuver",
    propose: "Proposer une décision",
    resolve: "Résoudre",
    add: "Ajouter",
    conflict: "Cet enregistrement a changé depuis son chargement. Rechargez avant d'enregistrer.",
  },
  organizations: {
    title: "Organisations",
    workingName: "Nom d'usage",
    country: "Pays",
    verification: "Vérification",
    relatedCases: "Dossiers liés",
    contacts: "Contacts professionnels",
    create: "Créer une organisation",
    archive: "Archiver",
  },
  work: {
    title: "Ma file de travail",
    assignedCases: "Dossiers assignés",
    myGaps: "Mes lacunes d'information",
    myCommitments: "Mes engagements",
    overdue: "Engagements en retard",
    pendingDecisions: "Décisions en attente d'approbation",
  },
  audit: {
    title: "Journal d'audit",
    when: "Quand",
    actor: "Acteur",
    action: "Action",
    entity: "Entité",
    summary: "Résumé",
    appendOnly: "Le journal d'audit est en ajout seul et ne peut être modifié ou supprimé.",
  },
  users: {
    title: "Administration des utilisateurs",
    email: "Courriel",
    name: "Nom",
    role: "Rôle",
    status: "Statut",
    lastLogin: "Dernière connexion",
    mustChange: "Doit changer le mot de passe",
    adminOnly: "La création de compte et la réinitialisation sont des opérations administratives.",
    noExternal: "Aucune invitation externe. Aucune auto-inscription.",
  },
  privacyNote:
    "Ne collectez que des données opérationnelles professionnelles. Pas d'annuaire de participants, pas de comptes externes, pas de téléversements.",
};

const ar: InternalDict = {
  appName: "العمليات الداخلية لأكانيل",
  restricted: "مقيَّد — موظفو أكانيل المخوَّلون فقط.",
  nav: {
    dashboard: "لوحة التحكم",
    cases: "الحالات",
    organizations: "المنظمات",
    work: "عملي",
    audit: "التدقيق",
    users: "المستخدمون",
    newCase: "حالة جديدة",
    logout: "تسجيل الخروج",
    signedInAs: "مسجَّل الدخول باسم",
  },
  login: {
    title: "دخول الموظفين",
    lead: "موظفو أكانيل المخوَّلون فقط. تُنشأ الحسابات بواسطة مسؤول.",
    email: "البريد المهني",
    password: "كلمة المرور",
    submit: "تسجيل الدخول",
    error: "بريد أو كلمة مرور غير صحيحة.",
    noSelfSignup: "لا تسجيل ذاتي. اتصل بالمسؤول للحصول على وصول.",
  },
  changePassword: {
    title: "تعيين كلمة مرور جديدة",
    lead: "يجب تعيين كلمة مرور جديدة قبل المتابعة.",
    current: "كلمة المرور الحالية",
    next: "كلمة المرور الجديدة",
    confirm: "تأكيد كلمة المرور الجديدة",
    submit: "تحديث كلمة المرور",
    policy: "14 حرفاً على الأقل.",
    mismatch: "كلمتا المرور الجديدتان غير متطابقتين.",
    invalidCurrent: "كلمة المرور الحالية غير صحيحة.",
    weak: "كلمة المرور الجديدة لا تفي بالسياسة.",
  },
  denied: {
    title: "تم رفض الوصول",
    body: "لا يسمح دورك بهذه العملية.",
  },
  dashboard: {
    title: "لوحة التحكم التشغيلية",
    myCases: "حالاتي المفتوحة",
    newCases: "حالات جديدة",
    awaitingQualification: "بانتظار التأهيل",
    openGaps: "فجوات معلومات مفتوحة",
    decisionsPending: "قرارات معلَّقة",
    commitmentsDue: "التزامات مستحقة أو متأخرة",
    recentlyUpdated: "حالات محدَّثة حديثاً",
  },
  cases: {
    title: "الحالات",
    reference: "المرجع",
    caseTitle: "العنوان",
    status: "الحالة",
    priority: "الأولوية",
    classification: "التصنيف",
    owner: "المالك",
    organization: "المنظمة",
    requestType: "نوع الطلب",
    updated: "آخر تحديث",
    search: "ابحث بالمرجع أو العنوان أو المنظمة",
    filter: "تصفية",
    none: "لا حالات مطابقة.",
    create: "إنشاء حالة",
    summary: "ملخص داخلي موجز",
    source: "المصدر",
    save: "إنشاء الحالة",
    sensitiveWarning:
      "لا تنسخ بيانات شخصية حساسة غير ضرورية أو أسراراً أو مستندات سرية كاملة.",
    confirmChannel: "أؤكد أن هذه المعلومات وردت عبر قناة مخوَّلة.",
  },
  detail: {
    overview: "نظرة عامة",
    context: "السياق",
    qualification: "التأهيل",
    assignments: "الإسنادات",
    notes: "ملاحظات داخلية",
    gaps: "فجوات المعلومات",
    evidence: "مراجع الأدلة",
    meetingPrep: "إعداد الاجتماع",
    meetingRecords: "محاضر الاجتماعات",
    decisions: "القرارات",
    commitments: "الالتزامات",
    auditSummary: "ملخص التدقيق",
    changeStatus: "تغيير الحالة",
    closureReason: "سبب الإغلاق",
    addNote: "إضافة ملاحظة داخلية",
    noteBody: "ملاحظة (لا تلصق أسراراً أو مستندات سرية كاملة)",
    reassignOwner: "إعادة إسناد المالك",
    recommend: "تقديم توصية",
    approve: "اعتماد",
    propose: "اقتراح قرار",
    resolve: "حسم",
    add: "إضافة",
    conflict: "تغيّر هذا السجل منذ تحميله. أعد التحميل والمراجعة قبل الحفظ.",
  },
  organizations: {
    title: "المنظمات",
    workingName: "الاسم المتداول",
    country: "البلد",
    verification: "التحقق",
    relatedCases: "الحالات المرتبطة",
    contacts: "جهات الاتصال المهنية",
    create: "إنشاء منظمة",
    archive: "أرشفة",
  },
  work: {
    title: "قائمة عملي",
    assignedCases: "الحالات المسنَدة",
    myGaps: "فجوات معلوماتي",
    myCommitments: "التزاماتي",
    overdue: "التزامات متأخرة",
    pendingDecisions: "قرارات بانتظار الاعتماد",
  },
  audit: {
    title: "سجل التدقيق",
    when: "متى",
    actor: "الفاعل",
    action: "الإجراء",
    entity: "الكيان",
    summary: "الملخص",
    appendOnly: "سجل التدقيق للإضافة فقط ولا يمكن تعديله أو حذفه.",
  },
  users: {
    title: "إدارة المستخدمين",
    email: "البريد",
    name: "الاسم",
    role: "الدور",
    status: "الحالة",
    lastLogin: "آخر دخول",
    mustChange: "يجب تغيير كلمة المرور",
    adminOnly: "إنشاء الحساب وإعادة تعيين كلمة المرور عمليتان إداريتان.",
    noExternal: "لا دعوات خارجية. لا تسجيل ذاتي.",
  },
  privacyNote:
    "اجمع فقط البيانات التشغيلية المهنية. لا دليل مشاركين، ولا حسابات خارجية، ولا رفع ملفات.",
};

const DICTS: Record<Locale, InternalDict> = { ar, fr, en };

export function getInternalDict(locale: Locale): InternalDict {
  return DICTS[locale];
}
