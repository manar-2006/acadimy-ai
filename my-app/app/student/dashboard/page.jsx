"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function StudentDashboard() {
  const { t } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [userName, setUserName] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, text: "OS Lecture Notes review",    completed: true  },
    { id: 2, text: "Submit Python Lab 4",         completed: true  },
    { id: 3, text: "Data Structures: Hash Maps",  completed: false },
    { id: 4, text: "Ethics in AI reading",        completed: false },
  ]);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  useEffect(() => {
    // Load user name from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const first = (u.fullName || '').split(' ')[0];
        if (first) setUserName(first);
      } catch (e) {}
    }

    async function loadDashboardData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Load courses
        const resCourses = await fetch("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resCourses.ok) {
          setCourses(await resCourses.json());
        }

        // Load assignments across courses
        const resAssignments = await fetch("http://localhost:5000/api/courses/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resAssignments.ok) {
          setAssignments(await resAssignments.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingAssignments(false);
      }
    }
    loadDashboardData();
  }, []);

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setSavingTask(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/planner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ title: newTaskText.trim(), date: new Date().toISOString().split('T')[0], time: '12:00', type: 'MEDIUM' })
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(prev => [...prev, { id: data.id, text: data.title, completed: false }]);
        } else {
          setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
        }
      } else {
        setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
      }
    } catch {
      setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
    } finally {
      setNewTaskText('');
      setAddingTask(false);
      setSavingTask(false);
    }
  };

  const completedPct = tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0;

  const pendingAssignments = assignments.filter(a => !a.submitted);

  const statCards = [
    { label: t("gpaScore"),      value: "3.8", meta: "+0.2 this semester", icon: "star",       accent: "#006b5f" },
    { label: t("activeCourses"), value: String(courses.length), meta: courses.length > 0 ? "Real enrolled courses" : "None enrolled yet", icon: "school", accent: "#002045" },
    { label: t("studyHours"),    value: "24h", meta: "This week",          icon: "timer",      accent: "#09007b" },
    { label: t("assignments"),    value: String(pendingAssignments.length), meta: pendingAssignments.length > 0 ? "Awaiting submission" : "All caught up!", icon: "assignment", accent: "#ba1a1a" },
  ];

  const upcomingTasks = pendingAssignments.slice(0, 3).map((a) => {
    const isOverdue = new Date(a.dueDate) < new Date();
    return {
      title: a.title,
      course: a.courseCode || "Course",
      time: new Date(a.dueDate).toLocaleDateString() + " " + new Date(a.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: isOverdue ? "OVERDUE" : "PENDING",
      badgeBg: isOverdue ? "#fde8e8" : "#fff3e0",
      badgeText: isOverdue ? "#ba1a1a" : "#e65100",
      dot: isOverdue ? "#ba1a1a" : "#ff9800",
      link: "/student/courses"
    };
  });

  const quickAccess = [
    { icon: "picture_as_pdf", label: t("pdfAnalyzer"),  color: "#ba1a1a", bg: "#fde8e8", href: "/student/smart-pdf-analyzer" },
    { icon: "translate",      label: t("smartTranslator"),    color: "#09007b", bg: "#e8e8ff", href: "/student/smart-translator" },
    { icon: "calendar_month", label: t("studyPlanner"), color: "#006b5f", bg: "#e0f5f2", href: "/student/study-planner" },
    { icon: "work_history",   label: t("careerCenter"),    color: "#e65100", bg: "#fff3e0", href: "/student/career-center" },
    { icon: "badge",          label: t("internshipsJobs"),          color: "#c62784", bg: "#fde8f5", href: "/student/internships-jobs" },
    { icon: "analytics",      label: t("performance"),   color: "#002045", bg: "#e8eaf6", href: "/student/performance-analytics" },
    { icon: "groups",         label: t("clubsEvents"),         color: "#3949ab", bg: "#e8eaf6", href: "/student/clubs-events" },
    { icon: "workspace_premium", label: t("certificates"), color: "#f9a825", bg: "#fffde7", href: "/student/certificates-center" },
    { icon: "auto_stories",   label: t("aiAssistant"),        color: "#006b5f", bg: "#e0f5f2", href: "/student/academic-assistant" },
    { icon: "quiz",           label: t("quizFlashcards"),    color: "#002045", bg: "#f0f2f5", href: "/student/quiz-flashcards" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href={FONTS} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeInUp .45s ease-out forwards; }
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; vertical-align:middle; }
        .progress-bar-track { background:#e6e8ea; border-radius:4px; height:5px; }
        .progress-bar-fill  { height:100%; border-radius:4px; transition:width .6s ease; }
      ` }} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Dashboard" />

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto">
            <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">{t('studentHub')}</p>
            <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">{t('welcomeBack')}{userName ? `, ${userName}` : ''} 👋</h1>
            <p className="text-[#d6e3ff] text-[14px]">You've completed <span className="text-[#62fae3] font-bold">{completedPct}%</span> of today's tasks. Keep the momentum going!</p>
          </div>
        </div>

        {/* ── Page Content ── */}
        <div className="px-6 md:px-8 pb-12 pt-6 max-w-[1280px] mx-auto w-full">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-up">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#74777f]">{card.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.accent}18` }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: card.accent, fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  </div>
                </div>
                <p className="font-['Sora'] text-[28px] font-bold text-[#002045] leading-none">{card.value}</p>
                <p className="text-[11px] text-[#74777f] mt-1">{card.meta}</p>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
            {/* Left */}
            <div className="space-y-5">

              {/* Active Courses */}
              <section className="fade-up" style={{ animationDelay: ".05s" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-['Sora'] text-[16px] font-bold text-[#002045]">{t('activeCourses')}</h2>
                  <Link href="/student/courses" className="flex items-center gap-1 text-[12px] font-semibold text-[#006b5f] hover:opacity-70 transition-opacity">
                    {t('viewAll')} <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
                  </Link>
                </div>
                {loading ? (
                  <div className="bg-white rounded-2xl border border-[#e0e3e5] p-8 text-center">
                    <div className="w-8 h-8 border-4 border-[#006b5f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[13px] text-[#74777f]">{t('loading')}</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#e0e3e5] p-8 text-center">
                    <span className="material-symbols-outlined text-[40px] text-[#c4c6cf]">school</span>
                    <p className="text-[14px] font-semibold text-[#43474e] mt-3">No courses enrolled yet.</p>
                    <Link href="/student/courses" className="inline-block mt-4 px-5 py-2 bg-[#006b5f] text-white rounded-lg text-[12px] font-bold hover:bg-[#005047] transition-colors">Browse Courses</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((course) => (
                      <div key={course.id} className="relative overflow-hidden bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-4 hover:shadow-md transition-shadow" style={{ borderTop: `3px solid ${course.color || '#002045'}` }}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="rounded-lg bg-[#eceef0] px-2 py-0.5 text-[10px] font-bold text-[#43474e]">{course.code}</span>
                          <span className="text-[10px] text-[#74777f]">{course.schedule}</span>
                        </div>
                        <h3 className="font-['Sora'] text-[14px] font-bold text-[#002045] mb-3">{course.name}</h3>
                        <div className="flex justify-between text-[11px] text-[#43474e] mb-1">
                          <span>{t('progress')}</span>
                          <span className="font-bold text-[#006b5f]">{course.progress || 65}%</span>
                        </div>
                        <div className="progress-bar-track mb-3">
                          <div className="progress-bar-fill" style={{ width: `${course.progress || 65}%`, background: course.color || "#002045" }} />
                        </div>
                        <Link href="/student/courses" className="flex items-center justify-center gap-1 w-full py-2 rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] text-[11px] font-semibold text-[#43474e] hover:bg-[#e6e8ea] transition-colors">
                          {t('enterCourse')} <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Access */}
              <section className="fade-up" style={{ animationDelay: ".1s" }}>
                <h2 className="font-['Sora'] text-[16px] font-bold text-[#002045] mb-3">{t('quickAccess')}</h2>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {quickAccess.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-[#e0e3e5] p-3 text-center hover:shadow-md hover:border-[#c4c6cf] transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-[#43474e] leading-tight">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Progress Tracker */}
              <section className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-5 fade-up" style={{ animationDelay: ".15s" }}>
                <h2 className="font-['Sora'] text-[16px] font-bold text-[#002045] mb-5">{t('progressTracker')}</h2>
                <div className="flex items-center justify-around">
                  {[
                    { label: t("courseCompletion"), value: 75, color: "#006b5f", offset: 75.4 },
                    { label: t("studyHoursTarget"), value: 62, color: "#002045", offset: 114.6 },
                  ].map((ring) => (
                    <div key={ring.label} className="flex flex-col items-center gap-2">
                      <div className="relative h-28 w-28">
                        <svg viewBox="0 0 112 112" className="-rotate-90 h-full w-full">
                          <circle cx="56" cy="56" r="48" fill="transparent" stroke="#e6e8ea" strokeWidth="10" />
                          <circle cx="56" cy="56" r="48" fill="transparent" stroke={ring.color} strokeWidth="10"
                            strokeDasharray="301.6" strokeDashoffset={ring.offset} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-['Sora'] text-[20px] font-bold text-[#002045]">{ring.value}%</span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#43474e]">{ring.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="space-y-4">

              {/* Upcoming Tasks */}
              <section className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-4 fade-up" style={{ animationDelay: ".05s" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-['Sora'] text-[14px] font-bold text-[#002045]">{t('upcomingTasks')}</h2>
                  <Link href="/student/study-planner" className="flex items-center gap-1 text-[12px] font-semibold text-[#006b5f]">
                    {t('planner')} <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </Link>
                </div>
                <div className="space-y-0">
                  {upcomingTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#74777f]">
                      <span className="material-symbols-outlined text-2xl text-[#006b5f] mb-1">done_all</span>
                      <p>{t('allCaughtUp')}</p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <Link href={task.link} key={task.title} className="flex items-start gap-3 border-b border-[#f0f2f4] py-3 last:border-none hover:bg-[#eceef0]/40 rounded px-2 transition-colors block">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: task.dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-[#191c1e] truncate">{task.title}</span>
                            <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: task.badgeBg, color: task.badgeText }}>{task.priority}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#74777f]">
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                            {task.time} · {task.course}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>

              {/* AI Insight */}
              <section className="rounded-2xl p-4 fade-up" style={{ animationDelay: ".1s", background: "linear-gradient(135deg,#002045,#006b5f)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#62fae3] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#62fae3]">{t('aiInsight')}</span>
                </div>
                <p className="text-[12px] leading-relaxed text-white/70 mb-4">Your performance in Machine Learning is exceptional. Focus 2 more hours on Data Structures this week.</p>
                <Link href="/student/academic-assistant" className="flex items-center gap-2 rounded-lg bg-[#62fae3] px-4 py-2 text-[11px] font-bold text-[#002045] hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>chat</span>
                  {t('askAiAssistant')}
                  <span className="material-symbols-outlined ml-auto" style={{ fontSize: 14 }}>arrow_forward</span>
                </Link>
              </section>

              {/* Today's Tasks */}
              <section className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-4 fade-up" style={{ animationDelay: ".15s" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-['Sora'] text-[14px] font-bold text-[#002045]">{t('todaysTasks')}</h2>
                  <span className="text-[11px] font-bold text-[#006b5f]">{completedPct}%</span>
                </div>
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li key={task.id} onClick={() => toggleTask(task.id)} className="group flex cursor-pointer items-center gap-3">
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${task.completed ? "border-[#006b5f] bg-[#006b5f]" : "border-[#c4c6cf] group-hover:border-[#006b5f]"}`}>
                        {task.completed && <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>}
                      </div>
                      <span className={`text-[12px] transition-all ${task.completed ? "text-[#888] line-through" : "text-[#191c1e] font-medium"}`}>{task.text}</span>
                    </li>
                  ))}
                </ul>
                {addingTask ? (
                  <form onSubmit={handleAddTask} className="mt-4">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={newTaskText}
                        onChange={e => setNewTaskText(e.target.value)}
                        placeholder={t('newTaskPlaceholder')}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#c4c6cf] text-[12px] outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
                      />
                      <button
                        type="submit"
                        disabled={savingTask || !newTaskText.trim()}
                        className="px-3 py-2 bg-[#006b5f] text-white rounded-lg text-[12px] font-semibold hover:bg-[#005047] transition-colors disabled:opacity-50"
                      >
                        {savingTask ? '...' : t('add')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAddingTask(false); setNewTaskText(''); }}
                        className="px-3 py-2 text-[#74777f] rounded-lg text-[12px] hover:bg-[#f0f2f4] transition-colors"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingTask(true)}
                    className="mt-4 w-full rounded-xl border border-dashed border-[#c4c6cf] py-2 text-[11px] font-semibold text-[#74777f] hover:bg-[#f0f2f4] hover:border-[#006b5f] hover:text-[#006b5f] transition-colors"
                  >
                    + {t('addTask')}
                  </button>
                )}
              </section>

              {/* Mini Calendar */}
              <section className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-4 fade-up" style={{ animationDelay: ".2s" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#002045]">Week 12</h2>
                  <div className="flex gap-1">
                    <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#e6e8ea]"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_left</span></button>
                    <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#e6e8ea]"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-[#74777f]">{d}</div>
                  ))}
                  {[12,13,14,15,16,17,18].map((day) => (
                    <div key={day} className={`relative flex h-8 cursor-pointer items-center justify-center rounded-lg text-[12px] transition-colors hover:bg-[#e6e8ea] ${day === 13 ? "bg-[#006b5f]/10 font-bold text-[#006b5f]" : ""}`}>
                      {day}
                      {day === 15 && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#ba1a1a]" />}
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1 border-t border-[#e0e3e5] pt-3">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ba1a1a]" /><span className="text-[11px] font-semibold text-[#43474e]">Midterm: Oct 15</span></div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#006b5f]" /><span className="text-[11px] font-semibold text-[#43474e]">Group Study: Oct 13</span></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
