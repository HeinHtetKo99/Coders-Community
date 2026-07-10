export const FIRST_VISIT_KEY = "coders-community-visited";

export function hasVisitedBefore(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(FIRST_VISIT_KEY) === "true";
}

export function markAsVisited(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FIRST_VISIT_KEY, "true");
}
