import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/profile.service";
import ProfileForm, { type ProfileFormData } from "@/components/ProfileForm";

export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idPortfolio, setIdPortfolio] = useState<number>(1);
  const [initialFormData, setInitialFormData] = useState<ProfileFormData>({
    profile_name: "",
    profile_email: "",
    profession: "",
    bio: "",
    profile_image: "",
    url_portfolio: "",
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await getProfile();
      setIdPortfolio(profile.id);
      setInitialFormData({
        profile_name: profile.profile_name ?? "",
        profile_email: profile.profile_email ?? "",
        profession: profile.profession ?? "",
        bio: profile.bio ?? "",
        profile_image: profile.profile_image ?? "",
        url_portfolio: profile.url_portfolio ?? "",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (data: ProfileFormData, file: File | null) => {
    setIsSaving(true);
    try {
      const payload = {
        id: idPortfolio,
        profile_name: data.profile_name?.trim() || "",
        profile_email: data.profile_email?.trim() || "",
        profession: data.profession?.trim() || "",
        bio: data.bio?.trim() || "",
        profile_image: data.profile_image?.trim() || "",
        url_portfolio: data.url_portfolio?.trim() || "",
      };

      const profile = await updateProfile(payload, file);
      setInitialFormData({
        profile_name: profile.profile_name,
        profile_email: profile.profile_email,
        profession: profile.profession,
        bio: profile.bio,
        profile_image: profile.profile_image ?? "",
        url_portfolio: profile.url_portfolio,
      });
      toast.success("Los cambios se han guardado correctamente.", {
        style: {
          background: "#6c72ff",
          color: "#ffffff",
          border: "1px solid #8b90ff",
        },
      });
    } catch {
      toast.error("Error al guardar los cambios");
    }
    setIsSaving(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl font-sans text-slate-900 dark:text-white">
      {!isLoading && <h1 className="mb-4 text-3xl font-semibold">Mi Perfil</h1>}
      <div className="w-full rounded-2xl border border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#13152e] px-7 py-8">
        <ProfileForm
          mode="edit"
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isSaving={isSaving}
          idPortfolio={idPortfolio}
          key={JSON.stringify(initialFormData)}
        />
      </div>
    </div>
  );
}
