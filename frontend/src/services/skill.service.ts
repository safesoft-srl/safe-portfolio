import axios from "axios";
import { env } from "@/config/env";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

export type Skill = {
  id: number;
  name: string;
  category: string;
  icon_path: string;
};

export async function createSkill(data: {
  name: string;
  category: string;
  logo?: File;
}) {
  const formData = new FormData();

  formData.append("name", data.name.toUpperCase());
  formData.append("category", data.category.toLowerCase());

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await api.post("/api/technical-skills", formData);

  return response.data;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("api/technical-skills");
  return response.data.data || response.data;
};
