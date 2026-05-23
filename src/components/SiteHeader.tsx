import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Tutorage
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/search" className="hover:text-primary transition">Find tutors</Link>
          <a href="#how" className="hover:text-primary transition">How it works</a>
          <a href="#cities" className="hover:text-primary transition">Cities</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition md:inline-flex"
          >
            Browse Bengaluru
          </Link>
          <Link
            to="/become-a-tutor"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Become a tutor
          </Link>
        </div>
      </div>
    </header>
  );
}
