import sql from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export type IdeaInsert = {
  id?: string;
  title: string;
  problemStatement: string;
  suggestion: string;
  impact: string;
  location?: string;
  latitude: number | null;
  longitude: number | null;
  imageUrls?: string[];
  documentUrls?: string[];
  createdAt?: string;
  status?: string;
};

export async function insertIdea(idea: IdeaInsert) {
  return sql`
    INSERT INTO ideas (id, title, problem_statement, suggestion, impact, location, latitude, longitude, image_urls, document_urls, status, created_at)
    VALUES (COALESCE(${idea.id ?? null}::uuid, gen_random_uuid()), ${idea.title}, ${idea.problemStatement}, ${idea.suggestion}, ${idea.impact}, ${idea.location ?? null},
            ${idea.latitude}, ${idea.longitude}, ${idea.imageUrls ?? []}, ${idea.documentUrls ?? []}, ${idea.status ?? "Under Review"}, COALESCE(${idea.createdAt ?? null}::timestamp, NOW()))
    RETURNING id, title, problem_statement, suggestion, impact, location, latitude, longitude, image_urls, document_urls, status, created_at
  `;
}

export async function uploadIdeaFiles(files: File[], type: string) {
  return Promise.all(files.map(async (file) => (await uploadToCloudinary(file, type)).contentUrl));
}

export function toIdeaSubmission(row: Record<string, unknown>) {
  const latitude = row.latitude === null ? null : Number(row.latitude);
  const longitude = row.longitude === null ? null : Number(row.longitude);
  return {
    id: row.id, title: row.title, problemStatement: row.problem_statement, suggestion: row.suggestion,
    impact: row.impact, location: row.location ?? "",
    ...(latitude !== null && longitude !== null ? { coordinates: { lat: latitude, lng: longitude } } : {}),
    uploadedImages: row.image_urls ?? [], uploadedDocuments: row.document_urls ?? [],
    status: row.status, createdAt: row.created_at,
  };
}
