"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { MarketSignal, RankedListing } from "@/lib/types";

const BERGEN_CENTER: [number, number] = [5.32415, 60.39299];
const LISTINGS_SOURCE_ID = "leie-listings";

const leieMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    cartoVoyager: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
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
        "background-color": "#102536"
      }
    },
    {
      id: "carto-voyager-readable",
      type: "raster",
      source: "cartoVoyager",
      paint: {
        "raster-opacity": 0.78,
        "raster-saturation": -0.42,
        "raster-contrast": 0.08,
        "raster-brightness-min": 0.12,
        "raster-brightness-max": 0.86
      }
    }
  ]
};

const signalColors: Record<MarketSignal, string> = {
  under_market: "#34D399",
  market_price: "#FACC15",
  above_market: "#F87171",
  unknown: "#5BE3F2"
};

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
      "circle-opacity": ["case", ["get", "selected"], 0.34, 0.22],
      "circle-blur": 0.78
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
      "circle-stroke-color": "#E8F1FF",
      "circle-stroke-opacity": 0.86,
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
      "circle-stroke-color": "#5BE3F2",
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
      "circle-stroke-color": "#E8F1FF",
      "circle-stroke-opacity": 0.92,
      "circle-stroke-width": ["case", ["get", "selected"], 3, 1.6]
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
      "text-color": "#E8F1FF",
      "text-halo-color": "#04101A",
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
    <section className="relative min-h-screen overflow-hidden bg-[#102536]">
      <div ref={mapContainerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(6,24,34,0.06)_42%,rgba(4,13,22,0.36)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#07131d]/58 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#07131d]/62 to-transparent" />

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
