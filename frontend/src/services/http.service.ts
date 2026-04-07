import axios from "axios";

import { env } from "@/config/env";

export const http = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
