
import React from 'react';
import { Todo, Urgency } from '../types';
import { URGENCY_COLORS } from '../constants';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const isExpired = new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !todo.completed;

  return (
    <div className={`group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-blue-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold leading-tight ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {todo.title}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(todo)}
                className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                title="Edit task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(todo.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {todo.description && (
            <p className="text-slate-600 text-sm line-clamp-2">{todo.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${URGENCY_COLORS[todo.urgency]}`}>
              {todo.urgency}
            </span>
            
            <span className={`flex items-center gap-1 text-xs font-medium ${isExpired ? 'text-red-500' : 'text-slate-500'}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {isExpired && <span className="ml-1">(Overdue)</span>}
            </span>

            <div className="flex gap-1">
              {todo.tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
