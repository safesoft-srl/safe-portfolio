import axios from "axios";

import { env } from "@/config/env";

export const http = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
