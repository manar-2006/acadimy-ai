'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CertificatesCenter() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('http://localhost:5000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Achievement Vault" />

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Academic Portfolio</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Achievement Vault</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Your verified academic milestones, courses completed, and specialized certifications.</p>
            </div>
          </div>
        </div>

        <main className="flex-grow px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full space-y-8">
          <section>
            <h2 className="font-sora text-[22px] font-bold text-[#002045] mb-6">Your Academic Course Certificates</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#006b5f] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#e0e3e5] border-dashed">
                <span className="material-symbols-outlined text-4xl text-[#74777f] block mb-2">verified_user</span>
                <p className="text-[#43474e] font-medium">No verified certificates found yet.</p>
                <p className="text-xs text-[#74777f] mt-1">Enroll in and complete courses in your dashboard to generate achievement logs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden hover:shadow-lg transition-all p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-[#d1fae5] text-[#065f46] rounded-full uppercase tracking-wider">
                          Course
                        </span>
                        <span className="text-xs text-[#74777f] font-semibold">Active Enrollment</span>
                      </div>
                      <h3 className="font-sora text-[17px] font-bold text-[#002045] leading-snug mb-2">{course.title}</h3>
                      <p className="text-[13px] text-[#74777f] leading-relaxed mb-4">{course.description || 'Verified course student enrollment certification.'}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-[#f0f2f5] mt-auto">
                      <span className="material-symbols-outlined text-[#006b5f] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="text-[11px] text-[#006b5f] font-bold">EduSphere Verified Achievement</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#e0e3e5] mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 py-5 gap-3 max-w-[1280px] mx-auto">
            <span className="text-sm font-bold text-[#002045]">EduSphere AI</span>
            <p className="text-xs text-[#74777f]">� 2026 EduSphere AI. Powered by Academic Intelligence.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
