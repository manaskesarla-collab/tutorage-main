import { useEffect, useRef } from "react";
import type { Tutor } from "@/lib/tutors";

declare global {
  interface Window {
    google: any;
    __initTutorageMap?: () => void;
  }
}

const SCRIPT_ID = "tutorage-gmaps";

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();

  return new Promise((resolve) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    window.__initTutorageMap = () => resolve();
    if (existing) return;

    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initTutorageMap&channel=${channel}`;
    document.head.appendChild(s);
  });
}

export function TutorMap({
  tutors,
  highlightedId,
}: {
  tutors: Tutor[];
  highlightedId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !containerRef.current || !window.google?.maps) return;
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 11,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f7f2e6" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#4a3f2a" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f7f2e6" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe2d4" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    Object.values(markersRef.current).forEach((m: any) => m.setMap(null));
    markersRef.current = {};

    tutors.forEach((t) => {
      const marker = new window.google.maps.Marker({
        position: { lat: t.latitude, lng: t.longitude },
        map: mapRef.current,
        title: `${t.name} · ₹${t.hourly_rate}/hr`,
        label: {
          text: `₹${t.hourly_rate}`,
          color: "#fdf6e3",
          fontSize: "11px",
          fontWeight: "600",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 18,
          fillColor: "#2f5a3d",
          fillOpacity: 1,
          strokeColor: "#fdf6e3",
          strokeWeight: 2,
        },
      });
      markersRef.current[t.id] = marker;
    });
  }, [tutors]);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]: [string, any]) => {
      const isHi = id === highlightedId;
      m.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: isHi ? 22 : 18,
        fillColor: isHi ? "#c2643a" : "#2f5a3d",
        fillOpacity: 1,
        strokeColor: "#fdf6e3",
        strokeWeight: 2,
      });
      m.setZIndex(isHi ? 999 : 1);
    });
  }, [highlightedId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
