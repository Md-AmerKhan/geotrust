import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      data-ocid="error.error_state"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      role="alert"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Unable to load articles
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      <Button
        data-ocid="error.button"
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="gap-2 border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
