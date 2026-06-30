"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

export default function TeacherProfile() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'

  // User state loaded from localStorage
  const [user, setUser] = useState({
    fullName: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    school: 'stanford',
    schoolName: 'Stanford University',
    major: 'Department of Computer Science',
    year: 'Professor',
    bio: 'A passionate educator and researcher with over 12 years of experience in artificial intelligence and machine learning. I believe in bridging theory and practice through project-based learning.',
    specializations: ['Machine Learning', 'Neural Networks', 'AI Ethics', 'Computational Linguistics'],
    role: 'teacher',
  });

  // Edit state mirrors user for in-place editing
  const [editState, setEditState] = useState({ ...user });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    let timer;
    if (typeof window !== 'undefined') {
      const storedUser = window.localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const merged = {
            fullName: parsed.fullName || 'Dr. Sarah Mitchell',
            email: parsed.email || 'sarah.mitchell@university.edu',
            school: parsed.school || 'stanford',
            schoolName: parsed.schoolName || parsed.school || 'Stanford University',
            major: parsed.major || 'Department of Computer Science',
            year: parsed.year || 'Professor',
            bio: parsed.bio || 'Passionate educator and researcher.',
            specializations: parsed.specializations || ['Machine Learning', 'Neural Networks'],
            role: parsed.role || 'teacher',
          };
          timer = setTimeout(() => {
            setUser(merged);
            setEditState(merged);
          }, 0);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const stats = [
    { label: 'Total Students', value: '342', icon: 'group', color: '#002045' },
    { label: 'Active Courses', value: '8', icon: 'school', color: '#006b5f' },
    { label: 'Avg. Engagement', value: '74%', icon: 'trending_up', color: '#09007b' },
    { label: 'Pending Reviews', value: '14', icon: 'rate_review', color: '#ba1a1a' },
  ];

  const activeCourses = [
    { name: 'CS-402: Operating Systems', students: 128, completion: 85, color: '#002045' },
    { name: 'CS-520: Machine Learning', students: 64, completion: 42, color: '#3cddc7' },
    { name: 'CS-301: Data Structures', students: 98, completion: 60, color: '#09007b' },
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel: revert to saved state
      setEditState({ ...user });
    }
    setIsEditing(!isEditing);
    setSaveStatus('');
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !editState.specializations.includes(tag)) {
      setEditState({ ...editState, specializations: [...editState.specializations, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setEditState({ ...editState, specializations: editState.specializations.filter(s => s !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: editState.fullName,
          school: editState.school,
          year: editState.year,
          major: editState.major,
          bio: editState.bio,
          specializations: editState.specializations,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const newUser = { ...editState, ...updated };
        setUser(newUser);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('user', JSON.stringify(newUser));
        }
        setSaveStatus('saved');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        // Save locally if backend not available
        setUser({ ...editState });
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('user', JSON.stringify({ ...editState }));
        }
        setSaveStatus('saved');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      // Graceful local fallback
      setUser({ ...editState });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('user', JSON.stringify({ ...editState }));
      }
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };
 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "" });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError("Server error occurred");
    }
  };

  const initials = user.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'T';

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-sora { font-family: 'Sora', sans-serif; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 107, 95, 0.1);
        }
        .ai-gradient-border::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #62fae3, #006b5f, #002045);
          z-index: -1;
          border-radius: inherit;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c4c6cf; border-radius: 10px; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideIn 0.35s ease-out forwards; }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="My Profile" />

        <main className="flex-grow p-6 md:p-10 max-w-[1280px] mx-auto w-full">

          {/* Save Status Toast */}
          {saveStatus === 'saved' && (
            <div className="fixed top-20 right-6 z-50 bg-[#006b5f] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 fade-in">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Profile saved successfully!
            </div>
          )}

          {/* ── Profile Banner ─────────────────────────────── */}
          <section className="mb-10">
            <div className="relative rounded-2xl overflow-hidden bg-[#002045] h-52 md:h-64 shadow-lg">
              {/* Banner Pattern */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, #62fae3 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, #09007b 0%, transparent 50%),
                    radial-gradient(circle at 60% 80%, #006b5f 0%, transparent 40%)`,
                }}
              />
              <div className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.4) 39px, rgba(255,255,255,0.4) 40px),
                    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.4) 39px, rgba(255,255,255,0.4) 40px)`,
                }}
              />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-[#002045]/80 to-transparent flex flex-col md:flex-row items-end gap-5">
                {/* Avatar */}
                <div className="relative ai-gradient-border rounded-2xl shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#006b5f] to-[#002045] flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-white text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {initials}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#62fae3] p-1.5 rounded-lg border-2 border-white">
                    <span className="material-symbols-outlined text-[#007165] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>

                {/* Name / Title */}
                <div className="flex-1 text-white pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-[#62fae3] uppercase">Faculty</span>
                    <span className="w-1 h-1 rounded-full bg-[#62fae3]/50"></span>
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-[#62fae3]/70 uppercase">{user.year || 'Instructor'}</span>
                  </div>
                  <h1 className="font-sora text-2xl md:text-3xl font-bold leading-tight">{user.fullName}</h1>
                  <p className="text-[14px] text-[#d6e3ff] mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">business</span>
                    {user.major} · {user.schoolName || user.school}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pb-1 shrink-0 flex-wrap">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="px-5 py-2 bg-[#006b5f] text-white rounded-full text-[13px] font-semibold flex items-center gap-2 hover:bg-[#005047] transition-colors shadow-md animate-duration-150"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-5 py-2 bg-[#1a365d] text-white rounded-full text-[13px] font-semibold flex items-center gap-2 hover:bg-[#112642] transition-colors shadow-md animate-duration-150"
                      >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        Change Password
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-[13px] font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-[#62fae3] text-[#007165] rounded-full text-[13px] font-semibold flex items-center gap-2 hover:bg-[#3cddc7] transition-colors shadow-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save Profile
                      </button>
                    </>
                  )}
                  <button className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats Row ──────────────────────────────────── */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-[#c4c6cf] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold tracking-wider text-[#43474e] uppercase">{stat.label}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                </div>
                <p className="font-sora text-[28px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </section>

          {/* ── Main Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* ── LEFT COLUMN ───────────── */}
            <div className="md:col-span-4 space-y-6">

              {/* Academic Info Card */}
              <div className="bg-white p-6 rounded-xl border border-[#c4c6cf] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-sora text-[20px] text-[#002045] mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                  Academic Info
                </h3>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-1">Full Name</label>
                      <input
                        className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-3 py-2 text-[14px] focus:border-[#006b5f] focus:ring-2 focus:ring-[#006b5f]/20 outline-none transition-all"
                        value={editState.fullName}
                        onChange={(e) => setEditState({ ...editState, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-1">Position</label>
                      <select
                        className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-3 py-2 text-[14px] focus:border-[#006b5f] outline-none appearance-none transition-all"
                        value={editState.year}
                        onChange={(e) => setEditState({ ...editState, year: e.target.value })}
                      >
                        {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Researcher', 'Adjunct'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-1">Department</label>
                      <input
                        className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-3 py-2 text-[14px] focus:border-[#006b5f] focus:ring-2 focus:ring-[#006b5f]/20 outline-none transition-all"
                        value={editState.major}
                        onChange={(e) => setEditState({ ...editState, major: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-0.5">Institution</span>
                      <span className="text-[15px] text-[#191c1e]">{user.schoolName || user.school}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 pt-2 border-t border-[#c4c6cf]">
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-0.5">Position</span>
                        <span className="text-[15px] text-[#191c1e]">{user.year || 'Professor'}</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-0.5">Department</span>
                        <span className="text-[15px] text-[#191c1e]">{user.major}</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider text-[#74777f] uppercase block mb-0.5">Email</span>
                        <span className="text-[14px] text-[#43474e]">{user.email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Card */}
              <div className="bg-white p-6 rounded-xl border border-[#c4c6cf] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-sora text-[20px] text-[#002045] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-3 py-2 text-[14px] focus:border-[#006b5f] focus:ring-2 focus:ring-[#006b5f]/20 outline-none transition-all resize-none"
                    rows={5}
                    value={editState.bio}
                    onChange={(e) => setEditState({ ...editState, bio: e.target.value })}
                    placeholder="Write a short bio about your academic background and teaching philosophy..."
                  />
                ) : (
                  <p className="text-[14px] leading-[22px] text-[#43474e]">
                    {user.bio || 'No biography added yet. Click "Edit Profile" to add one.'}
                  </p>
                )}
              </div>

              {/* Specializations Card */}
              <div className="bg-white p-6 rounded-xl border border-[#c4c6cf] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-sora text-[20px] text-[#002045] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                  Research Fields
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editState.specializations : user.specializations).map((tag, i) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold ${
                        i % 3 === 0 ? 'bg-[#62fae3] text-[#007165]' : 'bg-[#eceef0] text-[#43474e]'
                      }`}
                    >
                      {tag}
                      {isEditing && (
                        <button onClick={() => removeTag(tag)} className="hover:text-[#002045] transition-colors ml-0.5">
                          <span className="material-symbols-outlined text-[13px]">close</span>
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-4 flex gap-2">
                    <input
                      className="flex-1 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-3 py-2 text-[13px] focus:border-[#006b5f] outline-none"
                      placeholder="Add research field..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-[#006b5f] text-white rounded-lg text-[13px] font-semibold hover:bg-[#005047] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN ──────────── */}
            <div className="md:col-span-8 space-y-6">

              {/* AI Insight Card */}
              <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-7xl text-[#006b5f]">auto_awesome</span>
                </div>
                <div className="flex items-center gap-2 text-[#006b5f] mb-3">
                  <span className="material-symbols-outlined">smart_toy</span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase">AI Instructor Insight</span>
                </div>
                <h3 className="font-sora text-[20px] text-[#002045] mb-2">Your courses are performing well this semester!</h3>
                <p className="text-[14px] text-[#43474e] leading-relaxed max-w-xl">
                  Student engagement across your courses is up <span className="text-[#006b5f] font-bold">+12%</span> compared to last semester. CS-520 (ML) students have the highest quiz participation rate. Three students in CS-402 have been flagged for early academic support.
                </p>
                <button
                  onClick={() => router.push('/teacher/student-analytics')}
                  className="mt-4 px-4 py-2 bg-[#002045] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a365d] transition-all flex items-center gap-2"
                >
                  View Student Analytics
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Active Courses */}
              <div className="bg-white p-6 rounded-xl border border-[#c4c6cf] shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-sora text-[20px] text-[#002045] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                    Active Courses
                  </h3>
                  <button
                    onClick={() => router.push('/teacher/course-management')}
                    className="text-[#006b5f] text-[12px] font-semibold tracking-wider hover:underline flex items-center gap-1"
                  >
                    Manage All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {activeCourses.map((course) => (
                    <div key={course.name} className="group p-4 rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-2.5 h-10 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sora text-[15px] font-semibold text-[#002045] truncate group-hover:text-[#006b5f] transition-colors">{course.name}</h4>
                          <p className="text-[12px] text-[#43474e]">{course.students} enrolled students</p>
                        </div>
                        <span className="material-symbols-outlined text-[#74777f] group-hover:text-[#006b5f] text-[20px] transition-colors">arrow_outward</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${course.completion}%`, backgroundColor: course.color }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-[#43474e] w-8 text-right">{course.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/teacher/student-analytics')}
                  className="group bg-white p-6 rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] hover:shadow-md transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#002045]/10 flex items-center justify-center mb-3 group-hover:bg-[#006b5f]/10 transition-colors">
                    <span className="material-symbols-outlined text-[#002045] group-hover:text-[#006b5f] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  </div>
                  <h4 className="font-sora text-[15px] font-semibold text-[#002045] mb-1">Performance Analytics</h4>
                  <p className="text-[12px] text-[#43474e]">Review detailed metrics across all your courses.</p>
                </button>

                <button
                  onClick={() => router.push('/teacher/student-analytics')}
                  className="group bg-white p-6 rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] hover:shadow-md transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#006b5f]/10 flex items-center justify-center mb-3 group-hover:bg-[#006b5f]/20 transition-colors">
                    <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
                  </div>
                  <h4 className="font-sora text-[15px] font-semibold text-[#002045] mb-1">Student Analytics</h4>
                  <p className="text-[12px] text-[#43474e]">Track individual student progress and flag at-risk learners.</p>
                </button>

                <button
                  onClick={() => router.push('/teacher/course-management')}
                  className="group bg-white p-6 rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] hover:shadow-md transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#09007b]/10 flex items-center justify-center mb-3 group-hover:bg-[#09007b]/20 transition-colors">
                    <span className="material-symbols-outlined text-[#09007b]" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
                  </div>
                  <h4 className="font-sora text-[15px] font-semibold text-[#002045] mb-1">Course Creator</h4>
                  <p className="text-[12px] text-[#43474e]">Build and publish new courses with AI-generated materials.</p>
                </button>

                <button
                  onClick={() => router.push('/student/academic-assistant')}
                  className="group bg-white p-6 rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] hover:shadow-md transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#62fae3]/30 flex items-center justify-center mb-3 group-hover:bg-[#62fae3]/50 transition-colors">
                    <span className="material-symbols-outlined text-[#007165]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <h4 className="font-sora text-[15px] font-semibold text-[#002045] mb-1">AI Research Assistant</h4>
                  <p className="text-[12px] text-[#43474e]">Ask questions about your course materials and research papers.</p>
                </button>
              </div>

            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-[#e0e3e5] border-t border-[#c4c6cf] mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center p-10 gap-5 max-w-[1280px] mx-auto">
            <div>
              <span className="font-sora text-[20px] text-[#002045] font-bold block">EduSphere AI</span>
              <p className="text-[13px] text-[#43474e] mt-1">© 2026 EduSphere AI. Powered by Academic Intelligence.</p>
            </div>
            <div className="flex gap-6">
              <a className="text-[13px] text-[#43474e] hover:text-[#002045] transition-colors" href="#">Privacy Policy</a>
              <a className="text-[13px] text-[#43474e] hover:text-[#002045] transition-colors" href="#">Terms of Service</a>
              <a className="text-[13px] text-[#43474e] hover:text-[#002045] transition-colors" href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#c4c6cf] overflow-hidden shadow-2xl p-6 relative">
            <h3 className="font-sora text-xl font-bold text-[#002045] mb-4">Change Password</h3>
            
            {passwordError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-emerald-50 text-emerald-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                    setPasswordForm({ currentPassword: "", newPassword: "" });
                  }}
                  className="px-4 py-2 border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1a365d] text-white rounded-lg text-sm font-semibold hover:bg-[#112642] transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => router.push('/student/academic-assistant')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#006b5f] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">bolt</span>
        <div className="absolute right-16 px-4 py-2 bg-[#002045] text-white rounded-xl text-[13px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          Ask EduSphere AI
        </div>
      </button>
    </div>
  );
}
