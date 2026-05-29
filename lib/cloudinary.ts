import crypto from "crypto";

type CloudinaryUpload = {
  secure_url: string;
  resource_type: string;
  public_id: string;
  format?: string;
};

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function assertCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
}

export async function uploadToCloudinary(file: File, uploadType: string) {
  assertCloudinaryConfig();

  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = `jalsutra/knowledge/${uploadType}`;
  const signature = signCloudinaryParams({ folder, timestamp });
  const formData = new FormData();
  const resourceType = getResourceType(uploadType, file);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  formData.append("file", file);
  formData.append("api_key", apiKey!);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  console.info("Cloudinary upload config:", {
    uploadUrl,
    cloudName,
    uploadPresetConfigured: Boolean(uploadPreset),
    uploadType,
    resourceType,
    fileType: file.type || "unknown",
    fileSize: file.size,
  });

  if (!uploadPreset) {
    console.warn(
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not configured. This server upload uses signed API credentials, but unsigned browser uploads will need a valid unsigned upload preset."
    );
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const responseBody = await response.text();
  const responseHeaders = Object.fromEntries(response.headers.entries());
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    console.error("Cloudinary upload failed:", {
      uploadUrl,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    });

    if (contentType.includes("text/html")) {
      console.error("Cloudinary returned HTML instead of JSON. Full upload URL:", uploadUrl);
    }

    throw new Error(
      `Cloudinary upload failed with status ${response.status}. Check server logs for upload diagnostics.`
    );
  }

  if (!contentType.includes("application/json")) {
    console.error("Cloudinary upload returned unexpected content type:", {
      uploadUrl,
      status: response.status,
      headers: responseHeaders,
      body: responseBody,
    });

    if (contentType.includes("text/html")) {
      console.error("Cloudinary returned HTML instead of JSON. Full upload URL:", uploadUrl);
    }

    throw new Error(
      `Cloudinary upload failed: expected JSON but received ${contentType || "unknown content type"}.`
    );
  }

  const result = JSON.parse(responseBody) as CloudinaryUpload;

  return {
    contentUrl: result.secure_url,
    thumbnailUrl: getThumbnailUrl(result, uploadType),
  };
}

function getResourceType(uploadType: string, file: File) {
  if (uploadType === "voice" || file.type.startsWith("audio/")) {
    return "video";
  }

  if (uploadType === "video" || file.type.startsWith("video/")) {
    return "video";
  }

  if (uploadType === "photo" || file.type.startsWith("image/")) {
    return "auto";
  }

  return "auto";
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
