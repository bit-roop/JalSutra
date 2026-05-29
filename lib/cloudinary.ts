import crypto from "crypto";

type CloudinaryUpload = {
  secure_url: string;
  resource_type: string;
  public_id: string;
  format?: string;
};

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function assertCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
}

export async function uploadToCloudinary(file: File, uploadType: string) {
  assertCloudinaryConfig();

  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = `jalsutra/knowledge/${uploadType}`;
  const signature = signCloudinaryParams({ folder, timestamp });
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey!);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  const resourceType = uploadType === "photo" ? "image" : uploadType === "text" ? "raw" : uploadType;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const result = (await response.json()) as CloudinaryUpload;

  return {
    contentUrl: result.secure_url,
    thumbnailUrl: getThumbnailUrl(result, uploadType),
  };
}

function signCloudinaryParams(params: Record<string, string>) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function getThumbnailUrl(result: CloudinaryUpload, uploadType: string) {
  if (uploadType === "photo") {
    return result.secure_url;
  }

  if (uploadType === "video") {
    return result.secure_url
      .replace("/video/upload/", "/video/upload/so_1,w_480,h_320,c_fill/")
      .replace(/\.[^/.]+$/, ".jpg");
  }

  return null;
}
