"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

// Mock dataset mapping the initial structural layout elements
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    category: "academic",
    title: "Deadline Reminder: CS402 Final Project",
    badge: "Due in 4h",
    priority: "high",
    description: 'The final submission for "Advanced Neural Networks" is due by midnight. Ensure your GitHub repository is updated and the PDF report is uploaded.',
    timeLabel: "Due in 4h",
    hasActions: true,
    actionText: "Upload Now",
    secondaryActionText: "View Rubric",
    isRead: false,
  },
  {
    id: "notif-2",
    category: "academic",
    title: "New Grade Posted",
    description: 'Your quiz results for "Introduction to Philosophy" have been published. You achieved an A- (92%).',
    timeLabel: "20 mins ago",
    hasLink: true,
    linkLabel: "Review Feedback",
    isRead: false,
  },
  {
    id: "notif-3",
    category: "events",
    title: "Winter Hackathon 2024",
    description: "Registration is now open for the annual cross-departmental hackathon. Win prizes from our tech partners.",
    timeLabel: "1 hour ago",
    isEventCard: true,
    eventTag: "Campus Event",
    friendsAttending: 12,
    isRead: false,
  },
  {
    id: "notif-4",
    category: "community",
    title: 'New Reply in "Study Group"',
    description: 'Sarah Jenkins replied to your question about Theorem 4.2: "I think you missed the third constraint..."',
    timeLabel: "Yesterday",
    hasLink: true,
    linkLabel: "Open Conversation",
    isRead: true,
  },
  {
    id: "notif-5",
    category: "academic",
    title: "New Lecture Notes: Ethics in AI",
    description: "Professor Zhang has uploaded the slide deck and supplemental readings for Week 12.",
    timeLabel: "2 hours ago",
    hasDownload: true,
    downloadLabel: "Download PDF",
    isRead: false,
  }
];

export default function NotificationsCenter() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  // Load notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(n => ({
            id: n.id,
            category: n.type || "academic",
            title: n.title,
            description: n.message,
            timeLabel: new Date(n.createdAt).toLocaleDateString(),
            isRead: n.read,
            priority: n.type === 'deadline' ? 'high' : 'normal'
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  // Interaction handlers
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleReadStatus = async (id) => {
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Metrics counter computing
  const countByCategory = (category) => {
    if (category === "all") return notifications.length;
    return notifications.filter(n => n.category === category).length;
  };

  const filteredNotifications = notifications.filter(n =>
    activeCategory === "all" ? true : n.category === activeCategory
  );

  return (
    <>
      {/* Structural Font Mapping & Custom Tokens Injection */}
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --on-surface-variant: #43474e;
          --background: #f0f2f5;
          --primary-fixed: #d6e3ff;
          --surface-bright: #f0f2f5;
          --primary-container: #1a365d;
          --on-tertiary-fixed: #07006c;
          --surface-tint: #455f88;
          --on-secondary-fixed-variant: #005047;
          --surface-variant: #e0e3e5;
          --secondary-fixed: #62fae3;
          --on-surface: #191c1e;
          --on-secondary: #ffffff;
          --inverse-on-surface: #eff1f3;
          --on-error: #ffffff;
          --on-tertiary: #ffffff;
          --primary-fixed-dim: #adc7f7;
          --error-container: #ffdad6;
          --on-background: #191c1e;
          --on-secondary-container: #007165;
          --surface-container-low: #f2f4f6;
          --outline-variant: #c4c6cf;
          --tertiary-container: #1910af;
          --surface-container-highest: #e0e3e5;
          --surface: #f0f2f5;
          --on-primary-fixed: #001b3c;
          --tertiary-fixed-dim: #c0c1ff;
          --surface-container-high: #e6e8ea;
          --on-tertiary-fixed-variant: #2f2ebe;
          --tertiary-fixed: #e1e0ff;
          --secondary: #006b5f;
          --on-primary-fixed-variant: #2d476f;
          --on-primary: #ffffff;
          --secondary-container: #62fae3;
          --inverse-primary: #adc7f7;
          --on-secondary-fixed: #00201c;
          --surface-container-lowest: #ffffff;
          --tertiary: #09007b;
          --on-error-container: #93000a;
          --surface-container: #eceef0;
          --inverse-surface: #2d3133;
          --surface-dim: #d8dadc;
          --on-primary-container: #86a0cd;
          --outline: #74777f;
          --error: #ba1a1a;
          --secondary-fixed-dim: #3cddc7;
          --primary: #002045;
          --on-tertiary-container: #9194ff;
        }

        body {
          background-color: var(--background);
          font-family: 'Inter', sans-serif;
          color: var(--on-surface);
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 107, 95, 0.1);
        }

        /* Typography Mapping Framework */
        .font-headline-xl { font-family: 'Sora', sans-serif; font-size: 40px; line-height: 48px; letter-spacing: -0.02em; font-weight: 700; }
        .font-headline-lg { font-family: 'Sora', sans-serif; font-size: 32px; line-height: 40px; letter-spacing: -0.01em; font-weight: 600; }
        .font-headline-md { font-family: 'Sora', sans-serif; font-size: 24px; line-height: 32px; font-weight: 600; }
        .font-headline-sm { font-family: 'Sora', sans-serif; font-size: 20px; line-height: 28px; font-weight: 600; }
        .font-body-lg { font-family: 'Inter', sans-serif; font-size: 18px; line-height: 30px; font-weight: 400; }
        .font-body-md { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 26px; font-weight: 400; }
        .font-body-sm { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; }
        .font-label-md { font-family: 'Inter', sans-serif; font-size: 12px; line-height: 16px; letter-spacing: 0.05em; font-weight: 600; }

        /* Configuration Constants Scale */
        .px-margin-desktop { padding-left: 48px; padding-right: 48px; }
        .p-gutter { padding: 24px; }
        .px-gutter { padding-left: 24px; padding-right: 24px; }
        .gap-gutter { gap: 24px; }
        .max-w-container-max { max-width: 1280px; }
      ` }} />

      <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

        {/* Main Content Wrapper */}
        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <Navbar setMobileNavOpen={setMobileNavOpen} title="Notifications Center" />

          {/* ── Hero Header ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
            <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
              <div>
                <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Student Portal</p>
                <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Notifications Center</h1>
                <p className="text-[#d6e3ff] text-[14px] max-w-lg">Keep track of your grades, announcements, and peer messages.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">{notifications.filter(n => !n.isRead).length}</p>
                  <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Unread</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hub Shell Framework Container */}
          <div className="flex-grow px-6 md:px-8 pb-12 pt-6 max-w-[1280px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#e0e3e5] pb-4">
              <div>
                <h2 className="font-['Sora'] text-2xl font-bold text-[var(--primary)]">Recent Updates</h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-body-sm font-semibold text-[var(--secondary)] hover:bg-[var(--secondary-container)]/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Mark all as read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="px-4 py-2 text-body-sm font-semibold text-[var(--error)] hover:bg-[var(--error-container)]/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                  Clear all
                </button>
              </div>
            </div>

            {/* Split Adaptive Layout Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

              {/* Category Segment Select Sidebar */}
              <div className="lg:col-span-3 space-y-gutter">
                <div className="bg-[var(--surface-container-low)] rounded-xl p-4 border border-[var(--outline-variant)]">
                  <h3 className="font-label-md text-[var(--on-surface-variant)] uppercase mb-4 tracking-widest">Categories</h3>
                  <div className="space-y-1">
                    {[
                      { id: "all", label: "All", icon: "list" },
                      { id: "academic", label: "Academic", icon: "menu_book" },
                      { id: "events", label: "Events", icon: "event" },
                      { id: "community", label: "Community", icon: "forum" },
                    ].map((cat) => {
                      const isSelected = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isSelected
                            ? "bg-[var(--secondary)] text-white font-bold"
                            : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20" : "bg-[var(--surface-container-highest)]"}`}>
                            {countByCategory(cat.id)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 border border-[var(--secondary)]/20 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[120px] text-[var(--secondary)]">bolt</span>
                  </div>
                  <h4 className="font-headline-sm text-[var(--secondary)] mb-2">Smart Digest</h4>
                  <p className="text-body-sm text-[var(--on-surface-variant)] mb-4">You have {notifications.filter(n => !n.isRead).length} unread updates. Let AI prioritize your tasks.</p>
                  <button className="w-full py-2 bg-[var(--secondary)] text-white rounded-lg font-bold text-body-sm shadow-sm hover:shadow-md transition-all">
                    Generate Summary
                  </button>
                </div>
              </div>

              {/* Dynamic Messaging Feed Center */}
              <div className="lg:col-span-9 space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)]">
                    <span className="material-symbols-outlined text-4xl text-[var(--outline)] mb-2">notifications_off</span>
                    <p className="text-[var(--on-surface-variant)]">No structural alerts found inside this category framework.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => toggleReadStatus(notif.id)}
                      className={`bg-[var(--surface-container-lowest)] border rounded-lg p-5 flex flex-col sm:flex-row items-start gap-4 transition-all duration-200 cursor-pointer ${notif.priority === "high" ? "border-l-4 border-l-[var(--error)]" : "border-[var(--outline-variant)] hover:shadow-md"
                        } ${notif.isRead ? "opacity-60" : "opacity-100"}`}
                    >
                      {/* Conditional Priority Avatar System */}
                      {notif.priority === "high" ? (
                        <div className="flex-shrink-0 w-12 h-12 bg-[var(--error-container)] rounded-full flex items-center justify-center text-[var(--error)]">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
                        </div>
                      ) : notif.isEventCard ? (
                        <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            alt="Hackathon workspace illustration"
                            className="w-full h-full object-cover"
                            src="/next.svg"
                            fill
                            unoptimized
                          />
                          <div className="absolute top-2 left-2 bg-[var(--primary)]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase">
                            {notif.eventTag}
                          </div>
                        </div>
                      ) : (
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${notif.category === "academic" ? "bg-[var(--secondary-container)]/30 text-[var(--secondary)]" : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                          }`}>
                          <span className="material-symbols-outlined">
                            {notif.category === "academic" ? "grade" : "chat_bubble"}
                          </span>
                        </div>
                      )}

                      {/* Content Engine Box */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                          <h4 className="font-headline-sm text-[var(--primary)] text-lg flex items-center gap-2">
                            {notif.title}
                            {notif.isRead && (
                              <span className="material-symbols-outlined text-xs text-[var(--on-surface-variant)]">check_circle</span>
                            )}
                          </h4>
                          <span className={`text-[10px] font-label-md py-1 px-2 rounded uppercase tracking-wider ${notif.priority === "high" ? "bg-[var(--surface-container)] text-[var(--on-surface-variant)]" : "text-[var(--on-surface-variant)]"
                            }`}>
                            {notif.timeLabel}
                          </span>
                        </div>

                        <p className="text-body-md text-[var(--on-surface-variant)] mb-4">{notif.description}</p>

                        {/* Interactive Context Layout Blocks */}
                        {notif.hasActions && (
                          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                            <button className="px-4 py-2 bg-[var(--primary)] text-white text-body-sm font-semibold rounded-lg hover:bg-[var(--primary-container)] transition-all">
                              {notif.actionText}
                            </button>
                            <button className="px-4 py-2 border border-[var(--outline)] text-[var(--on-surface-variant)] text-body-sm font-semibold rounded-lg hover:bg-[var(--surface-container-high)] transition-all">
                              {notif.secondaryActionText}
                            </button>
                          </div>
                        )}

                        {notif.hasLink && (
                          <button className="text-[var(--secondary)] font-bold text-body-sm flex items-center gap-1 hover:underline underline-offset-4">
                            {notif.linkLabel} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        )}

                        {notif.isEventCard && (
                          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <button className="px-6 py-2 bg-[var(--secondary)] text-white text-body-sm font-semibold rounded-lg hover:opacity-90 transition-all">
                              Join Event
                            </button>
                            <span className="text-body-sm text-[var(--on-surface-variant)] italic">{notif.friendsAttending} friends are attending</span>
                          </div>
                        )}

                        {notif.hasDownload && (
                          <button className="px-4 py-2 bg-[var(--surface-container-high)] text-[var(--primary)] text-body-sm font-semibold rounded-lg hover:bg-[var(--surface-container-highest)] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">download</span>
                            {notif.downloadLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Institutional Dashboard System Footer */}
          <footer className="w-full mt-auto border-t border-[var(--outline-variant)] bg-[var(--surface-container-highest)] py-8 px-margin-desktop">
            <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-headline-sm text-lg font-bold text-[var(--primary)] mb-2">EduSphere AI</h3>
                <p className="text-body-sm text-[var(--on-surface-variant)] text-center md:text-left">
                  © 2024 EduSphere AI. Bridging Academic Excellence & Intelligent Technology.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {["Institutional Partners", "Research Privacy", "Accessibility", "Support"].map((link, lIdx) => (
                  <a key={lIdx} className="text-body-sm text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors" href="#">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}