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
    if (!form.name) errs.name = "Nama wajib diisi.";
    if (!form.email) errs.email = "Email wajib diisi.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = "Masukkan email yang valid.";
    if (!form.phone) errs.phone = "Nomor telepon wajib diisi.";
    if (form.password.length < 6) errs.password = "Minimal 6 karakter.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (!register({ name: form.name, email: form.email, phone: form.phone })) return setErrors({ email: "Email sudah terdaftar." });
    router.push("/courts");
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4"><Logo /><Link href="/login" className="text-[13px] uppercase tracking-[0.08em] underline">Masuk</Link></header>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Buat Profil</p>
          <h1 className="mt-6 text-[56px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[72px]">Akun booking dengan kejelasan seperti katalog produk.</h1>
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-surface p-5 md:p-8" noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nama Lengkap" htmlFor="name" required error={errors.name}><Input id="name" value={form.name} onChange={set("name")} placeholder="Andi Pratama" autoComplete="name" /></Field>
            <Field label="Email" htmlFor="email" required error={errors.email}><Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="anda@email.com" autoComplete="email" /></Field>
            <Field label="Nomor Telepon" htmlFor="phone" required error={errors.phone}><Input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="0812-xxxx-xxxx" autoComplete="tel" /></Field>
            <Field label="Kata Sandi" htmlFor="password" required error={errors.password} hint="Minimal 6 karakter."><Input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" /></Field>
          </div>
          <Button type="submit" size="lg" className="mt-8 w-full">Buat Akun</Button>
        </form>
      </section>
    </main>
  );
}
