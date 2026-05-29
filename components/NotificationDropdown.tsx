"use client";

import { Bell, Bird, Droplet, Sprout, Users } from "lucide-react";

const notifications = [
  {
    title: "Water level in your area has improved",
    time: "2h ago",
    icon: Droplet,
    bg: "#dbeeff",
    color: "#2f7fa5",
  },
  {
    title: "New Planting Mission starts tomorrow",
    time: "5h ago",
    icon: Sprout,
    bg: "#e6ebc6",
    color: "#55753a",
  },
  {
    title: "Spotted: Indian Roller in your region",
    time: "1d ago",
    icon: Bird,
    bg: "#f0dba7",
    color: "#445b38",
  },
  {
    title: "Community meeting this Sunday",
    time: "2d ago",
    icon: Users,
    bg: "#f2ceb9",
    color: "#445b38",
  },
];

const dropdownWidth = 340;
const viewportPadding = 16;

export default function NotificationDropdown({
  bellRect,
  onClose,
}: {
  bellRect: DOMRect;
  onClose: () => void;
}) {
  const isDesktop = window.innerWidth >= 768;
  const desktopLeft = Math.min(
    Math.max(viewportPadding, bellRect.right - dropdownWidth),
    Math.max(viewportPadding, window.innerWidth - dropdownWidth - viewportPadding)
  );
  const desktopTop = Math.min(
    bellRect.bottom + 12,
    Math.max(viewportPadding, window.innerHeight - 420 - viewportPadding)
  );

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-[#1f170d]/35 md:hidden" onClick={onClose} />
      <section
        data-notification-dropdown
        className="fixed inset-x-4 bottom-4 z-[9999] max-h-[82vh] overflow-y-auto rounded-2xl border border-js-gold/25 bg-[#fbf5e8] p-3 shadow-2xl md:inset-x-auto md:bottom-auto md:max-h-[420px] md:w-[340px] md:max-w-[calc(100vw-2rem)] md:rounded-xl md:p-3 md:shadow-card"
        style={isDesktop ? { left: `${desktopLeft}px`, top: `${desktopTop}px` } : undefined}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-js-green text-[#fff8df]">
              <Bell size={24} strokeWidth={1.8} />
            </span>
            <h2 className="font-display text-[24px] font-bold text-js-green-dark">Alerts</h2>
          </div>
          <button type="button" className="text-sm font-semibold text-js-green-dark">
            View all
          </button>
        </div>

        <div className="rounded-xl border border-js-gold/25 bg-[#fffaf0]/64 px-3">
          {notifications.map(({ title, time, icon: Icon, bg, color }) => (
            <article key={title} className="flex gap-3 border-b border-dashed border-js-gold/35 py-3 last:border-b-0">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: bg, color }}>
                <Icon size={25} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-medium leading-snug text-js-text">{title}</h3>
                <p className="mt-0.5 text-sm text-js-text-light">{time}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
