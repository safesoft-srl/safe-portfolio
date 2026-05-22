import { useQuery } from "@tanstack/react-query";

import { usePortfolioId } from "@/hooks/usePortfolio";

import { getCourses } from "../services/course.service";

export function useCourse() {
  const portfolioId = usePortfolioId();

  const coursesQuery = useQuery({
    queryKey: ["courses", portfolioId],
    queryFn: () => getCourses(portfolioId as number),
    enabled: Boolean(portfolioId),
  });

  return {
    courses: coursesQuery.data ?? [],
    isFetching: coursesQuery.isFetching,
    portfolioId,
    refetchCourses: coursesQuery.refetch,
  };
}
