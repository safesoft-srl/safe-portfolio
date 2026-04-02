import { http } from "@/services/http.service";

export type ProfileData = {
  profile_name: string;
  profile_email: string;
  profession: string;
  bio: string;
  profile_image: string | null;
  url_portfolio:"";
};

type ApiProfilePayload = {
  name?: string;
  profile_name?: string;
  profile_email?: string;
  profession?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
};

const toProfileData = (payload: ApiProfilePayload | undefined): ProfileData => ({
  profile_name: payload?.profile_name ?? payload?.profile_name ?? "",
  profile_email: payload?.profile_email ?? "",
  profession: payload?.profession ?? "",
  bio: payload?.bio ?? "",
  profile_image: payload?.avatar_url ?? payload?.avatarUrl ?? null,
  url_portfolio: "",
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
  const response = await http.get("/api/users/1/portfolio");
  console.log("API response:", response.data);
  return toProfileData(unwrapData(response.data));
}

export async function updateProfile(payload: Omit<ProfileData, "profile_image" | "url_portfolio">): Promise<ProfileData> {
  const response = await http.patch("/api/users/1/portfolio", {
    name: payload.profile_name,
    email: payload.profile_email,
    profession: payload.profession,
    bio: payload.bio,
  });

  return toProfileData(unwrapData(response.data));
}

export async function uploadProfilePhoto(file: File): Promise<ProfileData> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await http.post("/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return toProfileData(unwrapData(response.data));
}

export async function deleteProfilePhoto(): Promise<void> {
  await http.delete("/profile/photo");
}
