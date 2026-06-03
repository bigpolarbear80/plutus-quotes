const MT_CONVERSIONS: Record<string, number> = {
  MT: 1,
  barrel: 7.88,    // barrels per MT for jet fuel
  gallon: 330.7,   // gallons per MT for fuel oil (D6)
};

export function getUnitsPerMT(unit: string): number {
  const factor = MT_CONVERSIONS[unit];
  if (!factor) throw new Error(`Unknown unit: ${unit}`);
  return factor;
}

export function convertToMT(quantity: number, unit: string): number {
  return quantity / getUnitsPerMT(unit);
}

export function convertFromMT(quantityMT: number, unit: string): number {
  return quantityMT * getUnitsPerMT(unit);
}

export function normalizeQuantityToUnit(
  quantity: number,
  inputUnit: string,
  targetUnit: string
): number {
  if (inputUnit === targetUnit) return quantity;
  const mt = convertToMT(quantity, inputUnit);
  return convertFromMT(mt, targetUnit);
}
