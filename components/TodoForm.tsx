
import React, { useState } from 'react';
import { Todo, Urgency } from '../types';
import { AVAILABLE_TAGS } from '../constants';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  onCancel: () => void;
  initialData?: Todo;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);
  const [urgency, setUrgency] = useState<Urgency>(initialData?.urgency || Urgency.LOW);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, dueDate, urgency, tags: selectedTags });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Task' : 'Create New Task'}</h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          autoFocus
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="What needs to be done?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Optional details..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Urgency)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.values(Urgency).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          {initialData ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
