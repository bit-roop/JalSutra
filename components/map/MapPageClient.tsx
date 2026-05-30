"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Bird, CalendarDays, CheckCircle2, ChevronDown, Clock3, Fish, Layers3, Leaf,
  LocateFixed, MapPin, Search, ShieldCheck, Sprout, Users, Waves, Plus,
  SearchCheck, Flag, Bookmark, Share2, Ban, Trees,
} from "lucide-react";

export type SpotCategory = "wetland" | "bird_zone" | "fish_zone" | "no_fishing_zone" | "sacred_grove";
export type SpotStatus = "submitted" | "under_review" | "verified";
export type Spot = {
  id: string; name: string; category: SpotCategory; description: string;
  latitude: number; longitude: number; location: string; city: string | null;
  district: string | null; status: SpotStatus; verified: boolean; image_url: string | null;
  created_by: string; support_count: number; created_at: string;
};

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
const categories: { id: SpotCategory; label: string; icon: typeof Waves; color: string }[] = [
  { id: "wetland", label: "Wetland", icon: Waves, color: "#2784b8" },
  { id: "bird_zone", label: "Bird Zone", icon: Bird, color: "#7754a8" },
  { id: "fish_zone", label: "Fish Zone", icon: Fish, color: "#e78a22" },
  { id: "no_fishing_zone", label: "No Fishing Zone", icon: Ban, color: "#ca4b34" },
  { id: "sacred_grove", label: "Sacred Grove", icon: Trees, color: "#438b3b" },
];
const statusLabels: Record<SpotStatus, string> = { submitted: "Submitted", under_review: "Under Review", verified: "Verified" };
const categoryLabels = Object.fromEntries(categories.map((category) => [category.id, category.label])) as Record<SpotCategory, string>;
const fallbackImages: Record<SpotCategory, string> = {
  wetland: "/images/map/kanwar-lake-wetland-thumb.jpg", bird_zone: "/images/map/udhwa-bird-sanctuary-thumb.jpg",
  fish_zone: "/images/map/vikramshila-dolphin-sanctuary-thumb.jpg", no_fishing_zone: "/images/map/vikramshila-dolphin-sanctuary-thumb.jpg",
  sacred_grove: "/images/map/dalma-landscape-thumb.jpg",
};

export default function MapPageClient() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SpotCategory | "all">("all");
  const [status, setStatus] = useState<SpotStatus | "all">("all");
  const [visibleLayers, setVisibleLayers] = useState<Set<SpotCategory>>(new Set(categories.map(({ id }) => id)));
  const [showLayers, setShowLayers] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/spots", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load ecological spots.");
        return response.json();
      })
      .then(({ spots: records }: { spots: Spot[] }) => {
        const normalized = records.map((spot) => ({ ...spot, latitude: Number(spot.latitude), longitude: Number(spot.longitude), support_count: Number(spot.support_count) }));
        setSpots(normalized);
        setSelectedSpot(normalized[0] ?? null);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const matchingSpots = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return spots.filter((spot) =>
      visibleLayers.has(spot.category) &&
      (category === "all" || spot.category === category) &&
      (!needle || [spot.name, spot.city, spot.district, spot.location].some((field) => field?.toLowerCase().includes(needle)))
    );
  }, [category, query, spots, visibleLayers]);
  const sidebarSpots = useMemo(() => matchingSpots.filter((spot) => status === "all" || spot.status === status), [matchingSpots, status]);

  function locateMe() {
    if (!navigator.geolocation) return setLocationMessage("Geolocation is not available in this browser.");
    setLocationMessage("Locating...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserPosition([coords.latitude, coords.longitude]); setLocationMessage("Location found"); },
      () => setLocationMessage("Location permission was not granted."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <main className="flex-1 min-h-0 pb-20 md:pb-0">
      <section className="map-toolbar relative z-[1001] flex flex-wrap items-center gap-2 overflow-hidden border-b px-3 py-3 md:px-5 md:pr-[220px]">
        <label className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border bg-white/80 px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-[#445b38]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search by spot, city, or district..." />
        </label>
        <ToolbarSelect icon={Leaf} value={category} onChange={(value) => setCategory(value as SpotCategory | "all")}>
          <option value="all">All Categories</option>{categories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </ToolbarSelect>
        <ToolbarSelect icon={Clock3} value={status} onChange={(value) => setStatus(value as SpotStatus | "all")}>
          <option value="all">All Statuses</option><option value="verified">Verified</option><option value="under_review">Under Review</option><option value="submitted">Submitted</option>
        </ToolbarSelect>
        <div className="relative">
          <button onClick={() => setShowLayers(!showLayers)} className="toolbar-button"><Layers3 size={17} /> Layers <ChevronDown size={14} /></button>
          {showLayers && <LayerMenu layers={visibleLayers} setLayers={setVisibleLayers} />}
        </div>
        <Image src="/images/map/map-river-header.png" alt="" width={220} height={58} className="pointer-events-none absolute right-3 top-1/2 hidden h-14 w-[210px] -translate-y-1/2 object-contain md:block" />
      </section>

      <section className="grid min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,69fr)_minmax(390px,31fr)]">
        <div className="flex min-h-0 flex-col">
          <div className="relative h-[460px] overflow-hidden border-b border-[#bda77b]/50 md:h-[520px] xl:h-[calc(100vh-450px)] xl:min-h-[410px]">
            <LeafletMap spots={matchingSpots} selectedSpot={selectedSpot} userPosition={userPosition} onSelect={setSelectedSpot} />
            <MapLegend />
            <button onClick={locateMe} title="Locate Me" className="absolute bottom-4 left-4 z-[900] flex items-center gap-2 rounded-xl border border-[#bda77b] bg-[#fffaf0] px-3 py-2 text-sm font-semibold text-[#294f2d] shadow-lg">
              <LocateFixed size={18} /> Locate Me
            </button>
            {locationMessage && <span className="absolute bottom-16 left-4 z-[900] rounded-lg bg-[#fffaf0] px-3 py-1.5 text-xs shadow">{locationMessage}</span>}
          </div>
          <DetailsCard spot={selectedSpot} />
        </div>
        <SpotsPanel spots={sidebarSpots} selectedId={selectedSpot?.id} status={status} setStatus={setStatus} onSelect={setSelectedSpot} loading={loading} error={error} />
      </section>
    </main>
  );
}

function ToolbarSelect({ icon: Icon, value, onChange, children }: { icon: typeof Leaf; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="toolbar-button"><Icon size={17} /><select value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent text-sm outline-none">{children}</select></label>;
}

function LayerMenu({ layers, setLayers }: { layers: Set<SpotCategory>; setLayers: (layers: Set<SpotCategory>) => void }) {
  return <div className="absolute right-0 top-12 w-60 rounded-xl border border-[#bda77b]/70 bg-[#fffaf0] p-3 shadow-xl">{categories.map(({ id, label, icon: Icon, color }) =>
    <label key={id} className="flex cursor-pointer items-center gap-2 border-b border-[#dfd0b6]/70 py-2 text-sm last:border-0">
      <Icon size={16} style={{ color }} /><span className="flex-1">{label}</span><input type="checkbox" checked={layers.has(id)} onChange={() => { const next = new Set(layers); next.has(id) ? next.delete(id) : next.add(id); setLayers(next); }} />
    </label>)}</div>;
}

function SpotsPanel({ spots, selectedId, status, setStatus, onSelect, loading, error }: { spots: Spot[]; selectedId?: string; status: SpotStatus | "all"; setStatus: (status: SpotStatus | "all") => void; onSelect: (spot: Spot) => void; loading: boolean; error: string }) {
  return <aside className="relative flex min-h-[500px] flex-col border-l border-[#c9b78e]/60 bg-[#f8f1e3]/95 p-3">
    <div className="mb-3 flex items-center gap-2 border-b border-[#c9b78e] pb-3"><Sprout className="text-[#445b38]" /><h2 className="font-display text-xl font-bold text-[#294f2d]">Community Ecological Spots</h2></div>
    <div className="mb-3 flex gap-1 rounded-lg bg-[#eadcc2]/70 p-1">{(["all", "verified", "under_review"] as const).map((item) => <button key={item} onClick={() => setStatus(item)} className={`flex-1 rounded-md px-1 py-2 text-xs ${status === item ? "bg-[#445b38] text-white shadow" : "text-[#65513d]"}`}>{item === "all" ? "All" : statusLabels[item]}</button>)}</div>
    {loading && <p className="p-4 text-sm text-[#65513d]">Loading ecological spots...</p>}{error && <p className="p-4 text-sm text-[#a95f38]">{error}</p>}
    <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">{spots.map((spot) => <button key={spot.id} onClick={() => onSelect(spot)} className={`flex w-full gap-2.5 rounded-xl border p-1.5 text-left shadow-sm transition hover:-translate-y-0.5 ${selectedId === spot.id ? "border-[#445b38] bg-[#eef1df]" : "border-[#d9c7a3] bg-[#fffaf0]"}`}>
      <Image src={spot.image_url || fallbackImages[spot.category]} alt="" width={88} height={62} className="h-[62px] w-[88px] rounded-lg object-cover" />
      <span className="min-w-0 flex-1"><strong className="block truncate font-display text-[15px] leading-5 text-[#2f241a]">{spot.name}</strong><span className="block truncate text-[11px] leading-4 text-[#65513d]">{spot.location}</span><span className="block truncate text-[10px] leading-4 text-[#7c6a56]">{spot.created_by}</span><StatusBadge status={spot.status} compact /></span>
    </button>)}</div>
    {!loading && !error && spots.length === 0 && <p className="rounded-lg border border-[#d9c7a3] bg-white/50 p-4 text-sm text-[#65513d]">No spots match these filters.</p>}
    <div className="mt-auto border-t border-[#d9c7a3]/80 pt-2"><Image src="/images/map/map-bird-art.png" alt="" width={310} height={116} className="mx-auto max-h-24 w-full object-contain opacity-95" /></div>
  </aside>;
}

function MapLegend() {
  return <section className="absolute left-4 top-4 z-[900] hidden w-48 rounded-xl border border-[#c9b78e] bg-[#fffaf0]/95 p-2.5 shadow-lg md:block">
    {categories.map(({ id, label, icon: Icon, color }) => <div key={id} className="flex items-center gap-2 py-1.5 text-xs text-[#4f4032]"><span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: color }}><Icon size={14} /></span><span>{label}{id === "wetland" || id === "bird_zone" || id === "fish_zone" || id === "no_fishing_zone" || id === "sacred_grove" ? "s" : ""}</span></div>)}
    <div className="mt-1 border-t border-[#dfd0b6] pt-2 text-center text-[11px] font-semibold text-[#294f2d]">Show All</div>
  </section>;
}

function DetailsCard({ spot }: { spot: Spot | null }) {
  if (!spot) return <div className="m-3 rounded-xl border border-[#d9c7a3] bg-[#fffaf0] p-5 text-sm text-[#65513d]">Select an ecological spot to view its details.</div>;
  return <article className="atlas-details m-3 grid gap-4 rounded-2xl border border-[#d1bd93] bg-[#fffaf0]/95 p-3 shadow-md lg:grid-cols-[240px_minmax(0,1fr)_315px]">
    <div className="relative overflow-hidden rounded-xl"><Image src={spot.image_url || fallbackImages[spot.category]} alt={spot.name} width={480} height={320} className="h-52 w-full object-cover lg:h-full" /><span className="absolute bottom-2 left-2 rounded-md bg-[#243a24]/80 px-2 py-1 text-[11px] text-white">Ecological Atlas Spot</span></div>
    <div className="min-w-0 py-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e6efd4] p-2 text-[#3f7f38]"><Sprout size={20} /></span><h1 className="font-display text-2xl font-bold text-[#294f2d]">{spot.name}</h1><StatusBadge status={spot.status} /></div>
      <p className="mt-2 flex items-center gap-1 text-sm text-[#65513d]"><MapPin size={15} />{spot.location}</p><p className="mt-3 text-sm leading-6 text-[#4f4032]">{spot.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="atlas-tag">{categoryLabels[spot.category]}</span><span className="atlas-tag">Biodiversity</span><span className="atlas-tag">Community Stewardship</span></div>
      <p className="mt-3 text-xs text-[#65513d]"><Info icon={MapPin} text={`${spot.latitude.toFixed(4)}° N, ${spot.longitude.toFixed(4)}° E`} /></p>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#dfd0b6] pt-3 text-xs text-[#65513d] sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"><Info icon={Leaf} text={spot.created_by} /><Info icon={CalendarDays} text={new Date(spot.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} /><Info icon={Users} text={`${spot.support_count} supporters`} /><Info icon={Flag} text="0 reports" /></div>
    </div>
    <Workflow spot={spot} />
  </article>;
}

function Workflow({ spot }: { spot: Spot }) {
  const verified = spot.status === "verified"; const reviewed = verified || spot.status === "under_review";
  return <section className="workflow-card rounded-xl border border-[#d9c7a3] bg-[#fbf6e9] p-3">
    <h2 className="font-display text-lg font-bold text-[#294f2d]">Spot Workflow</h2><div className="mt-1 h-px bg-[#c9b78e]" />
    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-[#65513d]">
      <WorkflowStep icon={Plus} label="Add Spot" active /><WorkflowStep icon={SearchCheck} label="Reviewed" active={reviewed} /><WorkflowStep icon={CheckCircle2} label="Verified" active={verified} />
    </div>
    <div className="mt-4 space-y-1 border-t border-[#dfd0b6] pt-3 text-[11px] text-[#65513d]"><p>Added by <strong>{spot.created_by}</strong></p><p>{new Date(spot.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
    <div className="mt-3 flex gap-2"><button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#bda77b] bg-[#fffaf0] px-2 py-2 text-xs text-[#294f2d]"><Bookmark size={14} /> Save</button><button className="rounded-lg border border-[#bda77b] bg-[#fffaf0] px-3 text-[#294f2d]"><Share2 size={14} /></button></div>
  </section>;
}
function WorkflowStep({ icon: Icon, label, active }: { icon: typeof Plus; label: string; active: boolean }) { return <div><span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 ${active ? "border-[#3f7f38] bg-[#e6efd4] text-[#3f7f38]" : "border-[#c9b78e] bg-[#f3ead8] text-[#a87d36]"}`}><Icon size={20} /></span><span className="mt-1 block font-semibold">{label}</span></div>; }
function Info({ icon: Icon, text }: { icon: typeof Waves; text: string }) { return <span className="flex items-center gap-1.5"><Icon size={14} className="text-[#445b38]" />{text}</span>; }
function StatusBadge({ status, compact = false }: { status: SpotStatus; compact?: boolean }) { return <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 ${compact ? "py-0.5 text-[9px]" : "py-1 text-[10px]"} font-semibold ${status === "verified" ? "bg-[#e6efd4] text-[#3f7f38]" : status === "under_review" ? "bg-[#f8edc9] text-[#9c6d13]" : "bg-[#eadcc2] text-[#7a563f]"}`}>{status === "verified" ? <CheckCircle2 size={compact ? 10 : 12} /> : <Clock3 size={compact ? 10 : 12} />}{statusLabels[status]}</span>; }
