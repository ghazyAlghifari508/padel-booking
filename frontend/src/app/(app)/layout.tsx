import { Navbar } from "@/components/Navbar";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1180px] px-4 py-8">{children}</main>
      <RoleSwitcher />
    </div>
  );
}
