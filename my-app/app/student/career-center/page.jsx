"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function CareerCenter() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [visibleBars, setVisibleBars] = useState(false);
  const [summary, setSummary] = useState("Adaptive and detail-oriented Computer Science student with a strong foundation in AI development. Experienced in building LLM-integrated tools and optimizing campus data transit...");
  const [isSynced, setIsSynced] = useState(false);
  const [atsScore, setAtsScore] = useState(85);
  const [skillsList, setSkillsList] = useState(["PyTorch", "Docker", "AWS"]);
  const [addedSkills, setAddedSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const skillBars = [
    { label: "Technical Foundation", pct: 85 },
    { label: "AI/ML Proficiency",    pct: 42 },
    { label: "System Design",        pct: 68 },
    { label: "Soft Skills",          pct: 92 },
  ];

  const careerRecs = [
    { id: 1, title: "Data Scientist",  icon: "analytics", match: 92, desc: "Focus: Predictive modeling and large-scale data processing.",         skills: ["Python", "TensorFlow", "Statistics"] },
    { id: 2, title: "DevOps Engineer", icon: "cloud",     match: 84, desc: "Focus: CI/CD automation and scalable cloud infrastructure.",          skills: ["Docker", "AWS", "Kubernetes"] },
  ];

  const internships = [
    { id: 1, title: "Cloud Platform Intern",   company: "Google Cloud",    location: "Remote / London",    salary: "£42k equivalent", icon: "cloud",      badge: "New",       badgeBg: "#d1fae5", badgeText: "#065f46" },
    { id: 2, title: "AI Research Assistant",   company: "OpenAI Lab",      location: "San Francisco, CA",  salary: "Housing Stipend", icon: "hub",        badge: "2 days left", badgeBg: "#fee2e2", badgeText: "#991b1b" },
    { id: 3, title: "Data Analyst Intern",     company: "Global Bank Corp", location: "New York, NY",      salary: "Competitive",     icon: "data_usage", badge: "Matched",   badgeBg: "#e8eaf6", badgeText: "#3949ab" },
  ];

  const radius = 36;
  const circ   = 2 * Math.PI * radius;
  const dashOffset = circ - (atsScore / 100) * circ;

  const [improving, setImproving] = useState(false);

  const handleAIImprovement = async () => {
    if (!summary.trim() || improving) return;
    setImproving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: `Optimize and rewrite this student resume summary to be highly professional and ATS-optimized. Return ONLY the optimized text, nothing else:\n\n"${summary}"`,
          history: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Optimization failed');
      setSummary(data.text || summary);
      setAtsScore(Math.min(95 + Math.floor(Math.random() * 5), 100)); // Simulate higher ATS score
    } catch (err) {
      alert(err.message || 'Could not connect to AI advisor. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  const addSkill = (skill) => {
    if (!addedSkills.includes(skill)) {
      setAddedSkills([...addedSkills, skill]);
      setSkillsList(skillsList.filter((s) => s !== skill));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisibleBars(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href={FONTS} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeInUp .45s ease-out forwards; }
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; vertical-align:middle; }
        .card { background:#fff; border-radius:16px; border:1px solid #e0e3e5; box-shadow:0 1px 4px rgba(0,0,0,.04); }
        .skill-bar { transition: width 1s cubic-bezier(.22,.61,.36,1); }
      ` }} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Career Center" />

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Career Development</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Career Center</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Build your CV, track career paths, explore internships, and leverage AI to reach your career goals.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">{atsScore}%</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">ATS Score</p>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">92%</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Best Match</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <main className="px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full space-y-8">

          {/* AI Projects Hub */}
          <section className="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] font-bold text-[#006b5f] uppercase tracking-widest mb-1">Recommended for You</p>
                <h2 className="font-['Sora'] text-[22px] font-bold text-[#002045]">AI-Powered Projects Hub</h2>
                <p className="text-[13px] text-[#74777f] mt-1">Portfolio-building trajectories tailored to your CS major.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-4 py-2 bg-[#eceef0] rounded-xl text-[12px] font-semibold hover:bg-[#e0e3e5] transition-colors">Refine Major</button>
                <button onClick={() => setIsSynced(!isSynced)}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-white shadow-sm transition-all hover:opacity-90"
                  style={{ background: isSynced ? "#006b5f" : "#002045" }}>
                  {isSynced ? "GitHub Synced ✓" : "Sync GitHub"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Feature card */}
              <div className="md:col-span-8 card relative overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#002045]/3 to-[#006b5f]/5" />
                <div className="relative p-6 flex flex-col min-h-[260px] justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#006b5f] mb-3">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings:"'FILL' 1" }}>psychology</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest">Top Recommendation</span>
                    </div>
                    <h3 className="font-['Sora'] text-[20px] font-bold text-[#002045] mb-2">LLM-Based Research Summarizer</h3>
                    <p className="text-[13px] text-[#74777f] leading-relaxed max-w-lg">Build a tool that utilizes OpenAI's API to distill long-form academic journals into structured study guides. Ideal for demonstrating AI integration skills.</p>
                  </div>
                  <div className="flex items-center gap-4 mt-5">
                    <div className="flex -space-x-2">
                      <span className="w-8 h-8 rounded-full bg-[#62fae3] text-[#002045] flex items-center justify-center text-[10px] font-bold border-2 border-white">Py</span>
                      <span className="w-8 h-8 rounded-full bg-[#e8eaf6] text-[#3949ab] flex items-center justify-center text-[10px] font-bold border-2 border-white">API</span>
                    </div>
                    <button className="ml-auto flex items-center gap-2 text-[12px] font-bold text-[#006b5f] hover:gap-3 transition-all">
                      Start Project <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Aux cards */}
              {[
                { icon: "code",        title: "Algorithm Visualizer",    tag: "Web Dev",  body: "React-based dashboard animating sorting and graph algorithms.", pct: 32 },
                { icon: "query_stats", title: "Campus Transit Optimizer", tag: "Data Sci", body: "Analyze public datasets to optimize university shuttle routes.",   pct: null },
              ].map((p) => (
                <div key={p.title} className="md:col-span-4 card p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[#002045]">{p.icon}</span>
                    </div>
                    <h3 className="font-['Sora'] text-[15px] font-bold text-[#002045] mb-1">{p.title}</h3>
                    <p className="text-[12px] text-[#74777f] leading-relaxed">{p.body}</p>
                  </div>
                  <div className="mt-5">
                    <span className="px-3 py-1 bg-[#eceef0] text-[#74777f] rounded-full text-[11px] font-semibold mb-3 inline-block">{p.tag}</span>
                    {p.pct != null ? (
                      <>
                        <div className="h-1.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#006b5f] rounded-full skill-bar" style={{ width: visibleBars ? `${p.pct}%` : '0%' }} />
                        </div>
                        <p className="text-[10px] text-[#74777f] mt-1">{p.pct}% of peers building this.</p>
                      </>
                    ) : (
                      <button className="w-full py-2 border border-[#e0e3e5] text-[#002045] text-[12px] font-semibold rounded-xl hover:bg-[#f0f2f5] transition-colors">View Brief</button>
                    )}
                  </div>
                </div>
              ))}

              {/* AI Ethicist */}
              <div className="md:col-span-12 card p-5 flex flex-col sm:flex-row items-center gap-5" style={{ border: "1px solid #62fae3", background: "rgba(98,250,227,0.04)" }}>
                <div className="w-16 h-16 rounded-2xl bg-[#62fae3]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px] text-[#006b5f]">model_training</span>
                </div>
                <div>
                  <h3 className="font-['Sora'] text-[16px] font-bold text-[#002045] mb-1">AI Ethicist Assistant</h3>
                  <p className="text-[13px] text-[#74777f]">A niche project focusing on auditing bias in localized AI models. Highly trending in Tier-1 hiring circles right now.</p>
                </div>
                <div className="sm:ml-auto shrink-0 flex items-center gap-2 text-[#006b5f] font-bold text-[13px]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>trending_up</span>
                  <span>High Placement</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI CV Builder */}
          <section className="fade-up" style={{ animationDelay:".05s" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#002045] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">description</span>
              </div>
              <h2 className="font-['Sora'] text-[22px] font-bold text-[#002045]">AI CV Builder</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Editor */}
              <div className="w-full lg:w-1/2 space-y-5">
                {/* ATS Gauge */}
                <div className="card p-5 flex items-center justify-between" style={{ borderLeft:"4px solid #006b5f" }}>
                  <div>
                    <h3 className="font-['Sora'] text-[16px] font-bold text-[#002045]">ATS Optimization Score</h3>
                    <p className="text-[12px] text-[#74777f]">Your resume is ready for Big Tech applications.</p>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#eceef0" strokeWidth="8" />
                      <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#006b5f" strokeWidth="8"
                        strokeDasharray={circ} strokeDashoffset={dashOffset} style={{ transition:"stroke-dashoffset 1s ease" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-['Sora'] text-[16px] font-bold text-[#002045]">{atsScore}%</div>
                  </div>
                </div>

                {/* Summary Editor */}
                <div className="card p-5 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider block mb-2">Professional Summary (AI Assisted)</label>
                    <textarea className="w-full bg-[#f7f9fb] border-2 border-[#e0e3e5] rounded-xl px-4 py-3 text-[13px] text-[#191c1e] outline-none focus:border-[#006b5f] transition-colors resize-none leading-relaxed"
                      rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
                    <div className="flex justify-end mt-2">
                      <button onClick={handleAIImprovement} disabled={improving}
                        className="flex items-center gap-2 text-[#006b5f] text-[12px] font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
                        <span className="material-symbols-outlined text-[16px] animate-pulse">auto_fix_high</span> {improving ? "Optimizing..." : "Improve with AI"}
                      </button>
                    </div>
                  </div>
                  {skillsList.length > 0 && (
                    <div className="space-y-2 border-t border-[#e0e3e5] pt-4">
                      <label className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider block">Suggested Skills to Add</label>
                      <div className="flex flex-wrap gap-2">
                        {skillsList.map((s) => (
                          <button key={s} onClick={() => addSkill(s)}
                            className="px-3 py-1 bg-[#62fae3]/20 text-[#006b5f] rounded-full text-[11px] font-semibold flex items-center gap-1 hover:bg-[#62fae3]/40 transition-colors">
                            {s} <span className="material-symbols-outlined text-[12px]">add</span>
                          </button>
                        ))}
                        <span className="px-3 py-1 bg-[#eceef0] text-[#74777f] rounded-full text-[11px] italic">Trend: MLOps</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Live Resume Preview</span>
                    <div className="flex gap-2">
                      {["zoom_in","download"].map(ic => (
                        <button key={ic} className="p-2 bg-white rounded-lg border border-[#e0e3e5] hover:bg-[#f0f2f5] transition-colors">
                          <span className="material-symbols-outlined text-[16px] text-[#43474e]">{ic}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white shadow-xl rounded-xl border border-[#e0e3e5] aspect-[1/1.414] p-8 overflow-hidden text-[11px] text-[#43474e]">
                    <div className="space-y-4">
                      <div className="border-b-2 border-[#002045] pb-3">
                        <h4 className="text-[20px] font-bold text-[#002045]">Alex Sterling</h4>
                        <p className="text-[10px]">alex.sterling@university.edu | github.com/asterling</p>
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-[#002045] uppercase tracking-widest mb-1">Education</h5>
                        <div className="flex justify-between font-semibold text-[10px]">
                          <span>B.S. Computer Science</span><span className="italic">May 2025</span>
                        </div>
                        <p className="text-[10px]">Global University of Technology · GPA 3.9/4.0</p>
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-[#002045] uppercase tracking-widest mb-1">Summary</h5>
                        <p className="text-[10px] leading-relaxed">{summary}</p>
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-[#002045] uppercase tracking-widest mb-1">Skills</h5>
                        <p className="text-[10px] leading-normal">
                          <span className="font-semibold">Languages:</span> Python, TypeScript, SQL, Java<br/>
                          <span className="font-semibold">Frameworks:</span> React, Node.js, PyTorch, FastAPI<br/>
                          <span className="font-semibold">Tools:</span> Git, Kubernetes, AWS S3
                          {addedSkills.length > 0 && <><br/><span className="font-semibold text-[#006b5f]">AI Enhanced:</span> {addedSkills.join(", ")}</>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Career Insights */}
          <section className="fade-up" style={{ animationDelay:".1s" }}>
            <h2 className="font-['Sora'] text-[22px] font-bold text-[#002045] mb-5">Career Development Insights</h2>

            {/* Skill Gap */}
            <div className="card p-6 mb-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-['Sora'] text-[18px] font-bold text-[#002045] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">insights</span> Skill Gap Analysis
                </h3>
                <span className="bg-[#006b5f] text-white px-3 py-1 rounded-full text-[11px] font-bold">AI-Powered</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  {skillBars.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-semibold text-[#191c1e]">{s.label}</span>
                        <span className="text-[13px] font-bold text-[#006b5f]">{s.pct}%</span>
                      </div>
                      <div className="w-full bg-[#eceef0] rounded-full h-2.5 overflow-hidden">
                        <div className="skill-bar h-2.5 rounded-full" style={{ width: visibleBars ? `${s.pct}%` : '0%', background: "linear-gradient(90deg,#006b5f,#002045)" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center items-center text-center p-6 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                  <div className="text-[52px] font-['Sora'] font-bold text-[#002045] mb-1">12%</div>
                  <p className="text-[13px] text-[#74777f] mb-3">Gap to Senior Market Requirements</p>
                  <p className="text-[#006b5f] font-bold text-[13px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> Top 5% of your cohort
                  </p>
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {careerRecs.map((role) => (
                <div key={role.id} onClick={() => setSelectedRole(role.id)}
                  className={`card p-5 cursor-pointer hover:shadow-lg transition-all ${selectedRole === role.id ? 'border-[#006b5f] ring-2 ring-[#006b5f]/20' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#002045]">{role.icon}</span>
                    </div>
                    <div className="text-[#006b5f] font-['Sora'] font-bold text-[18px]">{role.match}%</div>
                  </div>
                  <h3 className="font-['Sora'] font-bold text-[#002045] mb-1">{role.title}</h3>
                  <p className="text-[13px] text-[#74777f] mb-3">{role.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-[#eceef0] text-[#43474e] rounded text-[11px] font-semibold">{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Internships */}
            <div>
              <h3 className="font-['Sora'] text-[18px] font-bold text-[#002045] mb-4">University Partner Opportunities</h3>
              <div className="space-y-3">
                {internships.map((job) => (
                  <div key={job.id} className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#eceef0] flex items-center justify-center text-[#002045]">
                        <span className="material-symbols-outlined">{job.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002045] text-[14px]">{job.title}</h4>
                        <div className="text-[12px] text-[#74777f] flex items-center gap-2 mt-0.5">
                          <span>{job.company}</span><span>·</span><span>{job.location}</span><span>·</span><span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: job.badgeBg, color: job.badgeText }}>{job.badge}</span>
                      <button className="px-5 py-2 bg-[#002045] text-white rounded-xl text-[12px] font-bold hover:bg-[#003366] transition-colors">Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
        style={{ background:"linear-gradient(135deg,#006b5f,#002045)" }}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
      </button>
    </div>
  );
}
