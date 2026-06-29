import { AdminSidebar } from "@/components/AdminSidebar";
import { Guard } from "@/components/Guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard admin>
      <div className="flex min-h-screen flex-col bg-background lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </Guard>
  );
}
