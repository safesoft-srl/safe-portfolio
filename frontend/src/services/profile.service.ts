import { http } from "@/services/http.service";
import type { ApiProfilePayload, ProfileData as ProfileDataType } from "@/types/public-portfolio";
export type ProfileData = {
  id?: number;
  profile_name: string;
  profile_email: string;
  profession: string;
  bio: string;
  profile_image: string | null;
  url_portfolio: string;
};

const toProfileData = (payload: ProfileDataType | undefined): ProfileData => ({
  id: payload?.id ?? 1,
  profile_name: payload?.profile_name ?? payload?.profile_name ?? "",
  profile_email: payload?.profile_email ?? "",
  profession: payload?.profession ?? "",
  bio: payload?.bio ?? "",
  profile_image: payload?.profile_image ?? null,
  url_portfolio: payload?.url_portfolio ?? "",
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

export async function getProfile(): Promise<ProfileDataType> {
  const response = await http.get<ApiProfilePayload>("/api/me/portfolio");
  return response.data.data;
}

export async function updateProfile(
  payload: ProfileData,
  file?: File | null
): Promise<ProfileData> {
  const formData = new FormData();

  formData.append("profile_name", payload.profile_name);
  formData.append("profile_email", payload.profile_email);
  formData.append("profession", payload.profession);
  formData.append("bio", payload.bio);
  formData.append("url_portfolio", payload.url_portfolio);

  if (file) {
    formData.append("profile_image", file);
  }

  formData.append("_method", "PUT");
  const response = await http.post("/api/me/portfolio", formData);
  console.log("API Response:", response);
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
  formData.append("profession", payload.profession);
  formData.append("bio", payload.bio);
  formData.append("url_portfolio", payload.url_portfolio);
  if (file) {
    formData.append("profile_image", file);
  }

  const response = await http.post("/api/portfolios", formData);
  return toProfileData(unwrapData(response.data));
}
