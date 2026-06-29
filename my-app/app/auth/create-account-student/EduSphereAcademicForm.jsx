"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Extracted Sub-component for Cleaner Layout Code Scannability
function StepperTimeline() {
  return (
    <div className="flex items-center justify-between px-4 mb-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#62fae3] text-[#007165] flex items-center justify-center font-bold border-2 border-[#006b5f]">
          <span className="material-symbols-outlined text-[20px] font-fill">check</span>
        </div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Account</span>
      </div>
      <div className="flex-grow h-[2px] bg-[#62fae3] mx-4 mb-6"></div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#002045] text-white flex items-center justify-center font-bold">2</div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#002045] font-bold">Academic</span>
      </div>
      <div className="flex-grow h-[2px] bg-[#e0e3e5] mx-4 mb-6"></div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#e0e3e5] text-[#43474e] flex items-center justify-center font-bold">3</div>
        <span className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e]">Personalize</span>
      </div>
    </div>
  );
}

export default function EduSphereAcademicForm() {
  const router = useRouter();
  
  // Form Field State Values
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [academicPosition, setAcademicPosition] = useState('');
  const [universitiesList, setUniversitiesList] = useState([]);
  
  // Status Handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '', role: 'student' });

  // Safe SSR Extraction for Web Storage API Sessions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem('signup_credentials');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setTimeout(() => {
            setCredentials(parsed);
          }, 0);
        } catch (e) {
          console.error("Error parsing cached credentials token:", e);
        }
      }
    }

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
        console.error('Error fetching universities:', err);
        // Fallback list
        setUniversitiesList([
          { id: "oxford", name: "University of Oxford" },
          { id: "stanford", name: "Stanford University" },
          { id: "mit", name: "Massachusetts Institute of Technology" },
          { id: "cambridge", name: "University of Cambridge" },
          { id: "eth_zurich", name: "ETH Zurich" },
          { id: "other", name: "Other / Not Listed" }
        ]);
      }
    };
    fetchUniversities();
  }, []);

  // Form Field Evaluation Logic
  const isFormComplete = 
    fullName.trim() !== '' && 
    university !== '' && 
    faculty.trim() !== '' && 
    (credentials.role === 'teacher' ? academicPosition !== '' : academicYear !== '') && 
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setError('');
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Missing account credentials. Please go back and enter email/password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          fullName,
          school: university,
          year: credentials.role === 'teacher' ? academicPosition : academicYear,
          major: faculty,
          role: credentials.role || 'student'
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

      if (credentials.role === 'teacher') {
        router.push('/teacher/instructor-dashboard');
      } else {
        router.push('/auth/onboarding');
      }
    } catch (err) {
      console.error('Signup form request submission error:', err);
      setError(err.message || 'Server connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-['Inter'] antialiased">


      {/* Top Navigation Frame */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c4c6cf]/30">
        <div className="flex justify-center items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto">
          <span onClick={() => router.push('/')} className="font-['Sora'] text-[24px] font-bold leading-[32px] text-[#002045] cursor-pointer">EduSphere AI</span>
        </div>
      </header>

      {/* Primary Onboarding Workflow Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 mt-16">
        <div className="w-full max-w-[600px] flex flex-col gap-6">

          {/* Stepper Timeline Indicator Component */}
          <StepperTimeline />

          {/* Form Processing UI Block */}
          <div className="bg-white border border-[#c4c6cf] rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-12">
              <div className="mb-6">
                <h1 className="font-['Sora'] text-[32px] font-semibold leading-[40px] text-[#002045] mb-2">
                  {credentials.role === 'teacher' ? 'Tell us about your role' : 'Tell us about your studies'}
                </h1>
                <p className="text-[#43474e] text-[16px] leading-[26px]">
                  {credentials.role === 'teacher'
                    ? 'This helps us tailor your course management tools and research assistant to your academic needs.'
                    : 'This helps us tailor your AI research assistant and library access to your specific academic needs.'}
                </p>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[14px]">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field 1: User Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="full_name">Full Name</label>
                  <input
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60"
                    id="full_name"
                    placeholder="Alex Sterling"
                    required
                    disabled={loading}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Field 2: University Selector Dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="university">University Name</label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60"
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

                {/* Field 3: Faculty Context Text Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase" htmlFor="faculty">Faculty / Department</label>
                  <input
                    className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60"
                    id="faculty"
                    placeholder="e.g. Department of Physics"
                    required
                    disabled={loading}
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                  />
                </div>

                {/* Field 4: Custom Radio Selection Layout Block */}
                {credentials.role === 'teacher' ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase">Academic Position</label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-[#006b5f]/20 focus:border-[#006b5f] transition-all outline-none disabled:opacity-60 text-[14px]"
                        id="academic_position"
                        required
                        disabled={loading}
                        value={academicPosition}
                        onChange={(e) => setAcademicPosition(e.target.value)}
                      >
                        <option value="" disabled>Select your position</option>
                        <option value="Professor">Professor / Associate Prof.</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer / Instructor</option>
                        <option value="Researcher">Researcher / Fellow</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[#43474e]">keyboard_arrow_down</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold tracking-[0.05em] text-[#43474e] uppercase">Academic Year</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['1', '2', '3', 'grad'].map((yearValue, index) => {
                        const labels = ['Year 1', 'Year 2', 'Year 3', 'Graduate'];
                        return (
                          <label key={yearValue} className={`cursor-pointer ${loading ? 'pointer-events-none opacity-60' : ''}`}>
                            <input
                              className="peer hidden"
                              name="academic_year"
                              type="radio"
                              required
                              disabled={loading}
                              checked={academicYear === yearValue}
                              onChange={() => setAcademicYear(yearValue)}
                            />
                            <div className="flex items-center justify-center p-3 border border-[#c4c6cf] rounded-lg peer-checked:bg-[#1a365d] peer-checked:text-[#86a0cd] peer-checked:border-[#002045] transition-all hover:bg-[#e6e8ea] text-center">
                              <span className="text-[14px] leading-[22px]">{labels[index]}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step Actions Segment */}
                <div className="pt-6 flex flex-col sm:flex-row gap-6">
                  <button
                    className="flex-1 px-6 py-4 rounded-xl border border-[#74777f] font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045] hover:bg-[#eceef0] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    type="button"
                    disabled={loading}
                    onClick={() => router.push('/auth/signup')}
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Previous
                  </button>
                  <button
                    className={`flex-[2] px-6 py-4 rounded-xl font-['Sora'] text-[20px] font-semibold leading-[28px] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:pointer-events-none ${
                      isFormComplete
                        ? 'bg-[#006b5f] hover:bg-[#007165] shadow-[#006b5f]/10'
                        : 'bg-[#002045] hover:bg-[#1a365d] shadow-[#002045]/10'
                    }`}
                    type="submit"
                    disabled={!isFormComplete || loading}
                  >
                    {loading ? 'Submitting...' : 'Continue'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Form Verification Info Block */}
            <div className="bg-[#f2f4f6] p-4 flex items-start gap-3 border-t border-[#c4c6cf]/30">
              <span className="material-symbols-outlined text-[#006b5f] font-fill">info</span>
              <p className="text-[14px] leading-[22px] text-[#43474e]">Your university credentials are used only to verify access to specialized academic datasets and institutional library features.</p>
            </div>
          </div>

          {/* Underlay Insight Status Block (Glassmorphic Accent) */}
          <div className="bg-white/70 backdrop-blur-[12px] border border-[#001b3c]/10 rounded-xl p-4 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-[#62fae3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#007165] font-fill">auto_awesome</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.05em] text-[#002045]">EduSphere Insight</p>
              <p className="text-[14px] leading-[22px] text-[#43474e]">Matching your department with 452 relevant research modules...</p>
            </div>
          </div>
        </div>
      </main>

      {/* Global Application Onboarding Footer Component */}
      <footer className="bg-[#f2f4f6] border-t border-[#c4c6cf]/50 w-full py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 space-y-4 md:space-y-0 max-w-[1280px] mx-auto">
          <span className="text-[14px] leading-[22px] text-[#43474e] text-center md:text-left">
            © 2024 EduSphere AI. Academic Excellence through Intelligence.
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <a className="text-[14px] leading-[22px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Privacy Policy</a>
            <a className="text-[14px] leading-[22px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Terms of Service</a>
            <a className="text-[14px] leading-[22px] text-[#43474e] hover:text-[#006b5f] transition-all" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
