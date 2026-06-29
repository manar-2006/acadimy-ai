"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

export default function PerformanceAnalytics() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState("Download Report");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("http://localhost:5000/api/analytics/teacher", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load analytics data");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleDownloadReport = () => {
    setReportStatus("Generating PDF...");
    setTimeout(() => {
      setReportStatus("Report Downloaded!");
      setTimeout(() => setReportStatus("Download Report"), 2000);
    }, 1500);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24}@keyframes scanEffect{0%{top:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}.ai-scanner-line{position:absolute;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#006b5f,transparent);pointer-events:none;animation:scanEffect 4s infinite linear}` }} />

      <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <Navbar setMobileNavOpen={setMobileNavOpen} title="Performance Analytics" />

          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#1a365d] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)" }} />
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
            <div className="ai-scanner-line" />
            <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Teacher Console</p>
                <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Performance Analytics</h1>
                <p className="text-[#d6e3ff] text-[14px] max-w-xl">Real-time class insights, student submission rates, and course performance breakdown.</p>
              </div>
              <button onClick={handleDownloadReport} className="px-5 py-2.5 rounded-lg border border-white/30 text-white font-bold backdrop-blur-sm hover:bg-white/10 transition-all text-sm shadow-sm shrink-0">
                {reportStatus}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full space-y-8">
            {loading && (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-[#006b5f] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="p-4 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-xl text-[#ba1a1a] text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            {analytics && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { label: "Total Courses", value: analytics.totalCourses ?? 0, icon: "school", color: "#002045" },
                    { label: "Total Students", value: analytics.totalStudents ?? 0, icon: "groups", color: "#006b5f" },
                    { label: "Total Assignments", value: analytics.totalAssignments ?? 0, icon: "assignment", color: "#09007b" },
                    { label: "Graded", value: analytics.totalGraded ?? 0, icon: "grading", color: "#ba1a1a" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-[#e0e3e5] shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: kpi.color + "15" }}>
                        <span className="material-symbols-outlined text-[22px]" style={{ color: kpi.color, fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-bold text-[#74777f] tracking-wider">{kpi.label}</p>
                        <p className="text-3xl font-bold text-[#002045]">{kpi.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#f0f2f5] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                    <h2 className="font-bold text-[#002045] text-lg">Course Performance Breakdown</h2>
                  </div>
                  <div className="divide-y divide-[#f0f2f5]">
                    {(analytics.courses || []).length === 0 && (
                      <div className="px-6 py-12 text-center text-[#74777f] text-sm">
                        <span className="material-symbols-outlined text-[40px] block mb-2 text-[#c4c6cf]">school</span>
                        No courses found. Create your first course in Course Management.
                      </div>
                    )}
                    {(analytics.courses || []).map((course, idx) => {
                      const totalPossible = (course.totalAssignments ?? 0) * Math.max(course.enrolledStudents ?? 1, 1);
                      const submitRate = totalPossible > 0 ? Math.round(((course.submittedAssignments ?? 0) / totalPossible) * 100) : 0;
                      return (
                        <div key={course.id || idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[#f9fafb] transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#002045] text-sm truncate">{course.title}</p>
                            <p className="text-[#74777f] text-xs mt-0.5">{course.subject || course.code || "No subject"}</p>
                          </div>
                          <div className="flex items-center gap-6 shrink-0 text-center">
                            <div><p className="text-lg font-bold text-[#002045]">{course.enrolledStudents ?? 0}</p><p className="text-[10px] text-[#74777f] uppercase tracking-wide">Students</p></div>
                            <div><p className="text-lg font-bold text-[#002045]">{course.totalAssignments ?? 0}</p><p className="text-[10px] text-[#74777f] uppercase tracking-wide">Tasks</p></div>
                            <div><p className="text-lg font-bold text-[#006b5f]">{course.gradedSubmissions ?? 0}</p><p className="text-[10px] text-[#74777f] uppercase tracking-wide">Graded</p></div>
                            <div className="w-28">
                              <div className="w-full bg-[#f0f2f5] h-2.5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(submitRate, 100)}%`, background: submitRate >= 75 ? "#006b5f" : submitRate >= 40 ? "#002045" : "#ba1a1a" }} />
                              </div>
                              <p className="text-[10px] text-[#74777f] mt-1 text-right">{submitRate}% submitted</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-[#e0e3e5] bg-white mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 py-5 gap-3 max-w-[1280px] mx-auto">
              <span className="text-sm font-bold text-[#002045]">EduSphere AI</span>
              <p className="text-xs text-[#74777f]">� 2024 EduSphere AI. Powered by Academic Intelligence.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
