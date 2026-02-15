"use client";

import { useState, useEffect, useCallback } from "react";

interface AboutEntry {
  key: string;
  value: string;
}

const aboutFields = [
  { key: "name", label: "Full Name", type: "text" },
  { key: "title", label: "Professional Title", type: "text" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "avatar", label: "Avatar URL", type: "text" },
  {
    key: "technologies",
    label: "Technologies",
    type: "textarea",
    hint: "Comma-separated",
  },
  {
    key: "currentlyExploring",
    label: "Currently Exploring",
    type: "textarea",
    hint: "Comma-separated",
  },
  { key: "yearsExperience", label: "Years of Experience", type: "text" },
  { key: "projectsCompleted", label: "Projects Completed", type: "text" },
  { key: "techUsed", label: "Technologies Used Count", type: "text" },
  { key: "coffeeConsumed", label: "Coffee Consumed", type: "text" },
];

export default function AdminAboutPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/about/info");
      if (res.ok) {
        const items: AboutEntry[] = await res.json();
        const map: Record<string, string> = {};
        items.forEach((i) => (map[i.key] = i.value));
        setData(map);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/about/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("Saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-zinc-500">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">About Info</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
      >
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("success")
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {aboutFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              {field.label}
              {field.hint && (
                <span className="text-zinc-600 font-normal ml-2">
                  ({field.hint})
                </span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={data[field.key] || ""}
                onChange={(e) =>
                  setData({ ...data, [field.key]: e.target.value })
                }
                rows={3}
                className="admin-input"
              />
            ) : (
              <input
                type="text"
                value={data[field.key] || ""}
                onChange={(e) =>
                  setData({ ...data, [field.key]: e.target.value })
                }
                className="admin-input"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </form>
    </div>
  );
}
