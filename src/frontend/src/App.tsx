import { Clock, Shield, Siren } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArticleCard } from "./components/ArticleCard";
import { ErrorState } from "./components/ErrorState";
import { Header } from "./components/Header";
import { SkeletonCard } from "./components/SkeletonCard";
import { useActor } from "./hooks/useActor";
import { type TopicFilter, useArticles } from "./hooks/useArticles";

function EmptyState({ isSearch }: { isSearch: boolean }) {
  return (
    <div
      data-ocid="articles.empty_state"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary border border-border">
        <Shield
          className="h-8 w-8 text-muted-foreground/60"
          strokeWidth={1.25}
        />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        {isSearch
          ? "No results for that search"
          : "No conflict updates available yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        {isSearch
          ? "Try different keywords or clear the search to browse all conflict reports."
          : "Monitoring Iran, Israel, and US conflict feeds — check back shortly."}
      </p>
    </div>
  );
}

export default function App() {
  const [activeTopic, setActiveTopic] = useState<TopicFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFetchedAt, setLastFetchedAt] = useState<bigint>(0n);

  const { actor, isFetching: isActorLoading } = useActor();

  const { articles, isLoading, error, refresh } = useArticles({
    topic: activeTopic,
    searchTerm,
  });

  // Fetch lastFetchedAt on mount and after each refresh
  useEffect(() => {
    if (!actor || isActorLoading) return;
    actor
      .getLastFetchedAt()
      .then(setLastFetchedAt)
      .catch(() => {});
  }, [actor, isActorLoading]);

  const isSearch = searchTerm.trim().length > 0;
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Header */}
      <Header
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
        onRefresh={refresh}
        lastFetchedAt={lastFetchedAt}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article count bar + LAST 24 HOURS badge */}
        <AnimatePresence mode="wait">
          {!isLoading && !error && (
            <motion.div
              key="count-bar"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-2 mb-6 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <Siren
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <span className="text-sm text-muted-foreground">
                  {articles.length > 0 ? (
                    <>
                      Showing{" "}
                      <span className="text-foreground font-medium">
                        {articles.length}
                      </span>{" "}
                      {articles.length === 1
                        ? "conflict report"
                        : "conflict reports"}
                      {isSearch && (
                        <span className="ml-1">
                          for{" "}
                          <span className="text-primary font-medium">
                            &ldquo;{searchTerm}&rdquo;
                          </span>
                        </span>
                      )}
                      {activeTopic !== "All" && !isSearch && (
                        <span className="ml-1">
                          on{" "}
                          <span className="text-primary font-medium">
                            {activeTopic}
                          </span>
                        </span>
                      )}
                    </>
                  ) : (
                    "No conflict reports to show"
                  )}
                </span>
              </div>

              {/* LAST 24 HOURS badge */}
              <span
                data-ocid="feed.badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border border-green-500/30 bg-green-500/10 text-green-400"
              >
                <Clock className="h-3 w-3" strokeWidth={2} />
                Last 24 Hours
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeletons */}
        {isLoading && (
          <div
            data-ocid="loading.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Loading conflict reports"
            aria-busy="true"
          >
            {(["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"] as const).map(
              (id) => (
                <SkeletonCard key={id} />
              ),
            )}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div data-ocid="articles.error_state">
            <ErrorState message={error} onRetry={refresh} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && articles.length === 0 && (
          <EmptyState isSearch={isSearch} />
        )}

        {/* Article grid */}
        {!isLoading && !error && articles.length > 0 && (
          <div
            data-ocid="articles.list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {articles.map((article, i) => (
              <ArticleCard
                key={String(article.id)}
                article={article}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        data-ocid="footer.section"
        className="mt-16 border-t border-border bg-card/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-foreground">
                Geo<span className="text-primary">Trust</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
              Iran · Israel · US Conflict Intelligence
            </p>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              News sourced from verified global media. Articles are displayed
              for informational purposes only. Always refer to original sources
              for complete context and verified facts.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              &copy; {currentYear}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors"
              >
                Built with love using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
