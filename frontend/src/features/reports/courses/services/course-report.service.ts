import { http } from "@/services/http.service";

import type { CourseReportRecord } from "../types/course-report.types";

const unwrapCourses = (responseData: unknown): CourseReportRecord[] => {
  if (Array.isArray(responseData)) {
    return responseData as CourseReportRecord[];
  }

  if (!responseData || typeof responseData !== "object") {
    return [];
  }

  const payload = responseData as { data?: unknown; courses?: unknown };

  if (Array.isArray(payload.courses)) {
    return payload.courses as CourseReportRecord[];
  }

  if (Array.isArray(payload.data)) {
    return payload.data as CourseReportRecord[];
  }

  if (payload.data && typeof payload.data === "object") {
    const nested = payload.data as { data?: unknown; courses?: unknown };

    if (Array.isArray(nested.courses)) {
      return nested.courses as CourseReportRecord[];
    }

    if (Array.isArray(nested.data)) {
      return nested.data as CourseReportRecord[];
    }
  }

  return [];
};

export const getCourseReport = async () => {
  const response = await http.get("/api/courses");
  return unwrapCourses(response.data);
};
