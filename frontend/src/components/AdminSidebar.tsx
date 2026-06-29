"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Volleyball, CalendarClock, ClipboardList,
  CreditCard, Workflow, BarChart3, LogOut, Menu, X, Eye,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./ui/misc";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courts", label: "Courts", icon: Volleyball },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/logs", label: "Automation", icon: Workflow },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-bold transition-colors",
              active ? "bg-primary text-white shadow-[0_10px_24px_rgba(56,189,248,0.3)]" : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <n.icon className="h-[18px] w-[18px]" /> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-foreground px-4 text-white lg:hidden">
        <Logo className="text-white [&>span:last-child]:text-white" />
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} className="cursor-pointer rounded-full p-1 hover:bg-white/10">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-foreground/55" />
          <aside className="court-lines absolute left-0 top-0 h-full w-72 bg-foreground p-4" onClick={(e) => e.stopPropagation()}>
            <SidebarBody NavLinks={NavLinks} user={user} onLogout={() => { logout(); router.push("/login"); }} onView={() => router.push("/courts")} />
          </aside>
        </div>
      )}

      <aside className="court-lines sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-foreground p-4 lg:flex">
        <SidebarBody NavLinks={NavLinks} user={user} onLogout={() => { logout(); router.push("/login"); }} onView={() => router.push("/courts")} />
      </aside>
    </>
  );
}

function SidebarBody({
  NavLinks, user, onLogout, onView,
}: {
  NavLinks: () => React.ReactNode;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onView: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[24px] border border-white/10 bg-white/5 px-3 py-4">
        <Logo className="text-white [&>span:last-child]:text-white" />
        <p className="mt-2 pl-11 text-xs font-bold text-slate-300">Admin Console</p>
      </div>
      <div className="mt-4 flex-1">
        <NavLinks />
      </div>
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-2">
        <button onClick={onView} className="mb-1 flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white">
          <Eye className="h-[18px] w-[18px]" /> View as User
        </button>
        <div className="flex items-center justify-between rounded-[20px] bg-foreground/40 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-300">{user?.email}</p>
          </div>
          <button onClick={onLogout} aria-label="Logout" className="cursor-pointer rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
