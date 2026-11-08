"use client";

import { useState, useEffect, useCallback } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { PageHeader } from "@/components/admin/PageHeader";
import { Field, Input, Textarea, FormRow } from "@/components/admin/Field";
import { Button } from "@/components/admin/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";
import { apiRequest, firstError, type FieldErrors } from "@/lib/admin-client";

interface Row {
  id?: string;
  key: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  order: number;
  errors?: FieldErrors;
  busy?: boolean;
}

const blank = (order: number): Row => ({
  key: `new-${Date.now()}-${order}`,
  src: "",
  alt: "",
  title: "",
  caption: "",
  order,
});

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = useCallback(async () => {
    const res = await apiRequest<Omit<Row, "key">[]>("/api/gallery");
    if (res.ok && res.data) setRows(res.data.map((r) => ({ ...r, key: r.id as string })));
    else setLoadError(res.error ?? "Failed to load gallery");
    setLoading(false);
  }, []);

  // Retry handler: reset state, then refetch.
  const load = () => {
    setLoading(true);
    setLoadError("");
    void fetchRows();
  };

  useEffect(() => {
    // Fetch-on-mount: state is only set after the awaited request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRows();
  }, [fetchRows]);

  const patch = (key: string, changes: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...changes } : r)));

  const save = async (row: Row) => {
    patch(row.key, { busy: true, errors: undefined });
    const body = { src: row.src, alt: row.alt, title: row.title, caption: row.caption, order: row.order };
    const res = row.id
      ? await apiRequest<Row>(`/api/gallery/${row.id}`, "PUT", body)
      : await apiRequest<Row>("/api/gallery", "POST", body);
    if (res.ok && res.data) {
      patch(row.key, { id: res.data.id, busy: false });
      toast("Photo saved", { tone: "success" });
    } else {
      patch(row.key, { busy: false, errors: res.fieldErrors });
      toast(res.fieldErrors ? "Fix the highlighted fields" : res.error ?? "Save failed", {
        tone: "error",
      });
    }
  };

  const discard = (row: Row) => setRows((rs) => rs.filter((r) => r.key !== row.key));

  const confirmDelete = async () => {
    const row = pendingDelete;
    if (!row?.id) return;
    setDeleting(true);
    const res = await apiRequest(`/api/gallery/${row.id}`, "DELETE");
    setDeleting(false);
    if (!res.ok) {
      toast(res.error ?? "Delete failed", { tone: "error" });
      setPendingDelete(null);
      return;
    }
    discard(row);
    setPendingDelete(null);
    toast("Photo deleted", { tone: "success" });
  };

  const addPhoto = () =>
    setRows((rs) => [...rs, blank(rs.reduce((m, r) => Math.max(m, r.order), 0) + 1)]);

  return (
    <div>
      <PageHeader
        eyebrow="04 / Gallery"
        title="Gallery"
        description="Photos shown in the activity gallery on the About page."
        actions={<Button variant="primary" onClick={addPhoto}>+ Add photo</Button>}
      />

      {loadError && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-danger-surface text-danger px-4 py-3 text-sm"
        >
          <span>{loadError}</span>
          <Button variant="ghost" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <SkeletonRows count={3} />
      ) : (
        <div className="flex flex-col gap-6">
          {rows.map((row) => (
            <div key={row.key} className="rounded-2xl bg-canvas-surface p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <Field label="Photo" error={firstError(row.errors, "src")}>
                    <ImageUpload
                      value={row.src}
                      onChange={(src) => patch(row.key, { src })}
                      disabled={row.busy}
                    />
                  </Field>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  <FormRow>
                    <Field label="Title (shown on photo)" error={firstError(row.errors, "title")}>
                      <Input
                        value={row.title}
                        onChange={(e) => patch(row.key, { title: e.target.value })}
                      />
                    </Field>
                    <Field label="Alt text" error={firstError(row.errors, "alt")}>
                      <Input
                        value={row.alt}
                        onChange={(e) => patch(row.key, { alt: e.target.value })}
                      />
                    </Field>
                  </FormRow>
                  <Field label="Caption (optional)" error={firstError(row.errors, "caption")}>
                    <Textarea
                      rows={3}
                      value={row.caption}
                      onChange={(e) => patch(row.key, { caption: e.target.value })}
                    />
                  </Field>
                  <FormRow>
                    <Field label="Order" error={firstError(row.errors, "order")}>
                      <Input
                        type="number"
                        value={row.order}
                        onChange={(e) => patch(row.key, { order: Number(e.target.value) })}
                      />
                    </Field>
                  </FormRow>

                  <div className="flex items-center gap-6">
                    <Button
                      variant="primary"
                      loading={row.busy}
                      onClick={() => save(row)}
                    >
                      Save
                    </Button>
                    {row.id ? (
                      <Button
                        variant="ghost"
                        className="text-danger hover:text-danger"
                        disabled={row.busy}
                        onClick={() => setPendingDelete(row)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-danger hover:text-danger"
                        disabled={row.busy}
                        onClick={() => discard(row)}
                      >
                        Discard
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rows.length === 0 && !loadError && (
            <EmptyState
              title="No photos yet"
              description="Add a photo to show it in the About page gallery."
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete photo?"
        description={`"${pendingDelete?.title || "This photo"}" will be removed permanently.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
