"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, Upload, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useIssueDetails } from "@/components/report-issue/IssueDetailsContext";

const placeholderEvidence = [
  "/images/reports/issue-water-pollution-icon.jpg",
  "/images/reports/issue-waste-dumping-icon.jpg",
  "/images/reports/issue-pipe-discharge-icon.jpg",
];
const card = "rounded-xl border border-js-gold/25 bg-[#fffaf0]/90 shadow-card";

export default function EvidenceSubmitPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { issue, updateIssue, clearIssue } = useIssueDetails();
  const [message, setMessage] = useState("");

  function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const valid = files.filter((file) => ["image/jpeg", "image/png", "video/mp4"].includes(file.type) && file.size <= 20 * 1024 * 1024);
    if (valid.length !== files.length) setMessage("Only JPG, PNG, and MP4 files up to 20MB are allowed.");
    updateIssue({ evidenceFiles: [...issue.evidenceFiles, ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) }))] });
    event.target.value = "";
  }
  function submit() {
    const missing = [
      !issue.issueType && "Issue Type",
      !issue.description.trim() && "Description",
      (issue.latitude === null || issue.longitude === null) && "Location",
      !issue.dateTime && "Date",
    ].filter(Boolean);
    if (missing.length) {
      setMessage(`Please complete: ${missing.join(", ")}.`);
      return;
    }
    console.log("JalSutra report payload", { ...issue, submittedAt: new Date().toISOString() });
    setMessage("Report submitted successfully.");
    clearIssue();
    setTimeout(() => router.push("/profile/report"), 700);
  }

  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px]">
        <Header />
        <main className="px-4 py-5 pb-24 md:px-5 md:pb-5">
          <section className={`${card} mx-auto max-w-[1080px] p-4 md:p-6`}>
            <h1 className="font-display text-3xl font-bold text-js-green-dark">Add Evidence</h1>
            <p className="mt-1 text-sm text-js-text-light">Upload supporting evidence for the reported issue.</p>
            <Steps />
            <h2 className="mt-7 text-lg font-bold text-js-text">Upload Photos / Videos</h2>
            <p className="mt-1 text-sm text-js-text-light">Add clear photos or videos of the issue.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(issue.evidenceFiles.length ? issue.evidenceFiles : placeholderEvidence.map((preview) => ({ preview, file: null }))).map(({ preview, file }, index) => (
                <div key={`${preview}-${index}`} className="relative h-40 overflow-hidden rounded-xl border border-js-gold/25 bg-[#fffdf7]">
                  {file?.type === "video/mp4" ? <video src={preview} controls className="h-full w-full object-cover" /> : <Image src={preview} alt="" fill unoptimized className="object-cover" />}
                  {file && <button type="button" aria-label={`Remove ${file.name}`} onClick={() => updateIssue({ evidenceFiles: issue.evidenceFiles.filter((_, fileIndex) => fileIndex !== index) })} className="absolute right-2 top-2 rounded-full bg-white p-1 text-[#9f4b33] shadow"><X size={16} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => inputRef.current?.click()} className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-js-gold/55 bg-[#fffdf7] text-sm font-bold text-js-green"><Upload size={27} /><span className="mt-2">Add More</span><span className="mt-1 text-xs font-normal text-js-text-light">JPG, PNG, MP4</span><span className="text-xs font-normal text-js-text-light">Up to 20MB</span></button>
              <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.mp4" className="hidden" onChange={uploadFiles} />
            </div>
            <label className="mt-6 block text-sm font-bold text-js-text">Additional Information <span className="font-normal">(Optional)</span></label>
            <textarea value={issue.additionalInformation} onChange={(event) => updateIssue({ additionalInformation: event.target.value })} maxLength={1000} rows={4} placeholder="Any other information that can help authorities take action." className="mt-2 w-full resize-none rounded-lg border border-[#d9c6a7] bg-[#fffdf7] p-3 text-sm outline-none" />
            <p className="text-right text-xs text-js-text-light">{issue.additionalInformation.length}/1000</p>
            <div className="mt-4 flex items-center justify-between border-y border-js-gold/20 py-4"><div><p className="font-bold text-js-text">Share as Anonymous</p><p className="mt-1 text-xs text-js-text-light">Your identity will be hidden.</p></div><Toggle enabled={issue.anonymous} onClick={() => updateIssue({ anonymous: !issue.anonymous })} /></div>
            <Review />
            <div className="mt-5 rounded-lg border border-js-gold/25 bg-[#eef0d9] p-3 text-sm leading-6 text-js-green-dark"><Info size={18} className="mr-2 inline" />Your report will be reviewed by community moderators and relevant authorities before appearing publicly.</div>
            {message && <p role="status" className={`mt-4 rounded-lg px-4 py-3 text-sm font-bold ${message === "Report submitted successfully." ? "bg-js-green text-white" : "bg-[#f6ecd3] text-[#9f4b33]"}`}>{message}</p>}
            <div className="mt-5 flex gap-3"><button type="button" onClick={() => router.push("/report-issue")} className="flex-1 rounded-lg border border-js-green px-5 py-3 font-bold text-js-green">Back</button><button type="button" onClick={submit} className="flex-1 rounded-lg bg-js-green px-5 py-3 font-bold text-[#fff8df]">Submit Report</button></div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Steps() { return <div className="mt-7 grid grid-cols-2 text-center text-sm font-bold"><div className="border-b-2 border-js-green pb-3 text-js-green"><span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-js-green text-white">✓</span>Issue Details</div><div className="border-b-2 border-js-green pb-3 text-js-green"><span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-js-green text-white">2</span>Evidence & Submit</div></div>; }
function Toggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) { return <button type="button" role="switch" aria-checked={enabled} aria-label="Share as Anonymous" onClick={onClick} className={`relative h-7 w-12 rounded-full ${enabled ? "bg-js-green" : "bg-js-text-light/35"}`}><span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ""}`} /></button>; }
function Review() { const { issue } = useIssueDetails(); const [date, time] = issue.dateTime.split("T"); const rows = [["Issue Type", issue.issueType], ["Description", issue.description], ["Location", issue.locationName], ["Coordinates", issue.latitude !== null && issue.longitude !== null ? `${issue.latitude.toFixed(5)}, ${issue.longitude.toFixed(5)}` : ""], ["Date", date], ["Time", time], ["Anonymous Status", issue.anonymous ? "Yes" : "No"], ["Uploaded Files Count", String(issue.evidenceFiles.length)]]; return <section className="mt-6"><h2 className="font-display text-2xl font-bold text-js-green-dark">Review Your Report</h2><dl className="mt-3 grid gap-3 rounded-lg border border-js-gold/25 bg-[#fffdf7] p-4 text-sm sm:grid-cols-2">{rows.map(([label, value]) => <div key={label}><dt className="font-bold text-js-green-dark">{label}</dt><dd className="mt-1 text-js-text-light">{value || "Not provided"}</dd></div>)}</dl></section>; }
