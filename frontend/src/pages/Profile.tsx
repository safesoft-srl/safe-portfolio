import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPortfolio, updateProfile } from "@/services/profile.service";
import ProfileForm, { type ProfileFormData } from "@/components/ProfileForm";
import { usePortfolioId } from "@/hooks/usePortfolio";

const EMPTY_PROFILE: ProfileFormData = {
  profile_name: "",
  portfolio_name: "",
  profile_email: "",
  profession: "",
  city: "",
  phone: "",
  bio: "",
  profile_image: "",
  url_portfolio: "",
  is_public: true,
};

const toFormData = (profile: Awaited<ReturnType<typeof getPortfolio>>): ProfileFormData => ({
  profile_name: profile?.profile_name ?? "",
  portfolio_name: profile?.portfolio_name ?? "",
  profile_email: profile?.profile_email ?? "",
  profession: profile?.profession ?? "",
  city: profile?.city ?? "",
  phone: profile?.phone ?? "",
  bio: profile?.bio ?? "",
  profile_image: profile?.profile_image ?? "",
  url_portfolio: profile?.url_portfolio ?? "",
  is_public: profile?.is_public ?? true,
});

export default function Profile() {
  const idPortfolio = usePortfolioId();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const profileQuery = useQuery({
    queryKey: ["profile", idPortfolio],
    queryFn: () => getPortfolio(idPortfolio),
    enabled: Boolean(idPortfolio),
    staleTime: Infinity,
    select: toFormData,
  });

  const handleSubmit = async (data: ProfileFormData, file: File | null) => {
    setIsSaving(true);
    try {
      const payload = {
        id: idPortfolio,
        profile_name: data.profile_name?.trim() || "",
        portfolio_name: data.portfolio_name?.trim() || "",
        profile_email: data.profile_email?.trim() || "",
        profession: data.profession?.trim() || "",
        city: data.city?.trim() || "",
        phone: data.phone?.trim() || "",
        bio: data.bio?.trim() || "",
        profile_image: data.profile_image?.trim() || "",
        url_portfolio: data.url_portfolio?.trim() || "",
        is_public: data.is_public,
      };

      const profile = await updateProfile(payload, file);
      const nextProfileData = toFormData(profile);
      queryClient.setQueryData(["profile", idPortfolio], nextProfileData);
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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 mx-auto w-full max-w-4xl font-sans text-slate-900 dark:text-white animate-in fade-in zoom-in duration-500">
      {!profileQuery.isLoading && (
        <h1 className="mb-10 text-3xl font-semibold">Editar Perfil de Portafolio</h1>
      )}
      <ProfileForm
        mode="edit"
        initialData={profileQuery.data ?? EMPTY_PROFILE}
        onSubmit={handleSubmit}
        isLoading={profileQuery.isLoading}
        isSaving={isSaving}
        idPortfolio={idPortfolio}
        key={profileQuery.dataUpdatedAt || "profile-form"}
      />
    </div>
  );
}
