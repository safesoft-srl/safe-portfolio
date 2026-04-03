import { http } from "@/services/http.service";

export type ProfileData = {
  profile_name: string;
  profile_email: string;
  profession: string;
  bio: string;
  profile_image: string | null;
  url_portfolio:string;
};

type ApiProfilePayload = {
  name?: string;
  profile_name?: string;
  profile_email?: string;
  profession?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  url_portfolio?: string | null;
};

const toProfileData = (payload: ApiProfilePayload | undefined): ProfileData => ({
  profile_name: payload?.profile_name ?? payload?.profile_name ?? "",
  profile_email: payload?.profile_email ?? "",
  profession: payload?.profession ?? "",
  bio: payload?.bio ?? "",
  profile_image: payload?.profile_image ?? null,
  url_portfolio: payload?.url_portfolio ?? "",
});

const unwrapData = (responseData: unknown): ApiProfilePayload | undefined => {
  if (!responseData || typeof responseData !== "object") {
    return undefined;
  }

  const data = responseData as { data?: unknown };
  const nestedData = data.data;

  if (nestedData && typeof nestedData === "object") {
    return nestedData as ApiProfilePayload;
  }

  return responseData as ApiProfilePayload;
};
       
export async function getProfile(): Promise<ProfileData> {
  const response = await http.get("/api/users/2/portfolio");
  return toProfileData(unwrapData(response.data));
}

export async function updateProfile(payload: ProfileData,
  file?: File|null
): Promise<ProfileData> {
  const formData = new FormData();

  formData.append('profile_name',payload.profile_name);
  formData.append('profile_email', payload.profile_email);
  formData.append('profession', payload.profession);
  formData.append('bio', payload.bio);
  formData.append('url_portfolio', payload.url_portfolio);
  
  if(file) {
    formData.append('profile_image', file);
  }

  formData.append("_method", "PUT");
  const response = await http.post("/api/portfolios/1",formData);

  return toProfileData(unwrapData(response.data));
}


