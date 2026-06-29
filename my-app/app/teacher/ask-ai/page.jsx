"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

const SUGGESTED_PROMPTS = [
  { icon: "quiz", label: "Generate a quiz for CS-402 on thread scheduling", color: "#002045" },
  { icon: "summarize", label: "Summarize student performance gaps in CS-520 ML", color: "#006b5f" },
  { icon: "grading", label: "Write feedback for a student who scored 60% on the midterm", color: "#09007b" },
  { icon: "edit_note", label: "Draft a course announcement for upcoming project deadline", color: "#ba1a1a" },
  { icon: "analytics", label: "Explain why engagement dropped 15% this week", color: "#006b5f" },
  { icon: "lightbulb", label: "Suggest active learning activities for large lectures", color: "#002045" },
];

const QUICK_ACTIONS = [
  { icon: "quiz", label: "Generate Quiz", color: "#002045", prompt: "Generate a 10-question multiple choice quiz for my current course topic." },
  { icon: "grading", label: "Draft Feedback", color: "#006b5f", prompt: "Draft constructive feedback for a student who is struggling with assignments." },
  { icon: "campaign", label: "Course Announcement", color: "#09007b", prompt: "Write a professional course announcement for my students." },
  { icon: "bar_chart", label: "Analyse Results", color: "#ba1a1a", prompt: "Analyse my class quiz results and identify areas where students are struggling." },
];

const HISTORY = [
  { id: "h1", label: "Quiz: Thread Scheduling", time: "Today" },
  { id: "h2", label: "ML engagement report", time: "Yesterday" },
  { id: "h3", label: "Feedback for Jordan S.", time: "2 days ago" },
  { id: "h4", label: "CS-301 announcement draft", time: "Last week" },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: "ai",
    text: "Hello, Instructor! 👋 I'm your **EduSphere AI Teaching Assistant**.\n\nI can help you:\n• **Generate quizzes** and assessments for any topic\n• **Draft feedback** and course announcements\n• **Analyse student performance** and engagement patterns\n• **Design lesson plans** and active learning activities\n• **Answer questions** about pedagogy and research\n\nWhat would you like to work on today?",
  },
];

function formatText(text) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MessageBubble({ msg }) {
  const isAI = msg.type === "ai";
  return (
    <div className={`flex gap-3 ${isAI ? "" : "justify-end"}`}>
      {isAI && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shrink-0 shadow-md mt-1">
          <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
      )}
      <div
        className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-line ${
          isAI
            ? "bg-white border border-[#c4c6cf] text-[#191c1e] rounded-tl-none shadow-sm"
            : "bg-[#002045] text-white rounded-tr-none"
        }`}
      >
        {isAI ? <span>{formatText(msg.text)}</span> : msg.text}
        {msg.timestamp && (
          <div className={`text-[10px] mt-2 ${isAI ? "text-[#74777f]" : "text-white/50"}`}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
      {!isAI && (
        <div className="w-9 h-9 rounded-full bg-[#002045] flex items-center justify-center shrink-0 shadow-md mt-1 text-white text-[13px] font-bold">
          T
        </div>
      )}
    </div>
  );
}

let msgIdCounter = 100;

export default function TeacherAskAI() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeHistory, setActiveHistory] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg = {
      id: msgIdCounter++,
      type: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map(m => ({ type: m.type, text: m.text }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Chat query failed');

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: "ai",
        text: data.text,
        timestamp: new Date(data.timestamp || new Date()),
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: "ai",
        text: "I am having trouble connecting to my AI core right now. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setActiveHistory(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-sora { font-family: 'Sora', sans-serif; }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,107,95,0.12);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c4c6cf; border-radius: 10px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.3s ease-out forwards; }
        @keyframes pulse-dot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .dot { animation: pulse-dot 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .ai-glow {
          box-shadow: 0 0 0 1px rgba(0,107,95,0.15), 0 4px 24px rgba(0,107,95,0.1);
        }
      `}} />

      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col h-screen">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Ask AI" />

        {/* Layout: History sidebar + Chat + Context panel */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Chat History Sidebar ─── */}
          <aside className="hidden xl:flex w-60 shrink-0 flex-col border-r border-[#c4c6cf] bg-white/60 py-4 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-4">
              <button
                onClick={startNewChat}
                className="w-full flex items-center gap-2 px-4 py-3 bg-[#002045] text-white rounded-xl text-[13px] font-semibold hover:bg-[#1a365d] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Chat
              </button>
            </div>

            <div className="px-4 mb-2">
              <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Recent</p>
            </div>
            <div className="flex-1 px-2 space-y-0.5">
              {HISTORY.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveHistory(item.id)}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all group ${
                    activeHistory === item.id
                      ? "bg-[#002045]/8 text-[#002045]"
                      : "text-[#43474e] hover:bg-[#f2f4f6]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-[#74777f]">chat_bubble_outline</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate">{item.label}</p>
                    <p className="text-[11px] text-[#74777f]">{item.time}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="px-4 pt-4 border-t border-[#c4c6cf] space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#43474e] hover:bg-[#f2f4f6] transition-colors">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                AI Preferences
              </button>
            </div>
          </aside>

          {/* ── Main Chat Area ─── */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Chat Header Badge */}
            <div className="px-6 py-3 bg-white/50 border-b border-[#c4c6cf] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#002045]">EduSphere Teaching AI</p>
                  <p className="text-[11px] text-[#006b5f] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f] inline-block"></span>
                    Online — Instructor Mode
                  </p>
                </div>
              </div>
              <button
                onClick={startNewChat}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#c4c6cf] text-[#43474e] text-[12px] font-semibold rounded-lg hover:bg-[#f2f4f6] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">

              {/* Suggested prompts — show only on fresh chat */}
              {messages.length === 1 && (
                <div className="fade-up">
                  <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-3 text-center">Suggested for you</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {SUGGESTED_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(p.label)}
                        className="flex items-start gap-3 p-4 bg-white border border-[#c4c6cf] rounded-xl hover:border-[#006b5f] hover:shadow-md transition-all text-left group"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: p.color + "15" }}
                        >
                          <span className="material-symbols-outlined text-[16px]" style={{ color: p.color }}>{p.icon}</span>
                        </div>
                        <p className="text-[13px] text-[#43474e] group-hover:text-[#002045] transition-colors leading-snug">{p.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="fade-up">
                  <MessageBubble msg={msg} />
                </div>
              ))}

              {/* Loading dots */}
              {isLoading && (
                <div className="flex gap-3 fade-up">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shrink-0 shadow-md mt-1">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div className="bg-white border border-[#c4c6cf] rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#006b5f] rounded-full dot"></div>
                    <div className="w-2 h-2 bg-[#006b5f] rounded-full dot"></div>
                    <div className="w-2 h-2 bg-[#006b5f] rounded-full dot"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-[#c4c6cf] bg-white/70 backdrop-blur-sm">
              {/* Quick Action Chips */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => sendMessage(qa.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c4c6cf] bg-white hover:border-[#006b5f] hover:bg-[#f7fffe] text-[12px] font-semibold text-[#43474e] hover:text-[#006b5f] transition-all whitespace-nowrap shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ color: qa.color }}>{qa.icon}</span>
                    {qa.label}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div className="ai-glow bg-white border border-[#c4c6cf] rounded-2xl flex items-end gap-3 p-3 focus-within:border-[#006b5f] transition-colors">
                <button className="p-2 text-[#74777f] hover:text-[#002045] transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your courses, students, or teaching…"
                  className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] py-2 placeholder:text-[#74777f] leading-relaxed max-h-40 min-h-[44px]"
                  rows={1}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#002045] text-white rounded-xl hover:bg-[#1a365d] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
              <p className="text-center text-[11px] text-[#74777f] mt-2">
                EduSphere AI is designed for educational purposes. Always verify AI-generated content before sharing with students.
              </p>
            </div>
          </main>

          {/* ── Right Context Panel ─── */}
          <aside className="hidden 2xl:flex w-72 shrink-0 flex-col border-l border-[#c4c6cf] bg-white/60 p-5 overflow-y-auto custom-scrollbar space-y-5">

            {/* AI Capabilities */}
            <div>
              <h3 className="font-sora text-[15px] font-semibold text-[#002045] mb-3">Teaching Tools</h3>
              <div className="space-y-2">
                {[
                  { icon: "quiz", label: "Quiz Generator", desc: "Multiple choice, short answer, essay" },
                  { icon: "grading", label: "Feedback Drafter", desc: "Personalised student feedback" },
                  { icon: "analytics", label: "Performance Analyst", desc: "Insights from grade patterns" },
                  { icon: "menu_book", label: "Lesson Planner", desc: "Structured learning objectives" },
                  { icon: "campaign", label: "Announcements", desc: "Professional course messages" },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => sendMessage(`Help me with: ${tool.label}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#c4c6cf] hover:border-[#006b5f] hover:shadow-sm transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#006b5f]/10 flex items-center justify-center shrink-0 group-hover:bg-[#006b5f]/20 transition-colors">
                      <span className="material-symbols-outlined text-[#006b5f] text-[18px]">{tool.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#002045] truncate">{tool.label}</p>
                      <p className="text-[11px] text-[#43474e] truncate">{tool.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Course Context */}
            <div className="border-t border-[#c4c6cf] pt-5">
              <h3 className="font-sora text-[15px] font-semibold text-[#002045] mb-3">Active Courses</h3>
              <div className="space-y-2">
                {[
                  { name: "CS-402: Operating Systems", students: 128, color: "#002045" },
                  { name: "CS-520: Machine Learning", students: 64, color: "#3cddc7" },
                  { name: "CS-301: Data Structures", students: 98, color: "#09007b" },
                ].map((course) => (
                  <button
                    key={course.name}
                    onClick={() => sendMessage(`Give me insights about ${course.name}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#f2f4f6] transition-colors text-left"
                  >
                    <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#002045] truncate">{course.name}</p>
                      <p className="text-[11px] text-[#74777f]">{course.students} students</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="border-t border-[#c4c6cf] pt-5 mt-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#d1fae5] to-[#f0fdf4] border border-[#006b5f]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#006b5f] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  <p className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">Pro Tip</p>
                </div>
                <p className="text-[12px] text-[#006b5f] leading-relaxed">
                  Try: <em>"Generate 5 discussion questions for Week 9 on neural network architecture for my CS-520 students."</em>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
