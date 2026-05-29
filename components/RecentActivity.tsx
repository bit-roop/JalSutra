"use client";

import OrnamentalCard from "@/components/OrnamentalCard";

type Activity = {
  id: string;
  text: string;
  time: string;
  avatar: React.ReactNode;
};

const activities: Activity[] = [
  {
    id: "1",
    text: "You reported an issue near Kankarbagh Ghat",
    time: "Today, 10:20 AM",
    avatar: (
      <svg viewBox="0 0 36 36" className="w-full h-full rounded-full" fill="none">
        <rect width="36" height="36" rx="18" fill="#dbeeff" />
        <path
          d="M18 4 Q12 14 12 20 C12 24.4 14.7 28 18 28 C21.3 28 24 24.4 24 20 C24 14 18 4 18 4Z"
          fill="#4a90b8"
          opacity="0.7"
        />
        <path d="M14 20 Q18 18 22 20 Q20 24 18 24 Q16 24 14 20Z" fill="#2d6b8a" opacity="0.5" />
        {/* Location pin */}
        <circle cx="26" cy="28" r="4" fill="#d4622a" />
        <circle cx="26" cy="28" r="2" fill="white" />
      </svg>
    ),
  },
  {
    id: "2",
    text: "Meera shared a biodiversity sighting (Indian Skimmer)",
    time: "Yesterday, 5:40 PM",
    avatar: (
      <svg viewBox="0 0 36 36" className="w-full h-full rounded-full" fill="none">
        <rect width="36" height="36" rx="18" fill="#d8eef8" />
        {/* Dolphin */}
        <path
          d="M10 20 Q14 14 20 17 Q24 19 26 20 Q24 23 20 23 Q14 24 10 20Z"
          fill="#4a90b8"
          opacity="0.8"
        />
        <path d="M10 20 Q6 18 7 22 Q7 24 10 22" fill="#2d6b8a" opacity="0.6" />
        <path d="M18 15 Q20 12 22 15" fill="#4a90b8" opacity="0.5" />
        <circle cx="23" cy="18" r="1.5" fill="#1a3a5c" />
      </svg>
    ),
  },
  {
    id: "3",
    text: "Rohit joined the community",
    time: "Yesterday, 3:15 PM",
    avatar: (
      <svg viewBox="0 0 36 36" className="w-full h-full rounded-full" fill="none">
        <rect width="36" height="36" rx="18" fill="#d8f0d0" />
        {/* Person joining */}
        <circle cx="18" cy="14" r="5" fill="#3d6b1e" opacity="0.8" />
        <path d="M10 30 Q10 22 18 22 Q26 22 26 30" fill="#4a7d25" opacity="0.7" />
        {/* Plus sign */}
        <circle cx="28" cy="10" r="5" fill="#c8952a" />
        <line x1="28" y1="7" x2="28" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="25" y1="10" x2="31" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "4",
    text: "You completed a mission 'Save Our Rivers'",
    time: "May 18, 2025",
    avatar: (
      <svg viewBox="0 0 36 36" className="w-full h-full rounded-full" fill="none">
        <rect width="36" height="36" rx="18" fill="#fff0d8" />
        {/* Temple / mission icon */}
        <rect x="10" y="18" width="16" height="12" rx="1" fill="#c8952a" opacity="0.7" />
        <path d="M12 18 L18 8 L24 18Z" fill="#d4622a" opacity="0.8" />
        <circle cx="18" cy="6" r="2.5" fill="#e8b84b" />
        {/* Checkmark */}
        <circle cx="26" cy="26" r="5" fill="#3d6b1e" />
        <path d="M23.5 26 L25.5 28 L28.5 23.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function RecentActivity() {
  return (
    <OrnamentalCard className="min-h-0 flex-1" innerClassName="flex h-full min-h-0 flex-col overflow-hidden" accent="earth" ornament="quiet">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(200,149,42,0.15)" }}
      >
        <h3
            className="font-semibold text-[17px]"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--text)" }}
        >
          Recent Activity
        </h3>
        <button
          className="text-xs font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--green)", fontFamily: "Lora, serif" }}
        >
          View all
        </button>
      </div>

      {/* Activity items */}
      <div className="min-h-0 flex-1 divide-y overflow-hidden" style={{ borderColor: "rgba(200,149,42,0.08)" }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-item flex items-start gap-3 px-4 py-2.5 cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
              style={{ border: "1px solid rgba(168,125,54,0.22)", boxShadow: "inset 0 0 0 3px rgba(250,246,236,0.52)" }}>
              {activity.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] leading-snug"
                style={{ color: "var(--text)", fontFamily: "Lora, serif" }}
              >
                {activity.text}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-light)", fontFamily: "Lora, serif" }}
              >
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom folk art decoration */}
      <div
        className="mt-auto px-4 py-2 flex items-center justify-center gap-1"
        style={{ borderTop: "1px solid rgba(200,149,42,0.1)" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === 3 || i === 4 ? "6px" : "4px",
              height: i === 3 || i === 4 ? "6px" : "4px",
              background: i % 3 === 0 ? "var(--gold)" : i % 3 === 1 ? "var(--green)" : "var(--orange)",
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </OrnamentalCard>
  );
}
