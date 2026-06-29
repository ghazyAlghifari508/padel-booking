import { Navbar } from "@/components/Navbar";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface"><Navbar /><main className="mx-auto max-w-7xl px-4 py-10">{children}</main><RoleSwitcher /></div>;
}
