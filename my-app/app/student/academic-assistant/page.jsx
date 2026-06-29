"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EduSphereAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: `Hello! Upload your lecture notes and I'll help you master the material.
I can summarize complex topics, create quizzes, or answer specific questions about your coursework.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [courseProgress] = useState(68);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map(m => ({ type: m.type, text: m.text }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Chat query failed');

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          text: data.text,
          timestamp: new Date(data.timestamp)
        }
      ]);
    } catch (err) {
      console.error('Chat connection error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          text: 'Sorry, I am having trouble connecting to my brain right now. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const contextActions = [
    { icon: 'quiz', label: 'Generate Quiz' },
    { icon: 'summarize', label: 'Summarize Selection' },
    { icon: 'flash_on', label: 'Create Flashcards' },
  ];

  const historyItems = [
    { icon: 'chat_bubble_outline', label: 'Physics Summary' },
    { icon: 'chat_bubble_outline', label: 'Python Practice...' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col overflow-hidden">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="AI Assistant" />

        <div className="flex-1 flex overflow-hidden gap-6">
          {/* Chat Window */}
          <section className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 1 && messages[0].type === 'ai' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div
                    className="w-24 h-24 bg-gradient-to-br from-[#d6e3ff]/50 to-[#d1fae5]/50 rounded-full flex items-center justify-center mb-6 border border-[#e0e3e5]">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#002045] font-['Sora'] mb-2">Ready to Learn</h3>
                  <p className="text-[#43474e] text-sm max-w-md">
                    Upload your lecture notes, textbooks, or study materials to get started. I'll help you
                    understand complex concepts and prepare for exams.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                      {msg.type === 'ai' && (
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006b5f] to-[#007165] flex-shrink-0 flex items-center justify-center text-white shadow-md">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                      )}
                      <div className={`max-w-2xl ${msg.type === 'user'
                        ? 'bg-[#002045] text-white rounded-2xl rounded-tr-none shadow-sm border border-[#002045]'
                        : 'bg-white text-[#191c1e] rounded-2xl rounded-tl-none shadow-sm border border-[#e0e3e5]'
                        } px-6 py-3`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 items-center">
                      <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006b5f] to-[#007165] flex-shrink-0 flex items-center justify-center">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{
                            animationDelay: '0ms'
                          }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{
                            animationDelay: '150ms'
                          }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{
                            animationDelay: '300ms'
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[#e0e3e5] bg-white/50">
              <div className="max-w-4xl mx-auto">
                <div
                  className="bg-white border border-[#e0e3e5] rounded-2xl shadow-md flex items-end gap-3 p-3 hover:shadow-lg transition-shadow">
                  <button
                    className="p-2 text-[#43474e] hover:text-[#006b5f] transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask your assistant anything..."
                    className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 resize-none h-12 max-h-32 text-sm placeholder:text-[#74777f] font-medium outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-[#006b5f] hover:bg-[#005047] disabled:opacity-50 text-white p-3 rounded-full transition-all flex-shrink-0"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="text-center text-xs text-[#74777f] mt-3 font-medium">
                  EduSphere AI can make mistakes. Check important academic info.
                </p>
              </div>
            </div>
          </section>

          {/* Context Panel (Right Sidebar) */}
          <aside className="w-80 hidden xl:flex flex-col border-l border-[#e0e3e5] bg-white/50 p-6 space-y-6">
            <div>
              <h3 className="font-['Sora'] font-bold text-[#002045] mb-4 text-[16px]">Context Actions</h3>
              <div className="space-y-3">
                {contextActions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-[#e0e3e5] hover:border-[#006b5f] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#006b5f]">{action.icon}</span>
                      <span className="text-sm font-semibold text-[#43474e]">{action.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#c4c6cf] group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Section */}
            <div className="pt-6 border-t border-[#e0e3e5]">
              <h3 className="font-['Sora'] font-bold text-[#002045] mb-4 text-[16px]">Current Progress</h3>
              <div className="bg-white p-4 rounded-xl border border-[#e0e3e5]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#74777f]">Course Coverage</span>
                  <span className="text-sm font-bold text-[#006b5f]">{courseProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#006b5f] to-[#62fae3] transition-all duration-300 rounded-full"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#d6e3ff]/30 to-[#d1fae5]/30 border border-[#006b5f]/15 relative overflow-hidden">
                <div className="flex items-start gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#006b5f] text-lg">lightbulb</span>
                  <p className="text-xs font-bold text-[#006b5f] uppercase tracking-wider">Pro Tip</p>
                </div>
                <p className="text-xs text-[#003d37] leading-relaxed">
                  Try saying "Explain the Krebs cycle using a bakery analogy" for complex biology concepts!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}