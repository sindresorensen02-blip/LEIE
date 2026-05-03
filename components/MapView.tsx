"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { MarketSignal, RankedListing } from "@/lib/types";
import { NO } from "@/lib/copy";

const BERGEN_CENTER: [number, number] = [5.32415, 60.39299];
const LISTINGS_SOURCE_ID = "leie-listings";

const ACCENT = "#0B6FF3";
const TEAL = "#00C7A7";
const ERROR_COLOR = "#EF4444";
const MUTED = "#64748B";
const SNOW = "#F7FAFC";

function buildStyle(opacity = 96, saturation = -5): StyleSpecification {
  return {
    version: 8,
    sources: {
      carto: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap © CARTO"
      }
    },
    layers: [
      {
        id: "bg",
        type: "background",
        paint: { "background-color": SNOW }
      },
      {
        id: "tiles",
        type: "raster",
        source: "carto",
        paint: {
          "raster-opacity": opacity / 100,
          "raster-saturation": saturation / 100
        }
      }
    ]
  };
}

type ListingFeatureProperties = {
  id: string;
  marketSignal: MarketSignal;
  selected: boolean;
  cheapest: boolean;
  approximate: boolean;
};

function hasValidBergenCoordinates(listing: RankedListing) {
  return (
    listing.latitude != null &&
    listing.longitude != null &&
    listing.latitude >= 60.2 &&
    listing.latitude <= 60.55 &&
    listing.longitude >= 5.1 &&
    listing.longitude <= 5.6
  );
}

function listingsToFeatureCollection(
  listings: RankedListing[],
  selectedId: string | null,
  cheapestTotalId: string | null
): FeatureCollection<Point, ListingFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: listings.filter(hasValidBergenCoordinates).map((listing) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [listing.longitude as number, listing.latitude as number]
      },
      properties: {
        id: listing.id,
        marketSignal: listing.marketSignal ?? "unknown",
        selected: selectedId === listing.id,
        cheapest: listing.id === cheapestTotalId,
        approximate: listing.locationAccuracy === "approximate_area"
      }
    }))
  };
}

function addListingLayers(map: MapLibreMap) {
  if (map.getSource(LISTINGS_SOURCE_ID)) return;

  map.addSource(LISTINGS_SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  const sigCol = [
    "match",
    ["get", "marketSignal"],
    "under_market",
    TEAL,
    "above_market",
    ERROR_COLOR,
    MUTED
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;

  map.addLayer({
    id: "pin-glow",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": sigCol,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        ["case", ["get", "selected"], 20, 14],
        15,
        ["case", ["get", "selected"], 46, 32]
      ],
      "circle-opacity": ["case", ["get", "selected"], 0.22, 0.13],
      "circle-blur": 0.7
    }
  });

  map.addLayer({
    id: "pin-cheapest",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    filter: ["==", ["get", "cheapest"], true],
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 13, 15, 22],
      "circle-stroke-color": TEAL,
      "circle-stroke-opacity": 0.85,
      "circle-stroke-width": 2
    }
  });

  map.addLayer({
    id: "pin-sel-ring",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    filter: ["==", ["get", "selected"], true],
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 17, 15, 28],
      "circle-stroke-color": ACCENT,
      "circle-stroke-opacity": 1,
      "circle-stroke-width": 3.5
    }
  });

  map.addLayer({
    id: "pin-core",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": sigCol,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        ["case", ["get", "selected"], 8, 5.5],
        15,
        ["case", ["get", "selected"], 13, 9]
      ],
      "circle-stroke-color": "#fff",
      "circle-stroke-width": ["case", ["get", "selected"], 2.5, 2],
      "circle-stroke-opacity": 1
    }
  });

  map.addLayer({
    id: "pin-approx-label",
    type: "symbol",
    source: LISTINGS_SOURCE_ID,
    filter: ["==", ["get", "approximate"], true],
    layout: {
      "text-field": "~",
      "text-size": 12,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-offset": [0.9, 0.7]
    },
    paint: {
      "text-color": "#475569",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1.5
    }
  });

  map.addLayer({
    id: "pin-hit",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 18, 15, 26]
    }
  });
}

export function MapView({
  listings,
  selectedId,
  cheapestTotalId,
  onSelect
}: {
  listings: RankedListing[];
  selectedId: string | null;
  cheapestTotalId: string | null;
  onSelect: (listing: RankedListing) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const listingsByIdRef = useRef(new globalThis.Map<string, RankedListing>());
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(false);

  onSelectRef.current = onSelect;

  const features = useMemo(
    () => listingsToFeatureCollection(listings, selectedId, cheapestTotalId),
    [listings, selectedId, cheapestTotalId]
  );

  useEffect(() => {
    listingsByIdRef.current = new globalThis.Map(listings.map((l) => [l.id, l]));
  }, [listings]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(),
      center: BERGEN_CENTER,
      zoom: 11.6,
      minZoom: 9,
      maxZoom: 17,
      pitch: 35,
      bearing: -35,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

    const handleLoad = () => {
      addListingLayers(map);
      setMapReady(true);
    };

    const handleClick = (event: maplibregl.MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      const listingId = typeof feature?.properties?.id === "string" ? feature.properties.id : null;
      if (!listingId) return;
      const listing = listingsByIdRef.current.get(listingId);
      if (!listing) return;
      onSelectRef.current(listing);
    };

    const showPointer = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const hidePointer = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("load", handleLoad);
    map.on("click", "pin-hit", handleClick);
    map.on("mouseenter", "pin-hit", showPointer);
    map.on("mouseleave", "pin-hit", hidePointer);

    mapRef.current = map;

    return () => {
      map.off("load", handleLoad);
      map.off("click", "pin-hit", handleClick);
      map.off("mouseenter", "pin-hit", showPointer);
      map.off("mouseleave", "pin-hit", hidePointer);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    const source = map.getSource(LISTINGS_SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) return;
    source.setData(features);
  }, [features, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedId) return;
    const selected = listingsByIdRef.current.get(selectedId);
    if (!selected || selected.latitude == null || selected.longitude == null) return;
    map.easeTo({
      center: [selected.longitude, selected.latitude],
      zoom: Math.max(map.getZoom(), 12.5),
      duration: 480
    });
  }, [mapReady, selectedId]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 10,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(221,231,239,0.8)",
          borderRadius: 12,
          padding: "8px 10px",
          fontSize: 10,
          color: "#475569",
          boxShadow: "0 2px 8px rgba(16,32,51,0.08)"
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: 5
          }}
        >
          {NO.marketPriceSignal}
        </div>
        {(
          [
            [TEAL, NO.belowMarket],
            [MUTED, NO.aroundMarket],
            [ERROR_COLOR, NO.aboveMarket]
          ] as Array<[string, string]>
        ).map(([col, lbl]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: col,
                flexShrink: 0,
                display: "block"
              }}
            />
            {lbl}
          </div>
        ))}
      </div>
    </div>
  );
}
