import { http } from "./http.service";
import type { ProfileData } from "./profile.service";


export async function checkSlug(slug:string) {
  const response = await http.get(`/api/me/portfolio/check-slug/${slug}`);
  return response.data.data.available;
}

export async function publishPortfolio(slug: string) {
    const response = await http.post("/api/me/portfolio/publish", { slug });
    console.log('response:', response);
    return response.data.data.slug;
}

export async function getPublicPortfolio(slug: string): Promise<ProfileData>  {
    const response = await http.get(`/api/portfolios/slug/${slug}`);
    return response.data.data;
}

