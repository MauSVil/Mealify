import { AddressRepository } from "@/lib/Repositories/Address.repository";
import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { findNearbyRestaurants } from "@/lib/utils";
import _ from "lodash";
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

    const businessesForYou = await BusinessRepository.find({
      ...(selectedCategory ? { category: selectedCategory } : {}),
      premium: false,
    });
    const nearbyRestaurants = findNearbyRestaurants(latitude, longitude, businessesForYou, 5);

    const recommendedBusinesses = await BusinessRepository.find({
      ...(selectedCategory ? { category: selectedCategory } : {}),
      premium: true,
    });

    const nearbyRecommendedRestaurants = findNearbyRestaurants(latitude, longitude, recommendedBusinesses, 5);

    const businessesByCategory = _.groupBy(nearbyRestaurants, 'category');

    const restaurantsToSend = {
      nearbyRestaurants: nearbyRestaurants,
      nearbyRecommendedRestaurants: nearbyRecommendedRestaurants,
      ...businessesByCategory,
    }

    return NextResponse.json({ data: restaurantsToSend });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchRestaurantsUserAdmin]' }, { status: 400 });
  }
}