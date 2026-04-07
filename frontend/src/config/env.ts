import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url("Invalid API URL, example: http://localhost:3000"),
  VITE_APP_NAME: z.string("Invalid app name, example: Safe Portfolio"),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});
