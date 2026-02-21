"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "🗂️" },
  { href: "/admin/career", label: "Career", icon: "💼" },
  { href: "/admin/about", label: "About Info", icon: "👤" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show layout for login page
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="text-lg font-bold text-white hover:text-purple-400 transition-colors">
            ← Portfolio
          </Link>
          <p className="text-xs text-zinc-500 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="text-sm text-zinc-500">
            {sidebarLinks.find(
              (l) =>
                l.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(l.href)
            )?.label ?? "Admin"}
          </div>
          <div className="text-xs text-zinc-600">admin@raditazar.com</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
