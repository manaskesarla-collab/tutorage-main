import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { TutorCard } from "@/components/TutorCard";
import { TutorMap } from "@/components/TutorMap";
import {
  fetchTutors,
  ALL_SUBJECTS,
  ALL_BOARDS,
  ALL_MODES,
  type Tutor,
} from "@/lib/tutors";
import { Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Browse tutors in Bengaluru — Tutorage" },
      {
        name: "description",
        content:
          "Search verified home and online tutors across Bengaluru by subject, board, locality and price. Live map view.",
      },
      { property: "og:title", content: "Browse tutors in Bengaluru" },
      { property: "og:description", content: "Live map and filters for Bengaluru tutors." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });

  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const [board, setBoard] = useState<string | null>(null);
  const [mode, setMode] = useState<Tutor["mode"]>("both");
  const [maxRate, setMaxRate] = useState(2500);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tutors.filter((t) => {
      if (subject && !t.subjects.includes(subject)) return false;
      if (board && !t.boards.includes(board)) return false;
      if (mode !== "both" && t.mode !== mode && t.mode !== "both") return false;
      if (t.hourly_rate > maxRate) return false;
      if (q) {
        const hay = `${t.name} ${t.locality} ${t.subjects.join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [tutors, q, subject, board, mode, maxRate]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <SiteHeader />

      {/* Filter bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-6 py-3">
          <label className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tutors, subjects, localities…"
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </label>

          <Select
            label="Subject"
            value={subject ?? ""}
            onChange={(v) => setSubject(v || null)}
            options={["", ...ALL_SUBJECTS]}
            renderLabel={(v) => (v === "" ? "All subjects" : v)}
          />
          <Select
            label="Board"
            value={board ?? ""}
            onChange={(v) => setBoard(v || null)}
            options={["", ...ALL_BOARDS]}
            renderLabel={(v) => (v === "" ? "All boards" : v)}
          />
          <Select
            label="Mode"
            value={mode}
            onChange={(v) => setMode(v as Tutor["mode"])}
            options={ALL_MODES.map((m) => m.value)}
            renderLabel={(v) => ALL_MODES.find((m) => m.value === v)?.label ?? v}
          />

          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
            <span className="text-muted-foreground">Max ₹{maxRate}/hr</span>
            <input
              type="range"
              min={300}
              max={2500}
              step={100}
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="accent-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid flex-1 min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Results list */}
        <div className="overflow-y-auto px-6 py-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h1 className="font-display text-2xl font-semibold">
              {isLoading ? "Loading…" : `${filtered.length} tutors in Bengaluru`}
            </h1>
            <p className="text-xs text-muted-foreground">Sorted by rating</p>
          </div>

          {!isLoading && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No tutors match those filters. Try widening your search.
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((t) => (
              <TutorCard key={t.id} tutor={t} onHover={setHighlightedId} />
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="relative hidden bg-secondary lg:block">
          <TutorMap tutors={filtered} highlightedId={highlightedId} />
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  renderLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  renderLabel: (v: string) => string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none font-medium"
      >
        {options.map((o) => (
          <option key={o} value={o}>{renderLabel(o)}</option>
        ))}
      </select>
    </label>
  );
}
