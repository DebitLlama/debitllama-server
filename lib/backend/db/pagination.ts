
export type PaginationArgs = {
  order: string;
  ascending: boolean;
  rangeFrom: number;
  rangeTo: number;
};

export type PaginationArgsWithSearch = PaginationArgs & { searchTerm: string };



