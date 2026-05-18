import { http } from "@/services/http.service";
import axios from "axios";
import type { ProfileData as ProfileDataType } from "@/types/public-portfolio";

export type ProfileData = {
  id?: number;
  portfolio_name?: string;
  profile_name: string;
  profile_email: string;
  profession: string;
  city: string;
  phone: string;
  bio: string;
  profile_image: string | null;
  url_portfolio: string;
  github_username?: string | null;
  linkedin_url?: string | null;
};

const toProfileData = (payload: ProfileDataType | undefined): ProfileData => ({
  id: payload?.id ?? 1,
  portfolio_name: payload?.portfolio_name ?? "",
  profile_name: payload?.profile_name ?? payload?.profile_name ?? "",
  profile_email: payload?.profile_email ?? "",
  profession: payload?.profession ?? "",
  city: "",
  phone: "",
  bio: payload?.bio ?? "",
  profile_image: payload?.profile_image ?? null,
  url_portfolio: payload?.url_portfolio ?? "",
  github_username: payload?.github_username ?? null,
  linkedin_url: payload?.linkedin_url ?? null,
});

const unwrapData = (responseData: unknown): ProfileDataType | undefined => {
  if (!responseData || typeof responseData !== "object") {
    return undefined;
  }

  const data = responseData as { data?: unknown };
  const nestedData = data.data;

  if (nestedData && typeof nestedData === "object") {
    return nestedData as ProfileDataType;
  }

  return responseData as ProfileDataType;
};

export const getProfile = async () => {
  try {
    const { data } = await http.get("/api/me/portfolio");
    return data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error Failed to load resource:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const getPortfolio = async (idPortfolio: number) => {
  try {
    const { data } = await http.get(`/api/me/portfolio/${idPortfolio}`);
    return data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error Failed to load resource:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};

export const getPortfolios = async (options = {}) => {
  try {
    const { data } = await http.get("/api/me/portfolios", options);
    return data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error Failed to load resource:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};

export async function updateProfile(
  payload: ProfileData,
  file?: File | null
): Promise<ProfileData> {
  const formData = new FormData();

  formData.append("profile_name", payload.profile_name);
  formData.append("profile_email", payload.profile_email);
  formData.append("portfolio_name", payload.portfolio_name ?? "");
  formData.append("profession", payload.profession);
  formData.append("city", payload.city);
  formData.append("phone", payload.phone);
  formData.append("bio", payload.bio);
  formData.append("url_portfolio", payload.url_portfolio);

  if (payload.github_username !== undefined) {
    formData.append("github_username", payload.github_username ?? "");
  }

  if (payload.linkedin_url !== undefined) {
    formData.append("linkedin_url", payload.linkedin_url ?? "");
  }

  if (payload.id) {
    formData.append("id_portfolio", payload.id.toString());
  }

  if (file) {
    formData.append("profile_image", file);
  }

  formData.append("_method", "PUT");
  const response = await http.post("/api/me/portfolio", formData);
  return toProfileData(unwrapData(response.data));
}

export async function deleteProfilePhoto(portfolioId: number): Promise<void> {
  await http.delete(`/api/me/portfolio/${portfolioId}/photo`);
}

export async function createProfile(
  payload: ProfileData,
  file?: File | null
): Promise<ProfileData> {
  const formData = new FormData();
  formData.append("profile_name", payload.profile_name);
  formData.append("profile_email", payload.profile_email);
  formData.append(
    "portfolio_name",
    ((((payload as unknown) as Record<string, unknown>).portfolio_name as string) ?? "")
  );
  formData.append("profession", payload.profession);
  formData.append("city", payload.city);
  formData.append("phone", payload.phone);
  formData.append("bio", payload.bio);
  if (file) {
    formData.append("profile_image", file);
  }

  const response = await http.post("api/me/portfolio", formData);
  return toProfileData(unwrapData(response.data));
}
