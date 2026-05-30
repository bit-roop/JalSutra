"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Ban, Bird, Fish, Trees, Waves } from "lucide-react";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Spot } from "./MapPageClient";
import "leaflet/dist/leaflet.css";

const markerColors: Record<Spot["category"], string> = {
  wetland: "#2784b8",
  bird_zone: "#7754a8",
  fish_zone: "#e78a22",
  no_fishing_zone: "#ca4b34",
  sacred_grove: "#438b3b",
};

const markerIcons: Record<Spot["category"], typeof Waves> = {
  wetland: Waves,
  bird_zone: Bird,
  fish_zone: Fish,
  no_fishing_zone: Ban,
  sacred_grove: Trees,
};
const gangaRiverPath: [number, number][] = [
  [27.46, 84.08], [27.31, 84.28], [27.14, 84.43], [26.97, 84.62],
  [26.82, 84.86], [26.66, 85.04], [26.49, 85.26], [26.34, 85.48],
  [26.16, 85.69], [26.03, 85.89], [25.89, 86.07], [25.78, 86.28],
  [25.66, 86.45], [25.56, 86.67], [25.43, 86.84], [25.31, 87.03],
  [25.22, 87.24], [25.18, 87.43], [25.08, 87.62], [24.98, 87.82],
];
const gandakRiverPath: [number, number][] = [
  [27.58, 84.02], [27.37, 84.17], [27.18, 84.35], [26.98, 84.51],
  [26.77, 84.69], [26.52, 84.84], [26.25, 84.96], [25.98, 85.04],
  [25.76, 85.10], [25.64, 85.14],
];
const kosiRiverPath: [number, number][] = [
  [27.44, 87.32], [27.20, 87.26], [26.98, 87.18], [26.74, 87.12],
  [26.52, 87.08], [26.28, 87.06], [26.05, 87.10], [25.86, 87.18],
  [25.68, 87.25], [25.52, 87.34],
];
const damodarRiverPath: [number, number][] = [
  [23.95, 84.92], [23.82, 85.15], [23.72, 85.38], [23.64, 85.62],
  [23.56, 85.87], [23.48, 86.10], [23.40, 86.34], [23.34, 86.62],
  [23.27, 86.88], [23.20, 87.12],
];
const floodplainRegions: [number, number][][] = [
  [[27.56, 83.92], [27.60, 84.24], [27.35, 84.42], [27.10, 84.36], [27.00, 84.10], [27.20, 83.92]],
  [[25.82, 85.92], [25.82, 86.36], [25.62, 86.56], [25.42, 86.36], [25.44, 86.00], [25.62, 85.86]],
  [[25.28, 87.58], [25.26, 87.92], [24.96, 88.00], [24.82, 87.78], [24.94, 87.54]],
  [[26.25, 86.94], [26.32, 87.26], [25.98, 87.42], [25.76, 87.25], [25.90, 87.00]],
];
const atlasBounds: [number, number][] = [[22.72, 83.72], [27.72, 88.15]];
const atlasLabels = [
  { id: "bihar", label: "Bihar", position: [26.12, 85.72] as [number, number], className: "atlas-region-label" },
  { id: "jharkhand", label: "Jharkhand", position: [23.72, 85.72] as [number, number], className: "atlas-region-label" },
  { id: "patna", label: "Patna", position: [25.61, 85.14] as [number, number], className: "atlas-city-label" },
  { id: "bagaha", label: "Bagaha", position: [27.10, 84.10] as [number, number], className: "atlas-city-label" },
  { id: "sitamarhi", label: "Sitamarhi", position: [26.60, 85.48] as [number, number], className: "atlas-city-label" },
  { id: "darbhanga", label: "Darbhanga", position: [26.15, 85.90] as [number, number], className: "atlas-city-label" },
  { id: "bhagalpur", label: "Bhagalpur", position: [25.24, 87.03] as [number, number], className: "atlas-city-label" },
  { id: "ranchi", label: "Ranchi", position: [23.35, 85.33] as [number, number], className: "atlas-city-label" },
  { id: "jamshedpur", label: "Jamshedpur", position: [22.80, 86.20] as [number, number], className: "atlas-city-label" },
  { id: "ganga", label: "Ganga", position: [25.48, 86.36] as [number, number], className: "atlas-river-label" },
  { id: "kosi", label: "Kosi", position: [26.04, 87.12] as [number, number], className: "atlas-river-label" },
  { id: "gandak", label: "Gandak", position: [27.20, 84.47] as [number, number], className: "atlas-river-label" },
];
const decorativeMarkers: { id: string; category: Spot["category"]; position: [number, number] }[] = [
  { id: "wetland-gandak", category: "wetland", position: [27.10, 84.50] },
  { id: "wetland-patna", category: "wetland", position: [25.64, 85.18] },
  { id: "wetland-kosi", category: "wetland", position: [25.90, 87.54] },
  { id: "bird-bagaha", category: "bird_zone", position: [26.82, 84.85] },
  { id: "bird-vaishali", category: "bird_zone", position: [25.82, 85.42] },
  { id: "bird-rajmahal", category: "bird_zone", position: [25.18, 87.70] },
  { id: "bird-damodar", category: "bird_zone", position: [23.78, 86.42] },
  { id: "fish-sonpur", category: "fish_zone", position: [25.73, 85.02] },
  { id: "fish-munger", category: "fish_zone", position: [25.38, 86.48] },
  { id: "fish-sahibganj", category: "fish_zone", position: [25.20, 87.62] },
  { id: "grove-hazaribagh", category: "sacred_grove", position: [23.98, 85.38] },
  { id: "grove-ranchi", category: "sacred_grove", position: [23.42, 85.32] },
  { id: "no-fishing-patna", category: "no_fishing_zone", position: [25.61, 85.11] },
  { id: "no-fishing-bhagalpur", category: "no_fishing_zone", position: [25.28, 86.93] },
];

function makeMarkerIcon(category: Spot["category"], selected: boolean) {
  const color = markerColors[category];
  const size = selected ? 42 : 34;
  const svg = renderToStaticMarkup(createElement(markerIcons[category], { size: selected ? 22 : 18, strokeWidth: 2.4 }));
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div class="map-pin${selected ? " map-pin-selected" : ""}" style="--pin:${color};width:${size}px;height:${size}px"><span>${svg}</span></div>`,
  });
}

function makeAtlasLabelIcon(label: string, className: string) {
  return L.divIcon({
    className: "",
    iconSize: [120, 32],
    iconAnchor: [60, 16],
    html: `<span class="${className}">${label}</span>`,
  });
}

function DecorativeRiver({ positions }: { positions: [number, number][] }) {
  return (
    <>
      <Polyline positions={positions} interactive={false} pathOptions={{ color: "#b1e2ec", weight: 10, opacity: 0.38, lineCap: "round", lineJoin: "round" }} />
      <Polyline positions={positions} interactive={false} pathOptions={{ color: "#69bad4", weight: 5, opacity: 0.7, lineCap: "round", lineJoin: "round" }} />
      <Polyline positions={positions} interactive={false} pathOptions={{ color: "#2f91b7", weight: 2, opacity: 0.88, lineCap: "round", lineJoin: "round" }} />
    </>
  );
}

function MapController({
  spots,
  focusSpot,
  userPosition,
}: {
  spots: Spot[];
  focusSpot: Spot | null;
  userPosition: [number, number] | null;
}) {
  const map = useMap();
  const hasFitInitialBounds = useRef(false);
  const previousFocusSpotId = useRef<string | null>(null);

  useEffect(() => {
    if (!hasFitInitialBounds.current && spots.length > 0) {
      const bounds = L.latLngBounds(spots.map((spot) => [spot.latitude, spot.longitude] as [number, number]));
      gangaRiverPath.forEach((anchor) => bounds.extend(anchor));
      atlasBounds.forEach((anchor) => bounds.extend(anchor));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 8 });
      hasFitInitialBounds.current = true;
      previousFocusSpotId.current = focusSpot?.id ?? null;
    }
  }, [focusSpot?.id, map, spots]);

  useEffect(() => {
    if (
      hasFitInitialBounds.current &&
      focusSpot &&
      previousFocusSpotId.current !== focusSpot.id
    ) {
      map.flyTo([focusSpot.latitude, focusSpot.longitude], Math.max(map.getZoom(), 10), { duration: 0.8 });
      previousFocusSpotId.current = focusSpot.id;
    }
  }, [focusSpot, map]);

  useEffect(() => {
    if (userPosition) map.flyTo(userPosition, 13, { duration: 0.8 });
  }, [map, userPosition]);

  return null;
}

export default function LeafletMap({
  spots,
  selectedSpot,
  userPosition,
  onSelect,
}: {
  spots: Spot[];
  selectedSpot: Spot | null;
  userPosition: [number, number] | null;
  onSelect: (spot: Spot) => void;
}) {
  const icons = useMemo(
    () => Object.fromEntries(spots.map((spot) => [spot.id, makeMarkerIcon(spot.category, spot.id === selectedSpot?.id)])),
    [selectedSpot?.id, spots]
  );
  const userIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: '<div class="user-location-marker"><span></span></div>',
      }),
    []
  );
  const decorativeIcons = useMemo(
    () => Object.fromEntries(decorativeMarkers.map((marker) => [marker.id, makeMarkerIcon(marker.category, false)])),
    []
  );
  const labelIcons = useMemo(
    () => Object.fromEntries(atlasLabels.map((label) => [label.id, makeAtlasLabelIcon(label.label, label.className)])),
    []
  );

  return (
    <MapContainer center={[25.35, 86.15]} zoom={7} zoomSnap={0.25} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapController spots={spots} focusSpot={selectedSpot} userPosition={userPosition} />
      {floodplainRegions.map((positions, index) => (
        <Polygon
          key={`floodplain-${index}`}
          positions={positions}
          interactive={false}
          pathOptions={{ color: "#74b8a4", weight: 1, opacity: 0.22, fillColor: "#a9dbc3", fillOpacity: 0.18 }}
        />
      ))}
      <DecorativeRiver positions={gangaRiverPath} />
      <DecorativeRiver positions={gandakRiverPath} />
      <DecorativeRiver positions={kosiRiverPath} />
      <DecorativeRiver positions={damodarRiverPath} />
      {decorativeMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={decorativeIcons[marker.id]}
          interactive={false}
          keyboard={false}
        />
      ))}
      {atlasLabels.map((label) => (
        <Marker
          key={label.id}
          position={label.position}
          icon={labelIcons[label.id]}
          interactive={false}
          keyboard={false}
        />
      ))}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={icons[spot.id]}
          eventHandlers={{ click: () => onSelect(spot) }}
        >
          <Tooltip direction="top" offset={[0, -18]}>{spot.name}</Tooltip>
        </Marker>
      ))}
      {userPosition && <Marker position={userPosition} icon={userIcon}><Tooltip>Your current location</Tooltip></Marker>}
      <style jsx global>{`
        .atlas-region-label,
        .atlas-city-label,
        .atlas-river-label {
          display: block;
          width: 120px;
          text-align: center;
          color: #244b31;
          font-family: "Playfair Display", Georgia, serif;
          text-shadow: 0 1px 0 rgba(255, 250, 240, 0.95), 0 0 8px rgba(255, 250, 240, 0.95);
          pointer-events: none;
        }
        .atlas-region-label {
          font-size: 25px;
          font-weight: 700;
        }
        .atlas-city-label {
          color: #3d3328;
          font-family: "Lora", Georgia, serif;
          font-size: 13px;
          font-weight: 700;
        }
        .atlas-river-label {
          color: #277ba5;
          font-family: "Lora", Georgia, serif;
          font-size: 13px;
          font-style: italic;
          font-weight: 700;
        }
      `}</style>
    </MapContainer>
  );
}
