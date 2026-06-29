"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Volleyball, CalendarClock, ClipboardList,
  CreditCard, Workflow, BarChart3, LogOut, Eye, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./ui/misc";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courts", label: "Lapangan", icon: Volleyball },
  { href: "/admin/schedule", label: "Jadwal", icon: CalendarClock },
  { href: "/admin/bookings", label: "Pemesanan", icon: ClipboardList },
  { href: "/admin/payments", label: "Pembayaran", icon: CreditCard },
  { href: "/admin/logs", label: "Otomasi", icon: Workflow },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const active = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* mobile toggle */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-foreground/8 bg-white px-4 lg:hidden">
        <Logo />
        <button onClick={() => setCollapsed((v) => !v)} aria-label="Buka/tutup menu" className="rounded-lg p-2 hover:bg-foreground/5">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile drawer */}
      {collapsed && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setCollapsed(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <SidebarBody collapsed={false} active={active} user={user} onLogout={() => { logout(); router.push("/login"); }} />
          </aside>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-foreground/8 bg-white p-4 transition-all duration-200 lg:flex", collapsed ? "w-16" : "w-60")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && <Logo />}
          <button onClick={() => setCollapsed((v) => !v)} aria-label="Collapse sidebar" className="rounded-lg p-1.5 text-muted hover:bg-foreground/5">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-0.5">
          {nav.map((n) => {
            const isActive = active(n.href, n.exact);
            return (
              <Link key={n.href} href={n.href} title={collapsed ? n.label : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-foreground text-white" : "text-muted hover:bg-foreground/5 hover:text-foreground", collapsed && "justify-center px-0")}>
                <n.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-foreground/8 pt-3">
          {!collapsed && (
            <Link href="/courts" className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground">
              <Eye className="h-[18px] w-[18px]" /> Lihat Situs
            </Link>
          )}
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between rounded-lg bg-foreground/4 px-3 py-2")}>
            {!collapsed && user && (
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            )}
            <button onClick={() => { logout(); router.push("/login"); }} aria-label="Keluar" className="rounded-lg p-2 text-muted hover:bg-foreground/10 hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarBody({
  collapsed, active, user, onLogout
}: {
  collapsed: boolean;
  active: (href: string, exact?: boolean) => boolean;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Logo />
      <nav className="mt-6 flex flex-1 flex-col gap-0.5">
        {nav.map((n) => {
          const isActive = active(n.href, n.exact);
          return (
            <Link key={n.href} href={n.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm", isActive ? "bg-foreground text-white" : "text-muted hover:bg-foreground/5 hover:text-foreground", collapsed && "justify-center px-0")}>
              <n.icon className="h-[18px] w-[18px]" />
              {!collapsed && n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-foreground/8 pt-3">
        {!collapsed && <Link href="/courts" className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground"><Eye className="h-[18px] w-[18px]" /> Lihat Situs</Link>}
        <div className="flex items-center justify-between rounded-lg bg-foreground/4 px-3 py-2">
          {!collapsed && user && <div className="min-w-0"><p className="truncate text-sm text-foreground">{user.name}</p><p className="truncate text-xs text-muted">{user.email}</p></div>}
          <button onClick={onLogout} aria-label="Keluar" className="rounded-lg p-2 text-muted hover:bg-foreground/10 hover:text-foreground"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
