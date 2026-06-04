export type PdfConfig = {
  catalog: {
    summary: boolean;
    table: boolean;
    usageChart: boolean;
    statusChart: boolean;
  };
  requests: {
    table: boolean;
    chart: boolean;
  };
  filters: {
    status: string;
    useOrder: string;
    limit: string;
    createdPeriod: string;
    dateFrom: string;
    dateTo: string;
    requestStatus: string;
    requestOrder: string;
    requestLimit: string;
    requestCreatedPeriod: string;
    requestDateFrom: string;
    requestDateTo: string;
  };
};

export type PdfData = {
  summary: {
    results: number;
    active: number;
    inactive: number;
    total_uses: number;
  };
  skills: {
    name: string;
    is_active: boolean;
    uses: number;
  }[];
  requests: {
    name: string;
    status: "pending" | "approved" | "rejected";
    requests_count: number;
  }[];

  images: {
    usage: string;
    status: string;
    requests: string;
  };
};
