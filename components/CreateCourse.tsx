"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

  

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"youtube" | "custom">("youtube");
  const [playListLink, setplayListLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setplayListLink("");
    setSource("youtube");
    setVideoLinks([""]);
    setTags([]);
    setTagInput("");
  };

  const extractPlaylistId = (url: string) => {
    if (url.includes("list=")) {
      return url.split("list=")[1].split("&")[0];
    }
    return url;
  };

  const updateVideoLink = (index: number, value: string) => {
    const updated = [...videoLinks];
    updated[index] = value;
    setVideoLinks(updated);

    // auto-add new empty field if last is filled
    if (index === videoLinks.length - 1 && value.trim() !== "") {
      setVideoLinks([...updated, ""]);
    }
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    if (source === "youtube" && !playListLink.trim()) {
      toast.error("Please enter a YouTube playlist URL.");
      return;
    }

    try {
      setLoading(true);

      const playlistId =
        source === "youtube" ? extractPlaylistId(playListLink) : null;

      console.log("Datas:", playListLink, playlistId);

      const res = await fetch("/api/course/createCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          source,
          playlistId,
          tags,
          links: source === "custom"
            ? videoLinks.filter((link) => link.trim() !== "")
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Course created 🎉");

      resetForm();
      onCreated?.();
      onClose();
    } catch (error: unknown) {
      toast.error("Unexpected error occurred");
      console.error("Create course error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[95%] max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Create New Course
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Organize your learning into a distraction-free course
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm text-zinc-500">Course Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Web3 Mastery"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-zinc-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this course about?"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-zinc-500">Tags</label>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-red-500 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                    }
                    setTagInput("");
                  }
                }}
                placeholder="e.g. React, DSA, Beginner (press Enter)"
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="text-sm text-zinc-500">Course Type</label>
            <div className="flex gap-2 mt-2">
              {["youtube", "custom"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSource(type as "youtube" | "custom")}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    source === type
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {type === "youtube" ? "YouTube Playlist" : "Custom Course"}
                </button>
              ))}
            </div>
          </div>

          {/* Playlist */}
          {source === "youtube" && (
            <div>
              <label className="text-sm text-zinc-500">
                YouTube Playlist URL
              </label>
              <input
                value={playListLink}
                onChange={(e) => setplayListLink(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PLxxxxxx......"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          )}

          {/* Custom Course Videos */}
          {source === "custom" && (
            <div className="space-y-3">
              <label className="text-sm text-zinc-500">Video Links</label>

              <div className="space-y-2 mt-2">
                {videoLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={link}
                      onChange={(e) => updateVideoLink(index, e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-4 py-2 rounded-lg
                       bg-zinc-100 dark:bg-zinc-800
                       border border-zinc-200 dark:border-zinc-700
                       focus:ring-2 focus:ring-indigo-500
                       transition"
                    />

                    {/* Remove button */}
                    {videoLinks.length > 1 && (
                      <button
                        onClick={() => removeVideoLink(index)}
                        className="p-2 rounded-lg
                         text-zinc-400 hover:text-red-500
                         hover:bg-zinc-100 dark:hover:bg-zinc-800
                         transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
}
