import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/hero-tutor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tutorage — Find trusted home & online tutors in Bengaluru" },
      {
        name: "description",
        content:
          "Discover verified home and online tutors near you in Bengaluru. Browse by subject, board, locality and price. Zero booking fees.",
      },
      { property: "og:title", content: "Tutorage — Bengaluru’s tutor directory" },
      { property: "og:description", content: "The neighborhood way to find a tutor." },
    ],
  }),
  component: Index,
});

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Computer Science", "Hindi", "Kannada",
];

const LOCALITIES = [
  "Indiranagar", "Koramangala", "HSR Layout", "Whitefield",
  "Jayanagar", "Malleshwaram", "JP Nagar", "Marathahalli",
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-24">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-3 py-1 text-xs font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[var(--saffron)]" />
              Now in Bengaluru, Karnataka
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Find a tutor <br />
              <span className="italic text-primary">around the corner.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Tutorage is Bengaluru’s neighborhood directory of verified home and online
              tutors. Browse by subject, board, and locality — message tutors directly,
              no booking fees.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/search"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-[var(--shadow-warm)] hover:opacity-95 transition"
              >
                <Search className="h-4 w-4" />
                Browse tutors
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-base font-medium hover:bg-secondary transition"
              >
                I’m a tutor
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 text-sm">
              <Stat n="200+" l="verified tutors" />
              <Stat n="40+" l="localities" />
              <Stat n="₹0" l="booking fees" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[var(--saffron)]/15 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-warm)]">
              <img
                src={heroImg}
                alt="A Bengaluru tutor with a student at a sunlit study desk"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:block">
              <p className="text-xs text-muted-foreground">Avg. response</p>
              <p className="font-display text-2xl font-semibold text-primary">under 2 hrs</p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SUBJECTS */}
      <section className="bg-cream/60 border-y border-border/60 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Popular subjects
            </h2>
            <Link to="/search" className="text-sm font-medium text-primary hover:underline">
              See all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUBJECTS.map((s) => (
              <Link
                key={s}
                to="/search"
                className="group rounded-2xl border border-border bg-card px-5 py-6 transition hover:border-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <p className="font-display text-xl font-semibold">{s}</p>
                <p className="mt-1 text-xs text-muted-foreground group-hover:text-primary">
                  Browse tutors →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            How Tutorage works
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Like asking a neighbor for a recommendation — only faster, with verified
            profiles and reviews.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              icon={<MapPin className="h-5 w-5" />}
              title="Browse near you"
              body="Filter by subject, board, class, locality and price on an interactive Bengaluru map."
            />
            <Step
              n="02"
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Pick someone you trust"
              body="See verified badges, ratings, real reviews, and the tutor’s teaching style."
            />
            <Step
              n="03"
              icon={<Sparkles className="h-5 w-5" />}
              title="Message directly"
              body="No middleman, no commission. Agree on time, mode and rate with the tutor."
            />
          </div>
        </div>
      </section>

      {/* LOCALITIES */}
      <section id="cities" className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] opacity-70">
                Live in Bengaluru
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Tutors in every neighborhood
              </h2>
            </div>
            <p className="max-w-sm opacity-80">
              Mumbai, Hyderabad and Chennai are next on our list — drop your city in
              the inquiry form to vote.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {LOCALITIES.map((l) => (
              <Link
                key={l}
                to="/search"
                className="rounded-full border border-primary-foreground/25 px-4 py-2 text-sm hover:bg-primary-foreground/10 transition"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-primary">{n}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{l}</p>
    </div>
  );
}

function Step({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="font-display text-3xl text-muted-foreground/40">{n}</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
