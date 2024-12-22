const FLOOR_HEIGHT = 3; // Assuming each floor is 3 meters tall

export function estimateFloor(altitude: number | null, groundLevel: number): number {
  if (altitude === null) return 0;
  
  const relativeAltitude = altitude - groundLevel;
  return Math.max(0, Math.floor(relativeAltitude / FLOOR_HEIGHT));
}

