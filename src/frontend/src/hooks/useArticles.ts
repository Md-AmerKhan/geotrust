import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

export type TopicFilter = "All" | "Iran" | "Israel" | "US";

interface UseArticlesOptions {
  topic: TopicFilter;
  searchTerm: string;
}

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function matchesTopic(article: Article, topic: TopicFilter): boolean {
  if (topic === "All") return true;
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  if (topic === "Iran") return haystack.includes("iran");
  if (topic === "Israel") return haystack.includes("israel");
  if (topic === "US")
    return (
      haystack.includes(" us ") ||
      haystack.includes("united states") ||
      haystack.includes("america") ||
      haystack.includes("washington") ||
      haystack.startsWith("us ") ||
      haystack.includes(" u.s.")
    );
  return true;
}

export function useArticles({
  topic,
  searchTerm,
}: UseArticlesOptions): UseArticlesResult {
  const { actor, isFetching: isActorLoading } = useActor();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  const fetchArticles = useCallback(async () => {
    if (!actor || isActorLoading) return;

    setIsLoading(true);
    setError(null);
    abortRef.current = false;

    try {
      let fetched: Article[];

      if (searchTerm.trim()) {
        fetched = await actor.searchArticles(searchTerm.trim());
      } else {
        fetched = await actor.getLatestArticles();
      }

      // Client-side topic filter
      if (topic !== "All") {
        fetched = fetched.filter((a) => matchesTopic(a, topic));
      }

      if (!abortRef.current) {
        setArticles(fetched);
      }
    } catch (err) {
      if (!abortRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load articles. Please try again.",
        );
      }
    } finally {
      if (!abortRef.current) {
        setIsLoading(false);
      }
    }
  }, [actor, isActorLoading, topic, searchTerm]);

  // Fetch on dependency changes
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchArticles();
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      abortRef.current = true;
    };
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    error,
    refresh: fetchArticles,
  };
}
