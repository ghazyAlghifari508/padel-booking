"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/misc";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, loginAs } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("andi@mail.com");
  const [password, setPassword] = useState("password");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Email dan kata sandi wajib diisi.");
    login(email);
    router.push("/courts");
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden border-r bg-surface lg:block">
        <div className="flex h-20 items-center border-b px-10"><Logo /></div>
        <div className="flex min-h-[calc(100vh-80px)] flex-col justify-between p-10">
          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Akses Member</p>
            <h1 className="mt-6 max-w-xl text-[72px] font-normal leading-[1.05] tracking-[-0.04em]">Booking lapangan seperti beli perlengkapan olahraga premium.</h1>
          </div>
          <div className="grid grid-cols-3">
            {['LAPANGAN','SLOT','BAYAR'].map((x) => <div key={x} className="p-4 text-[13px] uppercase tracking-[0.08em] text-muted">{x}</div>)}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Masuk</p>
          <h2 className="mt-4 text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Kembali ke konsol booking Anda.</h2>
          <form onSubmit={submit} className="mt-10 space-y-5">
            <Field label="Email" htmlFor="email" required error={error && !email ? error : undefined}><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@email.com" /></Field>
            <Field label="Kata Sandi" htmlFor="password" required><div className="relative"><Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-14" /><button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Sembunyikan" : "Tampilkan"} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full hover:bg-muted-surface">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></Field>
            {error && email && <p className="text-[13px] underline" role="alert">{error}</p>}
            <Button type="submit" size="lg" className="w-full">Masuk</Button>
          </form>
          <div className="mt-6 grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => { loginAs("user"); router.push("/courts"); }}>Demo Pengguna</Button><Button variant="outline" onClick={() => { loginAs("admin"); router.push("/admin"); }}>Demo Admin</Button></div>
          <p className="mt-8 text-center text-[13px] text-muted">Belum punya akun? <Link href="/register" className="text-foreground underline">Buat akun</Link></p>
        </div>
      </section>
    </main>
  );
}
