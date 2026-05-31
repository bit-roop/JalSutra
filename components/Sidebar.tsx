"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Users, User, Plus } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "map", label: "Map", icon: Map, href: "/map" },
  { id: "community", label: "Community", icon: Users, href: "/community" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="sidebar-desktop hidden md:flex flex-col fixed left-0 top-0 h-full z-30 select-none overflow-hidden"
        style={{
          width: "196px",
          background:
            "linear-gradient(180deg, rgba(8,24,12,0.08), rgba(8,24,12,0.12)), url('/assets/sidebar/sidebar-full.png')",
          backgroundPosition: "center top, center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%, 100% 100%",
          borderRight: "1px solid rgba(220,194,128,0.28)",
          boxShadow: "8px 0 24px rgba(44,32,18,0.12)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-black/[0.03]" />

        {/* Logo */}
        <div className="relative flex flex-col items-center pt-6 pb-2 px-3">
          {/* Logo circle */}
          <div
            className="w-[76px] h-[76px] rounded-full flex items-center justify-center mb-3 relative"
            style={{
              background: "radial-gradient(circle, #f8f0dd 58%, #d9c89f 100%)",
              border: "1px solid rgba(230,205,139,0.62)",
              boxShadow: "0 0 0 5px rgba(238,218,160,0.12), 0 8px 18px rgba(6,16,8,0.28)",
            }}
          >
            {/* Decorative circle ring */}
            <div
              className="absolute inset-1 rounded-full"
              style={{
                border: "1px dashed rgba(68,91,56,0.48)",
              }}
            />
            {/* Water drop with fish SVG */}
            <svg width="40" height="44" viewBox="0 0 36 40" fill="none">
              {/* Water drop */}
              <path
                d="M18 2 C18 2, 4 18, 4 26 C4 34 10.3 38 18 38 C25.7 38 32 34 32 26 C32 18 18 2 18 2Z"
                fill="#607f86"
                stroke="#435f63"
                strokeWidth="1.5"
              />
              {/* Wave inside drop */}
              <path
                d="M6 27 Q10 24 14 27 Q18 30 22 27 Q26 24 30 27"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Fish */}
              <ellipse cx="17" cy="22" rx="5" ry="3" fill="#a95f38" />
              <path d="M22 22 L26 19 L26 25 Z" fill="#a95f38" />
              <circle cx="14" cy="21" r="0.8" fill="white" />
            </svg>
          </div>

          {/* Brand name */}
          <div className="text-center">
            <h1
              className="font-display font-bold leading-tight text-[#f7edd2]"
              style={{ fontSize: "22px", textShadow: "0 2px 7px rgba(0,0,0,0.24)" }}
            >
              JalSutra
            </h1>
            <p
              className="text-xs leading-tight mt-0.5"
              style={{ color: "rgba(244,225,171,0.78)", fontStyle: "italic", fontSize: "10px" }}
            >
              Ancient Wisdom. Living Rivers.
            </p>
          </div>

          {/* Dot separator */}
          <div className="flex items-center gap-1 mt-2">
            <span className="block w-1 h-1 rounded-full bg-js-gold opacity-60" />
            <span className="block w-2 h-2 rounded-full" style={{ background: "var(--gold-light)" }} />
            <span className="block w-3 h-0.5" style={{ background: "rgba(168,125,54,0.5)" }} />
            <span className="block w-2 h-2 rounded-full" style={{ background: "var(--gold-light)" }} />
            <span className="block w-1 h-1 rounded-full bg-js-gold opacity-60" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative px-4 mt-4 space-y-3">
          {navItems.map(({ id, label, icon: Icon, href }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
            <Link
              key={id}
              href={href}
              className={clsx(
                "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all"
              )}
              style={
                active
                  ? {
                      color: "#fff6df",
                      background: "linear-gradient(90deg, rgba(247,235,188,0.23), rgba(247,235,188,0.12))",
                      border: "1px solid rgba(238,218,160,0.22)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.035), 0 4px 10px rgba(5,16,7,0.14)",
                    }
                  : {
                      color: "rgba(246,232,190,0.88)",
                    }
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span style={{ fontFamily: "Lora, serif" }}>{label}</span>
            </Link>
            );
          })}
        </nav>

        {/* Separator line */}
        <div
          className="mx-7 mt-8 mb-5"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(238,218,160,0.34), transparent)",
          }}
        />

        {/* Add/Create button */}
        <div className="relative px-4 pb-3">
          <Link
            href="/report-biodiversity"
            className="w-full flex flex-col items-center gap-2 py-1 transition-all"
          >
            <div
              className="w-[54px] h-[54px] rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(247,235,188,0.96), rgba(223,202,144,0.88))",
                border: "1px solid rgba(238,218,160,0.72)",
                boxShadow: "0 0 0 3px rgba(255,244,202,0.10), 0 5px 12px rgba(4,14,6,0.24)",
              }}
            >
              <Plus size={26} className="text-[#294f2d]" strokeWidth={1.8} />
            </div>
            <span className="text-[#f4e6bc] text-sm" style={{ fontFamily: "Lora, serif" }}>
              Add / Create
            </span>
          </Link>
        </div>

      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background:
            "linear-gradient(rgba(237,224,196,0.96), rgba(226,211,183,0.98)), url('/assets/textures/paper-texture.png')",
          backgroundSize: "auto, 320px 320px",
          borderTop: "1px solid rgba(122,86,63,0.3)",
          boxShadow: "0 -6px 18px rgba(80,58,35,0.12)",
        }}
      >
        {navItems.map(({ id, label, icon: Icon, href }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
          <Link
            key={id}
            href={href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all",
              active ? "text-js-text" : "text-js-text-light"
            )}
            style={
              active
                ? {
                    background: "rgba(248,240,221,0.7)",
                    border: "1px solid rgba(168,125,54,0.36)",
                  }
                : {}
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span className="text-xs" style={{ fontFamily: "Lora, serif" }}>
              {label}
            </span>
          </Link>
          );
        })}
        <Link
          href="/report-biodiversity"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-js-text-light"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(168,125,54,0.16)", border: "1px solid rgba(122,86,63,0.28)" }}
          >
            <Plus size={16} className="text-js-text" />
          </div>
          <span className="text-xs text-js-text-light" style={{ fontFamily: "Lora, serif" }}>
            Create
          </span>
        </Link>
      </nav>
    </>
  );
}
