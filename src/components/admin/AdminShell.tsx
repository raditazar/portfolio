"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Dialog } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/career", label: "Career" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/about", label: "Profile" },
  { href: "/admin/settings", label: "Socials" },
];

function isActivePath(pathname: string, href: string): boolean {
  return href === "/admin/dashboard"
    ? pathname === href
    : pathname.startsWith(href);
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet";

const metaAction = `font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white ${focusRing}`;

type AdminShellProps = {
  email: string | null;
  children: ReactNode;
};

type SidebarContentProps = {
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
};

function SidebarContent({ pathname, onNavigate, onSignOut }: SidebarContentProps) {
  return (
    <>
      <div className="px-6 pt-8 pb-6">
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className={`font-serif font-black text-2xl text-white ${focusRing}`}
        >
          Raditazar
        </Link>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-white/50">
          Admin
        </p>
      </div>

      <nav aria-label="Admin" className="flex-1 px-6 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 py-3 text-sm uppercase tracking-[0.2em] ${focusRing} ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-white/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-px transition-all motion-reduce:transition-none ${
                      active ? "w-6 bg-cream-sheet" : "w-3 bg-white/20"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col items-start gap-4 px-6 py-8">
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className={metaAction}
        >
          View site ↗
        </Link>
        <button type="button" onClick={onSignOut} className={metaAction}>
          Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminShell({ email, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  // The drawer is hidden from lg up; close it there so its focus trap is released.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("Sign out failed", err);
    }
    // Middleware sends a still-valid session back to the dashboard.
    router.push("/admin");
    router.refresh();
  };

  const currentLabel = navItems.find((item) =>
    isActivePath(pathname, item.href),
  )?.label;

  return (
    <div className="flex min-h-screen bg-canvas-base text-white">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-canvas-hero lg:flex">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-canvas-base px-6 py-4 md:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className={`flex items-center gap-3 text-white/60 hover:text-white lg:hidden ${focusRing}`}
                >
                  <span className="font-mono text-xs uppercase tracking-widest">
                    Menu
                  </span>
                  <span aria-hidden="true" className="flex flex-col gap-1.5">
                    <span className="block h-px w-5 bg-current" />
                    <span className="block h-px w-5 bg-current" />
                    <span className="block h-px w-5 bg-current" />
                  </span>
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none lg:hidden" />
                <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-canvas-hero data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none lg:hidden">
                  <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Admin section links, site link and sign out.
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className={`absolute right-6 top-8 ${metaAction}`}
                    >
                      Close
                    </button>
                  </Dialog.Close>
                  <SidebarContent
                    pathname={pathname}
                    onNavigate={() => setDrawerOpen(false)}
                    onSignOut={() => {
                      setDrawerOpen(false);
                      void handleSignOut();
                    }}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <p className="truncate font-mono text-xs uppercase tracking-widest text-white/50">
              Admin{currentLabel ? ` / ${currentLabel}` : ""}
            </p>
          </div>

          {email ? (
            <p className="max-w-[40vw] truncate font-mono text-xs text-white/50">
              {email}
            </p>
          ) : null}
        </header>

        <main className="flex-1 px-6 py-10 md:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
