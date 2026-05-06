import { useState, useEffect } from "react";
import { getPortfolios } from "@/services/profile.service";
import type { Portfolio } from "../types/portfolios.type"

export function usePortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadPortfolios = async () => {
      try {
        const response = await getPortfolios({ signal: controller.signal });

        if (response) {
          setPortfolios(response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolios();
    return () => controller.abort();
  }, []);

  return {
    portfolios,
    isLoading,
  };
}
