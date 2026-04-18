import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
  const response = await api.get("/skills");
  return response.data.data || response.data;
};
