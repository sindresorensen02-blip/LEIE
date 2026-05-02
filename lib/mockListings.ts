import { estimatedMonthlyPrice } from "./price";
import type { NormalizedListing, PropertyType, RentalSource } from "./types";

type ListingSeed = {
  id: string;
  source: RentalSource;
  title: string;
  area: string;
  propertyType: PropertyType;
  monthly?: number;
  nightly?: number;
  deposit?: number;
  lat: number;
  lng: number;
  bedrooms: number | null;
  size: number | null;
  availableFrom: string;
  address: string;
};

const seeds: ListingSeed[] = [
  { id: "mock-001", source: "hybel", title: "Affordable room near Danmarksplass", area: "Danmarksplass", propertyType: "room", monthly: 5500, deposit: 11000, lat: 60.3731, lng: 5.3382, bedrooms: 1, size: 12, availableFrom: "2026-05-01", address: "Fjøsangerveien 32" },
  { id: "mock-002", source: "finn", title: "Studio near Nygård", area: "Nygård", propertyType: "studio", monthly: 8900, deposit: 17800, lat: 60.3868, lng: 5.3269, bedrooms: 0, size: 25, availableFrom: "2026-06-01", address: "Nygårdsgaten 41" },
  { id: "mock-003", source: "finn", title: "Central apartment near Bryggen", area: "Bryggen", propertyType: "apartment", monthly: 14900, deposit: 29800, lat: 60.3974, lng: 5.3248, bedrooms: 1, size: 45, availableFrom: "2026-05-15", address: "Bryggen 9" },
  { id: "mock-004", source: "hybel", title: "Room in shared apartment at Møhlenpris", area: "Møhlenpris", propertyType: "room", monthly: 6500, deposit: 13000, lat: 60.3825, lng: 5.3207, bedrooms: 1, size: 14, availableFrom: "2026-05-01", address: "Thormøhlens gate 18" },
  { id: "mock-005", source: "utleiemegleren", title: "2-bedroom apartment in Sandviken", area: "Sandviken", propertyType: "apartment", monthly: 18200, deposit: 54600, lat: 60.4151, lng: 5.3262, bedrooms: 2, size: 67, availableFrom: "2026-07-01", address: "Sandviksveien 88" },
  { id: "mock-006", source: "heimstaden", title: "Bright 1-bedroom in Årstad", area: "Årstad", propertyType: "apartment", monthly: 12800, deposit: 25600, lat: 60.3744, lng: 5.3465, bedrooms: 1, size: 42, availableFrom: "2026-05-10", address: "Ibsens gate 54" },
  { id: "mock-007", source: "airbnb", title: "Short-term studio by Bergenhus", area: "Bergenhus", propertyType: "studio", nightly: 990, lat: 60.401, lng: 5.3184, bedrooms: 0, size: 28, availableFrom: "2026-05-02", address: "Øvregaten 16" },
  { id: "mock-008", source: "finn", title: "Family house in Fana", area: "Fana", propertyType: "house", monthly: 28000, deposit: 84000, lat: 60.2967, lng: 5.3545, bedrooms: 4, size: 142, availableFrom: "2026-08-01", address: "Fanavegen 212" },
  { id: "mock-009", source: "hybel", title: "Shared room close to Kronstad light rail", area: "Kronstad", propertyType: "shared_room", monthly: 5900, deposit: 11800, lat: 60.374, lng: 5.349, bedrooms: 1, size: 10, availableFrom: "2026-05-01", address: "Inndalsveien 63" },
  { id: "mock-010", source: "finn", title: "Compact apartment in Nordnes", area: "Nordnes", propertyType: "apartment", monthly: 11900, deposit: 23800, lat: 60.397, lng: 5.3065, bedrooms: 1, size: 34, availableFrom: "2026-06-15", address: "Nordnesveien 31" },
  { id: "mock-011", source: "heimstaden", title: "Modern studio in Solheimsviken", area: "Solheimsviken", propertyType: "studio", monthly: 9600, deposit: 19200, lat: 60.3774, lng: 5.3327, bedrooms: 0, size: 29, availableFrom: "2026-05-20", address: "Damsgårdsveien 73" },
  { id: "mock-012", source: "utleiemegleren", title: "Large apartment at Paradis", area: "Paradis", propertyType: "apartment", monthly: 20500, deposit: 61500, lat: 60.337, lng: 5.3495, bedrooms: 3, size: 92, availableFrom: "2026-07-15", address: "Statsminister Michelsens veg 49" },
  { id: "mock-013", source: "hybel", title: "Student room in Sentrum", area: "Sentrum", propertyType: "room", monthly: 6200, deposit: 12400, lat: 60.3929, lng: 5.3242, bedrooms: 1, size: 13, availableFrom: "2026-05-01", address: "Vaskerelven 12" },
  { id: "mock-014", source: "finn", title: "Renovated apartment in Landås", area: "Landås", propertyType: "apartment", monthly: 13700, deposit: 27400, lat: 60.3651, lng: 5.3637, bedrooms: 2, size: 58, availableFrom: "2026-06-01", address: "Nattlandsveien 76" },
  { id: "mock-015", source: "airbnb", title: "Harbor-view short stay at Nordnes", area: "Nordnes", propertyType: "apartment", nightly: 1250, lat: 60.3973, lng: 5.3062, bedrooms: 1, size: 38, availableFrom: "2026-05-02", address: "C. Sundts gate 57" },
  { id: "mock-016", source: "finn", title: "2-bedroom in Fyllingsdalen", area: "Fyllingsdalen", propertyType: "apartment", monthly: 13200, deposit: 26400, lat: 60.3516, lng: 5.2852, bedrooms: 2, size: 64, availableFrom: "2026-06-20", address: "Folke Bernadottes vei 41" },
  { id: "mock-017", source: "heimstaden", title: "Affordable studio in Laksevåg", area: "Laksevåg", propertyType: "studio", monthly: 8200, deposit: 16400, lat: 60.3885, lng: 5.284, bedrooms: 0, size: 24, availableFrom: "2026-05-05", address: "Kringsjåveien 83" },
  { id: "mock-018", source: "hybel", title: "Quiet room in Eidsvåg", area: "Eidsvåg", propertyType: "room", monthly: 6100, deposit: 12200, lat: 60.4436, lng: 5.3078, bedrooms: 1, size: 15, availableFrom: "2026-05-01", address: "Eidsvågveien 150" },
  { id: "mock-019", source: "finn", title: "Townhouse for rent in Nesttun", area: "Nesttun", propertyType: "house", monthly: 23800, deposit: 71400, lat: 60.317, lng: 5.3548, bedrooms: 4, size: 126, availableFrom: "2026-08-15", address: "Nesttunvegen 98" },
  { id: "mock-020", source: "utleiemegleren", title: "Premium apartment near Sentrum", area: "Sentrum", propertyType: "apartment", monthly: 17400, deposit: 52200, lat: 60.3917, lng: 5.326, bedrooms: 2, size: 61, availableFrom: "2026-06-01", address: "Marken 21" },
  { id: "mock-021", source: "hybel", title: "Shared room by Nygård Park", area: "Nygård", propertyType: "shared_room", monthly: 5800, deposit: 11600, lat: 60.3851, lng: 5.3239, bedrooms: 1, size: 11, availableFrom: "2026-05-08", address: "Parkveien 3" },
  { id: "mock-022", source: "finn", title: "Top-floor studio in Bergenhus", area: "Bergenhus", propertyType: "studio", monthly: 10400, deposit: 20800, lat: 60.402, lng: 5.3192, bedrooms: 0, size: 31, availableFrom: "2026-06-10", address: "Skuteviksveien 24" },
  { id: "mock-023", source: "heimstaden", title: "3-bedroom apartment in Åsane", area: "Åsane", propertyType: "apartment", monthly: 15900, deposit: 31800, lat: 60.464, lng: 5.326, bedrooms: 3, size: 82, availableFrom: "2026-07-01", address: "Åsamyrane 90" },
  { id: "mock-024", source: "airbnb", title: "Fjord cabin-style house near Fana", area: "Fana", propertyType: "house", nightly: 1700, lat: 60.2972, lng: 5.3553, bedrooms: 3, size: 96, availableFrom: "2026-05-02", address: "Krokeidevegen 22" },
  { id: "mock-025", source: "finn", title: "Small apartment in Møhlenpris", area: "Møhlenpris", propertyType: "apartment", monthly: 11200, deposit: 22400, lat: 60.3822, lng: 5.3201, bedrooms: 1, size: 36, availableFrom: "2026-06-01", address: "Wolffs gate 7" },
  { id: "mock-026", source: "hybel", title: "Room in Landås collective", area: "Landås", propertyType: "room", monthly: 5700, deposit: 11400, lat: 60.3652, lng: 5.3631, bedrooms: 1, size: 12, availableFrom: "2026-05-01", address: "Landåssvingen 18" },
  { id: "mock-027", source: "utleiemegleren", title: "Waterfront apartment in Solheimsviken", area: "Solheimsviken", propertyType: "apartment", monthly: 16600, deposit: 49800, lat: 60.3771, lng: 5.3321, bedrooms: 2, size: 59, availableFrom: "2026-07-01", address: "Marineholmen 6" },
  { id: "mock-028", source: "finn", title: "House with garden in Laksevåg", area: "Laksevåg", propertyType: "house", monthly: 21400, deposit: 64200, lat: 60.3882, lng: 5.2837, bedrooms: 3, size: 118, availableFrom: "2026-08-01", address: "Damsgårdslien 45" },
  { id: "mock-029", source: "heimstaden", title: "Studio beside Danmarksplass", area: "Danmarksplass", propertyType: "studio", monthly: 9300, deposit: 18600, lat: 60.3728, lng: 5.3387, bedrooms: 0, size: 27, availableFrom: "2026-05-15", address: "Kanalveien 4" },
  { id: "mock-030", source: "hybel", title: "Budget room in Loddefjord", area: "Loddefjord", propertyType: "room", monthly: 5600, deposit: 11200, lat: 60.3632, lng: 5.2326, bedrooms: 1, size: 14, availableFrom: "2026-05-01", address: "Loddefjordveien 2" },
  { id: "mock-031", source: "finn", title: "Spacious apartment in Kronstad", area: "Kronstad", propertyType: "apartment", monthly: 14500, deposit: 29000, lat: 60.3737, lng: 5.3495, bedrooms: 2, size: 68, availableFrom: "2026-06-15", address: "Kronstadveien 19" },
  { id: "mock-032", source: "airbnb", title: "Short-term studio near Bryggen", area: "Bryggen", propertyType: "studio", nightly: 1150, lat: 60.3976, lng: 5.3244, bedrooms: 0, size: 26, availableFrom: "2026-05-02", address: "Nikolaikirkeallmenningen 3" },
  { id: "mock-033", source: "utleiemegleren", title: "Modern 2-bedroom in Årstad", area: "Årstad", propertyType: "apartment", monthly: 15100, deposit: 45300, lat: 60.374, lng: 5.346, bedrooms: 2, size: 62, availableFrom: "2026-06-05", address: "Minde allé 12" },
  { id: "mock-034", source: "finn", title: "Nesttun studio close to light rail", area: "Nesttun", propertyType: "studio", monthly: 9700, deposit: 19400, lat: 60.3172, lng: 5.355, bedrooms: 0, size: 30, availableFrom: "2026-05-20", address: "Østre Nesttunvegen 8" },
  { id: "mock-035", source: "hybel", title: "Room near Sandviken sea front", area: "Sandviken", propertyType: "room", monthly: 6900, deposit: 13800, lat: 60.4159, lng: 5.325, bedrooms: 1, size: 16, availableFrom: "2026-06-01", address: "Måseskjæret 4" },
  { id: "mock-036", source: "heimstaden", title: "Paradis apartment with balcony", area: "Paradis", propertyType: "apartment", monthly: 16900, deposit: 33800, lat: 60.3374, lng: 5.3501, bedrooms: 2, size: 70, availableFrom: "2026-07-10", address: "Jacob Kjødes veg 9" },
  { id: "mock-037", source: "finn", title: "Eidsvåg basement studio", area: "Eidsvåg", propertyType: "studio", monthly: 7800, deposit: 15600, lat: 60.4433, lng: 5.3075, bedrooms: 0, size: 23, availableFrom: "2026-05-01", address: "Jordalsveien 47" },
  { id: "mock-038", source: "hybel", title: "Shared room in Fyllingsdalen collective", area: "Fyllingsdalen", propertyType: "shared_room", monthly: 6000, deposit: 12000, lat: 60.3519, lng: 5.2858, bedrooms: 1, size: 11, availableFrom: "2026-05-15", address: "Løvåsveien 27" },
  { id: "mock-039", source: "utleiemegleren", title: "Elegant apartment at Nygård", area: "Nygård", propertyType: "apartment", monthly: 15800, deposit: 47400, lat: 60.3869, lng: 5.3262, bedrooms: 2, size: 55, availableFrom: "2026-06-20", address: "Nygårdsgaten 72" },
  { id: "mock-040", source: "finn", title: "Central room beside Bergen station", area: "Sentrum", propertyType: "room", monthly: 7200, deposit: 14400, lat: 60.3904, lng: 5.3331, bedrooms: 1, size: 15, availableFrom: "2026-05-01", address: "Strømgaten 8" },
  { id: "mock-041", source: "heimstaden", title: "Åsane family apartment", area: "Åsane", propertyType: "apartment", monthly: 14700, deposit: 29400, lat: 60.4634, lng: 5.3272, bedrooms: 3, size: 76, availableFrom: "2026-08-01", address: "Myrdalsvegen 22" },
  { id: "mock-042", source: "airbnb", title: "Short-term room in Bergenhus", area: "Bergenhus", propertyType: "room", nightly: 720, lat: 60.4012, lng: 5.3189, bedrooms: 1, size: 18, availableFrom: "2026-05-02", address: "Stølegaten 5" }
];

const imageFor = (seed: ListingSeed) =>
  `https://images.unsplash.com/photo-1560185${seed.id.slice(-3)}?auto=format&fit=crop&w=900&q=80`;

export const mockListings: NormalizedListing[] = seeds.map((seed, index) => {
  const listing = {
    id: seed.id,
    externalId: `${seed.source}-bergen-${seed.id}`,
    source: seed.source,
    title: seed.title,
    listingUrl: `https://example.com/leie/${seed.source}/${seed.id}`,
    priceMonthlyNok: seed.monthly ?? null,
    priceNightlyNok: seed.nightly ?? null,
    estimatedMonthlyNok: null,
    depositNok: seed.deposit ?? null,
    propertyType: seed.propertyType,
    address: seed.address,
    area: seed.area,
    latitude: seed.lat,
    longitude: seed.lng,
    locationAccuracy: "exact",
    bedrooms: seed.bedrooms,
    sizeM2: seed.size,
    availableFrom: seed.availableFrom,
    images: [imageFor(seed)],
    description: `${seed.title} with quick access to Bergen transit, local shops, and everyday services. Mock listing for the Leie MVP.`,
    scrapedAt: new Date(Date.UTC(2026, 4, 2, 10, index)).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 4, 2, 12, index)).toISOString()
  } satisfies NormalizedListing;

  return {
    ...listing,
    estimatedMonthlyNok: estimatedMonthlyPrice(listing)
  };
});
