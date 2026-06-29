"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";

export function RoleSwitcher() {
  const { user, loginAs } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const switchTo = (role: "user" | "admin") => {
    loginAs(role);
    router.push(role === "admin" ? "/admin" : "/courts");
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-full border border-border bg-surface/95 p-1 shadow-[0_18px_45px_rgba(14,165,233,0.18)] backdrop-blur">
      <span className="flex items-center gap-1 pl-2 pr-1 text-xs font-bold text-muted">
        <UserCog className="h-3.5 w-3.5" /> Demo
      </span>
      <button
        onClick={() => switchTo("user")}
        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
          user.role === "user" ? "bg-primary text-on-primary" : "text-muted hover:bg-primary-soft"
        }`}
      >
        User
      </button>
      <button
        onClick={() => switchTo("admin")}
        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
          user.role === "admin" ? "bg-foreground text-white" : "text-muted hover:bg-primary-soft"
        }`}
      >
        Admin
      </button>
    </div>
  );
}
