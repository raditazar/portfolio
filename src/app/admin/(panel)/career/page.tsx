"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Tag } from "@/components/admin/Tag";
import { Button } from "@/components/admin/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  FormRow,
} from "@/components/admin/Field";
import { SkeletonRows } from "@/components/admin/Skeleton";
import { TabSwitcher } from "@/components/ui/tabs";
import { apiRequest, firstError, type FieldErrors } from "@/lib/admin-client";

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

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
];

export default function AdminCareerPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [editing, setEditing] = useState<CareerEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<CareerEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await apiRequest<CareerEntry[]>("/api/about/career", "GET");
      if (!res.ok || !res.data) throw new Error("Failed to load");
      // Nullable DB columns must not reach controlled inputs as null.
      setEntries(
        res.data.map((e) => ({
          ...e,
          endDate: e.endDate ?? "",
          description: e.description ?? "",
        })),
      );
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const retry = () => {
    setLoading(true);
    fetchEntries();
  };

  const handleSave = async (
    entry: CareerEntry
  ): Promise<FieldErrors | undefined> => {
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/about/career" : `/api/about/career/${entry.id}`;
    const payload = {
      type: entry.type,
      title: entry.title,
      organization: entry.organization,
      description: entry.description,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      order: entry.order,
    };

    try {
      const res = await apiRequest(url, method, payload);

      if (!res.ok) {
        toast(res.error ?? "Failed to save entry.", { tone: "error" });
        return res.fieldErrors;
      }

      toast(isNew ? "Entry created." : "Entry updated.", { tone: "success" });
      setEditing(null);
      setIsNew(false);
      await fetchEntries();
    } catch {
      toast("Failed to save entry.", { tone: "error" });
    }
    return undefined;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await apiRequest(
        `/api/about/career/${deleteTarget.id}`,
        "DELETE"
      );
      if (!res.ok) {
        toast(res.error ?? "Failed to delete entry.", { tone: "error" });
        return;
      }
      toast("Entry deleted.", { tone: "success" });
      setDeleteTarget(null);
      await fetchEntries();
    } catch {
      toast("Failed to delete entry.", { tone: "error" });
    } finally {
      setDeleting(false);
    }
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

  const visible =
    filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <div>
      <PageHeader
        eyebrow="03 / Career"
        title="Career"
        actions={
          <Button variant="primary" onClick={startNew}>
            + New entry
          </Button>
        }
      />

      {editing && (
        <EntryForm
          key={editing.id || "new"}
          entry={editing}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null);
            setIsNew(false);
          }}
        />
      )}

      <div className="mb-8">
        <TabSwitcher
          tabs={FILTER_TABS}
          activeTab={filter}
          onTabChange={setFilter}
        />
      </div>

      {loading ? (
        <SkeletonRows count={4} />
      ) : loadError ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-2xl bg-danger-surface p-8 text-danger"
        >
          <p>Failed to load career entries.</p>
          <Button variant="secondary" size="sm" onClick={retry}>
            Retry
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={entries.length === 0 ? "No career entries yet" : "No matches"}
          description={
            entries.length === 0
              ? "Add your first work or education entry."
              : "No entries in this category."
          }
        />
      ) : (
        <ul>
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-4 border-b border-white/8 py-8 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                  {entry.startDate} — {entry.endDate || "Present"}
                </p>
                <h2 className="font-serif text-2xl text-white">
                  {entry.title}
                </h2>
                <p className="text-white/60">{entry.organization}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="neutral">{entry.type}</Tag>
                  {entry.isCurrent && <Tag tone="emerald">Current</Tag>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsNew(false);
                    setEditing(entry);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:text-danger"
                  onClick={() => setDeleteTarget(entry)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete this entry?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
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
  onSave: (entry: CareerEntry) => Promise<FieldErrors | undefined>;
  onCancel: () => void;
}) {
  const [form, setFormState] = useState(entry);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>();

  const setForm = (next: CareerEntry) => {
    setFormState(next);
    if (fieldErrors) {
      const changed = (Object.keys(next) as (keyof CareerEntry)[]).filter(
        (k) => next[k] !== form[k]
      );
      if (changed.some((k) => fieldErrors[k])) {
        const cleared = { ...fieldErrors };
        for (const k of changed) delete cleared[k];
        setFieldErrors(cleared);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors(undefined);
    try {
      setFieldErrors(await onSave(form));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 flex flex-col gap-6 rounded-2xl bg-canvas-surface p-8"
    >
      <h2 className="font-serif text-2xl text-white">
        {isNew ? "New entry" : "Edit entry"}
      </h2>

      <FormRow>
        <Field label="Type" error={firstError(fieldErrors, "type")}>
          {(p) => (
            <Select
              {...p}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </Select>
          )}
        </Field>
        <Field label="Order" error={firstError(fieldErrors, "order")}>
          {(p) => (
            <Input
              {...p}
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: parseInt(e.target.value) || 0 })
              }
            />
          )}
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Title *" error={firstError(fieldErrors, "title")}>
          {(p) => (
            <Input
              {...p}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Software Engineer"
            />
          )}
        </Field>
        <Field
          label="Organization *"
          error={firstError(fieldErrors, "organization")}
        >
          {(p) => (
            <Input
              {...p}
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
              required
              placeholder="Company Name"
            />
          )}
        </Field>
      </FormRow>

      <FormRow>
        <Field
          label="Start date *"
          error={firstError(fieldErrors, "startDate")}
        >
          {(p) => (
            <Input
              {...p}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
              placeholder="2023"
            />
          )}
        </Field>
        <Field
          label="End date"
          hint="Leave empty if current."
          error={firstError(fieldErrors, "endDate")}
        >
          {(p) => (
            <Input
              {...p}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              placeholder="Present"
            />
          )}
        </Field>
      </FormRow>

      <Field
        label="Description"
        error={firstError(fieldErrors, "description")}
      >
        {(p) => (
          <Textarea
            {...p}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of your role..."
          />
        )}
      </Field>

      <Checkbox
        label="Currently active"
        checked={form.isCurrent}
        onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
      />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" variant="primary" loading={saving}>
          {isNew ? "Create" : "Save changes"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
