import axios from "axios";
import { env } from "@/config/env";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type Skill = {
  id: number;
  skill_name: string;
  url_logo: string;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("api/skills");
  return response.data.data || response.data;
};
