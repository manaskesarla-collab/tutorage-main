import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ALL_BOARDS, ALL_SUBJECTS } from "@/lib/tutors";

export const Route = createFileRoute("/become-a-tutor")({
  head: () => ({
    meta: [
      { title: "Become a tutor — Tutorage" },
      { name: "description", content: "Publish your tutor profile on Tutorage and start receiving inquiries from parents in Bengaluru." },
    ],
  }),
  component: BecomeTutorPage,
});

const ALL_CLASSES = ["6", "7", "8", "9", "10", "11", "12"];
const BENGALURU_LOCALITIES: Record<string, [number, number]> = {
  Indiranagar: [12.9719, 77.6412],
  Koramangala: [12.9352, 77.6245],
  Jayanagar: [12.9250, 77.5938],
  Whitefield: [12.9698, 77.7500],
  "HSR Layout": [12.9116, 77.6473],
  Malleshwaram: [13.0035, 77.5709],
  Banashankari: [12.9250, 77.5466],
  "JP Nagar": [12.9081, 77.5831],
};

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function BecomeTutorPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasListing, setHasListing] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [mode, setMode] = useState<"online" | "home" | "both">("both");
  const [hourlyRate, setHourlyRate] = useState(600);
  const [yearsExperience, setYearsExperience] = useState(1);
  const [locality, setLocality] = useState<keyof typeof BENGALURU_LOCALITIES>("Indiranagar");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("tutors").select("id").eq("owner_id", user.id).maybeSingle().then(({ data }) => {
      setHasListing(!!data);
    });
  }, [user]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      if (subjects.length === 0) throw new Error("Pick at least one subject.");
      if (boards.length === 0) throw new Error("Pick at least one board.");
      if (classes.length === 0) throw new Error("Pick at least one class.");
      const [latitude, longitude] = BENGALURU_LOCALITIES[locality];
      const { error } = await supabase.from("tutors").insert({
        owner_id: user.id,
        name,
        bio,
        photo_url: photoUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
        subjects,
        boards,
        classes,
        mode,
        hourly_rate: hourlyRate,
        years_experience: yearsExperience,
        locality,
        latitude,
        longitude,
      });
      if (error) throw error;
      navigate({ to: "/search" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save listing.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 px-6 py-16 text-center text-muted-foreground">Loading…</main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
              <h1 className="mt-1 font-display text-4xl tracking-tight">
                {hasListing ? "Your tutor listing" : "Create your tutor listing"}
              </h1>
            </div>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </div>

          {hasListing && (
            <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
              You already have a listing.{" "}
              <Link to="/search" className="text-primary underline">View it on the search page</Link>.
            </div>
          )}

          {!hasListing && (
            <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Photo URL (optional)</label>
                  <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Short bio</label>
                <textarea required minLength={20} maxLength={600} rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <p className="mt-1 text-xs text-muted-foreground">{bio.length}/600</p>
              </div>

              <div>
                <label className="text-sm font-medium">Subjects</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_SUBJECTS.map((s) => (
                    <Toggle key={s} active={subjects.includes(s)} onClick={() => toggle(subjects, setSubjects, s)}>{s}</Toggle>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Boards</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_BOARDS.map((b) => (
                    <Toggle key={b} active={boards.includes(b)} onClick={() => toggle(boards, setBoards, b)}>{b}</Toggle>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Classes</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_CLASSES.map((c) => (
                    <Toggle key={c} active={classes.includes(c)} onClick={() => toggle(classes, setClasses, c)}>Class {c}</Toggle>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Mode</label>
                  <select value={mode} onChange={(e) => setMode(e.target.value as "online" | "home" | "both")} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option value="both">Both</option>
                    <option value="home">At home</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Hourly rate (₹)</label>
                  <input type="number" min={100} max={10000} value={hourlyRate} onChange={(e) => setHourlyRate(parseInt(e.target.value || "0", 10))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Years of experience</label>
                  <input type="number" min={0} max={50} value={yearsExperience} onChange={(e) => setYearsExperience(parseInt(e.target.value || "0", 10))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Locality (Bengaluru)</label>
                <select value={locality} onChange={(e) => setLocality(e.target.value as keyof typeof BENGALURU_LOCALITIES)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {Object.keys(BENGALURU_LOCALITIES).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
                {submitting ? "Publishing…" : "Publish my listing"}
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
