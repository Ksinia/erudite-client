import { isCenterCell, patternCoords } from './Board';

const CLASSIC_SIZE = 15;
const PERIOD = CLASSIC_SIZE - 1;

// the same arithmetic the server applies in services/board.ts
const serverPattern = (
  y: number,
  x: number,
  origin: { x: number; y: number }
) => [
  (((y - origin.y) % PERIOD) + PERIOD) % PERIOD,
  (((x - origin.x) % PERIOD) + PERIOD) % PERIOD,
];

describe('patternCoords', () => {
  it('leaves a classic board alone', () => {
    expect(patternCoords(3, 11, 'classic', { x: 0, y: 0 })).toEqual([3, 11]);
    expect(patternCoords(14, 14, undefined, undefined)).toEqual([14, 14]);
  });

  it('agrees with the server over a region at several origins', () => {
    const origins = [
      { x: 0, y: 0 },
      { x: 7, y: 0 },
      { x: 7, y: 7 },
      { x: 21, y: 14 },
    ];
    origins.forEach((origin) => {
      for (let y = 0; y < 45; y++) {
        for (let x = 0; x < 45; x++) {
          expect(patternCoords(y, x, 'infinite', origin)).toEqual(
            serverPattern(y, x, origin)
          );
        }
      }
    });
  });

  it('repeats every 14 cells, so neighbouring tiles share a border row', () => {
    const origin = { x: 0, y: 0 };
    expect(patternCoords(0, 0, 'infinite', origin)).toEqual([0, 0]);
    expect(patternCoords(PERIOD, PERIOD, 'infinite', origin)).toEqual([0, 0]);
    // row and column 14 alias onto 0, which is what makes the seam shared
    expect(patternCoords(14, 3, 'infinite', origin)).toEqual([0, 3]);
    expect(patternCoords(3, 14, 'infinite', origin)).toEqual([3, 0]);
  });

  it('follows the origin when the board grows', () => {
    expect(patternCoords(7, 7, 'infinite', { x: 7, y: 7 })).toEqual([0, 0]);
    expect(patternCoords(10, 12, 'infinite', { x: 7, y: 7 })).toEqual([3, 5]);
  });
});

describe('isCenterCell', () => {
  it('marks the middle of a classic board', () => {
    expect(isCenterCell(7, 7, 'classic', undefined)).toBe(true);
    expect(isCenterCell(7, 8, 'classic', undefined)).toBe(false);
  });

  it('marks only the original centre of an infinite board', () => {
    const origin = { x: 7, y: 7 };
    expect(isCenterCell(14, 14, 'infinite', origin)).toBe(true);
    // the same position within a neighbouring tile is not a centre
    expect(isCenterCell(14 + PERIOD, 14, 'infinite', origin)).toBe(false);
    expect(isCenterCell(14, 14 + PERIOD, 'infinite', origin)).toBe(false);
    expect(isCenterCell(7, 7, 'infinite', origin)).toBe(false);
  });
});
