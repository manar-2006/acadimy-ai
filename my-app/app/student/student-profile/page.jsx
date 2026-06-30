"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function StudentProfile() {
  const { t } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    fullName: "Alexander Vance",
    bio: "B.S. Computer Science & Artificial Intelligence",
    school: "Stanford University",
    year: "Senior (Year 4)",

    major: "Computer Science",
  });

  const [avatarSrc, setAvatarSrc] = useState(null);
  const avatarInputRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...userProfile });

  const universityMap = {
    estin_bejaia: "École Supérieure en Sciences et Technologies de l'Informatique et du Numérique (ESTIN)",
    esi_alger: "École nationale Supérieure d'Informatique (ESI ex-INI)",
    usthb: "Université des Sciences et de la Technologie Houari Boumediene (USTHB)",
    oxford: "University of Oxford",
    stanford: "Stanford University",
    mit: "Massachusetts Institute of Technology",
    cambridge: "University of Cambridge",
    eth_zurich: "ETH Zurich",
    harvard: "Harvard University",
    caltech: "California Institute of Technology",
    berkeley: "University of California, Berkeley",
    ucl: "University College London",
    imperial: "Imperial College London",
    nus: "National University of Singapore",
    tsinghua: "Tsinghua University",
    sorbonne: "Sorbonne University",
    other: "Other / Not Listed"
  };

  const yearMap = {
    "1": "Year 1",
    "2": "Year 2",
    "3": "Year 3",
    "4": " Year 4",
    "5": " Year 5",
    "grad": "Graduate"
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Use defaults for skills if not logged in
        setSkills([
          "Neural Networks", "Python", "Data Science", "LLM Architecture",
          "React.js", "Project Management", "Cloud Architecture", "Ethics in AI"
        ]);
        return;
      }

      // 1. Load from localStorage synchronously for instant user feedback
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const resolvedSchool = universityMap[parsed.school] || parsed.school || "Stanford University";
          const resolvedYear = yearMap[parsed.year] || parsed.year || "Senior (Year 4)";
          const profileData = {
            fullName: parsed.fullName || "Alexander Vance",
            bio: parsed.bio || "B.S. Computer Science & Artificial Intelligence",
            school: resolvedSchool,
            year: resolvedYear,
            major: parsed.major || "Computer Science",
          };
          setUserProfile(profileData);
          setEditForm(profileData);
          if (parsed.avatar) setAvatarSrc(parsed.avatar);
          if (parsed.specializations && parsed.specializations.length > 0) {
            setSkills(parsed.specializations);
          }
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }

      // 2. Fetch fresh profile details from backend
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));

        const resolvedSchool = universityMap[data.school] || data.school || "Stanford University";
        const resolvedYear = yearMap[data.year] || data.year || "Senior (Year 4)";

        const profileData = {
          fullName: data.fullName || "Alexander Vance",
          bio: data.bio || "B.S. Computer Science & Artificial Intelligence",
          school: resolvedSchool,
          year: resolvedYear,
          major: data.major || "Computer Science",
        };
        setUserProfile(profileData);
        setEditForm(profileData);
        if (data.avatar) setAvatarSrc(data.avatar);

        if (data.specializations && data.specializations.length > 0) {
          setSkills(data.specializations);
        } else {
          setSkills([
            "Neural Networks", "Python", "Data Science", "LLM Architecture",
            "React.js", "Project Management", "Cloud Architecture", "Ethics in AI"
          ]);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate: images only, max 5 MB
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setAvatarSrc(base64);
      // Persist to backend
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ avatar: base64 }),
        });
        if (res.ok) {
          const updated = await res.json();
          localStorage.setItem('user', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Failed to save avatar:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = async (e) => {
    e?.preventDefault();
    const newSkill = newSkillInput.trim();
    if (!newSkill) return;
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    setNewSkillInput('');
    setAddingSkill(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userProfile,
          specializations: updatedSkills
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Error persisting skill:", err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          specializations: skills
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify(updated));

        const resolvedSchool = universityMap[updated.school] || updated.school || editForm.school;
        const resolvedYear = yearMap[updated.year] || updated.year || editForm.year;

        setUserProfile({
          fullName: updated.fullName || editForm.fullName,
          bio: updated.bio || editForm.bio,
          school: resolvedSchool,
          year: resolvedYear,

          major: updated.major || editForm.major,
        });
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
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

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Structural Styles & Google Fonts Injections */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        body { font-family: 'Inter', sans-serif; }
        .font-sora { font-family: 'Sora', sans-serif; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 107, 95, 0.1);
        }
        .ai-gradient-border {
          position: relative;
        }
        .ai-gradient-border::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(to bottom right, #ffffff, #006b5f);
          z-index: -1;
          border-radius: inherit;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4c6cf;
          border-radius: 10px;
        }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Main Content Canvas Wrapper */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="My Profile" />

        {/* Main Content Canvas */}
        <main className="flex-grow p-6 md:p-10 max-w-[1280px] mx-auto w-full">

          {/* Profile Header Canvas Section */}
          <section className="mb-[48px]">
            <div className="relative rounded-2xl overflow-hidden bg-[#1a365d] h-48 md:h-64 shadow-lg">
              <img
                alt="Campus sunset grid texture"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnUYqRj7DGCP2s5MmLiyIdtD9EauWIjXljhUdeDOdQynpz35SXnOkpAnRkcBAKVk2dssOK9JfoI_wR_DlsEQ9onRVMMt_oB3fDlSrlteiQBHQv67IrPh4Fu7BcPKisirZ-FiAH4-tnsAHKAaVqg1xmX730GfUYv2vatkO6SZKHEfqk3mcNoTT4tp0tbqYNQPz0GYTyXvy2FfZEAUgomoSOdGvOLqfcIv9uSE08qS82RJGv2usCOQWdP38r8Qnwrz2Cey_Zr6J1LbQ"
              />
              <div className="absolute bottom-0 left-0 w-full p-[24px] bg-gradient-to-t from-[#002045]/90 to-transparent flex flex-col md:flex-row items-end gap-[24px]">
                <div className="relative">
                  {/* Hidden file input */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  {avatarSrc ? (
                    <img
                      alt="User profile avatar"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-[#ffffff] shadow-xl"
                      src={avatarSrc}
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#ffffff] shadow-xl bg-gradient-to-br from-[#006b5f] to-[#002045] flex items-center justify-center">
                      <span className="text-white font-sora font-bold text-3xl md:text-4xl">
                        {userProfile.fullName?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'A'}
                      </span>
                    </div>
                  )}
                  {/* Camera button to trigger file picker */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-[#006b5f] p-1.5 rounded-lg border-2 border-[#ffffff] hover:bg-[#005047] transition-colors"
                    title="Change profile photo"
                  >
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                  </button>
                </div>
                <div className="flex-1 text-[#ffffff] pb-[8px]">
                  <h1 className="font-sora text-3xl font-bold">{userProfile.fullName}</h1>
                  <p className="text-base text-[#d6e3ff] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">school</span>
                    {userProfile.bio}
                  </p>
                </div>
                <div className="flex gap-[12px] pb-[8px] flex-wrap">
                  <button
                    onClick={() => {
                      setEditForm({ ...userProfile });
                      setIsEditModalOpen(true);
                    }}
                    className="px-6 py-2 bg-[#006b5f] text-[#ffffff] rounded-full text-[12px] font-semibold tracking-wider flex items-center gap-2 hover:bg-[#005047] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    {t('editProfileBtn')}
                  </button>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-6 py-2 bg-[#1a365d] text-[#ffffff] rounded-full text-[12px] font-semibold tracking-wider flex items-center gap-2 hover:bg-[#112642] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">lock</span>
                    {t('changePasswordBtn')}
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-md text-[#ffffff] rounded-full hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined">{t('share').toLowerCase()}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid Analytics Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">

            {/* Left Data Column Structural Assets */}
            <div className="md:col-span-4 space-y-[24px]">
              {/* Personal Academic Card */}
              <div className="bg-[#ffffff] p-[24px] rounded-xl border border-[#c4c6cf] shadow-sm transition-all hover:shadow-md">
                <h3 className="font-sora text-xl text-[#002045] mb-[24px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f]">info</span>
                  {t('academicStatus')}
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold tracking-wider text-[#74777f] uppercase">{t('institution')}</span>
                    <span className="text-base text-[#191c1e]">{userProfile.school}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-semibold tracking-wider text-[#74777f] uppercase">{t('year')}</span>
                      <span className="text-base text-[#191c1e]">{userProfile.year}</span>
                    </div>

                  </div>
                  <div className="flex flex-col pt-2 border-t border-[#c4c6cf]">
                    <span className="text-[12px] font-semibold tracking-wider text-[#74777f] uppercase">{t('major')}</span>
                    <span className="text-base text-[#191c1e]">{userProfile.major}</span>
                  </div>

                </div>
              </div>

              {/* Skills Engine Wrapper */}
              <div className="bg-[#ffffff] p-[24px] rounded-xl border border-[#c4c6cf] shadow-sm">
                <h3 className="font-sora text-xl text-[#002045] mb-[24px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b5f]">psychology</span>
                  {t('skillSet')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-lg text-[12px] font-semibold tracking-wider ${index % 3 === 0
                        ? "bg-[#62fae3] text-[#007165]"
                        : "bg-[#eceef0] text-[#43474e]"
                        }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {addingSkill ? (
                  <form onSubmit={handleAddSkill} className="mt-[24px] flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                      placeholder="e.g. Machine Learning"
                      className="flex-1 border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006b5f]"
                    />
                    <button type="submit" className="px-3 py-2 bg-[#006b5f] text-white rounded-lg text-sm font-semibold hover:bg-[#005047] transition-colors">Add</button>
                    <button type="button" onClick={() => { setAddingSkill(false); setNewSkillInput(''); }} className="px-3 py-2 text-[#74777f] rounded-lg text-sm hover:bg-[#f0f2f4] transition-colors">✕</button>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingSkill(true)}
                    className="mt-[24px] w-full py-2 text-[#006b5f] text-[12px] font-semibold tracking-wider hover:bg-[#62fae3]/20 rounded-lg transition-colors border border-[#006b5f] border-dashed"
                  >
                    Add New Skill
                  </button>
                )}
              </div>
            </div>

            {/* Right Core System Panel Showcase */}
            <div className="md:col-span-8 space-y-[24px]">
              {/* Top Activity Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                <div className="glass-panel p-[24px] rounded-xl shadow-sm text-center">
                  <span className="block font-sora text-2xl font-bold text-[#002045]">1,240</span>
                  <span className="text-[#43474e] text-[12px] font-semibold tracking-wider">Study Hours</span>
                </div>
                <div className="glass-panel p-[24px] rounded-xl shadow-sm text-center">
                  <span className="block font-sora text-2xl font-bold text-[#006b5f]">42</span>
                  <span className="text-[#43474e] text-[12px] font-semibold tracking-wider">AI Insights</span>
                </div>
                <div className="glass-panel p-[24px] rounded-xl shadow-sm text-center">
                  <span className="block font-sora text-2xl font-bold text-[#002045]">15</span>
                  <span className="text-[#43474e] text-[12px] font-semibold tracking-wider">Contributions</span>
                </div>
                <div className="glass-panel p-[24px] rounded-xl shadow-sm text-center border-2 border-[#006b5f]/20">
                  <span className="block font-sora text-2xl font-bold text-[#006b5f]">98%</span>
                  <span className="text-[#43474e] text-[12px] font-semibold tracking-wider">Quiz Accuracy</span>
                </div>
              </div>

              {/* Featured Projects Grid Area */}
              <div className="bg-[#ffffff] p-[24px] rounded-xl border border-[#c4c6cf] shadow-sm">
                <div className="flex justify-between items-center mb-[24px]">
                  <h3 className="font-sora text-xl text-[#002045] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f]">rocket_launch</span>
                    Featured Projects
                  </h3>
                  <a className="text-[#006b5f] text-[12px] font-semibold tracking-wider hover:underline" href="#">View All</a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                  {/* Project Card 1 */}
                  <div className="group p-[24px] rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] transition-all cursor-pointer">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#006b5f] text-sm font-bold uppercase tracking-tighter">Research Phase</span>
                      <span className="material-symbols-outlined text-[#74777f] group-hover:text-[#006b5f]">arrow_outward</span>
                    </div>
                    <h4 className="font-sora text-xl text-[#191c1e] group-hover:text-[#002045] transition-colors">NeuralScribe AI</h4>
                    <p className="text-[#43474e] text-sm mt-2 line-clamp-2">Real-time academic lecture transcription with automatic semantic mapping and concept linking.</p>
                    <div className="mt-4 flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#c4c6cf]"></span>
                    </div>
                  </div>
                  {/* Project Card 2 */}
                  <div className="group p-[24px] rounded-xl border border-[#c4c6cf] hover:border-[#006b5f] transition-all cursor-pointer">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#1a365d] text-sm font-bold uppercase tracking-tighter">Completed</span>
                      <span className="material-symbols-outlined text-[#74777f] group-hover:text-[#006b5f]">arrow_outward</span>
                    </div>
                    <h4 className="font-sora text-xl text-[#191c1e] group-hover:text-[#002045] transition-colors">EcoMetric Grid</h4>
                    <p className="text-[#43474e] text-sm mt-2 line-clamp-2">Visualizing campus energy consumption through an interactive 3D digital twin dashboard.</p>
                    <div className="mt-4 flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#002045]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#002045]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#002045]"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timelines and Badges Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                {/* Achievements Card Panel */}
                <div className="bg-[#ffffff] p-[24px] rounded-xl border border-[#c4c6cf] shadow-sm">
                  <h3 className="font-sora text-xl text-[#002045] mb-[24px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f]">military_tech</span>
                    Achievements
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1a365d]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1a365d]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#191c1e]">Dean's List 2023</h5>
                        <p className="text-sm text-[#43474e]">Top 5% of Department for 3 consecutive semesters.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#62fae3]/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#191c1e]">AI Innovation Award</h5>
                        <p className="text-sm text-[#43474e]">Winner of the Inter-University AI Ethics Hackathon.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Study Momentum Custom Track Engine */}
                <div className="bg-[#ffffff] p-[24px] rounded-xl border border-[#c4c6cf] shadow-sm">
                  <h3 className="font-sora text-xl text-[#002045] mb-[24px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006b5f]">analytics</span>
                    Study Momentum
                  </h3>
                  <div className="space-y-[24px] h-48 overflow-y-auto custom-scrollbar pr-2">
                    <div className="flex items-start gap-3 relative pb-4 border-l-2 border-[#c4c6cf] ml-2 pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#006b5f] ring-4 ring-[#ffffff]"></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#002045]">Today</span>
                        <p className="text-sm text-[#43474e]">Completed "Advanced Algorithms" Module 4. +50 XP</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 relative pb-4 border-l-2 border-[#c4c6cf] ml-2 pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#74777f] ring-4 ring-[#ffffff]"></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#43474e]">Yesterday</span>
                        <p className="text-sm text-[#43474e]">Contributed to Community Thread: "Ethics of AGI".</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 relative pb-2 border-l-2 border-transparent ml-2 pl-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#c4c6cf] ring-4 ring-[#ffffff]"></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#74777f]">2 Days Ago</span>
                        <p className="text-sm text-[#43474e]">Updated Research Paper Draft: Project NeuralScribe.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="mt-[48px] bg-[#e0e3e5] border-t border-[#c4c6cf]">
          <div className="flex flex-col md:flex-row justify-between items-center p-[48px] gap-[24px] w-full max-w-[1280px] mx-auto">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-sora text-xl text-[#002045] font-bold">EduSphere AI</span>
              <p className="text-sm text-[#43474e] mt-2">© 2026 EduSphere AI. Powered by Academic Intelligence.</p>
            </div>
            <div className="flex gap-[24px]">
              <a className="text-[#43474e] hover:text-[#002045] transition-colors text-sm" href="#">Privacy Policy</a>
              <a className="text-[#43474e] hover:text-[#002045] transition-colors text-sm" href="#">Terms of Service</a>
              <a className="text-[#43474e] hover:text-[#002045] transition-colors text-sm" href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-[#c4c6cf] overflow-hidden shadow-2xl p-6 relative">
            <h3 className="font-sora text-xl font-bold text-[#002045] mb-4">Edit Profile Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Title / Major Focus</label>
                  <input
                    type="text"
                    className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Institution</label>
                  <input
                    type="text"
                    className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                    value={editForm.school}
                    onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Academic Year</label>
                  <input
                    type="text"
                    className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Major</label>
                  <input
                    type="text"
                    className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                    value={editForm.major}
                    onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                  />
                </div>

              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006b5f] text-white rounded-lg text-sm font-semibold hover:bg-[#005047] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Floating Action Button (FAB) for AI Interaction */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#006b5f] text-[#ffffff] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">bolt</span>
        <div className="absolute right-16 px-4 py-2 bg-[#002045] text-[#ffffff] rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          Ask EduSphere AI
        </div>
      </button>
    </div>
  );
}