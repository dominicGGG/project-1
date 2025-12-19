
import { Urgency } from './types';

export const URGENCY_COLORS: Record<Urgency, string> = {
  [Urgency.LOW]: 'bg-blue-100 text-blue-700 border-blue-200',
  [Urgency.MEDIUM]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [Urgency.HIGH]: 'bg-orange-100 text-orange-700 border-orange-200',
  [Urgency.CRITICAL]: 'bg-red-100 text-red-700 border-red-200',
};

export const AVAILABLE_TAGS = [
  'Work', 'Personal', 'Urgent', 'Shopping', 'Health', 'Finance', 'Ideas'
];

export const STORAGE_KEY = 'taskflow_pro_todos_v1';
