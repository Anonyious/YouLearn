"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import EditCourse from "./EditCourse";
import ShareCourseModal from "./ShareCourse";
import DashboardStats from "./DashboardStats";

type Course = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  totalVideos: number;
  completedLessons: number;
  percentage: number;
  type: "created" | "saved";
  shareId: string;
  source: "youtube" | "custom";
  playlistId?: string;
  authorId: string;
  tags?: string[];
};

type FilterType = "all" | "created" | "saved";

export default function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");  // ← add here
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/course/getAllCourse");
        const data = await res.json();
        console.log("API RESPONSE:", data);
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleUpdateCourse = (updated: Course) => {
  setCourses((prev) =>
    prev.map((c) =>
      c.id === updated.id
        ? { 
            ...c,          // keep old values (like percentage)
            ...updated,    // override only updated fields
          }
        : c
    )
  );
};


  // const handleCreateCourse = (newCourse: Course) => {
  //   setCourses((prev) => [newCourse, ...prev]);
  // }

  // Context API

  const handleDeleteCourse = async (courseId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmed) return;

    const prevCourses = courses;
    setCourses((c) => c.filter((course) => course.id !== courseId));

    try {
      const res = await fetch(`/api/course/deleteCourse?courseId=${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      toast.success("The course has been removed successfully.");
    } catch (error) {
      setCourses(prevCourses);

      toast.error("Something went wrong while deleting the course.");
    }
  };

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (filter !== "all") result = result.filter((c) => c.type === filter);
    if (search.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [courses, filter, search]);

  return (
    <>
      <div className="mt-8 space-y-8">

      {!loading && courses.length > 0 && <DashboardStats courses={courses} />}
      {!loading && <ContinueLearning courses={courses} />}
        {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
    Your Courses
  </h2>

  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    {/* SEARCH */}
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search courses..."
      className="px-4 py-1.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
    />

    {/* FILTERS */}
    <div className="flex gap-2 justify-evenly bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
      <FilterButton label="All" active={filter === "all"} onClick={() => setFilter("all")} />
      <FilterButton label="Created" active={filter === "created"} onClick={() => setFilter("created")} />
      <FilterButton label="Saved" active={filter === "saved"} onClick={() => setFilter("saved")} />
    </div>
  </div>
</div>

        {/* COURSES */}
        {loading ? (
          <CourseSkeleton />
        ) : filteredCourses.length === 0 ? (
          <EmptyState text={search ? `No courses found for "${search}"` : "No courses found. Create a course"}
          />
        ) : (
          <CourseGrid
            courses={filteredCourses}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onDelete={handleDeleteCourse}
            setOpen={setOpen}
            setSelectedCourse={setSelectedCourse}
            setShareOpen={setShareOpen}
          />
        )}
      </div>
      <EditCourse
        course={selectedCourse as Course}
        isOpen={open}
        onClose={() => setOpen(false)}
        onUpdated={(updatedCourse) => {
          handleUpdateCourse(updatedCourse);
          setOpen(false);
        }}
      />
      <ShareCourseModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        shareId={selectedCourse?.shareId || ""}
      />
    </>
  );
}

function CourseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-zinc-200 dark:bg-zinc-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm transition ${
        active
          ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow"
          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function CourseGrid({
  courses,
  openMenuId,
  setOpenMenuId,
  onDelete,
  setOpen,
  setSelectedCourse,
  setShareOpen,
}: {
  courses: Course[];
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onDelete: (courseId: string) => void;
  setOpen: (open: boolean) => void;
  setSelectedCourse: (course: Course | undefined) => void;
  setShareOpen: (open: boolean) => void;
}) {
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // Close menu if click is outside any menu
      const isClickOnMenu = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(e.target as Node)
      );
      
      if (!isClickOnMenu) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenMenuId]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/course/${course.shareId}`}
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 hover:shadow-lg transition"
        >
          <div className="relative h-45 bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-xl">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400">
                No Thumbnail
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2">
                {course.title}
              </h3>

              <div className="relative" ref={(el) => {
                if (el) menuRefs.current[course.id] = el;
              }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenuId(openMenuId === course.id ? null : course.id);
                  }}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span className="block w-1 h-1 bg-zinc-500 rounded-full mb-0.5" />
                  <span className="block w-1 h-1 bg-zinc-500 rounded-full mb-0.5" />
                  <span className="block w-1 h-1 bg-zinc-500 rounded-full" />
                </button>

                {openMenuId === course.id && (
                  <div
                    className="absolute right-0 mt-2 w-32 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg z-20"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenMenuId(null);
                        setSelectedCourse(course);
                        setOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(null);
                        onDelete(course.id);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(null);
                        setSelectedCourse(course);
                        setShareOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>

            {course.description ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {course.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                No desc..
              </p>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {course.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] text-zinc-400">
                    +{course.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

<div className="pt-2 space-y-2">
  <div className="flex justify-between items-center text-sm text-zinc-500">
    <span>{course.completedLessons}/{course.totalVideos} lessons</span>
    <span className="text-indigo-500 group-hover:underline text-sm">
      Open →
    </span>
  </div>
  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
    <div
      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
      style={{ width: `${course.percentage}%` }}
    />
  </div>
  <div className="flex justify-between items-center">
    <span className="text-xs text-zinc-400">
      {course.percentage === 100
        ? "Completed"
        : course.percentage === 0
        ? "Not started"
        : "In progress"}
    </span>
    <span className="text-xs text-zinc-400">{course.percentage}%</span>
  </div>
</div>

          </div>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  const isSearch = text.startsWith("No courses found for");
  return (
    <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center">
      <div className="text-4xl mb-4">{isSearch ? "🔍" : "📚"}</div>
      <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-2">{text}</p>
      {!isSearch && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Paste a YouTube playlist URL to get started in seconds.
        </p>
      )}
    </div>
  );
}

function ContinueLearning({ courses }: { courses: Course[] }) {
  const inProgress = courses
    .filter((c) => c.percentage > 0 && c.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage)[0];

  if (!inProgress) return null;

  return (
    <div className="mb-8 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950">
      <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide mb-2">
        Continue where you left off
      </p>
      <Link
        href={`/course/${inProgress.shareId}`}
        className="flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {inProgress.thumbnail && (
            <div className="relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={inProgress.thumbnail}
                alt={inProgress.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-white text-sm line-clamp-1">
              {inProgress.title}
            </p>
            <p className="text-xs text-zinc-500">
              {inProgress.completedLessons}/{inProgress.totalVideos} lessons · {inProgress.percentage}%
            </p>
          </div>
        </div>
        <span className="text-indigo-500 text-sm group-hover:underline flex-shrink-0">
          Resume →
        </span>
      </Link>
      <div className="mt-3 w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${inProgress.percentage}%` }}
        />
      </div>
    </div>
  );
}