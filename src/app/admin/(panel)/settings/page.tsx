"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Field, Input, Select, Checkbox, FormRow } from "@/components/admin/Field";
import { Button } from "@/components/admin/Button";
import { EmptyState } from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { apiRequest, firstError, type FieldErrors } from "@/lib/admin-client";

const KINDS = ["github", "linkedin", "instagram", "email", "x", "other"] as const;

interface SocialData {
  label: string;
  kind: string;
  url: string;
  showInNavbar: boolean;
  showInHero: boolean;
  showInFooter: boolean;
  order: number;
}

interface Row extends SocialData {
  /** undefined = not saved yet */
  id?: string;
  /** stable React key */
  key: string;
  /** last saved state; undefined for unsaved rows */
  snap?: string;
  errors?: FieldErrors;
  message?: { ok: boolean; text: string };
  busy?: boolean;
}

const snapshot = (r: SocialData) =>
  JSON.stringify([
    r.label,
    r.kind,
    r.url,
    r.showInNavbar,
    r.showInHero,
    r.showInFooter,
    r.order,
  ]);

const toBody = (r: SocialData): SocialData => ({
  label: r.label,
  kind: r.kind,
  url: r.url,
  showInNavbar: r.showInNavbar,
  showInHero: r.showInHero,
  showInFooter: r.showInFooter,
  order: r.order,
});

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [confirmRow, setConfirmRow] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const newCount = useRef(0);

  const fetchRows = useCallback(async () => {
    const res = await apiRequest<(SocialData & { id: string })[]>("/api/socials");
    if (res.ok && Array.isArray(res.data)) {
      setRows(
        res.data.map((r) => {
          const data = toBody(r);
          return { ...data, id: r.id, key: r.id, snap: snapshot(data) };
        })
      );
    } else {
      setLoadError(res.error ?? "Failed to load social links.");
    }
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

  const addRow = () => {
    newCount.current += 1;
    setRows((rs) => [
      ...rs,
      {
        key: `new-${newCount.current}`,
        label: "",
        kind: "other",
        url: "",
        showInNavbar: true,
        showInHero: true,
        showInFooter: true,
        order: rs.reduce((m, r) => Math.max(m, r.order), 0) + 1,
      },
    ]);
  };

  const save = async (row: Row) => {
    patch(row.key, { busy: true, errors: undefined, message: undefined });
    const body = toBody(row);
    const res = row.id
      ? await apiRequest<{ id: string }>(`/api/socials/${row.id}`, "PUT", body)
      : await apiRequest<{ id: string }>("/api/socials", "POST", body);

    if (res.ok && res.data) {
      patch(row.key, {
        id: res.data.id ?? row.id,
        snap: snapshot(body),
        busy: false,
        message: { ok: true, text: "Saved" },
      });
      toast("Saved", { tone: "success" });
    } else {
      patch(row.key, {
        busy: false,
        errors: res.fieldErrors,
        message: {
          ok: false,
          text: res.fieldErrors ? "Fix the highlighted fields" : res.error ?? "Failed",
        },
      });
      if (res.error && !res.fieldErrors) toast(res.error, { tone: "error" });
    }
  };

  const discard = (row: Row) =>
    setRows((rs) => rs.filter((r) => r.key !== row.key));

  const confirmDelete = async () => {
    const row = confirmRow;
    if (!row?.id) return;
    setDeleting(true);
    const res = await apiRequest(`/api/socials/${row.id}`, "DELETE");
    setDeleting(false);
    setConfirmRow(null);
    if (!res.ok) {
      const text = res.error ?? "Delete failed";
      patch(row.key, { message: { ok: false, text } });
      toast(text, { tone: "error" });
      return;
    }
    discard(row);
    toast("Deleted", { tone: "success" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="05 / Social links"
        title="Social links"
        description="Links shown in the navbar, hero and footer."
        actions={
          <Button variant="primary" onClick={addRow} disabled={loading || !!loadError}>
            + Add link
          </Button>
        }
      />

      {loading ? (
        <SkeletonRows count={3} />
      ) : loadError ? (
        <div className="flex flex-col items-start gap-4">
          <div
            role="alert"
            className="rounded-xl bg-danger-surface text-danger px-4 py-3 text-sm"
          >
            {loadError}
          </div>
          <Button variant="ghost" onClick={load}>
            Retry
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No social links yet"
          description="Add a link to show it in the navbar, hero or footer."
          action={<Button onClick={addRow}>+ Add link</Button>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {rows.map((row) => {
            const isNew = !row.id;
            const dirty = isNew || snapshot(row) !== row.snap;
            return (
              <section
                key={row.key}
                className="rounded-2xl bg-canvas-surface p-6 flex flex-col gap-6"
              >
                <FormRow>
                  <Field label="Label" error={firstError(row.errors, "label")}>
                    {(p) => (
                      <Input
                        {...p}
                        value={row.label}
                        onChange={(e) => patch(row.key, { label: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Kind" error={firstError(row.errors, "kind")}>
                    {(p) => (
                      <Select
                        {...p}
                        value={row.kind}
                        onChange={(e) => patch(row.key, { kind: e.target.value })}
                      >
                        {KINDS.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field label="URL or email" error={firstError(row.errors, "url")}>
                    {(p) => (
                      <Input
                        {...p}
                        value={row.url}
                        placeholder="https://... or name@mail.com"
                        onChange={(e) => patch(row.key, { url: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Order" error={firstError(row.errors, "order")}>
                    {(p) => (
                      <Input
                        {...p}
                        type="number"
                        min={0}
                        max={10000}
                        value={row.order}
                        onChange={(e) =>
                          patch(row.key, { order: Number(e.target.value) })
                        }
                      />
                    )}
                  </Field>
                </FormRow>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <Checkbox
                    label="Navbar"
                    checked={row.showInNavbar}
                    onChange={(e) => patch(row.key, { showInNavbar: e.target.checked })}
                  />
                  <Checkbox
                    label="Hero"
                    checked={row.showInHero}
                    onChange={(e) => patch(row.key, { showInHero: e.target.checked })}
                  />
                  <Checkbox
                    label="Footer"
                    checked={row.showInFooter}
                    onChange={(e) => patch(row.key, { showInFooter: e.target.checked })}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="primary"
                    onClick={() => save(row)}
                    loading={row.busy}
                    disabled={!dirty}
                  >
                    Save
                  </Button>
                  {isNew ? (
                    <Button
                      variant="ghost"
                      onClick={() => discard(row)}
                      disabled={row.busy}
                    >
                      Discard
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-danger hover:text-danger"
                      onClick={() => setConfirmRow(row)}
                      disabled={row.busy}
                    >
                      Delete
                    </Button>
                  )}
                  {row.message && (
                    <p
                      role={row.message.ok ? "status" : "alert"}
                      className={`text-sm ${
                        row.message.ok ? "text-accent-emerald" : "text-danger"
                      }`}
                    >
                      {row.message.text}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmRow !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmRow(null);
        }}
        title="Delete link?"
        description={`"${confirmRow?.label || "this link"}" will be removed from the site.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
