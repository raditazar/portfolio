"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Field, Input, Textarea, FormRow } from "@/components/admin/Field";
import { Button } from "@/components/admin/Button";
import { SkeletonRows } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { TagInput } from "@/components/admin/TagInput";
import { apiRequest, firstError, type FieldErrors } from "@/lib/admin-client";
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/content-defaults";

type FormState = Omit<ProfileData, "exploringProgress" | "cvUrl"> & {
  exploringProgress: string;
  cvUrl: string;
};

type TextKey = Exclude<keyof FormState, "technologies">;

interface TextField {
  key: TextKey;
  label: string;
  type?: "text" | "textarea" | "number";
  hint?: string;
  placeholder?: string;
}

const textSections: { title: string; fields: TextField[] }[] = [
  {
    title: "01 / Identity",
    fields: [
      { key: "name", label: "Full Name" },
      { key: "title", label: "Professional Title", hint: "Shown in hero and footer" },
      { key: "location", label: "Location" },
    ],
  },
  {
    title: "02 / Bio",
    fields: [
      { key: "bio", label: "Bio", type: "textarea", hint: "Continues \"I'm {name}, ...\"" },
      { key: "bio2", label: "Bio (second paragraph)", type: "textarea" },
    ],
  },
  {
    title: "03 / Landing hero",
    fields: [
      { key: "heroHeadlineTop", label: "Headline - first word" },
      { key: "heroHeadlineBottom", label: "Headline - second word" },
      { key: "heroTagline", label: "Tagline", type: "textarea" },
      { key: "heroFocusTitle", label: "Focus title" },
      { key: "heroFocusSince", label: "Focus subtitle" },
    ],
  },
  {
    title: "04 / Currently exploring",
    fields: [
      { key: "exploringTitle", label: "Title" },
      { key: "exploringProgress", label: "Progress (0-100)", type: "number" },
      { key: "exploringDescription", label: "Description", type: "textarea" },
    ],
  },
  {
    title: "05 / Stats",
    fields: [
      { key: "statYears", label: "Years of Experience" },
      { key: "statProjects", label: "Projects Completed" },
      { key: "statTechnologies", label: "Technologies Count" },
    ],
  },
];

const toForm = (p: ProfileData): FormState => ({
  ...p,
  technologies: [...(p.technologies ?? [])],
  exploringProgress: String(p.exploringProgress),
  cvUrl: p.cvUrl ?? "",
});

const toPayload = (f: FormState) => ({
  ...f,
  exploringProgress: Number(f.exploringProgress),
});

export default function AdminAboutPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(() => toForm(DEFAULT_PROFILE));
  const [initial, setInitial] = useState<FormState>(() => toForm(DEFAULT_PROFILE));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await apiRequest<ProfileData>("/api/profile");
      if (!res.ok || !res.data) {
        setLoadError(res.error ?? "Failed to load profile.");
        return;
      }
      const next = toForm(res.data);
      setForm(next);
      setInitial(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    setFieldErrors(undefined);

    try {
      const res = await apiRequest("/api/profile", "PUT", toPayload(form));
      if (!res.ok) {
        setFieldErrors(res.fieldErrors);
        toast(
          res.fieldErrors
            ? "Fix the highlighted fields."
            : res.error ?? "Failed to save.",
          { tone: "error" }
        );
        return;
      }
      setInitial(form);
      toast("Profile saved", { tone: "success" });
    } finally {
      setSaving(false);
    }
  };

  // First section sits right under the PageHeader rule, so it skips its own.
  const sectionClass =
    "border-t border-white/8 pt-8 flex flex-col gap-6 first:border-t-0 first:pt-0";
  const headingClass =
    "font-mono text-xs uppercase tracking-widest text-white/50";

  return (
    <div>
      <PageHeader
        eyebrow="04 / Profile"
        title="Profile"
        description="Identity, bio, hero, stack and stats shown on the public site."
      />

      {loading ? (
        <SkeletonRows count={5} />
      ) : loadError ? (
        <div className="flex flex-col items-start gap-4">
          <div
            role="alert"
            className="rounded-xl bg-danger-surface text-danger px-4 py-3 text-sm"
          >
            {loadError}
          </div>
          <Button variant="ghost" onClick={fetchData}>
            Retry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {textSections.map((section) => (
            <section key={section.title} className={sectionClass}>
              <h2 className={headingClass}>{section.title}</h2>
              <FormRow>
                {section.fields.map((field) => (
                  <Field
                    key={field.key}
                    label={field.label}
                    hint={field.hint}
                    error={firstError(fieldErrors, field.key)}
                    className={
                      field.type === "textarea" ? "md:col-span-2" : undefined
                    }
                  >
                    {(p) =>
                      field.type === "textarea" ? (
                        <Textarea
                          {...p}
                          rows={3}
                          value={form[field.key]}
                          onChange={(e) => set(field.key, e.target.value)}
                        />
                      ) : (
                        <Input
                          {...p}
                          type={field.type === "number" ? "number" : "text"}
                          min={field.type === "number" ? 0 : undefined}
                          max={field.type === "number" ? 100 : undefined}
                          value={form[field.key]}
                          onChange={(e) => set(field.key, e.target.value)}
                        />
                      )
                    }
                  </Field>
                ))}
              </FormRow>
            </section>
          ))}

          <section className={sectionClass}>
            <h2 className={headingClass}>06 / Media &amp; links</h2>
            <FormRow>
              <Field
                label="Hero Image"
                error={firstError(fieldErrors, "heroImage")}
                className="md:col-span-2"
              >
                {(p) => (
                  <ImageUpload
                    {...p}
                    value={form.heroImage}
                    onChange={(url) => set("heroImage", url)}
                    disabled={saving}
                    removable={false}
                  />
                )}
              </Field>
              <Field
                label="Technologies"
                hint="Press Enter to add a tag"
                error={firstError(fieldErrors, "technologies")}
                className="md:col-span-2"
              >
                {(p) => (
                  <TagInput
                    {...p}
                    value={form.technologies}
                    onChange={(tags) => set("technologies", tags)}
                    placeholder="Add technology"
                    disabled={saving}
                  />
                )}
              </Field>
              <Field
                label="CV / Resume URL"
                hint="Leave empty to hide the CV link"
                error={firstError(fieldErrors, "cvUrl")}
                className="md:col-span-2"
              >
                {(p) => (
                  <Input
                    {...p}
                    value={form.cvUrl}
                    onChange={(e) => set("cvUrl", e.target.value)}
                    placeholder="https://... or /cv.pdf"
                  />
                )}
              </Field>
            </FormRow>
          </section>

          <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-canvas-base flex items-center justify-between">
            <p
              className={`font-mono text-xs uppercase tracking-widest text-white/50 ${
                dirty ? "" : "invisible"
              }`}
              aria-hidden={!dirty}
            >
              Unsaved changes
            </p>
            <Button type="submit" disabled={!dirty} loading={saving}>
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
