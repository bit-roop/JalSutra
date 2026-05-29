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
  RotateCcw,
  Sprout,
  Trash2,
  Upload,
  UserRound,
  Video,
  X,
} from "lucide-react";
import clsx from "clsx";
import Sidebar from "@/components/Sidebar";
import OrnamentalCard from "@/components/OrnamentalCard";
import { languages, type KnowledgeUpload, type KnowledgeUploadType } from "@/lib/knowledge";

type FormState = {
  title: string;
  description: string;
  language: string;
  files: File[];
  durationSeconds: number[];
};

type FormByType = Record<KnowledgeUploadType, FormState>;
type PreviewByType = Record<KnowledgeUploadType, string[]>;

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
  files: [],
  durationSeconds: [],
};

const initialForms: FormByType = {
  voice: { ...initialForm },
  text: { ...initialForm },
  photo: { ...initialForm },
  video: { ...initialForm },
};

const initialPreviews: PreviewByType = {
  voice: [],
  text: [],
  photo: [],
  video: [],
};

const maxMediaItems = 3;
const audioMimeType = "audio/webm;codecs=opus";
const videoMimeType = "video/webm;codecs=vp8,opus";

export default function KnowledgeUploadPage() {
  const [activeTab, setActiveTab] = useState<KnowledgeUploadType>("voice");
  const [forms, setForms] = useState<FormByType>(initialForms);
  const [previewUrls, setPreviewUrls] = useState<PreviewByType>(initialPreviews);
  const [recentUploads, setRecentUploads] = useState<KnowledgeUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTab, setRecordingTab] = useState<KnowledgeUploadType | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingSecondsRef = useRef(0);
  const previewUrlsRef = useRef<PreviewByType>(initialPreviews);
  const activeForm = forms[activeTab];
  const activePreviewUrl = previewUrls[activeTab];

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
    recordingSecondsRef.current = recordingSeconds;
  }, [recordingSeconds]);

  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((urls) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const needsFile = activeTab !== "text";
  const isValid = useMemo(() => {
    return (
      activeForm.title.trim().length > 0 &&
      activeForm.description.trim().length > 0 &&
      (!needsFile || activeForm.files.length > 0)
    );
  }, [activeForm.description, activeForm.files.length, activeForm.title, needsFile]);

  function resetForTab(tab: KnowledgeUploadType) {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    stopActiveRecorder();
  }

  function updateActiveForm(update: Partial<FormState>) {
    setForms((current) => ({
      ...current,
      [activeTab]: { ...current[activeTab], ...update },
    }));
  }

  function resetActiveForm() {
    const language = activeForm.language;
    clearPreview(activeTab);
    setForms((current) => ({
      ...current,
      [activeTab]: { ...initialForm, language },
    }));
    setRecordingSeconds(0);
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

  async function startVoiceRecording() {
    setError(null);
    setSuccess(null);

    try {
      if (forms.voice.files.length >= maxMediaItems) {
        setError("You can add up to 3 voice recordings.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(
        stream,
        MediaRecorder.isTypeSupported(audioMimeType) ? { mimeType: audioMimeType } : undefined
      );
      chunksRef.current = [];
      setRecordingSeconds(0);
      streamRef.current = stream;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const durationSeconds = recordingSecondsRef.current;
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        const file = new File([blob], `traditional-knowledge-${Date.now()}.webm`, {
          type: blob.type,
        });
        addRecordedMedia("voice", file, durationSeconds);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecorder(null);
        setRecordingTab(null);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecordingTab("voice");
      setIsRecording(true);
    } catch {
      setError("Microphone access was not available. Please allow recording and try again.");
    }
  }

  async function startVideoRecording() {
    setError(null);
    setSuccess(null);

    try {
      if (forms.video.files.length >= maxMediaItems) {
        setError("You can add up to 3 video uploads.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(
        stream,
        MediaRecorder.isTypeSupported(videoMimeType) ? { mimeType: videoMimeType } : undefined
      );
      chunksRef.current = [];
      setRecordingSeconds(0);
      streamRef.current = stream;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "video/webm" });
        const file = new File([blob], `traditional-knowledge-video-${Date.now()}.webm`, {
          type: blob.type,
        });
        addRecordedMedia("video", file, recordingSecondsRef.current);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecorder(null);
        setRecordingTab(null);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecordingTab("video");
      setIsRecording(true);
    } catch {
      setError("Camera access was not available. Please allow video recording and try again.");
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setIsRecording(false);
  }

  function stopActiveRecorder() {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setRecorder(null);
    setRecordingTab(null);
    setIsRecording(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function clearPreview(tab: KnowledgeUploadType) {
    setPreviewUrls((current) => {
      current[tab].forEach((url) => URL.revokeObjectURL(url));
      return { ...current, [tab]: [] };
    });
  }

  function handleFiles(tab: KnowledgeUploadType, files: File[]) {
    if (files.length === 0) return;
    const availableSlots = maxMediaItems - forms[tab].files.length;
    if (availableSlots <= 0) {
      setError(`You can add up to ${maxMediaItems} ${tab} uploads.`);
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);
    setForms((current) => ({
      ...current,
      [tab]: {
        ...current[tab],
        files: [...current[tab].files, ...selectedFiles],
        durationSeconds: [...current[tab].durationSeconds, ...selectedFiles.map(() => 0)],
      },
    }));
    setPreviewUrls((current) => ({
      ...current,
      [tab]: [...current[tab], ...selectedFiles.map((file) => URL.createObjectURL(file))],
    }));
    setError(null);
    setSuccess(null);
  }

  function addRecordedMedia(tab: KnowledgeUploadType, file: File, durationSeconds: number) {
    const url = URL.createObjectURL(file);
    setForms((current) => ({
      ...current,
      [tab]: {
        ...current[tab],
        files: [...current[tab].files, file].slice(0, maxMediaItems),
        durationSeconds: [...current[tab].durationSeconds, durationSeconds].slice(0, maxMediaItems),
      },
    }));
    setPreviewUrls((current) => ({
      ...current,
      [tab]: [...current[tab], url].slice(0, maxMediaItems),
    }));
  }

  function removeMedia(tab: KnowledgeUploadType, index: number) {
    setPreviewUrls((current) => {
      const url = current[tab][index];
      if (url) URL.revokeObjectURL(url);
      return {
        ...current,
        [tab]: current[tab].filter((_, itemIndex) => itemIndex !== index),
      };
    });
    setForms((current) => ({
      ...current,
      [tab]: {
        ...current[tab],
        files: current[tab].files.filter((_, itemIndex) => itemIndex !== index),
        durationSeconds: current[tab].durationSeconds.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function clearMedia(tab: KnowledgeUploadType) {
    clearPreview(tab);
    setForms((current) => ({
      ...current,
      [tab]: { ...current[tab], files: [], durationSeconds: [] },
    }));
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
      const filesToUpload = activeTab === "text" ? [null] : activeForm.files;

      for (const file of filesToUpload) {
        const body = new FormData();
        body.append("upload_type", activeTab);
        body.append("title", activeForm.title.trim());
        body.append("description", activeForm.description.trim());
        body.append("language", activeForm.language);
        if (file) body.append("file", file);

        const response = await fetch("/api/knowledge-upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Upload failed");
      }

      setSuccess(
        filesToUpload.length > 1
          ? `${filesToUpload.length} traditional knowledge uploads saved successfully.`
          : "Traditional knowledge saved successfully."
      );
      resetActiveForm();
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
                  previewUrls={activePreviewUrl}
                  isRecording={isRecording && recordingTab === activeTab}
                  recordingSeconds={
                    isRecording && recordingTab === activeTab
                      ? recordingSeconds
                      : activeForm.durationSeconds[activeForm.durationSeconds.length - 1] ?? 0
                  }
                  durationSeconds={activeForm.durationSeconds}
                  onStartVoiceRecording={startVoiceRecording}
                  onStartVideoRecording={startVideoRecording}
                  onStopRecording={stopRecording}
                  onFiles={handleFiles}
                  onRemoveMedia={removeMedia}
                  onClearMedia={clearMedia}
                />

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={activeForm.title}
                      onChange={(event) => updateActiveForm({ title: event.target.value })}
                      placeholder="Title"
                      className="rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-3 text-sm text-js-text outline-none focus:border-js-green/50"
                    />
                    <select
                      value={activeForm.language}
                      onChange={(event) => updateActiveForm({ language: event.target.value })}
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
                    value={activeForm.description}
                    onChange={(event) => updateActiveForm({ description: event.target.value })}
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
  previewUrls,
  isRecording,
  recordingSeconds,
  durationSeconds,
  onStartVoiceRecording,
  onStartVideoRecording,
  onStopRecording,
  onFiles,
  onRemoveMedia,
  onClearMedia,
}: {
  activeTab: KnowledgeUploadType;
  previewUrls: string[];
  isRecording: boolean;
  recordingSeconds: number;
  durationSeconds: number[];
  onStartVoiceRecording: () => void;
  onStartVideoRecording: () => void;
  onStopRecording: () => void;
  onFiles: (tab: KnowledgeUploadType, files: File[]) => void;
  onRemoveMedia: (tab: KnowledgeUploadType, index: number) => void;
  onClearMedia: (tab: KnowledgeUploadType) => void;
}) {
  const canAddMore = previewUrls.length < maxMediaItems;

  if (activeTab === "voice") {
    return (
      <div className="mt-5 text-center">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-4 text-js-green">
          <Waveform />
          <button
            type="button"
            onClick={isRecording ? onStopRecording : onStartVoiceRecording}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[10px] border-js-green/15 bg-js-green text-white shadow-card"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic size={42} />
          </button>
          <Waveform />
        </div>
        <p className="mt-2 text-lg font-semibold text-js-text">{formatTime(recordingSeconds)}</p>
        <p className="text-sm text-js-text-light">
          {isRecording
            ? "Tap to stop recording"
            : previewUrls.length > 0
              ? `${previewUrls.length} of ${maxMediaItems} recordings ready`
              : "Tap to start recording"}
        </p>
        {previewUrls.length > 0 && (
          <div className="mx-auto mt-4 grid max-w-xl gap-3">
            {previewUrls.map((previewUrl, index) => (
              <div
                key={previewUrl}
                className="rounded-xl border border-js-brown/15 bg-js-cream/70 p-3 text-left"
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-js-text">
                  <span>Recording {index + 1} · {formatTime(durationSeconds[index] ?? 0)}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveMedia("voice", index)}
                    className="inline-flex items-center gap-1 rounded-lg border border-js-brown/20 px-3 py-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
                <audio src={previewUrl} controls className="w-full" preload="metadata" />
              </div>
            ))}
          </div>
        )}
        {previewUrls.length > 0 && canAddMore && (
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onStartVoiceRecording}
              className="inline-flex items-center gap-2 rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-2 text-sm font-semibold text-js-text"
            >
              <RotateCcw size={16} />
              Add another recording
            </button>
            <AudioUploadButton onFiles={onFiles} />
          </div>
        )}
        {previewUrls.length === 0 && canAddMore && (
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <AudioUploadButton onFiles={onFiles} />
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "photo" || activeTab === "video") {
    return (
      <div className="mt-5 rounded-2xl border border-js-brown/15 bg-js-cream/45 p-4 text-center">
        {canAddMore && (
          <div className="flex flex-wrap justify-center gap-3">
            {activeTab === "photo" ? (
              <>
                <MediaPickerButton
                  tab="photo"
                  label="Click photo"
                  icon={Camera}
                  accept="image/*"
                  capture="environment"
                  onFiles={onFiles}
                />
                <MediaPickerButton
                  tab="photo"
                  label="Choose images"
                  icon={Upload}
                  accept="image/*"
                  onFiles={onFiles}
                />
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={isRecording ? onStopRecording : onStartVideoRecording}
                  className="inline-flex items-center gap-2 rounded-xl border border-js-gold/35 bg-js-gold/10 px-4 py-2 text-sm font-semibold text-js-text"
                >
                  <Video size={16} />
                  {isRecording ? "Stop video" : "Record video"}
                </button>
                <MediaPickerButton
                  tab="video"
                  label="Choose videos"
                  icon={Upload}
                  accept="video/*"
                  onFiles={onFiles}
                />
              </>
            )}
          </div>
        )}
        <p className="mt-2 text-xs text-js-text-light">
          {isRecording ? `Recording ${formatTime(recordingSeconds)}` : `${previewUrls.length} of ${maxMediaItems} selected`}
        </p>
        {previewUrls.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {previewUrls.map((previewUrl, index) => (
              <div key={previewUrl} className="overflow-hidden rounded-xl border border-js-brown/15 bg-js-cream">
                {activeTab === "photo" ? (
                  <img src={previewUrl} alt="" className="h-44 w-full object-cover" />
                ) : (
                  <video src={previewUrl} controls className="h-44 w-full bg-black object-contain" />
                )}
                <div className="flex justify-center border-t border-js-brown/10 bg-js-cream/75 p-2">
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(activeTab, index)}
                    className="inline-flex items-center gap-2 rounded-xl border border-js-brown/20 bg-js-cream/70 px-3 py-2 text-sm font-semibold text-js-text"
                  >
                    <X size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {previewUrls.length > 0 && canAddMore && (
          <div className="mt-3">
            <MediaPickerButton
              tab={activeTab}
              label="Add more"
              icon={Upload}
              accept={activeTab === "photo" ? "image/*" : "video/*"}
              onFiles={onFiles}
            />
          </div>
        )}
        {previewUrls.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onClearMedia(activeTab)}
              className="inline-flex items-center gap-2 rounded-xl border border-js-brown/20 bg-js-cream/70 px-4 py-2 text-sm font-semibold text-js-text"
            >
              <X size={16} />
              Remove all
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function AudioUploadButton({
  onFiles,
}: {
  onFiles: (tab: KnowledgeUploadType, files: File[]) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-js-gold/35 bg-js-gold/10 px-4 py-2 text-sm font-semibold text-js-text">
      <Upload size={16} />
      Upload audio
      <input
        type="file"
        multiple
        accept="audio/*"
        className="hidden"
        onChange={(event) => {
          onFiles("voice", Array.from(event.target.files ?? []));
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}

function MediaPickerButton({
  tab,
  label,
  icon: Icon,
  accept,
  capture,
  onFiles,
}: {
  tab: KnowledgeUploadType;
  label: string;
  icon: React.ElementType;
  accept: string;
  capture?: "environment" | "user";
  onFiles: (tab: KnowledgeUploadType, files: File[]) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-js-gold/35 bg-js-gold/10 px-4 py-2 text-sm font-semibold text-js-text">
      <Icon size={16} />
      {label}
      <input
        type="file"
        multiple={!capture}
        accept={accept}
        capture={capture}
        className="hidden"
        onChange={(event) => {
          onFiles(tab, Array.from(event.target.files ?? []));
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
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
  if (upload.type === "photo" && (upload.thumbnail_url || upload.file_url)) {
    return (
      <img
        src={upload.thumbnail_url ?? upload.file_url ?? ""}
        alt=""
        className="h-14 w-14 rounded-lg object-cover"
      />
    );
  }

  if (upload.type === "video" && upload.thumbnail_url) {
    return <img src={upload.thumbnail_url} alt="" className="h-14 w-14 rounded-lg object-cover" />;
  }

  if (upload.type === "video" && upload.file_url) {
    return (
      <video
        src={upload.file_url}
        muted
        playsInline
        preload="metadata"
        className="h-14 w-14 rounded-lg bg-black object-cover"
      />
    );
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
