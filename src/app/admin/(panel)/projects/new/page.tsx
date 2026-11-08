import Link from "next/link";

import { buttonVariants } from "@/components/admin/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="02 / Projects / New"
        title="New project"
        description="Add a case study to the portfolio."
        actions={
          <Link
            href="/admin/projects"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Back to projects
          </Link>
        }
      />
      <ProjectForm mode="create" />
    </>
  );
}
