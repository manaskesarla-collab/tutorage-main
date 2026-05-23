import { supabase } from "@/integrations/supabase/client";

export type Tutor = {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  subjects: string[];
  boards: string[];
  classes: string[];
  mode: "online" | "home" | "both";
  hourly_rate: number;
  years_experience: number;
  rating: number;
  reviews_count: number;
  locality: string;
  latitude: number;
  longitude: number;
  is_verified: boolean;
};

export async function fetchTutors(): Promise<Tutor[]> {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Tutor[];
}

export async function fetchTutor(id: string): Promise<Tutor | null> {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Tutor) ?? null;
}

export type InquiryInput = {
  tutor_id: string;
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
  student_grade?: string;
  subject?: string;
  message: string;
};

export async function submitInquiry(input: InquiryInput) {
  const { error } = await supabase.from("inquiries").insert(input);
  if (error) throw error;
}

export const ALL_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Kannada", "Sanskrit",
  "Computer Science", "Social Studies",
];

export const ALL_BOARDS = ["CBSE", "ICSE", "ISC", "State", "IB", "IGCSE"];
export const ALL_MODES: Array<{ value: "online"|"home"|"both"; label: string }> = [
  { value: "both", label: "Any" },
  { value: "home", label: "At home" },
  { value: "online", label: "Online" },
];
