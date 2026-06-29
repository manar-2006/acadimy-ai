"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ setMobileNavOpen, title = "EduSphere AI" }) {
  const router = useRouter();
  const [profileRoute, setProfileRoute] = useState('/student/student-profile');
  const [askAiRoute, setAskAiRoute] = useState('/student/academic-assistant');
  const [notificationsRoute, setNotificationsRoute] = useState('/student/notifications-center');
  const [initials, setInitials] = useState('A');
  const [currentRole, setCurrentRole] = useState('student');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.role === 'teacher') {
            setProfileRoute('/teacher/teacher-profile');
            setAskAiRoute('/teacher/ask-ai');
            setNotificationsRoute('/teacher/notifications');
          }
          if (user.role) {
            setCurrentRole(user.role);
          }
          if (user.fullName) {
            const parts = user.fullName.trim().split(' ');
            const init = parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
            if (init) setInitials(init);
          } else if (user.email) {
            setInitials(user.email[0].toUpperCase());
          }
        } catch (e) { }
      }
    }
  }, []);

  const toggleRole = () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          const newRole = user.role === 'teacher' ? 'student' : 'teacher';
          user.role = newRole;
          window.localStorage.setItem('user', JSON.stringify(user));

          if (newRole === 'teacher') {
            router.push('/teacher/instructor-dashboard');
          } else {
            router.push('/student/dashboard');
          }
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileNavOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center border-none cursor-pointer"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-sora text-[20px] font-bold text-primary">{title}</h2>
        </div>
      </div>

      {/* Right-side quick controls */}
      <div className="flex items-center gap-4">


        {/* Quick Ask AI button */}
        <button
          onClick={() => router.push(askAiRoute)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed font-semibold text-[13px] rounded-lg hover:opacity-90 transition-all border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Ask AI
        </button>

        {/* Notifications Icon with Indicator */}
        <button
          onClick={() => router.push(notificationsRoute)}
          className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center border-none cursor-pointer text-on-surface-variant"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => router.push(profileRoute)}
          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px] border-none cursor-pointer hover:opacity-90 transition-all"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}

