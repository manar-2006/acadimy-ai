"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EduSphereCourses() {
  const [activeTab, setActiveTab] = useState('my-courses'); // 'my-courses' | 'discover'
  const [searchQuery, setSearchQuery] = useState('');
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Assignment & Details States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");
  const [submissionMsg, setSubmissionMsg] = useState(null);

  const handleOpenCourse = async (course) => {
    setSelectedCourse(course);
    setLoadingAssignments(true);
    setSubmissionMsg(null);
    setSubmissionContent("");
    setSubmissionFile("");
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch assignments
      const res = await fetch(`http://localhost:5000/api/courses/${course.id}/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const assignmentsData = await res.json();
        setAssignments(assignmentsData);

        // Fetch submissions for each assignment
        const tempSubmissions = {};
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (user) {
          for (const a of assignmentsData) {
            const subRes = await fetch(`http://localhost:5000/api/courses/${course.id}/assignments/${a.id}/submissions`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (subRes.ok) {
              const subs = await subRes.json();
              const mySub = subs.find(s => s.studentId === user.id);
              if (mySub) {
                tempSubmissions[a.id] = mySub;
              }
            }
          }
        }
        setSubmissionsMap(tempSubmissions);
      }
    } catch (err) {
      console.error("Error loading course details:", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleSubmitSubmission = async (assignmentId) => {
    if (!submissionContent.trim()) {
      setSubmissionMsg({ text: "Please enter submission text or link.", type: "error" });
      return;
    }
    setSubmittingId(assignmentId);
    setSubmissionMsg(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/courses/${selectedCourse.id}/assignments/${assignmentId}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: submissionContent + (submissionFile ? `\n\n[Attachment: ${submissionFile}]` : "")
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmissionMsg({ text: "Assignment submitted successfully!", type: "success" });
        setSubmissionsMap(prev => ({ ...prev, [assignmentId]: data }));
        setSubmissionContent("");
        setSubmissionFile("");
      } else {
        const errData = await res.json();
        setSubmissionMsg({ text: errData.message || "Failed to submit assignment.", type: "error" });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmissionMsg({ text: "Connection error during submission.", type: "error" });
    } finally {
      setSubmittingId(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Fetch student's enrolled courses
      const resMy = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMy.ok) {
        const dataMy = await resMy.json();
        setMyCourses(dataMy);
      }

      // 2. Fetch all courses in the system
      const resAll = await fetch('http://localhost:5000/api/courses/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resAll.ok) {
        const dataAll = await resAll.json();
        setAllCourses(dataAll);
      }
    } catch (err) {
      console.error("Failed to load courses data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    setMessage({ text: '', type: '' });
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Successfully linked with teacher and enrolled in course!', type: 'success' });
        await fetchData();
        setTimeout(() => {
          setActiveTab('my-courses');
          setMessage({ text: '', type: '' });
        }, 2000);
      } else {
        setMessage({ text: data.message || 'Enrollment failed', type: 'error' });
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setMessage({ text: 'Connection error during enrollment', type: 'error' });
    } finally {
      setEnrollingId(null);
    }
  };

  // Filter courses based on active tab and search query
  const displayCourses = (activeTab === 'my-courses' ? myCourses : allCourses).filter(course => {
    const query = searchQuery.toLowerCase();
    const matchName = course.name.toLowerCase().includes(query);
    const matchCode = course.code.toLowerCase().includes(query);
    const matchTeacher = course.teacher?.fullName?.toLowerCase().includes(query) || 
                          course.teacherName?.toLowerCase().includes(query);
    return matchName || matchCode || matchTeacher;
  });

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily:"'Inter',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html:`
        .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display:inline-block; vertical-align:middle; }
      `}} />
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="My Courses" />

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.5) 30px,rgba(255,255,255,.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Courses &amp; Teachers Hub</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Courses &amp; Teachers Hub</h1>
              <p className="text-[#d6e3ff] text-[14px]">Connect with real teachers and manage your enrolled course modules.</p>
            </div>
            <div className="flex items-center gap-4 text-center shrink-0">
              <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">{myCourses.length}</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">My Courses</p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[#62fae3] font-['Sora'] text-2xl font-bold">{myCourses.length > 0 ? `${Math.round(myCourses.reduce((s,c)=>s+(c.progress||0),0)/myCourses.length)}%` : '0%'}</p>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Avg Progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-12 pt-8 max-w-[1280px] mx-auto w-full space-y-6 flex-1">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-sora text-3xl font-bold text-[#002045] leading-tight">Courses & Teachers Hub</h1>
              <p className="text-sm text-[#43474e] mt-1">Connect with real teachers and manage your enrolled course modules.</p>
            </div>
            <div className="flex items-center gap-4 text-[#43474e] bg-white px-5 py-3 rounded-xl border border-[#c4c6cf]">
              <div className="text-center">
                <p className="font-sora text-lg font-bold text-[#002045]">{myCourses.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#74777f]">My Courses</p>
              </div>
              <div className="h-8 w-px bg-[#c4c6cf]"></div>
              <div className="text-center">
                <p className="font-sora text-lg font-bold text-[#006b5f]">
                  {myCourses.length > 0 ? `${Math.round(myCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / myCourses.length)}%` : '0%'}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#74777f]">Avg. Progress</p>
              </div>
            </div>
          </div>

          {/* Toast Messages */}
          {message.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              message.type === 'success' ? 'bg-[#d1fae5] border-[#006b5f] text-[#003d37]' : 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
            }`}>
              <span className="material-symbols-outlined">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="text-sm font-semibold">{message.text}</p>
            </div>
          )}

          {/* Navigation Controls: Tabs and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#c4c6cf] pb-4">
            <div className="flex p-1 bg-[#eceef0] rounded-xl self-start">
              <button
                onClick={() => { setActiveTab('my-courses'); setSearchQuery(''); }}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'my-courses'
                    ? 'bg-white text-[#002045] shadow-sm'
                    : 'text-[#43474e] hover:text-[#002045]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                My Enrolled Courses ({myCourses.length})
              </button>
              <button
                onClick={() => { setActiveTab('discover'); setSearchQuery(''); }}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'discover'
                    ? 'bg-white text-[#002045] shadow-sm'
                    : 'text-[#43474e] hover:text-[#002045]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                Discover Teachers & Courses ({allCourses.length})
              </button>
            </div>

            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] text-[18px]">search</span>
              <input
                type="text"
                placeholder={activeTab === 'my-courses' ? "Search my courses..." : "Search courses or teachers..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#c4c6cf] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b5f] focus:border-[#006b5f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Main Course Grid Display */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#006b5f] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-[#43474e]">Loading hub modules...</p>
            </div>
          ) : displayCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#c4c6cf] p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-[#eceef0] rounded-full flex items-center justify-center mx-auto text-[#74777f]">
                <span className="material-symbols-outlined text-[32px]">menu_book</span>
              </div>
              <h3 className="font-sora text-xl font-bold text-[#002045]">No courses found</h3>
              <p className="text-sm text-[#43474e]">
                {activeTab === 'my-courses'
                  ? "You are not enrolled in any courses yet. Browse the Discover tab to connect with real teachers and enroll."
                  : "We couldn't find any courses matching your search query. Try another term."}
              </p>
              {activeTab === 'my-courses' && (
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-block"
                >
                  Browse Available Courses
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayCourses.map((course) => {
                const isAlreadyEnrolled = myCourses.some(m => m.id === course.id);
                
                return (
                  <div
                    key={course.id}
                    className="group bg-white rounded-2xl border border-[#c4c6cf] hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                    style={{ borderTop: `4px solid ${course.color || '#002045'}` }}
                  >
                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      {/* Badge / Code info */}
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 bg-[#eceef0] text-[#002045] rounded-md font-bold text-[10px] tracking-wide uppercase">
                          {course.code}
                        </span>
                        <span className="text-[11px] text-[#74777f] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {course.schedule}
                        </span>
                      </div>

                      {/* Course Title */}
                      <div>
                        <h3 className="font-sora text-lg font-bold text-[#002045] group-hover:text-[#006b5f] transition-colors leading-snug">
                          {course.name.replace(/^[A-Z0-9-]+\s*:\s*/, '')}
                        </h3>
                        <span className="text-[11px] text-[#74777f] block mt-0.5">{course.semester}</span>
                      </div>

                      {/* Course Description */}
                      <p className="text-xs text-[#43474e] leading-relaxed line-clamp-3">
                        {course.description}
                      </p>

                      {/* My Enrolled Tab View specific elements */}
                      {activeTab === 'my-courses' && (
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-[#43474e]">Course Progress</span>
                            <span className="text-[#006b5f]">{course.progress || 65}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${course.progress || 65}%`, backgroundColor: course.color || '#002045' }}
                            ></div>
                          </div>
                          
                          {/* Teacher Link Widget */}
                          <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#c4c6cf] flex items-center gap-3 mt-4">
                            <div className="w-8 h-8 rounded-full bg-[#006b5f]/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[#006b5f] text-sm">person</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-[#002045] truncate">{course.teacherName || 'Instructor'}</p>
                              <p className="text-[10px] text-[#74777f] truncate">{course.teacherEmail || 'contact@university.edu'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Discover Tab Teacher Details Wrapper */}
                      {activeTab === 'discover' && course.teacher && (
                        <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c4c6cf] space-y-3 mt-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#002045]/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[#002045] text-base">account_circle</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#002045] truncate">{course.teacher.fullName}</p>
                              <p className="text-[10px] text-[#74777f] truncate">{course.teacher.school}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-[#43474e] italic line-clamp-2 leading-relaxed">
                            "{course.teacher.bio || 'Passionate educator and researcher.'}"
                          </p>
                          {course.teacher.specializations?.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {course.teacher.specializations.slice(0, 3).map((spec, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#eceef0] text-[#43474e] rounded text-[8px] font-bold">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2 mt-auto">
                        {activeTab === 'my-courses' ? (
                          <button
                            onClick={() => handleOpenCourse(course)}
                            className="w-full py-2.5 bg-[#e6e8ea] hover:bg-[#002045] hover:text-white transition-all rounded-xl font-bold text-xs uppercase tracking-wider text-[#002045] flex items-center justify-center gap-2"
                          >
                            Enter Course
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={isAlreadyEnrolled || enrollingId === course.id}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                              isAlreadyEnrolled
                                ? 'bg-[#eceef0] text-[#74777f] border border-[#c4c6cf] cursor-not-allowed'
                                : enrollingId === course.id
                                ? 'bg-[#006b5f]/20 text-[#006b5f] cursor-wait'
                                : 'bg-[#006b5f] hover:bg-[#005047] text-white hover:shadow-md'
                            }`}
                          >
                            {isAlreadyEnrolled ? (
                              <>
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                Connected & Enrolled
                              </>
                            ) : enrollingId === course.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#006b5f] border-t-transparent rounded-full animate-spin"></div>
                                Connecting...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                                Connect & Enroll
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <footer className="w-full py-6 px-8 bg-white border-t border-[#e0e3e5] mt-auto">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002045]" style={{ fontVariationSettings:"'FILL' 1" }}>school</span>
              <span className="font-bold text-[#002045] font-['Sora'] text-[13px]">EduSphere AI Academic Technologies</span>
            </div>
            <p className="text-[11px] text-[#c4c6cf]">© 2026 EduSphere AI. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#c4c6cf] max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl fade-in" style={{ animation: "fadeIn 0.3s ease-out" }}>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-start" style={{ borderTop: `6px solid ${selectedCourse.color || '#002045'}` }}>
              <div>
                <span className="px-2 py-0.5 bg-[#eceef0] text-[#002045] rounded font-bold text-[9px] uppercase tracking-wide">
                  {selectedCourse.code}
                </span>
                <h2 className="font-sora text-2xl font-bold text-[#002045] mt-1">
                  {selectedCourse.name}
                </h2>
                <p className="text-xs text-[#74777f] mt-0.5">{selectedCourse.semester}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-full hover:bg-[#eceef0] transition-colors border-none cursor-pointer text-[#74777f] hover:text-[#002045] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Course Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c4c6cf]">
                  <p className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">Schedule</p>
                  <p className="text-sm font-semibold text-[#002045] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-[#006b5f]">schedule</span>
                    {selectedCourse.schedule || "Not Scheduled"}
                  </p>
                </div>

                <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c4c6cf] md:col-span-2">
                  <p className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">Teacher Profile</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#006b5f]/15 flex items-center justify-center text-[#006b5f]">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#002045]">{selectedCourse.teacherName || "Instructor"}</p>
                      <p className="text-xs text-[#74777f]">{selectedCourse.teacherEmail || "contact@university.edu"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-sora text-sm font-bold text-[#002045] mb-2">About Course</h3>
                <p className="text-xs text-[#43474e] leading-relaxed bg-[#f8faec]/20 p-4 rounded-xl border border-[#c4c6cf]/40 italic">
                  {selectedCourse.description || "No description provided for this course module."}
                </p>
              </div>

              {/* Syllabus File Download */}
              {selectedCourse.syllabusFile && (
                <div className="flex items-center justify-between p-4 bg-[#f0faf8] border border-[#3cddc7]/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006b5f] text-2xl">picture_as_pdf</span>
                    <div>
                      <p className="text-xs font-bold text-[#002045]">{selectedCourse.syllabusOriginalName || "Course Syllabus"}</p>
                      <p className="text-[10px] text-[#74777f]">Official Curriculum Document</p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000${selectedCourse.syllabusFile}`}
                    download={selectedCourse.syllabusOriginalName || "syllabus"}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006b5f] hover:bg-[#005047] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download Syllabus
                  </a>
                </div>
              )}

              {/* Assignments Section */}
              <div>
                <h3 className="font-sora text-sm font-bold text-[#002045] mb-4">Course Assignments</h3>
                
                {loadingAssignments ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <div className="w-5 h-5 border-2 border-[#006b5f] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-[#74777f]">Loading course assignments...</p>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-8 bg-[#eceef0]/30 rounded-xl border border-dashed border-[#c4c6cf]">
                    <span className="material-symbols-outlined text-[32px] text-[#74777f]">assignment_late</span>
                    <p className="text-xs text-[#74777f] mt-2">No assignments posted for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const sub = submissionsMap[assignment.id];
                      const isSubmitted = !!sub;
                      const isGraded = sub?.status === 'graded';
                      
                      return (
                        <div key={assignment.id} className="border border-[#c4c6cf] rounded-xl overflow-hidden bg-white hover:border-[#006b5f]/50 transition-all">
                          
                          {/* Assignment Main Info */}
                          <div className="p-4 bg-[#f2f4f6]/40 flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-[#002045] truncate">{assignment.title}</h4>
                              <p className="text-[11px] text-[#74777f] mt-1">{assignment.description || "No description provided."}</p>
                              <div className="flex gap-4 mt-2.5">
                                <span className="text-[10px] text-[#74777f] font-semibold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">calendar_month</span>
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] text-[#74777f] font-semibold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">grade</span>
                                  Points: {assignment.totalPoints}
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0">
                              {isGraded ? (
                                <span className="px-2.5 py-1 bg-[#d1fae5] text-[#006b5f] rounded-full font-bold text-[9px] tracking-wide uppercase flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">verified</span>
                                  Graded: {sub.grade}/{assignment.totalPoints}
                                </span>
                              ) : isSubmitted ? (
                                <span className="px-2.5 py-1 bg-[#fff3e0] text-[#e65100] rounded-full font-bold text-[9px] tracking-wide uppercase flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px] animate-pulse">pending</span>
                                  Submitted
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-[#eceef0] text-[#74777f] rounded-full font-bold text-[9px] tracking-wide uppercase flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                                  Not Submitted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Submission Action details */}
                          <div className="p-4 border-t border-[#c4c6cf]/60 bg-white">
                            {isGraded ? (
                              <div className="bg-[#f0faf8] p-3.5 rounded-lg border border-[#3cddc7]/30 space-y-2">
                                <p className="text-[10px] font-bold text-[#006b5f] uppercase tracking-wider">Teacher Feedback</p>
                                <p className="text-xs text-[#003d37] font-medium italic">"{sub.feedback || 'Great work!'}"</p>
                                <p className="text-[10px] text-[#74777f]">Graded on: {new Date(sub.gradedAt).toLocaleString()}</p>
                              </div>
                            ) : isSubmitted ? (
                              <div className="bg-[#f7f9fb] p-3 rounded-lg border border-[#c4c6cf]/40 space-y-1.5">
                                <p className="text-[10px] font-bold text-[#43474e] uppercase tracking-wider">Your Submission</p>
                                <p className="text-xs text-[#43474e]">{sub.content}</p>
                                <p className="text-[9px] text-[#74777f]">Submitted on: {new Date(sub.createdAt).toLocaleString()}</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-[#43474e] uppercase tracking-wider mb-1.5">Submission Content</label>
                                  <textarea
                                    rows={3}
                                    placeholder="Enter your response, essay, or link to work here..."
                                    value={submissionContent}
                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                    className="w-full bg-white border border-[#c4c6cf] rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#006b5f] focus:border-[#006b5f] transition-all"
                                  />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] text-[16px]">attach_file</span>
                                    <input
                                      type="text"
                                      placeholder="Simulate attachment name (e.g. project_draft.pdf)"
                                      value={submissionFile}
                                      onChange={(e) => setSubmissionFile(e.target.value)}
                                      className="w-full bg-white border border-[#c4c6cf] rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#006b5f] focus:border-[#006b5f] transition-all"
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleSubmitSubmission(assignment.id)}
                                    disabled={submittingId === assignment.id}
                                    className="px-5 py-2 bg-[#006b5f] hover:bg-[#005047] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
                                  >
                                    {submittingId === assignment.id ? "Submitting..." : "Submit Work"}
                                  </button>
                                </div>

                                {submissionMsg && (
                                  <p className={`text-xs font-semibold ${submissionMsg.type === 'success' ? 'text-[#006b5f]' : 'text-[#ba1a1a]'}`}>
                                    {submissionMsg.text}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e0e3e5] bg-[#f2f4f6]/50 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 border border-[#c4c6cf] text-[#43474e] hover:bg-[#eceef0] rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer bg-white"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}