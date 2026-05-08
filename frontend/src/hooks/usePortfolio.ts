import { useParams } from "react-router-dom";

export function usePortfolioId() {
  const { idPortfolio } = useParams();

  if (!idPortfolio) {
    throw new Error("idPortfolio no encontrado en la ruta");
  }

  return Number(idPortfolio);
}
