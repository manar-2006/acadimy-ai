'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('signup_credentials', JSON.stringify({ email, password, role }));
    }
    if (role === 'teacher') {
      router.push('/auth/create-account-teacher');
    } else {
      router.push('/auth/create-account-student');
    }
  };

  const stats = [
    { value: "12K+", label: "Students" },
    { value: "98%", label: "Satisfied" },
    { value: "500+", label: "Courses" },
    { value: "24/7", label: "AI Help" },
  ];

  const features = [
    { icon: "auto_awesome", text: "AI-powered personalized learning" },
    { icon: "analytics", text: "Real-time performance analytics" },
    { icon: "group", text: "Collaborative study communities" },
    { icon: "school", text: "Expert teacher connections" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .float-orb { animation: float 7s ease-in-out infinite; }
        .float-orb-2 { animation: float 9s ease-in-out infinite 1.5s; }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .role-btn { transition: all 0.2s ease; }
      `}} />

      <div className="min-h-screen flex" style={{ fontFamily:"'Inter', sans-serif" }}>

        {/* ── Left Visual Panel ── */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col" style={{ background:"linear-gradient(135deg,#002045 0%,#003366 45%,#006b5f 100%)" }}>
          {/* Animated blobs */}
          <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 float-orb" style={{ background:"radial-gradient(circle,#62fae3,transparent)", top:"-10%", left:"5%" }} />
          <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-15 float-orb-2" style={{ background:"radial-gradient(circle,#09007b,transparent)", bottom:"5%", right:"-5%" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"radial-gradient(#fff 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-14 justify-between">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings:"'FILL' 1" }}>school</span>
              </div>
              <span className="text-white font-['Sora'] text-[20px] font-bold">EduSphere AI</span>
            </div>

            {/* Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background:"rgba(98,250,227,0.15)", border:"1px solid rgba(98,250,227,0.25)" }}>
                <span className="w-2 h-2 rounded-full bg-[#62fae3] animate-pulse" />
                <span className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase">Join the AI Learning Revolution</span>
              </div>
              <h1 className="text-white font-['Sora'] text-[40px] font-bold leading-[1.2] mb-5">
                Your academic<br />
                <span className="text-transparent" style={{ background:"linear-gradient(90deg,#62fae3,#3cddc7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  success starts
                </span><br />
                here.
              </h1>
              <p className="text-[#d6e3ff] text-[15px] leading-relaxed mb-8 max-w-md">
                Join thousands of students and educators using AI-powered tools for smarter, faster, and more engaging learning.
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:"rgba(98,250,227,0.15)" }}>
                      <span className="material-symbols-outlined text-[#62fae3] text-[16px]" style={{ fontVariationSettings:"'FILL' 1" }}>{f.icon}</span>
                    </div>
                    <span className="text-white/80 text-[14px]">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-[#62fae3] font-['Sora'] text-[20px] font-bold">{stat.value}</p>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Registration Form ── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-10 bg-white relative">

          {/* Mobile Logo */}
          <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002045] to-[#006b5f] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings:"'FILL' 1" }}>school</span>
            </div>
            <span className="text-[#002045] font-['Sora'] text-[16px] font-bold">EduSphere AI</span>
          </div>

          <div className="absolute top-6 right-6">
            <LanguageSwitcher variant="light" />
          </div>

          <div className="w-full max-w-[400px] fade-in">

            {/* Header */}
            <div className="mb-8">
              <h2 className="font-['Sora'] text-[28px] font-bold text-[#002045] mb-2">{t('authSignUp')}</h2>
              <p className="text-[#74777f] text-[14px]">{t('authSignUpSubtitle')}</p>
            </div>

            {/* Role Toggle */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-3">{t('authRole')}</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-[#f2f4f6] rounded-xl">
                {[
                  { label: t('authStudent'), icon: "person", value: "student" },
                  { label: t('authTeacher'), icon: "school", value: "teacher" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`role-btn flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-semibold ${
                      role === r.value
                        ? 'bg-white shadow-md text-[#002045]'
                        : 'text-[#74777f] hover:text-[#002045]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: role === r.value ? "'FILL' 1" : "'FILL' 0" }}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-2" htmlFor="email">{t('authEmail')}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'email' ? '#006b5f' : '#c4c6cf' }}>mail</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-[#f0f2f5] text-[#191c1e] text-[14px] outline-none transition-all"
                    style={{ borderColor: focused === 'email' ? '#006b5f' : '#e0e3e5' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-2" htmlFor="password">{t('authPassword')}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'password' ? '#006b5f' : '#c4c6cf' }}>lock</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-[#f7f9fb] text-[#191c1e] text-[14px] outline-none transition-all"
                    style={{ borderColor: focused === 'password' ? '#006b5f' : '#e0e3e5' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#006b5f] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-1">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${agreeTerms ? 'bg-[#006b5f] border-[#006b5f]' : 'border-[#c4c6cf]'}`}
                >
                  {agreeTerms && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                </div>
                <p className="text-[13px] text-[#74777f]">
                  {t('authAgreeTerms')}{' '}
                  <a href="#" className="text-[#006b5f] font-bold hover:underline">{t('authTerms')}</a>
                  {' '}{t('authAnd')}{' '}
                  <a href="#" className="text-[#006b5f] font-bold hover:underline">{t('authPrivacy')}</a>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full py-4 rounded-xl text-white font-['Sora'] text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background:"linear-gradient(135deg,#006b5f,#002045)" }}
              >
                {t('authSignUpBtn')} ({role === 'teacher' ? t('authTeacher') : t('authStudent')})
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Already have account */}
            <p className="mt-6 text-center text-[13px] text-[#74777f]">
              {t('authAlreadyAccount')}{' '}
              <button onClick={() => router.push('/auth/login')} className="text-[#006b5f] font-bold hover:underline">{t('authSignInLink')}</button>
            </p>
          </div>

          {/* Fine print */}
          <p className="absolute bottom-6 text-[11px] text-[#c4c6cf] text-center px-4">
            © 2024 EduSphere AI · Academic Excellence through Intelligence
          </p>
        </div>
      </div>
    </>
  );
}