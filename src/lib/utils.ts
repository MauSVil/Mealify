import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Business } from "./types/Zod/Business";
import { NextRequest } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const findNearbyRestaurants = (userLat: number, userLon: number, restaurants: Business[], maxDistanceKm: number): Business[] => {
  return restaurants.filter(restaurant => {
    const distance = haversineDistance(userLat, userLon, restaurant.latitude, restaurant.longitude);
    return distance <= maxDistanceKm;
  });
}

export const validateIfToken = async (req: NextRequest, cookieKey: string) => {
  const token = req.cookies.get(cookieKey)?.value;
  if (!token) {
    throw new Error('Token no encontrado');
  }
  return token;
}

export const validateIfBusiness = async (req: NextRequest) => {
  const business = req.cookies.get('business')?.value;
  if (!business) {
    throw new Error('Business not found');
  }
  return business;
}