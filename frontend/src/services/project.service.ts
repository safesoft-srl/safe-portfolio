import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type CreateProjectDTO = {
  portfolio_id: number;
  name: string;
  description: string;
  url_demo: string | null;
  url_github: string | null;
  project_image: string | null;
  skill_ids: number[];
};

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data ?? [];
};

export const createProject = async (data: CreateProjectDTO) => {
  console.log("Creating project with data:", data);
  const response = await api.post("/projects", data);
  console.log("Project created:", response.data);
  return response.data;
};

export type UpdateProjectDTO = Omit<Partial<CreateProjectDTO>, 'portfolio_id'>;

export const updateProject = async (id: number, data: UpdateProjectDTO) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const patchProject = async (id: number, data: Partial<CreateProjectDTO>) => {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data;
};
