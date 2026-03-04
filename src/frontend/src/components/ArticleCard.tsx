import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  isWithinHours,
} from "../utils/time";

interface ConflictTag {
  label: string;
  className: string;
}

function getConflictTags(title: string, description: string): ConflictTag[] {
  const haystack = `${title} ${description}`.toLowerCase();
  const tags: ConflictTag[] = [];

  if (haystack.includes("iran")) {
    tags.push({
      label: "Iran",
      className: "bg-red-500/15 text-red-400 border border-red-500/25",
    });
  }
  if (haystack.includes("israel")) {
    tags.push({
      label: "Israel",
      className: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    });
  }
  if (
    haystack.includes(" us ") ||
    haystack.includes("united states") ||
    haystack.includes("america") ||
    haystack.includes("washington") ||
    haystack.startsWith("us ") ||
    haystack.includes(" u.s.")
  ) {
    tags.push({
      label: "US",
      className: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    });
  }

  return tags;
}

const SOURCE_BADGE_CLASSES: Record<string, string> = {
  "BBC World": "source-badge-bbc",
  Reuters: "source-badge-reuters",
  "Associated Press": "source-badge-ap",
  "Al Jazeera English": "source-badge-aljazeera",
  "The Guardian": "source-badge-guardian",
};

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const badgeClass =
    SOURCE_BADGE_CLASSES[article.source] ?? "bg-muted text-foreground";

  const relativeTime = formatRelativeTime(article.publishedAt);
  const absoluteTime = formatAbsoluteTime(article.publishedAt);
  const isRecent = isWithinHours(article.publishedAt, 24);
  const conflictTags = getConflictTags(article.title, article.description);
  const hasImage = article.imageUrl && article.imageUrl.trim() !== "";

  return (
    <motion.article
      data-ocid={`article.item.${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.5),
        ease: "easeOut",
      }}
      className="card-glow group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Article image */}
      {hasImage && (
        <div className="aspect-video w-full overflow-hidden bg-secondary">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header: badge + time */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeClass}`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60" />
            {article.source}
          </span>
          <div className="flex flex-col items-end gap-0.5">
            <time
              className="text-xs text-muted-foreground font-medium tabular-nums"
              title={absoluteTime}
            >
              {absoluteTime}
            </time>
            <span
              className={`text-[10px] font-medium tabular-nums ${isRecent ? "text-green-400/80" : "text-muted-foreground/60"}`}
            >
              {relativeTime}
            </span>
          </div>
        </div>

        {/* Conflict tags */}
        {conflictTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap -mt-1">
            {conflictTags.map((tag) => (
              <span
                key={tag.label}
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${tag.className}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Headline */}
        <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-3">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {article.description}
        </p>

        {/* Footer: Read Original */}
        <div className="pt-1 flex items-center justify-end">
          <Button
            data-ocid={`article.primary_button.${index}`}
            asChild
            size="sm"
            className="gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 rounded-lg text-xs font-medium transition-all duration-200"
            variant="outline"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read full article: ${article.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read Original
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
