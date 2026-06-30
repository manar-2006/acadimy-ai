"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar2";
import Navbar from "@/components/Navbar";

export default function InstructorCourseManagement() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isInsightVisible, setIsInsightVisible] = useState(true);
  const [activeBtn, setActiveBtn] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null); // { title, message, type }
  
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    description: "",
    schedule: "",
    semester: "Spring 2026",
    color: "#002045",
  });
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Assignments management states
  const [selectedCourseForAssignments, setSelectedCourseForAssignments] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalPoints: 100
  });
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  const handleOpenAssignments = async (course) => {
    setSelectedCourseForAssignments(course);
    setLoadingAssignments(true);
    setActiveAssignment(null);
    setSubmissions([]);
    setShowCreateAssignmentForm(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/courses/${course.id}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAssignments(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title) return alert("Assignment title is required.");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/courses/${selectedCourseForAssignments.id}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAssignment)
      });
      if (res.ok) {
        setNewAssignment({ title: "", description: "", dueDate: new Date().toISOString().split('T')[0], totalPoints: 100 });
        setShowCreateAssignmentForm(false);
        showToast("Success", "Assignment created successfully!", "success");
        // Reload assignments list
        const resList = await fetch(`http://localhost:5000/api/courses/${selectedCourseForAssignments.id}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resList.ok) setAssignments(await resList.json());
      } else {
        alert("Failed to create assignment.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    setActiveAssignment(assignment);
    setLoadingSubmissions(true);
    setGradingSubmissionId(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/courses/${selectedCourseForAssignments.id}/assignments/${assignment.id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSubmissions(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const startGrading = (submission) => {
    setGradingSubmissionId(submission.id);
    setGradeValue(submission.grade !== undefined ? String(submission.grade) : "");
    setFeedbackValue(submission.feedback || "");
  };

  const handleGradeSubmission = async (e, submissionId) => {
    e.preventDefault();
    if (gradeValue === "") return alert("Please enter a grade score.");
    setIsSubmittingGrade(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/courses/${selectedCourseForAssignments.id}/assignments/${activeAssignment.id}/submissions/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          grade: Number(gradeValue),
          feedback: feedbackValue
        })
      });
      if (res.ok) {
        setGradingSubmissionId(null);
        showToast("Graded", "Submission graded successfully!", "success");
        // Re-load submissions list
        const resSub = await fetch(`http://localhost:5000/api/courses/${selectedCourseForAssignments.id}/assignments/${activeAssignment.id}/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resSub.ok) setSubmissions(await resSub.json());
      } else {
        alert("Failed to grade submission.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTimer = setTimeout(() => {
      loadCourses();
    }, 0);
    const timer = setTimeout(() => setAnimateProgress(true), 150);
    return () => {
      clearTimeout(fetchTimer);
      clearTimeout(timer);
    };
  }, []);

  const resetModal = () => {
    setNewCourse({ name: "", code: "", description: "", schedule: "", semester: "Spring 2026", color: "#002045" });
    setSyllabusFile(null);
    setShowCreateModal(false);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|ppt|pptx)$/i)) {
      alert('Only PDF, Word (.doc/.docx), and PowerPoint (.ppt/.pptx) files are accepted.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) { alert('File must be under 20 MB.'); return; }
    setSyllabusFile(file);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code) {
      alert("Course name and code are required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(newCourse).forEach(([k, v]) => formData.append(k, v));
      if (syllabusFile) formData.append('syllabus', syllabusFile);

      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        resetModal();
        loadCourses();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create course");
      }
    } catch (err) {
      console.error("Create course error:", err);
    }
  };

  const getScaleClass = (id) =>
    activeBtn === id ? "scale-[0.95] transition-transform duration-100" : "scale-100 transition-transform duration-100";

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#191c1e] font-['Inter'] antialiased overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
      
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Navbar setMobileNavOpen={setMobileNavOpen} title="Courses" />

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#002045] via-[#003366] to-[#006b5f] px-8 md:px-12 pt-28 pb-10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)` }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background:"radial-gradient(circle,#62fae3,transparent 70%)" }} />
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 max-w-[1280px] mx-auto">
            <div>
              <p className="text-[#62fae3] text-[11px] font-bold tracking-widest uppercase mb-2">Curriculum Manager</p>
              <h1 className="text-white font-['Sora'] text-3xl md:text-4xl font-bold mb-2">Course Management</h1>
              <p className="text-[#d6e3ff] text-[14px] max-w-lg">Manage your curriculum, track student engagement, and leverage AI to enhance teaching materials.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              onMouseDown={() => setActiveBtn('create-course')}
              onMouseUp={() => setActiveBtn(null)}
              onMouseLeave={() => setActiveBtn(null)}
              className={`flex items-center gap-2 px-6 py-3 bg-[#62fae3] text-[#007165] rounded-xl font-['Inter'] text-[13px] font-bold hover:bg-white transition-all shadow-lg shrink-0 ${getScaleClass('create-course')}`}
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Create New Course
            </button>
          </div>
        </div>

        <main className="px-6 md:px-8 pb-12 max-w-[1280px] mx-auto w-full -mt-5">

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {loading ? (
              <div className="col-span-full py-16 text-center text-[#43474e] font-medium">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-xl border border-[#c4c6cf]">
                <span className="material-symbols-outlined text-[48px] text-[#c4c6cf]">menu_book</span>
                <p className="text-[#43474e] mt-3 font-medium">No courses published yet.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="bg-[#ffffff] border border-[#c4c6cf] rounded-xl p-[24px] flex flex-col hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  <div className="mb-6">
                    <div className="text-[#006b5f] font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      {course.semester || "Spring 2026"}
                    </div>
                    <h3 className="font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045]">{course.code}: {course.name}</h3>
                    {course.description && (
                      <p className="font-['Inter'] text-[13px] text-[#43474e] mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#f2f4f6] p-3 rounded-lg">
                      <p className="font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] text-[#43474e] mb-1 uppercase">Students</p>
                      <div className="flex items-center gap-2">
                        <span className="font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045]">{course.students || 0}</span>
                      </div>
                    </div>
                    <div className="bg-[#f2f4f6] p-3 rounded-lg">
                      <p className="font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] text-[#43474e] mb-1 uppercase">Completion</p>
                      <div className="flex items-center gap-2">
                        <span className="font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045]">{course.completion || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] text-[#43474e]">Syllabus Progress</span>
                      <span className="font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] text-[#002045]">{course.completion || 0}%</span>
                    </div>
                    <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ width: animateProgress ? `${course.completion || 0}%` : '0%', backgroundColor: course.color || '#006b5f' }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleOpenAssignments(course)}
                        className="flex-1 min-w-[65px] border border-[#c4c6cf] text-[#191c1e] hover:bg-[#e6e8ea] py-2 rounded-lg font-['Inter'] text-[11px] font-semibold leading-[16px] tracking-[0.03em] transition-colors flex items-center justify-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">assignment</span>
                        Task
                      </button>
                      <button
                        onClick={() => router.push(`/teacher/student-analytics`)}
                        className="flex-1 min-w-[65px] border border-[#c4c6cf] text-[#191c1e] hover:bg-[#e6e8ea] py-2 rounded-lg font-['Inter'] text-[11px] font-semibold leading-[16px] tracking-[0.03em] transition-colors flex items-center justify-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                        Stats
                      </button>
                      {/* Download syllabus */}
                      {course.syllabusFile ? (
                        <a
                          href={`http://localhost:5000${course.syllabusFile}`}
                          download={course.syllabusOriginalName || 'syllabus'}
                          title={`Download: ${course.syllabusOriginalName || 'Syllabus'}`}
                          className="flex-1 min-w-[65px] flex items-center justify-center gap-0.5 px-1 py-2 rounded-lg font-['Inter'] text-[11px] font-semibold leading-[16px] tracking-[0.03em] border border-[#3cddc7] text-[#006b5f] bg-[#f0faf8] hover:bg-[#62fae3] transition-colors whitespace-nowrap"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          Syllabus
                        </a>
                      ) : (
                        <button
                          onClick={() => showToast('📄 No Syllabus', `No syllabus file uploaded for ${course.code || course.name} yet.`, 'info')}
                          className="flex-1 min-w-[65px] flex items-center justify-center gap-0.5 px-1 py-2 rounded-lg font-['Inter'] text-[11px] font-semibold leading-[16px] tracking-[0.03em] border border-[#c4c6cf] text-[#9ea3a8] bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-colors whitespace-nowrap"
                          title="No syllabus uploaded"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          Syllabus
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        showToast(
                          '✨ AI Quiz Ready',
                          `Flashcards & diagnostics initialized for ${course.code || course.name}. Redirecting to AI assistant…`,
                          'success'
                        );
                        setTimeout(() => router.push('/teacher/ask-ai'), 1800);
                      }}
                      className="w-full bg-white/70 backdrop-blur-[12px] border border-slate-200/80 shadow-[0_0_20px_rgba(60,221,199,0.15)] border-[#3cddc7]/30 text-[#002045] py-3 rounded-lg font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] flex items-center justify-center gap-2 hover:bg-[#62fae3] transition-all group"
                    >
                      <span className="material-symbols-outlined text-[#006b5f] group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      Generate AI Quiz
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Create course dashed cell */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="bg-[#eceef0] border-2 border-dashed border-[#c4c6cf] rounded-xl p-[24px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-[#e6e8ea] transition-colors min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-full bg-[#ffffff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined text-[#002045] text-[32px]">add_circle</span>
              </div>
              <h3 className="font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045] mb-2">Add New Curriculum</h3>
              <p className="font-['Inter'] text-[14px] leading-[22px] text-[#43474e] px-8 mb-6">Launch a new course module or import existing materials from your university LMS.</p>
              <div className="px-4 py-2 bg-[#002045] text-[#ffffff] rounded-lg font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em]">Start Building</div>
            </div>
          </div>

          {/* AI insights banner */}
          {isInsightVisible && (
            <section className="mt-[48px] bg-white/70 backdrop-blur-[12px] border border-slate-200/80 shadow-[0_0_20px_rgba(60,221,199,0.15)] border-[#3cddc7]/30 rounded-xl p-[24px] flex flex-col sm:flex-row items-center gap-[24px] transition-all duration-300">
              <div className="h-20 w-20 rounded-full bg-[#62fae3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#007165] text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-['Sora'] text-[20px] font-semibold leading-[28px] text-[#002045] mb-1">ScholarSync AI Insights</h4>
                <p className="font-['Inter'] text-[16px] leading-[26px] text-[#43474e]">
                  Your course <span className="font-bold text-[#002045]">CS-402</span> has a 15% drop in student participation this week. Would you like me to generate a review session based on common questions from the forum?
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => router.push(`/teacher/ask-ai`)}
                  className="bg-[#002045] text-[#ffffff] px-6 py-2 rounded-lg font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Review Suggestions
                </button>
                <button
                  onClick={() => setIsInsightVisible(false)}
                  className="text-[#43474e] font-['Inter'] text-[12px] font-semibold leading-[16px] tracking-[0.05em] hover:text-[#002045] py-2 underline underline-offset-4 whitespace-nowrap"
                >
                  Dismiss for now
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 9999,
          transform: toast ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          opacity: toast ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: toast ? 'auto' : 'none',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #002045 0%, #006b5f 100%)',
          borderRadius: '16px',
          padding: '16px 20px',
          minWidth: '300px',
          maxWidth: '380px',
          boxShadow: '0 8px 32px rgba(0,32,69,0.25), 0 0 0 1px rgba(60,221,199,0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(98,250,227,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ color: '#62fae3', fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#62fae3', fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
              {toast?.title}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.5' }}>
              {toast?.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#c4c6cf] overflow-hidden shadow-2xl p-6 relative">
            <h3 className="font-sora text-xl font-bold text-[#002045] mb-4">Create New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Course Code</label>
                <input
                  placeholder="e.g. CS-402"
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Course Name</label>
                <input
                  placeholder="e.g. Operating Systems"
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Brief description of goals and curriculum..."
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none resize-none"
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Schedule</label>
                <input
                  placeholder="e.g. Mon / Wed 10:00–11:30"
                  className="w-full bg-[#f2f4f6] border border-[#c4c6cf] rounded-lg px-3 py-2 text-sm focus:border-[#006b5f] outline-none"
                  value={newCourse.schedule}
                  onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Theme Color</label>
                <div className="flex gap-2 mt-1">
                  {["#002045", "#006b5f", "#3cddc7", "#09007b", "#ba1a1a"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCourse({ ...newCourse, color: c })}
                      className="w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center"
                      style={{
                        backgroundColor: c,
                        borderColor: newCourse.color === c ? "#191c1e" : "transparent"
                      }}
                    >
                      {newCourse.color === c && (
                        <span className="material-symbols-outlined text-white text-xs">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Syllabus Upload */}
              <div>
                <label className="block text-[11px] font-bold text-[#43474e] uppercase tracking-wider mb-1">Syllabus / Course Material <span className="text-[#9ea3a8] font-normal normal-case">(optional — PDF, Word, PPT · max 20 MB)</span></label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#006b5f] bg-[#e8f5f3]'
                      : syllabusFile
                      ? 'border-[#006b5f] bg-[#f0faf8]'
                      : 'border-[#c4c6cf] bg-[#f2f4f6] hover:border-[#006b5f] hover:bg-[#eaf6f4]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  {syllabusFile ? (
                    <>
                      <span className="material-symbols-outlined text-[28px] text-[#006b5f]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-[#002045] truncate max-w-[240px]">{syllabusFile.name}</p>
                        <p className="text-[11px] text-[#43474e]">{(syllabusFile.size / 1024).toFixed(0)} KB · Click to replace</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSyllabusFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="absolute top-2 right-2 text-[#ba1a1a] hover:bg-red-50 rounded-full p-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[28px] text-[#9ea3a8]">upload_file</span>
                      <p className="text-[13px] text-[#43474e]">Drag & drop or <span className="text-[#006b5f] font-semibold">browse</span></p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002045] text-white rounded-lg text-sm font-semibold hover:bg-[#1a365d] transition-colors"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Assignment Management Modal */}
      {selectedCourseForAssignments && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#c4c6cf] max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl fade-in" style={{ animation: "fadeIn 0.3s ease-out" }}>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-start" style={{ borderTop: `6px solid ${selectedCourseForAssignments.color || '#006b5f'}` }}>
              <div>
                <span className="px-2 py-0.5 bg-[#f0faf8] text-[#006b5f] rounded font-bold text-[9px] uppercase tracking-wide">
                  {selectedCourseForAssignments.code} · Curriculum Tasks
                </span>
                <h2 className="font-sora text-2xl font-bold text-[#002045] mt-1">
                  Manage Assignments: {selectedCourseForAssignments.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourseForAssignments(null)}
                className="p-1 rounded-full hover:bg-[#eceef0] transition-colors border-none cursor-pointer text-[#74777f] hover:text-[#002045] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content Split View */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Assignment List */}
              <div className="w-80 border-r border-[#e0e3e5] flex flex-col bg-[#f8faec]/5">
                <div className="p-4 border-b border-[#e0e3e5] shrink-0">
                  <button
                    onClick={() => {
                      setShowCreateAssignmentForm(true);
                      setActiveAssignment(null);
                    }}
                    className="w-full py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer border-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    New Assignment
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#74777f] px-2 mb-2">Active Assignments</h3>
                  
                  {loadingAssignments ? (
                    <div className="text-center py-6 text-xs text-[#74777f]">Loading...</div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#74777f] italic">No assignments yet.</div>
                  ) : (
                    assignments.map((a) => {
                      const isActive = activeAssignment?.id === a.id;
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            setShowCreateAssignmentForm(false);
                            handleViewSubmissions(a);
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#002045]/10 border-[#002045] text-[#002045]'
                              : 'bg-white border-[#c4c6cf]/60 hover:bg-[#eceef0]/30 text-[#43474e]'
                          }`}
                        >
                          <h4 className="text-xs font-bold truncate">{a.title}</h4>
                          <div className="flex items-center justify-between text-[9px] mt-2 opacity-80">
                            <span>Points: {a.totalPoints}</span>
                            <span>{a.submissions || 0} Submissions</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Detail Panel */}
              <div className="flex-grow flex flex-col bg-[#fcfdfe] overflow-y-auto p-6">
                
                {/* 1. Create Assignment Form */}
                {showCreateAssignmentForm && (
                  <form onSubmit={handleCreateAssignment} className="space-y-4 max-w-lg">
                    <h3 className="font-sora text-lg font-bold text-[#002045] mb-4">Create New Assignment</h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-[#43474e] uppercase tracking-wider mb-2">Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lab 4: Building a Responsive Layout"
                        value={newAssignment.title}
                        onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                        className="w-full bg-white border border-[#c4c6cf] rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#006b5f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#43474e] uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        rows={4}
                        placeholder="Provide detailed instructions for the assignment..."
                        value={newAssignment.description}
                        onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                        className="w-full bg-white border border-[#c4c6cf] rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#006b5f]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#43474e] uppercase tracking-wider mb-2">Due Date</label>
                        <input
                          type="date"
                          required
                          value={newAssignment.dueDate}
                          onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                          className="w-full bg-white border border-[#c4c6cf] rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#006b5f]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#43474e] uppercase tracking-wider mb-2">Total Points</label>
                        <input
                          type="number"
                          required
                          value={newAssignment.totalPoints}
                          onChange={e => setNewAssignment({ ...newAssignment, totalPoints: Number(e.target.value) })}
                          className="w-full bg-white border border-[#c4c6cf] rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#006b5f]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#006b5f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#005047] cursor-pointer border-none"
                      >
                        Publish Assignment
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateAssignmentForm(false)}
                        className="px-6 py-2.5 border border-[#c4c6cf] rounded-xl text-xs font-bold uppercase tracking-wider text-[#43474e] hover:bg-[#eceef0] cursor-pointer bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. Submissions list for selected assignment */}
                {activeAssignment && !showCreateAssignmentForm && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-[#e0e3e5] flex justify-between items-start">
                      <div>
                        <h3 className="font-sora text-xl font-bold text-[#002045]">{activeAssignment.title}</h3>
                        <p className="text-xs text-[#74777f] mt-1">{activeAssignment.description}</p>
                        <div className="flex gap-4 mt-3 text-[10px] text-[#43474e] font-semibold">
                          <span>Points: {activeAssignment.totalPoints}</span>
                          <span>Due: {new Date(activeAssignment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-sora text-sm font-bold text-[#002045] mb-4">Student Submissions</h4>
                      
                      {loadingSubmissions ? (
                        <div className="text-center py-8 text-xs text-[#74777f]">Loading submissions...</div>
                      ) : submissions.length === 0 ? (
                        <div className="text-center py-10 bg-[#f2f4f6]/50 rounded-2xl border border-dashed border-[#c4c6cf]">
                          <span className="material-symbols-outlined text-[32px] text-[#74777f]">inbox</span>
                          <p className="text-xs text-[#74777f] mt-2">No submissions received for this task yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {submissions.map((sub) => {
                            const isGradingThis = gradingSubmissionId === sub.id;
                            
                            return (
                              <div key={sub.id} className="border border-[#c4c6cf] rounded-xl bg-white p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="text-xs font-bold text-[#002045]">{sub.studentName}</h5>
                                    <p className="text-[10px] text-[#74777f]">{sub.studentEmail}</p>
                                  </div>
                                  <div>
                                    {sub.status === 'graded' ? (
                                      <span className="px-2.5 py-1 bg-[#d1fae5] text-[#006b5f] rounded-full font-bold text-[9px] uppercase tracking-wider">
                                        Graded: {sub.grade}/{activeAssignment.totalPoints}
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 bg-[#fff3e0] text-[#e65100] rounded-full font-bold text-[9px] uppercase tracking-wider animate-pulse">
                                        Pending Grade
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-[#f7f9fb] p-3 rounded-lg border border-[#c4c6cf]/40">
                                  <p className="text-xs text-[#43474e] whitespace-pre-wrap leading-relaxed">{sub.content}</p>
                                  <p className="text-[9px] text-[#74777f] mt-2">Submitted: {new Date(sub.createdAt).toLocaleString()}</p>
                                </div>

                                {isGradingThis ? (
                                  <form onSubmit={(e) => handleGradeSubmission(e, sub.id)} className="bg-[#f0faf8] p-4 rounded-xl border border-[#3cddc7]/30 space-y-3">
                                    <h6 className="text-[10px] font-bold text-[#006b5f] uppercase tracking-wider">Grade and Feedback</h6>
                                    <div className="flex gap-4">
                                      <div className="w-28 shrink-0">
                                        <label className="block text-[9px] text-[#43474e] font-semibold mb-1">Score (Points)</label>
                                        <input
                                          type="number"
                                          required
                                          min={0}
                                          max={activeAssignment.totalPoints}
                                          value={gradeValue}
                                          onChange={e => setGradeValue(e.target.value)}
                                          className="w-full bg-white border border-[#c4c6cf] rounded-lg px-3 py-1.5 text-xs outline-none"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block text-[9px] text-[#43474e] font-semibold mb-1">Feedback Comments</label>
                                        <input
                                          type="text"
                                          placeholder="Great explanation! Next time, include more detailed diagrams."
                                          value={feedbackValue}
                                          onChange={e => setFeedbackValue(e.target.value)}
                                          className="w-full bg-white border border-[#c4c6cf] rounded-lg px-3 py-1.5 text-xs outline-none"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                      <button
                                        type="submit"
                                        disabled={isSubmittingGrade}
                                        className="px-4 py-1.5 bg-[#006b5f] hover:bg-[#005047] disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer border-none"
                                      >
                                        {isSubmittingGrade ? "Saving..." : "Save Grade"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setGradingSubmissionId(null)}
                                        className="px-4 py-1.5 border border-[#c4c6cf] text-[#43474e] hover:bg-[#eceef0] rounded-lg font-bold text-[10px] uppercase tracking-wider bg-white cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <div className="flex justify-between items-center gap-4">
                                    {sub.status === 'graded' && (
                                      <p className="text-[11px] text-[#006b5f] italic shrink-1">
                                        <strong>Feedback:</strong> "{sub.feedback || 'Good submission.'}"
                                      </p>
                                    )}
                                    <button
                                      onClick={() => startGrading(sub)}
                                      className="ml-auto px-4 py-1.5 bg-white border border-[#006b5f] text-[#006b5f] hover:bg-[#006b5f] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                                    >
                                      {sub.status === 'graded' ? "Update Grade" : "Grade Work"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Empty State (No assignment selected and form closed) */}
                {!activeAssignment && !showCreateAssignmentForm && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-16 h-16 bg-[#002045]/5 rounded-full flex items-center justify-center text-[#002045]">
                      <span className="material-symbols-outlined text-[32px]">assignment</span>
                    </div>
                    <h3 className="font-sora text-lg font-bold text-[#002045]">No task selected</h3>
                    <p className="text-xs text-[#74777f] max-w-sm">Select an assignment from the left side panel to review submissions and enter grades, or publish a new one.</p>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e0e3e5] bg-[#f2f4f6]/50 flex justify-end">
              <button
                onClick={() => setSelectedCourseForAssignments(null)}
                className="px-5 py-2.5 border border-[#c4c6cf] text-[#43474e] hover:bg-[#eceef0] rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer bg-white"
              >
                Close Portal
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}