import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface WorkExperienceReportParams {
  status?: string;
  created_period?: string;
  date_from?: string;
  date_to?: string;
}

export interface WorkExperienceReportData {
  summary: {
    total_experiences: number;
    currently_working: number;
    past_jobs: number;
    cached_at: string;
  };
  monthly_trend: { month: string; count: number }[];
  top_positions: { position: string; count: number }[];
  top_companies: { company: string; count: number }[];
  detailed_list: {
    id: number;
    user_name: string;
    company: string;
    position: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    created_at: string;
  }[];
}

export function useExperienceReport(params?: WorkExperienceReportParams) {
  return useQuery<WorkExperienceReportData>({
    queryKey: ["workExperienceReport", params],
    queryFn: async () => {
      const { data } = await api.get("/api/moderator/reports/work-experiences", {
        params,
      });
      return data.data;
    },
    // Mantener datos anteriores mientras se hace fetch para evitar flickering
    placeholderData: keepPreviousData,
    // The backend caches for 15 minutes, we can cache on frontend for a bit too
    staleTime: 1000 * 60 * 5,
  });
}
