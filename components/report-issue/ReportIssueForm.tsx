"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Camera,
  LocateFixed,
  Loader2,
  MapPin,
  Paperclip,
  Search,
  Send,
  Upload,
  X,
} from "lucide-react";

const LocationMap = dynamic(
  () => import("./LocationMap"),
  { ssr: false }
);

const categories = [
  { value: "wetland", label: "Wetland", image: "/images/categories/wetland.png" },
  { value: "bird_zone", label: "Bird Zone", image: "/images/categories/bird-zone.png" },
  { value: "fish_zone", label: "Fish Zone", image: "/images/categories/fish-zone.png" },
  { value: "no_fishing_zone", label: "No Fishing Zone", image: "/images/categories/no-fishing.png" },
  { value: "sacred_grove", label: "Sacred Grove", image: "/images/categories/sacred-grove.png" },
] as const;

const reportSchema = z.object({
  title: z.string().trim().min(1, "Spot title is required"),
  category: z.string().min(1, "Select a category"),
  description: z.string().trim().min(1, "Description is required"),
  impactObservation: z.string(),
  observedAt: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

type ReportValues = z.infer<typeof reportSchema>;
type PhotoField = "beforeImage" | "afterImage";

const panelStyle = {
  background: "rgba(255, 250, 238, 0.9)",
  border: "1px solid rgba(168,125,54,0.3)",
  boxShadow: "0 5px 16px rgba(91,63,35,0.12)",
};

export default function ReportIssueForm() {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const beforeInput = useRef<HTMLInputElement>(null);
  const afterInput = useRef<HTMLInputElement>(null);
  const evidenceInput = useRef<HTMLInputElement>(null);
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      impactObservation: "",
      observedAt: "",
      latitude: null,
      longitude: null,
    },
  });

  const selectedCategory = watch("category");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  function choosePhoto(field: PhotoField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (field === "beforeImage") setBeforeImage(file);
    else setAfterImage(file);
  }

  function removePhoto(field: PhotoField) {
    if (field === "beforeImage") {
      setBeforeImage(null);
      if (beforeInput.current) beforeInput.current.value = "";
    } else {
      setAfterImage(null);
      if (afterInput.current) afterInput.current.value = "";
    }
  }

  function chooseEvidence(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setEvidenceFiles(files.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf"));
  }

  function updateLocation(latitude: number, longitude: number) {
    setValue("latitude", latitude);
    setValue("longitude", longitude);
  }

  async function searchLocation() {
    if (!locationQuery.trim()) return;
    setIsLocating(true);
    setLocationMessage("");
    try {
      const params = new URLSearchParams({ q: locationQuery.trim() });
      const response = await fetch(`/api/location-search?${params.toString()}`);
      if (!response.ok) throw new Error("Location search failed");
      const results = await response.json() as Array<{ lat: string; lon: string; display_name: string }>;
      if (!results[0]) throw new Error("Location not found");
      updateLocation(Number(results[0].lat), Number(results[0].lon));
      setLocationMessage(results[0].display_name);
    } catch (error) {
      setLocationMessage(error instanceof Error ? error.message : "Location search failed");
    } finally {
      setIsLocating(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Current location is not supported by this browser");
      return;
    }
    setIsLocating(true);
    setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        updateLocation(coords.latitude, coords.longitude);
        setLocationMessage("Current location selected");
        setIsLocating(false);
      },
      () => {
        setLocationMessage("Unable to access current location");
        setIsLocating(false);
      }
    );
  }

  async function saveReport(values: ReportValues, status: "draft" | "submitted") {
    setIsSaving(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify({ ...values, status }));
      if (beforeImage) formData.append("before_image", beforeImage);
      if (afterImage) formData.append("after_image", afterImage);
      evidenceFiles.forEach((file) => formData.append("evidence_files", file));

      const response = await fetch("/api/reports", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Failed to save report");
      setMessage(status === "draft" ? "Draft saved." : "Report submitted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save report");
    } finally {
      setIsSaving(false);
    }
  }

  const saveDraft = () => saveReport(getValues(), "draft");
  const submitReport = handleSubmit((values) => saveReport(values, "submitted"));

  return (
    <main className="flex-1 px-4 py-5 pb-24 md:px-5 md:pb-5">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-4 text-center font-display text-3xl font-bold text-js-green-dark">Report Ecological Spot</h1>
        <div>
          <form className="rounded-2xl p-4 md:p-5" style={panelStyle} onSubmit={submitReport}>
            <Section number="1" title="Upload Images (Before / After)">
              <div className="grid gap-3 sm:grid-cols-2">
                <PhotoUpload label="Before Photo" file={beforeImage} inputRef={beforeInput} onChange={(event) => choosePhoto("beforeImage", event)} onRemove={() => removePhoto("beforeImage")} />
                <PhotoUpload label="After Photo" file={afterImage} inputRef={afterInput} onChange={(event) => choosePhoto("afterImage", event)} onRemove={() => removePhoto("afterImage")} />
              </div>
            </Section>

            <Section number="2" title="Spot Title">
              <input {...register("title")} placeholder="Enter spot title" className="w-full rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 py-2 text-sm outline-none" />
              {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
            </Section>

            <Section number="3" title="Category">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {categories.map(({ value, label, image }) => (
                  <button key={value} type="button" onClick={() => setValue("category", value, { shouldValidate: true })} className="rounded-xl px-2 py-3 text-center text-xs" style={{ border: selectedCategory === value ? "2px solid #3d6b1e" : "1px solid #e1d1b8", background: "#fbf4e6" }}>
                    <Image src={image} alt="" width={96} height={96} className="mx-auto mb-1 h-[96px] w-[96px] object-contain" />
                    {label}
                  </button>
                ))}
              </div>
              {errors.category && <ErrorText>{errors.category.message}</ErrorText>}
            </Section>

            <Section number="4" title="Location">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3">
                  <Search size={16} className="mr-2 shrink-0 text-js-green" />
                  <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Search location" className="w-full bg-transparent py-2 text-sm outline-none" />
                </div>
                <button type="button" disabled={isLocating} onClick={searchLocation} className="flex items-center justify-center gap-2 rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-4 py-2 text-sm font-semibold text-js-green"><Search size={16} />Search</button>
                <button type="button" disabled={isLocating} onClick={useCurrentLocation} className="flex items-center justify-center gap-2 rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-4 py-2 text-sm font-semibold text-js-green"><LocateFixed size={16} />Use Current Location</button>
              </div>
              <p className="mb-2 text-xs text-js-text-light"><MapPin size={13} className="mr-1 inline" />Pick location on map</p>
              <div className="h-44 overflow-hidden rounded-xl border border-[#d9c6a7]">
                <LocationMap latitude={latitude} longitude={longitude} onChange={updateLocation} />
              </div>
              {locationMessage && <p className="mt-2 text-xs text-js-text-light">{locationMessage}</p>}
              {latitude !== null && longitude !== null && <p className="mt-2 text-xs text-js-text-light">Selected coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}</p>}
            </Section>

            <Section number="5" title="Description">
              <textarea {...register("description")} rows={3} placeholder="Add details about the spot..." className="w-full resize-none rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 py-2 text-sm outline-none" />
              {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
            </Section>

            <div className="grid gap-0 md:grid-cols-[2fr_3fr]">
              <div className="flex md:border-r md:border-[#e3d3b8] md:pr-3">
                <Section number="6" title="Date & Time">
                  <input {...register("observedAt")} type="datetime-local" className="h-[44px] w-full rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 py-2 text-sm outline-none md:max-w-[80%]" />
                </Section>
              </div>
              <div className="flex md:pl-3">
                <Section number="7" title="Impact / Observation">
                  <textarea {...register("impactObservation")} rows={2} placeholder="Share your observation / impact..." className="w-full resize-none rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 py-2 text-sm outline-none" />
                </Section>
              </div>
            </div>

            <Section icon={<Paperclip size={20} />} title="Upload Evidence / Supporting Files">
              <input ref={evidenceInput} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={chooseEvidence} />
              <button type="button" onClick={() => evidenceInput.current?.click()} className="flex items-center gap-2 rounded-lg border border-dashed border-[#80633e] px-4 py-2 text-sm font-semibold text-js-green"><Upload size={17} />Upload Files</button>
              {evidenceFiles.length > 0 && <p className="mt-2 text-xs text-js-text-light">{evidenceFiles.map((file) => file.name).join(", ")}</p>}
            </Section>

            {message && <p className="mb-3 text-sm text-js-green">{message}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" disabled={isSaving} onClick={saveDraft} className="rounded-lg border border-[#9f4b33] px-5 py-3 font-semibold text-[#9f4b33]">Save Draft</button>
              <button type="submit" disabled={isSaving} className="flex items-center justify-center gap-2 rounded-lg bg-js-green px-5 py-3 font-semibold text-[#fff8df]">{isSaving ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Section({ number, icon, title, children }: { number?: string; icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section className="w-full border-b border-[#e3d3b8] py-3 first:pt-0"><h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-js-text">{number && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-js-green text-xs text-white">{number}</span>}{icon}{title}</h2>{children}</section>;
}

function PhotoUpload({ label, file, inputRef, onChange, onRemove }: { label: string; file: File | null; inputRef: React.RefObject<HTMLInputElement>; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void }) {
  const preview = file ? URL.createObjectURL(file) : null;
  return <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#bba98d] bg-[#fffdf7] text-center"><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />{preview ? <><Image src={preview} alt={`${label} preview`} fill unoptimized className="object-cover" /><button type="button" onClick={onRemove} className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-[#9f4b33]"><X size={15} /></button><button type="button" onClick={() => inputRef.current?.click()} className="absolute bottom-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-js-green">Replace</button></> : <button type="button" onClick={() => inputRef.current?.click()} className="text-xs text-js-text"><Camera size={28} className="mx-auto mb-1 text-js-green" />{label}<br /><span className="font-semibold">Add Photo</span></button>}</div>;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-[#a84730]">{children}</p>;
}
