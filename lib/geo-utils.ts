// Geo utility functions for property analysis

export interface GeoJSONPolygon {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface Point {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate text similarity between two addresses using word overlap
 * @returns Similarity score between 0 and 1
 */
export function calculateAddressSimilarity(addr1: string, addr2: string): number {
  if (!addr1 || !addr2) return 0;

  const words1 = addr1
    .toLowerCase()
    .replace(/[,]/g, "")
    .split(/\s+/);
  const words2 = addr2
    .toLowerCase()
    .replace(/[,]/g, "")
    .split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let matches = 0;
  set1.forEach((word) => {
    if (set2.has(word)) matches++;
  });

  return matches / Math.max(set1.size, set2.size);
}

/**
 * Calculate polygon area using the Shoelace formula
 * @returns Area in square meters
 */
export function calculatePolygonArea(geometry: GeoJSONPolygon): number {
  if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return 0;

  const coords =
    geometry.type === "Polygon"
      ? (geometry.coordinates[0] as number[][])
      : (geometry.coordinates[0][0] as number[][]);

  if (!coords || coords.length < 3) return 0;

  const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const latRad = (centerLat * Math.PI) / 180;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);
  const metersPerDegreeLat = 110540;

  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const x1 = coords[i][0] * metersPerDegreeLng;
    const y1 = coords[i][1] * metersPerDegreeLat;
    const x2 = coords[i + 1][0] * metersPerDegreeLng;
    const y2 = coords[i + 1][1] * metersPerDegreeLat;
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
}

/**
 * Sample points in a grid pattern from within a polygon
 * Used for elevation sampling
 */
export function samplePointsFromPolygon(
  geometry: GeoJSONPolygon,
  count: number
): Point[] {
  const coords =
    geometry.type === "Polygon"
      ? (geometry.coordinates[0] as number[][])
      : (geometry.coordinates[0][0] as number[][]);

  if (!coords || coords.length < 3) return [];

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const gridSize = Math.ceil(Math.sqrt(count));
  const points: Point[] = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lng = minLng + ((maxLng - minLng) * (i + 0.5)) / gridSize;
      const lat = minLat + ((maxLat - minLat) * (j + 0.5)) / gridSize;
      points.push({ lat, lng });
    }
  }

  return points.slice(0, count);
}

/**
 * Estimate the diagonal distance of a property boundary
 * Used for slope calculation
 */
export function estimatePropertyDiagonal(geometry: GeoJSONPolygon): number {
  const coords =
    geometry.type === "Polygon"
      ? (geometry.coordinates[0] as number[][])
      : (geometry.coordinates[0][0] as number[][]);

  if (!coords || coords.length < 3) return 50; // Default 50m

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const centerLat = (minLat + maxLat) / 2;
  const latRad = (centerLat * Math.PI) / 180;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);
  const metersPerDegreeLat = 110540;

  const width = (maxLng - minLng) * metersPerDegreeLng;
  const height = (maxLat - minLat) * metersPerDegreeLat;

  return Math.sqrt(width * width + height * height);
}

/**
 * Convert lat/lng to tile coordinates for LINZ aerial tiles
 */
export function latLngToTile(
  lat: number,
  lng: number,
  zoom: number
): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

/**
 * Calculate confidence score based on distance and text similarity
 * @param distanceMeters Distance between coordinates
 * @param textSimilarity Text similarity score (0-1)
 * @returns Confidence score (0-100)
 */
export function calculateConfidence(
  distanceMeters: number,
  textSimilarity: number
): number {
  // Distance score: 1.0 at 0m, 0 at 50m
  const distanceScore = Math.max(0, 1 - distanceMeters / 50);
  // Weighted average: 60% distance, 40% text
  return Math.round((distanceScore * 0.6 + textSimilarity * 0.4) * 100);
}

/**
 * Categorize slope percentage into human-readable category
 */
export function categorizeSslope(
  slopePercent: number
): "Flat" | "Gentle slope" | "Moderate slope" | "Steep" | "Very steep" {
  if (slopePercent < 5) return "Flat";
  if (slopePercent < 15) return "Gentle slope";
  if (slopePercent < 25) return "Moderate slope";
  if (slopePercent < 35) return "Steep";
  return "Very steep";
}
