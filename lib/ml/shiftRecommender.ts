export function recommendModeratorCoverage(appealVolume: number) {
  const baseSlope = 0.25; // hours per appeal
  const baseIntercept = 2; // minimum hours
  const hours = Math.ceil(baseSlope * appealVolume + baseIntercept);
  const modsNeeded = Math.ceil(hours / 4); // 4-hour shifts
  return { recommendedHours: hours, recommendedMods: modsNeeded };
}
