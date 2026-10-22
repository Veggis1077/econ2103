import { describe, expect, it } from 'vitest';
import { plain } from './Rich';

const TOKEN = /(\$\$[^$]+\$\$|\$[^\s\d$](?:[^$]*[^\s$])?\$)/g;

describe('rich text math detection', () => {
  it('does not treat currency as math', () => {
    expect('$4, and producer surplus with the tax is $1.'.match(TOKEN)).toBeNull();
    expect('a tax of $60 per ticket ... to $45 per ticket'.match(TOKEN)).toBeNull();
  });
  it('detects real inline math', () => {
    expect('demand $P = a - bQ$ here'.match(TOKEN)).toEqual(['$P = a - bQ$']);
    expect('then $Q$ and $\\frac{1}{2}$'.match(TOKEN)).toEqual(['$Q$', '$\\frac{1}{2}$']);
    expect('costs $5 then $P^*$ rises'.match(TOKEN)).toEqual(['$P^*$']);
  });
  it('plain() strips math delimiters but keeps money', () => {
    expect(plain('price $P$ is $4')).toBe('price P is $4');
  });
});
