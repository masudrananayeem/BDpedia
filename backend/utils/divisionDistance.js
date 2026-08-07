// Approximate road distances (km) between Bangladesh's 8 division
// headquarters. These are rough estimates (not live map data) used only to
// generate a reasonable transport-cost heuristic for the budget Guide
// feature. Admin can tune FARE_PER_KM / INTRA_DIVISION_FARE below, and each
// District document's own `budget` fields override the daily-cost side.
const KM = {
  Dhaka:      { Chattogram: 264, Khulna: 305, Rajshahi: 256, Barishal: 170, Sylhet: 247, Rangpur: 300, Mymensingh: 120 },
  Chattogram: { Dhaka: 264, Khulna: 460, Rajshahi: 480, Barishal: 320, Sylhet: 350, Rangpur: 520, Mymensingh: 350 },
  Khulna:     { Dhaka: 305, Chattogram: 460, Rajshahi: 270, Barishal: 165, Sylhet: 500, Rangpur: 400, Mymensingh: 350 },
  Rajshahi:   { Dhaka: 256, Chattogram: 480, Khulna: 270, Barishal: 320, Sylhet: 460, Rangpur: 200, Mymensingh: 220 },
  Barishal:   { Dhaka: 170, Chattogram: 320, Khulna: 165, Rajshahi: 320, Sylhet: 400, Rangpur: 420, Mymensingh: 280 },
  Sylhet:     { Dhaka: 247, Chattogram: 350, Khulna: 500, Rajshahi: 460, Barishal: 400, Rangpur: 420, Mymensingh: 230 },
  Rangpur:    { Dhaka: 300, Chattogram: 520, Khulna: 400, Rajshahi: 200, Barishal: 420, Sylhet: 420, Mymensingh: 220 },
  Mymensingh: { Dhaka: 120, Chattogram: 350, Khulna: 350, Rajshahi: 220, Barishal: 280, Sylhet: 230, Rangpur: 220 },
};

const FARE_PER_KM = 1.8;       // BDT/km, rough intercity bus rate
const INTRA_DIVISION_FARE = 350; // flat approx round-trip fare within same division

export function estimateTransportCostBDT(originDivision, targetDivision) {
  if (!originDivision || !targetDivision) return INTRA_DIVISION_FARE;
  if (originDivision === targetDivision) return INTRA_DIVISION_FARE;
  const km = KM[originDivision]?.[targetDivision] ?? KM[targetDivision]?.[originDivision] ?? 300;
  return Math.round(km * FARE_PER_KM * 2); // round trip
}
