"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function StudentPerformanceAnalytics() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  const [data, setData] = useState({
    weeklyStudyHours: [
      { day: 'Mon', hours: 3.5 },
      { day: 'Tue', hours: 5 },
      { day: 'Wed', hours: 2 },
      { day: 'Thu', hours: 4 },
      { day: 'Fri', hours: 6 },
      { day: 'Sat', hours: 1.5 },
      { day: 'Sun', hours: 2.5 },
    ],
    coursePerformance: [
      { course: 'CS-402: Operating Systems', score: 84, assignments: 12, completed: 10, color: '#002045' },
      { course: 'CS-520: Machine Learning', score: 91, assignments: 8, completed: 8, color: '#006b5f' },
      { course: 'CS-301: Data Structures', score: 77, assignments: 15, completed: 12, color: '#09007b' },
    ],
    recentActivity: [
      { date: 'Today', type: 'quiz', description: 'Completed Neural Networks Quiz – 88%', icon: 'quiz' },
      { date: 'Yesterday', type: 'upload', description: 'Uploaded OS lecture slides for analysis', icon: 'upload_file' },
      { date: '2 days ago', type: 'planner', description: 'Added study session for Data Structures', icon: 'calendar_month' },
    ],
    streakDays: 7,
    totalHoursThisWeek: 24.5,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        const res = await fetch('http://localhost:5000/api/analytics/student', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const fetched = await res.json();
          const enhancedPerformance = (fetched.coursePerformance || []).map(cp => {
            let fullName = cp.course;
            let color = '#002045';
            if (cp.course === 'CS-402') { fullName = 'CS-402: Operating Systems'; color = '#002045'; }
            if (cp.course === 'CS-520') { fullName = 'CS-520: Machine Learning'; color = '#006b5f'; }
            if (cp.course === 'CS-301') { fullName = 'CS-301: Data Structures'; color = '#09007b'; }
            return { ...cp, course: fullName, color };
          });
          setData({
            weeklyStudyHours: fetched.weeklyStudyHours || data.weeklyStudyHours,
            coursePerformance: enhancedPerformance.length > 0 ? enhancedPerformance : data.coursePerformance,
            recentActivity: fetched.recentActivity || data.recentActivity,
            streakDays: fetched.streakDays || data.streakDays,
            totalHoursThisWeek: fetched.totalHoursThisWeek || data.totalHoursThisWeek,
          });
        }
      } catch (err) {
        console.error('Failed to load student analytics:', err);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      }
    }
    fetchAnalytics();
  }, []);

  const maxHours = Math.max(...data.weeklyStudyHours.map(h => h.hours), 1);
  const avgScore = Math.round(data.coursePerformance.reduce((a, c) => a + c.score, 0) / data.coursePerformance.length);

  const summaryStats = [
    { label: "Weekly Study", value: `${data.totalHoursThisWeek}h`, icon: "schedule", sub: "+4.2h vs last week", subColor: "#006b5f", grad: "from-[#002045] to-[#1a365d]", accent: "#62fae3" },
    { label: "Study Streak", value: `${data.streakDays}d`, icon: "local_fire_department", sub: "Keep it up! 🔥", subColor: "#f59e0b", grad: "from-[#e65100] to-[#f59e0b]", accent: "#fff3e0" },
    { label: "Avg. Score", value: `${avgScore}%`, icon: "school", sub: "Across all courses", subColor: "#43474e", grad: "from-[#006b5f] to-[#009688]", accent: "#d1fae5" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim { animation: fadeUp 0.45s ease-out forwards; opacity:0; }
        @keyframes barGrow { from{height:0%} to{height:var(--bar-h)} }
        .bar-grow { animation: barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .glass-card { background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.6); }
        .stat-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 60%); pointer-events:none; }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-grow lg:ml-64 flex flex-col min-h-screen">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Performance" />

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#1a365d] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto">
            <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Academic Insights</p>
            <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">My Performance Analytics</h1>
            <p className="text-[#d6e3ff] text-[14px]">Track your study momentum, quiz results, and course milestones.</p>
          </div>
        </div>

        <main className="flex-grow px-6 md:px-8 pb-12 max-w-[1280px] mx-auto w-full -mt-6 space-y-6">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#002045] border-t-transparent animate-spin" />
              <p className="text-[#43474e] font-medium">Loading your analytics…</p>
            </div>
          ) : (
            <>
              {/* ── Summary Stats ── */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {summaryStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`anim relative overflow-hidden bg-gradient-to-br ${stat.grad} stat-card rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: stat.accent + "bb" }}>{stat.label}</span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"rgba(255,255,255,0.15)" }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: stat.accent, fontVariationSettings:"'FILL' 1" }}>{stat.icon}</span>
                      </div>
                    </div>
                    <p className="text-white font-['Sora'] text-[36px] font-bold leading-none mb-1">{stat.value}</p>
                    <p className="text-[11px] font-semibold" style={{ color: stat.accent + "99" }}>{stat.sub}</p>
                  </div>
                ))}
              </section>

              {/* ── Main Content Grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left: Bar Chart */}
                <div className="md:col-span-8 space-y-6">

                  {/* Weekly Study Hours */}
                  <div className="glass-card anim rounded-2xl p-6 shadow-sm" style={{ animationDelay:"0.3s" }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-['Sora'] text-[18px] font-semibold text-[#002045] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings:"'FILL' 1" }}>bar_chart</span>
                        Weekly Study Tracker
                      </h3>
                      <span className="px-3 py-1 bg-[#d1fae5] text-[#006b5f] text-[11px] font-bold rounded-full">{data.totalHoursThisWeek}h total</span>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-52 pb-4 border-b border-[#e0e3e5]">
                      {data.weeklyStudyHours.map((h, idx) => {
                        const hPct = Math.round((h.hours / maxHours) * 100);
                        const isToday = idx === new Date().getDay() - 1;
                        return (
                          <div key={h.day} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full flex justify-center items-end h-40 relative">
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#002045] text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                {h.hours}h
                              </span>
                              <div
                                className="w-full sm:w-8 rounded-t-lg transition-all duration-700"
                                style={{
                                  height: animate ? `${hPct}%` : "0%",
                                  background: isToday
                                    ? "linear-gradient(to top,#002045,#006b5f)"
                                    : "linear-gradient(to top,#c4c6cf,#e0e3e5)",
                                  transitionDelay: `${idx * 60}ms`,
                                }}
                              />
                            </div>
                            <span className={`text-[11px] font-bold ${isToday ? "text-[#006b5f]" : "text-[#74777f]"}`}>{h.day}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#74777f] mt-3 text-center">Highlighted bar = today's session</p>
                  </div>

                  {/* Course Breakdown wide view */}
                  <div className="glass-card anim rounded-2xl p-6 shadow-sm" style={{ animationDelay:"0.4s" }}>
                    <h3 className="font-['Sora'] text-[18px] font-semibold text-[#002045] flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings:"'FILL' 1" }}>playlist_add_check</span>
                      Course Performance
                    </h3>
                    <div className="space-y-5">
                      {data.coursePerformance.map((course) => (
                        <div key={course.course} className="group p-4 rounded-xl border border-[#e0e3e5] hover:border-[#006b5f] hover:shadow-sm transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-10 rounded-full" style={{ backgroundColor: course.color }} />
                              <div>
                                <p className="text-[14px] font-semibold text-[#002045] group-hover:text-[#006b5f] transition-colors">{course.course}</p>
                                <p className="text-[11px] text-[#74777f]">{course.completed}/{course.assignments} assignments</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-['Sora'] text-[22px] font-bold" style={{ color: course.color }}>{course.score}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-[#e6e8ea] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: animate ? `${course.score}%` : "0%",
                                backgroundColor: course.color,
                                transitionDelay: "200ms",
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] text-[#74777f]">
                            <span>{Math.round((course.completed / course.assignments) * 100)}% complete</span>
                            <span style={{ color: course.score >= 85 ? "#006b5f" : course.score >= 70 ? "#f59e0b" : "#ba1a1a" }}>
                              {course.score >= 85 ? "Excellent" : course.score >= 70 ? "Good progress" : "Needs attention"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-4 space-y-5">

                  {/* Streak visual */}
                  <div className="anim rounded-2xl p-5 relative overflow-hidden shadow-sm" style={{ animationDelay:"0.35s", background:"linear-gradient(135deg,#e65100,#f59e0b)" }}>
                    <div className="absolute top-0 right-0 opacity-20">
                      <span className="material-symbols-outlined" style={{ fontSize:"80px", fontVariationSettings:"'FILL' 1", color:"white" }}>local_fire_department</span>
                    </div>
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Study Streak</p>
                    <p className="text-white font-['Sora'] text-[48px] font-bold leading-none">{data.streakDays}</p>
                    <p className="text-white/80 text-[12px] font-semibold">consecutive days</p>
                    <div className="flex gap-1 mt-3">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full ${i < data.streakDays ? "bg-white" : "bg-white/30"}`} />
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card anim rounded-2xl p-5 shadow-sm" style={{ animationDelay:"0.5s" }}>
                    <h3 className="font-['Sora'] text-[16px] font-semibold text-[#002045] flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings:"'FILL' 1" }}>history</span>
                      Recent Activity
                    </h3>
                    <div className="space-y-4 relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#e0e3e5]" />
                      {data.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 relative pl-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm" style={{ background: idx === 0 ? "linear-gradient(135deg,#002045,#006b5f)" : "#f2f4f6" }}>
                            <span className="material-symbols-outlined text-[14px]" style={{ color: idx === 0 ? "white" : "#006b5f" }}>{activity.icon || 'star'}</span>
                          </div>
                          <div className="min-w-0 pt-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: idx === 0 ? "#006b5f" : "#74777f" }}>{activity.date}</p>
                            <p className="text-[12px] text-[#43474e] leading-relaxed">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI suggestion card */}
                  <div className="anim rounded-2xl p-5 shadow-sm" style={{ animationDelay:"0.55s", background:"linear-gradient(135deg,rgba(0,32,69,0.05),rgba(98,250,227,0.1))", border:"1px solid rgba(0,107,95,0.15)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
                      </div>
                      <p className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">AI Suggestion</p>
                    </div>
                    <p className="text-[12px] text-[#43474e] leading-relaxed">
                      You're excelling in ML! Focus 30 more minutes on Data Structures to bring that score above 80%.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
