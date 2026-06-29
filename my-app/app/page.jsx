"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EduSphereLanding() {
  const heroCardRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const card = heroCardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) rotate(2deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = `rotate(2deg)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div suppressHydrationWarning className="bg-surface-bright text-on-surface font-body-md min-h-screen antialiased selection:bg-secondary/30">
        {/* TopNavBar */}
        <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface-bright/80 shadow-sm backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <a className="font-headline-md font-bold text-primary" href="#">
                EduSphere AI
              </a>
              <div className="hidden space-x-6 md:flex">
                <a className="font-label-md border-b-2 border-secondary font-bold text-secondary transition-all" href="#">
                  Home
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/auth/login')} className="font-label-md hidden px-4 py-2 text-primary transition-all hover:opacity-80 sm:block">
                Sign In
              </button>
              <button onClick={() => router.push('/auth/signup')} className="font-label-md rounded-lg bg-primary px-6 py-2.5 text-on-primary shadow-sm transition-all hover:opacity-90">
                Get Started
              </button>
            </div>
          </nav>
        </header>

        <main>
        {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] min-h-[600px] flex items-center">
            {/* Decorative blobs */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#09007b,transparent 70%)" }} />

            <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-20 lg:grid-cols-2">
              <div className="z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background:"rgba(98,250,227,0.15)", border:"1px solid rgba(98,250,227,0.25)" }}>
                  <span className="w-2 h-2 rounded-full bg-[#62fae3] animate-pulse" />
                  <span className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase">Next-Gen Academic Intelligence</span>
                </div>
                <h1 className="font-headline-xl mb-6 leading-tight text-white">
                  Your Intelligent University{" "}
                  <span style={{ background:"linear-gradient(90deg,#62fae3,#3cddc7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Companion</span>
                </h1>
                <p className="font-body-lg mb-10 max-w-lg text-[#d6e3ff]">
                  Navigate your academic journey with AI-powered study schedules, instant lecture summaries, and career pathing designed specifically for higher education.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => router.push('/auth/signup')}
                    className="rounded-xl px-8 py-4 font-bold text-[#002045] shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background:"linear-gradient(135deg,#62fae3,#3cddc7)" }}>
                    Get Started for Free
                  </button>
                  <button onClick={() => router.push('/auth/login')}
                    className="rounded-xl px-8 py-4 font-bold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all">
                    Sign In
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {['#006b5f','#002045','#09007b'].map((c,i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-[#002045] flex items-center justify-center text-white text-[10px] font-bold" style={{ background:c }}>A{i+1}</div>
                    ))}
                  </div>
                  <span className="text-[14px] text-white/70">Joined by <strong className="text-[#62fae3]">12,000+</strong> students this month</span>
                </div>
              </div>

              {/* Hero stats card */}
              <div className="relative hidden lg:block">
                <div className="absolute -top-8 -left-8 w-56 h-56 rounded-full opacity-20" style={{ background:"radial-gradient(circle,#62fae3,transparent)" }} />
                <div
                  ref={heroCardRef}
                  className="relative rounded-2xl p-5 shadow-2xl transition-all duration-500 ease-out rotate-2"
                  style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.15)", transformStyle:"preserve-3d" }}
                >
                  <p className="text-[11px] font-bold text-[#62fae3] uppercase tracking-widest mb-4">Live Dashboard Preview</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label:"GPA Score", value:"3.8", icon:"star", color:"#62fae3" },
                      { label:"Courses",   value:"6",   icon:"school", color:"#d6e3ff" },
                      { label:"Study hrs", value:"24h", icon:"timer",  color:"#62fae3" },
                      { label:"Tasks Done",value:"8/10",icon:"task_alt",color:"#d6e3ff" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-[16px]" style={{ color:s.color, fontVariationSettings:"'FILL' 1" }}>{s.icon}</span>
                          <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">{s.label}</span>
                        </div>
                        <p className="font-['Sora'] text-[24px] font-bold text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-4" style={{ background:"rgba(98,250,227,0.12)", border:"1px solid rgba(98,250,227,0.25)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#62fae3] text-[16px]" style={{ fontVariationSettings:"'FILL' 1" }}>auto_awesome</span>
                      <span className="text-[#62fae3] text-[11px] font-bold uppercase tracking-widest">AI Insight</span>
                    </div>
                    <p className="text-white/70 text-[12px] leading-relaxed">Your performance in ML is exceptional. Focus on Data Structures this week.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Overview */}
          <section className="bg-surface-container-low py-24">
            <div className="mx-auto max-w-[1280px] px-6">
              <div className="mb-16 text-center">
                <h2 className="font-headline-lg mb-4 text-primary">
                  Empowering Every Aspect of Campus Life
                </h2>
                <p className="font-body-md mx-auto max-w-2xl text-on-surface-variant">
                  Our platform bridges the gap between traditional study methods and the future of AI-assisted learning.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {/* Feature Card 1 */}
                <div className="group border border-outline-variant bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-fixed text-primary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                  </div>
                  <h3 className="font-headline-sm mb-3 text-primary">Smart Learning Assistant</h3>
                  <p className="font-body-sm mb-6 leading-relaxed text-on-surface-variant">
                    Transform hours of lectures into concise, actionable summaries and flashcards instantly. Ask any question about your course material.
                  </p>
                  <a className="font-label-md inline-flex items-center text-secondary transition-all hover:gap-2" href="/student/academic-assistant">
                    Learn more <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                  </a>
                </div>
                {/* Feature Card 2 */}
                <div className="group border border-outline-variant bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-secondary-container text-secondary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[32px]">calendar_month</span>
                  </div>
                  <h3 className="font-headline-sm mb-3 text-primary">AI Study Planner</h3>
                  <p className="font-body-sm mb-6 leading-relaxed text-on-surface-variant">
                    Optimized schedules that adapt to your pace, upcoming deadlines, and energy levels. Never miss an assignment again.
                  </p>
                  <a className="font-label-md inline-flex items-center text-secondary transition-all hover:gap-2" href="/student/study-planner">
                    Explore planner <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                  </a>
                </div>
                {/* Feature Card 3 */}
                <div className="group border border-outline-variant bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-tertiary-fixed text-tertiary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[32px]">work_history</span>
                  </div>
                  <h3 className="font-headline-sm mb-3 text-primary">Career Roadmap</h3>
                  <p className="font-body-sm mb-6 leading-relaxed text-on-surface-variant">
                    Personalized career guidance based on your academic performance, interests, and real-time market demand data.
                  </p>
                  <a className="font-label-md inline-flex items-center text-secondary transition-all hover:gap-2" href="/student/career-center">
                    Start your path <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="relative overflow-hidden bg-primary py-20 text-on-primary">
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
            </div>
            <div className="relative z-10 mx-auto max-w-[1280px] px-6">
              <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
                <div>
                  <div className="font-headline-xl mb-2">50k+</div>
                  <div className="font-label-md tracking-widest uppercase text-primary-fixed-dim">Active Students</div>
                </div>
                <div className="border-y border-on-primary/20 py-8 md:border-x md:border-y-0 md:py-0">
                  <div className="font-headline-xl mb-2">1M+</div>
                  <div className="font-label-md tracking-widest uppercase text-primary-fixed-dim">Summaries Generated</div>
                </div>
                <div>
                  <div className="font-headline-xl mb-2">95%</div>
                  <div className="font-label-md tracking-widest uppercase text-primary-fixed-dim">Exam Success Rate</div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-24">
            <div className="mx-auto max-w-[1280px] px-6">
              <div className="mb-16 text-center">
                <h2 className="font-headline-lg text-primary">Voices from the Academic World</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Testimonial 1 */}
                <div className="relative bg-surface-container p-8 rounded-2xl">
                  <span className="material-symbols-outlined absolute top-6 right-8 text-primary/10 text-[64px]">format_quote</span>
                  <p className="font-body-md relative z-10 mb-8 italic text-on-surface">
                    "EduSphere has completely changed how I prepare for my finals. The AI summaries capture nuance that I often miss during long lectures."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-outline">
                      <Image src="/window.svg" alt="James Wilson Portrait" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-primary">James Wilson</h4>
                      <p className="text-[11px] uppercase text-on-surface-variant">Oxford University • Law</p>
                    </div>
                  </div>
                </div>
                {/* Testimonial 2 */}
                <div className="relative bg-surface-container p-8 rounded-2xl">
                  <span className="material-symbols-outlined absolute top-6 right-8 text-primary/10 text-[64px]">format_quote</span>
                  <p className="font-body-md relative z-10 mb-8 italic text-on-surface">
                    "The Career Roadmap feature helped me land an internship at a top tech firm by suggesting the exact certifications I needed based on my major."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-outline">
                      <Image src="/file.svg" alt="Sarah Chen Portrait" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-primary">Sarah Chen</h4>
                      <p className="text-[11px] uppercase text-on-surface-variant">MIT • Computer Science</p>
                    </div>
                  </div>
                </div>
                {/* Testimonial 3 */}
                <div className="relative bg-surface-container p-8 rounded-2xl">
                  <span className="material-symbols-outlined absolute top-6 right-8 text-primary/10 text-[64px]">format_quote</span>
                  <p className="font-body-md relative z-10 mb-8 italic text-on-surface">
                    "Managing three labs and a part-time job was impossible before the AI Study Planner. It literally saved my GPA this semester."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-outline">
                      <Image src="/globe.svg" alt="Marcus Thorne Portrait" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-primary">Marcus Thorne</h4>
                      <p className="text-[11px] uppercase text-on-surface-variant">Stanford • Bio-Med</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          {/* <section className="bg-[#e6e8ea]/50 py-24">
            <div className="mx-auto max-w-[1280px] px-6">
              <div className="mb-16 text-center">
                <h2 className="font-headline-lg mb-4 text-primary">Straightforward Academic Pricing</h2>
                <p className="font-body-md text-on-surface-variant">Choose the plan that fits your study needs.</p>
              </div>
              <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                 Basic Plan
                <div className="border border-outline-variant bg-surface-container-lowest p-10 rounded-2xl shadow-sm flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="font-headline-md mb-2 text-primary">Basic</h3>
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-primary">$0</span>
                      <span className="text-on-surface-variant">/month</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant">Perfect for trying out AI-powered learning.</p>
                  </div>
                  <ul className="mb-10 space-y-4 flex-grow">
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">3 Course Summaries per month</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Standard AI Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Basic Study Planner</span>
                    </li>
                  </ul>
                  <button className="font-label-md w-full border-2 border-primary py-4 rounded-xl text-primary transition-colors hover:bg-surface-container-low">
                    Start for Free
                  </button>
                </div>
               
                <div className="border-2 border-secondary bg-surface-container-lowest p-10 rounded-2xl shadow-xl flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-secondary px-6 py-1.5 rounded-bl-xl text-[10px] font-bold font-label-md tracking-widest uppercase text-on-secondary">
                    Recommended
                  </div>
                  <div className="mb-8">
                    <h3 className="font-headline-md mb-2 text-primary">Pro</h3>
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-primary">$12</span>
                      <span className="text-on-surface-variant">/month</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant">For serious students aiming for the top.</p>
                  </div>
                  <ul className="mb-10 space-y-4 flex-grow">
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Unlimited Course Summaries</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Priority GPT-4o Assistant</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Full Career Roadmap & Guidance</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <span className="font-body-sm">Collaboration Tools for Groups</span>
                    </li>
                  </ul>
                  <button className="font-label-md w-full bg-primary py-4 rounded-xl text-on-primary shadow-md transition-all hover:opacity-90">
                    Go Pro Now
                  </button>
                </div>
              </div>
            </div>
          </section> */}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-outline-variant bg-surface-container-lowest px-6 py-12">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 mb-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <a className="font-headline-sm mb-4 inline-block font-bold text-primary" href="#">
                EduSphere AI
              </a>
              <p className="font-body-sm text-on-surface-variant">
                Revolutionizing higher education with ethical and powerful AI tools for the next generation of global leaders.
              </p>
            </div>
            <div>
              <h5 className="font-label-md mb-6 tracking-wider uppercase text-primary">Product</h5>
              <ul className="space-y-3">
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="/student/academic-assistant">AI Assistant</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="/student/study-planner">Study Planner</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="/student/career-center">Career Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md mb-6 tracking-wider uppercase text-primary">Company</h5>
              <ul className="space-y-3">
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="#">About Us</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="/course-management">University Partnerships</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="#">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md mb-6 tracking-wider uppercase text-primary">Legal</h5>
              <ul className="space-y-3">
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="#">Privacy Policy</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="#">Terms of Service</a></li>
                <li><a className="font-body-sm text-on-surface-variant transition-colors hover:text-secondary" href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">
            <p className="font-body-sm text-on-surface-variant">© 2024 EduSphere AI Academic Technologies.</p>
            <div className="flex gap-6">
              <a className="text-on-surface-variant transition-colors hover:text-primary" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-on-surface-variant transition-colors hover:text-primary" href="#"><span className="material-symbols-outlined">mail</span></a>
              <a className="text-on-surface-variant transition-colors hover:text-primary" href="#"><span className="material-symbols-outlined">share</span></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}