import { http } from "./http.service";
import type { ApiProfilePayload, ProfileData } from "@/types/public-portfolio";

export async function checkSlug(slug: string) {
  const response = await http.get(`/api/me/portfolio/check-slug/${slug}`);
  return response.data.data.available;
}

export async function publishPortfolio(slug: string, idPortfolio: number) {
  const response = await http.post(`/api/me/portfolio/publish/${idPortfolio}`, { slug });
  return response.data.data.slug;
}

export async function getPublicPortfolio(slug: string): Promise<ProfileData> {
  const response = await http.get<ApiProfilePayload>(`/api/portfolios/slug/${slug}`);
  return response.data.data;
}

export async function saveUrlPortfolio(url: string, id: number) {
  const response = await http.post(`/api/me/portfolio/save-url/${id}`, { url });
  return response.data.data;
}

export async function getPublicWorkExperiences(slug: string) {
  const response = await http.get(`/api/portfolios/slug/${slug}/work-experiences`);
  return response.data.data;
}
