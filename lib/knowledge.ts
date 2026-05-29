export type KnowledgeUploadType = "voice" | "text" | "photo" | "video";

export type KnowledgeUpload = {
  id: string;
  title: string;
  description: string;
  type: KnowledgeUploadType;
  language: string;
  thumbnail_url: string | null;
  file_url: string | null;
  created_at: string;
};

export const languages = [
  "Hindi",
  "Bhojpuri",
  "Maithili",
  "Magahi",
  "Bengali",
  "English",
  "Other",
];
