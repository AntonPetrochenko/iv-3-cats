/** https://gist.github.com/mimshins/04ed97a1c6301f248b23509a1be731b5 */

/**
 * Linear interpolate on the scale given by `a` to `b`, using `t` as the point on that scale.
 */
export const lerp = (a: number, b: number, t: number) => a + t * (b - a);

/**
 * Inverse Linar Interpolation, get the fraction between `a` and `b` on which `v` resides.
 */
export const inLerp = (a: number, b: number, v: number) => (v - a) / (b - a);

/**
 * Remap values from one linear scale to another.
 *
 * `oMin` and `oMax` are the scale on which the original value resides,
 * `rMin` and `rMax` are the scale to which it should be mapped.
 */
export const remap = (
  v: number,
  oMin: number,
  oMax: number,
  rMin: number,
  rMax: number
) => lerp(rMin, rMax, inLerp(oMin, oMax, v));


export const lerp2 = (
  a: [number, number],
  b: [number, number],
  t: number
) => {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]
}

export const mul2 = (
  a: [number, number],
  n: number
): [number, number] => {
  return [a[0]*n, a[1]*n]
}

export const add2 = (
  a: [number, number],
  b: [number, number]
) => {
  return [a[0]+b[0], a[1]*b[1]]
}

const distRaw = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
) => {
  const a = x1 - x2;
  const b = y1 - y2;

  return Math.sqrt( a*a + b*b );
}

export const dist = (
  a: [number, number], 
  b: [number, number]
) => {
  return distRaw(a[0], a[1], b[0], b[1])
}

export const mod = (n: number, mod: number) => {
  return ((n % mod) + mod) % mod;
};

export const clamp = (number: number, min: number, max: number) => {
  return Math.max(min, Math.min(number, max));
}

export function hexToRgb(hex: string): number[] {
  // Убираем символ '#' в начале строки, если он есть
  const hexValue = hex.startsWith('#') ? hex.slice(1) : hex;
  
  if (hexValue.length !== 6) {
      throw new Error('Некорректная длина HEX строки');
  }

  // Преобразуем каждую пару символов в десятичное число
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  return [r, g, b];
}