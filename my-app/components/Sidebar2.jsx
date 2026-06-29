"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar({ mobileNavOpen, setMobileNavOpen }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/');
    };

    const navItems = [
        { icon: "admin_panel_settings", label: "Instructor Hub",     path: "/teacher/instructor-dashboard" },
        { icon: "smart_toy",            label: "Ask AI",             path: "/teacher/ask-ai" },
        { icon: "query_stats",          label: "Student Analytics",  path: "/teacher/student-analytics" },
        { icon: "add_box",             label: "Course Management",   path: "/teacher/course-management" },
        { icon: "bar_chart",           label: "Performance",         path: "/teacher/performance-analytics" },
        { icon: "notifications",       label: "Notifications",       path: "/teacher/notifications", badge: true },
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 z-50 transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                {/* Brand/Logo */}
                <div className="px-6 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                        <h1 className="font-sora text-[20px] font-bold text-primary leading-tight">EduSphere AI</h1>
                        <p className="font-label-md text-[11px] text-on-surface-variant opacity-75">Instructor Hub</p>
                    </div>
                </div>

                {/* Scrollable Navigation List */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setMobileNavOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-[13px] font-medium ${isActive
                                    ? "bg-surface-container-highest text-primary font-bold border-l-4 border-secondary-fixed-dim"
                                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Static Sidebar Footer links */}
                <div className="px-3 pt-4 border-t border-outline-variant space-y-0.5">
                    <Link
                        href="/teacher/teacher-profile"
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-[13px] font-medium ${pathname === "/teacher/teacher-profile" ? "bg-surface-container-highest text-primary font-bold border-l-4 border-secondary-fixed-dim" : ""
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: pathname === "/teacher/teacher-profile" ? "'FILL' 1" : "'FILL' 0" }}>
                            account_circle
                        </span>
                        My Profile
                    </Link>
                    <button
                        onClick={() => { setMobileNavOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all text-[13px] font-medium border-none bg-transparent cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
