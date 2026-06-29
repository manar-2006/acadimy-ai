'use client';

import { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const SOURCE_LANGS = ['English', 'French', 'German', 'Arabic', 'Spanish', 'Italian'];
const TARGET_LANGS = ['Spanish', 'French', 'German', 'Arabic', 'English', 'Mandarin Chinese', 'Portuguese'];

export default function AcademicTranslationCenter() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setTranslating(true);
    setError('');
    setTranslatedText('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: `Translate the following academic text from ${sourceLang} to ${targetLang}. Return only the translated text without any explanation, markdown formatting, or surrounding quotes:\n\n${inputText}`,
          history: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Translation failed');
      setTranslatedText(data.text || '');
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(TARGET_LANGS.includes(prevTarget) ? prevTarget : SOURCE_LANGS[0]);
    setTargetLang(SOURCE_LANGS.includes(prevSource) ? prevSource : TARGET_LANGS[0]);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Smart Translator" />

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">AI Language Lab</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Smart Translator</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Academic-grade translation with AI-powered terminology, citation accuracy, and multilingual glossary support.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleTranslate}
                disabled={translating || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#62fae3] text-[#007165] rounded-xl text-[13px] font-bold hover:bg-[#3cddc7] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {translating ? (
                  <><div className="w-4 h-4 border-2 border-[#007165] border-t-transparent rounded-full animate-spin" />Translating...</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">translate</span>Translate</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-xl text-[#ba1a1a] text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>{error}
          </div>
        )}

        {/* Translation Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-6 gap-6">
          {/* Left: Input */}
          <section className="flex-1 flex flex-col">
            <div className="px-4 py-3 bg-white border border-[#c4c6cf] border-b-0 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-[#74777f]">Source Language:</span>
                <div className="relative">
                  <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="appearance-none bg-[#f0f2f5] border border-[#c4c6cf] rounded-lg px-3 py-1.5 pr-8 text-[13px] font-semibold text-[#191c1e] focus:border-[#006b5f] outline-none">
                    {SOURCE_LANGS.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#74777f] text-[18px]">expand_more</span>
                </div>
              </div>
              <span className="text-[11px] text-[#74777f]">{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type or paste the text you want to translate here..."
              className="flex-1 w-full p-6 bg-white border border-[#c4c6cf] rounded-b-xl outline-none text-[14px] text-[#191c1e] leading-relaxed resize-none focus:border-[#006b5f] transition-colors"
              style={{ minHeight: '300px' }}
            />
          </section>

          {/* Center Swap */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <button onClick={handleSwapLanguages} className="w-10 h-10 rounded-full bg-white border border-[#c4c6cf] flex items-center justify-center hover:bg-[#006b5f] hover:text-white hover:border-[#006b5f] transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>

          {/* Right: Output */}
          <section className="flex-1 flex flex-col">
            <div className="px-4 py-3 bg-white border border-[#c4c6cf] border-b-0 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-[#74777f]">Target Language:</span>
                <div className="relative">
                  <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="appearance-none bg-[#f0f2f5] border border-[#c4c6cf] rounded-lg px-3 py-1.5 pr-8 text-[13px] font-semibold text-[#191c1e] focus:border-[#006b5f] outline-none">
                    {TARGET_LANGS.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#74777f] text-[18px]">expand_more</span>
                </div>
              </div>
              {translatedText && (
                <button onClick={() => navigator.clipboard.writeText(translatedText)} className="flex items-center gap-1 text-[12px] text-[#006b5f] font-semibold hover:underline">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>Copy
                </button>
              )}
            </div>
            <div className="flex-1 p-6 bg-[#f9fafb] border border-[#c4c6cf] rounded-b-xl overflow-y-auto" style={{ minHeight: '300px' }}>
              {translating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-10 h-10 border-4 border-[#006b5f] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#74777f] text-sm">AI is translating your text...</p>
                </div>
              ) : translatedText ? (
                <div>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-[#d1fae5]/50 border border-[#006b5f]/20 rounded-xl">
                    <span className="material-symbols-outlined text-[#006b5f] text-[18px]">check_circle</span>
                    <p className="text-[12px] font-bold text-[#006b5f]">Translation complete � powered by EduSphere AI</p>
                  </div>
                  <p className="text-[14px] text-[#191c1e] leading-relaxed whitespace-pre-wrap">{translatedText}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <span className="material-symbols-outlined text-[48px] text-[#c4c6cf]">translate</span>
                  <p className="text-[#74777f] text-sm">Enter text on the left and click <strong>Translate</strong> to get an AI translation.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
