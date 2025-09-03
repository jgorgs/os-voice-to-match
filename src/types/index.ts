export interface Position {
  id: string;
  title: string;
  company: string;
  date: Date;
  status?: string;
}

export interface SearchState {
  query: string;
  isActive: boolean;
  filteredPositions: Position[];
}