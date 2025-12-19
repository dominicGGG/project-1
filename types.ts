
export enum Urgency {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  urgency: Urgency;
  tags: string[];
  completed: boolean;
  createdAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface AppState {
  search: string;
  status: FilterStatus;
  urgency: Urgency | 'all';
  tag: string | 'all';
}
