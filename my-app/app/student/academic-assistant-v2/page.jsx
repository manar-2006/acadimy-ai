"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
          timestamp: new Date(data.timestamp || new Date())
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          text: 'Sorry, I am having trouble connecting right now. Please try again.',
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

  const navigationItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/dashboard' },
    { icon: 'auto_awesome', label: 'AI Assistant', active: true, path: '/academic-assistant' },
    { icon: 'school', label: 'Courses', active: false, path: '/courses' },
    { icon: 'work_history', label: 'Career Center', active: false, path: '/career-center' },
  ];

  const historyItems = [
    { icon: 'chat_bubble_outline', label: 'Physics Summary' },
    { icon: 'chat_bubble_outline', label: 'Python Practice...' },
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 lg:hidden z-10" onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col
            py-6 space-y-4 z-20 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen
          ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-white text-xl">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">EduSphere AI</h1>
              <p className="text-xs text-slate-500 font-medium">Academic Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-teal-400'
              : 'text-slate-600 hover:bg-slate-100'}`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* History Section */}
        <div className="px-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">History</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {historyItems.map((item, idx) => (
              <a key={idx} href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 text-sm transition-colors">
                <span className="material-symbols-outlined text-base flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 space-y-2 border-t border-slate-200 pt-4">
          <a
            href="#"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm font-medium">Help Support</span>
          </a>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-2xl font-bold text-blue-900">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-300 bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden gap-6">
          {/* Chat Window */}
          <section className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 1 && messages[0].type === 'ai' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div
                    className="w-24 h-24 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Learn</h3>
                  <p className="text-slate-600 max-w-md">
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
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                      )}
                      <div className={`max-w-2xl ${msg.type === 'user'
                        ? 'bg-blue-600 text-white rounded-3xl rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-3xl rounded-tl-none shadow-md border border-slate-200'
                        } px-6 py-3`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 items-center">
                      <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex-shrink-0 flex items-center justify-center">
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
            <div className="p-6 border-t border-slate-200 bg-white/50">
              <div className="max-w-4xl mx-auto">
                <div
                  className="bg-white border border-slate-300 rounded-3xl shadow-lg flex items-end gap-3 p-3 hover:shadow-xl transition-shadow">
                  <button
                    className="p-2 text-slate-600 hover:text-blue-600 transition-colors flex-shrink-0">
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
                    className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 resize-none h-12 max-h-32 text-sm placeholder:text-slate-400 font-medium"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white p-3 rounded-full transition-all flex-shrink-0"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="text-center text-xs text-slate-500 mt-3 font-medium">
                  EduSphere AI can make mistakes. Check important academic info.
                </p>
              </div>
            </div>
          </section>

          {/* Context Panel (Right Sidebar) */}
          <aside className="w-80 hidden xl:flex flex-col border-l border-slate-200 bg-white/50 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-blue-900 mb-4 text-lg">Context Actions</h3>
              <div className="space-y-3">
                {contextActions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-300 hover:border-teal-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-teal-600">{action.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Section */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="font-bold text-blue-900 mb-4 text-lg">Current Progress</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-600">Course Coverage</span>
                  <span className="text-sm font-bold text-teal-600">{courseProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 rounded-full"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200">
                <div className="flex items-start gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">lightbulb</span>
                  <p className="text-xs font-bold text-blue-700 uppercase">Pro Tip</p>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Try saying "Explain the Krebs cycle using a bakery analogy" for complex biology concepts!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}