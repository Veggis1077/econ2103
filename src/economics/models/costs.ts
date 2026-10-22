/**
 * Chapter 14 — The Costs of Production.
 * Tabular cost measures exactly as in the lecture tables (Conrad's Coffee Shop, Caroline's Cookie Factory).
 */
export interface CostRow {
  quantity: number;
  totalCost: number;
  fixedCost: number;
  variableCost: number;
  /** Undefined at Q = 0. */
  averageFixedCost?: number;
  averageVariableCost?: number;
  averageTotalCost?: number;
  /** ΔTC/ΔQ from the previous row (undefined for the first row). */
  marginalCost?: number;
}

/** Build the full cost table from quantities and total costs; fixed cost = TC at Q = 0 unless given. */
export function buildCostTable(quantities: number[], totalCosts: number[], fixedCost?: number): CostRow[] {
  if (quantities.length !== totalCosts.length) throw new Error('quantities and totalCosts must have equal length');
  const fc = fixedCost ?? (quantities[0] === 0 ? totalCosts[0] : NaN);
  if (Number.isNaN(fc)) throw new Error('Fixed cost must be given when the table does not start at Q = 0');
  return quantities.map((q, i) => {
    const tc = totalCosts[i];
    const vc = tc - fc;
    const row: CostRow = { quantity: q, totalCost: tc, fixedCost: fc, variableCost: vc };
    if (q > 0) {
      row.averageFixedCost = fc / q;
      row.averageVariableCost = vc / q;
      row.averageTotalCost = tc / q;
    }
    if (i > 0) row.marginalCost = (tc - totalCosts[i - 1]) / (q - quantities[i - 1]);
    return row;
  });
}

/** Build a cost table from variable costs and a fixed cost. */
export const costTableFromVariable = (quantities: number[], variableCosts: number[], fixedCost: number) =>
  buildCostTable(quantities, variableCosts.map((v) => v + fixedCost), fixedCost);

/** Efficient scale: the quantity with the lowest average total cost in the table. */
export function efficientScale(rows: CostRow[]): CostRow | undefined {
  return rows.filter((r) => r.averageTotalCost !== undefined).reduce<CostRow | undefined>((best, r) => (!best || r.averageTotalCost! < best.averageTotalCost! ? r : best), undefined);
}

/** Marginal product of each additional unit of input from an output schedule. */
export function marginalProducts(output: number[]): number[] {
  return output.slice(1).map((y, i) => y - output[i]);
}

/** Economic vs accounting profit (Walter's painting business example). */
export function profitComparison(revenue: number, explicitCosts: number, implicitCosts: number) {
  return {
    totalCost: explicitCosts + implicitCosts,
    accountingProfit: revenue - explicitCosts,
    economicProfit: revenue - explicitCosts - implicitCosts,
  };
}

/**
 * Smooth cubic cost function used by the interactive cost-curve lab:
 *   TC(q) = F + α·q − β·q² + γ·q³   (α > 0, β ≥ 0, γ > 0, β² < 3αγ keeps MC > 0)
 * giving the textbook shapes: MC falls then rises, U-shaped AVC and ATC.
 */
export interface CubicCost {
  fixed: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export const totalCost = (c: CubicCost, q: number) => c.fixed + c.alpha * q - c.beta * q * q + c.gamma * q ** 3;
export const variableCost = (c: CubicCost, q: number) => totalCost(c, q) - c.fixed;
export const marginalCost = (c: CubicCost, q: number) => c.alpha - 2 * c.beta * q + 3 * c.gamma * q * q;
export const averageVariableCost = (c: CubicCost, q: number) => (q > 0 ? c.alpha - c.beta * q + c.gamma * q * q : c.alpha);
export const averageFixedCost = (c: CubicCost, q: number) => (q > 0 ? c.fixed / q : Infinity);
export const averageTotalCost = (c: CubicCost, q: number) => (q > 0 ? totalCost(c, q) / q : Infinity);

/** Minimum of AVC (shutdown point): q = β/(2γ). */
export function minAverageVariableCost(c: CubicCost) {
  // With γ = 0 (quadratic costs, β ≤ 0) AVC is rising from q = 0, so the minimum is at q → 0.
  const q = c.gamma > 0 ? Math.max(0, c.beta / (2 * c.gamma)) : 0;
  return { quantity: q, value: averageVariableCost(c, q) };
}

/** Minimum of ATC (efficient scale / break-even point), found numerically (ATC is unimodal for q > 0). */
export function minAverageTotalCost(c: CubicCost, qMax = 1e4) {
  let lo = 1e-9;
  let hi = qMax;
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (averageTotalCost(c, m1) < averageTotalCost(c, m2)) hi = m2;
    else lo = m1;
  }
  const q = (lo + hi) / 2;
  return { quantity: q, value: averageTotalCost(c, q) };
}

/** Minimum of MC: q = β/(3γ). */
export function minMarginalCost(c: CubicCost) {
  const q = c.gamma > 0 ? Math.max(0, c.beta / (3 * c.gamma)) : 0;
  return { quantity: q, value: marginalCost(c, q) };
}
