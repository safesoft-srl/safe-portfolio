import { http } from "@/services/http.service";

import type { CourseFormData, CourseRecord } from "../types/course.types";

const buildCourseEndpoint = (portfolioId: number) => `/api/portfolios/${portfolioId}/courses`;

const mapCourseFormData = (data: CourseFormData) => {
  const formData = new FormData();

  formData.append("institution_name", data.institution_name.trim());
  formData.append("title", data.title.trim());
  formData.append("area", data.area.trim());
  formData.append("workload_hours", data.workload_hours.trim());
  formData.append("level", data.level.trim());
  formData.append("certificate_date", data.certificate_date ?? "");
  formData.append("is_current", data.is_current ? "1" : "0");
  formData.append("description", data.description.trim());
  formData.append("is_visible", data.is_visible ? "1" : "0");

  return formData;
};

const unwrapCourseList = (responseData: unknown): CourseRecord[] => {
  if (Array.isArray(responseData)) {
    return responseData as CourseRecord[];
  }

  if (responseData && typeof responseData === "object") {
    const payload = responseData as { data?: unknown };

    if (Array.isArray(payload.data)) {
      return payload.data as CourseRecord[];
    }

    if (payload.data && typeof payload.data === "object") {
      return [payload.data as CourseRecord];
    }
  }

  return [];
};

export const getCourses = async (portfolioId: number) => {
  const response = await http.get(`/api/courses/portfolio/${portfolioId}`);
  return unwrapCourseList(response.data);
};

export const createCourse = async (portfolioId: number, data: CourseFormData) => {
  const response = await http.post(buildCourseEndpoint(portfolioId), mapCourseFormData(data));
  return response.data;
};

export const updateCourse = async (courseId: number, data: CourseFormData) => {
  const formData = mapCourseFormData(data);
  formData.append("_method", "PUT");

  const response = await http.post(`api/courses/${courseId}`, formData);
  return response.data;
};

export const deleteCourse = async (courseId: number) => {
  const response = await http.delete(`api/courses/${courseId}`);
  return response.data;
};
