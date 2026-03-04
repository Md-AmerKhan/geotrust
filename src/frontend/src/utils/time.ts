/**
 * Convert a Unix timestamp (seconds) or ISO date string to a relative time string.
 */
export function formatRelativeTime(input: bigint | string): string {
  let date: Date;

  if (typeof input === "bigint") {
    date = new Date(Number(input) * 1000);
  } else {
    date = new Date(input);
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 30) return "just now";
  if (diffSeconds < 90) return "1 minute ago";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 2) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 2) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date as "Mar 3, 2026 · 11:00 UTC"
 */
export function formatAbsoluteTime(input: bigint | string): string {
  let date: Date;

  if (typeof input === "bigint") {
    date = new Date(Number(input) * 1000);
  } else {
    date = new Date(input);
  }

  if (Number.isNaN(date.getTime())) return "";

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return `${datePart} · ${timePart} UTC`;
}

/**
 * Returns true if the date is within the last N hours.
 */
export function isWithinHours(input: bigint | string, hours: number): boolean {
  let date: Date;

  if (typeof input === "bigint") {
    date = new Date(Number(input) * 1000);
  } else {
    date = new Date(input);
  }

  if (Number.isNaN(date.getTime())) return false;

  const diffMs = Date.now() - date.getTime();
  return diffMs <= hours * 60 * 60 * 1000;
}
