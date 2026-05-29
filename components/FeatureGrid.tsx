"use client";

import { useRouter } from "next/navigation";
import OrnamentalCard from "@/components/OrnamentalCard";

type FeatureCard = {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  accent: string;
};

const features: FeatureCard[] = [
  {
    id: "share",
    label: "Share",
    sublabel: "Knowledge",
    accent: "#3d6b1e",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Three people */}
        <circle cx="24" cy="16" r="6" fill="#3d6b1e" opacity="0.85" />
        <path d="M14 36 Q14 28 24 28 Q34 28 34 36" fill="#3d6b1e" opacity="0.7" />
        <circle cx="12" cy="19" r="4.5" fill="#4a7d25" opacity="0.7" />
        <path d="M4 36 Q4 30 12 30 Q17 30 19 33" fill="#4a7d25" opacity="0.5" />
        <circle cx="36" cy="19" r="4.5" fill="#4a7d25" opacity="0.7" />
        <path d="M29 33 Q31 30 36 30 Q44 30 44 36" fill="#4a7d25" opacity="0.5" />
        {/* Speech bubbles */}
        <rect x="20" y="4" width="12" height="8" rx="3" fill="rgba(200,149,42,0.7)" />
        <path d="M24 12 L22 15 L26 12" fill="rgba(200,149,42,0.7)" />
        {/* Dots in bubble */}
        <circle cx="24" cy="8" r="1" fill="white" />
        <circle cx="27" cy="8" r="1" fill="white" />
        <circle cx="30" cy="8" r="1" fill="white" />
      </svg>
    ),
  },
  {
    id: "missions",
    label: "Living Traditions",
    sublabel: "Missions",
    accent: "#c8952a",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Temple/pavilion */}
        <rect x="12" y="28" width="24" height="18" rx="1" fill="#c8952a" opacity="0.8" />
        {/* Temple shikhara */}
        <path d="M16 28 L24 8 L32 28Z" fill="#d4622a" opacity="0.9" />
        <circle cx="24" cy="6" r="3" fill="#e8b84b" />
        {/* Steps */}
        <rect x="16" y="42" width="16" height="4" fill="#e8b84b" opacity="0.6" />
        {/* Door */}
        <path d="M21 46 Q21 38 24 38 Q27 38 27 46Z" fill="rgba(139,94,60,0.5)" />
        {/* Windows */}
        <rect x="14" y="32" width="6" height="6" rx="2" fill="rgba(255,200,50,0.4)" stroke="#e8b84b" strokeWidth="0.5" />
        <rect x="28" y="32" width="6" height="6" rx="2" fill="rgba(255,200,50,0.4)" stroke="#e8b84b" strokeWidth="0.5" />
        {/* Flag */}
        <line x1="24" y1="3" x2="24" y2="9" stroke="#c8952a" strokeWidth="1" />
        {/* Stars */}
        <text x="4" y="20" fontSize="8" fill="#e8b84b">✦</text>
        <text x="38" y="18" fontSize="7" fill="#e8b84b">✦</text>
      </svg>
    ),
  },
  {
    id: "biodiversity",
    label: "Report",
    sublabel: "Biodiversity",
    accent: "#4a90b8",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Kingfisher bird */}
        {/* Body */}
        <ellipse cx="26" cy="26" rx="12" ry="8" fill="#1a7abf" />
        {/* Wing */}
        <path d="M16 24 Q20 18 30 22 Q25 28 16 24Z" fill="#1565a0" />
        {/* Chest */}
        <ellipse cx="32" cy="28" rx="6" ry="5" fill="#e8784a" />
        {/* Head */}
        <circle cx="36" cy="20" r="7" fill="#1a7abf" />
        {/* Crest */}
        <path d="M32 14 Q34 10 36 13 Q38 10 40 14" stroke="#1565a0" strokeWidth="1.5" fill="none" />
        {/* Beak */}
        <path d="M42 19 L50 20 L42 22Z" fill="#555" />
        {/* Eye */}
        <circle cx="38" cy="19" r="2.5" fill="white" />
        <circle cx="38.5" cy="19" r="1.2" fill="#1a1a1a" />
        {/* Tail */}
        <path d="M14 26 L6 22 L8 28 L6 33 L16 28" fill="#1a7abf" />
        {/* Perch/branch */}
        <line x1="4" y1="36" x2="44" y2="36" stroke="#8b5e3c" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves on branch */}
        <ellipse cx="10" cy="33" rx="4" ry="2.5" fill="#4a7d25" transform="rotate(-20 10 33)" />
        <ellipse cx="40" cy="34" rx="4" ry="2.5" fill="#4a7d25" transform="rotate(15 40 34)" />
      </svg>
    ),
  },
  {
    id: "map",
    label: "Map &",
    sublabel: "Explore",
    accent: "#d4622a",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Map background */}
        <rect x="6" y="8" width="36" height="30" rx="4" fill="#e8d5b0" stroke="#c8952a" strokeWidth="1.5" />
        {/* Map features - river */}
        <path d="M10 22 Q16 18 20 22 Q24 26 30 20 Q36 14 40 18" stroke="#4a90b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Tree dots */}
        <circle cx="12" cy="14" r="3" fill="#4a7d25" />
        <circle cx="20" cy="12" r="2.5" fill="#3d6b1e" />
        <circle cx="36" cy="28" r="3" fill="#4a7d25" />
        {/* Location pin */}
        <path
          d="M26 8 C26 8, 20 16, 20 20 C20 23.3 22.7 26 26 26 C29.3 26 32 23.3 32 20 C32 16 26 8 26 8Z"
          fill="#d4622a"
          stroke="#b84a1a"
          strokeWidth="1"
        />
        <circle cx="26" cy="20" r="3" fill="white" />
        {/* Map grid lines faint */}
        <line x1="6" y1="24" x2="42" y2="24" stroke="rgba(139,94,60,0.15)" strokeWidth="1" strokeDasharray="2,3" />
        <line x1="24" y1="8" x2="24" y2="38" stroke="rgba(139,94,60,0.15)" strokeWidth="1" strokeDasharray="2,3" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Alerts &",
    sublabel: "Updates",
    accent: "#c8952a",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Bell */}
        <path
          d="M24 4 C24 4, 14 10 14 24 L14 34 L10 38 L38 38 L34 34 L34 24 C34 10 24 4 24 4Z"
          fill="#c8952a"
          stroke="#a07818"
          strokeWidth="1.2"
        />
        {/* Bell clapper */}
        <path d="M20 38 Q24 44 28 38" fill="#a07818" stroke="#a07818" strokeWidth="0.5" />
        {/* Bell shine */}
        <path d="M18 14 Q20 10 24 9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Notification rings */}
        <path d="M8 20 Q4 18 5 14" stroke="#e8b84b" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M40 20 Q44 18 43 14" stroke="#e8b84b" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* Alert dot */}
        <circle cx="36" cy="8" r="5" fill="#d4622a" />
        <text x="33" y="11.5" fontSize="7" fill="white" fontWeight="bold">!</text>
      </svg>
    ),
  },
  {
    id: "report",
    label: "Report",
    sublabel: "Issue",
    accent: "#d4622a",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Clipboard */}
        <rect x="10" y="10" width="28" height="34" rx="3" fill="#f5edd8" stroke="#c8952a" strokeWidth="1.5" />
        {/* Clipboard top clip */}
        <rect x="18" y="6" width="12" height="8" rx="3" fill="#c8952a" />
        <rect x="20" y="8" width="8" height="4" rx="1.5" fill="#f5edd8" />
        {/* Lines on clipboard */}
        <line x1="15" y1="24" x2="33" y2="24" stroke="#c8952a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="30" x2="30" y2="30" stroke="rgba(200,149,42,0.5)" strokeWidth="1" strokeLinecap="round" />
        <line x1="15" y1="36" x2="28" y2="36" stroke="rgba(200,149,42,0.5)" strokeWidth="1" strokeLinecap="round" />
        {/* Pencil */}
        <rect x="28" y="28" width="6" height="16" rx="1" fill="#e8b84b" transform="rotate(-40 28 28)" />
        <path d="M22 42 L24 36 L27 39Z" fill="#d4622a" />
        <rect x="24" y="28" width="6" height="3" fill="#555" transform="rotate(-40 24 28)" />
      </svg>
    ),
  },
  {
    id: "calendar",
    label: "Eco",
    sublabel: "Calendar",
    accent: "#3d6b1e",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Calendar base */}
        <rect x="6" y="12" width="36" height="30" rx="4" fill="#f5edd8" stroke="#3d6b1e" strokeWidth="1.5" />
        {/* Calendar header */}
        <rect x="6" y="12" width="36" height="10" rx="4" fill="#3d6b1e" />
        <rect x="6" y="17" width="36" height="5" fill="#3d6b1e" />
        {/* Hook rings */}
        <rect x="14" y="7" width="4" height="10" rx="2" fill="#4a7d25" />
        <rect x="30" y="7" width="4" height="10" rx="2" fill="#4a7d25" />
        {/* Month text area */}
        <rect x="14" y="14" width="20" height="5" rx="1" fill="rgba(255,255,255,0.2)" />
        {/* Calendar grid */}
        {[0, 1, 2, 3, 4, 5, 6].map((col) =>
          [0, 1, 2, 3].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={8 + col * 5}
              y={26 + row * 4.5}
              width="3.5"
              height="3.5"
              rx="0.5"
              fill={col === 2 && row === 1 ? "#3d6b1e" : "rgba(61,107,30,0.15)"}
            />
          ))
        )}
        {/* Leaf decoration */}
        <ellipse cx="36" cy="38" rx="4" ry="6" fill="#4a7d25" opacity="0.6" transform="rotate(20 36 38)" />
        <ellipse cx="40" cy="36" rx="3" ry="5" fill="#3d6b1e" opacity="0.5" transform="rotate(-15 40 36)" />
      </svg>
    ),
  },
  {
    id: "suggestions",
    label: "Suggestions &",
    sublabel: "Policies",
    accent: "#4a90b8",
    icon: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        {/* Document */}
        <rect x="10" y="6" width="28" height="36" rx="3" fill="#f5edd8" stroke="#4a90b8" strokeWidth="1.5" />
        {/* Document fold corner */}
        <path d="M30 6 L38 14 L30 14 Z" fill="#c8d8e8" stroke="#4a90b8" strokeWidth="1" />
        {/* Lines */}
        <line x1="14" y1="20" x2="34" y2="20" stroke="#4a90b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="26" x2="30" y2="26" stroke="rgba(74,144,184,0.5)" strokeWidth="1" strokeLinecap="round" />
        <line x1="14" y1="31" x2="28" y2="31" stroke="rgba(74,144,184,0.5)" strokeWidth="1" strokeLinecap="round" />
        {/* Check mark */}
        <circle cx="34" cy="34" r="6" fill="#3d6b1e" />
        <path d="M31 34 L33 36.5 L37 31" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const featureLinks: Record<string, string> = {
  share: "/share-traditional-knowledge",
  missions: "/living-traditions-missions",
  biodiversity: "/report-biodiversity",
  map: "/map",
  alerts: "/living-traditions-missions#alerts",
  report: "/report-issue",
  calendar: "/eco-calendar",
  suggestions: "/suggestions-policies",
};

export default function FeatureGrid() {
  const router = useRouter();

  return (
    <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4">
      {features.map((feat) => (
        <OrnamentalCard
          as="button"
          key={feat.id}
          onClick={() => {
            router.push(featureLinks[feat.id]);
          }}
          className="feature-card h-[104px] text-center cursor-pointer"
          innerClassName="flex h-full flex-col items-center justify-center gap-1.5 px-4 py-3"
          accent={featureAccent(feat.accent)}
          ornament={feat.id === "share" || feat.id === "map" || feat.id === "calendar" ? "corners" : "quiet"}
        >
          {/* Icon container */}
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, rgba(250,246,236,0.96), rgba(${hexToRgb(feat.accent)}, 0.10))`,
              border: `1px solid rgba(${hexToRgb(feat.accent)}, 0.15)`,
              boxShadow: "0 3px 10px rgba(122,86,63,0.08)",
            }}
          >
            <span
              className="absolute inset-1 rounded-full border border-dashed"
              style={{ borderColor: `rgba(${hexToRgb(feat.accent)}, 0.20)` }}
            />
            <div className="w-9 h-9">{feat.icon}</div>
          </div>

          {/* Label */}
          <div className="leading-tight">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text)", fontFamily: "Lora, serif" }}
            >
              {feat.label}
            </p>
            {feat.sublabel && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)", fontFamily: "Lora, serif" }}
              >
                {feat.sublabel}
              </p>
            )}
          </div>

          {/* Dot separator */}
          <div className="flex items-center gap-1">
            <span className="block h-px w-5" style={{ background: `linear-gradient(90deg, transparent, rgba(${hexToRgb(feat.accent)}, 0.34))` }} />
            <span className="block w-1 h-1 rounded-full" style={{ background: feat.accent, opacity: 0.4 }} />
            <span className="block w-1.5 h-1.5 rounded-full" style={{ background: feat.accent, opacity: 0.6 }} />
            <span className="block w-1 h-1 rounded-full" style={{ background: feat.accent, opacity: 0.4 }} />
            <span className="block h-px w-5" style={{ background: `linear-gradient(90deg, rgba(${hexToRgb(feat.accent)}, 0.34), transparent)` }} />
          </div>
        </OrnamentalCard>
      ))}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0,0,0";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function featureAccent(hex: string): "earth" | "river" | "leaf" | "sun" {
  if (hex === "#4a90b8") return "river";
  if (hex === "#3d6b1e") return "leaf";
  if (hex === "#c8952a") return "sun";
  return "earth";
}
