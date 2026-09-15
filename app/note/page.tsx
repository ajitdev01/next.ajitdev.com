"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Heart,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Upload,
  ArrowLeft,
  LayoutGrid,
  List as ListIcon,
  AlignLeft,
  Sparkles,
  Tag,
  X,
  SlidersHorizontal,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { showToast, confirmDelete } from "@/lib/swal";
import Footer from "../components/footer";
import { CustomSelect, SelectOption } from "../components/ui/select";
import Breadcrumbs from "@/components/seo/breadcrumbs";

// Types
export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string; // color preset id
  isLiked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Color presets: Subtle, elegant tints that preserve the crisp white aesthetic
export const COLOR_PRESETS = [
  { id: "white", name: "Pure White", bg: "bg-white", border: "border-slate-200/90", dot: "bg-slate-300" },
  { id: "amber", name: "Soft Amber", bg: "bg-amber-50/60", border: "border-amber-200/80", dot: "bg-amber-400" },
  { id: "emerald", name: "Soft Mint", bg: "bg-emerald-50/60", border: "border-emerald-200/80", dot: "bg-emerald-400" },
  { id: "sky", name: "Soft Sky", bg: "bg-sky-50/60", border: "border-sky-200/80", dot: "bg-sky-400" },
  { id: "rose", name: "Soft Rose", bg: "bg-rose-50/60", border: "border-rose-200/80", dot: "bg-rose-400" },
  { id: "violet", name: "Soft Lavender", bg: "bg-purple-50/60", border: "border-purple-200/80", dot: "bg-purple-400" },
];

export const CATEGORIES = [
  "All",
  "Personal",
  "Work",
  "Ideas",
  "Study",
  "Journal",
  "Projects",
];

const CATEGORY_OPTIONS: SelectOption[] = CATEGORIES.filter((c) => c !== "All").map((c) => ({
  value: c,
  label: c,
}));

const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "updated", label: "Recently Edited" },
  { value: "title", label: "Title (A-Z)" },
  { value: "liked", label: "Most Liked" },
];

const STORAGE_KEY = "next_notes_store_v1";
const LAYOUT_STORAGE_KEY = "next_notes_layout_v1";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Layout mode: 'grid' | 'list' | 'compact'
  const [layoutMode, setLayoutMode] = useState<"grid" | "list" | "compact">("grid");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewFilter, setViewFilter] = useState<"all" | "liked" | "pinned">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "updated" | "title" | "liked">("newest");

  // Full Editor Modal state (Create / Edit)
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Personal");
  const [formColor, setFormColor] = useState("white");
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formIsLiked, setFormIsLiked] = useState(false);

  // Reader View Modal
  const [readingNote, setReadingNote] = useState<NoteItem | null>(null);

  // Copied toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile more menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }
    if (isMoreMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    setIsMounted(true);

    // Load saved layout
    try {
      const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY) as "grid" | "list" | "compact";
      if (savedLayout && ["grid", "list", "compact"].includes(savedLayout)) {
        setLayoutMode(savedLayout);
      }
    } catch (e) {
      console.error("Failed to load layout mode", e);
    }

    // Load notes from localStorage (no dummy notes)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Remove any legacy demo notes if they existed previously
          const clean = parsed.filter(
            (n) =>
              !n.id?.startsWith("note_welcome_") &&
              !n.id?.startsWith("note_design_") &&
              !n.id?.startsWith("note_next_steps_")
          );
          setNotes(clean);
          if (clean.length !== parsed.length) {
            persistNotes(clean);
          }
          return;
        }
      }
      setNotes([]);
    } catch (e) {
      console.error("Failed to load notes from localStorage", e);
      setNotes([]);
    }
  }, []);

  // Save notes to localStorage
  const persistNotes = (items: NoteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving notes to localStorage", e);
      showToast("Storage quota exceeded or error saving notes", "error");
    }
  };

  // Change and save layout mode
  const handleSetLayout = (mode: "grid" | "list" | "compact") => {
    setLayoutMode(mode);
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
    } catch (e) {
      console.error(e);
    }
  };

  // 2. CRUD Operations
  // CREATE (via Modal or Quick Bar)
  const handleSaveNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formTitle.trim() && !formContent.trim()) {
      showToast("Please write a title or some content", "warning");
      return;
    }

    const titleText = formTitle.trim() || "Untitled Note";

    if (editingNote) {
      // UPDATE existing note
      const updatedNotes = notes.map((item) => {
        if (item.id === editingNote.id) {
          return {
            ...item,
            title: titleText,
            content: formContent.trim(),
            category: formCategory,
            color: formColor,
            isPinned: formIsPinned,
            isLiked: formIsLiked,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setNotes(updatedNotes);
      persistNotes(updatedNotes);
      showToast("Note updated successfully", "success");
    } else {
      // CREATE new note
      const newNote: NoteItem = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: titleText,
        content: formContent.trim(),
        category: formCategory,
        color: formColor,
        isPinned: formIsPinned,
        isLiked: formIsLiked,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newNote, ...notes];
      setNotes(updated);
      persistNotes(updated);
      showToast("Note created", "success");
    }

    closeEditorModal();
  };

  // Open Modal for New Note
  const openNewNoteModal = () => {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("Personal");
    setFormColor("white");
    setFormIsPinned(false);
    setFormIsLiked(false);
    setEditorModalOpen(true);
  };

  // Open Modal to Edit Note
  const openEditNoteModal = (note: NoteItem) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormColor(note.color || "white");
    setFormIsPinned(note.isPinned);
    setFormIsLiked(note.isLiked);
    setEditorModalOpen(true);
  };

  const closeEditorModal = () => {
    setEditorModalOpen(false);
    setEditingNote(null);
  };

  // DELETE note
  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const confirmed = await confirmDelete(
      "Delete Note?",
      "Are you sure you want to delete this note? This action cannot be undone."
    );
    if (!confirmed) return;

    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    persistNotes(updated);

    if (readingNote?.id === id) {
      setReadingNote(null);
    }
    showToast("Note deleted", "info");
  };

  // TOGGLE LIKE / FAVORITE
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const updated = notes.map((note) => {
      if (note.id === id) {
        const nextLiked = !note.isLiked;
        if (nextLiked) {
          showToast("Added to Favorites ❤️", "success");
        }
        return {
          ...note,
          isLiked: nextLiked,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });

    setNotes(updated);
    persistNotes(updated);

    if (readingNote?.id === id) {
      setReadingNote((prev) => (prev ? { ...prev, isLiked: !prev.isLiked } : null));
    }
  };

  // TOGGLE PIN
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const updated = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          isPinned: !note.isPinned,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });

    setNotes(updated);
    persistNotes(updated);

    if (readingNote?.id === id) {
      setReadingNote((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
    }
  };

  // DUPLICATE NOTE
  const handleDuplicateNote = (note: NoteItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const duplicate: NoteItem = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [duplicate, ...notes];
    setNotes(updated);
    persistNotes(updated);
    showToast("Note duplicated", "success");
  };

  // COPY CONTENT TO CLIPBOARD
  const handleCopyContent = async (note: NoteItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const textToCopy = `${note.title}\n\n${note.content}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(note.id);
      showToast("Copied note to clipboard", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  // EXPORT ALL NOTES TO JSON
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ajitdev-notes-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Notes exported to JSON file", "success");
    } catch {
      showToast("Export failed", "error");
    }
  };

  // IMPORT NOTES FROM JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            // merge or replace
            const combined = [...imported, ...notes];
            // Deduplicate by ID
            const seen = new Set();
            const deduplicated = combined.filter((item) => {
              if (!item.id || seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
            setNotes(deduplicated);
            persistNotes(deduplicated);
            showToast(`Imported ${imported.length} notes successfully`, "success");
          } else {
            showToast("Invalid JSON format", "error");
          }
        } catch {
          showToast("Failed to parse JSON file", "error");
        }
      };
    }
  };

  // CLEAR ALL NOTES
  const handleClearAll = async () => {
    const confirmed = await confirmDelete(
      "Clear All Notes?",
      "This will remove all notes from your local storage. Make sure to export a backup if needed!"
    );
    if (!confirmed) return;
    setNotes([]);
    persistNotes([]);
    showToast("All notes cleared", "info");
  };

  // 3. Filter and Sort logic
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Tab filter (All / Liked / Pinned)
        if (viewFilter === "liked" && !note.isLiked) return false;
        if (viewFilter === "pinned" && !note.isPinned) return false;

        // Category filter
        if (selectedCategory !== "All" && note.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchContent = note.content.toLowerCase().includes(q);
          const matchCategory = note.category.toLowerCase().includes(q);
          if (!matchTitle && !matchContent && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort order
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "updated") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === "liked") {
          if (a.isLiked === b.isLiked) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.isLiked ? -1 : 1;
        }
        // Default 'newest'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notes, viewFilter, selectedCategory, searchQuery, sortBy]);

  // Split into Pinned vs Other (when viewFilter is not explicitly pinned)
  const pinnedList = useMemo(() => {
    return filteredNotes.filter((n) => n.isPinned);
  }, [filteredNotes]);

  const otherList = useMemo(() => {
    return filteredNotes.filter((n) => !n.isPinned);
  }, [filteredNotes]);

  // Metrics
  const totalNotesCount = notes.length;
  const likedNotesCount = notes.filter((n) => n.isLiked).length;
  const pinnedNotesCount = notes.filter((n) => n.isPinned).length;
  const totalWords = useMemo(() => {
    return notes.reduce((acc, curr) => {
      const words = (curr.content || "").trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
  }, [notes]);

  // Helper for color styles
  const getColorStyles = (colorId: string) => {
    const preset = COLOR_PRESETS.find((c) => c.id === colorId) || COLOR_PRESETS[0];
    return preset;
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "";
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-7 w-7 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-200">
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              title="Return to Home"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                    Notes
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    localStorage
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Search on larger screens */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes by title, content, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition"
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
          </div>

          {/* Right Header Controls: Layout switcher, More Menu, & New Note */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Layout Mode Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 text-slate-600 shadow-xs">
              <button
                onClick={() => handleSetLayout("grid")}
                title="Grid Layout"
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition touch-manipulation ${
                  layoutMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleSetLayout("list")}
                title="List Layout"
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition touch-manipulation ${
                  layoutMode === "list"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleSetLayout("compact")}
                title="Compact Layout"
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition touch-manipulation ${
                  layoutMode === "compact"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Hidden JSON file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />

            {/* Desktop Backup & Import buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={handleExportJSON}
                title="Export Notes (Backup JSON)"
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import Notes (JSON)"
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import</span>
              </button>
            </div>

            {/* Mobile More Options Dropdown (Export, Import, Clear) */}
            <div ref={moreMenuRef} className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 touch-manipulation"
                title="More Options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        handleExportJSON();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                    >
                      <Download className="h-4 w-4 text-slate-500" />
                      <span>Export Backup (JSON)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                    >
                      <Upload className="h-4 w-4 text-slate-500" />
                      <span>Import Notes (JSON)</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        handleClearAll();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                      <span>Clear All Notes</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Note Button */}
            <button
              onClick={openNewNoteModal}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-slate-900 px-3 sm:px-3.5 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow active:scale-95 shrink-0 touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              <span className="font-semibold hidden sm:inline">New Note</span>
              <span className="font-semibold inline sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by title, content, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Semantic Breadcrumb Navigation & Cross-Linking */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Notes App", url: "/note" },
            ]}
          />
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Related:</span>
            <Link
              href="/todo"
              className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 transition-colors"
            >
              Todo App
            </Link>
            <span>·</span>
            <a
              href="https://api.ajitdev.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 transition-colors"
            >
              AJITDEV APIs
            </a>
          </div>
        </div>

        {/* 2. Top Stats Bar (Mobile Optimized) */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-xs">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">{totalNotesCount}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">Total Notes</div>
            </div>
          </div>

          <div
            onClick={() => setViewFilter(viewFilter === "liked" ? "all" : "liked")}
            className={`flex cursor-pointer items-center gap-2.5 sm:gap-3 rounded-2xl border p-3 sm:p-3.5 shadow-xs transition active:scale-95 touch-manipulation hover:border-rose-300 ${
              viewFilter === "liked" ? "border-rose-400 bg-rose-50/50 ring-2 ring-rose-500/20" : "border-slate-200/80 bg-white"
            }`}
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-rose-500 text-rose-500" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">{likedNotesCount}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">Favorites</div>
            </div>
          </div>

          <div
            onClick={() => setViewFilter(viewFilter === "pinned" ? "all" : "pinned")}
            className={`flex cursor-pointer items-center gap-2.5 sm:gap-3 rounded-2xl border p-3 sm:p-3.5 shadow-xs transition active:scale-95 touch-manipulation hover:border-amber-300 ${
              viewFilter === "pinned" ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-500/20" : "border-slate-200/80 bg-white"
            }`}
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Pin className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">{pinnedNotesCount}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">Pinned</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-xs">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">{totalWords}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">Total Words</div>
            </div>
          </div>
        </div>

        {/* 3. Filter & Categories Row */}
        <div className="mb-6 space-y-2.5">
          {/* Main Filter Tabs + Sort Dropdown */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setViewFilter("all")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition shrink-0 touch-manipulation ${
                  viewFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <span>All Notes</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    viewFilter === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {totalNotesCount}
                </span>
              </button>

              <button
                onClick={() => setViewFilter("liked")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition shrink-0 touch-manipulation ${
                  viewFilter === "liked"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-rose-50/50 hover:text-rose-600"
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${viewFilter === "liked" ? "fill-white text-white" : "text-rose-500 fill-rose-500"}`}
                />
                <span>Favorites</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    viewFilter === "liked" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {likedNotesCount}
                </span>
              </button>

              <button
                onClick={() => setViewFilter("pinned")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition shrink-0 touch-manipulation ${
                  viewFilter === "pinned"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-amber-50/50 hover:text-amber-700"
                }`}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${
                    viewFilter === "pinned" ? "fill-white text-white" : "text-amber-600 fill-amber-500"
                  }`}
                />
                <span>Pinned</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    viewFilter === "pinned" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {pinnedNotesCount}
                </span>
              </button>
            </div>

            {/* Radix UI Styled Sort Dropdown */}
            <div className="shrink-0">
              <CustomSelect
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={SORT_OPTIONS}
                icon={<SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />}
                align="right"
                size="sm"
              />
            </div>
          </div>

          {/* Category pills — wraps on mobile, single scroll row on desktop */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:overflow-x-auto sm:py-1 sm:scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition whitespace-nowrap shrink-0 touch-manipulation active:scale-95 ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white font-semibold shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Notes View: Empty State or Cards */}
        {filteredNotes.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {searchQuery ? "No matching notes found" : "No notes here yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {searchQuery
                ? `No notes matched "${searchQuery}". Try a different keyword or clear the search filter.`
                : viewFilter === "liked"
                ? "You haven't liked any notes yet. Click the heart icon on any note to mark it as a favorite!"
                : "Create your first note to capture ideas, plans, checklists, and inspirations."}
            </p>
            <div className="mt-5 flex gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  Clear search
                </button>
              )}
              <button
                onClick={openNewNoteModal}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Create a Note</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* PINNED SECTION (if exists and on "All" view) */}
            {viewFilter === "all" && pinnedList.length > 0 && (
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                  <span>Pinned Notes ({pinnedList.length})</span>
                </div>

                <NoteCollection
                  notes={pinnedList}
                  layoutMode={layoutMode}
                  onReadNote={(note) => setReadingNote(note)}
                  onEditNote={openEditNoteModal}
                  onDeleteNote={handleDeleteNote}
                  onToggleLike={handleToggleLike}
                  onTogglePin={handleTogglePin}
                  onCopyContent={handleCopyContent}
                  onDuplicateNote={handleDuplicateNote}
                  copiedId={copiedId}
                  getColorStyles={getColorStyles}
                  formatDate={formatDate}
                />
              </div>
            )}

            {/* OTHER / MAIN NOTES SECTION */}
            <div>
              {viewFilter === "all" && pinnedList.length > 0 && otherList.length > 0 && (
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Other Notes ({otherList.length})</span>
                </div>
              )}

              <NoteCollection
                notes={viewFilter === "all" && pinnedList.length > 0 ? otherList : filteredNotes}
                layoutMode={layoutMode}
                onReadNote={(note) => setReadingNote(note)}
                onEditNote={openEditNoteModal}
                onDeleteNote={handleDeleteNote}
                onToggleLike={handleToggleLike}
                onTogglePin={handleTogglePin}
                onCopyContent={handleCopyContent}
                onDuplicateNote={handleDuplicateNote}
                copiedId={copiedId}
                getColorStyles={getColorStyles}
                formatDate={formatDate}
              />
            </div>
          </div>
        )}
      </main>

      {/* 6. CREATE / EDIT NOTE MODAL */}
      <AnimatePresence>
        {editorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditorModal}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog (Mobile Optimized: Fixed Header & Footer, Scrollable Body) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border ${
                getColorStyles(formColor).border
              } ${
                getColorStyles(formColor).bg
              } shadow-2xl transition-colors`}
            >
              {/* Top Modal Bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200/60 p-4 sm:p-5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {editingNote ? "Edit Note" : "New Note"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-400">
                    {formContent.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Pin button */}
                  <button
                    type="button"
                    onClick={() => setFormIsPinned(!formIsPinned)}
                    className={`flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-xl transition touch-manipulation active:scale-95 ${
                      formIsPinned ? "bg-amber-100 text-amber-700" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                    title={formIsPinned ? "Pinned" : "Pin to top"}
                  >
                    <Pin className={`h-4 w-4 ${formIsPinned ? "fill-amber-500" : ""}`} />
                  </button>

                  {/* Like button */}
                  <button
                    type="button"
                    onClick={() => setFormIsLiked(!formIsLiked)}
                    className={`flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-xl transition touch-manipulation active:scale-95 ${
                      formIsLiked ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                    title={formIsLiked ? "Liked" : "Like"}
                  >
                    <Heart className={`h-4 w-4 ${formIsLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>

                  {/* Close modal */}
                  <button
                    onClick={closeEditorModal}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition ml-1 touch-manipulation active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Form with Fixed Footer & Scrollable Inputs */}
              <form onSubmit={handleSaveNote} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-3 sm:pt-4 space-y-4">
                  {/* Title Input Field */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700">
                      Note Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekly Roadmap, Design Thoughts..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      autoFocus
                    />
                  </div>

                  {/* Content Textarea Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Content / Body
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {formContent.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      placeholder="Write your thoughts, checklists, or notes here..."
                      rows={5}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-sans"
                    />
                  </div>

                  {/* Category & Color Tint Selectors (Big & Clean) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                        Category
                      </label>
                      <CustomSelect
                        value={formCategory}
                        onChange={(val) => setFormCategory(val)}
                        options={CATEGORY_OPTIONS}
                        icon={<Tag className="h-4 w-4 text-slate-400" />}
                        size="lg"
                        className="w-full"
                        buttonClassName="w-full"
                        direction="up"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                        Card Theme Accent
                      </label>
                      <div className="flex h-11 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-2xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setFormColor(preset.id)}
                              className={`h-7 w-7 rounded-full transition-all touch-manipulation ${preset.dot} ${
                                formColor === preset.id
                                  ? "ring-2 ring-slate-900 ring-offset-2 scale-110"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                              title={preset.name}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                          {getColorStyles(formColor).name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Bottom Actions Bar */}
                <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200/70 p-3.5 sm:p-4 bg-white/70 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={closeEditorModal}
                    className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial rounded-xl bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 touch-manipulation"
                  >
                    {editingNote ? "Update Note" : "Save Note"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. FULL SCREEN / READER VIEW MODAL */}
      <AnimatePresence>
        {readingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReadingNote(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`relative z-10 max-h-[90vh] w-full max-w-2xl flex flex-col overflow-hidden rounded-3xl border ${
                getColorStyles(readingNote.color).border
              } ${getColorStyles(readingNote.color).bg} shadow-2xl`}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200/60 p-4 sm:p-5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {readingNote.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(readingNote.createdAt)}
                  </span>
                  {readingNote.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Pin className="h-3 w-3 fill-amber-500" /> Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleToggleLike(readingNote.id, e)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition touch-manipulation active:scale-95 ${
                      readingNote.isLiked
                        ? "bg-rose-100 text-rose-600"
                        : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                    title={readingNote.isLiked ? "Liked" : "Like"}
                  >
                    <Heart className={`h-4 w-4 ${readingNote.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>

                  <button
                    onClick={() => {
                      const n = readingNote;
                      setReadingNote(null);
                      openEditNoteModal(n);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition touch-manipulation active:scale-95"
                    title="Edit Note"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => handleCopyContent(readingNote, e)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition touch-manipulation active:scale-95"
                    title="Copy Content"
                  >
                    {copiedId === readingNote.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setReadingNote(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition touch-manipulation active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Title & Body Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-3 sm:mb-4 break-words">
                  {readingNote.title}
                </h2>

                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-800 break-words">
                  {readingNote.content || <span className="italic text-slate-400">No content in this note.</span>}
                </div>
              </div>

              {/* Meta footer */}
              <div className="shrink-0 flex items-center justify-between border-t border-slate-200/60 p-4 pt-3 text-xs text-slate-400 bg-white/40">
                <div>
                  Updated: {new Date(readingNote.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div>
                  {(readingNote.content || "").trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// Note Collection Component (Supports Grid, List, Compact layouts)
// -------------------------------------------------------------
interface NoteCollectionProps {
  notes: NoteItem[];
  layoutMode: "grid" | "list" | "compact";
  onReadNote: (note: NoteItem) => void;
  onEditNote: (note: NoteItem) => void;
  onDeleteNote: (id: string, e?: React.MouseEvent) => void;
  onToggleLike: (id: string, e?: React.MouseEvent) => void;
  onTogglePin: (id: string, e?: React.MouseEvent) => void;
  onCopyContent: (note: NoteItem, e?: React.MouseEvent) => void;
  onDuplicateNote: (note: NoteItem, e?: React.MouseEvent) => void;
  copiedId: string | null;
  getColorStyles: (color: string) => { id: string; bg: string; border: string; dot: string };
  formatDate: (date: string) => string;
}

function NoteCollection({
  notes,
  layoutMode,
  onReadNote,
  onEditNote,
  onDeleteNote,
  onToggleLike,
  onTogglePin,
  onCopyContent,
  onDuplicateNote,
  copiedId,
  getColorStyles,
  formatDate,
}: NoteCollectionProps) {
  // 1. GRID LAYOUT
  if (layoutMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => {
            const color = getColorStyles(note.color);
            return (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onReadNote(note)}
                className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border ${color.border} ${color.bg} p-4 sm:p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md touch-manipulation`}
              >
                {/* Card Top: Category & Action icons (Pin, Like) */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-2xs border border-slate-200/50">
                      <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Pin button: visible on mobile so touchscreen users can pin */}
                      <button
                        type="button"
                        onClick={(e) => onTogglePin(note.id, e)}
                        className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg transition touch-manipulation active:scale-90 ${
                          note.isPinned
                            ? "bg-amber-100 text-amber-700 font-bold"
                            : "opacity-75 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-white/80"
                        }`}
                        title={note.isPinned ? "Unpin" : "Pin note"}
                      >
                        <Pin className={`h-3.5 w-3.5 ${note.isPinned ? "fill-amber-500" : ""}`} />
                      </button>

                      {/* Like button */}
                      <button
                        type="button"
                        onClick={(e) => onToggleLike(note.id, e)}
                        className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg transition touch-manipulation active:scale-90 ${
                          note.isLiked
                            ? "bg-rose-50 text-rose-500 scale-105"
                            : "text-slate-400 hover:text-rose-500 hover:bg-white/80"
                        }`}
                        title={note.isLiked ? "Unlike" : "Like note"}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 transition-transform active:scale-125 ${
                            note.isLiked ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Note Title */}
                  <h3 className="line-clamp-2 text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-black">
                    {note.title}
                  </h3>

                  {/* Note Content Excerpt */}
                  <p className="mt-1.5 sm:mt-2 line-clamp-3 sm:line-clamp-4 text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                    {note.content || <span className="italic text-slate-400">Empty note...</span>}
                  </p>
                </div>

                {/* Card Footer: Date & Quick Actions on mobile & desktop */}
                <div className="mt-3.5 sm:mt-4 flex items-center justify-between border-t border-slate-200/60 pt-2.5 sm:pt-3 text-[11px] text-slate-400">
                  <span>{formatDate(note.createdAt)}</span>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => onCopyContent(note, e)}
                      className="flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 active:bg-white active:scale-90 transition touch-manipulation"
                      title="Copy content"
                    >
                      {copiedId === note.id ? (
                        <Check className="h-3.5 w-3.5 sm:h-3 sm:w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNote(note);
                      }}
                      className="flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 active:bg-white active:scale-90 transition touch-manipulation"
                      title="Edit note"
                    >
                      <Edit3 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => onDeleteNote(note.id, e)}
                      className="flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:scale-90 transition touch-manipulation"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // 2. LIST LAYOUT (Wide rows with preview & tags)
  if (layoutMode === "list") {
    return (
      <div className="space-y-2.5 sm:space-y-3">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => {
            const color = getColorStyles(note.color);
            return (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                onClick={() => onReadNote(note)}
                className={`group flex cursor-pointer flex-col gap-2 rounded-2xl border ${color.border} ${color.bg} p-3.5 sm:p-4 shadow-xs transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between touch-manipulation`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.isPinned && (
                      <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-600 shrink-0" />
                    )}
                    <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-black">
                      {note.title}
                    </h3>
                    <span className="shrink-0 rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200/60">
                      {note.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 sm:line-clamp-1 text-xs text-slate-500">
                    {note.content || "Empty note"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <span className="text-[11px] text-slate-400">
                    {formatDate(note.createdAt)}
                  </span>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {/* Pin button */}
                    <button
                      type="button"
                      onClick={(e) => onTogglePin(note.id, e)}
                      className={`flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg transition touch-manipulation active:scale-90 ${
                        note.isPinned
                          ? "bg-amber-100 text-amber-700"
                          : "text-slate-400 hover:text-slate-700 hover:bg-white"
                      }`}
                      title={note.isPinned ? "Unpin" : "Pin note"}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.isPinned ? "fill-amber-500" : ""}`} />
                    </button>

                    {/* Like button */}
                    <button
                      type="button"
                      onClick={(e) => onToggleLike(note.id, e)}
                      className={`flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg transition touch-manipulation active:scale-90 ${
                        note.isLiked
                          ? "bg-rose-50 text-rose-500"
                          : "text-slate-400 hover:text-rose-500 hover:bg-white"
                      }`}
                      title={note.isLiked ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${note.isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => onCopyContent(note, e)}
                      className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 active:scale-90 transition touch-manipulation"
                      title="Copy content"
                    >
                      {copiedId === note.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNote(note);
                      }}
                      className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 active:scale-90 transition touch-manipulation"
                      title="Edit note"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => onDeleteNote(note.id, e)}
                      className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-90 transition touch-manipulation"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // 3. COMPACT LAYOUT (Dense table/list style)
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs divide-y divide-slate-100">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => {
          return (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onReadNote(note)}
              className="group flex cursor-pointer items-center justify-between px-3.5 sm:px-4 py-3 sm:py-2.5 transition hover:bg-slate-50 touch-manipulation"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={(e) => onToggleLike(note.id, e)}
                  className={`flex h-7 w-7 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md transition touch-manipulation active:scale-90 ${
                    note.isLiked ? "text-rose-500" : "text-slate-300 hover:text-rose-500"
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${note.isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                </button>

                {note.isPinned && (
                  <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-600 shrink-0" />
                )}

                <span className="truncate text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                  {note.title}
                </span>

                <span className="hidden md:inline-block text-xs text-slate-400 truncate max-w-xs">
                  · {note.content.substring(0, 50)}...
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-3">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                  {note.category}
                </span>

                <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                  {formatDate(note.createdAt)}
                </span>

                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => onCopyContent(note, e)}
                    className="p-1.5 sm:p-1 text-slate-400 hover:text-slate-700 active:scale-90 transition touch-manipulation"
                    title="Copy note"
                  >
                    {copiedId === note.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNote(note);
                    }}
                    className="p-1.5 sm:p-1 text-slate-400 hover:text-slate-700 active:scale-90 transition touch-manipulation"
                    title="Edit note"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => onDeleteNote(note.id, e)}
                    className="p-1.5 sm:p-1 text-slate-400 hover:text-red-600 active:scale-90 transition touch-manipulation"
                    title="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
