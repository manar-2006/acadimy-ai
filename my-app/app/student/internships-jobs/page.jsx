"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
export default function CareerPortal() {
  // Navigation & UI States
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Career Center');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Track applied status for jobs dynamically
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleGetAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: "Analyze the current job market trends for Computer Science students and output exactly 3 bullet points with recommended tech stack to focus on. Keep it extremely brief.",
          history: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch insights');
      setAiInsight(data.text || '');
    } catch (err) {
      setAiInsight('Could not load AI recommendations at this time. Please try again.');
    } finally {
      setLoadingInsights(false);
    }
  };

  // Sidebar Menu Configuration
  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'AI Assistant', icon: 'smart_toy' },
    { name: 'Courses', icon: 'school' },
    { name: 'Career Center', icon: 'work' },
    { name: 'Community', icon: 'group' },
    { name: 'Settings', icon: 'settings' }
  ];

  // AI Insights Recommendation Data
  const recommendations = [
    { id: 1, initial: 'A', name: 'Apex Robotics', industry: 'Autonomous Systems' },
    { id: 2, initial: 'N', name: 'NeuralGrid AI', industry: 'Cloud Infrastructure' },
    { id: 3, initial: 'Q', name: 'Quantom', industry: 'Fintech Solutions' }
  ];

  // Application Tracker Data
  const initialApplications = [
    { id: 101, role: 'Frontend Intern', company: 'Lumina Design Studio', status: 'Interviewing', border: 'border-[#006b5f]', bgTag: 'bg-[#006b5f]/10', textTag: 'text-[#006b5f]' },
    { id: 102, role: 'Data Science Co-op', company: 'StatCore Analytics', status: 'Applied', border: 'border-[#002045]', bgTag: 'bg-[#002045]/10', textTag: 'text-[#002045]' },
    { id: 103, role: 'Software Engineer', company: 'FutureLogix Inc.', status: 'Closed', border: 'border-[#c4c6cf]', bgTag: 'bg-[#43474e]/10', textTag: 'text-[#43474e]', opacity: 'opacity-60' }
  ];

  // Recommended Roles Data Stream
  const rawJobs = [
    {
      id: 1,
      role: 'Machine Learning Intern',
      company: 'NVIDIA Ecosystem',
      match: '98%',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl9drXwIwOkQzreXHMyDR_WIxqrZwIIBuPPG1oYg1kGTEIw4PdVu8gkSOSl3dqn8m79N312xB9obTdznGEeEh2v6-bLn70WlO-QcCSX32E8SMxp0d_B7g1xws4e5oAtfJE9Irs5fgqJBW9j0D4i748IvXwlZwbGfGyQzbeL7Yyd3Es1bg4iwTs7Q204FsFVGoj5Qfjrzsc0kEaoDAJeyEraOF5mGlM6diEqP3a8Idih26Mu2qbw9qIv2qKi7cEepeh_4oMckcPSOU',
      tags: ['Python', 'PyTorch', 'Remote'],
      location: 'Santa Clara, CA',
      isHighMatch: true
    },
    {
      id: 2,
      role: 'Product Design Junior',
      company: 'Canvas Labs',
      match: '92%',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAG53FzUDWxok36lOWTlfjuQSzYys7vt0HTpUqZ_ohT9wev2OoYE9Tr63TlM3U4Q7eriosWsK8wy7tAar2NPjcuN5-sMUXJWfgy3JFYhpOpvodg41mEBzliJpDn4CI47W5dT3CMLUFc9BwXCFRhmYY-qT-6HulZ_Gfbdb-th-_tdyDnlcZBOVuQyFUZ8R5k_1PVhLefJJmJRBOadLlgfpdIkL_uad336e7CeOyqlCqVMhjojuLZmTh5Wd48gPzECtMd5PNg198zAo',
      tags: ['Figma', 'UX Research', 'Hybrid'],
      location: 'Austin, TX',
      isHighMatch: true
    },
    {
      id: 3,
      role: 'Business Analyst',
      company: 'Global Insights Group',
      match: '85%',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmCq25W8AInsN0a7INBbPxiKCHOlaOsMpFKzZJ2A7DvBb6_tD2TM8eEKDZly5Mechce9x4mI4Bi5Xc0_bw1md5m4hvCM3Ft4WBePtJio7CgB2UQEQWTjDrDjNQooZ18yNBJNo0kd2Jajb373Rs51-Ep2dq-L4P2iP5v9JFgSqcHSvrtmYVGBZ3qT6XTTSqfn7u7tITD2U8njUYj60_YXc_Sl48pfTy5gBeV2T5seCyQS7EMal6okbAtz-aUKgACPBpF0yd2uAC0hM',
      tags: ['SQL', 'Tableau', 'On-site'],
      location: 'New York, NY',
      isHighMatch: false
    },
    {
      id: 4,
      role: 'Backend Developer',
      company: 'Velocity Systems',
      match: '90%',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIygUkwghXABzSVSbnW9uANAeeEnp5J3k4piUZEwADAIM8uB0eHqz4f93OIpMCYMsEb1_K9K3VLNagNo7y_YU_42l102fi5ODES0-7twOvPZy1fD9vLG8e_Jf3-Ha5fi-aHoADIZb7A86eIv9aJMFaGXQ5cCFuvzQbH806gOrjd1y4SGmoJ0Q_-nmjG2XHeG71UpFOD3CkUXP6j-prexjAjFFlQvOflycx23Ck_ZAi73osS9vNsKFO8J_hBFiQSej_Gd6QILlhmnI',
      tags: ['Node.js', 'AWS', 'Remote'],
      location: 'Seattle, WA',
      isHighMatch: true
    }
  ];

  // Toggle Filter logic
  const handleFilterToggle = (filterName) => {
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filterName));
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  };

  // Quick Apply action logic
  const handleQuickApply = (id) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  // Handle alert creation
  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      alert(`Success! Job alert profiles created for ${emailInput}`);
      setEmailInput('');
    }
  };

  // Filtered Jobs Computation
  const filteredJobs = rawJobs.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilters.length === 0) return matchesSearch;

    // Check if any of the active filter tags exist in the job description parameters
    const matchesFilters = selectedFilters.every(filter => {
      if (filter === 'Remote') return job.tags.includes('Remote');
      if (filter === 'Tech Industry') return job.isHighMatch || job.tags.includes('Python') || job.tags.includes('Node.js');
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="bg-[#f0f2f5] text-[#191c1e] font-['Inter'] min-h-screen antialiased selection:bg-[#62fae3]/30">
      {/* Universal Dynamic Fonts & Metatags Embedding */}
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <Sidebar
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      <div className="flex-grow lg:ml-64 flex flex-col min-h-screen">
        <Navbar
          setMobileNavOpen={setMobileNavOpen}
          title="Jobs Portal"
        />

        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Career Hub</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Internships & Jobs</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Connecting your academic excellence with global professional opportunities through AI-driven matching.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">120+</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Open Roles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Viewport Main Component Body */}
        <main className="flex-grow px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full space-y-8">

          {/* Section A: Filters & Search */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#e0e3e5] rounded-2xl p-4 shadow-sm">
            {/* Search Input Box */}
            <div className={`relative w-full max-w-md bg-[#f0f2f5] rounded-xl px-4 py-2.5 flex items-center gap-2 border transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-[#006b5f]/30 border-[#006b5f]' : 'border-[#e0e3e5]'}`}>
              <span className="material-symbols-outlined text-[#43474e] select-none">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-normal text-[14px] outline-none text-[#191c1e] placeholder-[#74777f]"
                placeholder="Search roles, companies, or industries..."
                type="text"
              />
            </div>

            <div className="flex gap-2 flex-wrap shrink-0">
              <button
                onClick={() => handleFilterToggle('Remote')}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-150 font-bold text-sm ${selectedFilters.includes('Remote')
                  ? 'bg-[#006b5f] text-white border-transparent shadow-sm'
                  : 'bg-white border-[#c4c6cf] text-[#191c1e] hover:bg-[#f2f4f6]'
                  }`}
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                <span>Remote</span>
              </button>

              <button
                onClick={() => handleFilterToggle('Tech Industry')}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-150 font-bold text-sm ${selectedFilters.includes('Tech Industry')
                  ? 'bg-[#006b5f] text-white border-transparent shadow-sm'
                  : 'bg-white border-[#c4c6cf] text-[#191c1e] hover:bg-[#f2f4f6]'
                  }`}
              >
                <span className="material-symbols-outlined text-sm">business</span>
                <span>Tech Industry</span>
              </button>
            </div>
          </section>

          {/* Section B: Modular Data Bento Core Grid Layout */}
          <section className="grid grid-cols-12 gap-6">

            {/* Column Stream 1: Left Dashboard Sidebars & Widgets (AI Insights + Trackers) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              {/* Widget Block 1: AI Pipeline Generated System Matches */}
              <div className="bg-white/70 backdrop-blur-md border border-[#006b5f]/10 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#62fae3] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[#006b5f] text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <h3 className="font-['Sora'] text-[20px] font-semibold text-[#002045]">AI Insights</h3>
                </div>

                <p className="text-[13px] text-[#43474e] leading-[22px] mb-4">
                  Let AI analyze your cohort profile and recommend tailored placement matching.
                </p>

                {aiInsight ? (
                  <div className="p-3 bg-[#d1fae5]/50 border border-[#006b5f]/20 rounded-xl text-xs text-[#191c1e] mb-4 leading-relaxed whitespace-pre-wrap">
                    {aiInsight}
                  </div>
                ) : null}

                <button
                  onClick={handleGetAIInsights}
                  disabled={loadingInsights}
                  className="w-full mb-4 py-2 bg-[#006b5f] hover:bg-[#005047] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loadingInsights ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[14px]">psychology</span>Analyze Opportunities with AI</>
                  )}
                </button>

                <div className="space-y-3">
                  {recommendations.map((company) => (
                    <div
                      key={company.id}
                      onClick={() => setSearchQuery(company.name)}
                      className="flex items-center gap-4 p-3 bg-white/50 rounded-lg border border-[#c4c6cf]/30 hover:border-[#006b5f] transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[#002045] shadow-sm">
                        {company.initial}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-sm text-[#191c1e] group-hover:text-[#006b5f] transition-colors">{company.name}</p>
                        <p className="text-[10px] text-[#43474e] uppercase font-bold tracking-wider mt-0.5">{company.industry}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#006b5f] transform group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Block 2: Active User Student Application Tracking Log */}
              <div className="bg-white border border-[#c4c6cf] rounded-xl p-6 shadow-sm">
                <h3 className="font-['Sora'] text-[20px] font-semibold text-[#002045] mb-6">Current Tracker</h3>

                <div className="space-y-4">
                  {initialApplications.map((app) => (
                    <div key={app.id} className={`p-3 border-l-4 ${app.border} bg-[#f2f4f6] rounded-r-lg ${app.opacity || ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-sm text-[#002045]">{app.role}</p>
                        <span className={`px-2 py-0.5 ${app.bgTag} ${app.textTag} text-[10px] rounded uppercase font-bold tracking-wider`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#43474e] font-medium">{app.company}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 text-[#006b5f] font-bold text-sm hover:underline transition-all text-center block">
                  View All Applications
                </button>
              </div>
            </div>

            {/* Column Stream 2: Right Main Job Matrix Directory Output */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-['Sora'] text-[24px] font-semibold text-[#002045]">Recommended Roles</h3>
                <div className="text-sm font-bold text-[#43474e] bg-[#e6e8ea] px-3 py-1 rounded-full">
                  {filteredJobs.length} Roles Found
                </div>
              </div>

              {/* Grid System holding specific job elements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const hasApplied = appliedJobs.includes(job.id);
                    return (
                      <div
                        key={job.id}
                        className="group bg-white border border-[#c4c6cf] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
                      >
                        <div>
                          {/* Match Percentage Display Accent */}
                          <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#62fae3] px-2.5 py-1 rounded-full shadow-sm">
                            <span className="material-symbols-outlined text-[#006b5f] text-xs select-none" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            <span className="text-[10px] font-bold text-[#007165]">{job.match} Match</span>
                          </div>

                          <div className="flex items-start gap-4 mb-4 pr-16">
                            <img
                              alt={`${job.company} Corporate Visual Representation`}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-[#c4c6cf]/30"
                              src={job.logo}
                            />
                            <div>
                              <h4 className="font-bold text-[#002045] group-hover:text-[#006b5f] transition-colors leading-snug">{job.role}</h4>
                              <p className="text-sm text-[#43474e] mt-0.5 font-medium">{job.company}</p>
                            </div>
                          </div>

                          {/* Skill Tags Stream Layout Map */}
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {job.tags.map((tag, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-[#eceef0] rounded-full text-[10px] font-bold text-[#43474e]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Footer Toolbar Inside Job Card */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#c4c6cf]/30 mt-auto">
                          <span className="text-xs text-[#43474e] flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-sm select-none">location_on</span>
                            {job.location}
                          </span>

                          <button
                            disabled={hasApplied}
                            onClick={() => handleQuickApply(job.id)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all transform active:scale-95 ${hasApplied
                              ? 'bg-[#e6e8ea] text-[#74777f] cursor-default'
                              : 'bg-[#002045] text-white hover:bg-[#1a365d] shadow-sm'
                              }`}
                          >
                            {hasApplied ? 'Applied ✓' : 'Quick Apply'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-[#c4c6cf] border-dashed">
                    <span className="material-symbols-outlined text-4xl text-[#74777f] block mb-2">find_in_page</span>
                    <p className="text-[#43474e] font-medium">No roles match your exact filtering matrix.</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedFilters([]); }} className="text-[#006b5f] text-sm font-bold mt-2 hover:underline">
                      Reset all lookup parameters
                    </button>
                  </div>
                )}
              </div>

              {/* Core Stream Interface Load Trigger */}
              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 bg-white border-2 border-[#002045] text-[#002045] font-bold rounded-lg hover:bg-[#002045] hover:text-white transition-all duration-200 shadow-sm active:scale-[0.98]">
                  Explore All Listings
                </button>
              </div>
            </div>
          </section>

          {/* Section C: Institutional Newsletter / Custom Job Alert Marketing Banner */}
          <section className="pt-4">
            <div className="bg-[#1a365d] text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center lg:text-left">
                  <h2 className="font-['Sora'] text-[24px] md:text-[32px] font-semibold text-white tracking-tight leading-tight">
                    Never miss an opportunity
                  </h2>
                  <p className="text-[#d6e3ff]/80 mt-3 text-sm md:text-base leading-relaxed font-normal">
                    Set up custom job alerts and let EduSphere AI monitor new openings that match your academic profile and research interests.
                  </p>
                </div>

                <form onSubmit={handleCreateAlert} className="flex flex-col sm:flex-row w-full lg:w-auto gap-2.5 max-w-md">
                  <input
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-grow lg:w-64 bg-white/10 border border-white/20 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#62fae3]/50 placeholder-white/50 text-white text-sm"
                    placeholder="you@university.edu"
                    type="email"
                  />
                  <button type="submit" className="bg-[#006b5f] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#005047] transition-all whitespace-nowrap text-sm active:scale-95 shadow-md">
                    Create Alert
                  </button>
                </form>
              </div>

              {/* Abstract High-End Atmospheric Blur Accents */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#006b5f]/20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#002045]/40 blur-[100px] rounded-full pointer-events-none"></div>
            </div>
          </section>
        </main>

        {/* Global Standard Workspace Footer Layout */}
        <footer className="w-full px-12 py-6 flex flex-col md:flex-row justify-between items-center bg-[#e0e3e5] border-t border-[#c4c6cf] mt-auto text-center md:text-left gap-4">
          <div>
            <p className="text-[12px] text-[#43474e] font-medium leading-relaxed">
              © 2026 EduSphere AI. Bridging Academic Excellence &amp; Intelligent Technology.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[12px] font-semibold text-[#43474e]">
            <a className="hover:text-[#006b5f] transition-colors" href="#partners">Institutional Partners</a>
            <a className="hover:text-[#006b5f] transition-colors" href="#privacy">Research Privacy</a>
            <a className="hover:text-[#006b5f] transition-colors" href="#accessibility">Accessibility</a>
            <a className="hover:text-[#006b5f] transition-colors" href="#support">Support</a>
          </div>
        </footer>
      </div>

      {/* Persistent Overlay Assistant Launch System Trigger */}
      <button
        onClick={() => alert("Launching Chat Assistant Core...")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#006b5f] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="material-symbols-outlined text-2xl select-none">chat</span>
        <span className="absolute right-16 bg-[#002045] text-white px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-[0.05em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          Chat Assistant
        </span>
      </button>
    </div>
  );
}