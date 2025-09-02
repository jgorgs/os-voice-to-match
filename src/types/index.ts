export interface Position {
  id: string;
  title: string;
  company: string;
  date: Date;
}

export interface SearchState {
  query: string;
  isActive: boolean;
  filteredPositions: Position[];
}