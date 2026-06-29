"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/misc";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
    if (!register({ name: form.name, email: form.email, phone: form.phone })) return setErrors({ email: "Email already registered." });
    router.push("/courts");
  };

  return (
    <main className="min-h-screen bg-surface">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4"><Logo /><Link href="/login" className="text-[13px] uppercase tracking-[0.08em] underline">Login</Link></header>
      <section className="mx-auto grid max-w-7xl gap-10 border-t border-border px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Create profile</p>
          <h1 className="mt-6 text-[56px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[72px]">A booking account with product-catalog clarity.</h1>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-border p-5 md:p-8" noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" htmlFor="name" required error={errors.name}><Input id="name" value={form.name} onChange={set("name")} placeholder="Andi Pratama" autoComplete="name" /></Field>
            <Field label="Email" htmlFor="email" required error={errors.email}><Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@mail.com" autoComplete="email" /></Field>
            <Field label="Phone" htmlFor="phone" required error={errors.phone}><Input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="0812-xxxx-xxxx" autoComplete="tel" /></Field>
            <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 6 characters."><Input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" /></Field>
          </div>
          <Button type="submit" size="lg" className="mt-8 w-full">Create account</Button>
        </form>
      </section>
    </main>
  );
}
