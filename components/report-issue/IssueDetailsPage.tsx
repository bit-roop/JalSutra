"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, LocateFixed, MapPin, MoreHorizontal, Search } from "lucide-react";
import { useIssueDetails } from "./IssueDetailsContext";

const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false });
const issueTypes = [
  ["water-pollution", "Water Pollution", "/images/reports/issue-water-pollution-icon.jpg"],
  ["air-pollution", "Air Pollution", "/images/reports/issue-pipe-discharge-icon.jpg"],
  ["waste-dumping", "Waste Dumping", "/images/reports/issue-recent-waste-dumping.png"],
  ["illegal-fishing", "Illegal Fishing", "/images/reports/issue-illegal-fishing-icon.jpg"],
  ["forest-damage", "Forest Damage", "/images/reports/issue-forest-damage-icon.jpg"],
];
const alerts = [
  ["High Water Pollution Alert", "Kosi River, Bihar", "Today", "/images/reports/issue-water-pollution-icon.jpg"],
  ["Illegal Industrial Discharge", "Patna, Bihar", "Yesterday", "/images/reports/issue-pipe-discharge-icon.jpg"],
  ["Illegal Fishing Activity", "Darbhanga, Bihar", "2 days ago", "/images/reports/issue-illegal-fishing-icon.jpg"],
];
const reports = [
  ["Water Pollution", "", "Under Review", "/images/reports/issue-recent-water-pollution.png"],
  ["Waste Dumping", "", "Resolved", "/images/reports/issue-recent-waste-dumping.png"],
  ["Forest Damage", "", "In Progress", "/images/reports/issue-recent-forest-damage.png"],
];
const card = "rounded-xl border border-js-gold/25 bg-[#fffaf0]/90 shadow-card";

export default function IssueDetailsPage() {
  const router = useRouter();
  const { issue, updateIssue } = useIssueDetails();
  const [query, setQuery] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function updateLocation(latitude: number, longitude: number, name?: string) {
    updateIssue({ latitude, longitude, locationName: name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` });
  }
  async function searchLocation() {
    if (!query.trim()) return;
    try {
      const response = await fetch(`/api/location-search?q=${encodeURIComponent(query.trim())}`);
      const results = await response.json() as Array<{ lat: string; lon: string; display_name: string }>;
      if (!results[0]) throw new Error();
      updateLocation(Number(results[0].lat), Number(results[0].lon), results[0].display_name);
      setLocationMessage(results[0].display_name);
    } catch {
      setLocationMessage("Location not found");
    }
  }
  function useCurrentLocation() {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      updateLocation(coords.latitude, coords.longitude, "Current location");
      setLocationMessage("Current location selected");
    }, () => setLocationMessage("Unable to access current location"));
  }
  function next() {
    const missing = [
      !issue.issueType && "Select an issue type",
      !issue.description.trim() && "Describe the issue",
      (issue.latitude === null || issue.longitude === null) && "Select a location",
      !issue.dateTime && "Select a date and time",
    ].filter(Boolean) as string[];
    setErrors(missing);
    if (!missing.length) router.push("/report-issue/evidence");
  }

  return (
    <main className="px-4 py-5 pb-24 md:px-5 md:pb-5">
      <div className="mx-auto grid max-w-[1320px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${card} p-4 md:p-6`}>
          <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-js-green text-white"><AlertTriangle /></span><div><h1 className="font-display text-3xl font-bold text-js-green-dark">Report an Issue</h1><p className="mt-1 text-sm text-js-text-light">Help us identify environmental and community issues that require attention.</p></div></div>
          <div className="mt-7 grid grid-cols-2 text-center text-sm font-bold"><div className="border-b-2 border-js-green pb-3 text-js-green"><span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-js-green text-white">1</span>Issue Details</div><div className="border-b border-js-text-light/30 pb-3 text-js-text-light"><span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-js-text-light/30">2</span>Evidence & Submit</div></div>
          <h2 className="mt-7 text-sm font-bold text-js-text">Select Issue Type *</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {issueTypes.map(([value, label, image]) => <button type="button" key={value} onClick={() => updateIssue({ issueType: value })} className={`rounded-xl border bg-[#fffdf7] p-2 text-xs font-bold ${issue.issueType === value ? "border-2 border-js-green" : "border-js-gold/25"}`}><Image src={image} alt="" width={76} height={76} className="mx-auto h-16 w-16 rounded-md object-cover" /><span className="mt-2 block">{label}</span></button>)}
            <button type="button" onClick={() => updateIssue({ issueType: "other" })} className={`rounded-xl border bg-[#fffdf7] p-2 text-xs font-bold ${issue.issueType === "other" ? "border-2 border-js-green" : "border-js-gold/25"}`}><MoreHorizontal size={54} className="mx-auto text-js-text-light" /><span className="mt-2 block">Other</span></button>
          </div>
          <label className="mt-6 block text-sm font-bold text-js-text">Describe the Issue *</label>
          <textarea value={issue.description} maxLength={1000} onChange={(event) => updateIssue({ description: event.target.value })} rows={5} placeholder="Provide a clear description of the issue." className="mt-2 w-full resize-none rounded-lg border border-[#d9c6a7] bg-[#fffdf7] p-3 text-sm outline-none" /><p className="text-right text-xs text-js-text-light">{issue.description.length}/1000</p>
          <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_280px]">
            <div><p className="text-sm font-bold text-js-text">Location *</p><div className="mt-2 flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Location" className="min-w-0 flex-1 rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 text-sm outline-none" /><button type="button" onClick={searchLocation} className="rounded-lg border border-[#d9c6a7] px-3 text-js-green"><Search size={17} /></button><button type="button" onClick={useCurrentLocation} className="flex items-center gap-1 rounded-lg bg-js-green px-3 py-2 text-xs font-bold text-white"><LocateFixed size={15} />Current</button></div><div className="mt-2 h-48 overflow-hidden rounded-lg border border-[#d9c6a7]"><LocationMap latitude={issue.latitude} longitude={issue.longitude} onChange={updateLocation} /></div>{locationMessage && <p className="mt-2 text-xs text-js-text-light"><MapPin size={13} className="mr-1 inline" />{locationMessage}</p>}</div>
            <div><label className="text-sm font-bold text-js-text">Date & Time *</label><input type="datetime-local" value={issue.dateTime} onChange={(event) => updateIssue({ dateTime: event.target.value })} className="mt-2 w-full rounded-lg border border-[#d9c6a7] bg-[#fffdf7] px-3 py-2 text-sm outline-none" /></div>
          </div>
          {errors.length > 0 && <p className="mt-4 text-sm text-[#a84730]">{errors.join(". ")}.</p>}
          <div className="mt-5 flex justify-end"><button type="button" onClick={next} className="rounded-lg bg-js-green px-10 py-3 font-bold text-[#fff8df]">Next</button></div>
        </section>
        <aside className="grid content-start gap-4"><SideCard title="Alerts" rows={alerts} /><SideCard title="Recent Reports" rows={reports} /></aside>
      </div>
    </main>
  );
}

function SideCard({ title, rows }: { title: string; rows: string[][] }) { return <section className={`${card} p-4`}><h2 className="font-display text-xl font-bold text-js-green-dark">{title}</h2><div className="mt-2">{rows.map(([name, detail, meta, image]) => <article key={name} className="flex gap-3 border-b border-js-gold/15 py-3 last:border-0"><Image src={image} alt="" width={48} height={48} className="h-12 w-12 rounded-md object-cover" /><div><p className="text-xs font-bold text-js-text">{name}</p><p className="mt-1 text-xs text-js-text-light">{detail}</p><p className="mt-1 text-xs text-js-green">{meta}</p></div></article>)}</div></section>; }
