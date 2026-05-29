"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CloudUpload,
  Droplet,
  Leaf,
  Medal,
  Sprout,
  Star,
  TreePine,
  Trophy,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import OrnamentalCard from "@/components/OrnamentalCard";
import { missions } from "@/lib/missions";
import type { CreateImpactSubmissionResponse } from "@/lib/impact-submissions";

type MissionDetailPageProps = {
  params: {
    id: string;
  };
};

const howToItems = [
  "Use an earthen pot (matka) with a small opening (3–4 cm diameter).",
  "Make two small holes on opposite sides near the top and pass a wire or rope.",
  "Hang it 10–12 feet high in a quiet place.",
  "Ensure it is shaded and away from predators.",
  "Do not disturb the nest once occupied.",
];

const impactCards = [
  {
    title: "Supports Bird Life",
    body: "Provides safe nesting spaces for sparrows.",
    icon: Leaf,
  },
  {
    title: "Promotes Growth",
    body: "Encourages ecological balance.",
    icon: Sprout,
  },
  {
    title: "Preserves Tradition",
    body: "Revives our earthy heritage.",
    icon: Trophy,
  },
];

const alerts = [
  {
    title: "Tree Plantation Drive",
    body: "Join the mega plantation drive this Sunday in your area.",
    meta: "18 May, 2025",
    icon: TreePine,
    bg: "#8aaa4d",
  },
  {
    title: "Water Conservation Tip",
    body: "Fix leaks, save water. Small actions make a big impact.",
    meta: "Save Water, Save Life",
    icon: Droplet,
    bg: "#5d8fc5",
  },
  {
    title: "Community Clean-up",
    body: "Let's keep our surroundings clean and green.",
    meta: "25 May, 2025",
    icon: Users,
    bg: "#d6862a",
  },
];

const achievements = [
  {
    title: "Bird Guardian",
    body: "Build 1 earthen nest",
    meta: "Earned on 12 May, 2025",
    icon: Medal,
    done: true,
  },
  {
    title: "Green Starter",
    body: "Participate in your first mission",
    meta: "Earned on 05 May, 2025",
    icon: Sprout,
    done: true,
  },
  {
    title: "Community Helper",
    body: "Invite 5 friends to join",
    meta: "3 / 5",
    icon: Users,
    done: false,
  },
];

export default function MissionDetailPage({ params }: MissionDetailPageProps) {
  const mission = missions.find((item) => item.id === params.id);
  const [joined, setJoined] = useState(false);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [impactImage, setImpactImage] = useState<File | null>(null);
  const [impactPreview, setImpactPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const participants = (mission?.participants ?? 0) + (joined ? 1 : 0);
  const goal = 2000;
  const remaining = goal - participants;
  const progress = Math.min((participants / goal) * 100, 100);

  const impactPreviewUrl = useMemo(() => impactPreview, [impactPreview]);

  if (!mission || mission.id !== "sparrow") {
    notFound();
  }

  function handleImpactImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (impactPreview) {
      URL.revokeObjectURL(impactPreview);
    }

    setImpactImage(file);
    setImpactPreview(URL.createObjectURL(file));
    setSubmitStatus("idle");
    setSubmitMessage("");
  }

  async function handleImpactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!impactImage) {
      setSubmitStatus("error");
      setSubmitMessage("Please select an image.");
      return;
    }

    setSubmitStatus("submitting");
    setSubmitMessage("");

    const formData = new FormData();
    formData.append("mission_id", "sparrow");
    formData.append("caption", caption);
    formData.append("description", description);
    formData.append("file", impactImage);

    try {
      const response = await fetch("/api/impact-submissions", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as Partial<CreateImpactSubmissionResponse> & { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to submit your impact.");
      }

      setSubmitStatus("success");
      setSubmitMessage("Impact shared successfully.");
      setCaption("");
      setDescription("");
      setImpactImage(null);
      if (impactPreview) {
        URL.revokeObjectURL(impactPreview);
      }
      setImpactPreview(null);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Failed to submit your impact.");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />

      <div className="md:ml-[196px] min-h-screen pb-24 md:pb-5">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 py-4 md:px-5 min-[1180px]:grid min-[1180px]:grid-cols-[minmax(0,1fr)_304px]">
          <main className="min-w-0">
            <Link href="/living-traditions-missions" className="mb-4 hidden items-center gap-2 text-[17px] font-bold text-js-green-dark md:inline-flex">
              <ArrowLeft size={22} />
              Back to Missions
            </Link>

            <div className="mb-3 flex items-center justify-between md:hidden">
              <Link href="/living-traditions-missions" className="flex h-8 w-8 items-center justify-center text-js-text" aria-label="Back to Missions">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-sm font-bold text-js-text">Mission Details</h1>
              <a href="#share-impact" className="flex h-8 w-8 items-center justify-center text-js-text" aria-label="Share your impact">
                <UploadCloud size={19} />
              </a>
            </div>

            <OrnamentalCard className="overflow-visible" innerClassName="p-0 md:p-6" accent="sun" ornament="none">
              <section className="relative overflow-hidden rounded-t-xl md:rounded-xl">
                <Image
                  src="/images/missions/details/sparrow-detail.jpg"
                  alt="Sparrow beside an earthen nest"
                  width={1050}
                  height={350}
                  priority
                  unoptimized
                  className="h-[212px] w-full object-cover md:h-[290px]"
                />
                <div className="pointer-events-none absolute left-0 top-0 hidden h-28 w-28 rounded-br-full border-b border-r border-[#fff7df]/60 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.30),transparent_68%)] md:block" />
                <div className="pointer-events-none absolute right-0 top-0 hidden h-28 w-28 rounded-bl-full border-b border-l border-[#fff7df]/60 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.30),transparent_68%)] md:block" />
              </section>

              <section className="px-4 pb-4 pt-3 md:px-4 md:pb-5 md:pt-0">
                <div className="flex flex-col md:-mt-8 md:grid md:grid-cols-[112px_minmax(0,1fr)] md:items-end md:gap-4">
                  <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-js-gold/35 bg-[#f8eed2] shadow-card md:flex">
                    <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full border border-js-gold/35 bg-[#fff8e9] text-js-green-dark">
                      <Trophy size={48} strokeWidth={1.4} />
                    </div>
                  </div>
                  <div>
                    <span className="mb-2 inline-flex rounded-md bg-[#dcebc5] px-2 py-1 text-xs font-bold text-js-green md:hidden">
                      Birds
                    </span>
                    <h1 className="font-display text-[23px] font-bold leading-tight text-js-green-dark md:text-[32px]">
                      Earthen Nest for Sparrow
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#e3efc6] px-3 py-1 text-sm font-semibold text-js-green-dark">Protect Birds</span>
                      <span className="rounded-full bg-[#e3efc6] px-3 py-1 text-sm font-semibold text-js-green-dark">Preserve Nature</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 max-w-3xl text-[15px] leading-6 text-js-text md:text-[16px]">
                  Sparrows are disappearing from our cities and villages. Let's bring them back by creating safe, natural homes.
                  Build an earthen nest and provide shelter for these little friends.
                </p>

                <div className="mt-4 grid gap-0 overflow-hidden rounded-xl border border-js-gold/35 bg-[#fffaf0]/62 md:grid-cols-2">
                  <section className="p-4 md:border-r md:border-js-gold/25">
                    <h2 className="mb-3 flex items-center gap-2 font-display text-[18px] font-bold text-js-green-dark">
                      <Leaf size={20} />
                      How to do it?
                    </h2>
                    <div className="space-y-2">
                      {howToItems.map((item) => (
                        <div key={item} className="flex gap-2 border-b border-dashed border-js-gold/25 pb-2 last:border-0 last:pb-0">
                          <CheckCircle2 size={17} className="mt-0.5 shrink-0 fill-js-green text-[#fff8df]" />
                          <p className="text-[13px] leading-5 text-js-text md:text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 font-display text-[18px] font-bold text-js-green-dark">
                      <Leaf size={20} />
                      Mission Impact
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      {impactCards.map(({ title, body, icon: Icon }) => (
                        <div key={title} className="text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-js-gold/20 bg-[#e8efcc] text-js-green-dark">
                            <Icon size={34} strokeWidth={1.6} />
                          </div>
                          <h3 className="mt-2 font-display text-[15px] font-bold leading-tight text-js-green-dark md:text-[17px]">{title}</h3>
                          <p className="mt-1 text-[11px] leading-4 text-js-text md:text-xs">{body}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="mt-3 rounded-xl border border-js-gold/35 bg-[#fffaf0]/62 p-4">
                  <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_150px] md:items-center">
                    <div className="flex items-center gap-3">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-js-green text-[#fff8df]">
                        <Users size={30} fill="currentColor" strokeWidth={0} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-js-text">Participants</p>
                        <p className="text-2xl font-bold leading-none text-js-green-dark">{participants.toLocaleString()}</p>
                        <p className="text-xs text-js-text-light">people joined this mission</p>
                      </div>
                    </div>
                    <div>
                      <div className="h-3 overflow-hidden rounded-full bg-js-cream-dark">
                        <div className="h-full rounded-full bg-js-green" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-2 text-center text-sm text-js-text">
                        You're just {remaining.toLocaleString()} steps away from the next milestone!
                      </p>
                    </div>
                    <p className="text-right text-xl font-semibold text-js-text md:text-left">
                      {participants.toLocaleString()} <span className="font-normal">/ {goal.toLocaleString()}</span>
                    </p>
                  </div>
                </section>

                <button
                  type="button"
                  onClick={() => setJoined(true)}
                  disabled={joined}
                  className="mx-auto mt-4 flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-js-green text-lg font-bold text-[#fff8df] shadow-card transition hover:brightness-105 disabled:cursor-default disabled:bg-js-green-light"
                >
                  {joined ? (
                    <>
                      Joined <Check size={22} />
                    </>
                  ) : (
                    <>
                      <Leaf size={22} />
                      Join Mission
                    </>
                  )}
                </button>

                <section id="share-impact" className="mt-4 rounded-xl border border-dashed border-js-green/55 bg-[#f8f2de]/72 p-4">
                  <div className="grid gap-4 md:grid-cols-[72px_minmax(0,1fr)_180px] md:items-center">
                    <span className="hidden h-16 w-16 items-center justify-center rounded-xl bg-js-green text-[#fff8df] md:flex">
                      <CloudUpload size={38} />
                    </span>
                    <div>
                      <h2 className="font-display text-[18px] font-bold text-js-green-dark">Share Your Impact</h2>
                      <p className="mt-1 text-sm leading-5 text-js-text">
                        Upload a photo of your earthen nest and inspire others. Let's build a community of change!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImpactModalOpen(true);
                        setSubmitStatus("idle");
                        setSubmitMessage("");
                      }}
                      className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-js-green bg-[#fffaf0] px-4 font-bold text-js-green-dark"
                    >
                      <CloudUpload size={22} />
                      Upload Now
                    </button>
                  </div>
                </section>
              </section>
            </OrnamentalCard>
          </main>

          <aside className="hidden min-w-0 flex-col gap-3 min-[1180px]:flex">
            <OrnamentalCard accent="leaf" ornament="quiet" innerClassName="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={28} className="text-js-green" />
                  <h2 className="font-display text-[22px] font-bold text-js-green-dark">Alerts</h2>
                </div>
                <a href="#detail-alerts" className="text-sm font-medium text-js-green">View all</a>
              </div>
              <div id="detail-alerts" className="space-y-3">
                {alerts.map(({ title, body, meta, icon: Icon, bg }) => (
                  <div key={title} className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/62 p-4">
                    <div className="flex gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[#fff8df]" style={{ background: bg }}>
                        <Icon size={30} />
                      </span>
                      <div>
                        <h3 className="font-bold text-js-green-dark">{title}</h3>
                        <p className="mt-1 text-sm leading-5 text-js-text">{body}</p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-js-text">
                          <CalendarDays size={14} />
                          {meta}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </OrnamentalCard>

            <OrnamentalCard accent="sun" ornament="quiet" innerClassName="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star size={29} className="text-js-green" />
                  <h2 className="font-display text-[22px] font-bold text-js-green-dark">Achievements</h2>
                </div>
                <a href="#detail-achievements" className="text-sm font-medium text-js-green">View all</a>
              </div>
              <div id="detail-achievements" className="space-y-3">
                {achievements.map(({ title, body, meta, icon: Icon, done }) => (
                  <div key={title} className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/62 p-3">
                    <div className="flex items-center gap-3">
                      <span className={done ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-js-green text-[#fff8df]" : "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-js-orange text-[#fff8df]"}>
                        <Icon size={31} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-js-green-dark">{title}</h3>
                        <p className="text-sm text-js-text">{body}</p>
                        <p className="mt-1 text-sm text-js-text-light">{meta}</p>
                        {!done ? (
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-js-cream-dark">
                            <div className="h-full w-3/5 rounded-full bg-js-green" />
                          </div>
                        ) : null}
                      </div>
                      {done ? <CheckCircle2 size={24} className="fill-js-green text-[#fff8df]" /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </OrnamentalCard>

            <div className="relative h-[100px] overflow-hidden rounded-lg border border-js-gold/25 shadow-card">
              <Image src="/images/missions/quote-illustration.jpg" alt="Decorative JalSutra quote illustration" fill sizes="304px" className="object-cover" />
            </div>
          </aside>
        </div>
      </div>

      {impactModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1e160d]/45 px-4 py-6">
          <OrnamentalCard className="max-h-[92vh] w-full max-w-xl overflow-y-auto" accent="leaf" ornament="corners">
            <form onSubmit={handleImpactSubmit} className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-js-green">Sparrow Mission</p>
                  <h2 className="font-display text-2xl font-bold text-js-green-dark">Share Your Impact</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setImpactModalOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-js-gold/30 bg-[#fffaf0] text-js-text"
                  aria-label="Close upload modal"
                >
                  <X size={19} />
                </button>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-js-green-dark">Image</span>
                <span className="mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-js-green/55 bg-[#fffaf0]/70 p-4 text-center text-js-text-light">
                  {impactPreviewUrl ? (
                    <img src={impactPreviewUrl} alt="Selected impact preview" className="max-h-64 w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <CloudUpload size={38} className="mb-2 text-js-green" />
                      Select an image of your earthen nest
                    </>
                  )}
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleImpactImageSelect} />
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-js-green-dark">Caption</span>
                <input
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-js-gold/35 bg-[#fffaf0] px-3 py-2 text-js-text outline-none focus:border-js-green"
                  placeholder="My earthen nest is ready"
                  required
                />
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-js-green-dark">Description</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 min-h-28 w-full resize-none rounded-lg border border-js-gold/35 bg-[#fffaf0] px-3 py-2 text-js-text outline-none focus:border-js-green"
                  placeholder="Tell the community what you made and where you placed it."
                  required
                />
              </label>

              {submitMessage ? (
                <p className={submitStatus === "error" ? "mt-3 text-sm font-semibold text-js-orange" : "mt-3 text-sm font-semibold text-js-green"}>
                  {submitMessage}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setImpactModalOpen(false)}
                  className="h-11 rounded-lg border border-js-gold/35 bg-[#fffaf0] px-5 font-bold text-js-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className="h-11 rounded-lg bg-js-green px-5 font-bold text-[#fff8df] disabled:cursor-wait disabled:bg-js-green-light"
                >
                  {submitStatus === "submitting" ? "Uploading..." : "Submit Impact"}
                </button>
              </div>
            </form>
          </OrnamentalCard>
        </div>
      ) : null}
    </div>
  );
}
