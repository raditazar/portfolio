import { ToastProvider } from "@/components/admin/Toast";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-canvas-base text-white">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
