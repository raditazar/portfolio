"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    imageSrc: "",
    imageAlt: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    isFeatured: false,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          techStack: form.techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <FormField label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="admin-input"
            placeholder="My Awesome Project"
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="admin-input"
            placeholder="Brief description of the project..."
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="admin-input"
              placeholder="Web App"
            />
          </FormField>

          <FormField label="Order">
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: parseInt(e.target.value) || 0 })
              }
              className="admin-input"
            />
          </FormField>
        </div>

        <FormField label="Image URL">
          <input
            type="text"
            value={form.imageSrc}
            onChange={(e) => setForm({ ...form, imageSrc: e.target.value })}
            className="admin-input"
            placeholder="/images/project.png"
          />
        </FormField>

        <FormField label="Image Alt Text">
          <input
            type="text"
            value={form.imageAlt}
            onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
            className="admin-input"
            placeholder="Project screenshot"
          />
        </FormField>

        <FormField label="Tech Stack" hint="Comma-separated">
          <input
            type="text"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="admin-input"
            placeholder="React, Next.js, TypeScript"
          />
        </FormField>

        <FormField label="Live URL">
          <input
            type="url"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="admin-input"
            placeholder="https://myproject.com"
          />
        </FormField>

        <FormField label="GitHub URL">
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="admin-input"
            placeholder="https://github.com/user/repo"
          />
        </FormField>

        <FormField label="Case Study URL">
          <input
            type="url"
            value={form.caseStudyUrl}
            onChange={(e) => setForm({ ...form, caseStudyUrl: e.target.value })}
            className="admin-input"
            placeholder="https://blog.com/case-study"
          />
        </FormField>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-zinc-300">Featured Project</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {hint && (
          <span className="text-zinc-600 font-normal ml-2">({hint})</span>
        )}
      </label>
      {children}
    </div>
  );
}
