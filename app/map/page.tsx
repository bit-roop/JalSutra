import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MapPageClient from "@/components/map/MapPageClient";

export default function MapPage() {
  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px] flex min-h-screen flex-col">
        <Header />
        <MapPageClient />
      </div>
    </div>
  );
}
