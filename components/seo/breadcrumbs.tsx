import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/lib/seo/schema";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  dark?: boolean;
}

export default function Breadcrumbs({ items, className = "", dark = false }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const textColor = dark ? "text-white/60" : "text-slate-500";
  const activeColor = dark ? "text-white font-medium" : "text-slate-900 font-semibold";
  const hoverColor = dark ? "hover:text-white" : "hover:text-slate-900";
  const separatorColor = dark ? "text-white/30" : "text-slate-300";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.url} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 ${separatorColor}`}
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={`truncate max-w-[200px] sm:max-w-none ${activeColor}`}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className={`flex items-center gap-1 transition-colors ${textColor} ${hoverColor}`}
                >
                  {isFirst && <Home className="h-3 w-3 shrink-0" aria-hidden="true" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
