export type ImpactSubmission = {
  id: string;
  mission_id: string;
  caption: string;
  description: string;
  image_url: string;
  thumbnail_url: string | null;
  created_at: string;
};

export type CreateImpactSubmissionResponse = {
  submission: ImpactSubmission;
};
