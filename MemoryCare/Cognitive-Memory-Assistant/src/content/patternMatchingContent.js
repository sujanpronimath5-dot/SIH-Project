// Pattern Matching content pools.
// Add a new food by appending one object — no other code changes needed.
import { missingTranslation } from "../i18n.js";

export const FOOD_ITEMS = [
  { name: "Momos", image: "assets/food/momos.jpg" },
  { name: "Thukpa", image: "assets/food/thukpa.jpg" },
  { name: "Pitha", image: "assets/food/pitha.jpg" },
  { name: "Khar", image: "assets/food/khar.jpg" },
  { name: "Jadoh", image: "assets/food/jadoh.jpg" },
  { name: "Bamboo shoot curry", image: "assets/food/bamboo-shoot-curry.jpg" },
  { name: "Fish tenga", image: "assets/food/fish-tenga.jpg" },
];

export const FRUIT_ITEMS = [
  { name: "Assam orange", image: "assets/fruit/assam-orange.jpg" },
  { name: "Pineapple", image: "assets/fruit/pineapple.jpg" },
  { name: "Litchi", image: "assets/fruit/litchi.jpg" },
  { name: "Passion fruit", image: "assets/fruit/passion-fruit.jpg" },
  { name: "Kiwi", image: "assets/fruit/kiwi.jpg" },
  { name: "Star fruit", image: "assets/fruit/star-fruit.jpg" },
];

const POOLS = { food: FOOD_ITEMS, fruit: FRUIT_ITEMS };

const SHAPE_SETS = [
  ["circle", "square", "triangle"],
  ["star", "pentagon", "rectangle"],
  ["circle", "star", "triangle"],
];

const EMOJI_SETS = [
  ["🍎", "🍌", "🐘"],
  ["🐄", "🌸", "🥭"],
  ["🐐", "🦚", "🍊"],
];

// Three distinct rounds per photo level: category + pair count + start offset.
const PHOTO_ROUNDS = {
  3: [
    { category: "food", pairs: 4, offset: 0 },
    { category: "fruit", pairs: 5, offset: 0 },
    { category: "food", pairs: 5, offset: 2 },
  ],
  4: [
    { category: "food", pairs: 5, offset: 0 },
    { category: "fruit", pairs: 6, offset: 0 },
    { category: "food", pairs: 6, offset: 1 },
  ],
};

const roundCursor = { 1: 0, 2: 0, 3: 0, 4: 0 };

export function nextPatternRound(level) {
  const key = Number(level);
  const index = roundCursor[key] || 0;
  roundCursor[key] = (index + 1) % 3;
  return index;
}

export function pickPoolItems(category, count, offset) {
  const pool = POOLS[category] || FOOD_ITEMS;
  const n = Math.min(count, pool.length);
  const items = [];
  const used = new Set();
  for (let i = 0; i < n; i += 1) {
    const item = pool[(offset + i) % pool.length];
    if (used.has(item.name)) continue;
    used.add(item.name);
    items.push(item);
  }
  return items;
}

export function localizePatternItem(item, lang) {
  if (lang === "en") return item.name;
  return missingTranslation(lang, `pattern.${item.name}`);
}

export function getShapeSet(roundIndex) {
  return SHAPE_SETS[roundIndex % SHAPE_SETS.length];
}

export function getEmojiSet(roundIndex) {
  return EMOJI_SETS[roundIndex % EMOJI_SETS.length];
}

export function getPhotoRound(level, roundIndex) {
  const specs = PHOTO_ROUNDS[level];
  return specs[roundIndex % specs.length];
}
