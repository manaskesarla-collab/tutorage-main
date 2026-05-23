DROP POLICY "Anyone can submit inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit valid inquiries"
ON public.inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(parent_name) BETWEEN 1 AND 120
  AND length(parent_email) BETWEEN 3 AND 255
  AND parent_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(message) BETWEEN 5 AND 2000
  AND (parent_phone IS NULL OR length(parent_phone) <= 30)
  AND (student_grade IS NULL OR length(student_grade) <= 40)
  AND (subject IS NULL OR length(subject) <= 80)
);