import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, MapPin, Star, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchTutor, submitInquiry, type Tutor } from "@/lib/tutors";

export const Route = createFileRoute("/tutors/$id")({
  loader: async ({ params }) => {
    const tutor = await fetchTutor(params.id);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tutor.name} — Tutor in ${loaderData.tutor.locality} | Tutorage` },
          {
            name: "description",
            content: `${loaderData.tutor.name} teaches ${loaderData.tutor.subjects.slice(0, 3).join(", ")} in ${loaderData.tutor.locality}, Bengaluru. ₹${loaderData.tutor.hourly_rate}/hr.`,
          },
          { property: "og:title", content: `${loaderData.tutor.name} on Tutorage` },
          { property: "og:image", content: loaderData.tutor.photo_url },
        ]
      : [{ title: "Tutor — Tutorage" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Tutor not found</h1>
        <Link to="/search" className="mt-6 inline-block text-primary hover:underline">
          ← Back to search
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: TutorPage,
});

function TutorPage() {
  const { tutor } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-20">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <article>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <img
                src={tutor.photo_url}
                alt={tutor.name}
                className="h-32 w-32 flex-none rounded-2xl object-cover ring-4 ring-cream"
              />
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-4xl font-semibold flex flex-wrap items-center gap-2">
                  {tutor.name}
                  {tutor.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {tutor.locality}, Bengaluru
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[var(--saffron)] text-[var(--saffron)]" />
                    {tutor.rating.toFixed(1)} ({tutor.reviews_count} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {tutor.years_experience} yrs experience
                  </span>
                </p>
                <p className="mt-3 font-display text-3xl font-semibold text-primary">
                  ₹{tutor.hourly_rate}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">/ hour</span>
                </p>
              </div>
            </div>

            <Section title="About">
              <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
            </Section>

            <Section title="Subjects">
              <ChipList items={tutor.subjects} accent />
            </Section>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card title="Boards">
                <ChipList items={tutor.boards} />
              </Card>
              <Card title="Classes">
                <ChipList items={tutor.classes} />
              </Card>
            </div>

            <Section title="Teaching mode">
              <div className="flex flex-wrap gap-3">
                {(tutor.mode === "home" || tutor.mode === "both") && (
                  <ModePill icon={<GraduationCap className="h-4 w-4" />} label="Home visits in your locality" />
                )}
                {(tutor.mode === "online" || tutor.mode === "both") && (
                  <ModePill icon={<GraduationCap className="h-4 w-4" />} label="Online (Zoom / Meet)" />
                )}
              </div>
            </Section>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <InquiryForm tutor={tutor} />
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChipList({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={it}
          className={
            accent
              ? "rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              : "rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
          }
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function ModePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
      {icon}
      {label}
    </span>
  );
}

function InquiryForm({ tutor }: { tutor: Tutor }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      await submitInquiry({
        tutor_id: tutor.id,
        parent_name: String(fd.get("parent_name") || ""),
        parent_email: String(fd.get("parent_email") || ""),
        parent_phone: String(fd.get("parent_phone") || "") || undefined,
        student_grade: String(fd.get("student_grade") || "") || undefined,
        subject: String(fd.get("subject") || "") || undefined,
        message: String(fd.get("message") || ""),
      });
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not send. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-xl font-semibold">Inquiry sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {tutor.name.split(" ")[0]} typically replies within 2 hours. We've also emailed you a copy.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="font-display text-xl font-semibold">Message {tutor.name.split(" ")[0]}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Zero booking fees. The tutor will get back to you directly.
      </p>

      <div className="mt-5 grid gap-3">
        <Field name="parent_name" label="Your name" required />
        <Field name="parent_email" label="Email" type="email" required />
        <Field name="parent_phone" label="Phone (optional)" type="tel" />
        <div className="grid grid-cols-2 gap-3">
          <Field name="student_grade" label="Student class" placeholder="e.g. 10th" />
          <Field name="subject" label="Subject" placeholder="e.g. Maths" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Message</label>
          <textarea
            name="message"
            required
            minLength={5}
            rows={4}
            placeholder="Hi! Looking for help with..."
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-destructive">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-[var(--shadow-warm)] hover:opacity-95 disabled:opacity-60 transition"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
