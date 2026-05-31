"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  FileText,
  Lightbulb,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  Target,
  Users,
  X,
} from "lucide-react";
import MySubmissions from "./MySubmissions";
import { saveIdeaSubmission } from "./ideaStorage";

const LocationMap = dynamic(() => import("@/components/report-issue/LocationMap"), { ssr: false });

type UploadKind = "image" | "document" | "all";
type UploadedFile = { id: string; file: File };

const tips = [
  { icon: Lightbulb, text: "Identify a real problem in your community or environment." },
  { icon: Target, text: "Suggest a practical and sustainable solution." },
  { icon: Users, text: "Think about who will benefit and how it can be implemented." },
  { icon: CheckCircle2, text: "Describe the positive impact on nature and people." },
];

export default function SubmitIdeaForm() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const documentInput = useRef<HTMLInputElement>(null);
  const allInput = useRef<HTMLInputElement>(null);

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []).filter(
      (file) => ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    );
    setFiles((current) => [
      ...current,
      ...selected.map((file) => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file })),
    ]);
    event.target.value = "";
  }

  function chooseUpload(kind: UploadKind) {
    if (kind === "image") imageInput.current?.click();
    if (kind === "document") documentInput.current?.click();
    if (kind === "all") allInput.current?.click();
  }

  function updateLocation(nextLatitude: number, nextLongitude: number, name = "Selected map location") {
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
    setLocationName(name);
  }

  async function searchLocation() {
    if (!locationQuery.trim()) return;
    setIsLocating(true);
    setLocationMessage("");
    try {
      const response = await fetch(`/api/location-search?${new URLSearchParams({ q: locationQuery.trim() })}`);
      if (!response.ok) throw new Error("Location search failed");
      const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (!results[0]) throw new Error("Location not found");
      updateLocation(Number(results[0].lat), Number(results[0].lon), results[0].display_name);
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
        updateLocation(coords.latitude, coords.longitude, "Current location");
        setLocationMessage("Current location selected");
        setIsLocating(false);
      },
      () => {
        setLocationMessage("Unable to access current location");
        setIsLocating(false);
      }
    );
  }

  async function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("location", locationName);
    if (latitude !== null) data.set("latitude", String(latitude));
    if (longitude !== null) data.set("longitude", String(longitude));
    files.forEach(({ file }) => data.append("files", file));
    await saveIdeaSubmission(data);
    form.reset();
    setFiles([]);
    setLatitude(null);
    setLongitude(null);
    setLocationName("");
    setLocationQuery("");
    setLocationMessage("");
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2400);
  }

  return (
    <main className="px-4 py-5 pb-24 md:px-5 md:pb-6">
      {showToast && (
        <div className="fixed right-4 top-4 z-[100] flex items-center gap-2 rounded-lg bg-js-green px-4 py-3 text-sm font-semibold text-[#fff8df] shadow-lg">
          <CheckCircle2 size={18} /> Idea submitted successfully.
        </div>
      )}
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-5">
          <h1 className="font-display text-3xl font-bold text-js-green-dark md:text-4xl">Submit Your Idea</h1>
          <p className="mt-1 max-w-3xl text-sm text-js-text-light">
            Share ideas, suggestions, and policy recommendations that can help communities and ecosystems.
          </p>
        </div>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <form onSubmit={submitIdea} className="rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 p-4 shadow-[0_5px_16px_rgba(91,63,35,0.10)] md:p-5">
            <FormField label="Idea Title">
              <input required name="title" placeholder="Enter a short title for your idea" className="idea-input" />
            </FormField>
            <FormField label="Problem Statement">
              <textarea required name="problemStatement" rows={3} placeholder="What problem does this idea address?" className="idea-input resize-none" />
            </FormField>
            <FormField label="Your Suggestion / Policy Idea">
              <textarea required name="suggestion" rows={4} placeholder="Describe your idea in detail" className="idea-input resize-none" />
            </FormField>
            <FormField label="Expected Impact">
              <textarea required name="expectedImpact" rows={3} placeholder="How will this help biodiversity and people?" className="idea-input resize-none" />
            </FormField>

            <section className="border-b border-[#e3d3b8] py-4">
              <h2 className="mb-2 text-sm font-bold text-js-text">Location <span className="font-normal">(Optional)</span></h2>
              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="flex min-w-0 flex-1 items-center rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3">
                  <Search size={16} className="mr-2 shrink-0 text-js-green" />
                  <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Search location" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                </div>
                <button type="button" disabled={isLocating} onClick={searchLocation} className="idea-action"><Search size={15} /> Search</button>
                <button type="button" disabled={isLocating} onClick={useCurrentLocation} className="idea-action"><LocateFixed size={15} /> Use Current Location</button>
              </div>
              <p className="my-2 text-xs text-js-text-light"><MapPin size={13} className="mr-1 inline" />Click the map to select a location</p>
              <div className="h-52 overflow-hidden rounded-xl border border-[#d9c6a7]">
                <LocationMap latitude={latitude} longitude={longitude} onChange={updateLocation} />
              </div>
              {locationMessage && <p className="mt-2 text-xs text-js-text-light">{locationMessage}</p>}
              {latitude !== null && longitude !== null && <p className="mt-1 text-xs text-js-text-light">Selected coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}</p>}
            </section>

            <section className="border-b border-[#e3d3b8] py-4">
              <h2 className="mb-3 text-sm font-bold text-js-text">Images / Documents <span className="font-normal">(Optional)</span></h2>
              <input ref={imageInput} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" multiple className="hidden" onChange={addFiles} />
              <input ref={documentInput} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={addFiles} />
              <input ref={allInput} type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" multiple className="hidden" onChange={addFiles} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <UploadCard icon={Camera} title="Add Photo" detail="JPG, PNG" onClick={() => chooseUpload("image")} />
                <UploadCard icon={FileText} title="Add Document" detail="PDF" onClick={() => chooseUpload("document")} />
                <UploadCard icon={Plus} title="Add More" detail="More files" onClick={() => chooseUpload("all")} />
              </div>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map(({ id, file }) => (
                    <li key={id} className="flex items-center justify-between gap-3 rounded-lg border border-[#e3d3b8] bg-[#fffdf7] px-3 py-2 text-xs text-js-text">
                      <span className="truncate">{file.name}</span>
                      <button type="button" onClick={() => setFiles((current) => current.filter((item) => item.id !== id))} aria-label={`Remove ${file.name}`} className="shrink-0 text-[#9f4b33]"><X size={16} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <label className="my-4 flex items-start gap-2 text-sm text-js-text">
              <input required name="confirmation" type="checkbox" className="mt-0.5 h-4 w-4 accent-[#445b38]" />
              <span>I confirm this idea is original and for public good.</span>
            </label>
            <button type="submit" className="w-full rounded-lg bg-js-green px-5 py-3 font-semibold text-[#fff8df]">Submit Idea</button>
          </form>

          <div>
            <aside className="overflow-hidden rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
              <div className="p-4">
                <h2 className="font-display text-xl font-bold text-js-green-dark">Helpful Tips</h2>
                <div className="mt-2 h-px bg-[#e3d3b8]" />
                <h3 className="mt-4 font-display text-lg font-bold text-js-green-dark">How to write a good policy idea</h3>
                <div className="mt-2 divide-y divide-[#e3d3b8]">
                  {tips.map(({ icon: Icon, text }) => <div key={text} className="flex gap-3 py-3 text-xs leading-5 text-js-text"><Icon size={20} className="mt-0.5 shrink-0 text-js-green" /><p>{text}</p></div>)}
                </div>
              </div>
              <Image src="/images/ideas/idea-tips-community.png" alt="Community discussing ideas" width={600} height={650} className="w-full object-cover" />
            </aside>
            <MySubmissions />
          </div>
        </div>
      </div>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block border-b border-[#e3d3b8] py-3 first:pt-0"><span className="mb-2 block text-sm font-bold text-js-text">{label}</span>{children}</label>;
}

function UploadCard({ icon: Icon, title, detail, onClick }: { icon: typeof Camera; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-xl border border-dashed border-[#bba98d] bg-[#fffdf7] px-3 py-4 text-center text-js-text transition-colors hover:bg-[#fbf4e6]"><Icon size={26} className="mx-auto mb-2 text-js-green" /><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-xs text-js-text-light">{detail}</span></button>;
}
