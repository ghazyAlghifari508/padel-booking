import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Sparkles } from "lucide-react";
import type { Court } from "@/lib/types";
import { formatIDR } from "@/lib/format";

export function CourtCard({ court }: { court: Court }) {
  const active = court.status === "active";

  return (
    <Link
      href={`/courts/${court.id}`}
      className="group sky-card flex flex-col overflow-hidden rounded-[24px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(14,165,233,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-soft">
        <Image
          src={court.imageUrl}
          alt={court.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="court-lines absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground shadow-sm">
          {formatIDR(court.pricePerHour)}/hr
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-extrabold text-primary-hover shadow-sm">
          {active ? "Available" : "Inactive"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-extrabold text-foreground">{court.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
          <MapPin className="h-3.5 w-3.5" /> {court.location}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{court.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-primary-hover">
            <Clock className="h-3.5 w-3.5" /> Next: 08:00
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Fast book
          </span>
        </div>
      </div>
    </Link>
  );
}
