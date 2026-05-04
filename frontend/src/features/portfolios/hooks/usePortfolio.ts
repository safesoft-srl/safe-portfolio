import { useEffect, useState } from "react";
import { getProfile } from "@/services/profile.service";
import type { ProfileData } from "@/types/public-portfolio";

export function usePortfolio() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getProfile();
      setProfile(data ?? null);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    profile,
    isLoading,
    reload: load,
  };
}
