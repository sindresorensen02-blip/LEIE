"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { MarketSignal, RankedListing } from "@/lib/types";
import { marketSignalColors, palette } from "@/lib/theme";

const BERGEN_CENTER: [number, number] = [5.32415, 60.39299];
const LISTINGS_SOURCE_ID = "leie-listings";

const leieMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    cartoPositron: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
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
        "background-color": palette.snow
      }
    },
    {
      id: "carto-positron",
      type: "raster",
      source: "cartoPositron",
      paint: {
        "raster-opacity": 0.95,
        "raster-saturation": -0.05
      }
    }
  ]
};

const signalColors: Record<MarketSignal, string> = marketSignalColors;

type ListingFeatureProperties = {
  id: string;
  title: string;
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
  selectedId: string | null
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
        title: listing.title,
        marketSignal: listing.marketSignal ?? "unknown",
        selected: selectedId === listing.id,
        cheapest: listing.badges.includes("Cheapest"),
        approximate: listing.locationAccuracy === "approximate_area"
      }
    }))
  };
}

function addListingLayers(map: MapLibreMap) {
  if (map.getSource(LISTINGS_SOURCE_ID)) return;

  map.addSource(LISTINGS_SOURCE_ID, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    id: "listing-glow",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": [
        "match",
        ["get", "marketSignal"],
        "under_market",
        signalColors.under_market,
        "market_price",
        signalColors.market_price,
        "above_market",
        signalColors.above_market,
        signalColors.unknown
      ],
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        ["case", ["get", "selected"], 18, 13],
        15,
        ["case", ["get", "selected"], 42, 30]
      ],
      "circle-opacity": ["case", ["get", "selected"], 0.22, 0.14],
      "circle-blur": 0.7
    }
  });

  map.addLayer({
    id: "listing-cheapest-ring",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    filter: ["==", ["get", "cheapest"], true],
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 12, 15, 20],
      "circle-stroke-color": palette.brand.teal,
      "circle-stroke-opacity": 0.85,
      "circle-stroke-width": 2
    }
  });

  map.addLayer({
    id: "listing-selected-ring",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    filter: ["==", ["get", "selected"], true],
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 16, 15, 26],
      "circle-stroke-color": palette.brand.blue,
      "circle-stroke-opacity": 1,
      "circle-stroke-width": 4
    }
  });

  map.addLayer({
    id: "listing-core",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": [
        "match",
        ["get", "marketSignal"],
        "under_market",
        signalColors.under_market,
        "market_price",
        signalColors.market_price,
        "above_market",
        signalColors.above_market,
        signalColors.unknown
      ],
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, ["case", ["get", "selected"], 8, 6], 15, ["case", ["get", "selected"], 13, 9]],
      "circle-stroke-color": palette.white,
      "circle-stroke-opacity": 1,
      "circle-stroke-width": ["case", ["get", "selected"], 3, 2]
    }
  });

  map.addLayer({
    id: "listing-approx-label",
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
      "text-color": palette.navy,
      "text-halo-color": palette.white,
      "text-halo-width": 1.5
    }
  });

  map.addLayer({
    id: "listing-hit-area",
    type: "circle",
    source: LISTINGS_SOURCE_ID,
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 18, 15, 24]
    }
  });
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
  const mapRef = useRef<MapLibreMap | null>(null);
  const listingsByIdRef = useRef(new globalThis.Map<string, RankedListing>());
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(false);

  const listingFeatures = useMemo(
    () => listingsToFeatureCollection(listings, selectedId),
    [listings, selectedId]
  );

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    listingsByIdRef.current = new globalThis.Map(listings.map((listing) => [listing.id, listing]));
  }, [listings]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: leieMapStyle,
      center: BERGEN_CENTER,
      zoom: 11.45,
      minZoom: 9.4,
      maxZoom: 17,
      pitch: 34,
      bearing: -10,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    const handleLoad = () => {
      addListingLayers(map);
      setMapReady(true);
    };

    const handleClick = (event: maplibregl.MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      const listingId = typeof feature?.properties?.id === "string" ? feature.properties.id : null;
      if (!listingId) return;

      const listing = listingsByIdRef.current.get(listingId);
      if (!listing || listing.latitude == null || listing.longitude == null) return;

      onSelectRef.current(listing);
      map.easeTo({
        center: [listing.longitude, listing.latitude],
        zoom: Math.max(map.getZoom(), 13.3),
        duration: 650
      });
    };

    const showPointer = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const hidePointer = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("load", handleLoad);
    map.on("click", "listing-hit-area", handleClick);
    map.on("mouseenter", "listing-hit-area", showPointer);
    map.on("mouseleave", "listing-hit-area", hidePointer);

    mapRef.current = map;

    return () => {
      map.off("load", handleLoad);
      map.off("click", "listing-hit-area", handleClick);
      map.off("mouseenter", "listing-hit-area", showPointer);
      map.off("mouseleave", "listing-hit-area", hidePointer);
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
    source.setData(listingFeatures);
  }, [listingFeatures, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = listings.find((listing) => listing.id === selectedId);
    if (!map || !mapReady || !selected || selected.latitude == null || selected.longitude == null) return;

    map.easeTo({
      center: [selected.longitude, selected.latitude],
      zoom: Math.max(map.getZoom(), 12.7),
      duration: 500
    });
  }, [listings, mapReady, selectedId]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-snow">
      <div ref={mapContainerRef} className="absolute inset-0" />

      <div className="surface-translucent pointer-events-auto absolute bottom-24 left-4 max-w-[260px] p-3 text-xs text-navy/85 md:bottom-5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Market price signal
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-teal" />
            Below market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            Around market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-error" />
            Above market
          </div>
          <div className="flex items-center gap-2 text-muted">
            <span className="grid h-4 w-4 place-items-center rounded-full border border-ice text-[10px] text-navy">
              ~
            </span>
            Approximate area
          </div>
        </div>
      </div>
    </section>
  );
}
