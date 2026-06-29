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
              "flex items-center gap-3 rounded-full px-4 py-3 text-[13px] uppercase tracking-[0.08em] transition-colors",
              active ? "bg-primary text-foreground" : "text-white hover:bg-white/10",
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
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-foreground px-4 text-white lg:hidden">
        <Logo className="text-white [&>span:last-child]:text-white" />
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} className="rounded-full border border-white/20 p-2 hover:bg-white/10">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-foreground/60" />
          <aside className="court-lines absolute left-0 top-0 h-full w-72 border-r border-white/20 bg-foreground p-4" onClick={(e) => e.stopPropagation()}>
            <SidebarBody NavLinks={NavLinks} user={user} onLogout={() => { logout(); router.push("/login"); }} onView={() => router.push("/courts")} />
          </aside>
        </div>
      )}

      <aside className="court-lines sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/20 bg-foreground p-4 lg:flex">
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
      <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-5">
        <Logo className="text-white [&>span:last-child]:text-white" />
        <p className="mt-3 pl-11 text-[13px] uppercase tracking-[0.08em] text-white/70">Admin Console</p>
      </div>
      <div className="mt-5 flex-1">
        <NavLinks />
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/5 p-2">
        <button onClick={onView} className="mb-1 flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[13px] uppercase tracking-[0.08em] text-white hover:bg-white/10">
          <Eye className="h-[18px] w-[18px]" /> View as User
        </button>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/70">{user?.email}</p>
          </div>
          <button onClick={onLogout} aria-label="Logout" className="rounded-full p-2 text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
