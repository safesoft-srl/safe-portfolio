import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profile.service";
import { getAcademics } from "../services/academic.service";

export function useAcademic() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const portfolioId = profileQuery.data?.id ?? null;

  const academicsQuery = useQuery({
    queryKey: ["academics", portfolioId],
    queryFn: () => getAcademics(portfolioId as number),
    enabled: Boolean(portfolioId),
  });

  return {
    academics: academicsQuery.data ?? [],
    isLoading: profileQuery.isLoading || academicsQuery.isLoading,
    isFetching: academicsQuery.isFetching,
    portfolioId,
    profile: profileQuery.data,
    refetchAcademics: academicsQuery.refetch,
  };
}
