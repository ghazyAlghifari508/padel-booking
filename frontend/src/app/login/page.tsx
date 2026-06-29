"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, loginAs } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("andi@mail.com");
  const [password, setPassword] = useState("password");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    login(email);
    router.push("/courts");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="court-lines relative hidden flex-col justify-between overflow-hidden bg-foreground p-10 lg:flex">
        <Logo className="text-xl text-white [&>span:last-child]:text-white" />
        <div className="max-w-md">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Sky Rally access</span>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white">
            Your court, <span className="text-primary">your time.</span>
          </h2>
          <p className="mt-3 max-w-sm text-slate-200">
            Sign in, grab a bright available slot, and keep your padel schedule tidy.
          </p>
        </div>
        <p className="text-xs text-slate-300">© 2026 CourtFlow · Frontend demo</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="sky-card w-full max-w-sm rounded-[28px] p-6">
          <div className="lg:hidden"><Logo className="text-lg" /></div>
          <h1 className="mt-6 text-2xl font-extrabold text-foreground lg:mt-0">Welcome back</h1>
          <p className="mt-1 text-sm font-medium text-muted">Login to book your next match.</p>

          <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
            <Field label="Email" htmlFor="email" required error={error && !email ? error : undefined}>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
            </Field>
            <Field label="Password" htmlFor="password" required>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-11" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted hover:bg-primary-soft hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            {error && email && <p className="text-xs font-semibold text-status-cancelled" role="alert">{error}</p>}
            <Button type="submit" size="lg" className="mt-1 w-full">Login</Button>
          </form>

          <div className="mt-5 rounded-[20px] border border-dashed border-primary/30 bg-primary-soft p-3">
            <p className="text-xs font-extrabold text-muted">Demo quick login (no backend):</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { loginAs("user"); router.push("/courts"); }}>As User</Button>
              <Button size="sm" variant="highlight" className="flex-1" onClick={() => { loginAs("admin"); router.push("/admin"); }}>As Admin</Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            No account? <Link href="/register" className="font-extrabold text-primary-hover hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
