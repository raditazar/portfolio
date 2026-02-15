"use client";

import { useState, useEffect, useCallback } from "react";

interface SettingEntry {
  key: string;
  value: string;
}

const settingFields = [
  { key: "email", label: "Email", type: "email" },
  { key: "github", label: "GitHub URL", type: "url" },
  { key: "linkedin", label: "LinkedIn URL", type: "url" },
  { key: "twitter", label: "Twitter URL", type: "url" },
  { key: "resume", label: "Resume URL", type: "url" },
  { key: "siteTitle", label: "Site Title", type: "text" },
];

export default function AdminSettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const items: SettingEntry[] = await res.json();
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
      const res = await fetch("/api/settings", {
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
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

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

        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type}
              value={data[field.key] || ""}
              onChange={(e) =>
                setData({ ...data, [field.key]: e.target.value })
              }
              className="admin-input"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
