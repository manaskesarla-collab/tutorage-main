CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  student_grade TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anon) can submit an inquiry
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No public SELECT — inquiries are private; tutor dashboard (future) will use a service-role server fn.
CREATE INDEX idx_inquiries_tutor ON public.inquiries(tutor_id);
CREATE INDEX idx_inquiries_created ON public.inquiries(created_at DESC);