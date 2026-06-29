"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EduSphereLogin() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('user', JSON.stringify(data.user));
      }
      const redirectPath = data.user.role === 'teacher' ? '/teacher/instructor-dashboard' : '/student/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid credentials or connection issue');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: "12K+", label: "Active Students" },
    { value: "98%", label: "Grade Improvement" },
    { value: "24/7", label: "AI Support" },
    { value: "500+", label: "Courses" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);opacity:0.7} 70%{transform:scale(1.1);opacity:0} 100%{transform:scale(0.95);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: float 8s ease-in-out infinite 1s; }
        .float-3 { animation: float 7s ease-in-out infinite 2s; }
        .pulse-ring::before { content:''; position:absolute; inset:-4px; border:2px solid rgba(98,250,227,0.4); border-radius:inherit; animation: pulse-ring 2.5s ease-out infinite; }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .input-float:focus-within label, .input-float input:not(:placeholder-shown) + label { transform: translateY(-22px) scale(0.8); color: var(--secondary-color); }
        :root { --secondary-color: #62fae3; }
      `}} />

      <div className="min-h-screen flex bg-[#f0f2f5]" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Left: Cinematic Brand Panel ── */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col" style={{ background: "linear-gradient(135deg,#002045 0%,#003366 40%,#006b5f 100%)" }}>
          {/* Animated mesh blobs */}
          <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 float-1" style={{ background: "radial-gradient(circle,#62fae3,transparent)", top: "-5%", left: "10%" }} />
          <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 float-2" style={{ background: "radial-gradient(circle,#09007b,transparent)", bottom: "10%", right: "-5%" }} />
          <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 float-3" style={{ background: "radial-gradient(circle,#006b5f,transparent)", bottom: "30%", left: "5%" }} />
          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-14">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <span className="text-white font-['Sora'] text-[20px] font-bold">EduSphere AI</span>
            </div>

            {/* Main headline */}
            <div className="py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(98,250,227,0.15)", border: "1px solid rgba(98,250,227,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-[#62fae3] animate-pulse" />
                <span className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase">Academic Excellence Platform</span>
              </div>
              <h1 className="text-white font-['Sora'] text-[42px] font-bold leading-[1.2] mb-6">
                Empowering the<br />
                <span className="text-transparent" style={{ background: "linear-gradient(90deg,#62fae3,#3cddc7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  next generation
                </span><br />
                of scholars.
              </h1>
              <p className="text-[#d6e3ff] text-[16px] leading-relaxed max-w-md">
                AI-integrated learning tools built for modern academic excellence — from personalized pathways to real-time tutoring.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-[#62fae3] font-['Sora'] text-[22px] font-bold">{stat.value}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Floating decorative cards */}
            <div className="absolute top-1/3 right-10 float-1">
              <div className="px-4 py-3 rounded-2xl shadow-2xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#62fae3] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-white text-[11px] font-semibold">AI Tutor Active</span>
                </div>
                <p className="text-white/60 text-[10px]">Answering 42 questions now</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-10 bg-white relative">

          {/* Mobile Logo */}
          <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002045] to-[#006b5f] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <span className="text-[#002045] font-['Sora'] text-[16px] font-bold">EduSphere AI</span>
          </div>

          <div className="w-full max-w-[400px] fade-in">
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-['Sora'] text-[28px] font-bold text-[#002045] mb-2">Welcome back</h2>
              <p className="text-[#74777f] text-[14px]">Sign in to your EduSphere account to continue your journey.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <p className="text-[#ba1a1a] text-[13px] font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-2" htmlFor="email">University Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'email' ? '#006b5f' : '#c4c6cf' }}>mail</span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="yourname@university.edu"
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#43474e] uppercase tracking-wider" htmlFor="password">Password</label>
                  <Link href="/auth/forgot-password" className="text-[12px] text-[#006b5f] font-semibold hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'password' ? '#006b5f' : '#c4c6cf' }}>lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-[#f0f2f5] text-[#191c1e] text-[14px] outline-none transition-all"
                    style={{ borderColor: focused === 'password' ? '#006b5f' : '#e0e3e5' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#006b5f] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-['Sora'] text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#002045,#006b5f)" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e0e3e5]" />
              <span className="text-[12px] text-[#74777f] font-medium">or</span>
              <div className="flex-1 h-px bg-[#e0e3e5]" />
            </div>

            {/* Role quick-select */}
            {/* <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { role: "Student", icon: "person", path: "/auth/create-account-student" },
                { role: "Teacher", icon: "school", path: "/auth/create-account-teacher" },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => router.push('/auth/signup')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#e0e3e5] text-[#43474e] text-[13px] font-semibold hover:border-[#006b5f] hover:text-[#006b5f] hover:bg-[#f7fffe] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                  Sign up as {r.role}
                </button>
              ))}
            </div> */}

            {/* Footer link */}
            <p className="text-center text-[13px] text-[#74777f]">
              Don't have an account?{' '}
              <button onClick={() => router.push('/auth/signup')} className="text-[#006b5f] font-bold hover:underline">Create one</button>
            </p>
          </div>

          {/* Bottom fine print */}
          <p className="absolute bottom-6 text-[11px] text-[#c4c6cf] text-center px-4">
            © 2024 EduSphere AI · Academic Excellence through Intelligence
          </p>
        </div>
      </div>
    </>
  );
}