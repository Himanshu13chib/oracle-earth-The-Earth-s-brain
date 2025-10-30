import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert latitude/longitude to 3D coordinates on a sphere
export function latLngToVector3(lat: number, lng: number, radius: number = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
}

// Get color based on risk level (number or string)
export function getRiskColor(risk: number | string) {
  if (typeof risk === 'string') {
    switch (risk.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
  
  // For numeric probability
  if (risk > 70) return '#ff4444'; // Red
  if (risk > 40) return '#ffaa44'; // Orange
  return '#44ff44'; // Green
}

// Get environment type color
export function getEnvironmentColor(type: string) {
  switch (type) {
    case 'deforestation': return '#8B4513'; // Brown
    case 'co2': return '#666666'; // Gray
    case 'glacier': return '#87CEEB'; // Light blue
    case 'temperature': return '#FF6347'; // Tomato
    default: return '#00ff00'; // Green
  }
}

// Format coordinates string to array
export function parseCoordinates(coordinates: string): [number, number] {
  const coords = coordinates.split(',').map(Number);
  return coords.length === 2 ? [coords[0], coords[1]] : [0, 0];
}

// Country list for dropdowns
export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil',
  'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba',
  'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France',
  'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg',
  'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria',
  'North Korea', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore',
  'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Venezuela',
  'Vietnam', 'Yemen'
];

// Regions list for environmental data
export const regions = [
  'Amazon Basin', 'Arctic', 'Antarctic', 'Sahara Desert', 'Himalayan Region',
  'Great Barrier Reef', 'Congo Basin', 'Siberian Tundra', 'Greenland Ice Sheet',
  'Mediterranean Basin', 'Coral Triangle', 'Boreal Forest', 'Global', 'Pacific Ocean',
  'Atlantic Ocean', 'Indian Ocean', 'North America', 'South America', 'Europe',
  'Asia', 'Africa', 'Australia', 'Middle East'
];

// Alias for getRiskColor to match existing usage
export const getProbabilityColor = getRiskColor;