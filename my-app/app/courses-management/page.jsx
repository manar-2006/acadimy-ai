"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// courses-management redirects to course-management to avoid duplicate content
export default function CoursesManagementRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/teacher/course-management");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <p className="text-[#43474e]">Redirecting to Course Management...</p>
    </div>
  );
}