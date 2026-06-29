import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Court } from "@/lib/types";
import { formatIDR } from "@/lib/format";

export function CourtCardVertical({ court }: { court: Court }) {
  return (
    <Link href={`/courts/${court.id}`} className="group block rounded-2xl bg-surface">
      <div className="relative aspect-3/4 overflow-hidden rounded-t-2xl bg-muted-surface">
        <Image
          src={court.imageUrl}
          alt={court.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
        />
        <span className="absolute left-4 top-4 h-3 w-3 bg-primary" aria-hidden />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 pb-4">
          <div>
            <h3 className="text-[22px] font-normal leading-tight tracking-[-0.02em] text-foreground">{court.name}</h3>
            <p className="mt-2 flex items-center gap-1 text-[13px] text-muted"><MapPin className="h-4 w-4" /> {court.location}</p>
          </div>
          <p className="text-right text-[13px] uppercase tracking-[0.08em] text-foreground">{formatIDR(court.pricePerHour)}/jam</p>
        </div>
        <p className="mt-4 min-h-12 text-[13px] leading-relaxed text-muted">{court.description}</p>
        <span className="mt-5 block rounded-full bg-primary px-5 py-3 text-center text-[13px] uppercase tracking-[0.08em] text-foreground">Lihat Jadwal</span>
      </div>
    </Link>
  );
}
