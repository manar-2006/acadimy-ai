/**
 * domTranslations.js
 * Comprehensive dictionary of ALL hardcoded English strings across every
 * student and instructor page.  Keys are exact English strings as they appear
 * in the DOM.  Values are { fr, ar } translation objects.
 *
 * Rules for maintainers:
 *  1. Keys must exactly match the visible text in the DOM (trimmed).
 *  2. Longer phrases come naturally first because we sort by length before matching.
 *  3. Substring matching is used as a fallback — keep keys ≥ 4 chars.
 */

export const domTranslations = {

  /* ── HERO / DASHBOARD LABELS ── */
  "Student Hub": { fr: "Espace Étudiant", ar: "بوابة الطالب" },
  "Welcome Back": { fr: "Bon retour", ar: "مرحباً بك مجدداً" },
  "Teaching Dashboard": { fr: "Tableau de Bord Enseignant", ar: "لوحة التدريس" },
  "Here's your teaching snapshot for today. Keep inspiring!": {
    fr: "Voici votre aperçu d'enseignement pour aujourd'hui. Continuez à inspirer !",
    ar: "إليك ملخص تدريسك لهذا اليوم. واصل إلهامك!"
  },
  "You've completed": { fr: "Vous avez complété", ar: "لقد أكملت" },
  "of today's tasks. Keep the momentum going!": {
    fr: "des tâches d'aujourd'hui. Gardez l'élan !",
    ar: "من مهام اليوم. استمر في الزخم!"
  },

  /* ── INSTRUCTOR DASHBOARD STAT CARDS ── */
  "Total Students": { fr: "Total des Étudiants", ar: "إجمالي الطلاب" },
  "Active Courses": { fr: "Cours Actifs", ar: "المقررات النشطة" },
  "Avg. Engagement": { fr: "Engagement Moyen", ar: "متوسط التفاعل" },
  "Pending Reviews": { fr: "Révisions en Attente", ar: "المراجعات المعلقة" },
  "Active across all modules": { fr: "Actif dans tous les modules", ar: "نشط عبر جميع الوحدات" },
  "Published in database": { fr: "Publié dans la base de données", ar: "منشور في قاعدة البيانات" },
  "Real-time participation": { fr: "Participation en temps réel", ar: "المشاركة في الوقت الحقيقي" },
  "Click to grade now": { fr: "Cliquez pour noter maintenant", ar: "انقر للتقييم الآن" },
  "+28 this month": { fr: "+28 ce mois-ci", ar: "+28 هذا الشهر" },
  "2 published today": { fr: "2 publiés aujourd'hui", ar: "2 منشوران اليوم" },
  "+5% vs last week": { fr: "+5% vs semaine dernière", ar: "+5٪ مقارنة بالأسبوع الماضي" },
  "Due this week": { fr: "À rendre cette semaine", ar: "مستحق هذا الأسبوع" },

  /* ── INSTRUCTOR DASHBOARD COURSES SECTION ── */
  "Manage all": { fr: "Gérer tout", ar: "إدارة الكل" },
  "Syllabus Progress": { fr: "Progression du Syllabus", ar: "تقدم المنهج الدراسي" },
  "Manage Tasks": { fr: "Gérer les Tâches", ar: "إدارة المهام" },
  "AI Quiz": { fr: "Quiz IA", ar: "اختبار الذكاء الاصطناعي" },
  "enrolled students": { fr: "étudiants inscrits", ar: "طالب مسجل" },
  "pending": { fr: "en attente", ar: "معلق" },

  /* ── INSTRUCTOR DASHBOARD ACTIVITY / INSIGHT ── */
  "Recent Activity": { fr: "Activité Récente", ar: "النشاط الأخير" },
  "AI Insight": { fr: "Aperçu de l'IA", ar: "رؤية الذكاء الاصطناعي" },
  "CS-402 has a 15% drop in participation. Generate a review session to re-engage students.": {
    fr: "CS-402 a une baisse de 15% de participation. Générez une session de révision pour re-engager les étudiants.",
    ar: "CS-402 شهد انخفاضاً بنسبة 15٪ في المشاركة. أنشئ جلسة مراجعة لإعادة تفاعل الطلاب."
  },
  "Review Suggestions": { fr: "Suggestions de Révision", ar: "مقترحات المراجعة" },
  "New Course": { fr: "Nouveau Cours", ar: "مقرر جديد" },
  "Ask AI": { fr: "Demander à l'IA", ar: "اسأل الذكاء الاصطناعي" },

  /* ── STUDENT DASHBOARD STAT CARD META LABELS ── */
  "+0.2 this semester": { fr: "+0,2 ce semestre", ar: "+0.2 هذا الفصل" },
  "Real enrolled courses": { fr: "Cours réellement inscrits", ar: "مقررات مسجلة فعلياً" },
  "None enrolled yet": { fr: "Aucun cours inscrit", ar: "لم يُسجَّل بعد" },
  "This week": { fr: "Cette semaine", ar: "هذا الأسبوع" },
  "Awaiting submission": { fr: "En attente de soumission", ar: "في انتظار التسليم" },
  "All caught up!": { fr: "Tout est à jour !", ar: "أنت مواكب لكل شيء!" },

  /* ── STUDENT DASHBOARD – PROGRESS / TASKS ── */
  "Progress Tracker": { fr: "Suivi de Progression", ar: "متابع التقدم الدراسي" },
  "Course Completion": { fr: "Achèvement du Cours", ar: "إكمال المواد" },
  "Study Hours Target": { fr: "Cible d'Heures d'Étude", ar: "ساعات الدراسة المستهدفة" },
  "Upcoming Tasks": { fr: "Tâches à Venir", ar: "المهام القادمة" },
  "Today's Tasks": { fr: "Tâches d'Aujourd'hui", ar: "مهام اليوم" },
  "Quick Access": { fr: "Accès Rapide", ar: "الوصول السريع" },
  "All caught up! No pending assignments.": {
    fr: "Tout est à jour ! Aucun devoir en attente.",
    ar: "أنت مواكب لكل شيء! لا توجد واجبات معلقة."
  },
  "No courses enrolled yet.": {
    fr: "Aucun cours inscrit pour l'instant.",
    ar: "لم يُسجَّل في أي مقرر بعد."
  },
  "Browse Courses": { fr: "Parcourir les Cours", ar: "تصفح المقررات" },
  "Your performance in Machine Learning is exceptional. Focus 2 more hours on Data Structures this week.": {
    fr: "Vos performances en Machine Learning sont exceptionnelles. Consacrez 2 heures de plus aux Structures de Données cette semaine.",
    ar: "أداؤك في تعلم الآلة استثنائي. ركز ساعتين إضافيتين على هياكل البيانات هذا الأسبوع."
  },
  "Ask AI Assistant": { fr: "Demander à l'Assistant IA", ar: "اسأل مساعد الذكاء الاصطناعي" },
  "Midterm: Oct 15": { fr: "Mi-semestre: 15 oct.", ar: "امتحان منتصف الفصل: 15 أكتوبر" },
  "Group Study: Oct 13": { fr: "Étude de groupe: 13 oct.", ar: "دراسة جماعية: 13 أكتوبر" },
  "Week 12": { fr: "Semaine 12", ar: "الأسبوع 12" },
  "View All": { fr: "Voir Tout", ar: "عرض الكل" },
  "Progress": { fr: "Progression", ar: "التقدم" },
  "Enter Course": { fr: "Entrer dans le Cours", ar: "دخول المادة" },
  "Planner": { fr: "Planificateur", ar: "المخطط" },
  "Add Task": { fr: "Ajouter une Tâche", ar: "إضافة مهمة" },
  "Loading...": { fr: "Chargement...", ar: "جاري التحميل..." },

  /* ── STUDY PLANNER ── */
  "Study Planner": { fr: "Planificateur d'Études", ar: "مخطط الدراسة" },
  "Productivity Hub": { fr: "Centre de Productivité", ar: "مركز الإنتاجية" },
  "AI-powered scheduling, Pomodoro focus timer, and smart task management — all in one place.": {
    fr: "Planification par IA, minuteur Pomodoro et gestion intelligente des tâches — tout en un seul endroit.",
    ar: "جدولة مدعومة بالذكاء الاصطناعي، ومؤقت تركيز بومودورو، وإدارة ذكية للمهام — كل ذلك في مكان واحد."
  },
  "Tasks Done": { fr: "Tâches Terminées", ar: "المهام المكتملة" },
  "Until Exam": { fr: "Avant l'Examen", ar: "حتى الامتحان" },
  "Weekly Schedule": { fr: "Emploi du Temps Hebdomadaire", ar: "الجدول الأسبوعي" },
  "Smart Recommendations": { fr: "Recommandations Intelligentes", ar: "التوصيات الذكية" },
  "AI-Powered": { fr: "Propulsé par IA", ar: "مدعوم بالذكاء الاصطناعي" },
  "Peak Concentration": { fr: "Pic de Concentration", ar: "ذروة التركيز" },
  "Based on your habits, 10:00 AM–12:00 PM is best for Neural Networks study.": {
    fr: "Selon vos habitudes, 10h00–12h00 est le meilleur moment pour étudier les Réseaux de Neurones.",
    ar: "بناءً على عاداتك، الفترة بين 10:00 صباحاً و 12:00 ظهراً هي الأفضل لدراسة الشبكات العصبية."
  },
  "Course Difficulty Adjustment": { fr: "Ajustement de la Difficulté du Cours", ar: "تعديل صعوبة المواد" },
  "We've added 30 mins to Math Foundations to cover complex modules this week.": {
    fr: "Nous avons ajouté 30 minutes aux Fondements Mathématiques pour couvrir les modules complexes cette semaine.",
    ar: "تمت إضافة 30 دقيقة إلى أسس الرياضيات لتغطية الوحدات المعقدة هذا الأسبوع."
  },
  "Focus Timer": { fr: "Minuteur de Concentration", ar: "مؤقت التركيز" },
  "FOCUSING": { fr: "CONCENTRATION", ar: "تركيز" },
  "PAUSED": { fr: "PAUSE", ar: "متوقف مؤقتاً" },
  "Work · 25m": { fr: "Travail · 25m", ar: "عمل · 25 دقيقة" },
  "Break · 5m": { fr: "Pause · 5m", ar: "استراحة · 5 دقائق" },
  "Daily Tasks": { fr: "Tâches Quotidiennes", ar: "المهام اليومية" },
  "New task name...": { fr: "Nom de la nouvelle tâche...", ar: "اسم المهمة الجديدة..." },

  /* ── SIDEBAR / NAVIGATION ── */
  "Dashboard": { fr: "Tableau de Bord", ar: "لوحة القيادة" },
  "AI Assistant": { fr: "Assistant IA", ar: "مساعد الذكاء الاصطناعي" },
  "PDF Analyzer": { fr: "Analyseur PDF", ar: "محلل ملفات PDF" },
  "Courses": { fr: "Cours", ar: "المواد الدراسية" },
  "Smart Translator": { fr: "Traducteur Intelligent", ar: "المترجم الذكي" },
  "Quiz & Flashcards": { fr: "Quiz et Fiches", ar: "الاختبارات والبطاقات" },
  "Certificates": { fr: "Certificats", ar: "الشهادات" },
  "Career Center": { fr: "Centre de Carrière", ar: "مركز التطوير المهني" },
  "Internships & Jobs": { fr: "Stages et Emplois", ar: "التربصات والوظائف" },
  "Clubs & Events": { fr: "Clubs et Événements", ar: "النوادي والفعاليات" },
  "Performance": { fr: "Performance", ar: "الأداء الدراسي" },
  "Community": { fr: "Communauté", ar: "المنتدى الطلابي" },
  "Notifications": { fr: "Notifications", ar: "الإشعارات" },
  "Settings": { fr: "Paramètres", ar: "الإعدادات" },
  "My Profile": { fr: "Mon Profil", ar: "ملفي الشخصي" },
  "Logout": { fr: "Déconnexion", ar: "تسجيل الخروج" },
  "Instructor Hub": { fr: "Espace Formateur", ar: "بوابة المحاضر" },
  "Student Analytics": { fr: "Analytique Étudiants", ar: "تحليلات الطلاب" },
  "Course Management": { fr: "Gestion des Cours", ar: "إدارة المقررات" },

  /* ── COURSES & TEACHERS HUB ── */
  "Courses & Teachers Hub": { fr: "Espace Cours et Enseignants", ar: "بوابة المواد والأساتذة" },
  "Connect with real teachers and manage your enrolled course modules.": {
    fr: "Connectez-vous avec de vrais enseignants et gérez vos modules de cours.",
    ar: "تواصل مع أساتذة حقيقيين وادر وحدات مقرراتك الدراسية."
  },
  "My Courses": { fr: "Mes Cours", ar: "مقرراتي" },
  "Avg. Progress": { fr: "Progression Moyenne", ar: "متوسط التقدم" },
  "My Enrolled Courses": { fr: "Mes Cours Inscrits", ar: "مقرراتي المسجلة" },
  "Discover Teachers & Courses": { fr: "Découvrir Enseignants et Cours", ar: "اكتشف الأساتذة والمقررات" },
  "No courses found": { fr: "Aucun cours trouvé", ar: "لم يتم العثور على مقررات" },
  "You are not enrolled in any courses yet. Browse the Discover tab to connect with real teachers and enroll.": {
    fr: "Vous n'êtes inscrit à aucun cours pour le moment. Parcourez l'onglet Découvrir pour vous connecter avec des enseignants et vous inscrire.",
    ar: "لم تسجل في أي مقرر بعد. تصفح علامة التبويب اكتشف للتواصل مع الأساتذة والتسجيل."
  },
  "We couldn't find any courses matching your search query. Try another term.": {
    fr: "Nous n'avons trouvé aucun cours correspondant à votre recherche. Essayez un autre terme.",
    ar: "لم نتمكن من العثور على أي مقرر يطابق بحثك. جرب مصطلحاً آخر."
  },
  "Enrolled": { fr: "Inscrit", ar: "مسجل" },
  "Enroll Now": { fr: "S'inscrire", ar: "سجل الآن" },
  "Search my courses...": { fr: "Rechercher dans mes cours...", ar: "البحث في مقرراتي..." },
  "Search courses or teachers...": { fr: "Rechercher cours ou enseignants...", ar: "البحث عن مقررات أو أساتذة..." },

  /* ── COURSE MANAGEMENT (TEACHER) ── */
  "Manage your published courses, create assignments, and review student submissions.": {
    fr: "Gérez vos cours publiés, créez des devoirs et examinez les soumissions des étudiants.",
    ar: "أدر مقرراتك المنشورة وأنشئ الواجبات وراجع تسليمات الطلاب."
  },
  "Create New Course": { fr: "Créer un Nouveau Cours", ar: "إنشاء مقرر جديد" },
  "Your Courses": { fr: "Vos Cours", ar: "مقرراتك" },
  "No courses yet.": { fr: "Aucun cours encore.", ar: "لا توجد مقررات بعد." },
  "Create your first course to get started.": {
    fr: "Créez votre premier cours pour commencer.",
    ar: "أنشئ مقررك الأول للبدء."
  },
  "Assignments": { fr: "Devoirs", ar: "الواجبات" },
  "Create Assignment": { fr: "Créer un Devoir", ar: "إنشاء واجب" },
  "View Submissions": { fr: "Voir les Soumissions", ar: "عرض التسليمات" },
  "Submissions": { fr: "Soumissions", ar: "التسليمات" },
  "Grade": { fr: "Note", ar: "الدرجة" },
  "Graded": { fr: "Noté", ar: "تم التقييم" },
  "Pending": { fr: "En Attente", ar: "معلق" },
  "Not submitted": { fr: "Non soumis", ar: "لم يُسلَّم" },
  "Save Grade": { fr: "Enregistrer la Note", ar: "حفظ الدرجة" },
  "Feedback": { fr: "Commentaires", ar: "الملاحظات" },
  "Total Points": { fr: "Points Totaux", ar: "النقاط الإجمالية" },
  "Due Date": { fr: "Date d'Échéance", ar: "تاريخ الاستحقاق" },
  "Assignment created successfully!": {
    fr: "Devoir créé avec succès !",
    ar: "تم إنشاء الواجب بنجاح!"
  },
  "Submission graded successfully!": {
    fr: "Soumission notée avec succès !",
    ar: "تم تقييم التسليم بنجاح!"
  },
  "Upload Syllabus": { fr: "Téléverser le Syllabus", ar: "تحميل المنهج الدراسي" },
  "Course Title": { fr: "Titre du Cours", ar: "عنوان المقرر" },
  "Course Code": { fr: "Code du Cours", ar: "رمز المقرر" },
  "Description": { fr: "Description", ar: "الوصف" },
  "Schedule": { fr: "Emploi du Temps", ar: "الجدول الزمني" },
  "Semester": { fr: "Semestre", ar: "الفصل الدراسي" },
  "Color": { fr: "Couleur", ar: "اللون" },
  "Create Course": { fr: "Créer le Cours", ar: "إنشاء المقرر" },
  "Cancel": { fr: "Annuler", ar: "إلغاء" },
  "Save": { fr: "Sauvegarder", ar: "حفظ" },
  "Delete": { fr: "Supprimer", ar: "حذف" },
  "Edit": { fr: "Modifier", ar: "تعديل" },

  /* ── ASK AI (TEACHER) ── */
  "EduSphere Teaching AI": { fr: "EduSphere Teaching AI", ar: "إديوسفير للتدريس الذكي" },
  "Online — Instructor Mode": { fr: "En ligne — Mode Formateur", ar: "نشط — وضع المحاضر" },
  "Online — Student Mode": { fr: "En ligne — Mode Étudiant", ar: "نشط — وضع الطالب" },
  "New Chat": { fr: "Nouvelle Conversation", ar: "محادثة جديدة" },
  "AI Preferences": { fr: "Préférences de l'IA", ar: "تفضيلات الذكاء الاصطناعي" },
  "Teaching Tools": { fr: "Outils d'Enseignement", ar: "أدوات التدريس" },
  "Quiz Generator": { fr: "Générateur de Quiz", ar: "منشئ الاختبارات" },
  "Feedback Drafter": { fr: "Rédacteur de Commentaires", ar: "صائغ الملاحظات" },
  "Performance Analyst": { fr: "Analyste de Performance", ar: "محلل الأداء" },
  "Lesson Planner": { fr: "Planificateur de Leçons", ar: "مخطط الدروس" },
  "Announcements": { fr: "Annonces", ar: "الإعلانات" },
  "Multiple choice, short answer, essay": { fr: "Choix multiples, réponses courtes, dissertation", ar: "اختيار من متعدد، إجابة قصيرة، مقال" },
  "Personalised student feedback": { fr: "Commentaires personnalisés des étudiants", ar: "ملاحظات مخصصة للطلاب" },
  "Insights from grade patterns": { fr: "Aperçus à partir des schémas de notes", ar: "رؤى من أنماط الدرجات" },
  "Structured learning objectives": { fr: "Objectifs d'apprentissage structurés", ar: "أهداف التعلم الهيكلية" },
  "Professional course messages": { fr: "Messages de cours professionnels", ar: "رسائل المقررات المهنية" },
  "Generate a 10-question multiple choice quiz for my current course topic.": {
    fr: "Générer un quiz à choix multiples de 10 questions sur le sujet de mon cours actuel.",
    ar: "إنشاء اختبار اختيار من متعدد مكون من 10 أسئلة لموضوع مقرري الحالي."
  },
  "Draft constructive feedback for a student who is struggling with assignments.": {
    fr: "Rédiger des commentaires constructifs pour un étudiant en difficulté avec ses devoirs.",
    ar: "صياغة ملاحظات بناءة لطالب يعاني من الواجبات."
  },
  "Write professional course announcement for my students.": {
    fr: "Rédiger une annonce de cours professionnelle pour mes étudiants.",
    ar: "كتابة إعلان مقرر دراسي مهني لطلابي."
  },
  "Analyse my class quiz results and identify areas where students are struggling.": {
    fr: "Analyser les résultats du quiz de ma classe et identifier les domaines où les étudiants éprouvent des difficultés.",
    ar: "تحليل نتائج اختبار فصلي وتحديد المجالات التي يعاني فيها الطلاب."
  },
  "Generate Quiz": { fr: "Générer un Quiz", ar: "إنشاء اختبار قصير" },
  "Draft Feedback": { fr: "Rédiger un Commentaire", ar: "صياغة الملاحظات" },
  "Course Announcement": { fr: "Annonce du Cours", ar: "إعلان المقرر الدراسي" },
  "Analyse Results": { fr: "Analyser les Résultats", ar: "تحليل النتائج" },
  "Pro Tip": { fr: "Conseil de Pro", ar: "نصيحة المحترف" },
  "Ask anything about your courses, students, or teaching…": {
    fr: "Posez n'importe quelle question sur vos cours, vos étudiants ou votre enseignement...",
    ar: "اسأل عن أي شيء يخص مقرراتك، طلابك، أو تدريسك..."
  },
  "EduSphere AI is designed for educational purposes. Always verify AI-generated content before sharing with students.": {
    fr: "EduSphere AI est conçu à des fins éducatives. Vérifiez toujours le contenu généré par l'IA avant de le partager.",
    ar: "تم تصميم إديوسفير لأغراض تعليمية. تحقق دائماً من المحتوى المولد بواسطة الذكاء الاصطناعي قبل مشاركته."
  },

  /* ── COURSE NAMES (USED ON MULTIPLE PAGES) ── */
  "CS-402: Operating Systems": { fr: "CS-402 : Systèmes d'Exploitation", ar: "CS-402: أنظمة التشغيل" },
  "CS-520: Machine Learning": { fr: "CS-520 : Apprentissage Automatique", ar: "CS-520: تعلم الآلة" },
  "CS-301: Data Structures": { fr: "CS-301 : Structures de Données", ar: "CS-301: هياكل البيانات" },
  "CS-415: Network Security": { fr: "CS-415 : Sécurité Réseau", ar: "CS-415: أمن الشبكات" },
  "Advanced": { fr: "Avancé", ar: "متقدم" },
  "Seminar": { fr: "Séminaire", ar: "ندوة" },
  "Core": { fr: "Fondamental", ar: "أساسي" },
  "Elective": { fr: "Électif", ar: "اختياري" },

  /* ── PERFORMANCE ANALYTICS (TEACHER) ── */
  "Performance Analytics": { fr: "Analytique de Performance", ar: "تحليلات الأداء" },
  "My Performance Analytics": { fr: "Mes Analyses de Performance", ar: "تحليلات الأداء الخاصة بي" },
  "Course Performance Breakdown": { fr: "Répartition des Performances par Cours", ar: "تفاصيل أداء المقررات الدراسية" },
  "GPA Score": { fr: "GPA Score", ar: "المعدل التراكمي" },
  "Study Hours": { fr: "Heures d'Étude", ar: "ساعات الدراسة" },

  /* ── NOTIFICATIONS ── */
  "Notifications Center": { fr: "Centre de Notifications", ar: "مركز الإشعارات" },
  "All Read": { fr: "Tout Lu", ar: "تم قراءة الكل" },
  "Mark All Read": { fr: "Marquer Tout Lu", ar: "وضع علامة مقروء للكل" },
  "No notifications yet.": { fr: "Aucune notification encore.", ar: "لا توجد إشعارات بعد." },
  "Hackathon workspace illustration": { fr: "Illustration de l'espace de travail Hackathon", ar: "صورة مساحة عمل الهاكاثون" },

  /* ── STUDENT PROFILE ── */
  "Academic Status": { fr: "Statut Académique", ar: "الحالة الأكاديمية" },
  "Skill Set": { fr: "Compétences", ar: "المهارات والخبرات" },
  "Achievements": { fr: "Réalisations", ar: "الإنجازات والجوائز" },
  "Study Momentum": { fr: "Élan d'Étude", ar: "نشاط الدراسة" },
  "Institution": { fr: "Établissement", ar: "المؤسسة التعليمية" },
  "Year": { fr: "Année", ar: "السنة الدراسية" },
  "Major": { fr: "Spécialité", ar: "التخصص" },
  "Edit Profile": { fr: "Modifier le Profil", ar: "تعديل الملف الشخصي" },
  "Change Password": { fr: "Changer de mot de passe", ar: "تغيير كلمة المرور" },
  "Share": { fr: "Partager", ar: "مشاركة" },
  "Dean's List": { fr: "Tableau d'Honneur", ar: "قائمة العميد" },
  "Top 5% of Department for 3 consecutive semesters.": {
    fr: "Top 5% du département pour 3 semestres consécutifs.",
    ar: "ضمن أفضل 5٪ في القسم لثلاثة فصول دراسية متتالية."
  },
  "AI Innovation Award": { fr: "Prix de l'Innovation IA", ar: "جائزة الابتكار في الذكاء الاصطناعي" },
  "Winner of the Inter-University AI Ethics Hackathon.": {
    fr: "Vainqueur du Hackathon Inter-Universitaire sur l'Éthique de l'IA.",
    ar: "الفائز في الهاكاثون الجامعي لأخلاقيات الذكاء الاصطناعي."
  },
  "Featured Projects": { fr: "Projets Vedettes", ar: "المشاريع المميزة" },
  "Research Phase": { fr: "Phase de Recherche", ar: "مرحلة البحث" },
  "Completed": { fr: "Terminé", ar: "مكتمل" },
  "Today": { fr: "Aujourd'hui", ar: "اليوم" },
  "Yesterday": { fr: "Hier", ar: "الأمس" },
  "2 Days Ago": { fr: "Il y a 2 jours", ar: "قبل يومين" },
  "Campus sunset grid texture": { fr: "Texture de coucher de soleil sur le campus", ar: "خلفية غروب الشمس في الحرم الجامعي" },
  "User profile avatar": { fr: "Avatar du profil utilisateur", ar: "صورة الملف الشخصي" },

  /* ── CLUBS & EVENTS ── */
  "Clubs & Campus Events": { fr: "Clubs et Événements du Campus", ar: "النوادي والفعاليات الجامعية" },
  "Student Organizations": { fr: "Organisations Étudiantes", ar: "المنظمات الطلابية" },
  "Campus Events & Hackathons": { fr: "Événements sur le Campus et Hackathons", ar: "الفعاليات الجامعية والهاكاثونات" },

  /* ── CAREER CENTER ── */
  "Career Development Insights": { fr: "Perspectives de Développement de Carrière", ar: "رؤى التطوير المهني" },
  "AI CV Builder": { fr: "Générateur de CV par IA", ar: "منشئ السيرة الذاتية بالذكاء الاصطناعي" },
  "AI-Powered Projects Hub": { fr: "Centre de Projets Propulsé par l'IA", ar: "منصة المشاريع المدعومة بالذكاء الاصطناعي" },

  /* ── INTERNSHIPS & JOBS ── */
  "Match": { fr: "Correspondance", ar: "تطابق" },

  /* ── COMMUNITY MESSAGES ── */
  "Voices from the Academic World": { fr: "Voix du Monde Académique", ar: "أصوات من العالم الأكاديمي" },
  "Discussions": { fr: "Discussions", ar: "المناقشات" },
  "Avatar": { fr: "Avatar", ar: "الصورة الرمزية" },
  "Prof": { fr: "Prof", ar: "أستاذ" },
  "Peer": { fr: "Pair", ar: "زميل" },

  /* ── SMART PDF ANALYZER ── */
  "Quantum Physics Visualization": { fr: "Visualisation de Physique Quantique", ar: "تصوير الفيزياء الكمية" },

  /* ── SETTINGS ── */
  "Account": { fr: "Compte", ar: "الحساب" },
  "Appearance": { fr: "Apparence", ar: "المظهر" },
  "Privacy & Data": { fr: "Confidentialité et Données", ar: "الخصوصية والبيانات" },
  "Language": { fr: "Langue", ar: "اللغة" },
  "Profile Information": { fr: "Informations du Profil", ar: "معلومات الملف الشخصي" },
  "Update your public profile and institutional details.": {
    fr: "Mettez à jour votre profil public et vos informations institutionnelles.",
    ar: "تحديث ملفك الشخصي العام وتفاصيل المؤسسة الأكاديمية."
  },
  "Security": { fr: "Sécurité", ar: "الأمان" },
  "Two-Factor Authentication": { fr: "Authentification à Deux Facteurs", ar: "المصادقة الثنائية (2FA)" },
  "Add an extra layer of security to your account.": {
    fr: "Ajoutez une couche de sécurité supplémentaire à votre compte.",
    ar: "إضافة طبقة حماية إضافية لحسابك."
  },
  "Theme Preferences": { fr: "Préférences de Thème", ar: "تفضيلات المظهر" },
  "Customize how EduSphere AI looks on your device.": {
    fr: "Personnalisez l'apparence d'EduSphere AI sur votre appareil.",
    ar: "تخصيص مظهر EduSphere AI على جهازك."
  },
  "Researcher avatar": { fr: "Avatar du chercheur", ar: "صورة الباحث" },

  /* ── AUTH PAGES ── */
  "Academic Excellence Platform": { fr: "Plateforme d'Excellence Académique", ar: "منصة التميز الأكاديمي" },
  "Empowering the": { fr: "Autonomiser la", ar: "تمكين" },
  "next generation": { fr: "prochaine génération", ar: "الجيل القادم" },
  "of scholars.": { fr: "de savants.", ar: "من العلماء." },
  "AI-integrated learning tools built for modern academic excellence — from personalized pathways to real-time tutoring.": {
    fr: "Des outils d'apprentissage intégrés à l'IA conçus pour l'excellence académique moderne.",
    ar: "أدوات تعلم مدمجة بالذكاء الاصطناعي مصممة للتميز الأكاديمي الحديث."
  },
  "AI Tutor Active": { fr: "Tuteur IA Actif", ar: "المدرس الذكي نشط" },
  "Answering 42 questions now": { fr: "Répond à 42 questions maintenant", ar: "يجيب على 42 سؤالاً الآن" },
  "Instructor Registration": { fr: "Inscription Formateur", ar: "تسجيل المحاضر" },
  "Setting up your faculty profile — this takes about 2 minutes.": {
    fr: "Configuration de votre profil de faculté — cela prend environ 2 minutes.",
    ar: "إعداد ملف هيئة التدريس الخاص بك — يستغرق ذلك حوالي دقيقتين."
  },
  "Tell us about your role": { fr: "Parlez-nous de votre rôle", ar: "أخبرنا عن دورك" },
  "This helps us tailor your course management tools, research assistant, and student analytics to your academic profile.": {
    fr: "Cela nous aide à personnaliser vos outils de gestion de cours selon votre profil académique.",
    ar: "يساعدنا هذا في تخصيص أدوات إدارة المقررات ومساعد البحث وتحليلات الطلاب لملفك الأكاديمي."
  },
  "Full Name": { fr: "Nom Complet", ar: "الاسم الكامل" },
  "University / Institution": { fr: "Université / Établissement", ar: "الجامعة / المؤسسة" },
  "Department / Faculty": { fr: "Département / Faculté", ar: "القسم / الكلية" },
  "Academic Position": { fr: "Poste Académique", ar: "المنصب الأكاديمي" },
  "Research Specializations": { fr: "Spécialisations de Recherche", ar: "التخصصات البحثية" },
  "Short Bio": { fr: "Courte Biographie", ar: "سيرة ذاتية مختصرة" },
  "Previous": { fr: "Précédent", ar: "السابق" },
  "Creating account...": { fr: "Création du compte...", ar: "جاري إنشاء الحساب..." },
  "Professor": { fr: "Professeur", ar: "بروفيسور" },
  "Assoc. Professor": { fr: "Prof. Associé", ar: "أستاذ مشارك" },
  "Asst. Professor": { fr: "Prof. Adjoint", ar: "أستاذ مساعد" },
  "Lecturer": { fr: "Chargé de Cours", ar: "محاضر" },
  "Researcher": { fr: "Chercheur", ar: "باحث" },
  "Adjunct / Visiting": { fr: "Adjoint / Visiteur", ar: "أستاذ متعاون / زائر" },
  "Select your institution": { fr: "Sélectionnez votre établissement", ar: "اختر مؤسستك" },
  "Type a field and press Enter (e.g. Machine Learning)": {
    fr: "Tapez un domaine et appuyez sur Entrée (ex. Apprentissage Automatique)",
    ar: "اكتب مجالاً واضغط Enter (مثال: تعلم الآلة)"
  },
  "Add your research areas, e.g. \"Neural Networks\", \"Computational Linguistics\", \"Quantum Computing\".": {
    fr: "Ajoutez vos domaines de recherche, ex. \"Réseaux de Neurones\", \"Linguistique Computationnelle\".",
    ar: "أضف مجالات بحثك، مثال: \"الشبكات العصبية\"، \"اللغويات الحاسوبية\"، \"الحوسبة الكمية\"."
  },
  "Share a bit about your academic background and teaching philosophy...": {
    fr: "Parlez un peu de votre parcours académique et de votre philosophie d'enseignement...",
    ar: "شارك قليلاً عن خلفيتك الأكاديمية وفلسفتك التعليمية..."
  },
  "Tell us about your studies": { fr: "Parlez-nous de vos études", ar: "أخبرنا عن دراستك" },
  "This helps us tailor your AI research assistant and library access to your specific academic needs.": {
    fr: "Cela nous aide à personnaliser votre assistant de recherche IA selon vos besoins académiques spécifiques.",
    ar: "يساعدنا هذا في تخصيص مساعد البحث الذكي وصول المكتبة لاحتياجاتك الأكاديمية المحددة."
  },
  "Finalizing Setup...": { fr: "Finalisation...", ar: "جاري الإنهاء..." },
  "Finish Setup & Go to Dashboard": { fr: "Terminer la Configuration et Aller au Tableau de Bord", ar: "أنهِ الإعداد واذهب إلى لوحة القيادة" },
  "Areas of Academic Interest": { fr: "Domaines d'Intérêt Académique", ar: "مجالات الاهتمام الأكاديمي" },
  "(Select all that apply)": { fr: "(Sélectionnez tout ce qui s'applique)", ar: "(اختر كل ما ينطبق)" },
  "AI Assistant Personality Tone": { fr: "Ton de Personnalité de l'Assistant IA", ar: "نبرة شخصية مساعد الذكاء الاصطناعي" },
  "Academic & Rigorous": { fr: "Académique et Rigoureux", ar: "أكاديمي ودقيق" },
  "Detailed, cited answers": { fr: "Réponses détaillées et citées", ar: "إجابات مفصلة ومستشهد بها" },
  "Encouraging & Warm": { fr: "Encourageant et Chaleureux", ar: "مشجع ودافئ" },
  "Positive study companion": { fr: "Compagnon d'étude positif", ar: "رفيق دراسة إيجابي" },
  "Direct & Concise": { fr: "Direct et Concis", ar: "مباشر وموجز" },
  "Fast, straight-to-the-point": { fr: "Rapide et direct au but", ar: "سريع ومباشر" },

  /* ── ONBOARDING FIELDS ── */
  "Artificial Intelligence": { fr: "Intelligence Artificielle", ar: "الذكاء الاصطناعي" },
  "Machine Learning": { fr: "Apprentissage Automatique", ar: "تعلم الآلة" },
  "Data Science": { fr: "Science des Données", ar: "علم البيانات" },
  "Software Engineering": { fr: "Génie Logiciel", ar: "هندسة البرمجيات" },
  "Cyber Security": { fr: "Cybersécurité", ar: "الأمن السيبراني" },
  "Cloud Computing": { fr: "Informatique en Nuage", ar: "الحوسبة السحابية" },
  "Human-Computer Interaction": { fr: "Interaction Homme-Machine", ar: "التفاعل بين الإنسان والحاسوب" },
  "Robotics": { fr: "Robotique", ar: "الروبوتات" },
  "AI Ethics": { fr: "Éthique de l'IA", ar: "أخلاقيات الذكاء الاصطناعي" },

  /* ── SMART TRANSLATOR ── */
  "Smart Translation Center": { fr: "Centre de Traduction Intelligent", ar: "مركز الترجمة الأكاديمية الذكي" },
  "Source Text": { fr: "Texte Source", ar: "النص الأصلي" },
  "Translated Text": { fr: "Texte Traduit", ar: "النص المترجم" },
  "Translate": { fr: "Traduire", ar: "ترجم" },
  "Translating...": { fr: "Traduction...", ar: "جاري الترجمة..." },
  "Enter academic text to translate...": {
    fr: "Entrez le texte académique à traduire...",
    ar: "أدخل النص الأكاديمي المراد ترجمته..."
  },

  /* ── ACTIVITY FEED STRINGS ── */
  "New submission": { fr: "Nouvelle soumission", ar: "تسليم جديد" },
  "Forum question": { fr: "Question du forum", ar: "سؤال المنتدى" },
  "Grade pending": { fr: "Note en attente", ar: "الدرجة معلقة" },
  "Student alert": { fr: "Alerte étudiant", ar: "تنبيه طالب" },

  /* ── COMMON BUTTONS / LABELS ── */
  "Submit": { fr: "Envoyer", ar: "إرسال" },
  "Add": { fr: "Ajouter", ar: "إضافة" },
  "Send": { fr: "Envoyer", ar: "إرسال" },
  "Search": { fr: "Rechercher", ar: "بحث" },
  "Close": { fr: "Fermer", ar: "إغلاق" },
  "Overview": { fr: "Aperçu", ar: "نظرة عامة" },
  "Status": { fr: "Statut", ar: "الحالة" },
  "Score": { fr: "Score", ar: "النتيجة" },
  "High": { fr: "Haute", ar: "عالي" },
  "Medium": { fr: "Moyenne", ar: "متوسط" },
  "Low": { fr: "Basse", ar: "منخفض" },
  "Priority": { fr: "Priorité", ar: "الأولوية" },
  "Details": { fr: "Détails", ar: "التفاصيل" },
  "Reset": { fr: "Réinitialiser", ar: "إعادة تعيين" },
  "Upload": { fr: "Téléverser", ar: "تحميل" },
  "Download": { fr: "Télécharger", ar: "تنزيل" },
  "English": { fr: "Anglais", ar: "الإنجليزية" },
  "French": { fr: "Français", ar: "الفرنسية" },
  "Arabic": { fr: "Arabe", ar: "العربية" },
  "Student": { fr: "Étudiant", ar: "طالب" },
  "Teacher": { fr: "Enseignant", ar: "أستاذ" },
  "Instructor": { fr: "Formateur", ar: "محاضر" },

  /* ── LANDING PAGE ── */
  "Your Intelligent University Companion": {
    fr: "Votre Compagnon Universitaire Intelligent",
    ar: "رفيقك الجامعي الذكي"
  },
  "Next-Gen Academic Intelligence": {
    fr: "Intelligence Académique Nouvelle Génération",
    ar: "الذكاء الأكاديمي من الجيل القادم"
  },
  "Start Learning Free": { fr: "Commencer Gratuitement", ar: "ابدأ التعلم مجاناً" },
  "Explore Features": { fr: "Explorer les Fonctionnalités", ar: "استكشف الميزات" },
  "Everything you need to excel academically": {
    fr: "Tout ce dont vous avez besoin pour exceller académiquement",
    ar: "كل ما تحتاجه للتميز الأكاديمي"
  },
  "Ready to transform your academic journey?": {
    fr: "Prêt à transformer votre parcours académique ?",
    ar: "هل أنت مستعد لتحويل مسيرتك الأكاديمية؟"
  },
  "Create Free Account": { fr: "Créer un Compte Gratuit", ar: "إنشاء حساب مجاني" },
  "For Students": { fr: "Pour Étudiants", ar: "للطلاب" },
  "For Teachers": { fr: "Pour Enseignants", ar: "للأساتذة" },
  "Sign In": { fr: "Connexion", ar: "تسجيل الدخول" },
  "Home": { fr: "Accueil", ar: "الرئيسية" },
  "Get Started": { fr: "Commencer", ar: "ابدأ الآن" },

  /* ── TEACHER PROFILE ── */
  "Office Hours": { fr: "Heures de Bureau", ar: "ساعات المكتب" },
  "Teaching Load": { fr: "Charge d'Enseignement", ar: "عبء التدريس" },
  "Publications": { fr: "Publications", ar: "المنشورات" },
  "Specializations": { fr: "Spécialisations", ar: "التخصصات" },
  "Bio": { fr: "Biographie", ar: "السيرة الذاتية" },
};
