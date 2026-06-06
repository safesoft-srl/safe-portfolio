export type TechnicalPdfConfig = {
  catalog: {
    summary: boolean;
    table: boolean;
    levelChart: boolean;
  };

  filters: {
    status: string;
    category: string;
    usage: string;
    useOrder: string;
    limit: string;
    search: string;
  };
};

export type TechnicalPdfData = {
  summary: {
    results: number;
    active: number;
    inactive: number;
    total_uses: number;
  };

  skills: {
    id: number;
    name: string;
    category: string;
    is_active: boolean;
    uses: number;

    beginner_percentage: number;
    intermediate_percentage: number;
    advanced_percentage: number;
  }[];

  images: {
    levelChart: string;
  };
};
