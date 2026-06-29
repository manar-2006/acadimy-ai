'use client';

import { useState, useRef } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function PdfAnalysisDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [aiInput, setAiInput] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [analysisData, setAnalysisData] = useState({
    filename: 'Notes: Quantum Mechanics Lecture 04',
    summary: 'This lecture covers the foundational aspects of wave mechanics, focusing on the time-dependent Schrödinger equation. It explains the dual nature of matter and how probability densities define particle positions in a quantum field.',
    concepts: [
      { term: 'Superposition', definition: 'The ability of a quantum system to be in multiple states at the same time until it is measured.' },
      { term: 'Wave Function', definition: 'A mathematical description of the quantum state of an isolated quantum system.' }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        question: 'What physical property does the squared magnitude of the wave function represent?',
        options: ['A) Particle Momentum', 'B) Probability Density', 'C) Kinetic Energy'],
        answer: 'B'
      }
    ],
    flashcards: [
      { front: 'Define: Heisenberg Uncertainty Principle', back: 'It is fundamentally impossible to simultaneously know both the precise position and momentum of a quantum particle.' }
    ]
  });

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'concepts', label: 'Key Concepts' },
    { id: 'questions', label: 'Generated Questions' },
    { id: 'flashcards', label: 'Flashcards' },
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Please log in to upload files');
      }

      const response = await fetch('http://localhost:5000/api/pdf/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setAnalysisData(data);
      setIsCardFlipped(false);
    } catch (err) {
      console.error('File upload/analyze failed:', err);
      setError(err.message || 'Server error during analysis');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-[#191c1e] antialiased overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 h-screen flex flex-col overflow-hidden">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="PDF Analyzer" />

        {/* Dynamic Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* PDF Viewer Pane */}
          <section className="flex-1 bg-surface-container-lowest overflow-y-auto p-gutter relative">
            <div className="max-w-4xl mx-auto space-y-gutter">
              {/* PDF Page 1 Placeholder */}
              <div className="bg-white shadow-sm border border-outline-variant rounded-lg p-12 min-h-[1000px] relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={handleUploadClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-on-secondary rounded-lg hover:opacity-90 transition-opacity font-semibold text-[13px] border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Upload PDF
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <div className="w-px h-6 bg-outline-variant mx-1"></div>
                  <button className="p-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface-variant">
                    <span className="material-symbols-outlined">zoom_in</span>
                  </button>
                  <button className="p-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface-variant">
                    <span className="material-symbols-outlined">zoom_out</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className="font-headline-md text-headline-md text-primary mb-8 border-b-2 border-secondary-container pb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">description</span>
                    {analysisData.filename}
                  </h3>
                  <p className="text-on-surface leading-relaxed text-body-lg">
                    The Schrödinger equation is a linear partial differential equation that governs the wave function of a quantum-mechanical system. Its discovery in 1925 and publication in 1926 by the Austrian physicist Erwin Schrödinger was a significant landmark in the development of quantum mechanics.
                  </p>

                  <div className="bg-surface-container-low p-6 rounded-lg my-8 border-l-4 border-primary">
                    <p className="italic text-on-surface-variant font-medium">
                      "The wave function is the most complete description that can be given to a physical system."
                    </p>
                  </div>

                  <img
                    alt="Quantum Physics Visualization"
                    className="w-full h-64 object-cover rounded-xl my-8"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBytLEcNFizJ8LxzShZXVlE87US55WhNYk6AwIlvF3Pnp29vH47ks4xQJ2waVLN7pkheQX-G0HVaNnkCdKlyqf9AuBLv2vQWjrkHWspNMSRk5AuSI183dbRGcKufvYBhRiG0q4O0cE25SQGj-E3JYGQDQNsLm9D6KudLB6Fo6uknP4ekDs3acPAtSlFyVRf91AnQpTcNsMAeJBKN_w35VzvoIsCuh7ica6vPMtaOabK1NaLKckxVMBzbphqTURo406j2J782PbwN84"
                  />

                  <p className="text-on-surface leading-relaxed text-body-lg">
                    For a non-relativistic particle of mass m, in the absence of external forces, the equation takes the following form...
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-12">
                    <div className="h-4 w-full bg-surface-container rounded"></div>
                    <div className="h-4 w-3/4 bg-surface-container rounded"></div>
                    <div className="h-4 w-full bg-surface-container rounded"></div>
                    <div className="h-4 w-1/2 bg-surface-container rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Insights Panel */}
          <section className="w-full max-w-md bg-surface-container-low border-l border-outline-variant flex flex-col z-20">
            {/* Tabs Header */}
            <div className="px-6 pt-4 border-b border-outline-variant bg-surface-container-low relative">
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <span className="font-label-md text-label-md text-secondary">AI INSIGHTS</span>
              </div>

              <div className="flex justify-between items-end relative overflow-x-auto no-scrollbar gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-2 font-label-md text-label-md whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                      ? 'text-on-surface border-secondary font-semibold'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
              {uploadLoading && (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">AI is analyzing your PDF...</p>
                  <p className="text-body-sm text-on-surface-variant mt-2">Extracting text and generating summary, key concepts, and study resources.</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-error-container/20 border border-error text-error rounded-lg text-[13px] mb-4">
                  {error}
                </div>
              )}

              {/* Summary Tab */}
              {activeTab === 'summary' && (
                <div className="space-y-6 animation-fade-in">
                  <div className="glass-panel p-6 rounded-xl border border-secondary-container/20">
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-3">Executive Summary</h4>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      {analysisData.summary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Key Takeaways</h5>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                        <p className="text-body-sm">Schrödinger's Equation is the cornerstone of non-relativistic quantum mechanics.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                        <p className="text-body-sm">The Wave Function (Ψ) provides a probabilistic map of system states.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                        <p className="text-body-sm">Normalization ensures that the total probability is always equal to 1.</p>
                      </li>
                    </ul>
                  </div>

                  {/* Reading Progress */}
                  <div className="bg-primary text-on-primary p-6 rounded-xl flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                        <circle className="text-secondary-fixed" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset="44" strokeWidth="6"></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-label-md text-label-md">75%</div>
                    </div>
                    <div>
                      <p className="font-headline-sm text-headline-sm leading-tight">Reading Score</p>
                      <p className="text-body-sm opacity-80">You're mastering this chapter!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Concepts Tab */}
              {activeTab === 'concepts' && (
                <div className="space-y-4">
                  {analysisData.concepts.map((concept, index) => (
                    <div key={index} className="p-4 bg-white border border-outline-variant rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">{concept.term}</span>
                        <span className="material-symbols-outlined text-outline">info</span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant">{concept.definition}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  {analysisData.questions.map((q, index) => (
                    <div key={index} className="border-l-4 border-secondary bg-surface-container p-4 rounded-r-lg">
                      <p className="font-label-md text-label-md text-primary mb-2">{q.type || "Multiple Choice"}</p>
                      <p className="text-body-md font-medium mb-3">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <button key={optIdx} className="w-full text-left p-3 rounded bg-white border border-outline-variant text-body-sm hover:border-secondary transition-all">{opt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flashcards Tab */}
              {activeTab === 'flashcards' && (
                <div>
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="aspect-[4/3] bg-gradient-to-br from-primary to-primary-container rounded-2xl flex flex-col items-center justify-center p-8 text-center text-on-primary shadow-xl cursor-pointer hover:scale-[1.02] transition-transform group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">lightbulb</span>
                    </div>

                    {/* Interactive Flashcard Text Swap */}
                    {!isCardFlipped ? (
                      <>
                        <h4 className="font-headline-md text-headline-md mb-4 relative z-10">
                          {analysisData.flashcards[0]?.front || "Flashcard Front"}
                        </h4>
                        <p className="font-label-md text-label-md opacity-70 relative z-10">Click to reveal answer</p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-body-md text-body-md mb-4 relative z-10 px-2 leading-relaxed">
                          {analysisData.flashcards[0]?.back || "Flashcard Back"}
                        </h4>
                        <p className="font-label-md text-label-md opacity-70 relative z-10">Click to flip back</p>
                      </>
                    )}
                  </div>

                  <div className="flex justify-center gap-4 mt-8">
                    <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="flex items-center font-label-md text-label-md text-on-surface-variant">Card 1 of {analysisData.flashcards.length}</div>
                    <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* AI Input Block */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-low">
              <form
                onSubmit={(e) => { e.preventDefault(); console.log(aiInput); setAiInput(''); }}
                className="relative flex items-center"
              >
                <input
                  className="w-full pl-4 pr-12 py-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none transition-all font-body-md text-body-sm"
                  placeholder="Ask AI anything about these notes..."
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 w-10 h-10 bg-secondary text-on-secondary rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Interactive FAB (Mobile Only) */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-lg flex items-center justify-center z-50">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </button>
    </div>
  );
}