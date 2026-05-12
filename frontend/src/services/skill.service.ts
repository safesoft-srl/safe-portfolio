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
  urls: {
    light: string;
    dark: string;
  };
};

export async function createSkill(data: {
  name: string;
  category: string;
  logo_light?: File;
  logo_dark?: File;
}) {
  console.log("data: ", data);
  const formData = new FormData();
  const name = data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase();
  formData.append("name", name);
  formData.append("category", data.category);

  if (data.logo_light) {
    formData.append("logo_light", data.logo_light);
  }

  if (data.logo_dark) {
    formData.append("logo_dark", data.logo_dark);
  }

  const response = await api.post("/api/technical-skills", formData);

  return response.data;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("api/technical-skills");
  return response.data.data || response.data;
};
