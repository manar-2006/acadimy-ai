"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

// ============= MOCK DECKS AND QUESTIONS =============
const InitialDecks = {
  ml: {
    name: "Machine Learning Basics",
    description: "Supervised vs Unsupervised, model evaluation, optimization, and overfitting.",
    flashcards: [
      {
        front: "What is Supervised Learning?",
        back: "A type of machine learning where the model is trained on labeled data, meaning the input is paired with the correct output target."
      },
      {
        front: "What is Overfitting?",
        back: "When a model learns the training data too well, capturing noise rather than general patterns, resulting in poor performance on unseen test data."
      },
      {
        front: "Define Gradient Descent.",
        back: "An optimization algorithm used to minimize a model's loss function by iteratively moving in the direction of steepest descent."
      }
    ],
    quiz: [
      {
        question: "Which of the following is an example of unsupervised learning?",
        options: ["Linear Regression", "K-Means Clustering", "Support Vector Machines", "Logistic Regression"],
        correct: 1,
        explanation: "K-Means Clustering operates on unlabeled data to find hidden clusters without predefined outputs."
      },
      {
        question: "What does 'epoch' refer to in machine learning training?",
        options: [
          "The size of a single training batch",
          "One complete pass of the entire training dataset through the network",
          "The step size used during backpropagation",
          "The number of layer weights updated per second"
        ],
        correct: 1,
        explanation: "An epoch signifies one complete iteration through all training examples in the dataset."
      }
    ]
  },
  os: {
    name: "Operating Systems Core",
    description: "Processes, virtual memory, thread execution, scheduling, and deadlocks.",
    flashcards: [
      {
        front: "What is a Process?",
        back: "An active execution instance of a program containing the executable code, current activity state, registers, and memory space."
      },
      {
        front: "Explain Virtual Memory.",
        back: "A memory management technique that maps program addresses to physical memory and secondary storage, simulating larger RAM capacity."
      }
    ],
    quiz: [
      {
        question: "Which CPU scheduling algorithm can lead to starvation?",
        options: ["Round Robin", "First-Come, First-Served", "Shortest Job First", "Priority-based Scheduling"],
        correct: 3,
        explanation: "Priority Scheduling can cause low-priority processes to wait indefinitely if high-priority tasks keep arriving."
      }
    ]
  }
};

export default function QuizFlashcards() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [decks, setDecks] = useState(InitialDecks);
  const [selectedDeckKey, setSelectedDeckKey] = useState("ml");
  const [studyMode, setStudyMode] = useState("flashcards"); // "flashcards" or "quiz"
  
  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // AI Generation states
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const activeDeck = decks[selectedDeckKey] || decks["ml"];

  const handleDeckChange = (key) => {
    setSelectedDeckKey(key);
    setCardIndex(0);
    setCardFlipped(false);
    resetQuiz();
  };

  const handleModeChange = (mode) => {
    setStudyMode(mode);
    setCardFlipped(false);
    resetQuiz();
  };

  const handleNextCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % activeDeck.flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev - 1 + activeDeck.flashcards.length) % activeDeck.flashcards.length);
    }, 150);
  };

  const handleAnswerSelect = (optionIdx) => {
    if (answered) return;
    setSelectedAnswer(optionIdx);
    setAnswered(true);
    if (optionIdx === activeDeck.quiz[quizIndex].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    if (quizIndex + 1 < activeDeck.quiz.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleGenerateDeck = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: `Generate a study deck for the topic: "${topic}". Return a JSON object with this exact structure: { "name": "...", "description": "...", "flashcards": [{ "front": "...", "back": "..." }], "quiz": [{ "question": "...", "options": ["option 1", "option 2", "option 3", "option 4"], "correct": 0, "explanation": "..." }] }. Make sure the correct index matches the correct option. Return ONLY the raw JSON string. Do not wrap it in markdown code block ticks.`,
          history: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Generation failed');
      
      let parsed;
      try {
        let cleanText = data.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json/, '');
        if (cleanText.endsWith('```')) cleanText = cleanText.replace(/```$/, '');
        parsed = JSON.parse(cleanText.trim());
      } catch (err) {
        throw new Error('AI returned an invalid JSON response structure. Please try again.');
      }

      if (!parsed.flashcards || !parsed.quiz) {
        throw new Error('AI response structure is missing flashcards or quiz items.');
      }

      const key = 'ai_' + Date.now();
      setDecks(prev => ({
        ...prev,
        [key]: parsed
      }));
      setSelectedDeckKey(key);
      setTopic('');
      setCardIndex(0);
      setCardFlipped(false);
      resetQuiz();
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] text-[#191c1e] min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Quiz & Flashcards" />

        <style dangerouslySetInnerHTML={{
          __html: `
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
          `
        }} />

        <main className="flex-grow max-w-5xl mx-auto w-full pb-16">
          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#09007b] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)` }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#62fae3,transparent 70%)" }} />
            <div className="relative z-10 max-w-5xl mx-auto">
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Study Tools</p>
              <h1 className="text-white font-['Sora'] text-3xl font-bold mb-2">Quiz & Flashcards</h1>
              <p className="text-[#d6e3ff] text-[14px]">Master course material with interactive flashcards and AI-powered practice quizzes.</p>
            </div>
          </div>

          <div className="px-6 md:px-8 pt-8 space-y-6">
            {/* AI Generator Box */}
            <section className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-sm space-y-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-[15px] text-[#002045]">? Generate New Study Deck with AI</h3>
                <p className="text-xs text-[#74777f] mt-0.5">Type any academic topic, subject, or lecture theme to build custom flashcards & quizzes.</p>
              </div>
              <form onSubmit={handleGenerateDeck} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Entanglement, French Revolution, Organic Chemistry..."
                  className="flex-1 bg-[#f7f9fb] border border-[#c4c6cf] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#006b5f] transition-all"
                  disabled={generating}
                />
                <button
                  type="submit"
                  disabled={generating || !topic.trim()}
                  className="bg-[#002045] hover:bg-[#1a365d] text-[#62fae3] font-bold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {generating ? (
                    <><div className="w-4 h-4 border-2 border-[#62fae3] border-t-transparent rounded-full animate-spin" />Generating...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px]">auto_awesome</span>Generate Deck</>
                  )}
                </button>
              </form>
              {genError && <p className="text-xs text-red-600 font-medium">{genError}</p>}
            </section>

            {/* Deck Select & Mode Toggle */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-sm">
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <label className="text-[11px] font-bold text-[#74777f] uppercase tracking-widest">Select Topic Deck</label>
                <div className="relative">
                  <select
                    value={selectedDeckKey}
                    onChange={(e) => handleDeckChange(e.target.value)}
                    className="w-full md:w-64 bg-[#f7f9fb] border-2 border-[#e0e3e5] rounded-xl px-4 py-3 appearance-none cursor-pointer focus:border-[#006b5f] outline-none font-semibold text-[#002045] text-[14px]"
                  >
                    {Object.keys(decks).map(k => (
                      <option key={k} value={k}>{decks[k].name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#74777f]">keyboard_arrow_down</span>
                </div>
              </div>

              <div className="flex bg-[#f2f4f6] rounded-xl p-1 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleModeChange("flashcards")}
                  className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                    studyMode === "flashcards" ? "bg-[#002045] text-white shadow-md" : "text-[#74777f] hover:text-[#002045]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">split_screen</span>
                  Flashcards
                </button>
                <button
                  onClick={() => handleModeChange("quiz")}
                  className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                    studyMode === "quiz" ? "bg-[#002045] text-white shadow-md" : "text-[#74777f] hover:text-[#002045]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  Practice Quiz
                </button>
              </div>
            </section>

            {/* Deck Description */}
            <div className="text-center md:text-left px-1">
              <h3 className="font-['Sora'] text-xl font-bold text-[#002045]">{activeDeck.name}</h3>
              <p className="text-[14px] text-[#74777f] mt-1 leading-relaxed">{activeDeck.description}</p>
            </div>

            {/* Core Interactive Area */}
            {studyMode === "flashcards" ? (
              <section className="flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto w-full">
                <div onClick={() => setCardFlipped(!cardFlipped)} className="w-full aspect-[1.6/1] min-h-[260px] perspective-1000 cursor-pointer">
                  <div className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-2xl shadow-lg ${cardFlipped ? "rotate-y-180" : ""}`}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden flex flex-col justify-between p-8 text-center bg-white rounded-2xl border border-[#e0e3e5]" style={{ boxShadow: "0 8px 32px rgba(0,32,69,0.08)" }}>
                      <span className="text-[10px] font-bold text-[#006b5f] tracking-widest uppercase">QUESTION</span>
                      <div className="flex-1 flex items-center justify-center">
                        <p className="font-['Sora'] text-xl md:text-2xl font-semibold text-[#002045]">{activeDeck.flashcards[cardIndex]?.front || ''}</p>
                      </div>
                      <span className="text-[12px] text-[#74777f] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">touch_app</span> Tap to reveal answer
                      </span>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between p-8 text-center rounded-2xl" style={{ background: "linear-gradient(135deg,rgba(0,107,95,0.06),rgba(98,250,227,0.1))", border: "1px solid rgba(0,107,95,0.2)" }}>
                      <span className="text-[10px] font-bold text-[#006b5f] tracking-widest uppercase">ANSWER</span>
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-[15px] md:text-[16px] text-[#191c1e] leading-relaxed">{activeDeck.flashcards[cardIndex]?.back || ''}</p>
                      </div>
                      <span className="text-[12px] text-[#74777f] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">touch_app</span> Tap to flip back
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button onClick={handlePrevCard} className="w-12 h-12 rounded-full border border-[#e0e3e5] bg-white flex items-center justify-center hover:shadow-md transition-all text-[#002045]">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div className="text-center font-bold text-[#002045]">
                    <span>{cardIndex + 1}</span>
                    <span className="text-[#74777f]"> / {activeDeck.flashcards.length}</span>
                  </div>
                  <button onClick={handleNextCard} className="w-12 h-12 rounded-full border border-[#e0e3e5] bg-white flex items-center justify-center hover:shadow-md transition-all text-[#002045]">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </section>
            ) : (
              <section className="max-w-2xl mx-auto w-full">
                {!quizFinished ? (
                  <div className="bg-white rounded-2xl border border-[#e0e3e5] p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#f0f2f5]">
                      <span className="text-xs font-bold text-[#74777f] uppercase tracking-widest">
                        Question {quizIndex + 1} of {activeDeck.quiz.length}
                      </span>
                      <span className="text-sm font-bold text-[#006b5f]">Score: {score}</span>
                    </div>

                    <h4 className="font-sora text-lg md:text-xl font-bold text-[#002045]">{activeDeck.quiz[quizIndex]?.question || ''}</h4>

                    <div className="space-y-3">
                      {(activeDeck.quiz[quizIndex]?.options || []).map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === activeDeck.quiz[quizIndex].correct;
                        
                        let style = "border-[#e0e3e5] hover:border-[#006b5f] hover:bg-[#f9fafb]";
                        if (answered) {
                          if (isCorrect) style = "border-[#006b5f] bg-[#d1fae5]/30 text-[#006b5f] font-semibold";
                          else if (isSelected) style = "border-red-600 bg-red-50 text-red-600 font-semibold";
                          else style = "border-[#e0e3e5] opacity-60";
                        } else if (isSelected) {
                          style = "border-[#002045] bg-[#002045]/5";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(idx)}
                            disabled={answered}
                            className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between cursor-pointer ${style}`}
                          >
                            <span>{option}</span>
                            {answered && (isCorrect ? (
                              <span className="material-symbols-outlined text-[#006b5f]">check_circle</span>
                            ) : isSelected ? (
                              <span className="material-symbols-outlined text-red-600">cancel</span>
                            ) : null)}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div className="p-4 bg-[#f9fafb] rounded-xl border-l-4 border-l-[#006b5f] text-xs md:text-sm text-[#43474e] leading-relaxed">
                        <strong className="text-[#002045] block mb-1">Explanation:</strong>
                        {activeDeck.quiz[quizIndex].explanation}
                      </div>
                    )}

                    {answered && (
                      <button onClick={handleNextQuestion} className="w-full py-4 bg-[#002045] hover:bg-[#1a365d] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                        <span>{quizIndex + 1 === activeDeck.quiz.length ? "Finish Quiz" : "Next Question"}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#e0e3e5] p-10 text-center shadow-md space-y-6">
                    <div className="w-20 h-20 bg-[#62fae3]/10 rounded-full flex items-center justify-center mx-auto text-[#006b5f]">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-sora text-2xl font-bold text-[#002045]">Practice Complete!</h4>
                      <p className="text-sm text-[#74777f]">Here is how you performed in {activeDeck.name}:</p>
                    </div>

                    <div className="inline-flex items-center justify-center p-6 rounded-full bg-[#f9fafb] w-28 h-28 border border-[#e0e3e5]">
                      <div>
                        <span className="text-3xl font-extrabold text-[#002045]">{score}</span>
                        <span className="text-[#74777f] text-sm"> / {activeDeck.quiz.length}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button onClick={resetQuiz} className="flex-1 py-3.5 border-2 border-[#002045] text-[#002045] font-bold rounded-xl hover:bg-[#f9fafb] transition-all text-sm">
                        Try Again
                      </button>
                      <button onClick={() => handleModeChange("flashcards")} className="flex-1 py-3.5 bg-[#002045] text-[#62fae3] font-bold rounded-xl hover:bg-[#1a365d] transition-all shadow-md text-sm">
                        Review Flashcards
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        <footer className="py-6 px-8 border-t border-[#e0e3e5] bg-white text-center">
          <p className="text-[11px] text-[#c4c6cf]">� 2024 EduSphere AI. Academic Excellence through Intelligence.</p>
        </footer>
      </div>
    </div>
  );
}
