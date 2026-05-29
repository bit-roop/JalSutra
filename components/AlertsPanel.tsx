"use client";

import { ChevronRight } from "lucide-react";
import OrnamentalCard from "@/components/OrnamentalCard";

type Observation = {
  id: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
  iconBg: string;
};

const observations: Observation[] = [
  {
    id: "1",
    title: "River Health",
    detail: "Good (82/100)",
    iconBg: "#d8f0d0",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path
          d="M12 2 C12 2, 5 10, 5 15 C5 18.9 8.1 22 12 22 C15.9 22 19 18.9 19 15 C19 10 12 2 12 2Z"
          fill="#3d6b1e"
          stroke="#2d5016"
          strokeWidth="1"
        />
        <path d="M8 15 Q12 18 16 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "2",
    title: "Bird Sightings",
    detail: "24 Today",
    iconBg: "#dbeeff",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M6 15 Q10 7 16 9 Q20 10 20 15 Q16 14 13 17 Q10 20 6 15Z" fill="#4a90b8" />
        <path d="M7 15 L3 18 L8 18" fill="#2d6b8a" />
        <path d="M12 17 L10 22" stroke="#2d6b8a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 17 L15 22" stroke="#2d6b8a" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="17" cy="11" r="1" fill="#1a3a5c" />
      </svg>
    ),
  },
  {
    id: "3",
    title: "Community Actions",
    detail: "18 This Week",
    iconBg: "#fff0d8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <circle cx="12" cy="8" r="4" fill="#a67508" />
        <circle cx="6" cy="10" r="3" fill="#c8952a" opacity="0.78" />
        <circle cx="18" cy="10" r="3" fill="#c8952a" opacity="0.78" />
        <path d="M5 21 Q5 15 12 15 Q19 15 19 21" fill="#a67508" />
        <path d="M1 21 Q2 16 7 16" stroke="#c8952a" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 21 Q22 16 17 16" stroke="#c8952a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AlertsPanel() {
  return (
    <OrnamentalCard className="shrink-0" innerClassName="overflow-hidden" accent="leaf" ornament="corners">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(200,149,42,0.15)" }}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
            <path
              d="M10 2 C10 2, 5 6, 5 11 C5 14 7.2 16 10 16 C12.8 16 15 14 15 11 C15 6 10 2 10 2Z"
              fill="#3d6b1e"
              stroke="#2d5016"
              strokeWidth="0.8"
            />
            <path d="M8 16 Q10 18.5 12 16" fill="#2d5016" />
          </svg>
          <h3
            className="font-semibold text-[17px]"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--text)" }}
          >
            Observations
          </h3>
        </div>
        <button
          className="text-xs font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--green)", fontFamily: "Lora, serif" }}
        >
          View all
        </button>
      </div>

      {/* Alert items */}
      <div className="divide-y" style={{ borderColor: "rgba(200,149,42,0.08)" }}>
        {observations.map((observation) => (
          <div
            key={observation.id}
            className="alert-item flex items-center gap-3 px-4 py-2.5 cursor-pointer"
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: observation.iconBg, border: "1px solid rgba(168,125,54,0.18)", boxShadow: "inset 0 0 0 3px rgba(250,246,236,0.55)" }}
            >
              {observation.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium leading-snug"
                style={{ color: "var(--text)", fontFamily: "Lora, serif" }}
              >
                {observation.title}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-light)", fontFamily: "Lora, serif" }}
              >
                {observation.detail}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight size={14} style={{ color: "var(--text-light)", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </OrnamentalCard>
  );
}
