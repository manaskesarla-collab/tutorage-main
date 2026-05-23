CREATE TABLE public.tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  boards TEXT[] NOT NULL DEFAULT '{}',
  classes TEXT[] NOT NULL DEFAULT '{}',
  mode TEXT NOT NULL DEFAULT 'both',
  hourly_rate INTEGER NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  locality TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors are viewable by everyone"
  ON public.tutors FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create their tutor listing"
  ON public.tutors FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their tutor listing"
  ON public.tutors FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their tutor listing"
  ON public.tutors FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

CREATE INDEX idx_tutors_subjects ON public.tutors USING GIN(subjects);
CREATE INDEX idx_tutors_boards ON public.tutors USING GIN(boards);
CREATE INDEX idx_tutors_location ON public.tutors(latitude, longitude);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_tutors_updated_at
  BEFORE UPDATE ON public.tutors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();