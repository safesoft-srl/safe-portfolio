import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getPortfolio, updateProfile } from "@/services/profile.service";
import ProfileForm, { type ProfileFormData } from "@/components/ProfileForm";
import { usePortfolioId } from "@/hooks/usePortfolio";

export default function Profile() {
  const idPortfolio = usePortfolioId();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState<ProfileFormData>({
    profile_name: "",
    portfolio_name: "",
    profile_email: "",
    profession: "",
    city: "",
    phone: "",
    bio: "",
    profile_image: "",
    url_portfolio: "",
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await getPortfolio(idPortfolio);
      setInitialFormData({
        profile_name: profile.profile_name ?? "",
        portfolio_name: profile.portfolio_name ?? "",
        profile_email: profile.profile_email ?? "",
        profession: profile.profession ?? "",
        city: profile.city ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
        profile_image: profile.profile_image ?? null,
        url_portfolio: profile.url_portfolio ?? "",
      });
    } finally {
      setIsLoading(false);
    }
  }, [idPortfolio]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

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
      };

      const profile = await updateProfile(payload, file);
      setInitialFormData({
        profile_name: profile.profile_name,
        portfolio_name: profile.portfolio_name ?? "",
        profile_email: profile.profile_email,
        profession: profile.profession,
        city: profile.city ?? "",
        phone: profile.phone ?? "",
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
    <div className="mx-auto w-full max-w-4xl font-sans text-slate-900 dark:text-white">
      {!isLoading && <h1 className="mb-4 text-3xl font-semibold">Editar Perfil de Portafolio</h1>}
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
  );
}
