import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, RefreshCw, Search, Shield, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TopicFilter } from "../hooks/useArticles";
import { formatRelativeTime } from "../utils/time";

const TOPICS: TopicFilter[] = ["All", "Iran", "Israel", "US"];

const TOPIC_STYLES: Record<
  TopicFilter,
  { active: string; dot: string; label: string }
> = {
  All: {
    active: "bg-primary/15 text-primary border-primary/25",
    dot: "",
    label: "All Conflict",
  },
  Iran: {
    active: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    label: "Iran",
  },
  Israel: {
    active: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dot: "bg-blue-500",
    label: "Israel",
  },
  US: {
    active: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    label: "US",
  },
};

interface HeaderProps {
  activeTopic: TopicFilter;
  onTopicChange: (t: TopicFilter) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  lastFetchedAt: bigint;
}

export function Header({
  activeTopic,
  onTopicChange,
  searchTerm,
  onSearchChange,
  isLoading,
  onRefresh,
  lastFetchedAt,
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalSearch(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange(val);
      }, 300);
    },
    [onSearchChange],
  );

  const clearSearch = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
  }, [onSearchChange]);

  // Sync if parent resets
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const lastUpdated =
    lastFetchedAt > 0n ? formatRelativeTime(lastFetchedAt) : null;

  return (
    <header className="header-blur sticky top-0 z-50 w-full border-b border-border">
      {/* Alert strip */}
      <div className="live-alert-strip border-b border-red-900/30 bg-red-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-1.5">
            <AlertTriangle
              className="h-3.5 w-3.5 text-red-500/80 shrink-0"
              strokeWidth={2}
            />
            <span className="text-xs text-red-400/80 font-medium tracking-wide">
              Live conflict coverage — Iran · Israel · US
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground/70 font-medium tracking-widest uppercase shrink-0">
              Mar 3–4, 2026 · Last 24 hrs
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: logo + search + refresh */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo block */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/15 border border-primary/25 relative">
              <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                  Geo<span className="text-primary">Trust</span>
                </h1>
                {/* LIVE badge */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest bg-red-500/15 text-red-400 border border-red-500/25 uppercase">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5 tracking-widest uppercase font-medium">
                  Iran · Israel · US Conflict Watch
                </p>
                {lastUpdated && (
                  <p className="text-[10px] text-muted-foreground/60 leading-none mt-0.5">
                    · Updated {lastUpdated}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              strokeWidth={1.5}
            />
            <Input
              data-ocid="header.search_input"
              type="search"
              placeholder="Search Iran, Israel, US war news..."
              value={localSearch}
              onChange={handleSearchInput}
              className="pl-9 pr-9 h-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 focus-visible:border-primary/40 text-sm rounded-lg"
              aria-label="Search conflict news"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Refresh button */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  data-ocid="header.button"
                  type="button"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-secondary hover:bg-secondary/80 hover:border-primary/30 text-muted-foreground hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Refresh feed"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "spin" : ""}`}
                    strokeWidth={1.75}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-popover text-popover-foreground border-border text-xs"
              >
                Refresh feed
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Topic filter chips */}
        <nav
          className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-none -mx-1 px-1"
          aria-label="Filter by conflict topic"
        >
          {TOPICS.map((t) => {
            const isActive = activeTopic === t;
            const style = TOPIC_STYLES[t];
            return (
              <button
                key={t}
                data-ocid="topic.filter.tab"
                type="button"
                onClick={() => onTopicChange(t)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border ${
                  isActive
                    ? style.active
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {t !== "All" && (
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? style.dot : "bg-muted-foreground/40"}`}
                    aria-hidden="true"
                  />
                )}
                {t === "All" && isActive && (
                  <motion.span
                    layoutId="topic-active-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{style.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
