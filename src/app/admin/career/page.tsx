"use client";

import { useState, useEffect, useCallback } from "react";

interface CareerEntry {
  id: string;
  type: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
  order: number;
}

export default function AdminCareerPage() {
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [editing, setEditing] = useState<CareerEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/about/career");
      if (res.ok) {
        setEntries(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSave = async (entry: Partial<CareerEntry>) => {
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/about/career" : `/api/about/career/${entry.id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (res.ok) {
      setEditing(null);
      setIsNew(false);
      fetchEntries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/about/career/${id}`, { method: "DELETE" });
    if (res.ok) fetchEntries();
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      type: "work",
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
      order: entries.length,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Career Entries</h1>
        <button
          onClick={startNew}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Edit / New Form */}
      {editing && (
        <EntryForm
          entry={editing}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null);
            setIsNew(false);
          }}
        />
      )}

      {/* List */}
      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
          <p className="text-zinc-500">No career entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.type === "work"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {entry.type}
                  </span>
                  {entry.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-white font-medium">{entry.title}</p>
                <p className="text-sm text-zinc-400">
                  {entry.organization} · {entry.startDate}{entry.endDate ? ` — ${entry.endDate}` : " — Present"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditing(entry);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EntryForm({
  entry,
  isNew,
  onSave,
  onCancel,
}: {
  entry: CareerEntry;
  isNew: boolean;
  onSave: (entry: Partial<CareerEntry>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(entry);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 rounded-2xl bg-zinc-900 border border-purple-500/30 space-y-4"
    >
      <h2 className="text-lg font-semibold">
        {isNew ? "New Entry" : "Edit Entry"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="admin-input"
          >
            <option value="work">Work</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) || 0 })
            }
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="admin-input"
          placeholder="Software Engineer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Organization <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          required
          className="admin-input"
          placeholder="Company Name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Start Date <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            className="admin-input"
            placeholder="2023"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            End Date
          </label>
          <input
            type="text"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="admin-input"
            placeholder="Present (leave empty if current)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="admin-input"
          placeholder="Brief description of your role..."
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isCurrent}
          onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
          className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-sm text-zinc-300">Currently Active</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Create" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
