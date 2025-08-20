export interface Position {
  id: string;
  title: string;
  date: Date;
  status: 'In Progress' | 'Completed' | 'Draft';
}

export interface SearchState {
  query: string;
  isActive: boolean;
  filteredPositions: Position[];
}