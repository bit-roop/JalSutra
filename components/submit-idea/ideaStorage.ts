export const IDEA_STORAGE_KEY = "jalsutra.ideaSubmissions";
const IDEA_MIGRATION_KEY = "jalsutra.ideaSubmissionsMigrated";

export type IdeaStatus = "Under Review" | "Approved" | "In Progress" | "Rejected";

export type IdeaSubmission = {
  id: string;
  title: string;
  problemStatement: string;
  suggestion: string;
  impact: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  uploadedImages?: string[];
  uploadedDocuments?: string[];
  createdAt: string;
  status: IdeaStatus;
};

export async function readIdeaSubmissions(limit?: number): Promise<IdeaSubmission[]> {
  await migrateLocalIdeaSubmissions();
  const params = limit ? `?limit=${limit}` : "";
  const response = await fetch(`/api/ideas${params}`, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Failed to load ideas");
  return result.ideas;
}

export async function saveIdeaSubmission(payload: FormData): Promise<IdeaSubmission> {
  await migrateLocalIdeaSubmissions();
  const response = await fetch("/api/ideas", { method: "POST", body: payload });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Failed to submit idea");
  window.dispatchEvent(new Event("jalsutra-ideas-updated"));
  return result.idea;
}

async function migrateLocalIdeaSubmissions() {
  if (typeof window === "undefined" || window.localStorage.getItem(IDEA_MIGRATION_KEY)) return;
  const stored = window.localStorage.getItem(IDEA_STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(IDEA_MIGRATION_KEY, "true");
    return;
  }
  const response = await fetch("/api/ideas/migrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: stored,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Failed to migrate existing ideas");
  window.localStorage.removeItem(IDEA_STORAGE_KEY);
  window.localStorage.setItem(IDEA_MIGRATION_KEY, "true");
}

export function formatSubmissionDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
}

export function statusClasses(status: IdeaStatus) {
  if (status === "Approved") return "border-green-200 bg-green-100 text-green-800";
  if (status === "In Progress") return "border-blue-200 bg-blue-100 text-blue-800";
  if (status === "Rejected") return "border-red-200 bg-red-100 text-red-800";
  return "border-amber-200 bg-amber-100 text-amber-800";
}
