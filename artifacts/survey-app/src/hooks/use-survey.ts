import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

export const surveySchema = z.object({
  year_in_school: z.string().min(1, "Please select your year in school"),
  stress_frequency: z.string().min(1, "Please select how often you feel stressed"),
  stress_source: z.string().min(1, "Please select your biggest source of stress"),
  coping_methods: z.array(z.string()).min(1, "Please select at least one coping method"),
  other_coping_text: z.string().optional(),
  sleep_hours: z.string().min(1, "Please select your average sleep hours"),
  additional_comments: z.string().min(1, "Please share any additional comments"),
}).refine((data) => {
  if (data.coping_methods.includes("Other")) {
    return data.other_coping_text && data.other_coping_text.trim().length > 0;
  }
  return true;
}, {
  message: "Please describe your other coping method",
  path: ["other_coping_text"]
});

export type SurveyPayload = z.infer<typeof surveySchema>;

export type SurveyResponse = SurveyPayload & {
  id: number;
  created_at: string;
};

export function useSurveyResponses() {
  return useQuery({
    queryKey: ["survey_responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase fetch error:", error);
        throw new Error(error.message);
      }
      return data as SurveyResponse[];
    },
  });
}

export function useSubmitSurvey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: SurveyPayload) => {
      const { data, error } = await supabase
        .from("survey_responses")
        .insert([payload])
        .select()
        .single();
        
      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
      }
      return data as SurveyResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey_responses"] });
    },
  });
}
