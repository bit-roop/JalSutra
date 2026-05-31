"use client";

import { useEffect, useState } from "react";
import { formatSubmissionDate, IdeaSubmission, readIdeaSubmissions } from "./ideaStorage";
import { StatusBadge } from "./MySubmissions";

export default function AllSubmissions() {
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>([]);

  useEffect(() => {
    readIdeaSubmissions().then(setSubmissions);
  }, []);

  return (
    <main className="px-4 py-5 pb-24 md:px-5 md:pb-6">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="font-display text-3xl font-bold text-js-green-dark md:text-4xl">My Submissions</h1>
        <p className="mt-1 text-sm text-js-text-light">Ideas and policy recommendations you have shared with JalSutra.</p>
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dbc9aa] bg-[#fffaf0]/90 shadow-[0_5px_16px_rgba(91,63,35,0.10)]">
          {submissions.length === 0 ? (
            <p className="p-5 text-sm text-js-text-light">No ideas submitted yet.</p>
          ) : (
            <ul className="divide-y divide-[#e3d3b8]">
              {submissions.map((submission) => (
                <li key={submission.id} className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-js-green-dark">{submission.title}</h2>
                      <p className="mt-2 text-xs text-js-text-light">{formatSubmissionDate(submission.createdAt)}</p>
                      <p className="mt-1 text-sm text-js-text">{submission.location || "Location not specified"}</p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
