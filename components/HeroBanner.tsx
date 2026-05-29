"use client";

import OrnamentalCard from "@/components/OrnamentalCard";

export default function HeroBanner() {
  return (
    <OrnamentalCard
      accent="river"
      ornament="none"
      className="h-[244px] shrink-0 bg-[#d8edf0]"
      innerClassName="flex h-full items-stretch"
      style={{
        backgroundImage: "url('/assets/illustrations/hero-river-scene-2.png')",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="pointer-events-none absolute inset-y-4 left-5 z-10 w-[31%] rounded-xl bg-[#dcefe9]/10" />

      <div className="relative z-20 flex w-[34%] min-w-[300px] flex-col justify-center px-7 py-5">
        <h2 className="font-display text-[40px] font-bold leading-none text-js-green-dark">
          Namaste, Arjun!
        </h2>

        <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-js-green/35 bg-js-green/10 px-3 py-1 text-sm font-medium text-js-green-dark">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path
              d="M7 1L1 3.5V8C1 11.5 4 14.5 7 15.5C10 14.5 13 11.5 13 8V3.5L7 1Z"
              fill="#445b38"
              stroke="#243a24"
              strokeWidth="0.8"
            />
            <path d="M4 8L6 10L10 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          River Guardian Level 4
        </div>

        <div
          className="points-badge relative mt-4 inline-flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(250,246,236,0.96) 0%, rgba(234,220,194,0.88) 100%)",
            border: "2px solid rgba(168,125,54,0.55)",
            boxShadow: "0 5px 14px rgba(122,86,63,0.14)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-js-green/35" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <span
              key={deg}
              className="absolute h-3 w-2 rounded-full bg-js-green-light/70"
              style={{
                transform: `rotate(${deg}deg) translateY(-41px)`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
          <span className="font-display relative text-[31px] font-bold leading-none text-js-text">
            880
          </span>
          <span className="relative mt-0.5 text-[10px] text-js-text-light">points</span>
        </div>
      </div>
    </OrnamentalCard>
  );
}
