import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Tutor } from "@/lib/tutors";

const modeLabel: Record<Tutor["mode"], string> = {
  online: "Online",
  home: "Home visits",
  both: "Online + Home",
};

export function TutorCard({ tutor, onHover }: { tutor: Tutor; onHover?: (id: string | null) => void }) {
  return (
    <Link
      to="/tutors/$id"
      params={{ id: tutor.id }}
      onMouseEnter={() => onHover?.(tutor.id)}
      onMouseLeave={() => onHover?.(null)}
      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <img
        src={tutor.photo_url}
        alt={tutor.name}
        loading="lazy"
        className="h-24 w-24 flex-none rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-tight flex items-center gap-1.5">
              {tutor.name}
              {tutor.is_verified && (
                <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />
              )}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {tutor.locality} · {modeLabel[tutor.mode]}
            </p>
          </div>
          <div className="text-right flex-none">
            <p className="font-display text-xl font-semibold text-primary">
              ₹{tutor.hourly_rate}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">per hour</p>
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{tutor.bio}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-medium text-foreground">
            <Star className="h-3 w-3 fill-[var(--saffron)] text-[var(--saffron)]" />
            {tutor.rating.toFixed(1)} <span className="text-muted-foreground">({tutor.reviews_count})</span>
          </span>
          {tutor.subjects.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
              {s}
            </span>
          ))}
          <span className="text-muted-foreground">· {tutor.years_experience} yrs exp</span>
        </div>
      </div>
    </Link>
  );
}
