"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl, { type Map, type Marker, type StyleSpecification } from "maplibre-gl";
import type { MarketSignal, RankedListing } from "@/lib/types";

const BERGEN_CENTER: [number, number] = [5.32415, 60.39299];

const leieMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    cartoDark: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  },
  layers: [
    {
      id: "leie-background",
      type: "background",
      paint: {
        "background-color": "#04060B"
      }
    },
    {
      id: "carto-dark-raster",
      type: "raster",
      source: "cartoDark",
      paint: {
        "raster-opacity": 0.88,
        "raster-contrast": 0.2,
        "raster-saturation": -0.35
      }
    }
  ]
};

const signalColors: Record<MarketSignal, { core: string; glow: string; label: string }> = {
  under_market: {
    core: "#34D399",
    glow: "rgba(52,211,153,0.9)",
    label: "Under market"
  },
  market_price: {
    core: "#FACC15",
    glow: "rgba(250,204,21,0.82)",
    label: "Around market"
  },
  above_market: {
    core: "#F87171",
    glow: "rgba(248,113,113,0.86)",
    label: "Above market"
  },
  unknown: {
    core: "#5BE3F2",
    glow: "rgba(91,227,242,0.8)",
    label: "Unknown"
  }
};

function createMarkerElement(listing: RankedListing, selected: boolean) {
  const colors = signalColors[listing.marketSignal ?? "unknown"];
  const marker = document.createElement("button");
  marker.type = "button";
  marker.setAttribute("aria-label", listing.title);
  marker.title =
    listing.locationAccuracy === "approximate_area"
      ? `${listing.title} (approximate area)`
      : listing.title;
  marker.className = "leie-map-marker";
  marker.style.setProperty("--pin-core", colors.core);
  marker.style.setProperty("--pin-glow", colors.glow);
  marker.dataset.selected = selected ? "true" : "false";
  marker.dataset.accuracy = listing.locationAccuracy;
  marker.innerHTML = `
    <span class="leie-map-marker__halo"></span>
    <span class="leie-map-marker__core"></span>
    ${listing.locationAccuracy === "approximate_area" ? '<span class="leie-map-marker__approx">~</span>' : ""}
  `;
  return marker;
}

export function MapView({
  listings,
  selectedId,
  onSelect
}: {
  listings: RankedListing[];
  selectedId: string | null;
  onSelect: (listing: RankedListing) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const listingsWithCoordinates = useMemo(
    () => listings.filter((listing) => listing.latitude != null && listing.longitude != null),
    [listings]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: leieMapStyle,
      center: BERGEN_CENTER,
      zoom: 11.25,
      minZoom: 9.4,
      maxZoom: 17,
      pitch: 48,
      bearing: -18,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    for (const listing of listingsWithCoordinates) {
      const element = createMarkerElement(listing, selectedId === listing.id);
      element.addEventListener("click", () => {
        onSelect(listing);
        map.easeTo({
          center: [listing.longitude as number, listing.latitude as number],
          zoom: Math.max(map.getZoom(), 13.4),
          duration: 700
        });
      });

      const marker = new maplibregl.Marker({
        element,
        anchor: "center"
      })
        .setLngLat([listing.longitude as number, listing.latitude as number])
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [listingsWithCoordinates, onSelect, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = listingsWithCoordinates.find((listing) => listing.id === selectedId);
    if (!map || !selected || selected.latitude == null || selected.longitude == null) return;

    map.easeTo({
      center: [selected.longitude, selected.latitude],
      zoom: Math.max(map.getZoom(), 12.7),
      duration: 550
    });
  }, [listingsWithCoordinates, selectedId]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink">
      <div ref={mapContainerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(4,6,11,0.16)_44%,rgba(4,6,11,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="glass pointer-events-auto absolute bottom-24 left-4 max-w-[280px] rounded-lg p-3 text-xs text-frost/80 md:bottom-5">
        <div className="mb-2 font-semibold text-cyan">Market price signal</div>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
            Under area market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.7)]" />
            Around market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.7)]" />
            Above market
          </div>
          <div className="flex items-center gap-2 text-frost/60">
            <span className="grid h-4 w-4 place-items-center rounded-full border border-cyan/45 text-[10px] text-cyan">~</span>
            Approximate area pin
          </div>
        </div>
      </div>
    </section>
  );
}
