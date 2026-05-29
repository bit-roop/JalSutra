"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import NotificationDropdown from "@/components/NotificationDropdown";

type NotificationBellProps = {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  showBadge?: boolean;
  badgeContent?: string | number;
  badgeClassName?: string;
  style?: React.CSSProperties;
};

export default function NotificationBell({
  className = "relative flex h-10 w-10 items-center justify-center rounded-full",
  iconClassName,
  iconSize = 20,
  showBadge = true,
  badgeContent,
  badgeClassName,
  style,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [bellRect, setBellRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const targetElement = target instanceof Element ? target : target.parentElement;
      if (!rootRef.current?.contains(target) && !targetElement?.closest("[data-notification-dropdown]")) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("pointerdown", handlePointerDown);
    }

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function updateRect() {
      if (rootRef.current) {
        setBellRect(rootRef.current.getBoundingClientRect());
      }
    }

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-[9999]">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={className}
        style={style}
      >
        <Bell size={iconSize} className={iconClassName} strokeWidth={1.8} />
        {showBadge ? (
          <span className={badgeClassName ?? "absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-js-green ring-2 ring-[#fbf5e8]"}>
            {badgeContent}
          </span>
        ) : null}
      </button>
      {open && mounted && bellRect
        ? createPortal(
            <NotificationDropdown bellRect={bellRect} onClose={() => setOpen(false)} />,
            document.body
          )
        : null}
    </div>
  );
}
