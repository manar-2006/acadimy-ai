"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = window.localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          return parsed.fullName || '';
        } catch (e) {
          console.error("Error parsing user:", e);
        }
      }
    }
    return '';
  });

  const availableFields = [
    { id: "ai", label: "Artificial Intelligence", icon: "smart_toy" },
    { id: "ml", label: "Machine Learning", icon: "psychology" },
    { id: "ds", label: "Data Science", icon: "database" },
    { id: "swe", label: "Software Engineering", icon: "code" },
    { id: "cyber", label: "Cyber Security", icon: "shield" },
    { id: "cloud", label: "Cloud Computing", icon: "cloud" },
    { id: "hci", label: "Human-Computer Interaction", icon: "web" },
    { id: "robotics", label: "Robotics", icon: "precision_manufacturing" },
    { id: "ethics", label: "AI Ethics", icon: "gavel" }
  ];

  const [selectedFields, setSelectedFields] = useState([]);
  const [aiTone, setAiTone] = useState('academic');

  const toggleField = (fieldLabel) => {
    if (selectedFields.includes(fieldLabel)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldLabel));
    } else {
      setSelectedFields([...selectedFields, fieldLabel]);
    }
  };

  const handleFinish = async () => {
    setError('');
    setLoading(true);

    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      if (!token) {
        // Fallback to local routing if no token (offline / bypass)
        router.push('/student/dashboard');
        return;
      }

      // Update user specializations & bio / AI preference in backend
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specializations: selectedFields.length > 0 ? selectedFields : ["General CS"],
          bio: `Focused on ${selectedFields.slice(0, 3).join(', ') || 'Computer Science'}. AI Companion tone set to ${aiTone}.`
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (typeof window !== 'undefined') {
          // Keep role from local storage user if backend model does not carry it
          const localUser = JSON.parse(window.localStorage.getItem('user') || '{}');
          window.localStorage.setItem('user', JSON.stringify({
            ...localUser,
            ...updatedUser
          }));
        }
        router.push('/student/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Onboarding update failed');
      }
    } catch (err) {
      console.error('Onboarding save error:', err);
      // Graceful navigation fallback to keep UX intact
      router.push('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-['Inter'] antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c4c6cf]/30">
        <div className="flex justify-center items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto">
          <span onClick={() => router.push('/')} className="font-['Sora'] text-[24px] font-bold leading-[32px] text-[#002045] cursor-pointer">EduSphere AI</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 mt-16">
        <div className="w-full max-w-[640px] flex flex-col gap-6">

          {/* Stepper Timeline Indicator Component */}
          <div className="flex items-center justify-between px-4 mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#62fae3] text-[#007165] flex items-center justify-center font-bold border-2 border-[#006b5f]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Account</span>
            </div>
            <div className="flex-grow h-[2px] bg-[#62fae3] mx-4 mb-6"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#62fae3] text-[#007165] flex items-center justify-center font-bold border-2 border-[#006b5f]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Academic</span>
            </div>
            <div className="flex-grow h-[2px] bg-[#62fae3] mx-4 mb-6"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#002045] text-white flex items-center justify-center font-bold">3</div>
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#002045] font-bold">Personalize</span>
            </div>
          </div>

          {/* Core Panel Card */}
          <div className="bg-white border border-[#c4c6cf] rounded-2xl shadow-sm overflow-hidden p-8 md:p-12">
            
            <div className="mb-8">
              <h1 className="font-['Sora'] text-[32px] font-semibold leading-[40px] text-[#002045] mb-2">
                Welcome, {userName || 'Scholar'}!
              </h1>
              <p className="text-[#43474e] text-[15px] leading-[24px]">
                Let's customize your profile. Select your key specializations and set up your AI study companion preference.
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[14px]">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Specializations Tag Picker */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-3">
                  Areas of Academic Interest <span className="text-[#74777f] font-normal">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableFields.map((field) => {
                    const isSelected = selectedFields.includes(field.label);
                    return (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => toggleField(field.label)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#62fae3]/10 border-[#006b5f] text-[#006b5f] font-semibold shadow-sm'
                            : 'bg-[#f7f9fb] border-[#c4c6cf] text-[#43474e] hover:bg-[#eceef0]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{field.icon}</span>
                        <span className="text-[13px]">{field.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Companion Tone Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-3">
                  AI Assistant Personality Tone
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'academic', label: 'Academic & Rigorous', icon: 'history_edu', desc: 'Detailed, cited answers' },
                    { id: 'supportive', label: 'Encouraging & Warm', icon: 'sentiment_satisfied', desc: 'Positive study companion' },
                    { id: 'concise', label: 'Direct & Concise', icon: 'bolt', desc: 'Fast, straight-to-the-point' }
                  ].map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setAiTone(tone.id)}
                      className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all gap-1.5 ${
                        aiTone === tone.id
                          ? 'bg-[#002045]/5 border-[#002045] text-[#002045] font-semibold'
                          : 'bg-[#f7f9fb] border-[#c4c6cf] text-[#43474e] hover:bg-[#eceef0]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{tone.icon}</span>
                      <span className="text-[12px] font-bold">{tone.label}</span>
                      <span className="text-[10px] text-[#74777f] font-normal leading-tight hidden sm:block">{tone.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#e0e3e5]">
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full bg-[#006b5f] hover:bg-[#005047] text-white py-4 rounded-xl font-['Sora'] text-[18px] font-semibold leading-[26px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                >
                  {loading ? 'Finalizing Setup...' : 'Finish Setup & Go to Dashboard'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

            </div>

          </div>

          {/* Onboarding Assistant Hint Card */}
          <div className="bg-white/70 backdrop-blur-[12px] border border-[#001b3c]/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#62fae3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#007165]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.05em] text-[#002045]">EduSphere Setup</p>
              <p className="text-[13px] leading-[20px] text-[#43474e]">These choices help our AI models seed your initial study plan and flashcard decks.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f4f6] border-t border-[#c4c6cf]/50 w-full py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 space-y-4 md:space-y-0 max-w-[1280px] mx-auto">
          <span className="text-[13px] text-[#43474e] text-center md:text-left">
            © 2026 EduSphere AI. Academic Excellence through Intelligence.
          </span>
          <div className="flex gap-6">
            <a className="text-[13px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Privacy Policy</a>
            <a className="text-[13px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Terms of Service</a>
            <a className="text-[#43474e] hover:text-[#006b5f] transition-all text-[13px]" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
