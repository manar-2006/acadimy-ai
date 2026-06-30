"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { domTranslations } from './domTranslations';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation & Sidebar
    dashboard: "Dashboard",
    aiAssistant: "AI Assistant",
    pdfAnalyzer: "PDF Analyzer",
    courses: "Courses",
    smartTranslator: "Smart Translator",
    studyPlanner: "Study Planner",
    quizFlashcards: "Quiz & Flashcards",
    certificates: "Certificates",
    careerCenter: "Career Center",
    internshipsJobs: "Internships & Jobs",
    clubsEvents: "Clubs & Events",
    performance: "Performance",
    community: "Community",
    notifications: "Notifications",
    settings: "Settings",
    myProfile: "My Profile",
    logout: "Logout",
    studentHub: "Student Hub",
    askAI: "Ask AI",
    
    // Dashboard & Core Elements
    welcomeBack: "Welcome Back",
    gpaScore: "GPA Score",
    activeCourses: "Active Courses",
    studyHours: "Study Hours",
    assignments: "Assignments",
    upcomingTasks: "Upcoming Tasks",
    aiInsight: "AI Insight",
    todaysTasks: "Today's Tasks",
    miniCalendar: "Mini Calendar",
    askAiAssistant: "Ask AI Assistant",
    viewAll: "View All",
    progress: "Progress",
    enterCourse: "Enter Course",
    quickAccess: "Quick Access",
    progressTracker: "Progress Tracker",
    courseCompletion: "Course Completion",
    studyHoursTarget: "Study Hours Target",
    planner: "Planner",
    allCaughtUp: "All caught up! No pending assignments.",
    addTask: "Add Task",
    newTaskPlaceholder: "New task name...",
    cancel: "Cancel",
    add: "Add",
    loading: "Loading...",
    
    // Profile & Translator page
    academicStatus: "Academic Status",
    skillSet: "Skill Set",
    achievements: "Achievements",
    studyMomentum: "Study Momentum",
    institution: "Institution",
    year: "Year",
    major: "Major",
    editProfileBtn: "Edit Profile",
    changePasswordBtn: "Change Password",
    share: "Share",
    studyHoursStats: "Study Hours",
    aiInsightsStats: "AI Insights",
    contributionsStats: "Contributions",
    quizAccuracyStats: "Quiz Accuracy",
    featuredProjects: "Featured Projects",
    researchPhase: "Research Phase",
    completed: "Completed",
    deansList: "Dean's List",
    deanDesc: "Top 5% of Department for 3 consecutive semesters.",
    aiAward: "AI Innovation Award",
    aiAwardDesc: "Winner of the Inter-University AI Ethics Hackathon.",
    today: "Today",
    yesterday: "Yesterday",
    twoDaysAgo: "2 Days Ago",
    addSkillPlaceholder: "e.g. Machine Learning",
    
    // Translator Specific
    smartTranslationCenter: "Smart Translation Center",
    sourceText: "Source Text",
    translatedText: "Translated Text",
    translate: "Translate",
    translating: "Translating...",
    sourcePlaceholder: "Enter academic text to translate...",
    
    // Planner Specific
    weeklySchedule: "Weekly Schedule",
    smartRecommendations: "Smart Recommendations",
    focusTimer: "Focus Timer",
    focusing: "FOCUSING",
    paused: "PAUSED",
    workTimer: "Work · 25m",
    breakTimer: "Break · 5m",
    dailyTasks: "Daily Tasks",
    peakConcentration: "Peak Concentration",
    peakConcentrationDesc: "Based on your habits, 10:00 AM–12:00 PM is best for Neural Networks study.",
    courseDifficulty: "Course Difficulty Adjustment",
    courseDifficultyDesc: "We've added 30 mins to Math Foundations to cover complex modules this week.",

    // Teacher Sidebar & Pages
    instructorHub: "Instructor Hub",
    studentAnalytics: "Student Analytics",
    courseManagement: "Course Management",
    teacherProfile: "My Profile",

    // Landing Page
    landingHome: "Home",
    landingSignIn: "Sign In",
    landingGetStarted: "Get Started",
    landingHeroTitle: "Your Intelligent University Companion",
    landingHeroSubtitle: "Navigate your academic journey with AI-powered study schedules, instant lecture summaries, and career pathing designed specifically for higher education.",
    landingHeroBadge: "Next-Gen Academic Intelligence",
    landingHeroCta: "Start Learning Free",
    landingHeroSecondary: "Explore Features",
    landingFeaturesTitle: "Everything you need to excel academically",
    landingFeaturesSubtitle: "Powered by the latest AI technology, EduSphere AI offers a complete ecosystem for students and educators.",
    landingCtaTitle: "Ready to transform your academic journey?",
    landingCtaSubtitle: "Join thousands of students already using EduSphere AI to reach their full potential.",
    landingCtaBtn: "Create Free Account",
    landingForStudents: "For Students",
    landingForTeachers: "For Teachers",

    // Auth Pages
    authSignIn: "Sign in to EduSphere AI",
    authSignInSubtitle: "Welcome back! Enter your credentials to access your academic portal.",
    authEmail: "Email address",
    authPassword: "Password",
    authForgotPassword: "Forgot password?",
    authSignInBtn: "Sign In",
    authNoAccount: "Don't have an account?",
    authSignUpLink: "Create account",
    authSignUp: "Create your account",
    authSignUpSubtitle: "Join thousands of students on EduSphere AI",
    authRole: "I am a",
    authStudent: "Student",
    authTeacher: "Teacher",
    authAgreeTerms: "I agree to the",
    authTerms: "Terms of Service",
    authAnd: "and",
    authPrivacy: "Privacy Policy",
    authSignUpBtn: "Create Account",
    authAlreadyAccount: "Already have an account?",
    authSignInLink: "Sign in",
    authForgotTitle: "Reset your password",
    authForgotSubtitle: "Enter your email and we'll send you a reset code.",
    authSendCode: "Send Reset Code",
    authBackToLogin: "Back to login",
    authForgotEnterCode: "Enter the verification code and set a new password.",
    authForgotSuccess: "Password updated successfully!",
    authForgotEnterCodeLabel: "Verification Code",
    authForgotEnterCodePlaceholder: "Enter 6-digit code",
    authForgotSuccessTitle: "All Set!",
    authForgotSuccessDesc: "Your password has been successfully reset. You can now log in using your new password.",
    authForgotRemember: "Remember your password?",
    authSending: "Sending Code...",
    authResetting: "Resetting Password...",

    // Settings Page Keys
    settingsDesc: "Manage your academic ecosystem and personal preferences.",
    settingsAccountTab: "Account",
    settingsAppearanceTab: "Appearance",
    settingsPrivacyTab: "Privacy & Data",
    settingsLanguageTab: "Language",
    settingsProfileInfo: "Profile Information",
    settingsProfileInfoDesc: "Update your public profile and institutional details.",
    settingsSecurity: "Security",
    settingsTfa: "Two-Factor Authentication",
    settingsTfaDesc: "Add an extra layer of security to your account.",
    settingsThemePref: "Theme Preferences",
    settingsThemePrefDesc: "Customize how EduSphere AI looks on your device.",
    settingsFullNameLabel: "FULL NAME",
    settingsEmailLabel: "EMAIL ADDRESS",
    settingsInstitutionLabel: "INSTITUTION"
  },
  fr: {
    // Navigation & Sidebar
    dashboard: "Tableau de bord",
    aiAssistant: "Assistant IA",
    pdfAnalyzer: "Analyseur PDF",
    courses: "Cours",
    smartTranslator: "Traducteur Intelligent",
    studyPlanner: "Planificateur",
    quizFlashcards: "Quiz & Fiches",
    certificates: "Certificats",
    careerCenter: "Centre de Carrière",
    internshipsJobs: "Stages & Emplois",
    clubsEvents: "Clubs & Événements",
    performance: "Performance",
    community: "Communauté",
    notifications: "Notifications",
    settings: "Paramètres",
    myProfile: "Mon Profil",
    logout: "Déconnexion",
    studentHub: "Espace Étudiant",
    askAI: "Demander à l'IA",
    
    // Dashboard & Core Elements
    welcomeBack: "Bon retour",
    gpaScore: "GPA Score",
    activeCourses: "Cours Actifs",
    studyHours: "Heures d'Étude",
    assignments: "Devoirs",
    upcomingTasks: "Tâches à venir",
    aiInsight: "Aperçu de l'IA",
    todaysTasks: "Tâches d'aujourd'hui",
    miniCalendar: "Mini Calendrier",
    askAiAssistant: "Demander à l'assistant",
    viewAll: "Voir Tout",
    progress: "Progression",
    enterCourse: "Entrer dans le Cours",
    quickAccess: "Accès Rapide",
    progressTracker: "Suivi de Progression",
    courseCompletion: "Achèvement du Cours",
    studyHoursTarget: "Cible d'Heures d'Étude",
    planner: "Planificateur",
    allCaughtUp: "Tout est à jour ! Aucun devoir en attente.",
    addTask: "Ajouter une tâche",
    newTaskPlaceholder: "Nom de la nouvelle tâche...",
    cancel: "Annuler",
    add: "Ajouter",
    loading: "Chargement...",
    
    // Profile & Translator page
    academicStatus: "Statut Académique",
    skillSet: "Compétences",
    achievements: "Réalisations",
    studyMomentum: "Élan d'Étude",
    institution: "Établissement",
    year: "Année",
    major: "Spécialité",
    editProfileBtn: "Modifier le Profil",
    changePasswordBtn: "Changer de mot de passe",
    share: "Partager",
    studyHoursStats: "Heures d'Étude",
    aiInsightsStats: "Aperçus de l'IA",
    contributionsStats: "Contributions",
    quizAccuracyStats: "Précision des Quiz",
    featuredProjects: "Projets Vedettes",
    researchPhase: "Phase de Recherche",
    completed: "Terminé",
    deansList: "Tableau d'Honneur",
    deanDesc: "Top 5% du département pour 3 semestres consécutifs.",
    aiAward: "Prix de l'Innovation IA",
    aiAwardDesc: "Vainqueur du Hackathon Inter-Universitaire sur l'Éthique de l'IA.",
    today: "Aujourd'hui",
    yesterday: "Hier",
    twoDaysAgo: "Il y a 2 jours",
    addSkillPlaceholder: "ex: Apprentissage Automatique",
    
    // Translator Specific
    smartTranslationCenter: "Centre de Traduction Intelligent",
    sourceText: "Texte Source",
    translatedText: "Texte Traduit",
    translate: "Traduire",
    translating: "Traduction...",
    sourcePlaceholder: "Entrez le texte académique à traduire...",
    
    // Planner Specific
    weeklySchedule: "Emploi du Temps Hebdomadaire",
    smartRecommendations: "Recommandations Intelligentes",
    focusTimer: "Minuteur de Concentration",
    focusing: "CONCENTRATION",
    paused: "PAUSE",
    workTimer: "Travail · 25m",
    breakTimer: "Pause · 5m",
    dailyTasks: "Tâches Quotidiennes",
    peakConcentration: "Pic de Concentration",
    peakConcentrationDesc: "Selon vos habitudes, 10h - 12h est le meilleur moment pour étudier les Réseaux de Neurones.",
    courseDifficulty: "Ajustement de la difficulté",
    courseDifficultyDesc: "Nous avons ajouté 30 min aux Fondements Mathématiques cette semaine.",

    // Teacher Sidebar & Pages
    instructorHub: "Espace Formateur",
    studentAnalytics: "Analytique Étudiants",
    courseManagement: "Gestion des Cours",
    teacherProfile: "Mon Profil",

    // Landing Page
    landingHome: "Accueil",
    landingSignIn: "Connexion",
    landingGetStarted: "Commencer",
    landingHeroTitle: "Votre Compagnon Universitaire Intelligent",
    landingHeroSubtitle: "Naviguez votre parcours académique avec des plannings IA, des résumés de cours instantanés et des conseils de carrière conçus pour l'enseignement supérieur.",
    landingHeroBadge: "Intelligence Académique Nouvelle Génération",
    landingHeroCta: "Commencer Gratuitement",
    landingHeroSecondary: "Explorer les Fonctionnalités",
    landingFeaturesTitle: "Tout ce dont vous avez besoin pour exceller académiquement",
    landingFeaturesSubtitle: "Propulsé par les dernières technologies IA, EduSphere AI offre un écosystème complet pour étudiants et enseignants.",
    landingCtaTitle: "Prêt à transformer votre parcours académique ?",
    landingCtaSubtitle: "Rejoignez des milliers d'étudiants qui utilisent déjà EduSphere AI.",
    landingCtaBtn: "Créer un Compte Gratuit",
    landingForStudents: "Pour Étudiants",
    landingForTeachers: "Pour Enseignants",

    // Auth Pages
    authSignIn: "Connexion à EduSphere AI",
    authSignInSubtitle: "Bienvenue ! Entrez vos identifiants pour accéder à votre portail académique.",
    authEmail: "Adresse e-mail",
    authPassword: "Mot de passe",
    authForgotPassword: "Mot de passe oublié ?",
    authSignInBtn: "Se Connecter",
    authNoAccount: "Pas encore de compte ?",
    authSignUpLink: "Créer un compte",
    authSignUp: "Créer votre compte",
    authSignUpSubtitle: "Rejoignez des milliers d'étudiants sur EduSphere AI",
    authRole: "Je suis",
    authStudent: "Étudiant",
    authTeacher: "Enseignant",
    authAgreeTerms: "J'accepte les",
    authTerms: "Conditions d'utilisation",
    authAnd: "et la",
    authPrivacy: "Politique de confidentialité",
    authSignUpBtn: "Créer un Compte",
    authAlreadyAccount: "Vous avez déjà un compte ?",
    authSignInLink: "Se connecter",
    authForgotTitle: "Réinitialiser votre mot de passe",
    authForgotSubtitle: "Entrez votre e-mail et nous vous enverrons un code de réinitialisation.",
    authSendCode: "Envoyer le Code",
    authBackToLogin: "Retour à la connexion",
    authForgotEnterCode: "Saisissez le code de vérification et définissez un nouveau mot de passe.",
    authForgotSuccess: "Mot de passe mis à jour avec succès !",
    authForgotEnterCodeLabel: "Code de vérification",
    authForgotEnterCodePlaceholder: "Entrez le code à 6 chiffres",
    authForgotSuccessTitle: "Tout est prêt !",
    authForgotSuccessDesc: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
    authForgotRemember: "Vous vous souvenez de votre mot de passe ?",
    authSending: "Envoi du code...",
    authResetting: "Réinitialisation...",

    // Settings Page Keys
    settingsDesc: "Gerez votre ecosysteme academique et vos preferences.",
    settingsAccountTab: "Compte",
    settingsAppearanceTab: "Apparence",
    settingsPrivacyTab: "Confidentialite & Donnees",
    settingsLanguageTab: "Langue",
    settingsProfileInfo: "Informations du Profil",
    settingsProfileInfoDesc: "Mettez a jour vos informations publiques.",
    settingsSecurity: "Securite",
    settingsTfa: "Authentification a deux facteurs",
    settingsTfaDesc: "Ajoutez une couche de securite supplementaire.",
    settingsThemePref: "Preferences de Theme",
    settingsThemePrefDesc: "Personnalisez l'apparence d'EduSphere AI.",
    settingsFullNameLabel: "NOM COMPLET",
    settingsEmailLabel: "ADRESSE E-MAIL",
    settingsInstitutionLabel: "ETABLISSEMENT"
  },
  ar: {
    // Navigation & Sidebar
    dashboard: "لوحة القيادة",
    aiAssistant: "مساعد الذكاء الاصطناعي",
    pdfAnalyzer: "محلل ملفات PDF",
    courses: "المواد الدراسية",
    smartTranslator: "المترجم الذكي",
    studyPlanner: "مخطط الدراسة",
    quizFlashcards: "الاختبارات والبطاقات",
    certificates: "الشهادات",
    careerCenter: "مركز التطوير المهني",
    internshipsJobs: "التربصات والوظائف",
    clubsEvents: "النوادي والفعاليات",
    performance: "الأداء الدراسي",
    community: "المنتدى الطلابي",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    myProfile: "ملفي الشخصي",
    logout: "تسجيل الخروج",
    studentHub: "بوابة الطالب",
    askAI: "اسأل الذكاء الاصطناعي",
    
    // Dashboard & Core Elements
    welcomeBack: "مرحباً بك مجدداً",
    gpaScore: "المعدل التراكمي",
    activeCourses: "المواد النشطة",
    studyHours: "ساعات الدراسة",
    assignments: "الواجبات",
    upcomingTasks: "المهام القادمة",
    aiInsight: "رؤية الذكاء الاصطناعي",
    todaysTasks: "مهام اليوم",
    miniCalendar: "التقويم المصغر",
    askAiAssistant: "اسأل المساعد",
    viewAll: "عرض الكل",
    progress: "التقدم",
    enterCourse: "دخول المادة",
    quickAccess: "الوصول السريع",
    progressTracker: "متابع التقدم الدراسي",
    courseCompletion: "إكمال المواد",
    studyHoursTarget: "ساعات الدراسة المستهدفة",
    planner: "المخطط",
    allCaughtUp: "أنت مواكب لكل شيء! لا توجد واجبات معلقة.",
    addTask: "إضافة مهمة",
    newTaskPlaceholder: "اسم المهمة الجديدة...",
    cancel: "إلغاء",
    add: "إضافة",
    loading: "جاري التحميل...",
    
    // Profile & Translator page
    academicStatus: "الحالة الأكاديمية",
    skillSet: "المهارات والخبرات",
    achievements: "الإنجازات والجوائز",
    studyMomentum: "نشاط الدراسة",
    institution: "المؤسسة التعليمية",
    year: "السنة الدراسية",
    major: "التخصص",
    editProfileBtn: "تعديل الملف الشخصي",
    changePasswordBtn: "تغيير كلمة المرور",
    share: "مشاركة",
    studyHoursStats: "ساعات الدراسة",
    aiInsightsStats: "تحليلات الذكاء الاصطناعي",
    contributionsStats: "المساهمات",
    quizAccuracyStats: "دقة الاختبارات",
    featuredProjects: "المشاريع المميزة",
    researchPhase: "مرحلة البحث",
    completed: "مكتمل",
    deansList: "قائمة العميد",
    deanDesc: "ضمن أفضل 5٪ في القسم لثلاثة فصول دراسية متتالية.",
    aiAward: "جائزة الابتكار في الذكاء الاصطناعي",
    aiAwardDesc: "الفائز في الهاكاثون الجامعي لأخلاقيات الذكاء الاصطناعي.",
    today: "اليوم",
    yesterday: "الأمس",
    twoDaysAgo: "قبل يومين",
    addSkillPlaceholder: "مثال: تعلم الآلة",
    
    // Translator Specific
    smartTranslationCenter: "مركز الترجمة الأكاديمية الذكي",
    sourceText: "النص الأصلي",
    translatedText: "النص المترجم",
    translate: "ترجم",
    translating: "جاري الترجمة...",
    sourcePlaceholder: "أدخل النص الأكاديمي المراد ترجمته...",
    
    // Planner Specific
    weeklySchedule: "الجدول الأسبوعي",
    smartRecommendations: "التوصيات الذكية",
    focusTimer: "مؤقت التركيز",
    focusing: "تركيز",
    paused: "متوقف مؤقتاً",
    workTimer: "عمل · 25 دقيقة",
    breakTimer: "استراحة · 5 دقائق",
    dailyTasks: "المهام اليومية",
    peakConcentration: "ذروة التركيز",
    peakConcentrationDesc: "استناداً إلى عاداتك، الفترة بين 10:00 صباحاً و 12:00 ظهراً هي الأفضل لدراسة الشبكات العصبية.",
    courseDifficulty: "تعديل صعوبة المواد",
    courseDifficultyDesc: "تمت إضافة 30 دقيقة إلى أسس الرياضيات لتغطية الوحدات المعقدة هذا الأسبوع.",

    // Teacher Sidebar & Pages
    instructorHub: "بوابة المحاضر",
    studentAnalytics: "تحليلات الطلاب",
    courseManagement: "إدارة المقررات",
    teacherProfile: "ملفي الشخصي",

    // Landing Page
    landingHome: "الرئيسية",
    landingSignIn: "تسجيل الدخول",
    landingGetStarted: "ابدأ الآن",
    landingHeroTitle: "رفيقك الجامعي الذكي",
    landingHeroSubtitle: "انطلق في مسيرتك الأكاديمية بمساعدة جداول الدراسة الذكية وملخصات المحاضرات الفورية وتوجيه المسار المهني المصمم خصيصاً للتعليم العالي.",
    landingHeroBadge: "الذكاء الأكاديمي من الجيل القادم",
    landingHeroCta: "ابدأ التعلم مجاناً",
    landingHeroSecondary: "استكشف الميزات",
    landingFeaturesTitle: "كل ما تحتاجه للتميز الأكاديمي",
    landingFeaturesSubtitle: "مدعوم بأحدث تقنيات الذكاء الاصطناعي، يوفر EduSphere AI منظومة متكاملة للطلاب والأساتذة.",
    landingCtaTitle: "هل أنت مستعد لتحويل مسيرتك الأكاديمية؟",
    landingCtaSubtitle: "انضم إلى آلاف الطلاب الذين يستخدمون بالفعل EduSphere AI لتحقيق إمكاناتهم الكاملة.",
    landingCtaBtn: "إنشاء حساب مجاني",
    landingForStudents: "للطلاب",
    landingForTeachers: "للأساتذة",

    // Auth Pages
    authSignIn: "تسجيل الدخول إلى EduSphere AI",
    authSignInSubtitle: "مرحباً بعودتك! أدخل بيانات اعتمادك للوصول إلى بوابتك الأكاديمية.",
    authEmail: "البريد الإلكتروني",
    authPassword: "كلمة المرور",
    authForgotPassword: "نسيت كلمة المرور؟",
    authSignInBtn: "تسجيل الدخول",
    authNoAccount: "ليس لديك حساب؟",
    authSignUpLink: "إنشاء حساب",
    authSignUp: "إنشاء حسابك",
    authSignUpSubtitle: "انضم إلى آلاف الطلاب على EduSphere AI",
    authRole: "أنا",
    authStudent: "طالب",
    authTeacher: "أستاذ",
    authAgreeTerms: "أوافق على",
    authTerms: "شروط الخدمة",
    authAnd: "و",
    authPrivacy: "سياسة الخصوصية",
    authSignUpBtn: "إنشاء حساب",
    authAlreadyAccount: "هل لديك حساب بالفعل؟",
    authSignInLink: "تسجيل الدخول",
    authForgotTitle: "إعادة تعيين كلمة المرور",
    authForgotSubtitle: "أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين.",
    authSendCode: "إرسال الرمز",
    authBackToLogin: "العودة إلى تسجيل الدخول",
    authForgotEnterCode: "أدخل رمز التحقق وعين كلمة مرور جديدة.",
    authForgotSuccess: "تم تحديث كلمة المرور بنجاح!",
    authForgotEnterCodeLabel: "رمز التحقق",
    authForgotEnterCodePlaceholder: "أدخل الرمز المكون من 6 أرقام",
    authForgotSuccessTitle: "كل شيء جاهز!",
    authForgotSuccessDesc: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
    authForgotRemember: "هل تذكرت كلمة المرور؟",
    authSending: "جاري إرسال الرمز...",
    authResetting: "جاري إعادة التعيين...",

    // Settings Page Keys
    settingsDesc: "إدارة النظام الأكاديمي والتفضيلات الشخصية.",
    settingsAccountTab: "الحساب",
    settingsAppearanceTab: "المظهر",
    settingsPrivacyTab: "الخصوصية والبيانات",
    settingsLanguageTab: "اللغة",
    settingsProfileInfo: "معلومات الملف الشخصي",
    settingsProfileInfoDesc: "تحديث ملفك الشخصي العام وتفاصيل المؤسسة الأكاديمية.",
    settingsSecurity: "الأمان",
    settingsTfa: "المصادقة الثنائية (2FA)",
    settingsTfaDesc: "إضافة طبقة حماية إضافية لحسابك.",
    settingsThemePref: "تفضيلات المظهر",
    settingsThemePrefDesc: "تخصيص مظهر EduSphere AI على جهازك.",
    settingsFullNameLabel: "الاسم الكامل",
    settingsEmailLabel: "البريد الإلكتروني",
    settingsInstitutionLabel: "المؤسسة التعليمية"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Pre-build lookup structures once at module load time so translateDOM is fast.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a reverse map:  translated-string → english-key
 * This lets us normalise the DOM back to English before translating to any lang.
 */
function buildReverseMaps() {
  const frToEn = new Map();
  const arToEn = new Map();
  for (const [key, val] of Object.entries(domTranslations)) {
    if (val.fr) frToEn.set(val.fr, key);
    if (val.ar) arToEn.set(val.ar, key);
  }
  return { frToEn, arToEn };
}

const { frToEn, arToEn } = buildReverseMaps();

/**
 * Keys sorted by descending length so longer phrases are matched first.
 * This prevents partial sub-phrase matches from firing before full-phrase ones.
 */
const SORTED_KEYS = Object.keys(domTranslations).sort((a, b) => b.length - a.length);

/**
 * Normalise any string back to its canonical English form, then translate to
 * the requested target language.
 */
function translateString(raw, targetLang) {
  const str = raw.trim();
  if (!str || str.length < 2) return raw;

  // 1. Direct exact-match (after normalisation)
  let enKey = null;
  if (domTranslations[str]) {
    enKey = str;
  } else if (frToEn.has(str)) {
    enKey = frToEn.get(str);
  } else if (arToEn.has(str)) {
    enKey = arToEn.get(str);
  }

  if (enKey) {
    if (targetLang === 'en') return enKey;
    return domTranslations[enKey][targetLang] || enKey;
  }

  // 2. Substring substitution (handles mixed / partial strings)
  let result = raw;
  for (const key of SORTED_KEYS) {
    if (key.length < 4) continue; // Skip very short keys to avoid noise
    const entry = domTranslations[key];

    // Try to replace the English phrase
    if (result.includes(key)) {
      const replacement = targetLang === 'en' ? key : (entry[targetLang] || key);
      if (replacement !== key) {
        result = result.split(key).join(replacement);
      }
    }

    // Try to replace an already-translated French phrase
    if (entry.fr && result.includes(entry.fr)) {
      const replacement = targetLang === 'en' ? key : (entry[targetLang] || key);
      if (replacement !== entry.fr) {
        result = result.split(entry.fr).join(replacement);
      }
    }

    // Try to replace an already-translated Arabic phrase
    if (entry.ar && result.includes(entry.ar)) {
      const replacement = targetLang === 'en' ? key : (entry[targetLang] || key);
      if (replacement !== entry.ar) {
        result = result.split(entry.ar).join(replacement);
      }
    }
  }
  return result;
}

/**
 * Walk the entire live DOM and apply translations to:
 *  • Text nodes (skipping script / style / textarea / noscript parents)
 *  • input / textarea [placeholder] attributes
 *  • img / Image [alt] attributes
 *  • [title] attributes on interactive elements
 */
function translateDOM(targetLang) {
  if (typeof window === 'undefined' || !document.body) return;

  // ── Text nodes ──────────────────────────────────────────────────────────
  const SKIP_TAGS = new Set(['script', 'style', 'textarea', 'noscript', 'code', 'pre']);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const tag = node.parentNode?.tagName?.toLowerCase();
        if (SKIP_TAGS.has(tag)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  // Collect first, then mutate (avoids walker invalidation)
  const textNodes = [];
  let cur;
  while ((cur = walker.nextNode())) textNodes.push(cur);

  for (const node of textNodes) {
    const orig = node.nodeValue;
    const next = translateString(orig, targetLang);
    if (next !== orig) node.nodeValue = next;
  }

  // ── Placeholder attributes ───────────────────────────────────────────────
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    const ph = el.getAttribute('placeholder');
    if (!ph) return;
    const next = translateString(ph, targetLang);
    if (next !== ph) el.setAttribute('placeholder', next);
  });

  // ── Alt attributes ───────────────────────────────────────────────────────
  document.querySelectorAll('[alt]').forEach(el => {
    const alt = el.getAttribute('alt');
    if (!alt) return;
    const next = translateString(alt, targetLang);
    if (next !== alt) el.setAttribute('alt', next);
  });

  // ── Title attributes ─────────────────────────────────────────────────────
  document.querySelectorAll('[title]').forEach(el => {
    const title = el.getAttribute('title');
    if (!title) return;
    const next = translateString(title, targetLang);
    if (next !== title) el.setAttribute('title', next);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LanguageProvider
// ─────────────────────────────────────────────────────────────────────────────
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Restore persisted language on first mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timer;
    const stored = localStorage.getItem('language');
    if (stored && ['en', 'fr', 'ar'].includes(stored)) {
      document.documentElement.dir = stored === 'ar' ? 'rtl' : 'ltr';
      timer = setTimeout(() => setLanguage(stored), 0);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, []);

  // Translate DOM whenever language changes and watch for new DOM nodes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Translate immediately after React re-renders flush
    const initial = setTimeout(() => translateDOM(language), 50);

    // Debounced MutationObserver — translates newly-rendered content
    let debounce;
    const OBS_CONFIG = { childList: true, subtree: true };
    const observer = new MutationObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        observer.disconnect();
        translateDOM(language);
        observer.observe(document.body, OBS_CONFIG);
      }, 80);
    });

    observer.observe(document.body, OBS_CONFIG);

    // Also react to the custom 'languagechange' event fired by changeLanguage()
    const onLangChange = () => translateDOM(language);
    window.addEventListener('languagechange', onLangChange);

    return () => {
      clearTimeout(initial);
      clearTimeout(debounce);
      observer.disconnect();
      window.removeEventListener('languagechange', onLangChange);
    };
  }, [language]);

  const changeLanguage = (lang) => {
    if (!['en', 'fr', 'ar'].includes(lang)) return;
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(lang);
    // Immediate DOM pass before React re-renders
    setTimeout(() => {
      translateDOM(lang);
      window.dispatchEvent(new Event('languagechange'));
    }, 0);
  };

  const t = (key) =>
    translations[language]?.[key] ?? translations['en']?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if not inside provider (SSR safe)
    return {
      language: 'en',
      changeLanguage: () => {},
      t: (key) => key
    };
  }
  return context;
};
