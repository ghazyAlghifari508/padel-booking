"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.phone) errs.phone = "Phone number is required.";
    if (form.password.length < 6) errs.password = "Min 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const ok = register({ name: form.name, email: form.email, phone: form.phone });
    if (!ok) {
      setErrors({ email: "Email already registered." });
      return;
    }
    router.push("/courts");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="court-lines relative hidden flex-col justify-between overflow-hidden bg-foreground p-10 lg:flex">
        <Logo className="text-xl text-white [&>span:last-child]:text-white" />
        <div className="max-w-md">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Join CourtFlow</span>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white">
            Book faster than your group chat replies.
          </h2>
          <p className="mt-3 max-w-sm text-slate-200">Create an account to pick courts, hold slots, and manage bookings.</p>
        </div>
        <p className="text-xs text-slate-300">© 2026 CourtFlow · Frontend demo</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="sky-card w-full max-w-sm rounded-[28px] p-6">
          <div className="lg:hidden"><Logo className="text-lg" /></div>
          <h1 className="mt-6 text-2xl font-extrabold text-foreground lg:mt-0">Create account</h1>
          <p className="mt-1 text-sm font-medium text-muted">Start booking in a minute.</p>

          <form onSubmit={submit} className="mt-7 flex flex-col gap-4" noValidate>
            <Field label="Full name" htmlFor="name" required error={errors.name}>
              <Input id="name" value={form.name} onChange={set("name")} placeholder="Andi Pratama" autoComplete="name" />
            </Field>
            <Field label="Email" htmlFor="email" required error={errors.email}>
              <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@mail.com" autoComplete="email" />
            </Field>
            <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
              <Input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="0812-xxxx-xxxx" autoComplete="tel" />
            </Field>
            <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 6 characters.">
              <Input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" />
            </Field>
            <Button type="submit" size="lg" className="mt-1 w-full">Create account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link href="/login" className="font-extrabold text-primary-hover hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
