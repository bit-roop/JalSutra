"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapClickHandler({ onChange }: { onChange: (latitude: number, longitude: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapCenterController({ latitude, longitude }: { latitude: number | null; longitude: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) map.setView([latitude, longitude], 14);
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}) {
  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        iconAnchor: [15, 30],
        iconSize: [30, 30],
        html: '<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#3d6b1e;border:2px solid #fff8df;box-shadow:0 2px 5px rgba(61,42,26,.28)"><span style="display:block;width:10px;height:10px;margin:8px;border-radius:50%;background:#fff8df"></span></div>',
      }),
    []
  );

  return (
    <MapContainer
      center={[25.5941, 85.1376]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onChange={onChange} />
      <MapCenterController latitude={latitude} longitude={longitude} />
      {latitude !== null && longitude !== null && (
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      )}
    </MapContainer>
  );
}
