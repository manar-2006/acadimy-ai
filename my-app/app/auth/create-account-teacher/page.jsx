"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function StepperTimeline() {
  return (
    <div className="flex items-center justify-between px-4 mb-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#62fae3] text-[#007165] flex items-center justify-center font-bold border-2 border-[#006b5f]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Account</span>
      </div>
      <div className="flex-grow h-[2px] bg-[#62fae3] mx-4 mb-6"></div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#002045] text-white flex items-center justify-center font-bold">2</div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#002045] font-bold">Profile</span>
      </div>
      <div className="flex-grow h-[2px] bg-[#e0e3e5] mx-4 mb-6"></div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#e0e3e5] text-[#43474e] flex items-center justify-center font-bold">3</div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Activate</span>
      </div>
    </div>
  );
}

export default function CreateTeacherAccount() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [academicPosition, setAcademicPosition] = useState('');
  const [bio, setBio] = useState('');
  const [specializationInput, setSpecializationInput] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [universitiesList, setUniversitiesList] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem('signup_credentials');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error("Error parsing cached credentials:", e);
        }
      }
    }
    return { email: '', password: '', role: 'teacher' };
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/universities');
        if (response.ok) {
          const data = await response.json();
          setUniversitiesList(data);
        } else {
          throw new Error('Failed to load universities');
        }
      } catch (err) {
        setUniversitiesList([
          { id: "oxford", name: "University of Oxford" },
          { id: "stanford", name: "Stanford University" },
          { id: "mit", name: "Massachusetts Institute of Technology" },
          { id: "cambridge", name: "University of Cambridge" },
          { id: "eth_zurich", name: "ETH Zurich" },
          { id: "harvard", name: "Harvard University" },
          { id: "caltech", name: "California Institute of Technology" },
          { id: "other", name: "Other / Not Listed" }
        ]);
      }
    };
    fetchUniversities();
  }, []);

  const addSpecialization = () => {
    const tag = specializationInput.trim();
    if (tag && !specializations.includes(tag)) {
      setSpecializations([...specializations, tag]);
      setSpecializationInput('');
    }
  };

  const handleSpecializationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialization();
    }
  };

  const removeSpecialization = (tag) => {
    setSpecializations(specializations.filter(s => s !== tag));
  };

  const isFormComplete =
    fullName.trim() !== '' &&
    university !== '' &&
    department.trim() !== '' &&
    academicPosition !== '' &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setError('');
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Missing account credentials. Please go back and enter your email/password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          fullName,
          school: university,
          year: academicPosition,
          major: department,
          role: 'teacher',
          bio,
          specializations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('user', JSON.stringify(data.user));
        window.sessionStorage.removeItem('signup_credentials');
      }

      router.push('/teacher/instructor-dashboard');
    } catch (err) {
      console.error('Teacher signup error:', err);
      setError(err.message || 'Server connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>


      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c4c6cf]/30">
        <div className="flex justify-center items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto">
          <span
            onClick={() => router.push('/')}
            className="text-[24px] font-bold leading-[32px] text-[#002045] cursor-pointer"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            EduSphere AI
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 mt-16">
        <div className="w-full max-w-[640px] flex flex-col gap-6">

          <StepperTimeline />

          {/* Instructor Profile Badge */}
          <div className="flex items-center gap-3 bg-[#002045]/5 border border-[#002045]/10 rounded-xl px-5 py-3">
            <div className="w-10 h-10 rounded-full bg-[#002045] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#62fae3] font-fill text-[20px]">school</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#002045]">Instructor Registration</p>
              <p className="text-[12px] text-[#43474e]">Setting up your faculty profile — this takes about 2 minutes.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#c4c6cf] rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <h1 className="text-[32px] font-semibold leading-[40px] text-[#002045] mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Tell us about your role
                </h1>
                <p className="text-[#43474e] text-[16px] leading-[26px]">
                  This helps us tailor your course management tools, research assistant, and student analytics to your academic profile.
                </p>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[14px] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="full_name">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60 text-[15px]"
                    id="full_name"
                    placeholder="e.g. Dr. Sarah Mitchell"
                    required
                    disabled={loading}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* University Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="university">
                    University / Institution
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60 text-[15px]"
                      id="university"
                      required
                      disabled={loading}
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    >
                      <option value="" disabled>Select your institution</option>
                      {universitiesList.map((univ) => (
                        <option key={univ.id} value={univ.id}>{univ.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#43474e]">keyboard_arrow_down</span>
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="department">
                    Department / Faculty
                  </label>
                  <input
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60 text-[15px]"
                    id="department"
                    placeholder="e.g. Department of Computer Science"
                    required
                    disabled={loading}
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                {/* Academic Position */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase">
                    Academic Position
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'Professor', label: 'Professor', icon: 'workspace_premium' },
                      { value: 'Associate Professor', label: 'Assoc. Professor', icon: 'school' },
                      { value: 'Assistant Professor', label: 'Asst. Professor', icon: 'menu_book' },
                      { value: 'Lecturer', label: 'Lecturer', icon: 'record_voice_over' },
                      { value: 'Researcher', label: 'Researcher', icon: 'biotech' },
                      { value: 'Adjunct', label: 'Adjunct / Visiting', icon: 'person_pin' },
                    ].map((pos) => (
                      <button
                        key={pos.value}
                        type="button"
                        disabled={loading}
                        onClick={() => setAcademicPosition(pos.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                          academicPosition === pos.value
                            ? 'border-[#006b5f] bg-[#006b5f]/5 text-[#006b5f]'
                            : 'border-[#c4c6cf] hover:border-[#006b5f]/40 text-[#43474e] hover:bg-[#f2f4f6]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: academicPosition === pos.value ? "'FILL' 1" : "'FILL' 0" }}>
                          {pos.icon}
                        </span>
                        <span className="text-[12px] font-semibold leading-tight">{pos.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Research Specializations */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase">
                    Research Specializations <span className="text-[#74777f] normal-case font-normal">(optional)</span>
                  </label>
                  <div className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus-within:border-[#006b5f] focus-within:ring-2 focus-within:ring-[#006b5f]/20 transition-all min-h-[52px]">
                    {specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {specializations.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 bg-[#62fae3] text-[#007165] px-3 py-1 rounded-full text-[12px] font-semibold"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(tag)}
                              className="hover:text-[#002045] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#74777f]"
                        placeholder="Type a field and press Enter (e.g. Machine Learning)"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyDown={handleSpecializationKeyDown}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={addSpecialization}
                        disabled={!specializationInput.trim() || loading}
                        className="text-[#006b5f] disabled:opacity-40 hover:text-[#002045] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#74777f]">Add your research areas, e.g. "Neural Networks", "Computational Linguistics", "Quantum Computing".</p>
                </div>

                {/* Short Bio */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="bio">
                    Short Bio <span className="text-[#74777f] normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60 text-[15px] resize-none"
                    id="bio"
                    placeholder="Share a bit about your academic background and teaching philosophy..."
                    rows={3}
                    disabled={loading}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    className="flex-1 px-6 py-4 rounded-xl border border-[#74777f] text-[18px] font-semibold text-[#002045] hover:bg-[#eceef0] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                    type="button"
                    disabled={loading}
                    onClick={() => router.push('/auth/signup')}
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Previous
                  </button>
                  <button
                    className={`flex-[2] px-6 py-4 rounded-xl text-[18px] font-semibold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:pointer-events-none ${
                      isFormComplete
                        ? 'bg-[#006b5f] hover:bg-[#007165] shadow-[#006b5f]/20'
                        : 'bg-[#002045] cursor-not-allowed'
                    }`}
                    style={{ fontFamily: "'Sora', sans-serif" }}
                    type="submit"
                    disabled={!isFormComplete || loading}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Activate Instructor Account
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Info Strip */}
            <div className="bg-[#f2f4f6] p-4 flex items-start gap-3 border-t border-[#c4c6cf]/30">
              <span className="material-symbols-outlined text-[#006b5f] font-fill shrink-0">verified_user</span>
              <p className="text-[13px] leading-[20px] text-[#43474e]">
                Your institutional credentials are used to verify your access to faculty-level tools, course analytics, and research datasets. We never share your data with third parties.
              </p>
            </div>
          </div>

          {/* AI Teaser Card */}
          <div className="bg-white/60 backdrop-blur-[12px] border border-[#001b3c]/10 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#62fae3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#007165] font-fill">auto_awesome</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.05em] text-[#002045]">EduSphere for Instructors</p>
              <p className="text-[13px] leading-[20px] text-[#43474e]">
                Your AI student analytics dashboard, AI quiz generator, and performance insights are being prepared...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f4f6] border-t border-[#c4c6cf]/50 w-full py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 space-y-3 md:space-y-0 max-w-[1280px] mx-auto">
          <span className="text-[13px] text-[#43474e]">© 2024 EduSphere AI. Academic Excellence through Intelligence.</span>
          <div className="flex flex-wrap justify-center gap-4">
            <a className="text-[13px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Privacy Policy</a>
            <a className="text-[13px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Terms of Service</a>
            <a className="text-[13px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
