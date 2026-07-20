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
  p4b: P4bDict;
}

/** P4-B pilot / security-hardening UI strings (§27, trilingual). */
export interface P4bDict {
  nav: { readiness: string; security: string };
  banner: { validation: string; pilot: string; suspended: string };
  stepUp: { title: string; lead: string; password: string; submit: string; error: string };
  suspended: { title: string; body: string };
  readiness: {
    title: string;
    lead: string;
    gate: string;
    area: string;
    status: string;
    detail: string;
    setGate: string;
    rationale: string;
    state: string;
    decide: string;
    accessLink: string;
    exercisesLink: string;
    recoveryLink: string;
    notProductionReady: string;
  };
  access: {
    title: string;
    cohort: string;
    requestPilot: string;
    employee: string;
    role: string;
    justification: string;
    approve: string;
    suspend: string;
    revoke: string;
    reason: string;
    days: string;
    changes: string;
    changeType: string;
    proposedRole: string;
    propose: string;
    apply: string;
    reject: string;
    reviews: string;
    openReview: string;
    outcome: string;
    conduct: string;
    lifecycle: string;
    offboard: string;
    complete: string;
    sessions: string;
    revokeSession: string;
    revokeAll: string;
    signOutOthers: string;
    device: string;
    lastActivity: string;
    expires: string;
    twoPersonNote: string;
  };
  security: {
    title: string;
    events: string;
    category: string;
    severity: string;
    status: string;
    acknowledge: string;
    resolve: string;
    resolution: string;
    incidents: string;
    newIncident: string;
    reference: string;
    summary: string;
    affected: string;
    open: string;
    transition: string;
    close: string;
    lessons: string;
    containment: string;
    evidence: string;
    recovery: string;
    internalOnly: string;
  };
  exercises: {
    title: string;
    type: string;
    expected: string;
    plan: string;
    start: string;
    record: string;
    result: string;
    actual: string;
    deviation: string;
    evidence: string;
    approve: string;
    corrective: string;
    verify: string;
    acceptRisk: string;
    syntheticOnly: string;
  };
  recovery: {
    title: string;
    lead: string;
    backupRecency: string;
    restoreTest: string;
    note: string;
  };
  common: { none: string; save: string; conflict: string; minimizationWarning: string };
  areaLabels: Record<string, string>;
  gateStates: Record<string, string>;
}

const AREA_LABELS_EN: Record<string, string> = {
  "pilot-cohort": "Pilot cohort",
  "access-approvals": "Access approvals",
  "overdue-access-reviews": "Overdue access reviews",
  "employee-offboarding-readiness": "Employee offboarding readiness",
  "audit-chain-verification": "Audit-chain verification",
  "unresolved-security-events": "Unresolved security events",
  "open-incidents": "Open incidents",
  "failed-or-blocked-exercises": "Failed or blocked exercises",
  "open-corrective-actions": "Open corrective actions",
  "database-migration-status": "Database migration status",
  "authentication-control-tests": "Authentication control tests",
  "authorization-control-tests": "Authorization control tests",
  "backup-recency": "Backup recency",
  "last-restore-test": "Last restore-test result",
  "public-internal-boundary": "Public / internal boundary",
  "secret-scan": "Secret-scan result",
  accessibility: "Accessibility result",
  "public-regression": "Public regression result",
};

const GATE_STATES_EN: Record<string, string> = {
  NOT_READY: "Not ready",
  READY_FOR_LIMITED_INTERNAL_PILOT: "Ready for limited internal pilot",
  LIMITED_INTERNAL_PILOT_ACTIVE: "Limited internal pilot active",
  PILOT_SUSPENDED: "Pilot suspended",
  PILOT_COMPLETED_PENDING_REVIEW: "Pilot completed, pending review",
};

const p4bEn: P4bDict = {
  nav: { readiness: "Readiness", security: "Security" },
  banner: {
    validation: "Validation mode — synthetic or de-identified data only. Not real operational use.",
    pilot: "Internal pilot mode — authorized Akanil employees only.",
    suspended: "Pilot suspended — internal operations are stopped. The public Gateway is unaffected.",
  },
  stepUp: {
    title: "Confirm your identity",
    lead: "This sensitive action requires you to re-enter your password.",
    password: "Password",
    submit: "Confirm",
    error: "Reauthentication failed.",
  },
  suspended: {
    title: "Internal pilot suspended",
    body: "The internal pilot is suspended. Operational data and mutations are unavailable. The public Gateway and Digital Reception Lite continue to operate normally.",
  },
  readiness: {
    title: "Pilot readiness",
    lead: "Controlled readiness areas. No overall score; a limited pilot is a human decision.",
    gate: "Readiness gate",
    area: "Area",
    status: "Status",
    detail: "Detail",
    setGate: "Record a gate decision",
    rationale: "Rationale",
    state: "Gate state",
    decide: "Record decision",
    accessLink: "Access & cohort",
    exercisesLink: "Exercises & corrective actions",
    recoveryLink: "Backup & recovery",
    notProductionReady: "This is a readiness view for a limited internal pilot. It is not a production-readiness certification.",
  },
  access: {
    title: "Pilot access, changes and reviews",
    cohort: "Pilot cohort",
    requestPilot: "Request pilot access",
    employee: "Employee",
    role: "Role",
    justification: "Justification",
    approve: "Approve",
    suspend: "Suspend",
    revoke: "Revoke",
    reason: "Reason",
    days: "Days",
    changes: "Access-change requests",
    changeType: "Change type",
    proposedRole: "Proposed role",
    propose: "Request change",
    apply: "Apply",
    reject: "Reject",
    reviews: "Access reviews",
    openReview: "Open review",
    outcome: "Outcome",
    conduct: "Record review",
    lifecycle: "Employee lifecycle",
    offboard: "Begin offboarding",
    complete: "Complete offboarding",
    sessions: "Active sessions",
    revokeSession: "Revoke",
    revokeAll: "Revoke all",
    signOutOthers: "Sign out my other sessions",
    device: "Device",
    lastActivity: "Last activity",
    expires: "Expires",
    twoPersonNote: "A requester can never approve their own request; a target can never approve their own change.",
  },
  security: {
    title: "Security events",
    events: "Events",
    category: "Category",
    severity: "Severity",
    status: "Status",
    acknowledge: "Acknowledge",
    resolve: "Resolve",
    resolution: "Resolution",
    incidents: "Incidents",
    newIncident: "Open incident",
    reference: "Reference",
    summary: "Summary",
    affected: "Affected areas",
    open: "Open",
    transition: "Move to",
    close: "Close incident",
    lessons: "Lessons learned",
    containment: "Containment actions",
    evidence: "Evidence notes",
    recovery: "Recovery actions",
    internalOnly: "Internal use only. No external notification is sent and no legal-breach determination is made.",
  },
  exercises: {
    title: "Pilot exercises",
    type: "Type",
    expected: "Expected result",
    plan: "Plan exercise",
    start: "Start",
    record: "Record result",
    result: "Result",
    actual: "Actual result",
    deviation: "Deviation",
    evidence: "Evidence summary",
    approve: "Approve",
    corrective: "Corrective actions",
    verify: "Verify",
    acceptRisk: "Accept risk",
    syntheticOnly: "Exercises use synthetic or de-identified data only. No real credentials are recorded.",
  },
  recovery: {
    title: "Backup & recovery validation",
    lead: "Local backup and restore verification signals. Backups are never committed and never contain real data.",
    backupRecency: "Backup recency",
    restoreTest: "Restore-test result",
    note: "Operational backups must be encrypted outside the repository before any future live deployment.",
  },
  common: {
    none: "Nothing to show.",
    save: "Save",
    conflict: "This record changed since you loaded it. Reload and retry.",
    minimizationWarning: "Data minimization: enter synthetic or approved de-identified data only. Never enter real personal, confidential, banking, government-identity, password or secret data.",
  },
  areaLabels: AREA_LABELS_EN,
  gateStates: GATE_STATES_EN,
};

const p4bFr: P4bDict = {
  nav: { readiness: "Préparation", security: "Sécurité" },
  banner: {
    validation: "Mode validation — données synthétiques ou anonymisées uniquement. Pas d'usage opérationnel réel.",
    pilot: "Mode pilote interne — employés autorisés d'Akanil uniquement.",
    suspended: "Pilote suspendu — les opérations internes sont arrêtées. La passerelle publique n'est pas affectée.",
  },
  stepUp: {
    title: "Confirmez votre identité",
    lead: "Cette action sensible exige de saisir à nouveau votre mot de passe.",
    password: "Mot de passe",
    submit: "Confirmer",
    error: "Échec de la ré-authentification.",
  },
  suspended: {
    title: "Pilote interne suspendu",
    body: "Le pilote interne est suspendu. Les données opérationnelles et les modifications sont indisponibles. La passerelle publique et la réception numérique continuent de fonctionner normalement.",
  },
  readiness: {
    title: "Préparation du pilote",
    lead: "Domaines de préparation contrôlés. Aucun score global ; un pilote limité est une décision humaine.",
    gate: "Porte de préparation",
    area: "Domaine",
    status: "Statut",
    detail: "Détail",
    setGate: "Enregistrer une décision de porte",
    rationale: "Justification",
    state: "État de la porte",
    decide: "Enregistrer la décision",
    accessLink: "Accès et cohorte",
    exercisesLink: "Exercices et actions correctives",
    recoveryLink: "Sauvegarde et restauration",
    notProductionReady: "Ceci est une vue de préparation pour un pilote interne limité. Ce n'est pas une certification de mise en production.",
  },
  access: {
    title: "Accès pilote, changements et revues",
    cohort: "Cohorte pilote",
    requestPilot: "Demander l'accès pilote",
    employee: "Employé",
    role: "Rôle",
    justification: "Justification",
    approve: "Approuver",
    suspend: "Suspendre",
    revoke: "Révoquer",
    reason: "Motif",
    days: "Jours",
    changes: "Demandes de changement d'accès",
    changeType: "Type de changement",
    proposedRole: "Rôle proposé",
    propose: "Demander un changement",
    apply: "Appliquer",
    reject: "Rejeter",
    reviews: "Revues d'accès",
    openReview: "Ouvrir une revue",
    outcome: "Résultat",
    conduct: "Enregistrer la revue",
    lifecycle: "Cycle de vie de l'employé",
    offboard: "Commencer le départ",
    complete: "Terminer le départ",
    sessions: "Sessions actives",
    revokeSession: "Révoquer",
    revokeAll: "Tout révoquer",
    signOutOthers: "Déconnecter mes autres sessions",
    device: "Appareil",
    lastActivity: "Dernière activité",
    expires: "Expire",
    twoPersonNote: "Un demandeur ne peut jamais approuver sa propre demande ; une cible ne peut jamais approuver son propre changement.",
  },
  security: {
    title: "Événements de sécurité",
    events: "Événements",
    category: "Catégorie",
    severity: "Gravité",
    status: "Statut",
    acknowledge: "Accuser réception",
    resolve: "Résoudre",
    resolution: "Résolution",
    incidents: "Incidents",
    newIncident: "Ouvrir un incident",
    reference: "Référence",
    summary: "Résumé",
    affected: "Zones affectées",
    open: "Ouvrir",
    transition: "Passer à",
    close: "Clore l'incident",
    lessons: "Enseignements tirés",
    containment: "Actions de confinement",
    evidence: "Notes de preuve",
    recovery: "Actions de récupération",
    internalOnly: "Usage interne uniquement. Aucune notification externe n'est envoyée et aucune détermination légale de violation n'est faite.",
  },
  exercises: {
    title: "Exercices du pilote",
    type: "Type",
    expected: "Résultat attendu",
    plan: "Planifier l'exercice",
    start: "Démarrer",
    record: "Enregistrer le résultat",
    result: "Résultat",
    actual: "Résultat réel",
    deviation: "Écart",
    evidence: "Résumé des preuves",
    approve: "Approuver",
    corrective: "Actions correctives",
    verify: "Vérifier",
    acceptRisk: "Accepter le risque",
    syntheticOnly: "Les exercices utilisent uniquement des données synthétiques ou anonymisées. Aucun identifiant réel n'est enregistré.",
  },
  recovery: {
    title: "Validation sauvegarde et restauration",
    lead: "Signaux locaux de vérification de sauvegarde et de restauration. Les sauvegardes ne sont jamais versionnées et ne contiennent jamais de données réelles.",
    backupRecency: "Récence de la sauvegarde",
    restoreTest: "Résultat du test de restauration",
    note: "Les sauvegardes opérationnelles doivent être chiffrées en dehors du dépôt avant tout déploiement réel futur.",
  },
  common: {
    none: "Rien à afficher.",
    save: "Enregistrer",
    conflict: "Cet enregistrement a changé depuis son chargement. Rechargez et réessayez.",
    minimizationWarning: "Minimisation des données : saisissez uniquement des données synthétiques ou anonymisées approuvées. Ne saisissez jamais de données réelles personnelles, confidentielles, bancaires, d'identité gouvernementale, de mot de passe ou de secret.",
  },
  areaLabels: {
    "pilot-cohort": "Cohorte pilote",
    "access-approvals": "Approbations d'accès",
    "overdue-access-reviews": "Revues d'accès en retard",
    "employee-offboarding-readiness": "Préparation au départ des employés",
    "audit-chain-verification": "Vérification de la chaîne d'audit",
    "unresolved-security-events": "Événements de sécurité non résolus",
    "open-incidents": "Incidents ouverts",
    "failed-or-blocked-exercises": "Exercices échoués ou bloqués",
    "open-corrective-actions": "Actions correctives ouvertes",
    "database-migration-status": "État des migrations de base de données",
    "authentication-control-tests": "Tests des contrôles d'authentification",
    "authorization-control-tests": "Tests des contrôles d'autorisation",
    "backup-recency": "Récence de la sauvegarde",
    "last-restore-test": "Dernier test de restauration",
    "public-internal-boundary": "Frontière public / interne",
    "secret-scan": "Analyse des secrets",
    accessibility: "Résultat d'accessibilité",
    "public-regression": "Résultat de régression publique",
  },
  gateStates: {
    NOT_READY: "Pas prêt",
    READY_FOR_LIMITED_INTERNAL_PILOT: "Prêt pour un pilote interne limité",
    LIMITED_INTERNAL_PILOT_ACTIVE: "Pilote interne limité actif",
    PILOT_SUSPENDED: "Pilote suspendu",
    PILOT_COMPLETED_PENDING_REVIEW: "Pilote terminé, en attente de revue",
  },
};

const p4bAr: P4bDict = {
  nav: { readiness: "الجاهزية", security: "الأمن" },
  banner: {
    validation: "وضع التحقق — بيانات اصطناعية أو مجهّلة الهوية فقط. ليس استخدامًا تشغيليًا حقيقيًا.",
    pilot: "وضع التجربة الداخلية — موظفو أكانيل المصرّح لهم فقط.",
    suspended: "التجربة معلّقة — العمليات الداخلية متوقفة. البوابة العامة غير متأثرة.",
  },
  stepUp: {
    title: "أكّد هويتك",
    lead: "يتطلب هذا الإجراء الحساس إعادة إدخال كلمة المرور.",
    password: "كلمة المرور",
    submit: "تأكيد",
    error: "فشلت إعادة المصادقة.",
  },
  suspended: {
    title: "التجربة الداخلية معلّقة",
    body: "التجربة الداخلية معلّقة. البيانات التشغيلية والتعديلات غير متاحة. تستمر البوابة العامة والاستقبال الرقمي في العمل بشكل طبيعي.",
  },
  readiness: {
    title: "جاهزية التجربة",
    lead: "مجالات جاهزية مضبوطة. لا توجد نتيجة إجمالية؛ التجربة المحدودة قرار بشري.",
    gate: "بوابة الجاهزية",
    area: "المجال",
    status: "الحالة",
    detail: "التفصيل",
    setGate: "تسجيل قرار البوابة",
    rationale: "المبرر",
    state: "حالة البوابة",
    decide: "تسجيل القرار",
    accessLink: "الوصول والفريق",
    exercisesLink: "التمارين والإجراءات التصحيحية",
    recoveryLink: "النسخ الاحتياطي والاسترجاع",
    notProductionReady: "هذه واجهة جاهزية لتجربة داخلية محدودة. وليست شهادة جاهزية للإنتاج.",
  },
  access: {
    title: "وصول التجربة والتغييرات والمراجعات",
    cohort: "فريق التجربة",
    requestPilot: "طلب وصول التجربة",
    employee: "الموظف",
    role: "الدور",
    justification: "المبرر",
    approve: "اعتماد",
    suspend: "تعليق",
    revoke: "إلغاء",
    reason: "السبب",
    days: "الأيام",
    changes: "طلبات تغيير الوصول",
    changeType: "نوع التغيير",
    proposedRole: "الدور المقترح",
    propose: "طلب تغيير",
    apply: "تطبيق",
    reject: "رفض",
    reviews: "مراجعات الوصول",
    openReview: "فتح مراجعة",
    outcome: "النتيجة",
    conduct: "تسجيل المراجعة",
    lifecycle: "دورة حياة الموظف",
    offboard: "بدء إنهاء الخدمة",
    complete: "إكمال إنهاء الخدمة",
    sessions: "الجلسات النشطة",
    revokeSession: "إلغاء",
    revokeAll: "إلغاء الكل",
    signOutOthers: "إنهاء جلساتي الأخرى",
    device: "الجهاز",
    lastActivity: "آخر نشاط",
    expires: "تنتهي",
    twoPersonNote: "لا يمكن لمقدّم الطلب اعتماد طلبه؛ ولا يمكن للهدف اعتماد تغييره.",
  },
  security: {
    title: "أحداث الأمن",
    events: "الأحداث",
    category: "الفئة",
    severity: "الخطورة",
    status: "الحالة",
    acknowledge: "إقرار",
    resolve: "حلّ",
    resolution: "الحل",
    incidents: "الحوادث",
    newIncident: "فتح حادث",
    reference: "المرجع",
    summary: "الملخص",
    affected: "المجالات المتأثرة",
    open: "فتح",
    transition: "الانتقال إلى",
    close: "إغلاق الحادث",
    lessons: "الدروس المستفادة",
    containment: "إجراءات الاحتواء",
    evidence: "ملاحظات الأدلة",
    recovery: "إجراءات الاسترجاع",
    internalOnly: "للاستخدام الداخلي فقط. لا يُرسل أي إشعار خارجي ولا يُتخذ أي قرار قانوني بشأن الاختراق.",
  },
  exercises: {
    title: "تمارين التجربة",
    type: "النوع",
    expected: "النتيجة المتوقعة",
    plan: "تخطيط تمرين",
    start: "بدء",
    record: "تسجيل النتيجة",
    result: "النتيجة",
    actual: "النتيجة الفعلية",
    deviation: "الانحراف",
    evidence: "ملخص الأدلة",
    approve: "اعتماد",
    corrective: "الإجراءات التصحيحية",
    verify: "تحقّق",
    acceptRisk: "قبول المخاطرة",
    syntheticOnly: "تستخدم التمارين بيانات اصطناعية أو مجهّلة الهوية فقط. لا تُسجَّل أي بيانات اعتماد حقيقية.",
  },
  recovery: {
    title: "التحقق من النسخ الاحتياطي والاسترجاع",
    lead: "إشارات محلية للتحقق من النسخ الاحتياطي والاسترجاع. لا تُودَع النسخ الاحتياطية أبدًا ولا تحتوي على بيانات حقيقية.",
    backupRecency: "حداثة النسخة الاحتياطية",
    restoreTest: "نتيجة اختبار الاسترجاع",
    note: "يجب تشفير النسخ الاحتياطية التشغيلية خارج المستودع قبل أي نشر حقيقي مستقبلي.",
  },
  common: {
    none: "لا شيء لعرضه.",
    save: "حفظ",
    conflict: "تغيّر هذا السجل منذ تحميله. أعد التحميل وحاول مجددًا.",
    minimizationWarning: "تقليل البيانات: أدخل فقط بيانات اصطناعية أو مجهّلة الهوية معتمدة. لا تُدخل أبدًا بيانات حقيقية شخصية أو سرية أو مصرفية أو هوية حكومية أو كلمات مرور أو أسرار.",
  },
  areaLabels: {
    "pilot-cohort": "فريق التجربة",
    "access-approvals": "اعتمادات الوصول",
    "overdue-access-reviews": "مراجعات وصول متأخرة",
    "employee-offboarding-readiness": "جاهزية إنهاء خدمة الموظفين",
    "audit-chain-verification": "التحقق من سلسلة التدقيق",
    "unresolved-security-events": "أحداث أمنية غير محلولة",
    "open-incidents": "حوادث مفتوحة",
    "failed-or-blocked-exercises": "تمارين فاشلة أو محجوبة",
    "open-corrective-actions": "إجراءات تصحيحية مفتوحة",
    "database-migration-status": "حالة ترحيل قاعدة البيانات",
    "authentication-control-tests": "اختبارات ضوابط المصادقة",
    "authorization-control-tests": "اختبارات ضوابط التفويض",
    "backup-recency": "حداثة النسخة الاحتياطية",
    "last-restore-test": "آخر اختبار استرجاع",
    "public-internal-boundary": "الحدّ بين العام والداخلي",
    "secret-scan": "فحص الأسرار",
    accessibility: "نتيجة إمكانية الوصول",
    "public-regression": "نتيجة الانحدار العام",
  },
  gateStates: {
    NOT_READY: "غير جاهز",
    READY_FOR_LIMITED_INTERNAL_PILOT: "جاهز لتجربة داخلية محدودة",
    LIMITED_INTERNAL_PILOT_ACTIVE: "تجربة داخلية محدودة نشطة",
    PILOT_SUSPENDED: "التجربة معلّقة",
    PILOT_COMPLETED_PENDING_REVIEW: "اكتملت التجربة، بانتظار المراجعة",
  },
};

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
  p4b: p4bEn,
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
  p4b: p4bFr,
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
  p4b: p4bAr,
};

const DICTS: Record<Locale, InternalDict> = { ar, fr, en };

export function getInternalDict(locale: Locale): InternalDict {
  return DICTS[locale];
}
