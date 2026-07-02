"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/misc";
import { useAuth } from "@/lib/auth";

const HERO_IMG = "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1200&q=80";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Nama wajib diisi.";
    if (!form.email) errs.email = "Email wajib diisi.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = "Email tidak valid.";
    if (!form.phone) errs.phone = "Nomor telepon wajib diisi.";
    if (form.password.length < 6) errs.password = "Minimal 6 karakter.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await register(form);
      router.push("/courts");
    } catch (err) {
      const e = err as { fields?: Record<string, string>; message?: string };
      setErrors(e.fields ?? { email: e.message ?? "Pendaftaran gagal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left — hero image */}
      <div className="relative hidden w-1/2 flex-col lg:flex">
        <Image
          src={HERO_IMG}
          alt="Lapangan padel"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="absolute left-8 top-8">
          <Logo className="text-white [&_*]:text-white [&_*]:fill-white" />
        </div>

        <div className="absolute bottom-10 left-8 right-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            CourtFlow · Padel Booking
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
            Daftar sekarang,<br />main besok pagi.
          </h2>
          <div className="mt-6 flex gap-4">
            {["Gratis Daftar", "Tanpa Biaya Tersembunyi", "Konfirmasi Instan"].map((t) => (
              <div key={t} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-10">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground">Buat akun baru</h1>
          <p className="mt-1 text-sm text-muted">Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-foreground underline underline-offset-2">
              Masuk
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
            <Field label="Nama Lengkap" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Nama Anda"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="anda@email.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Nomor Telepon" htmlFor="phone" required error={errors.phone}>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="0812-xxxx-xxxx"
                autoComplete="tel"
              />
            </Field>

            <Field
              label="Kata Sandi"
              htmlFor="password"
              required
              error={errors.password}
              hint="Minimal 6 karakter."
            >
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Field>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? "Memproses…" : "Buat Akun"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Dengan mendaftar, Anda menyetujui syarat & ketentuan CourtFlow.
          </p>
        </div>
      </div>
    </main>
  );
}
