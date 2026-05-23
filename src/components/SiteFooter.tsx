export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <p className="font-display text-2xl font-semibold">Tutorage</p>
          <p className="mt-2 text-muted-foreground max-w-xs">
            Bengaluru’s neighborhood tutor directory. Built with love in Karnataka.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">For students</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Browse tutors</li>
            <li>Subjects</li>
            <li>Pricing guide</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">For tutors</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>List your profile</li>
            <li>Verification</li>
            <li>Inquiry inbox</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tutorage · Bengaluru, Karnataka
      </div>
    </footer>
  );
}
