import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeatureGrid from "@/components/FeatureGrid";
import AlertsPanel from "@/components/AlertsPanel";
import RecentActivity from "@/components/RecentActivity";
import SeasonalTip from "@/components/SeasonalTip";

export default function Home() {
  return (
    <div className="h-auto min-h-screen overflow-x-hidden min-[1400px]:h-screen min-[1400px]:overflow-hidden folk-pattern-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main layout */}
      <div className="md:ml-[196px] flex flex-col min-h-screen min-[1400px]:h-screen">
        {/* Header */}
        <Header />

        {/* Page content */}
        <div className="flex flex-1 flex-col min-h-0 gap-3 p-4 md:p-4 xl:p-5 pb-24 md:pb-5 min-[1400px]:flex-row min-[1400px]:pb-5">
          {/* Center column */}
          <main className="flex-1 flex min-h-0 flex-col gap-3 min-w-0">
            {/* Hero */}
            <HeroBanner />

            {/* Feature grid */}
            <FeatureGrid />

            {/* Seasonal tip */}
            <SeasonalTip />
          </main>

          {/* Right panel – desktop only */}
          <aside className="hidden min-[1400px]:flex min-h-0 flex-col gap-3 w-72 xl:w-80 flex-shrink-0">
            <AlertsPanel />
            <RecentActivity />
          </aside>
        </div>

        {/* Medium/mobile: Observations + Activity below main content */}
        <div className="min-[1400px]:hidden px-4 md:px-5 pb-24 flex flex-col gap-4">
          <AlertsPanel />
          <RecentActivity />
        </div>
      </div>

      {/* Decorative folk art bottom watermark on large screens */}
      <div
        className="fixed bottom-0 left-[196px] right-0 h-1 hidden md:block pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(90deg, #c8952a 0px, #c8952a 12px, #3d6b1e 12px, #3d6b1e 24px, #d4622a 24px, #d4622a 36px, #4a90b8 36px, #4a90b8 48px)",
        }}
      />
    </div>
  );
}
