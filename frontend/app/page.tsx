import HomeClient from "./HomeClient";
import { getListings } from "@/lib/getListings";


export default async function Home() {
  const listings = await getListings() ?? []
  return (
    <HomeClient listings={listings} />
  )
}