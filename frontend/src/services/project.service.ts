import axios from "axios";

import { env } from "@/config/env";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

export type CreateProjectDTO = {
  portfolio_id: number;
  name: string;
  description: string;
  url_demo: string | null;
  url_github: string;
  project_image: string | null;
  skill_ids: number[];
};

export const getProjects = async () => {
  const response = await api.get("api/projects");
  return response.data ?? [];
};

export const createProject = async (data: CreateProjectDTO, file?: File | null) => {
  const formData = new FormData();
  formData.append("portfolio_id", data.portfolio_id.toString());
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.url_demo) {
    formData.append("url_demo", data.url_demo);
  }
  formData.append("url_github", data.url_github);

  if (data.skill_ids) {
    data.skill_ids.forEach((id) => {
      formData.append("skill_ids[]", id.toString());
    });
  }

  if (file) {
    formData.append("project_image", file);
  }
  const response = await api.post("api/projects", formData);

  return response.data;
};

export type UpdateProjectDTO = Omit<Partial<CreateProjectDTO>, 'portfolio_id'>;

export const updateProject = async (id: number, data: UpdateProjectDTO, file?: File | null) => {
  const formData = new FormData();
  formData.append("name", data.name ?? "");
  formData.append("description", data.description ?? "");
  if (data.url_demo) {
    formData.append("url_demo", data.url_demo);
  }
  formData.append("url_github", data.url_github ?? "");
  if (data.skill_ids) {
    data.skill_ids.forEach((id) => {
      formData.append("skill_ids[]", id.toString());
    });
    
  }

  
  if (file) {
    formData.append("project_image", file);
  }

  formData.append("_method", "PUT");
  const response = await api.post(`api/projects/${id}`, formData);

  return response.data;
};


export const deleteProject = async (id: number) => {
  const response = await api.delete(`api/projects/${id}`);
  return response.data;
};

export const patchProject = async (id: number, data: Partial<CreateProjectDTO>) => {
  const response = await api.patch(`api/projects/${id}`, data);
  return response.data;
};
