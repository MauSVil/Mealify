import ky from "ky";
import { NextRequest, NextResponse } from "next/server";

interface GoogleMapsDirectionsResponse {
  status: string;
  routes: Array<{
    legs: Array<{
      distance: {
        text: string; // e.g., "5.3 km"
        value: number; // e.g., 5300 (in meters)
      };
      duration: {
        text: string; // e.g., "15 mins"
        value: number; // e.g., 900 (in seconds)
      };
      start_address: string;
      end_address: string;
      start_location: {
        lat: number;
        lng: number;
      };
      end_location: {
        lat: number;
        lng: number;
      };
      steps: Array<{
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
        end_location: {
          lat: number;
          lng: number;
        };
        start_location: {
          lat: number;
          lng: number;
        };
        html_instructions: string;
        travel_mode: string;
      }>;
    }>;
  }>;
  geocoded_waypoints: Array<{
    geocoder_status: string;
    place_id: string;
    types: string[];
  }>;
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { user, restaurant } = body;
    if (!user || !restaurant) {
      return NextResponse.json({ error: 'User and restaurant are required' }, { status: 400 });
    }

    const { longitude, latitude } = restaurant;
    const { longitude: userLongitude, latitude: userLatitude } = user;

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
    const directionsParams = {
      origin: `${latitude},${longitude}`,
      destination: `${userLatitude},${userLongitude}`,
      key: process.env.MAPS_KEY!,
      mode: 'driving',
    };

    const response: GoogleMapsDirectionsResponse = await ky.get(directionsUrl, { searchParams: directionsParams }).json();

    if (response.status === 'OK') {
      const route = response.routes[0].legs[0];
      const distanceInMeters = route.distance.value;
      const durationInSeconds = route.duration.value;

      const distanceInKm = distanceInMeters / 1000;
      const costPerKm = 5;
      const shippingCost = distanceInKm * costPerKm;

      return NextResponse.json({
        durationInSeconds,
        distance: route.distance.text,
        duration: route.duration.text,
        shippingCost: shippingCost.toFixed(2),
      });
    } else {
      return NextResponse.json({ error: 'No route found' }, { status: 404 });
    }

  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
};