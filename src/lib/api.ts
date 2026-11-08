import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

/** Returns a 401 response when there is no session, otherwise null. */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await auth();
  // Fail closed: when Auth.js is misconfigured (e.g. UntrustedHost) auth() can return an
  // error object instead of null, so require an actual user, not just a truthy value.
  return session?.user ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type Parsed<T> = { data: T; error?: undefined } | { data?: undefined; error: NextResponse };

/**
 * Parse + validate a JSON body. Unknown keys are stripped (zod default),
 * failures return 400 `{ error, fieldErrors }`.
 */
export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S
): Promise<Parsed<z.output<S>>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return { error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: "Validation failed", fieldErrors: z.flattenError(result.error).fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

/** Refresh every public page that renders CMS content. Call after each mutation. */
export function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/projects");
}

export function serverError(message: string, err?: unknown) {
  if (err) console.error(message, err);
  return NextResponse.json({ error: message }, { status: 500 });
}

/** Prisma "record not found" (P2025) -> 404, anything else -> 500. */
export function dbError(message: string, err: unknown) {
  if ((err as { code?: string } | null)?.code === "P2025") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return serverError(message, err);
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}
