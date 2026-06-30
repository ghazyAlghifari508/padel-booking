"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/misc";
import { useAuth } from "@/lib/auth";

const HERO_IMG = "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("andi@mail.com");
  const [password, setPassword] = useState("password");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Email dan kata sandi wajib diisi.");
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(email === "admin@courtflow.id" ? "/admin" : "/courts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  const demo = async (kind: "user" | "admin") => {
    setError("");
    setLoading(true);
    try {
      await login(kind === "admin" ? "admin@courtflow.id" : "andi@mail.com", "password");
      router.push(kind === "admin" ? "/admin" : "/courts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
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
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Logo top-left */}
        <div className="absolute left-8 top-8">
          <Logo className="text-white [&_*]:text-white [&_*]:fill-white" />
        </div>

        {/* Bottom copy */}
        <div className="absolute bottom-10 left-8 right-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            CourtFlow · Padel Booking
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
            Lapangan premium,<br />booking dalam 60 detik.
          </h2>
          <div className="mt-6 flex gap-6">
            {["6 Lapangan", "2 Lokasi", "Bayar Fleksibel"].map((t) => (
              <div key={t} className="text-xs font-medium text-white/70">{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-10">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground">Masuk ke akun Anda</h1>
          <p className="mt-1 text-sm text-muted">Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-foreground underline underline-offset-2">
              Daftar gratis
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <Field label="Email" htmlFor="email" required error={error && !email ? error : undefined}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anda@email.com"
              />
            </Field>

            <Field label="Kata Sandi" htmlFor="password" required>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Sembunyikan" : "Tampilkan"}
                  className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-muted-surface"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {error && email && (
              <p className="text-sm text-red-600" role="alert">{error}</p>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? "Memproses…" : "Masuk"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-muted">atau coba demo</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={loading} onClick={() => demo("user")}>
              Demo Pengguna
            </Button>
            <Button variant="outline" disabled={loading} onClick={() => demo("admin")}>
              Demo Admin
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
