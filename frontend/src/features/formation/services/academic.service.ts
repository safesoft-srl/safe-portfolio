import { http } from "@/services/http.service";

import type { AcademicFormData, AcademicRecord } from "../types/academic.types";

const buildAcademicEndpoint = (portfolioId: number) => `/api/portfolios/${portfolioId}/academics`;

const mapAcademicFormData = (data: AcademicFormData) => {
  const formData = new FormData();

  formData.append("institution_name", data.institution_name.trim());
  formData.append("title", data.title.trim());
  formData.append("field_of_study", data.field_of_study.trim());
  formData.append("end_date", data.end_date ?? "");
  formData.append("is_current", data.is_current ? "1" : "0");
  formData.append("description", data.description.trim());
  formData.append("is_visible", data.is_visible ? "1" : "0");

  return formData;
};

const unwrapAcademicList = (responseData: unknown): AcademicRecord[] => {
  if (Array.isArray(responseData)) {
    return responseData as AcademicRecord[];
  }

  if (responseData && typeof responseData === "object") {
    const payload = responseData as { data?: unknown };

    if (Array.isArray(payload.data)) {
      return payload.data as AcademicRecord[];
    }

    if (payload.data && typeof payload.data === "object") {
      return [payload.data as AcademicRecord];
    }
  }

  return [];
};

export const getAcademics = async (portfolioId: number) => {
  const response = await http.get(`/api/academics/portfolio/${portfolioId}`);
  return unwrapAcademicList(response.data);
};

export const createAcademic = async (portfolioId: number, data: AcademicFormData) => {
  const response = await http.post(buildAcademicEndpoint(portfolioId), mapAcademicFormData(data));
  return response.data;
};

export const updateAcademic = async (academicId: number, data: AcademicFormData) => {
  const formData = mapAcademicFormData(data);
  formData.append("_method", "PUT");

  const response = await http.post(`api/academics/${academicId}`, formData);
  return response.data;
};

export const deleteAcademic = async (academicId: number) => {
  const response = await http.delete(`api/academics/${academicId}`);
  return response.data;
};
