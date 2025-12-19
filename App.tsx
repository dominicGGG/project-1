
import React, { useState, useEffect, useMemo } from 'react';
import { Todo, Urgency, FilterStatus, AppState } from './types';
import { STORAGE_KEY, AVAILABLE_TAGS } from './constants';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoForm';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<AppState>({
    search: '',
    status: 'all',
    urgency: 'all',
    tag: 'all',
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Derived State
  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(filter.search.toLowerCase()) || 
                          t.description.toLowerCase().includes(filter.search.toLowerCase());
      const matchStatus = filter.status === 'all' || (filter.status === 'completed' ? t.completed : !t.completed);
      const matchUrgency = filter.urgency === 'all' || t.urgency === filter.urgency;
      const matchTag = filter.tag === 'all' || t.tags.includes(filter.tag);
      return matchSearch && matchStatus && matchUrgency && matchTag;
    }).sort((a, b) => {
      // Sort by status (active first), then by date
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [todos, filter]);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && new Date(t.dueDate) < new Date(new Date().setHours(0,0,0,0))).length
  }), [todos]);

  // Handlers
  const handleAddTodo = (data: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now()
    };
    setTodos(prev => [newTodo, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditTodo = (data: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    if (!editingTodo) return;
    setTodos(prev => prev.map(t => t.id === editingTodo.id ? { ...t, ...data } : t));
    setEditingTodo(null);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTodos(prev => prev.filter(t => t.id !== id));
    }
  };

  const clearCompleted = () => {
    if (confirm('Remove all completed tasks?')) {
      setTodos(prev => prev.filter(t => !t.completed));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>

          <div className="flex-1 max-w-md w-full relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl border border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
                <div className="text-xs font-medium text-blue-600">Active</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                <div className="text-xs font-medium text-green-600">Done</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl col-span-2 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
                  <div className="text-xs font-medium text-red-600">Overdue</div>
                </div>
                <svg className="w-8 h-8 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                <div className="flex flex-col gap-1">
                  {(['all', 'active', 'completed'] as FilterStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilter(f => ({ ...f, status: s }))}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filter.status === s ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Urgency</label>
                <select
                  value={filter.urgency}
                  onChange={(e) => setFilter(f => ({ ...f, urgency: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                >
                  <option value="all">All Levels</option>
                  {Object.values(Urgency).map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter(f => ({ ...f, tag: 'all' }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      filter.tag === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {AVAILABLE_TAGS.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilter(f => ({ ...f, tag: t }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        filter.tag === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={clearCompleted}
              disabled={stats.completed === 0}
              className="w-full mt-6 py-2 px-4 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Completed
            </button>
          </section>
        </aside>

        {/* List Content */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">
              Tasks <span className="text-slate-400 font-normal ml-2">{filteredTodos.length}</span>
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sorted by Date</span>
            </div>
          </div>

          {filteredTodos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredTodos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={setEditingTodo}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">No tasks found</h3>
              <p className="text-slate-500 max-w-xs mb-6">Try adjusting your filters or create a new task to get started on your productivity journey.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Create First Task
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modals */}
      {(isFormOpen || editingTodo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsFormOpen(false); setEditingTodo(null); }}></div>
          <div className="relative w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <TodoForm
              initialData={editingTodo || undefined}
              onSubmit={editingTodo ? handleEditTodo : handleAddTodo}
              onCancel={() => { setIsFormOpen(false); setEditingTodo(null); }}
            />
          </div>
        </div>
      )}
      
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} TaskFlow Pro. Organized tasks, peaceful mind.
      </footer>
    </div>
  );
};

export default App;
