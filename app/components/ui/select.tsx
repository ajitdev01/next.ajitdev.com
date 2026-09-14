"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  align?: "left" | "right";
  icon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  direction?: "auto" | "down" | "up";
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  buttonClassName = "",
  align = "left",
  icon,
  size = "default",
  direction = "auto",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine direction when opening so options never get cut off
  const handleToggle = () => {
    if (!isOpen && containerRef.current && typeof window !== "undefined") {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (direction === "up") {
        setOpenDirection("up");
      } else if (direction === "down") {
        setOpenDirection("down");
      } else {
        // "auto": if space below is less than 240px and space above is bigger, open upwards
        if (spaceBelow < 240 && spaceAbove > 200) {
          setOpenDirection("up");
        } else {
          setOpenDirection("down");
        }
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Selected label
  const selectedOption = options.find((opt) => opt.value === value);

  // Size styles
  const sizeStyles = {
    sm: "h-8 px-2.5 text-xs rounded-lg gap-1.5",
    default: "h-10 px-3.5 text-sm font-medium rounded-xl gap-2",
    lg: "h-11 px-4 text-sm font-semibold rounded-xl gap-2.5",
  }[size];

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-4 w-4",
  }[size];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button (Radix UI / shadcn style - Big & Prominent) */}
      <button
        type="button"
        onClick={handleToggle}
        className={`group flex w-full items-center justify-between border border-slate-200 bg-white text-slate-900 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 ${sizeStyles} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400 group-hover:text-slate-700 shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500 font-medium">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`${iconSizes} text-slate-400 transition-transform duration-200 group-hover:text-slate-800 shrink-0 ml-1.5 ${
            isOpen ? "rotate-180 text-slate-900" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu (Radix Select Content style - Never Cut Off) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: openDirection === "up" ? -4 : 4,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: openDirection === "up" ? -4 : 4,
            }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={`absolute z-[999] min-w-[200px] w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/5 ${
              openDirection === "up" ? "bottom-full mb-2" : "top-full mt-1.5"
            } ${align === "right" ? "right-0" : "left-0"}`}
          >
            <div className="max-h-60 overflow-y-auto space-y-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-xs sm:text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {option.badge && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
