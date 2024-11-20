import { AddressRepository } from "@/lib/Repositories/Address.repository";
import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { findNearbyRestaurants } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { address, selectedCategory } = await req.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const addressFound = await AddressRepository.findOne({ id: address });
    if (!addressFound) throw new Error('Address not found');
    const { latitude, longitude } = addressFound;

    const filterFind = {
      ...(selectedCategory ? { category: selectedCategory } : {}),
    }

    const businesses = await BusinessRepository.find(filterFind);

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