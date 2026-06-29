"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EduSphereDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [postingNew, setPostingNew] = useState(false);
  const [replyBoxId, setReplyBoxId] = useState(null); // postId with open reply box
  const [replyTexts, setReplyTexts] = useState({}); // { [postId]: text }
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/community', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching community posts:', err);
      }
    };

    fetchPosts();
  }, []);

  // Micro-interaction: Handles the notification badge pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setPostingNew(true);
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPostText.trim() })
      });

      if (!response.ok) throw new Error('Failed to create post');
      const data = await response.json();
      setPosts(prev => [data, ...prev]);
      setNewPostText('');
      setShowNewPostModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setPostingNew(false);
    }
  };

  const handleReply = async (postId) => {
    const replyText = replyTexts[postId] || '';
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const response = await fetch(`http://localhost:5000/api/community/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyText.trim() })
      });

      if (!response.ok) throw new Error('Failed to reply');
      const updatedPost = await response.json();
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      setReplyTexts(prev => ({ ...prev, [postId]: '' }));
      setReplyBoxId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Injecting custom scrollbar styles locally so it remains a single-file solution */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e3e5; border-radius: 10px; }
      `}</style>

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Community" />

        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Social Hub</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Community Forum</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Connect, discuss, and learn with 2.4k active students and teachers in real-time.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">14</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Active Groups</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Community Feed */}
          <div className="xl:col-span-8 space-y-4">
            {/* Header Stats & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e0e3e5] shadow-sm">
              <div>
                <h2 className="font-['Sora'] text-xl font-bold text-[#002045]">Discussions</h2>
                <p className="text-sm text-[#74777f]">Share your academic thoughts or ask questions to peer mentors.</p>
              </div>
              <div class="flex gap-2">
                <button onClick={() => setShowNewPostModal(true)} className="bg-[#006b5f] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#005047] transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">edit</span>New Post
                </button>
              </div>
            </div>

            {/* New Post Inline Form */}
            {showNewPostModal && (
              <form onSubmit={handleCreatePost} className="bg-white border border-[#006b5f]/30 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-bold text-[#002045] mb-3">Share with the Community</p>
                <textarea
                  autoFocus
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  placeholder="Write your academic thought, question or insight..."
                  rows={3}
                  className="w-full border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006b5f] resize-none"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => { setShowNewPostModal(false); setNewPostText(''); }} className="px-4 py-2 text-[#74777f] rounded-lg text-sm hover:bg-[#f0f2f4] transition-colors">Cancel</button>
                  <button type="submit" disabled={postingNew || !newPostText.trim()} className="px-5 py-2 bg-[#006b5f] text-white rounded-lg text-sm font-semibold hover:bg-[#005047] transition-colors disabled:opacity-50">{postingNew ? 'Posting...' : 'Post'}</button>
                </div>
              </form>
            )}

            {/* Bento Grid of Trending Study Groups */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-container text-on-primary-container p-6 rounded-xl flex flex-col justify-between h-48 border border-primary/20 relative overflow-hidden group">
                <div className="z-10">
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Trending</span>
                  <h3 className="font-headline-sm text-headline-sm">Advanced Quantum Mechanics</h3>
                  <p className="font-body-sm opacity-80">14 members active now</p>
                </div>
                <div className="flex -space-x-2 z-10">
                  <img alt="Avatar" className="h-8 w-8 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxIZlLWX56snUSnb2I5qBjGAARakrrtigq3C9Z9b8-D-M0fCHPC7Xr1qfthv82gvEy-8AH-z3oqD1S8XHhDDOZ5A5_cAARGArZoH7C50_QCVRilc9iKVP6iThEdUHxz11GcjsN6I7c1IdNlSxnoWbdOS0o0z2_IAHxlfaJkSyjuIXXfD8Wa9jrMIKXfY8gd_g5Xqc1qP_TkHGOAsdr7WnXs9_iLQBP4ljgR8cygU-TLKok0wvaUyfX1lhbXG2u7jlw1MQ6XI9XCqQ" />
                  <img alt="Avatar" className="h-8 w-8 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRNb_1YXrVXSD3-UIXt4N4xvXl21mAEmpDT6fb2MhOwpnEZYcX9a7apk9uUp-wHbDJocLCn7-IT6FPvXj3na_lEJ4JQzM3ig8ugDCO2aCAtuR2gmG3a8sfy5Z6g41aL0jJojNr6XeJDA9AWY6tIcm4vQyPttZxCqBGalypYKiiaJxj6YOHbibk5ExfWwhsT9vYEU4PYVnvVT2pnE2NG6f5w6vwO7OlGtwowAmmOb-pWRjVPmC4B8wWUHoNJ5uzeVwlyRZIVdeUnFA" />
                  <div className="h-8 w-8 rounded-full border-2 border-primary-container bg-secondary-fixed-dim text-on-secondary-fixed flex items-center justify-center text-[10px] font-bold">+12</div>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 group-hover:scale-110 transition-transform">functions</span>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex flex-col justify-between h-48">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">Philosophy & Ethics</h3>
                  <p className="font-body-sm text-on-surface-variant">Next meeting: Today, 4:00 PM</p>
                </div>
                <button className="text-secondary font-bold text-label-md flex items-center gap-1 group w-fit">
                  Enter Study Room <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </section>

            {/* Discussion Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:border-secondary/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/10 border border-outline-variant flex items-center justify-center font-bold text-primary text-headline-sm">
                      {post.authorAvatar || post.authorName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-[10px] font-bold">DISCUSSION</span>
                        <span className="text-on-surface-variant text-body-sm">
                          {post.authorName} • {new Date(post.timestamp).toLocaleDateString()} {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-body-md mb-4">{post.content}</p>

                      {post.replies && post.replies.map((reply) => (
                        <div key={reply.id} className="mt-3 p-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-sm">
                          <p className="font-semibold text-primary mb-1">{reply.authorName}</p>
                          <p className="text-on-surface-variant">{reply.content}</p>
                        </div>
                      ))}

                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setReplyBoxId(replyBoxId === post.id ? null : post.id)}
                            className="flex items-center gap-1 text-on-surface-variant text-label-md hover:text-primary transition-colors border-none bg-transparent cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">chat_bubble</span> Reply ({post.replies?.length || 0})
                          </button>
                          <button className="flex items-center gap-1 text-on-surface-variant text-label-md hover:text-primary transition-colors border-none bg-transparent">
                            <span className="material-symbols-outlined text-lg">favorite</span> {post.likes || 0} Likes
                          </button>
                        </div>
                        {replyBoxId === post.id && (
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={replyTexts[post.id] || ''}
                              onChange={e => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') handleReply(post.id); }}
                              placeholder={`Reply to ${post.authorName}...`}
                              className="flex-1 border border-[#c4c6cf] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#006b5f]"
                            />
                            <button
                              onClick={() => handleReply(post.id)}
                              disabled={sendingReply || !replyTexts[post.id]?.trim()}
                              className="px-3 py-1.5 bg-[#006b5f] text-white rounded-lg text-sm font-semibold hover:bg-[#005047] transition-colors disabled:opacity-50"
                            >
                              {sendingReply ? '...' : 'Send'}
                            </button>
                            <button onClick={() => setReplyBoxId(null)} className="px-3 py-1.5 text-[#74777f] rounded-lg text-sm hover:bg-[#f0f2f4] transition-colors">✕</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar (Messaging & Notifications) */}
          <div className="xl:col-span-4 space-y-stack-md">
            {/* Notifications Center */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-sm text-headline-sm text-primary">Academic Alerts</h3>
                <span className={`bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold transition-transform duration-200 ${pulse ? 'scale-105' : 'scale-100'}`}>3 NEW</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-3 rounded-lg bg-error/5 border-l-4 border-error">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <div>
                    <p className="font-label-md text-primary leading-tight">Deadline: Research Proposal</p>
                    <p className="text-[10px] text-on-surface-variant">Due in 4 hours • Biology 102</p>
                  </div>
                </div>
                <div className="flex gap-4 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-secondary">event_available</span>
                  <div>
                    <p className="font-label-md text-primary leading-tight">Workshop Tomorrow</p>
                    <p className="text-[10px] text-on-surface-variant">AI Ethics in Modern Tech • 10:00 AM</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 text-label-md text-on-surface-variant hover:text-primary transition-colors">View All Notifications</button>
            </div>

            {/* Messages Center */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col h-[600px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Direct Messages</h3>
                <div className="relative mt-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                  <input className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search contacts..." type="text" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {/* Pure Tailwind layout interactions handle the subtle card shifting on hover */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-high cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
                      <img alt="Prof" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdB-4ipan-xffuWgasM0xDC_1JGf2EEiV6MEBTzo_nq0rcmXN4GgtFKCXu_JkMLmICiF5Xp1yOnqtKMbn7ETZQDDQNY-Js8FXYbx8hJnNvj1w8J7hC44v692J-x62DZbKUHUQOLhut5SUU7rCi4kg23l9nyLV87ANknFeBDp6jgobtR6q3wp6pUa_kr5V4lJVTTr4CArrxKz78xk1F0Qkv1vWn8wX8Fdgkej2Dz2PK09H6Hg29xenjh8v91zR5nf045RxyYr2ErmY" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container-lowest"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-label-md text-primary truncate">Prof. James Miller</p>
                      <span className="text-[10px] text-on-surface-variant">12:45 PM</span>
                    </div>
                    <p className="text-body-sm text-on-surface truncate font-semibold">The data set looks correct now...</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface-container cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant grayscale">
                    <img alt="Peer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYZDgYIt67GsbvccDIsEHU1EcniHZI1eu2t12sO_RMZCr7flFYYQItTfe5F4NIBrtm1sG0KiNthucZ-bVyqjpXKqdmfl4ld4d0hEue2VoQD5c9oCV3h3BKKc73FyLqEhEvfUcbn9Qnpg4QiPan5SYT1YpjF6fKctjITwa5kNYUrUiMmemMMANYArQJ_hDNORdSTf2XprL-QoNUzxHeCv3fbf3LMFF16TpErx8qvM68ecnCVe14fOzt-vhH_-2uOtlhr3UlVTZ4HXg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-label-md text-primary truncate">Elena Rodriguez</p>
                      <span className="text-[10px] text-on-surface-variant">Yesterday</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate">Did you finish the lab report?</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface-container cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
                    <img alt="Peer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM7jjK6wyf5ZIgnMFtb9F6ACFZcI60GOgrqvK22WodAEIJOen8WAkSKxDQLiH12hUCIvM0h8lLqOiWMNfQ-XwNT52oSP899AyLnRZBV2R8fa_JMD-FnuINHc2KbOAcoXGd1EIdX5NMrz8yZDlvcVQ7wBWDHSUelh85cuqUFaPwYCxNziGVHHAAHrfuTtV4nGfz8pfLtBygSv8P_0SQiwNxELeoOh9orSjjPG52MkLmuO0I6yfT5sTWkSB0jEA_q9u42paU4B255G4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-label-md text-primary truncate">Marcus Thorne</p>
                      <span className="text-[10px] text-on-surface-variant">Mon</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate">Group study meeting moved to 6pm</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
                <button className="w-full py-2 border border-outline-variant rounded-lg text-label-md text-primary hover:bg-surface-container transition-all">Start New Conversation</button>
              </div>
            </div>
          </div>
        </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-high border-t border-outline-variant mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-container-max mx-auto w-full py-12 px-gutter">
          <div className="space-y-4">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">EduSphere AI</span>
            <p className="text-body-sm text-on-surface-variant">Empowering the next generation of academic excellence through intelligent collaboration.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">University Partnerships</a></li>
              <li><a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Accessibility</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider">Support</h4>
            <a className="inline-block bg-primary text-on-primary px-6 py-2 rounded-lg text-label-md hover:opacity-90 transition-all" href="#">Contact Support</a>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter py-6 border-t border-outline-variant/30 flex justify-between items-center">
          <p className="text-label-md text-on-surface-variant">© 2024 EduSphere AI Academic Technologies.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary">language</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary">shield</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
}