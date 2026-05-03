import { LeieApp } from "@/components/LeieApp";
import { listListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  // Listings are filtered + ranked client-side in LeieApp so badges
  // ("Cheapest", "Good value", area-median market signal) reflect the
  // current view rather than the unfiltered global set.
  return <LeieApp initialListings={listListings()} />;
}
