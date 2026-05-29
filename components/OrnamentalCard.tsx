import clsx from "clsx";

type OrnamentalCardProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  accent?: "earth" | "river" | "leaf" | "sun";
  ornament?: "top-bottom" | "corners" | "quiet" | "none";
  as?: "div" | "button" | "section" | "aside";
  style?: React.CSSProperties;
};

const accentStyles = {
  earth: "rgba(122,86,63,0.26)",
  river: "rgba(96,127,134,0.26)",
  leaf: "rgba(68,91,56,0.28)",
  sun: "rgba(168,125,54,0.30)",
};

export default function OrnamentalCard({
  children,
  className,
  innerClassName,
  accent = "earth",
  ornament = "top-bottom",
  as: Component = "div",
  style,
}: OrnamentalCardProps) {
  return (
    <Component
      className={clsx(
        "ornamental-card relative overflow-hidden rounded-xl border bg-js-cream/70 shadow-card",
        className
      )}
      style={{
        borderColor: accentStyles[accent],
        ...style,
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] rounded-lg border border-js-brown/10" />
      {ornament === "top-bottom" && (
        <>
          <div className="pointer-events-none absolute left-4 right-4 top-0 h-[5px] bg-[url('/assets/patterns/divider.png')] bg-contain bg-center opacity-28" />
          <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-[5px] bg-[url('/assets/patterns/divider.png')] bg-contain bg-center opacity-22" />
        </>
      )}
      {ornament === "corners" && (
        <>
          <div className="pointer-events-none absolute left-2 top-2 h-8 w-8 rounded-tl-lg border-l border-t border-js-gold/25" />
          <div className="pointer-events-none absolute right-2 top-2 h-8 w-8 rounded-tr-lg border-r border-t border-js-gold/20" />
          <div className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 rounded-bl-lg border-b border-l border-js-gold/20" />
          <div className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 rounded-br-lg border-b border-r border-js-gold/25" />
        </>
      )}
      {ornament === "quiet" && (
        <div className="pointer-events-none absolute inset-x-5 bottom-1 h-px bg-gradient-to-r from-transparent via-js-gold/25 to-transparent" />
      )}
      <div className={clsx("relative z-10", innerClassName)}>{children}</div>
    </Component>
  );
}
