"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const NOTIFICATIONS = [
  {
    id: "n1",
    category: "students",
    priority: "high",
    icon: "warning",
    iconColor: "#ba1a1a",
    iconBg: "#ffdad6",
    title: "⚠️ At-Risk Student Alert",
    description: "Jordan Smith (CS-402) has missed 3 consecutive lab sessions and their quiz average has dropped to 45%. Immediate intervention is recommended.",
    time: "10 min ago",
    isRead: false,
    actions: [{ label: "View Student", primary: true }, { label: "Send Message", primary: false }],
  },
  {
    id: "n2",
    category: "students",
    priority: "normal",
    icon: "assignment_turned_in",
    iconColor: "#006b5f",
    iconBg: "#d1fae5",
    title: "New Assignment Submission",
    description: "Alex Chen submitted OS Assignment 4 — \"Thread Scheduling Algorithms\" in CS-402. Awaiting your review and grading.",
    time: "25 min ago",
    isRead: false,
    actions: [{ label: "Grade Now", primary: true }],
  },
  {
    id: "n3",
    category: "courses",
    priority: "normal",
    icon: "forum",
    iconColor: "#09007b",
    iconBg: "#e1e0ff",
    title: "3 New Forum Questions",
    description: "Students in CS-520 (Machine Learning) have posted 3 unanswered questions in the discussion board. Topics include gradient descent and vanishing gradients.",
    time: "1 hour ago",
    isRead: false,
    actions: [{ label: "Open Forum", primary: true }],
  },
  {
    id: "n4",
    category: "ai",
    priority: "normal",
    icon: "auto_awesome",
    iconColor: "#006b5f",
    iconBg: "#62fae3",
    title: "AI Insight: Engagement Drop Detected",
    description: "CS-402 has shown a 15% drop in participation over the past two weeks. EduSphere AI suggests generating a review session or interactive quiz to re-engage students.",
    time: "2 hours ago",
    isRead: false,
    actions: [{ label: "Generate Quiz", primary: true }, { label: "View Analytics", primary: false }],
  },
  {
    id: "n5",
    category: "courses",
    priority: "high",
    icon: "rate_review",
    iconColor: "#ba1a1a",
    iconBg: "#ffdad6",
    title: "Grading Deadline: ML Project",
    description: "14 ML Project submissions in CS-520 are pending your grade. The grading deadline is tomorrow at 5:00 PM. Students are waiting for feedback.",
    time: "3 hours ago",
    isRead: false,
    actions: [{ label: "Start Grading", primary: true }],
  },
  {
    id: "n6",
    category: "students",
    priority: "normal",
    icon: "emoji_events",
    iconColor: "#006b5f",
    iconBg: "#d1fae5",
    title: "High Achievement: Sarah Williams",
    description: "Sarah Williams scored 98% on the Neural Networks Midterm — the highest in your CS-520 cohort this semester. Consider recognizing their effort.",
    time: "Yesterday",
    isRead: true,
    actions: [{ label: "Send Praise", primary: true }],
  },
  {
    id: "n7",
    category: "system",
    priority: "normal",
    icon: "system_update",
    iconColor: "#43474e",
    iconBg: "#eceef0",
    title: "Course Admin Update",
    description: "EduSphere AI has been updated with new course analytics features including per-student engagement heatmaps and AI-generated personalized feedback drafts.",
    time: "2 days ago",
    isRead: true,
    actions: [{ label: "See What's New", primary: true }],
  },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: "list" },
  { id: "students", label: "Students", icon: "group" },
  { id: "courses", label: "Courses", icon: "menu_book" },
  { id: "ai", label: "AI Insights", icon: "auto_awesome" },
  { id: "system", label: "System", icon: "settings" },
];

// Map notification titles/icons to action routes
function getActionsForNotification(notif) {
  const title = (notif.title || "").toLowerCase();
  const icon = notif.icon || "";
  if (icon === "assignment_turned_in" || title.includes("submission")) {
    return [{ label: "Grade Now", primary: true, route: "/teacher/course-management" }];
  }
  if (icon === "grade" || title.includes("graded")) {
    return [{ label: "View Courses", primary: true, route: "/teacher/course-management" }];
  }
  if (title.includes("quiz") || title.includes("ai") || title.includes("insight")) {
    return [
      { label: "Generate Quiz", primary: true, route: "/teacher/ask-ai" },
      { label: "View Analytics", primary: false, route: "/teacher/student-analytics" },
    ];
  }
  if (title.includes("risk") || title.includes("alert") || title.includes("student")) {
    return [{ label: "View Students", primary: true, route: "/teacher/student-analytics" }];
  }
  return null;
}

export default function TeacherNotifications() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pendingGrades, setPendingGrades] = useState(0);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch real notifications from backend
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Also fetch analytics to populate sidebar stats
      const analyticsRes = await fetch("http://localhost:5000/api/analytics/teacher", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        setPendingGrades(analytics.summary?.pendingGrades || 0);
      }

      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setNotifications(data.map(n => ({
            id: n.id,
            category: n.type || "students",
            priority: n.priority || "normal",
            icon: n.icon || "notifications",
            iconColor: n.iconColor || "#006b5f",
            iconBg: n.iconBg || "#d1fae5",
            title: n.title,
            description: n.message,
            time: new Date(n.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            isRead: n.read,
            actions: getActionsForNotification(n)
          })));
        } else {
          // No real notifications yet, show static fallback
          setNotifications(NOTIFICATIONS);
        }
      }
    } catch (err) {
      console.error("Fetch notifications failed:", err);
      setNotifications(NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n =>
    activeCategory === "all" ? true : n.category === activeCategory
  );

  const countByCategory = (id) => {
    if (id === "all") return notifications.length;
    return notifications.filter(n => n.category === id).length;
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const clearAll = () => setNotifications([]);
  
  const toggleRead = async (id) => {
    try {
      const item = notifications.find(n => n.id === id);
      if (!item || item.isRead) return;

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error("Mark read error:", err);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-sora { font-family: 'Sora', sans-serif; }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,107,95,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c4c6cf; border-radius: 10px; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out forwards; }
        .notif-card { transition: box-shadow 0.2s, border-color 0.2s, opacity 0.2s; }
        .notif-card:hover { box-shadow: 0 4px 20px rgba(0,32,69,0.08); }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Notifications" />

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Instructor Hub</p>
              <h1 className="text-white font-['Sora'] text-3xl font-bold mb-1">Notifications
                {unreadCount > 0 && <span className="ml-3 text-[14px] bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded-full align-middle font-semibold">{unreadCount} new</span>}
              </h1>
              <p className="text-[#d6e3ff] text-[14px]">Stay on top of student alerts, grading deadlines, and AI insights.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={markAllRead} className="px-4 py-2 text-[13px] font-semibold bg-white/10 text-white hover:bg-white/20 rounded-xl transition-colors flex items-center gap-2 border border-white/20">
                <span className="material-symbols-outlined text-[18px]">done_all</span> Mark all read
              </button>
              <button onClick={clearAll} className="px-4 py-2 text-[13px] font-semibold bg-white/10 text-[#ffb4ab] hover:bg-white/20 rounded-xl transition-colors flex items-center gap-2 border border-white/20">
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span> Clear all
              </button>
            </div>
          </div>
        </div>

        <main className="flex-grow px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Panel: Categories + AI Summary */}
            <div className="lg:col-span-3 space-y-5">

              {/* Category Filter */}
              <div className="bg-[#f2f4f6] rounded-xl p-4 border border-[#c4c6cf]">
                <h3 className="text-[11px] font-bold text-[#43474e] uppercase tracking-widest mb-3">Filter by</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-[13px] font-medium ${
                          active
                            ? "bg-[#002045] text-white"
                            : "text-[#43474e] hover:bg-[#e6e8ea]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {cat.icon}
                          </span>
                          {cat.label}
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          active ? "bg-white/20 text-white" : "bg-[#e0e3e5] text-[#43474e]"
                        }`}>
                          {countByCategory(cat.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Smart Digest */}
              <div className="glass-card rounded-xl p-5 relative overflow-hidden">
                <div className="absolute -right-3 -bottom-3 opacity-10">
                  <span className="material-symbols-outlined text-[80px] text-[#006b5f]">auto_awesome</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#62fae3] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#007165] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <h4 className="font-sora text-[15px] font-semibold text-[#006b5f]">AI Digest</h4>
                </div>
                <p className="text-[13px] text-[#43474e] mb-4 leading-relaxed">
                  You have <strong className="text-[#002045]">{unreadCount} unread</strong> notifications. 2 students need immediate attention. Let AI prioritize your tasks.
                </p>
                <button className="w-full py-2.5 bg-[#006b5f] text-white rounded-lg text-[13px] font-bold hover:bg-[#005047] transition-colors">
                  Generate AI Summary
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-[#c4c6cf] p-5 space-y-3">
                <h4 className="font-sora text-[15px] font-semibold text-[#002045]">Today's Summary</h4>
                {[
                  { label: "Pending Grades", value: String(pendingGrades || 0), color: "#ba1a1a", icon: "rate_review", route: "/teacher/course-management" },
                  { label: "Unread Alerts", value: String(notifications.filter(n => !n.isRead).length), color: "#09007b", icon: "notifications_active", route: null },
                  { label: "View Analytics", value: "→", color: "#006b5f", icon: "analytics", route: "/teacher/student-analytics" },
                ].map(stat => (
                  <div
                    key={stat.label}
                    onClick={() => stat.route && router.push(stat.route)}
                    className={`flex items-center justify-between ${stat.route ? 'cursor-pointer hover:bg-[#f2f4f6] rounded-lg px-2 py-1 -mx-2 transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]" style={{ color: stat.color }}>{stat.icon}</span>
                      <span className="text-[13px] text-[#43474e]">{stat.label}</span>
                    </div>
                    <span className="text-[14px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Notification Feed */}
            <div className="lg:col-span-9 space-y-3 max-h-[78vh] overflow-y-auto pr-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#c4c6cf]">
                  <span className="material-symbols-outlined text-[48px] text-[#c4c6cf]">notifications_off</span>
                  <p className="text-[#43474e] mt-3 font-medium">No notifications in this category.</p>
                </div>
              ) : (
                filtered.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => toggleRead(notif.id)}
                    className={`notif-card bg-white rounded-xl border p-5 cursor-pointer slide-in ${
                      notif.priority === "high"
                        ? "border-l-4 border-l-[#ba1a1a] border-[#c4c6cf]"
                        : "border-[#c4c6cf] hover:border-[#006b5f]/40"
                    } ${notif.isRead ? "opacity-60" : "opacity-100"}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: notif.iconBg }}
                      >
                        <span
                          className="material-symbols-outlined text-[22px]"
                          style={{ color: notif.iconColor, fontVariationSettings: "'FILL' 1" }}
                        >
                          {notif.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="font-sora text-[15px] font-semibold text-[#002045] leading-snug flex items-center gap-2">
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#006b5f] shrink-0 inline-block"></span>
                            )}
                            {notif.title}
                          </h4>
                          <span className="text-[11px] text-[#74777f] whitespace-nowrap shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[13px] text-[#43474e] leading-relaxed mb-4">{notif.description}</p>

                        {/* Actions */}
                        {notif.actions && (
                          <div className="flex gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
                            {notif.actions.map((action, i) => (
                              <button
                                key={i}
                                onClick={() => action.route && router.push(action.route)}
                                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  action.primary
                                    ? "bg-[#002045] text-white hover:bg-[#1a365d]"
                                    : "border border-[#c4c6cf] text-[#43474e] hover:bg-[#f2f4f6]"
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#e0e3e5] border-t border-[#c4c6cf] mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center p-8 gap-4 max-w-[1280px] mx-auto">
            <div>
              <span className="font-sora text-[18px] text-[#002045] font-bold block">EduSphere AI</span>
              <p className="text-[12px] text-[#43474e] mt-0.5">© 2026 EduSphere AI. Powered by Academic Intelligence.</p>
            </div>
            <div className="flex gap-5">
              <a className="text-[12px] text-[#43474e] hover:text-[#002045]" href="#">Privacy</a>
              <a className="text-[12px] text-[#43474e] hover:text-[#002045]" href="#">Terms</a>
              <a className="text-[12px] text-[#43474e] hover:text-[#002045]" href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
