"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./Button";
import { Checkbox, Field, FormRow, Input, Textarea } from "./Field";
import ImageUpload from "./ImageUpload";
import { TagInput } from "./TagInput";
import { useToast } from "./Toast";

export interface ProjectFormProject {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor?: string | null;
  techStack: string[];
  imageSrc: string;
  imageAlt: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  caseStudyUrl?: string | null;
  isFeatured: boolean;
  order: number;
}

export interface ProjectFormProps {
  mode: "create" | "edit";
  project?: ProjectFormProject;
}

interface FormState {
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl: string;
  order: string;
  isFeatured: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const DEFAULT_COLOR = "text-blue-400";
const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function initialState(project?: ProjectFormProject): FormState {
  return {
    title: project?.title ?? "",
    category: project?.category ?? "",
    categoryColor: project?.categoryColor ?? DEFAULT_COLOR,
    description: project?.description ?? "",
    imageSrc: project?.imageSrc ?? "",
    imageAlt: project?.imageAlt ?? "",
    techStack: project?.techStack ?? [],
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    caseStudyUrl: project?.caseStudyUrl ?? "",
    order: String(project?.order ?? 0),
    isFeatured: project?.isFeatured ?? false,
  };
}

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  const required = (
    key: "title" | "description" | "category" | "categoryColor" | "imageSrc" | "imageAlt",
    max: number,
  ) => {
    const v = f[key].trim();
    if (!v) e[key] = "Required";
    else if (v.length > max) e[key] = `Max ${max} characters`;
  };
  required("title", 160);
  required("category", 80);
  required("categoryColor", 60);
  required("description", 1500);
  required("imageSrc", 2048);
  required("imageAlt", 200);

  const src = f.imageSrc.trim();
  if (src && !e.imageSrc && !src.startsWith("/") && !isHttpUrl(src)) {
    e.imageSrc = "Must be an http(s) URL or a /path";
  }

  (["liveUrl", "githubUrl", "caseStudyUrl"] as const).forEach((key) => {
    const v = f[key].trim();
    if (v && !isHttpUrl(v)) e[key] = "Must start with http:// or https://";
  });

  const order = Number(f.order);
  if (f.order.trim() === "" || !Number.isInteger(order) || order < 0 || order > 10_000) {
    e.order = "Whole number between 0 and 10000";
  }

  if (f.techStack.length > 30) e.techStack = "Max 30 items";
  return e;
}

function buildPayload(f: FormState) {
  return {
    title: f.title.trim(),
    category: f.category.trim(),
    categoryColor: f.categoryColor.trim(),
    description: f.description.trim(),
    imageSrc: f.imageSrc.trim(),
    imageAlt: f.imageAlt.trim(),
    techStack: f.techStack,
    liveUrl: f.liveUrl.trim(),
    githubUrl: f.githubUrl.trim(),
    caseStudyUrl: f.caseStudyUrl.trim(),
    order: Number(f.order),
    isFeatured: f.isFeatured,
  };
}

const sectionHead = "font-mono text-xs uppercase tracking-widest text-white/50 mb-6";
const sectionRule = "border-t border-white/8 pt-8 mt-10";

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = mode === "edit";

  const initial = useMemo(() => initialState(project), [project]);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast("Fix the highlighted fields", { tone: "error" });
      return;
    }

    if (isEdit && !project) {
      toast("Missing project data", { tone: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/projects/${project!.id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(form)),
        },
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          fieldErrors?: Record<string, string[] | undefined>;
        } | null;

        const fieldErrors: Errors = {};
        for (const [key, msgs] of Object.entries(data?.fieldErrors ?? {})) {
          if (key in form && msgs?.[0]) fieldErrors[key as keyof FormState] = msgs[0];
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          toast("Fix the highlighted fields", { tone: "error" });
        } else {
          toast(
            data?.error ?? (isEdit ? "Failed to save project" : "Failed to create project"),
            { tone: "error" },
          );
        }
        return;
      }

      toast(isEdit ? "Project saved" : "Project created", { tone: "success" });
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", {
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const color = form.categoryColor.trim();
  const colorIsHex = HEX_RE.test(color);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <section>
        <h2 className={sectionHead}>01 / Basics</h2>
        <FormRow>
          <Field label="Title" error={errors.title}>
            {(p) => (
              <Input
                {...p}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                disabled={saving}
                placeholder="My Awesome Project"
              />
            )}
          </Field>
          <Field label="Category" error={errors.category}>
            {(p) => (
              <Input
                {...p}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                disabled={saving}
                placeholder="Web App"
              />
            )}
          </Field>
          <Field
            label="Category color"
            hint="Tailwind text class (text-blue-400) or hex (#60a5fa)"
            error={errors.categoryColor}
            className="md:col-span-2"
          >
            {(p) => (
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-6 shrink-0 rounded-full",
                    !colorIsHex && "bg-current",
                    !colorIsHex && color,
                  )}
                  style={colorIsHex ? { backgroundColor: color } : undefined}
                />
                <Input
                  {...p}
                  value={form.categoryColor}
                  onChange={(e) => set("categoryColor", e.target.value)}
                  disabled={saving}
                  placeholder={DEFAULT_COLOR}
                />
              </div>
            )}
          </Field>
          <Field label="Description" error={errors.description} className="md:col-span-2">
            {(p) => (
              <Textarea
                {...p}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                disabled={saving}
                rows={4}
                placeholder="Brief description of the project"
              />
            )}
          </Field>
        </FormRow>
      </section>

      <section className={sectionRule}>
        <h2 className={sectionHead}>02 / Media</h2>
        <FormRow>
          <Field label="Image" error={errors.imageSrc} className="md:col-span-2">
            {(p) => (
              <ImageUpload
                {...p}
                value={form.imageSrc}
                onChange={(url) => set("imageSrc", url)}
                disabled={saving}
              />
            )}
          </Field>
          <Field label="Image alt text" error={errors.imageAlt} className="md:col-span-2">
            {(p) => (
              <Input
                {...p}
                value={form.imageAlt}
                onChange={(e) => set("imageAlt", e.target.value)}
                disabled={saving}
                placeholder="Project screenshot"
              />
            )}
          </Field>
        </FormRow>
      </section>

      <section className={sectionRule}>
        <h2 className={sectionHead}>03 / Stack &amp; Links</h2>
        <FormRow>
          <Field
            label="Tech stack"
            hint="Press Enter to add a tag"
            error={errors.techStack}
            className="md:col-span-2"
          >
            {(p) => (
              <TagInput
                {...p}
                value={form.techStack}
                onChange={(v) => set("techStack", v)}
                disabled={saving}
                placeholder="React, Next.js, TypeScript"
              />
            )}
          </Field>
          <Field label="Live URL" error={errors.liveUrl}>
            {(p) => (
              <Input
                {...p}
                type="url"
                value={form.liveUrl}
                onChange={(e) => set("liveUrl", e.target.value)}
                disabled={saving}
                placeholder="https://myproject.com"
              />
            )}
          </Field>
          <Field label="GitHub URL" error={errors.githubUrl}>
            {(p) => (
              <Input
                {...p}
                type="url"
                value={form.githubUrl}
                onChange={(e) => set("githubUrl", e.target.value)}
                disabled={saving}
                placeholder="https://github.com/user/repo"
              />
            )}
          </Field>
          <Field label="Case study URL" error={errors.caseStudyUrl} className="md:col-span-2">
            {(p) => (
              <Input
                {...p}
                type="url"
                value={form.caseStudyUrl}
                onChange={(e) => set("caseStudyUrl", e.target.value)}
                disabled={saving}
                placeholder="https://blog.com/case-study"
              />
            )}
          </Field>
        </FormRow>
      </section>

      <section className={sectionRule}>
        <h2 className={sectionHead}>04 / Display</h2>
        <FormRow>
          <Field label="Order" hint="Lower numbers appear first" error={errors.order}>
            {(p) => (
              <Input
                {...p}
                type="number"
                min={0}
                max={10000}
                step={1}
                value={form.order}
                onChange={(e) => set("order", e.target.value)}
                disabled={saving}
              />
            )}
          </Field>
          <div className="flex items-end pb-3">
            <Checkbox
              label="Featured project"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              disabled={saving}
            />
          </div>
        </FormRow>
      </section>

      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 mt-10 bg-canvas-base flex items-center justify-between">
        <Link href="/admin/projects" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          disabled={isEdit && !dirty}
        >
          {isEdit ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
