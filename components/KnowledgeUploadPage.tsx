"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Clock,
  FileText,
  Heart,
  Lightbulb,
  Loader2,
  Mic,
  Play,
  Sprout,
  Upload,
  UserRound,
  Video,
  Volume2,
} from "lucide-react";
import clsx from "clsx";
import Sidebar from "@/components/Sidebar";
import OrnamentalCard from "@/components/OrnamentalCard";
import { languages, type KnowledgeUpload, type KnowledgeUploadType } from "@/lib/knowledge";

type FormState = {
  title: string;
  description: string;
  language: string;
  file: File | null;
};

const tabs: Array<{ id: KnowledgeUploadType; label: string; icon: React.ElementType }> = [
  { id: "voice", label: "Voice", icon: Mic },
  { id: "text", label: "Text", icon: FileText },
  { id: "photo", label: "Photo", icon: Camera },
  { id: "video", label: "Video", icon: Video },
];

const tips = [
  {
    title: "Find a quiet space",
    body: "Reduce background noise for better clarity.",
    icon: Mic,
  },
  {
    title: "Speak clearly and slowly",
    body: "Take your time while sharing your knowledge.",
    icon: Clock,
  },
  {
    title: "Share more details",
    body: "Context and examples make your knowledge more useful.",
    icon: Lightbulb,
  },
  {
    title: "Respect and authenticity",
    body: "Share what you know and give credit where it is due.",
    icon: Heart,
  },
];

const initialForm: FormState = {
  title: "",
  description: "",
  language: "Bhojpuri",
  file: null,
};

export default function KnowledgeUploadPage() {
  const [activeTab, setActiveTab] = useState<KnowledgeUploadType>("voice");
  const [form, setForm] = useState<FormState>(initialForm);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<KnowledgeUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    void fetchRecentUploads();
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const interval = window.setInterval(() => {
      setRecordingSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const needsFile = activeTab !== "text";
  const isValid = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.description.trim().length > 0 &&
      (!needsFile || form.file !== null)
    );
  }, [form.description, form.file, form.title, needsFile]);

  function resetForTab(tab: KnowledgeUploadType) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setActiveTab(tab);
    setForm({ ...initialForm, language: form.language });
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
    stopActiveRecorder();
  }

  async function fetchRecentUploads() {
    setIsLoadingRecent(true);
    try {
      const response = await fetch("/api/knowledge-uploads", { cache: "no-store" });
      const data = await response.json();
      setRecentUploads(Array.isArray(data.uploads) ? data.uploads : []);
    } catch {
      setRecentUploads([]);
    } finally {
      setIsLoadingRecent(false);
    }
  }

  async function startRecording() {
    setError(null);
    setSuccess(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      setRecordingSeconds(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `traditional-knowledge-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setForm((current) => ({ ...current, file }));
        setPreviewUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch {
      setError("Microphone access was not available. Please allow recording and try again.");
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setIsRecording(false);
  }

  function stopActiveRecorder() {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setRecorder(null);
    setIsRecording(false);
  }

  function handleFile(file: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setForm((current) => ({ ...current, file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValid) {
      setError(
        needsFile
          ? "Please add a title, description, and media file before submitting."
          : "Please add a title and description before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append("upload_type", activeTab);
      body.append("title", form.title.trim());
      body.append("description", form.description.trim());
      body.append("language", form.language);
      if (form.file) body.append("file", form.file);

      const response = await fetch("/api/knowledge-upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");

      setSuccess("Traditional knowledge saved successfully.");
      setForm({ ...initialForm, language: form.language });
      handleFile(null);
      await fetchRecentUploads();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px] min-h-screen">
        <main className="relative mx-auto max-w-[1380px] px-4 pb-24 pt-7 md:px-8 lg:px-10">
          <img
            src="/assets/knowledge/bird-left.png"
            alt=""
            className="pointer-events-none absolute left-2 top-0 hidden w-52 opacity-80 lg:block"
          />
          <img
            src="/assets/knowledge/bird-right.png"
            alt=""
            className="pointer-events-none absolute right-2 top-0 hidden w-52 opacity-80 lg:block"
          />

          <header className="relative z-10 mb-5 text-center">
            <h1 className="font-display text-4xl font-bold leading-tight text-js-green-dark md:text-5xl">
              Share Traditional Knowledge
            </h1>
            <p className="mt-2 text-lg text-js-text">Every piece of wisdom matters</p>
          </header>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <OrnamentalCard
              accent="earth"
              ornament="none"
              className="rounded-[20px]"
              innerClassName="p-4 md:p-6"
            >
              <div className="mb-4 grid grid-cols-4 overflow-hidden rounded-2xl border border-js-brown/15 bg-js-cream/70">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => resetForTab(id)}
                    className={clsx(
                      "flex items-center justify-center gap-2 border-r border-js-brown/10 px-3 py-3 text-sm font-semibold last:border-r-0 md:text-base",
                      activeTab === id
                        ? "bg-js-green text-white"
                        : "text-js-text hover:bg-js-brown/5"
                    )}
                  >
                    <Icon size={20} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-js-gold/30 bg-js-cream">
                <img
                  src="/assets/knowledge/knowledge-hero.png"
                  alt="Traditional knowledge sharing by the river"
                  className="h-[230px] w-full object-cover md:h-[340px]"
                />
              </div>

              <form onSubmit={handleSubmit} className="mt-5">
                <div className="text-center">
                  <h2 className="font-display text-2xl font-bold text-js-green-dark">
                    {activeTab === "voice" ? "Record your knowledge" : "Share your knowledge"}
                  </h2>
                  <p className="mt-1 text-sm text-js-text">
                    Share traditional practices, stories, seasonal signs or local wisdom.
                  </p>
                </div>

                <UploadMode
                  activeTab={activeTab}
                  previewUrl={previewUrl}
                  isRecording={isRecording}
                  recordingSeconds={recordingSeconds}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onFile={handleFile}
                />

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Title"
                      className="rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-3 text-sm text-js-text outline-none focus:border-js-green/50"
                    />
                    <select
                      value={form.language}
                      onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}
                      className="rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-3 text-sm text-js-text outline-none focus:border-js-green/50"
                    >
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Describe the knowledge, source, season, location, or ritual context."
                    rows={activeTab === "text" ? 5 : 3}
                    className="resize-none rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-3 text-sm leading-relaxed text-js-text outline-none focus:border-js-green/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-js-green px-5 py-4 text-lg font-semibold text-white shadow-card transition disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {isSubmitting ? "Submitting..." : "Submit Knowledge"}
                </button>

                {error && (
                  <div className="mt-4 rounded-xl border border-js-orange/25 bg-js-orange/10 px-4 py-3 text-sm text-js-text">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mt-4 rounded-xl border border-js-green/25 bg-js-green/10 px-4 py-3 text-sm text-js-green-dark">
                    {success}
                  </div>
                )}
              </form>
            </OrnamentalCard>

            <aside className="grid gap-5">
              <TipsCard />
              <RecentUploadsPanel uploads={recentUploads} isLoading={isLoadingRecent} />
              <WisdomBanner />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function UploadMode({
  activeTab,
  previewUrl,
  isRecording,
  recordingSeconds,
  onStartRecording,
  onStopRecording,
  onFile,
}: {
  activeTab: KnowledgeUploadType;
  previewUrl: string | null;
  isRecording: boolean;
  recordingSeconds: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onFile: (file: File | null) => void;
}) {
  if (activeTab === "voice") {
    return (
      <div className="mt-5 text-center">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-4 text-js-green">
          <Waveform />
          <button
            type="button"
            onClick={isRecording ? onStopRecording : onStartRecording}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[10px] border-js-green/15 bg-js-green text-white shadow-card"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic size={42} />
          </button>
          <Waveform />
        </div>
        <p className="mt-2 text-lg font-semibold text-js-text">{formatTime(recordingSeconds)}</p>
        <p className="text-sm text-js-text-light">
          {isRecording ? "Tap to stop recording" : "Tap to start recording"}
        </p>
        {previewUrl && (
          <audio controls className="mx-auto mt-4 w-full max-w-xl">
            <source src={previewUrl} type="audio/webm" />
          </audio>
        )}
      </div>
    );
  }

  if (activeTab === "photo" || activeTab === "video") {
    return (
      <div className="mt-5 rounded-2xl border border-js-brown/15 bg-js-cream/45 p-4 text-center">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-js-gold/35 bg-js-gold/10 px-4 py-2 text-sm font-semibold text-js-text">
          <Upload size={16} />
          {activeTab === "photo" ? "Choose image" : "Choose video"}
          <input
            type="file"
            accept={activeTab === "photo" ? "image/*" : "video/*"}
            className="hidden"
            onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {previewUrl && (
          <div className="mt-4 overflow-hidden rounded-xl border border-js-brown/15 bg-js-cream">
            {activeTab === "photo" ? (
              <img src={previewUrl} alt="" className="h-64 w-full object-cover" />
            ) : (
              <video src={previewUrl} controls className="h-64 w-full bg-black object-contain" />
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function Waveform() {
  return (
    <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
      {[10, 16, 22, 30, 18, 12, 28, 36, 20, 14, 24, 18].map((height, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-js-green/70"
          style={{ height }}
        />
      ))}
    </div>
  );
}

function TipsCard() {
  return (
    <OrnamentalCard accent="leaf" ornament="corners" className="rounded-[20px]" innerClassName="p-5">
      <div className="mb-5 flex items-center gap-2">
        <Sprout size={22} className="text-js-green" />
        <h2 className="font-display text-xl font-bold text-js-green-dark">Tips for recording</h2>
      </div>
      <div className="divide-y divide-js-brown/10">
        {tips.map(({ title, body, icon: Icon }) => (
          <div key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-js-green/10">
              <Icon size={23} className="text-js-green-dark" strokeWidth={1.7} />
            </div>
            <div>
              <p className="font-semibold text-js-text">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-js-text-light">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </OrnamentalCard>
  );
}

function RecentUploadsPanel({
  uploads,
  isLoading,
}: {
  uploads: KnowledgeUpload[];
  isLoading: boolean;
}) {
  return (
    <OrnamentalCard accent="earth" ornament="quiet" className="rounded-[20px]" innerClassName="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-js-green-dark">Recent uploads</h2>
        <button className="text-sm text-js-green-dark">View all</button>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-js-text-light">
          <Loader2 size={15} className="animate-spin" />
          Loading uploads...
        </div>
      ) : uploads.length === 0 ? (
        <p className="text-sm leading-relaxed text-js-text-light">
          No uploads yet. Your latest contributions will appear here.
        </p>
      ) : (
        <div className="divide-y divide-js-brown/10">
          {uploads.map((upload) => (
            <a
              key={upload.id}
              href={upload.file_url ?? "#"}
              target={upload.file_url ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <UploadThumb upload={upload} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-js-text">{upload.title}</p>
                <p className="text-xs text-js-text-light">
                  {upload.language} · {relativeDate(upload.created_at)}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-js-brown/15 text-js-green-dark">
                <Play size={15} fill="currentColor" />
              </span>
            </a>
          ))}
        </div>
      )}
    </OrnamentalCard>
  );
}

function WisdomBanner() {
  return (
    <div className="rounded-2xl border border-js-brown/10 bg-js-cream/65 p-5 text-center shadow-card">
      <p className="text-sm leading-relaxed text-js-text">
        Your wisdom, our heritage.
        <br />
        Together we preserve our traditions.
      </p>
    </div>
  );
}

function UploadThumb({ upload }: { upload: KnowledgeUpload }) {
  if (upload.thumbnail_url) {
    return <img src={upload.thumbnail_url} alt="" className="h-14 w-14 rounded-lg object-cover" />;
  }
  const Icon = upload.type === "voice" ? Mic : upload.type === "text" ? FileText : UserRound;
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-js-green/10">
      <Icon size={22} className="text-js-green-dark" />
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function relativeDate(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const days = Math.max(0, Math.floor(diffMs / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}
