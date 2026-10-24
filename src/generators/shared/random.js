export function createRng(seed) {
  let s = seed >>> 0
  return function rng() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31)
}

export function pickInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

export function pickOne(rng, items) {
  return items[pickInt(rng, 0, items.length - 1)]
}

export function shuffle(rng, items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = pickInt(rng, 0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
