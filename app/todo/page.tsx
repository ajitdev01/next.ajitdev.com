"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  Search,
  ArrowLeft,
  Layers,
  Clock,
  CheckCircle2,
  Edit2,
  X,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Sparkles,
} from "lucide-react";
import { showToast, confirmDelete, promptEditTodo, showError } from "@/lib/swal";
import { DatePicker } from "../components/ui/date-picker";
import Footer from "../components/footer";

interface TodoItem {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_KEY = "next_todos_clean_store";

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Save to LocalStorage helper
  const persistTodos = (items: TodoItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving to localStorage", e);
      showError("Storage Error", "Could not save tasks to local storage.");
    }
  };

  // Initial Load from LocalStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Remove any legacy sample tasks if they were saved earlier
          const clean = parsed.filter(
            (t) => t._id !== "td_sample_1" && t._id !== "td_sample_2"
          );
          setTodos(clean);
          if (clean.length !== parsed.length) {
            persistTodos(clean);
          }
          return;
        }
      }
      setTodos([]);
    } catch {
      setTodos([]);
    }
  }, []);

  // Create Todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Please enter a task title", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const newTodo: TodoItem = {
        _id: "td_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newTodo, ...todos];
      setTodos(updated);
      persistTodos(updated);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setShowForm(false);
      showToast("Task added", "success");
    } catch (err: unknown) {
      showError("Failed to Save", err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle completion
  const handleToggle = (id: string) => {
    const updated = todos.map((t) => {
      if (t._id === id) {
        const nextState = !t.completed;
        if (nextState) {
          showToast("Task completed", "success");
        } else {
          showToast("Task marked pending", "info");
        }
        return { ...t, completed: nextState, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    setTodos(updated);
    persistTodos(updated);
  };

  // Edit Todo with SweetAlert
  const handleEdit = async (todo: TodoItem) => {
    const updatedValues = await promptEditTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
    });

    if (!updatedValues) return;

    const updated = todos.map((t) =>
      t._id === todo._id
        ? {
            ...t,
            title: updatedValues.title,
            description: updatedValues.description || undefined,
            priority: updatedValues.priority as "low" | "medium" | "high",
            updatedAt: new Date().toISOString(),
          }
        : t
    );

    setTodos(updated);
    persistTodos(updated);
    showToast("Task updated", "success");
  };

  // Delete single todo with SweetAlert confirmation
  const handleDelete = async (id: string, todoTitle: string) => {
    const confirmed = await confirmDelete(
      `Delete "${todoTitle}"?`,
      "This action will permanently delete this task."
    );

    if (!confirmed) return;

    const updated = todos.filter((t) => t._id !== id);
    setTodos(updated);
    persistTodos(updated);
    showToast("Task deleted", "success");
  };

  // Clear completed tasks
  const handleClearCompleted = async () => {
    const completedTasks = todos.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    const confirmed = await confirmDelete(
      `Clear ${completedTasks.length} Completed Tasks?`,
      "All finished tasks will be permanently removed."
    );

    if (!confirmed) return;

    const updated = todos.filter((t) => !t.completed);
    setTodos(updated);
    persistTodos(updated);
    showToast(`Cleared ${completedTasks.length} tasks`, "success");
  };

  // Filter and sort todos for display
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Tab filter
        if (activeTab === "pending" && todo.completed) return false;
        if (activeTab === "completed" && !todo.completed) return false;

        // Priority filter
        if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = todo.title.toLowerCase().includes(q);
          const matchDesc = todo.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const rank = { high: 3, medium: 2, low: 1 };
          return rank[b.priority || "medium"] - rank[a.priority || "medium"];
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, activeTab, priorityFilter, searchQuery, sortBy]);

  // Metrics
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Todo List
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your tasks, priorities, and daily workflow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Total Tasks</span>
              <Layers className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {totalCount}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">All tasks recorded</div>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Pending</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600">
              {pendingCount}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Awaiting completion</div>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Completed</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
              {completedCount}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">{percentComplete}% finished</div>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Progress</span>
              <span className="text-xs font-semibold text-slate-700">{percentComplete}%</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-slate-900 transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              {completedCount} of {totalCount} completed
            </div>
          </div>
        </div>

        {/* New Task Form (shadcn Card) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <form
                onSubmit={handleAddTodo}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-slate-700" />
                    <span>Create New Task</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Finalize project roadmap..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                      required
                      className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Add any extra notes or requirements..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Priority Level
                      </label>
                      <div className="flex items-center gap-1.5">
                        {(["low", "medium", "high"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`flex-1 h-8 rounded-md text-xs font-medium capitalize transition-colors border ${
                              priority === p
                                ? p === "high"
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : p === "medium"
                                  ? "border-amber-300 bg-amber-50 text-amber-800"
                                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Due Date
                      </label>
                      <DatePicker
                        date={dueDate || null}
                        onChange={(d) => setDueDate(d || "")}
                        placeholder="Pick a due date..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !title.trim()}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-medium text-white shadow-xs hover:bg-slate-800 disabled:opacity-50"
                  >
                    {submitting ? "Adding..." : "Add Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Controls & Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* shadcn Tabs Segment */}
          <div className="inline-flex h-9 items-center rounded-lg bg-slate-100 p-1 text-slate-500 shadow-xs">
            {(["all", "pending", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium capitalize ring-offset-white transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
                <span className="ml-1.5 text-[10px] text-slate-400">
                  {tab === "all"
                    ? totalCount
                    : tab === "pending"
                    ? pendingCount
                    : completedCount}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-1 sm:max-w-md items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1 text-xs shadow-xs placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs shadow-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs shadow-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priority">Priority</option>
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Task List Container */}
        <div className="mt-4 rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">No tasks found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {searchQuery || priorityFilter !== "all"
                  ? "Try resetting your search query or changing filters."
                  : "You have no tasks in your list. Click 'New Task' above to add one!"}
              </p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white shadow-xs hover:bg-slate-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Task</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredTodos.map((todo) => (
                  <motion.div
                    key={todo._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`group flex items-start justify-between gap-3 p-4 transition-colors hover:bg-slate-50/70 ${
                      todo.completed ? "bg-slate-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggle(todo._id)}
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors shadow-xs ${
                          todo.completed
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white hover:border-slate-400"
                        }`}
                        title={todo.completed ? "Mark as pending" : "Mark as completed"}
                      >
                        {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-medium leading-none ${
                              todo.completed
                                ? "line-through text-slate-400"
                                : "text-slate-900"
                            }`}
                          >
                            {todo.title}
                          </span>

                          {/* Priority badge */}
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              todo.priority === "high"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : todo.priority === "medium"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {todo.priority}
                          </span>
                        </div>

                        {todo.description && (
                          <p
                            className={`mt-1.5 text-xs line-clamp-2 ${
                              todo.completed ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          {todo.dueDate && (
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              Due {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span>
                            Added {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Edit task"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(todo._id, todo.title)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom Bar: Clear completed & counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {filteredTodos.length} of {totalCount} tasks
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear completed ({completedCount})</span>
            </button>
          )}
        </div>
      </main>

      {/* Shared Unified Footer */}
      <Footer currentApp="todo" />
    </div>
  );
}
