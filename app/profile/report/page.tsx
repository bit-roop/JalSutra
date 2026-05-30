"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Hourglass,
  Info,
  Leaf,
  MapPin,
  Send,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const timeline = [
  {
    title: "Report Submitted",
    description: "Your report has been successfully submitted.",
    date: "20 May 2024",
    time: "10:30 AM",
    icon: CheckCircle2,
    state: "complete",
  },
  {
    title: "Verified by Admin",
    description: "Report verified and details are confirmed.",
    date: "20 May 2024",
    time: "11:45 AM",
    icon: ShieldCheck,
    state: "complete",
  },
  {
    title: "Forwarded to Department",
    description: "Report has been forwarded to the relevant department.",
    date: "21 May 2024",
    time: "09:20 AM",
    icon: Send,
    state: "complete",
  },
  {
    title: "Action Taken by Government",
    description: "The department is reviewing and taking action.",
    status: "In Progress",
    icon: Building2,
    state: "active",
  },
  {
    title: "Issue Resolved",
    description: "The issue will be marked as resolved once action is completed.",
    status: "Pending",
    icon: Hourglass,
    state: "pending",
  },
];

const cardClass = "rounded-xl border border-js-gold/30 bg-[#fffaf0]/90 shadow-card";

export default function ReportTrackingPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />
      <main className="min-h-screen pb-24 md:ml-[196px] md:pb-0">
        <Header />
        <div className="mx-auto grid w-full max-w-[1320px] gap-5 px-4 py-4 md:px-7 md:py-6 min-[1100px]:grid-cols-[minmax(0,1fr)_280px]">
          <section className="grid min-w-0 content-start gap-5">
            <ReportSummary />
            <TrackingTimeline />
          </section>
          <aside className="grid content-start gap-5">
            <NotificationCard enabled={notificationsEnabled} onToggle={() => setNotificationsEnabled((enabled) => !enabled)} />
            <StayInformed />
          </aside>
        </div>
      </main>
    </div>
  );
}

function ReportSummary() {
  return (
    <section className={`${cardClass} relative overflow-hidden p-4 md:p-5`}>
      <Image src="/images/reports/leaf-corner.png" alt="" width={150} height={120} className="pointer-events-none absolute right-0 top-0 w-28 opacity-80 md:w-36" />
      <div className="relative z-10 grid gap-5 sm:grid-cols-[190px_minmax(0,1fr)]">
        <Image src="/images/reports/water-pollution.jpg" alt="Polluted river water" width={220} height={180} priority className="h-44 w-full rounded-full border-2 border-js-gold/35 object-cover shadow-card sm:w-44" />
        <div className="min-w-0">
          <h1 className="pr-16 font-display text-2xl font-bold text-js-green-dark md:text-3xl">Water Pollution Report</h1>
          <div className="mt-4 grid gap-3 text-sm text-js-text sm:grid-cols-2">
            <SummaryItem icon={MapPin} label="Location" value="Kosi River, Supaul" />
            <SummaryItem icon={CalendarDays} label="Submitted On" value="20 May 2024, 10:30 AM" />
            <SummaryItem icon={FileText} label="Report ID" value="BR-2024-05-0017" />
            <div>
              <p className="font-bold text-js-green-dark">Status</p>
              <span className="mt-1 inline-flex rounded-full bg-[#f6d782] px-5 py-1 text-sm font-bold text-js-green-dark">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon size={21} className="mt-0.5 shrink-0 text-js-green" strokeWidth={1.8} />
      <div>
        <p className="font-bold text-js-green-dark">{label}</p>
        <p className="mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function TrackingTimeline() {
  return (
    <section className={`${cardClass} overflow-hidden p-4 md:p-6`}>
      <h2 className="font-display text-2xl font-bold text-js-green-dark">Tracking Timeline</h2>
      <div className="mt-5">
        {timeline.map(({ title, description, date, time, status, icon: Icon, state }, index) => {
          const complete = state === "complete";
          const active = state === "active";
          return (
            <article key={title} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
              {index < timeline.length - 1 && <span className="absolute left-[21px] top-10 h-[calc(100%-24px)] border-l-2 border-dashed border-js-green/45" />}
              <span className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border ${complete ? "border-js-green bg-js-green text-white" : active ? "border-[#1764a3] bg-[#1764a3] text-white" : "border-js-text-light/45 bg-[#eee9dc] text-js-text-light"}`}>
                <Icon size={22} strokeWidth={2} />
              </span>
              <div className="flex min-w-0 flex-col gap-2 border-b border-dashed border-js-gold/45 pb-5 last:border-b-0 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className={`font-display text-lg font-bold ${active ? "text-[#1764a3]" : "text-js-green-dark"}`}>{index + 1}. {title}</h3>
                  <p className="mt-1 text-sm text-js-text">{description}</p>
                </div>
                <div className="shrink-0 text-sm text-js-text-light md:text-right">
                  {date && <><p>{date}</p><p>{time}</p></>}
                  {active && <span className="inline-flex items-center gap-2 font-bold text-[#1764a3]"><Clock3 size={17} />{status}</span>}
                  {state === "pending" && <span>{status}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NotificationCard({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <section className={`${cardClass} relative overflow-hidden p-5`}>
      <Image src="/images/reports/notification-bell.png" alt="" width={112} height={112} className="absolute right-2 top-3 w-24 object-contain" />
      <h2 className="relative z-10 font-display text-2xl font-bold text-js-green-dark">Get Notified</h2>
      <p className="relative z-10 mt-5 max-w-[180px] text-sm leading-6 text-js-text">Stay updated on the progress of your report.</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-js-gold/55 pt-4">
        <span className="text-sm font-bold text-js-text">Enable notifications</span>
        <button type="button" role="switch" aria-checked={enabled} aria-label="Enable notifications" onClick={onToggle} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${enabled ? "bg-js-green" : "bg-js-text-light/35"}`}>
          <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </section>
  );
}

function StayInformed() {
  return (
    <section className={`${cardClass} relative overflow-hidden p-5 pb-52`}>
      <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-js-green-dark"><Info size={27} className="fill-js-green text-white" />Stay Informed</h2>
      <p className="mt-5 text-sm leading-6 text-js-text">We&apos;ll keep you updated at every step of the process. You&apos;ll receive notifications for important updates and actions taken on your report.</p>
      <p className="mt-5 flex gap-2 border-t border-dashed border-js-gold/55 pt-4 text-sm leading-5 text-js-green-dark"><Leaf size={19} className="shrink-0 fill-js-green text-js-green" />Thank you for contributing to a healthier environment.</p>
      <Image src="/images/reports/report-landscape.png" alt="" width={320} height={150} className="absolute inset-x-0 bottom-0 h-48 w-full object-cover object-bottom opacity-90" />
    </section>
  );
}
