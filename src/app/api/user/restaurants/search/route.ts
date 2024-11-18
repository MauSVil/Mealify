import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { findNearbyRestaurants } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { latitude, longitude, selectedCategory } = await req.json();
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const businesses = await BusinessRepository.find({ category: selectedCategory });
    const nearbyRestaurants = findNearbyRestaurants(latitude, longitude, businesses, 5);
    return NextResponse.json({ data: nearbyRestaurants });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchRestaurantsUserAdmin]' }, { status: 400 });
  }
}