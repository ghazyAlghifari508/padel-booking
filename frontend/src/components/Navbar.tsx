"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./ui/misc";
import { Button } from "./ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/courts", label: "Courts" },
  { href: "/my-bookings", label: "My Bookings" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4">
        <Link href="/" className="text-lg" aria-label="CourtFlow home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-primary-soft/70 p-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                pathname.startsWith(l.href)
                  ? "bg-primary text-on-primary shadow-[0_8px_18px_rgba(14,165,233,0.22)]"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user?.role === "admin" && (
            <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-extrabold leading-tight text-foreground">{user.name}</p>
                <p className="text-xs leading-tight text-muted">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                aria-label="Logout"
                className="cursor-pointer rounded-full p-2 text-muted hover:bg-status-cancelled-soft hover:text-status-cancelled"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={() => router.push("/login")}>Login</Button>
          )}
        </div>

        <button
          className="cursor-pointer rounded-full border border-border bg-surface p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="court-lines border-t border-border bg-surface px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-full px-4 py-3 text-sm font-bold",
                pathname.startsWith(l.href) ? "bg-primary text-on-primary" : "text-foreground hover:bg-primary-soft",
              )}
            >
              {l.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block rounded-full px-4 py-3 text-sm font-bold text-foreground hover:bg-primary-soft">
              Admin Dashboard
            </Link>
          )}
          <div className="mt-2 border-t border-border pt-2">
            {user ? (
              <button
                onClick={() => { logout(); router.push("/login"); }}
                className="flex w-full items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-status-cancelled hover:bg-status-cancelled-soft"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link href="/login" className="block rounded-full px-4 py-3 text-sm font-bold text-primary-hover">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
