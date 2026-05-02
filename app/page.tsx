import { LeieApp } from "@/components/LeieApp";
import { listListings } from "@/lib/db";
import { rankListings } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export default function Home() {
  const listings = rankListings(listListings());
  return <LeieApp initialListings={listings} />;
}
