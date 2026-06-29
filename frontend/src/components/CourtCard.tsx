import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Court } from "@/lib/types";
import { formatIDR } from "@/lib/format";

export function CourtCard({ court }: { court: Court }) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="group flex gap-0 overflow-hidden rounded-xl border border-black/10 bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative w-32 shrink-0 sm:w-44">
        <Image
          src={court.imageUrl}
          alt={court.name}
          fill
          sizes="(min-width:640px) 176px, 128px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-tight text-foreground">{court.name}</h3>
            <span className="shrink-0 rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-on-primary">
              {formatIDR(court.pricePerHour)}<span className="font-normal text-on-primary/70">/jam</span>
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3" /> {court.location}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{court.description}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" /> Lihat jadwal tersedia
          </span>
          <span className="text-xs font-semibold text-foreground underline underline-offset-2 group-hover:text-primary">
            Pilih →
          </span>
        </div>
      </div>
    </Link>
  );
}
