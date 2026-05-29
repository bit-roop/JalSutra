"use client";

import OrnamentalCard from "@/components/OrnamentalCard";

export default function SeasonalTip() {
  return (
    <OrnamentalCard
      accent="sun"
      ornament="none"
      className="h-[112px] shrink-0 overflow-hidden rounded-2xl"
      innerClassName="h-full overflow-hidden"
      style={{
        backgroundImage: "url('/assets/illustrations/seasonal-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "16px",
      }}
    >
      <span className="sr-only">
        Summer is here - place water bowls and earthen nests for birds
      </span>
    </OrnamentalCard>
  );
}
