'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const initialClubs = [
  { icon: "group", name: "Neural Frontiers", memberCount: 120, description: "Researching neural architectures and deep learning applications." },
  { icon: "bolt", name: "Data Science Soc.", memberCount: 85, description: "Empowering students with data literacy and analytic tools." },
  { icon: "link", name: "Blockchain Lab", memberCount: 64, description: "Exploring decentralized systems, smart contracts, and Web3." }
];

const initialEvents = [
  { month: "Dec", day: "12", type: "Workshop", title: "Ethics in AI Systems", description: "Auditing bias in large language models.", location: "Building A, Hall 3", spots: 8, isHackathon: false },
  { month: "Dec", day: "15", type: "Hackathon", title: "EduSphere AI Hackathon", description: "Build assistants to optimize university workflows.", location: "Innovation Hub", spots: 24, isHackathon: true }
];

export default function ClubsEvents() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [clubs, setClubs] = useState(initialClubs);
  const [events, setEvents] = useState(initialEvents);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // AI Matchmaker state
  const [query, setQuery] = useState('');
  const [matchResult, setMatchResult] = useState('');
  const [loadingMatch, setLoadingMatch] = useState(false);

  const handleJoinClub = (name) => {
    if (joinedClubs.includes(name)) return;
    setJoinedClubs([...joinedClubs, name]);
    setClubs(clubs.map(c => c.name === name ? { ...c, memberCount: c.memberCount + 1 } : c));
  };

  const handleRegisterEvent = (title) => {
    if (registeredEvents.includes(title)) return;
    setRegisteredEvents([...registeredEvents, title]);
    setEvents(events.map(e => e.title === title ? { ...e, spots: e.spots - 1 } : e));
  };

  const handleFindMatches = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingMatch(true);
    setMatchResult('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: `Act as a university matchmaker. Based on this request: "${query}", suggest 2 hypothetical student partners (names, roles, match reason) who could form a hackathon team. Keep it short and academic.`,
          history: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Match failed');
      setMatchResult(data.text || '');
    } catch (err) {
      setMatchResult('Could not find matches at this time. Please try again.');
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Clubs & Events" />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto">
            <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Student Life</p>
            <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Clubs & Campus Events</h1>
            <p className="text-[#d6e3ff] text-[14px] max-w-lg">Discover campus communities, register for upcoming hackathons, and form teams with AI matching.</p>
          </div>
        </div>

        <main className="flex-grow px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main */}
            <div className="lg:col-span-8 space-y-8">
              {/* Clubs list */}
              <div>
                <h2 className="font-sora text-[22px] font-bold text-[#002045] mb-5">Student Organizations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clubs.map(c => {
                    const isJoined = joinedClubs.includes(c.name);
                    return (
                      <div key={c.name} className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-[#006b5f] text-2xl">{c.icon}</span>
                            <h3 className="font-sora font-bold text-[#002045] text-lg">{c.name}</h3>
                          </div>
                          <p className="text-[13px] text-[#74777f] leading-relaxed mb-4">{c.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[#f0f2f5] mt-auto">
                          <span className="text-xs text-[#74777f] font-semibold">{c.memberCount} members</span>
                          <button
                            onClick={() => handleJoinClub(c.name)}
                            disabled={isJoined}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isJoined ? 'bg-[#d1fae5] text-[#065f46] cursor-default' : 'bg-[#002045] text-white hover:bg-[#1a365d]'}`}
                          >
                            {isJoined ? 'Joined ?' : 'Join Club'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Events list */}
              <div>
                <h2 className="font-sora text-[22px] font-bold text-[#002045] mb-5">Campus Events & Hackathons</h2>
                <div className="space-y-4">
                  {events.map(ev => {
                    const isReg = registeredEvents.includes(ev.title);
                    return (
                      <div key={ev.title} className="bg-white rounded-2xl border border-[#e0e3e5] p-5 flex items-center gap-5 hover:shadow-md transition-all">
                        <div className="text-center min-w-[52px] shrink-0">
                          <p className="text-[10px] font-bold text-[#006b5f] uppercase">{ev.month}</p>
                          <p className="font-sora text-3xl font-extrabold text-[#002045] leading-none">{ev.day}</p>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#f0f2f5] text-[#002045] rounded-full">{ev.type}</span>
                            <span className="text-[12px] text-[#74777f]">{ev.location}</span>
                          </div>
                          <h4 className="font-sora text-base font-bold text-[#002045] mb-0.5">{ev.title}</h4>
                          <p className="text-xs text-[#74777f] leading-normal">{ev.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRegisterEvent(ev.title)}
                            disabled={isReg || ev.spots <= 0}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isReg ? 'bg-[#d1fae5] text-[#065f46] cursor-default' : 'bg-[#006b5f] text-white hover:bg-[#005047]'}`}
                          >
                            {isReg ? 'Registered' : ev.spots <= 0 ? 'Full' : 'Register'}
                          </button>
                          <span className="text-[10px] text-[#74777f]">{ev.spots} spots left</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-[#002045] to-[#003d7a] text-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#62fae3]">group_add</span>
                  <h4 className="font-sora font-bold text-white text-base">AI Team Matchmaker</h4>
                </div>
                <p className="text-xs text-[#d6e3ff] mb-4 leading-relaxed">Need teammate matches for the upcoming hackathon? Let AI scan user requirements.</p>

                <form onSubmit={handleFindMatches} className="space-y-3">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g., I need a Next.js frontend dev..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#62fae3] placeholder-white/40 text-white"
                  />
                  <button
                    type="submit"
                    disabled={loadingMatch || !query.trim()}
                    className="w-full py-2 bg-[#62fae3] text-[#007165] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 disabled:opacity-60"
                  >
                    {loadingMatch ? (
                      <><div className="w-3.5 h-3.5 border-2 border-[#007165] border-t-transparent rounded-full animate-spin" />Searching...</>
                    ) : (
                      'Find Partner Matches'
                    )}
                  </button>
                </form>

                {matchResult && (
                  <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs leading-relaxed whitespace-pre-wrap text-[#d6e3ff]">
                    {matchResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

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
