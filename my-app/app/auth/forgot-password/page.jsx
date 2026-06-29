"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code & New Password, 3: Success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send code");
      
      if (data.devMode && data.code) {
        setSuccessMsg(`Development Mode: SMTP is not configured. Use this verification code to test: ${data.code}`);
      } else {
        setSuccessMsg("A 6-digit verification code has been sent to your email address!");
      }
      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password");
      
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid code or password reset failed.");
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
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: float 8s ease-in-out infinite 1s; }
        .float-3 { animation: float 7s ease-in-out infinite 2s; }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `
      }} />

      <div className="min-h-screen flex bg-[#f0f2f5]" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Left Cinematic Panel */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col" style={{ background: "linear-gradient(135deg,#002045 0%,#003366 40%,#006b5f 100%)" }}>
          <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 float-1" style={{ background: "radial-gradient(circle,#62fae3,transparent)", top: "-5%", left: "10%" }} />
          <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 float-2" style={{ background: "radial-gradient(circle,#09007b,transparent)", bottom: "10%", right: "-5%" }} />
          <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 float-3" style={{ background: "radial-gradient(circle,#006b5f,transparent)", bottom: "30%", left: "5%" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 flex flex-col h-full p-14">
            <div className="flex items-center gap-3 mb-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#62fae3] to-[#006b5f] flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <span className="text-white font-['Sora'] text-[20px] font-bold">EduSphere AI</span>
            </div>

            <div className="py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(98,250,227,0.15)", border: "1px solid rgba(98,250,227,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-[#62fae3] animate-pulse" />
                <span className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase">Password Recovery Portal</span>
              </div>
              <h1 className="text-white font-['Sora'] text-[42px] font-bold leading-[1.2] mb-6">
                Regain access<br />
                <span className="text-transparent" style={{ background: "linear-gradient(90deg,#62fae3,#3cddc7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  to your classroom
                </span><br />
                in seconds.
              </h1>
              <p className="text-[#d6e3ff] text-[16px] leading-relaxed max-w-md">
                Secure self-service password recovery helps you get back to learning or teaching with no administrative delay.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-8 border-t border-white/10 mt-auto">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[#62fae3] font-['Sora'] text-[20px] font-bold">{stat.value}</p>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-10 bg-white relative">
          <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002045] to-[#006b5f] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <span className="text-[#002045] font-['Sora'] text-[16px] font-bold">EduSphere AI</span>
          </div>

          <div className="w-full max-w-[400px] fade-in">
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-['Sora'] text-[28px] font-bold text-[#002045] mb-2">Reset Password</h2>
              <p className="text-[#74777f] text-[14px]">
                {step === 1 && "Enter your university email to receive a password reset verification code."}
                {step === 2 && "Enter the verification code and set a new password."}
                {step === 3 && "Password updated successfully!"}
              </p>
            </div>

            {/* Notifications / Feedback */}
            {error && (
              <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <p className="text-[#ba1a1a] text-[13px] font-medium">{error}</p>
              </div>
            )}

            {successMsg && step === 2 && (
              <div className="mb-5 flex flex-col p-4 rounded-xl bg-[#d1fae5] border border-[#006b5f]/20">
                <div className="flex items-center gap-3 text-[#006b5f]">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="text-[13px] font-semibold">{successMsg}</p>
                </div>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-['Sora'] text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#002045,#006b5f)" }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Code…
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter Verification Code and New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-2" htmlFor="code">Verification Code</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'code' ? '#006b5f' : '#c4c6cf' }}>pin</span>
                    <input
                      id="code"
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      onFocus={() => setFocused('code')}
                      onBlur={() => setFocused('')}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-[#f0f2f5] text-[#191c1e] text-[14px] outline-none transition-all text-center tracking-[0.2em] font-mono font-bold"
                      style={{ borderColor: focused === 'code' ? '#006b5f' : '#e0e3e5' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-2" htmlFor="newPassword">New Password</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors" style={{ color: focused === 'newPassword' ? '#006b5f' : '#c4c6cf' }}>lock</span>
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      onFocus={() => setFocused('newPassword')}
                      onBlur={() => setFocused('')}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 bg-[#f0f2f5] text-[#191c1e] text-[14px] outline-none transition-all"
                      style={{ borderColor: focused === 'newPassword' ? '#006b5f' : '#e0e3e5' }}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-['Sora'] text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#002045,#006b5f)" }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting Password…
                    </>
                  ) : (
                    <>
                      Reset Password
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: Reset Success */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#d1fae5] text-[#006b5f] flex items-center justify-center mx-auto shadow-md">
                  <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-[#002045]">All Set!</h3>
                <p className="text-sm text-[#74777f]">Your password has been successfully reset. You can now log in using your new password.</p>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full py-4 rounded-xl text-white font-['Sora'] text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                  style={{ background: "linear-gradient(135deg,#002045,#006b5f)" }}
                >
                  Back to Sign In
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </button>
              </div>
            )}

            {/* Footer Back link */}
            {step !== 3 && (
              <p className="text-center text-[13px] text-[#74777f] mt-8">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-[#006b5f] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
