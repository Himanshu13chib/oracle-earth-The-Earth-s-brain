import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getProbabilityColor(probability: number): string {
  if (probability < 20) return 'text-green-600';
  if (probability < 40) return 'text-yellow-600';
  if (probability < 70) return 'text-orange-600';
  return 'text-red-600';
}

export const countries = [
  'United States', 'China', 'Russia', 'India', 'United Kingdom', 'France', 'Germany',
  'Japan', 'South Korea', 'Brazil', 'Canada', 'Australia', 'Italy', 'Spain',
  'Mexico', 'Indonesia', 'Turkey', 'Saudi Arabia', 'Iran', 'Israel', 'Egypt',
  'South Africa', 'Nigeria', 'Ukraine', 'Poland', 'Netherlands', 'Belgium',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Greece',
  'Portugal', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
  'Serbia', 'Bosnia', 'Albania', 'North Macedonia', 'Montenegro', 'Slovenia',
  'Slovakia', 'Lithuania', 'Latvia', 'Estonia', 'Belarus', 'Moldova', 'Georgia',
  'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan',
  'Tajikistan', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'Bhutan', 'Myanmar', 'Thailand', 'Vietnam', 'Cambodia', 'Laos', 'Malaysia',
  'Singapore', 'Philippines', 'Brunei', 'Mongolia', 'North Korea', 'Taiwan'
];

export const regions = [
  'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania',
  'Middle East', 'Central Asia', 'Southeast Asia', 'Eastern Europe', 'Western Europe',
  'Northern Africa', 'Sub-Saharan Africa', 'Caribbean', 'Central America'
];