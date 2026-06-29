'use client';

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

const RISK_CONFIG = {
  'High Achiever': { bg: '#d1fae5', text: '#006b5f', icon: 'trending_up' },
  'Developing': { bg: '#eceef0', text: '#43474e', icon: 'trending_flat' },
  'At Risk': { bg: '#ffdad6', text: '#ba1a1a', icon: 'trending_down' },
};

export default function InstructorAnalyticsPortal() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [stats, setStats] = useState({
    totalStudents: 128, avgQuizScore: 81, avgAttendance: 88, atRisk: 1
  });

  const [students, setStudents] = useState([
    { name: 'Alex Sterling',   email: 'alex.s@university.edu',    quizAvg: 92, attendance: 96, riskLevel: 'High Achiever', lastActive: 'Today, 10:42 AM' },
    { name: 'Maya Chen',       email: 'm.chen@university.edu',    quizAvg: 78, attendance: 88, riskLevel: 'Developing',    lastActive: 'Yesterday' },
    { name: 'Jordan Smith',    email: 'jsmith@university.edu',     quizAvg: 45, attendance: 62, riskLevel: 'At Risk',       lastActive: '4 days ago' },
    { name: 'Sarah Williams',  email: 's.williams@university.edu', quizAvg: 88, attendance: 94, riskLevel: 'High Achiever', lastActive: 'Today, 08:15 AM' },
    { name: 'Ethan Brooks',    email: 'e.brooks@university.edu',   quizAvg: 71, attendance: 82, riskLevel: 'Developing',    lastActive: '2 days ago' },
  ]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
          if (data.length > 0) setSelectedCourseId(data[0].id);
        }
      } catch (err) { console.error("Failed to load courses:", err); }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    async function fetchCourseDetails() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const resStats = await fetch(`http://localhost:5000/api/analytics/teacher/course/${selectedCourseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resStats.ok) {
          const data = await resStats.json();
          setStats(data.stats);
          setSelectedCourse(data.course);
        }
        const resStudents = await fetch(`http://localhost:5000/api/analytics/teacher/course/${selectedCourseId}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resStudents.ok) {
          const data = await resStudents.json();
          if (data.length > 0) setStudents(data);
        }
      } catch (err) { console.error("Failed to load course details:", err); }
    }
    fetchCourseDetails();
  }, [selectedCourseId]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'All Students') return matchesSearch;
    if (activeTab === 'At Risk') return matchesSearch && student.riskLevel === 'At Risk';
    if (activeTab === 'Developing') return matchesSearch && student.riskLevel === 'Developing';
    if (activeTab === 'High Achievers') return matchesSearch && student.riskLevel === 'High Achiever';
    return matchesSearch;
  });

  const getInitials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const avatarColors = ['#002045', '#006b5f', '#09007b', '#ba1a1a', '#1a365d'];

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily:"'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .anim { animation: fadeUp 0.4s ease-out forwards; }
        .glass-card { background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.7); }
        .row-hover:hover { background: rgba(0,107,95,0.04); }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Student Analytics" />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-[1280px] mx-auto">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">
                {selectedCourse ? `${selectedCourse.code || selectedCourse.name} · ` : ''}Analytics Portal
              </p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold">Student Performance</h1>
              <p className="text-[#d6e3ff] text-[14px] mt-1">{stats.totalStudents} enrolled · {stats.atRisk} at-risk · Avg. quiz {stats.avgQuizScore}%</p>
            </div>
            {/* Course Selector */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-[12px] font-semibold whitespace-nowrap">Course:</span>
              <select
                className="bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold focus:outline-none focus:border-[#62fae3] transition-all min-w-[200px]"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                style={{ colorScheme:"dark" }}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id} style={{ background:"#002045" }}>{course.code}: {course.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <main className="flex-1 px-6 md:px-8 pb-12 max-w-[1280px] mx-auto w-full -mt-5 space-y-6">

          {/* ── Stats Cards ── */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Total Students", value: stats.totalStudents, icon:"group", grad:"from-[#002045] to-[#1a365d]", accent:"#62fae3" },
              { label:"Avg Quiz Score", value:`${stats.avgQuizScore}%`, icon:"quiz", grad:"from-[#006b5f] to-[#007165]", accent:"#d1fae5" },
              { label:"Avg Attendance", value:`${stats.avgAttendance}%`, icon:"how_to_reg", grad:"from-[#09007b] to-[#3730a3]", accent:"#c0c1ff" },
              { label:"At Risk", value: stats.atRisk, icon:"warning", grad: stats.atRisk > 0 ? "from-[#ba1a1a] to-[#c62828]" : "from-[#006b5f] to-[#007165]", accent: stats.atRisk > 0 ? "#ffdad6" : "#d1fae5" },
            ].map((s, i) => (
              <div key={s.label} className={`anim relative overflow-hidden bg-gradient-to-br ${s.grad} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all`} style={{ animationDelay:`${i * 0.08}s` }}>
                <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.08),transparent)" }} />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: s.accent + "bb" }}>{s.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(255,255,255,0.15)" }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: s.accent, fontVariationSettings:"'FILL' 1" }}>{s.icon}</span>
                  </div>
                </div>
                <p className="text-white font-['Sora'] text-[32px] font-bold">{s.value}</p>
              </div>
            ))}
          </section>

          {/* ── AI Insight + Attendance ── */}
          <div className="grid grid-cols-12 gap-5">
            {/* AI Insight Card */}
            <div className="col-span-12 lg:col-span-8 glass-card anim rounded-2xl p-6 relative overflow-hidden" style={{ animationDelay:"0.32s" }}>
              <div className="absolute top-4 right-4 opacity-[0.06]">
                <span className="material-symbols-outlined text-[100px] text-[#006b5f]" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="flex items-center gap-2 text-[#006b5f] mb-4">
                <span className="material-symbols-outlined">smart_toy</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">AI Insight Engine</span>
              </div>
              <h3 className="font-['Sora'] text-[22px] font-semibold text-[#002045] mb-2">Cohort Engagement Overview</h3>
              <p className="text-[#43474e] mb-5 max-w-2xl leading-relaxed text-[14px]">
                The current cohort is showing an average quiz performance of <span className="text-[#006b5f] font-bold">{stats.avgQuizScore}%</span>.
                {stats.atRisk > 0
                  ? <span> There are <span className="text-[#ba1a1a] font-bold">{stats.atRisk} students</span> flagged at-risk. Early email reminders or review sessions are recommended.</span>
                  : " All student performance trends are positive. No urgent interventions needed."
                }
              </p>
              {/* Engagement chart bars */}
              <div className="flex items-end gap-3 h-28">
                {[68, 74, 81, 90, 74].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#002045] text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {v}%
                      </div>
                      <div
                        className="w-full rounded-lg transition-all duration-700"
                        style={{
                          height: `${(v / 90) * 100}%`,
                          minHeight: "8px",
                          background: i === 3 ? "linear-gradient(to top,#002045,#006b5f)" : "#e0e3e5",
                          height: `${(v / 90) * 112}px`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-[#74777f] font-semibold uppercase">
                {["Week 8","Week 9","Week 10","Week 11","Week 12"].map(w => <span key={w}>{w}</span>)}
              </div>
            </div>

            {/* Attendance Ring */}
            <div className="col-span-12 lg:col-span-4 glass-card anim rounded-2xl p-6 flex flex-col items-center justify-center" style={{ animationDelay:"0.38s" }}>
              <h3 className="font-['Sora'] text-[16px] font-semibold text-[#002045] mb-5 w-full text-center">Attendance Rate</h3>
              <div className="relative w-36 h-36 mb-5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="42" stroke="#e0e3e5" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" fill="transparent" r="42"
                    stroke="url(#attendGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="263.9"
                    strokeDashoffset={263.9 - (263.9 * stats.avgAttendance) / 100}
                  />
                  <defs>
                    <linearGradient id="attendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#006b5f" />
                      <stop offset="100%" stopColor="#62fae3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Sora'] text-[28px] font-bold text-[#002045]">{stats.avgAttendance}%</span>
                  <span className="text-[10px] text-[#74777f] tracking-wider font-bold uppercase">Avg Rate</span>
                </div>
              </div>
              <div className="flex gap-6 w-full">
                <div className="flex-1 text-center p-3 bg-[#f2f4f6] rounded-xl">
                  <p className="font-['Sora'] font-bold text-[#002045] text-[18px]">{Math.round(stats.totalStudents * stats.avgAttendance / 100)}</p>
                  <p className="text-[10px] text-[#74777f] font-bold uppercase">Present</p>
                </div>
                <div className="flex-1 text-center p-3 bg-[#ffdad6]/40 rounded-xl">
                  <p className="font-['Sora'] font-bold text-[#ba1a1a] text-[18px]">{Math.max(0, stats.totalStudents - Math.round(stats.totalStudents * stats.avgAttendance / 100))}</p>
                  <p className="text-[10px] text-[#74777f] font-bold uppercase">Absent</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Student Table ── */}
          <div className="glass-card anim rounded-2xl overflow-hidden shadow-sm" style={{ animationDelay:"0.45s" }}>
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-[#e0e3e5] gap-3">
              <div className="flex items-center gap-2 p-1 bg-[#f2f4f6] rounded-xl">
                {['All Students', 'At Risk', 'Developing', 'High Achievers'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab ? 'bg-white shadow-sm text-[#002045]' : 'text-[#74777f] hover:text-[#002045]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c6cf] text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search students…"
                  className="w-full bg-[#f7f9fb] border-2 border-[#e0e3e5] rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:border-[#006b5f] outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-[#f7f9fb]">
                    <th className="px-6 py-3.5 text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Quiz Avg</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-[#74777f] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <span className="material-symbols-outlined text-[48px] text-[#c4c6cf] block mb-2">search_off</span>
                        <p className="text-[#74777f] font-medium">No students match the current filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const riskConfig = RISK_CONFIG[student.riskLevel] || RISK_CONFIG['Developing'];
                      return (
                        <tr key={idx} className="row-hover border-t border-[#f2f4f6] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shadow-sm shrink-0" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                                {getInitials(student.name)}
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold text-[#002045]">{student.name}</p>
                                <p className="text-[11px] text-[#74777f]">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-[#74777f]">{student.lastActive}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-20 bg-[#e6e8ea] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${student.quizAvg}%`,
                                    backgroundColor: student.quizAvg >= 80 ? '#006b5f' : student.quizAvg >= 60 ? '#f59e0b' : '#ba1a1a'
                                  }}
                                />
                              </div>
                              <span className={`text-[13px] font-bold ${student.quizAvg >= 80 ? 'text-[#006b5f]' : student.quizAvg >= 60 ? 'text-[#f59e0b]' : 'text-[#ba1a1a]'}`}>
                                {student.quizAvg}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: riskConfig.bg, color: riskConfig.text }}>
                              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings:"'FILL' 1" }}>{riskConfig.icon}</span>
                              {student.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => alert(`Sending academic reminder to ${student.name}`)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center ml-auto text-[#74777f] hover:text-[#006b5f] hover:bg-[#d1fae5] transition-all"
                              title="Send reminder"
                            >
                              <span className="material-symbols-outlined text-[18px]">mail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 bg-[#f7f9fb] border-t border-[#e0e3e5] flex justify-between items-center">
              <p className="text-[12px] text-[#74777f]">Showing <span className="font-bold text-[#002045]">{filteredStudents.length}</span> students</p>
            </div>
          </div>
        </main>
      </div>

      {/* AI FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        style={{ background:"linear-gradient(135deg,#002045,#006b5f)", border:"2px solid rgba(98,250,227,0.4)" }}
      >
        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
      </button>
    </div>
  );
}