"use client";

import { useState } from "react";
import { MapPin, Bell, ChevronDown } from "lucide-react";

const locations = [
  "Patna, Bihar",
  "Varanasi, UP",
  "Haridwar, Uttarakhand",
  "Prayagraj, UP",
  "Kolkata, WB",
];

export default function Header() {
  const [location, setLocation] = useState("Patna, Bihar");
  const [showDropdown, setShowDropdown] = useState(false);
  const notifCount = 3;

  return (
    <header
      className="sticky top-0 z-20 flex h-[92px] shrink-0 items-center justify-between px-4 md:px-6 py-3"
      style={{
        background: "rgba(245, 237, 216, 0.95)",
        borderBottom: "1px solid rgba(200,149,42,0.2)",
        boxShadow: "0 1px 8px rgba(139,94,60,0.08)",
      }}
    >
      {/* Brand (mobile only – desktop shows in sidebar) */}
      <div className="md:hidden flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, #f5edd8 60%, #ede0c4 100%)",
            border: "1.5px solid rgba(200,149,42,0.5)",
          }}
        >
          <svg width="22" height="26" viewBox="0 0 36 40" fill="none">
            <path
              d="M18 2 C18 2, 4 18, 4 26 C4 34 10.3 38 18 38 C25.7 38 32 34 32 26 C32 18 18 2 18 2Z"
              fill="#4a90b8"
            />
            <ellipse cx="17" cy="22" rx="5" ry="3" fill="#d4622a" />
            <path d="M22 22 L26 19 L26 25 Z" fill="#d4622a" />
          </svg>
        </div>
        <div>
          <h1
            className="text-green-900 font-bold leading-none"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "18px" }}
          >
            JalSutra
          </h1>
          <p className="text-xs italic" style={{ color: "var(--gold)", fontSize: "9px" }}>
            Ancient Wisdom. Living Rivers.
          </p>
        </div>
      </div>

      {/* Title (desktop) */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2">
          <h2
            className="text-[30px] font-bold leading-none"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--text)" }}
          >
            JalSutra
          </h2>
        </div>
        <p className="mt-1 text-xs italic" style={{ color: "var(--gold)", fontFamily: "Lora, serif" }}>
          Ancient Wisdom. Living Rivers.
        </p>
        {/* Decorative underline */}
        <div className="flex items-center gap-1 mt-1.5">
          <div
            className="h-0.5 w-12"
            style={{
              background: "repeating-linear-gradient(90deg, #c8952a 0px, #c8952a 4px, transparent 4px, transparent 6px)",
            }}
          />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
          <div
            className="h-0.5 w-12"
            style={{
              background: "repeating-linear-gradient(90deg, #c8952a 0px, #c8952a 4px, transparent 4px, transparent 6px)",
            }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Location selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(200,149,42,0.35)",
              color: "var(--text)",
              fontFamily: "Lora, serif",
              boxShadow: "0 1px 4px rgba(139,94,60,0.1)",
            }}
          >
            <MapPin size={14} style={{ color: "var(--green)" }} strokeWidth={2} />
            <span className="hidden sm:inline text-sm">{location}</span>
            <span className="sm:hidden text-xs max-w-[80px] truncate">{location.split(",")[0]}</span>
            <ChevronDown size={12} style={{ color: "var(--text-light)" }} />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden min-w-[180px]"
              style={{
                background: "var(--cream)",
                border: "1.5px solid rgba(200,149,42,0.3)",
                boxShadow: "0 8px 24px rgba(139,94,60,0.2)",
              }}
            >
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-amber-50 flex items-center gap-2"
                  style={{
                    fontFamily: "Lora, serif",
                    color: loc === location ? "var(--green)" : "var(--text)",
                    background: loc === location ? "rgba(61,107,30,0.08)" : "transparent",
                    borderBottom: "1px solid rgba(200,149,42,0.1)",
                  }}
                >
                  <MapPin size={12} />
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <button
          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "1.5px solid rgba(200,149,42,0.35)",
            boxShadow: "0 1px 4px rgba(139,94,60,0.1)",
          }}
        >
          <Bell size={18} style={{ color: "var(--text)" }} strokeWidth={1.8} />
          {notifCount > 0 && (
            <span
              className="notif-badge absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: "var(--orange)",
                fontSize: "10px",
                border: "2px solid var(--cream)",
                fontFamily: "Lora, serif",
              }}
            >
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
