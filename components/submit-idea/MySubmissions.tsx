"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatSubmissionDate,
  IdeaSubmission,
  readIdeaSubmissions,
  statusClasses,
} from "./ideaStorage";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>([]);

  useEffect(() => {
    const refresh = async () => setSubmissions(await readIdeaSubmissions(5));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("jalsutra-ideas-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("jalsutra-ideas-updated", refresh);
    };
  }, []);

  return (
    <section className="mt-5 rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 p-4 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-js-green-dark">My Submissions</h2>
        <Link href="/my-submissions" className="shrink-0 text-xs font-semibold text-js-green hover:underline">
          View All →
        </Link>
      </div>
      <div className="mt-2 h-px bg-[#e3d3b8]" />
      {submissions.length === 0 ? (
        <p className="py-4 text-xs text-js-text-light">No ideas submitted yet.</p>
      ) : (
        <ul className="divide-y divide-[#e3d3b8]">
          {submissions.map((submission) => (
            <li key={submission.id} className="py-3">
              <p className="line-clamp-2 text-sm font-bold text-js-text">{submission.title}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-js-text-light">{formatSubmissionDate(submission.createdAt)}</span>
                <StatusBadge status={submission.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function StatusBadge({ status }: { status: IdeaSubmission["status"] }) {
  return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClasses(status)}`}>{status}</span>;
}
