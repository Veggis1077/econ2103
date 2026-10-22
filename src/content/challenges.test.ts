import { describe, expect, it } from 'vitest';
import { getChallenge } from './challenges';
import { minAverageTotalCost } from '../economics';

const sd = { a: 10, b: 0.1, c: 2, d: 0.06, dShift: 0, sShift: 0, control: 'none', controlPrice: 0 };
const tax = { a: 300, b: 1, c: 0, d: 0.5, t: 30 };
const frank = { nameA: 'Frank', nameB: 'Ruby', totalTime: 480, timeXA: 60, timeYA: 15, timeXB: 20, timeYB: 10, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0, tradeShareB: 0.75 };
const firm = { fixed: 30, alpha: 12, beta: 1.2, gamma: 0.05 };

const solutions: Record<string, [unknown, unknown]> = {
  // [a solving state, a non-solving state]
  'sd-price-8': [{ ...sd, dShift: (8 + 0.1 * 100 - 10) / 0.1 }, sd],
  'pc-shortage-60': [{ a: 300, b: 1, c: 0, d: 0.5, dShift: 0, sShift: 0, control: 'ceiling', controlPrice: 80 }, { a: 300, b: 1, c: 0, d: 0.5, dShift: 0, sShift: 0, control: 'ceiling', controlPrice: 90 }],
  'tax-revenue-12000': [{ ...tax, t: (300 - Math.sqrt(300 * 300 - 4 * 18000)) / 2 }, { ...tax, t: (300 + Math.sqrt(300 * 300 - 4 * 18000)) / 2 }],
  'tax-buyers-75': [{ a: 10, b: 0.3, c: 2, d: 0.06, t: 2 }, { a: 10, b: 0.1, c: 2, d: 0.06, t: 2 }],
  'el-unit-arc': [{ a: 7, b: 0.5, q1: 4, q2: 10 }, { a: 7, b: 0.5, q1: 4, q2: 6 }],
  'ppf-800-cars': [{ maxX: 1000, maxY: 3000, k: 2, x: 800, y: 1800, growthX: 0, growthY: 0 }, { maxX: 1000, maxY: 3000, k: 2, x: 800, y: 1500, growthX: 0, growthY: 0 }],
  'trade-new-deal': [{ ...frank, unitsOfX: 5.5, unitsOfY: 16 }, { ...frank, unitsOfX: 5, unitsOfY: 15 }],
  'planner-max-ts': [{ mode: 'planner', a: 10, b: 0.1, c: 2, d: 0.06, plannerQ: 50 }, { mode: 'planner', a: 10, b: 0.1, c: 2, d: 0.06, plannerQ: 30 }],
  'firm-break-even': [{ ...firm, price: minAverageTotalCost(firm).value }, { ...firm, price: 12 }],
  'mono-mr-mc': [{ a: 100, b: 1, fixed: 400, c: 20, e: 0, qTry: 40 }, { a: 100, b: 1, fixed: 400, c: 20, e: 0, qTry: 55 }],
};

describe('graph challenges are solvable and discriminating', () => {
  for (const [id, [good, bad]] of Object.entries(solutions)) {
    it(id, () => {
      const c = getChallenge(id)!;
      expect(c).toBeDefined();
      expect(c.check(good)[0]).toBe(true);
      expect(c.check(bad)[0]).toBe(false);
    });
  }
});
