"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

export default function InstructorDashboard() {
  const router = useRouter();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [insightVisible, setInsightVisible] = useState(true);
  const [user, setUser] = useState({ fullName: "Instructor" });

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 300);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (e) {}
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const [stats, setStats] = useState([
    { label: "Total Students", value: "342", change: "+28 this month", icon: "group", grad: "from-[#002045] to-[#1a365d]", accent: "#62fae3" },
    { label: "Active Courses", value: "8", change: "2 published today", icon: "school", grad: "from-[#006b5f] to-[#007165]", accent: "#d1fae5" },
    { label: "Avg. Engagement", value: "74%", change: "+5% vs last week", icon: "trending_up", grad: "from-[#09007b] to-[#3730a3]", accent: "#c0c1ff" },
    { label: "Pending Reviews", value: "14", change: "Due this week", icon: "rate_review", grad: "from-[#ba1a1a] to-[#c62828]", accent: "#ffdad6" },
  ]);

  const [courses, setCourses] = useState([
    { name: "CS-402: Operating Systems", students: 128, completion: 85, pending: 2, color: "#002045", tag: "Advanced" },
    { name: "CS-520: Machine Learning", students: 64, completion: 42, pending: 0, color: "#006b5f", tag: "Seminar" },
    { name: "CS-301: Data Structures", students: 98, completion: 60, pending: 3, color: "#09007b", tag: "Core" },
    { name: "CS-415: Network Security", students: 52, completion: 78, pending: 0, color: "#1a365d", tag: "Elective" },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: "New submission", detail: "Alex Sterling submitted OS Assignment 4", time: "10 min ago", icon: "assignment_turned_in", color: "#006b5f" },
    { action: "Forum question", detail: "3 new questions in CS-520 discussion", time: "1h ago", icon: "forum", color: "#09007b" },
    { action: "Grade pending", detail: "ML Project grading due tomorrow", time: "2h ago", icon: "grading", color: "#ba1a1a" },
    { action: "Student alert", detail: "Jordan Smith below 70% threshold", time: "3h ago", icon: "warning", color: "#f59e0b" },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const resAnalytics = await fetch("http://localhost:5000/api/analytics/teacher", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resAnalytics.ok) {
          const data = await resAnalytics.json();
          setStats([
            { label: "Total Students", value: String(data.summary.totalStudents), change: "Active across all modules", icon: "group", grad: "from-[#002045] to-[#1a365d]", accent: "#62fae3", route: "/teacher/student-analytics" },
            { label: "Active Courses", value: String(data.summary.activeCourses), change: "Published in database", icon: "school", grad: "from-[#006b5f] to-[#007165]", accent: "#d1fae5", route: "/teacher/course-management" },
            { label: "Avg. Engagement", value: `${data.summary.avgEngagement}%`, change: "Real-time participation", icon: "trending_up", grad: "from-[#09007b] to-[#3730a3]", accent: "#c0c1ff", route: "/teacher/performance-analytics" },
            { label: "Pending Reviews", value: String(data.summary.pendingGrades), change: "Click to grade now", icon: "rate_review", grad: "from-[#ba1a1a] to-[#c62828]", accent: "#ffdad6", route: "/teacher/course-management" },
          ]);
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses.map((c, i) => ({
              ...c,
              color: c.color || ["#002045","#006b5f","#09007b","#1a365d"][i % 4],
              tag: ["Advanced","Seminar","Core","Elective"][i % 4],
            })));
          }
        }

        // Load real recent submissions as activity
        const notifRes = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          if (notifs.length > 0) {
            setRecentActivity(notifs.slice(0, 4).map(n => ({
              action: n.title,
              detail: n.message,
              time: new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              icon: n.icon || "notifications",
              color: n.iconColor || "#006b5f",
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }
    loadData();
  }, []);

  const firstName = user.fullName?.split(" ")[0] || "Instructor";

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .card-anim { animation: fadeUp 0.4s ease-out forwards; }
        .card-anim:nth-child(1){animation-delay:0.05s}
        .card-anim:nth-child(2){animation-delay:0.10s}
        .card-anim:nth-child(3){animation-delay:0.15s}
        .card-anim:nth-child(4){animation-delay:0.20s}
        .stat-card { position:relative; overflow:hidden; }
        .stat-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%); pointer-events:none; }
        .glass-card { background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.6); }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Instructor Dashboard" />

        <main className="flex-1 flex flex-col">

          {/* ── Hero Welcome Banner ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
            {/* Mesh overlays */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)` }} />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#09007b,transparent 70%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 max-w-[1280px] mx-auto">
              <div>
                <p className="text-[#62fae3] text-[12px] font-bold tracking-widest uppercase mb-2">Teaching Dashboard</p>
                <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold leading-tight">
                  Welcome back, <span className="text-[#62fae3]">{firstName}</span>
                </h1>
                <p className="text-[#d6e3ff] text-[15px] mt-2 max-w-md">Here's your teaching snapshot for today. Keep inspiring!</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => router.push('/teacher/course-management')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#62fae3] text-[#007165] rounded-xl text-[13px] font-bold hover:bg-white transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  New Course
                </button>
                <button
                  onClick={() => router.push('/teacher/ask-ai')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white border border-white/25 rounded-xl text-[13px] font-semibold hover:bg-white/25 transition-all backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
                  Ask AI
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-8 -mt-6">

            {/* ── Stats Cards ── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  onClick={() => stat.route && router.push(stat.route)}
                  className={`stat-card card-anim bg-gradient-to-br ${stat.grad} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${stat.route ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: stat.accent + "cc" }}>{stat.label}</span>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: stat.accent, fontVariationSettings:"'FILL' 1" }}>{stat.icon}</span>
                    </div>
                  </div>
                  <p className="text-white font-['Sora'] text-[32px] font-bold leading-none mb-1">{stat.value}</p>
                  <p className="text-[11px] font-medium" style={{ color: stat.accent + "99" }}>{stat.change}</p>
                </div>
              ))}
            </section>

            {/* ── Main Grid: Courses + Activity ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Active Courses */}
              <section className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Sora'] text-[20px] font-semibold text-[#002045]">Active Courses</h3>
                  <button
                    onClick={() => router.push('/teacher/course-management')}
                    className="text-[12px] font-bold text-[#006b5f] hover:underline flex items-center gap-1"
                  >
                    Manage all <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {courses.map((course, i) => (
                    <div
                      key={course.name}
                      className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => router.push('/teacher/course-management')}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md" style={{ background: `linear-gradient(135deg,${course.color},${course.color}aa)` }}>
                          <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings:"'FILL' 1" }}>menu_book</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-['Sora'] text-[15px] font-semibold text-[#002045] truncate group-hover:text-[#006b5f] transition-colors">{course.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0" style={{ backgroundColor: course.color }}>{course.tag}</span>
                          </div>
                          <p className="text-[12px] text-[#74777f]">{course.students} enrolled students</p>
                        </div>
                        {course.pending > 0 && (
                          <span className="px-2.5 py-1 bg-[#ffdad6] text-[#ba1a1a] rounded-full text-[10px] font-bold shrink-0">{course.pending} pending</span>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-semibold text-[#74777f]">Syllabus Progress</span>
                          <span className="text-[12px] font-bold text-[#002045]">{course.completion}%</span>
                        </div>
                        <div className="h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: animateProgress ? `${course.completion}%` : "0%", backgroundColor: course.color }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={e => { e.stopPropagation(); router.push('/teacher/course-management'); }}
                          className="flex-1 py-2 border border-[#c4c6cf] text-[#43474e] hover:bg-[#f2f4f6] hover:border-[#002045] rounded-lg text-[11px] font-semibold transition-all"
                        >
                          Manage Tasks
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); router.push('/teacher/ask-ai'); }}
                          className="flex-1 py-2 bg-gradient-to-r from-[#002045] to-[#006b5f] text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 hover:opacity-90 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
                          AI Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activity Feed */}
              <section className="space-y-4">
                <h3 className="font-['Sora'] text-[20px] font-semibold text-[#002045]">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: item.color + "18" }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: item.color, fontVariationSettings:"'FILL' 1" }}>{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-[#002045] mb-0.5">{item.action}</p>
                          <p className="text-[12px] text-[#43474e] leading-snug">{item.detail}</p>
                          <p className="text-[10px] text-[#74777f] mt-1 font-medium">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insights Banner */}
                {insightVisible && (
                  <div className="relative rounded-2xl p-5 overflow-hidden" style={{ background:"linear-gradient(135deg,rgba(0,107,95,0.08),rgba(98,250,227,0.12))", border:"1px solid rgba(0,107,95,0.2)" }}>
                    <button onClick={() => setInsightVisible(false)} className="absolute top-3 right-3 text-[#43474e] hover:text-[#002045] w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings:"'FILL' 1" }}>lightbulb</span>
                      </div>
                      <div className="pr-4">
                        <p className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider mb-1">AI Insight</p>
                        <p className="text-[12px] text-[#43474e] leading-relaxed">CS-402 has a 15% drop in participation. Generate a review session to re-engage students.</p>
                        <button
                          onClick={() => router.push('/teacher/ask-ai')}
                          className="mt-3 px-4 py-1.5 bg-[#002045] text-white text-[11px] font-semibold rounded-lg hover:bg-[#006b5f] transition-all"
                        >
                          Review Suggestions
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
