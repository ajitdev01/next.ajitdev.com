"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

interface DatePickerProps {
  date: string | null; // ISO string or YYYY-MM-DD
  onChange: (dateStr: string | null) => void;
  placeholder?: string;
  className?: string;
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  date,
  onChange,
  placeholder = "Pick a due date",
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected date parsed
  const selectedDate = useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

  // Current view month/year
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedDate) return new Date(selectedDate);
    return new Date();
  });

  // Sync viewDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Navigation
  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Grid days
  const calendarCells = useMemo(() => {
    const cells: {
      dayNumber: number;
      isCurrentMonth: boolean;
      date: Date;
    }[] = [];

    // Preceding days from prev month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      cells.push({
        dayNumber: d,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, d),
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        dayNumber: d,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, d),
      });
    }

    // Remaining slots to complete 6 weeks grid (35 or 42 cells)
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        dayNumber: d,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, d),
      });
    }

    return cells;
  }, [currentYear, currentMonth, firstDayOfWeek, daysInMonth, daysInPrevMonth]);

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (d: Date) => {
    if (!selectedDate) return false;
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Select day
  const handleSelectDay = (cellDate: Date) => {
    const formatted = cellDate.toISOString();
    onChange(formatted);
    setIsOpen(false);
  };

  // Quick Presets
  const handlePreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(0, 0, 0, 0);
    onChange(d.toISOString());
    setIsOpen(false);
  };

  const formatButtonDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button (shadcn/ui style) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 ${
          selectedDate
            ? "border-slate-300 text-slate-900 font-medium"
            : "border-slate-200 text-slate-500 hover:text-slate-800"
        } hover:bg-slate-50/70`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">
            {selectedDate ? formatButtonDate(selectedDate) : placeholder}
          </span>
        </div>

        {selectedDate ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 rotate-90 shrink-0" />
        )}
      </button>

      {/* Popover Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5"
          >
            {/* Presets Header */}
            <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-2.5 mb-2.5">
              <button
                type="button"
                onClick={() => handlePreset(0)}
                className="flex-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1)}
                className="flex-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handlePreset(7)}
                className="flex-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                In 1 Week
              </button>
            </div>

            {/* Navigation (Month / Year) */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold text-slate-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <span
                  key={day}
                  className="h-7 text-[11px] font-medium text-slate-400 flex items-center justify-center"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, idx) => {
                const selected = isSelected(cell.date);
                const today = isToday(cell.date);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDay(cell.date)}
                    className={`h-8 w-8 rounded-md text-xs font-normal transition-all flex items-center justify-center relative ${
                      selected
                        ? "bg-slate-900 text-white font-semibold hover:bg-slate-900 shadow-xs"
                        : cell.isCurrentMonth
                        ? "text-slate-800 hover:bg-slate-100"
                        : "text-slate-300 hover:bg-slate-50"
                    } ${today && !selected ? "border border-slate-300 font-semibold" : ""}`}
                  >
                    {cell.dayNumber}
                    {today && !selected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Popover Footer */}
            {selectedDate && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Selected: {formatButtonDate(selectedDate)}</span>
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false);
                  }}
                  className="text-red-600 hover:underline font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
