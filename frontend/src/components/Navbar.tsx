"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./ui/misc";
import { cn } from "@/lib/cn";

const links = [
  { href: "/courts", label: "Courts" },
  { href: "/my-bookings", label: "Bookings" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logoutNow = () => { logout(); router.push("/login"); };

  return (
    <header className="bg-surface">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4">
        <Link href="/" aria-label="CourtFlow home"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => <Link key={l.href} href={l.href} className={cn("text-[13px] uppercase tracking-[0.08em] text-foreground", pathname.startsWith(l.href) && "underline decoration-primary decoration-4 underline-offset-8")}>{l.label}</Link>)}
          {user?.role === "admin" && <Link href="/admin" className="text-[13px] uppercase tracking-[0.08em] text-foreground">Admin</Link>}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? <><span className="text-[13px] uppercase tracking-[0.08em] text-muted">{user.name}</span><button onClick={logoutNow} aria-label="Logout" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-primary"><LogOut className="h-5 w-5" /></button></> : <Link href="/login" className="rounded-full bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.08em] text-foreground">Login</Link>}
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-y border-border bg-surface px-4 py-4 md:hidden"><div className="flex flex-col gap-3">{links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-full border border-border px-5 py-3 text-[13px] uppercase tracking-[0.08em]">{l.label}</Link>)}{user?.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)} className="rounded-full border border-border px-5 py-3 text-[13px] uppercase tracking-[0.08em]">Admin</Link>}{user ? <button onClick={logoutNow} className="rounded-full bg-foreground px-5 py-3 text-[13px] uppercase tracking-[0.08em] text-white">Logout</button> : <Link href="/login" className="rounded-full bg-primary px-5 py-3 text-[13px] uppercase tracking-[0.08em]">Login</Link>}</div></div>}
    </header>
  );
}
