"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function StudyPlanner() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Review Ethics Case Study 4", priority: "HIGH", meta: "Due 2:00 PM", checked: false },
    { id: 2, text: "Neural Networks: Backprop", priority: "MEDIUM", meta: "Due 5:00 PM", checked: false },
    { id: 3, text: "Prepare Lab Notes", priority: "LOW", meta: "Completed", checked: true },
  ]);

  const schedule = [
    { day: "MON", num: "21", active: false, sessions: [{ title: "Intro ML", color: "#002045" }] },
    { day: "TUE", num: "22", active: false, sessions: [{ title: "Lab Session", color: "#09007b" }] },
    { day: "WED", num: "23", active: true,  sessions: [{ title: "Ethics Seminar", color: "#006b5f" }, { title: "Study Group", color: "#002045" }] },
    { day: "THU", num: "24", active: false, sessions: [] },
    { day: "FRI", num: "25", active: false, sessions: [{ title: "Deadline", color: "#ba1a1a" }] },
    { day: "SAT", num: "26", active: false, dim: true, sessions: [] },
    { day: "SUN", num: "27", active: false, dim: true, sessions: [] },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        let loadedTasks = [];

        // 1. Fetch custom planner tasks
        const res = await fetch('http://localhost:5000/api/planner', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data?.length > 0) {
            loadedTasks = data.map(item => ({
              id: item.id,
              text: item.title,
              priority: item.type || 'MEDIUM',
              meta: `Added ${new Date(item.createdAt).toLocaleDateString()}`,
              checked: false
            }));
          }
        }

        // 2. Fetch pending assignments from courses
        const resAssignments = await fetch('http://localhost:5000/api/courses/student/assignments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resAssignments.ok) {
          const assignmentsData = await resAssignments.json();
          const pendingAssignments = assignmentsData.filter(a => !a.submitted);
          
          const assignmentTasks = pendingAssignments.map(a => {
            const isOverdue = new Date(a.dueDate) < new Date();
            return {
              id: `assign-${a.id}`,
              text: `[${a.courseCode}] ${a.title}`,
              priority: isOverdue ? 'HIGH' : 'MEDIUM',
              meta: `Due: ${new Date(a.dueDate).toLocaleDateString()}`,
              checked: false,
              isAssignment: true
            };
          });

          loadedTasks = [...loadedTasks, ...assignmentTasks];
        }

        setTasks(loadedTasks);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setTimeout(() => setIsRunning(false), 0);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleToggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && String(task.id).startsWith("assign-")) {
      alert(`This task: "${task.text}" is a course assignment. To submit your work, please go to the My Courses portal!`);
      return;
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };


  const [addingTask, setAddingTask] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  const priorityConfig = {
    HIGH:   { bg: "rgba(186,26,26,0.10)", color: "#ba1a1a", label: "HIGH PRIORITY" },
    MEDIUM: { bg: "rgba(0,107,95,0.10)",  color: "#006b5f", label: "MEDIUM" },
    LOW:    { bg: "rgba(116,119,127,0.12)", color: "#74777f", label: "LOW" },
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const text = newTaskInput.trim();
    if (!text) return;
    setSavingTask(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: text, date: new Date().toISOString().split('T')[0], time: '12:00', type: 'MEDIUM' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTasks(prev => [...prev, { id: data.id, text: data.title, priority: data.type, meta: "Just added", checked: false }]);
    } catch (err) {
      setTasks(prev => [...prev, { id: Date.now(), text, priority: 'MEDIUM', meta: "Just added", checked: false }]);
    } finally {
      setNewTaskInput('');
      setAddingTask(false);
      setSavingTask(false);
    }
  };

  // Pomodoro ring
  const RADIUS = 58;
  const CIRC   = 2 * Math.PI * RADIUS;
  const progress = timeLeft / (25 * 60);
  const dashOffset = CIRC * (1 - progress);

  const completedCount = tasks.filter(t => t.checked).length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily:"'Inter',sans-serif" }}>
      <link href={FONTS} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html:`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeInUp .45s ease-out forwards; }
        .task-row:hover { background: #f7f9fb; }
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; vertical-align:middle; }
        .custom-scrollbar::-webkit-scrollbar { width:4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:#c4c6cf; border-radius:10px; }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Study Planner" />

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Productivity Hub</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Study Planner</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">AI-powered scheduling, Pomodoro focus timer, and smart task management — all in one place.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">{completedCount}/{tasks.length}</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Tasks Done</p>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">04d</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Until Exam</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left: Calendar + Recommendations ── */}
            <div className="lg:col-span-8 space-y-6 fade-up">

              {/* Weekly Calendar */}
              <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="font-['Sora'] text-[18px] font-bold text-[#002045]">Weekly Schedule</h2>
                    <span className="bg-[#eceef0] px-3 py-1 rounded-full text-[10px] font-bold text-[#74777f]">OCT 21–27</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-[#f0f2f5] flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px] text-[#43474e]">chevron_left</span></button>
                    <button className="w-8 h-8 rounded-lg hover:bg-[#f0f2f5] flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px] text-[#43474e]">chevron_right</span></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {schedule.map((item, i) => (
                    <div key={i} className={`text-center text-[11px] font-bold pb-2 border-b-2 ${item.active ? 'border-[#006b5f] text-[#006b5f]' : 'border-transparent text-[#74777f]'}`}>{item.day}</div>
                  ))}
                  {schedule.map((d, i) => (
                    <div key={i} className={`min-h-[100px] rounded-xl p-2 transition-all ${d.active ? 'bg-[#006b5f]/5 border border-[#006b5f]/30' : 'bg-[#f7f9fb] hover:bg-[#eceef0]'} ${d.dim ? 'opacity-40' : ''}`}>
                      <span className={`text-[11px] font-bold ${d.active ? 'text-[#006b5f]' : 'text-[#74777f]'}`}>{d.num}</span>
                      <div className="mt-1 space-y-1">
                        {d.sessions.map((s, si) => (
                          <div key={si} className="px-1 py-0.5 rounded text-[8px] font-bold truncate text-white" style={{ backgroundColor: s.color }}>{s.title}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-6" style={{ borderLeft:"4px solid #006b5f" }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#006b5f]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#006b5f] text-[18px]" style={{ fontVariationSettings:"'FILL' 1" }}>tips_and_updates</span>
                  </div>
                  <h2 className="font-['Sora'] text-[18px] font-bold text-[#002045]">Smart Recommendations</h2>
                  <span className="ml-auto text-[10px] font-bold bg-[#006b5f] text-white px-3 py-1 rounded-full">AI-Powered</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { tag:"Peak Concentration", body:"Based on your habits, 10:00 AM–12:00 PM is best for Neural Networks study." },
                    { tag:"Course Difficulty Adjustment", body:"We've added 30 mins to Math Foundations to cover complex modules this week." },
                  ].map((rec, i) => (
                    <div key={i} className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5]">
                      <p className="text-[10px] text-[#006b5f] font-bold uppercase mb-1">{rec.tag}</p>
                      <p className="text-[13px] text-[#43474e] leading-relaxed">{rec.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Pomodoro + Tasks ── */}
            <div className="lg:col-span-4 space-y-6 fade-up" style={{ animationDelay:".1s" }}>

              {/* Pomodoro Timer */}
              <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-6 text-center">
                <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-widest mb-5">Focus Timer</p>
                <div className="relative inline-flex items-center justify-center mb-5">
                  <svg width="144" height="144" className="-rotate-90">
                    <circle cx="72" cy="72" r={RADIUS} fill="transparent" stroke="#eceef0" strokeWidth="10" />
                    <circle cx="72" cy="72" r={RADIUS} fill="transparent" stroke="#006b5f" strokeWidth="10"
                      strokeDasharray={CIRC} strokeDashoffset={dashOffset}
                      strokeLinecap="round" style={{ transition:"stroke-dashoffset .5s linear" }} />
                  </svg>
                  <div className="absolute text-center">
                    <p className="font-['Sora'] text-[28px] font-bold text-[#002045]">{formatTime(timeLeft)}</p>
                    <p className="text-[10px] text-[#74777f] font-semibold">{isRunning ? "FOCUSING" : "PAUSED"}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{ background:"linear-gradient(135deg,#006b5f,#002045)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>{isRunning ? "pause" : "play_arrow"}</span>
                  </button>
                  <button onClick={() => { setIsRunning(false); setTimeLeft(25*60); }}
                    className="w-12 h-12 rounded-full bg-[#eceef0] text-[#43474e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors">
                    <span className="material-symbols-outlined">refresh</span>
                  </button>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#006b5f]/10 text-[#006b5f] text-[10px] font-bold">Work · 25m</span>
                  <span className="px-3 py-1 rounded-full bg-[#eceef0] text-[#74777f] text-[10px] font-bold">Break · 5m</span>
                </div>
              </div>

              {/* Daily Tasks */}
              <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-6 flex flex-col" style={{ minHeight:"360px" }}>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-['Sora'] text-[18px] font-bold text-[#002045]">Daily Tasks</h2>
                  <button onClick={() => setAddingTask(true)}
                    className="w-8 h-8 rounded-lg bg-[#002045] text-white flex items-center justify-center hover:bg-[#003366] transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                {addingTask && (
                  <form onSubmit={handleAddTask} className="mb-3">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={newTaskInput}
                        onChange={e => setNewTaskInput(e.target.value)}
                        placeholder="New task name..."
                        className="flex-1 border border-[#c4c6cf] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#006b5f]"
                      />
                      <button type="submit" disabled={savingTask || !newTaskInput.trim()} className="px-3 py-2 bg-[#006b5f] text-white rounded-lg text-[13px] font-semibold hover:bg-[#005047] transition-colors disabled:opacity-50">{savingTask ? '...' : 'Add'}</button>
                      <button type="button" onClick={() => { setAddingTask(false); setNewTaskInput(''); }} className="px-3 py-2 text-[#74777f] rounded-lg text-[13px] hover:bg-[#f0f2f4] transition-colors">✕</button>
                    </div>
                  </form>
                )}
                <div className="space-y-2 custom-scrollbar overflow-y-auto flex-1 pr-1">
                  {tasks.map(task => {
                    const cfg = priorityConfig[task.priority] || priorityConfig.MEDIUM;
                    return (
                      <div key={task.id} onClick={() => handleToggleTask(task.id)}
                        className="task-row flex items-start gap-3 p-3 rounded-xl border border-[#e0e3e5] cursor-pointer transition-all">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${task.checked ? 'bg-[#006b5f] border-[#006b5f]' : 'border-[#c4c6cf]'}`}>
                          {task.checked && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold text-[#191c1e] ${task.checked ? 'line-through text-[#74777f]' : ''}`}>{task.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                            <span className="text-[10px] text-[#74777f]">{task.checked ? "Completed" : task.meta}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setAddingTask(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
        style={{ background:"linear-gradient(135deg,#006b5f,#002045)" }}>
        <span className="material-symbols-outlined">edit</span>
      </button>
    </div>
  );
}