import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const reportSchema = z.object({
  title: z.string().trim(),
  category: z.string(),
  description: z.string().trim(),
  impactObservation: z.string(),
  observedAt: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  status: z.enum(["draft", "submitted"]),
}).superRefine((report, context) => {
  if (report.status === "submitted" && !report.title) context.addIssue({ code: "custom", path: ["title"], message: "Spot title is required" });
  if (report.status === "submitted" && !report.category) context.addIssue({ code: "custom", path: ["category"], message: "Select a category" });
  if (report.status === "submitted" && !report.description) context.addIssue({ code: "custom", path: ["description"], message: "Description is required" });
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const report = reportSchema.parse(JSON.parse(String(formData.get("payload") ?? "{}")));
    const beforeImage = formData.get("before_image");
    const afterImage = formData.get("after_image");
    const evidenceFiles = formData.getAll("evidence_files").filter((file): file is File => file instanceof File);

    if (beforeImage instanceof File && !beforeImage.type.startsWith("image/")) {
      return NextResponse.json({ error: "Before image must be an image file" }, { status: 400 });
    }
    if (afterImage instanceof File && !afterImage.type.startsWith("image/")) {
      return NextResponse.json({ error: "After image must be an image file" }, { status: 400 });
    }
    if (evidenceFiles.some((file) => !file.type.startsWith("image/") && file.type !== "application/pdf")) {
      return NextResponse.json({ error: "Evidence files must be images or PDFs" }, { status: 400 });
    }

    const beforeImageUrl = beforeImage instanceof File ? (await uploadToCloudinary(beforeImage, "report-before")).contentUrl : null;
    const afterImageUrl = afterImage instanceof File ? (await uploadToCloudinary(afterImage, "report-after")).contentUrl : null;
    const uploadedEvidence = await Promise.all(evidenceFiles.map(async (file) => ({
      fileUrl: (await uploadToCloudinary(file, "report-evidence")).contentUrl,
      fileType: file.type || "application/octet-stream",
    })));

    const [savedReport] = await sql`
      INSERT INTO reports (title, category, description, impact_observation, latitude, longitude, before_image_url, after_image_url, status, observed_at)
      VALUES (${report.title || null}, ${report.category || null}, ${report.description || null}, ${report.impactObservation || null}, ${report.latitude}, ${report.longitude}, ${beforeImageUrl}, ${afterImageUrl}, ${report.status}, ${report.observedAt || null})
      RETURNING id, status
    `;

    for (const file of uploadedEvidence) {
      await sql`INSERT INTO report_files (report_id, file_url, file_type) VALUES (${savedReport.id}, ${file.fileUrl}, ${file.fileType})`;
    }

    return NextResponse.json({ report: savedReport }, { status: 201 });
  } catch (error) {
    console.error("Report save error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save report" }, { status: 400 });
  }
}
