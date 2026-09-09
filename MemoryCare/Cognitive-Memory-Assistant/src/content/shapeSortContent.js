import { missingTranslation } from "../i18n.js";

const SHAPES = ["circle", "square", "triangle", "rectangle", "star", "pentagon"];

const EMOJIS = [
  { 
    value: "🍎", 
    en: "apples", 
    hi: "सेब", 
    as: "আপেলবোৰ", 
    bn: "আপেলগুলো", 
    mni: "সেবশিং" 
  },
  { 
    value: "🍌", 
    en: "bananas", 
    hi: "केले", 
    as: "কলবোৰ", 
    bn: "কলাগুলো", 
    mni: "লফোইশিং" 
  },
  { 
    value: "🌸", 
    en: "flowers", 
    hi: "फूल", 
    as: "ফুলবোৰ", 
    bn: "ফুলগুলো", 
    mni: "লৈশিং" 
  },
  { 
    value: "☂️", 
    en: "umbrellas", 
    hi: "छतरियाँ", 
    as: "ছাতিবোৰ", 
    bn: "ছাতাগুলো", 
    mni: "শেকপিনশিং" 
  },
  { 
    value: "⚽", 
    en: "balls", 
    hi: "गेंदें", 
    as: "বলবোৰ", 
    bn: "বলগুলো", 
    mni: "বলশিং" 
  },
  { 
    value: "🔑", 
    en: "keys", 
    hi: "चाबियाँ", 
    as: "চাবিবোৰ", 
    bn: "চাবিগুলো", 
    mni: "সোবীশিং" 
  },
  { 
    value: "☕", 
    en: "cups", 
    hi: "कप", 
    as: "কাপবোৰ", 
    bn: "কাপগুলো", 
    mni: "খপশিং" 
  },
  { 
    value: "🌙", 
    en: "moons", 
    hi: "चाँद", 
    as: "জোনবোৰ", 
    bn: "চাঁদগুলো", 
    mni: "থাশিং" 
  },
];

export const OBJECT_ITEMS = [
  { 
    id: "clock", 
    image: "assets/objects/clock.jpg", 
    en: "clocks", 
    hi: "घड़ियाँ", 
    as: "ঘড়ীবোৰ", 
    bn: "ঘড়িগুলো", 
    mni: "পুংগী ঘড়ীশিং" 
  },
  { 
    id: "telephone", 
    image: "assets/objects/telephone.jpg", 
    en: "telephones", 
    hi: "टेलीफ़ोन", 
    as: "টেলিফোনবোৰ", 
    bn: "টেলিফোনগুলো", 
    mni: "তেলিফোনশিং" 
  },
  { 
    id: "chair", 
    image: "assets/objects/chair.jpg", 
    en: "chairs", 
    hi: "कुर्सियाँ", 
    as: "চকীবোৰ", 
    bn: "চেয়ারগুলো", 
    mni: "চৌকিশিং" 
  },
  { 
    id: "book", 
    image: "assets/objects/book.jpg", 
    en: "books", 
    hi: "किताबें", 
    as: "কিতাপবোৰ", 
    bn: "বইগুলো", 
    mni: "লাইরিকশিং" 
  },
];

const SHAPE_INSTRUCTIONS = {
  circle: { 
    en: "Tap all the circles", 
    hi: "सभी गोल आकार छुएँ", 
    as: "সকলো বৃত্ত স্পৰ্শ কৰক", 
    bn: "সব বৃত্তগুলো স্পর্শ করুন", 
    mni: "তেম্পাক পুম্নমক নাম্মু" 
  },
  square: { 
    en: "Tap all the squares", 
    hi: "सभी वर्ग छुएँ", 
    as: "সকলো বৰ্গক্ষেত্ৰ স্পৰ্শ কৰক", 
    bn: "সব বর্গক্ষেত্রগুলো স্পর্শ করুন", 
    mni: "চাং চারি পুম্নমক নাম্মু" 
  },
  triangle: { 
    en: "Tap all the triangles", 
    hi: "सभी त्रिभुज छुएँ", 
    as: "সকলো ত্ৰিভুজ স্পৰ্শ কৰক", 
    bn: "সব ত্রিভুজগুলো স্পর্শ করুন", 
    mni: "ত্রিকোণ পুম্নমক নাম্মু" 
  },
  rectangle: { 
    en: "Tap all the rectangles", 
    hi: "सभी आयत छुएँ", 
    as: "সকলো আয়তক্ষেত্ৰ স্পৰ্শ কৰক", 
    bn: "সব আয়তক্ষেত্রগুলো স্পর্শ করুন", 
    mni: "আয়ত পুম্নমক নাম্মু" 
  },
  star: { 
    en: "Tap all the stars", 
    hi: "सभी तारे छुएँ", 
    as: "সকলো তৰা স্পৰ্শ কৰক", 
    bn: "সব তারাগুলো স্পর্শ করুন", 
    mni: "থৌৱাল পুম্নমক নাম্মু" 
  },
  pentagon: { 
    en: "Tap all the pentagons", 
    hi: "सभी पंचभुज छुएँ", 
    as: "সকলো পঞ্চভুজ স্পৰ্শ কৰক", 
    bn: "সব পঞ্চভুজগুলো স্পর্শ করুন", 
    mni: "পঞ্চভুজ পুম্নমক নাম্মু" 
  },
};

const LEVEL_ROUNDS = {
  1: [
    { count: 8, targetCount: 3, pool: "shape", target: { kind: "shape", value: "circle" } },
    { count: 8, targetCount: 3, pool: "shape", target: { kind: "shape", value: "star" } },
    { count: 8, targetCount: 3, pool: "shape", target: { kind: "shape", value: "pentagon" } },
  ],
  2: [
    { count: 8, targetCount: 3, pool: "emoji", target: { kind: "emoji", value: "🍎" } },
    { count: 8, targetCount: 3, pool: "emoji", target: { kind: "emoji", value: "🔑" } },
    { count: 8, targetCount: 3, pool: "emoji", target: { kind: "emoji", value: "⚽" } },
  ],
  3: [
    { count: 10, targetCount: 3, pool: "object", target: { kind: "object", value: "book" } },
    { count: 10, targetCount: 3, pool: "object", target: { kind: "object", value: "clock" } },
    { count: 10, targetCount: 3, pool: "object", target: { kind: "object", value: "chair" } },
  ],
  4: [
    { count: 20, targetCount: 4, pool: "mixed", target: { kind: "object", value: "book" } },
    { count: 20, targetCount: 4, pool: "mixed", target: { kind: "shape", value: "circle" } },
    { count: 20, targetCount: 4, pool: "mixed", target: { kind: "emoji", value: "🍌" } },
  ],
};

const roundCursor = { 1: 0, 2: 0, 3: 0, 4: 0 };

export function matchesRule(item, rule) {
  if (!item || !rule) return false;
  if (rule.kind === "shape") return item.kind === "shape" && item.shape === rule.value;
  if (rule.kind === "emoji") return item.kind === "emoji" && item.emoji === rule.value;
  if (rule.kind === "object") return item.kind === "object" && item.objectId === rule.value;
  return false;
}

export function buildShapeSortRound(level, lang) {
  const n = Number(level) || 1;
  const rounds = LEVEL_ROUNDS[n] || LEVEL_ROUNDS[1];
  const index = roundCursor[n] || 0;
  roundCursor[n] = (index + 1) % rounds.length;
  const dim = rounds[index];
  const rule = {
    kind: dim.target.kind,
    value: dim.target.value,
    instruction: instructionFor(dim.target, lang),
  };

  const raw = [];
  for (let i = 0; i < dim.targetCount; i += 1) {
    raw.push(makeTargetItem(rule));
  }
  while (raw.length < dim.count) {
    raw.push(makeDistractorItem(dim.pool, rule));
  }

  const items = shuffle(raw).map((item, i) => ({ ...item, id: `item_${i}` }));
  const targetIds = items.filter((item) => matchesRule(item, rule)).map((item) => item.id);

  return {
    spec: {
      level: n,
      rule,
      timeLimitMs: null,
      instruction: rule.instruction,
      targetCount: targetIds.length,
    },
    items,
    targetIds,
  };
}

function instructionFor(target, lang) {
  if (target.kind === "shape") {
    return localized(SHAPE_INSTRUCTIONS[target.value], lang, `shape.${target.value}`);
  }

  const matchTemplate = {
    en: (name) => `Tap all the ${name}`,
    hi: (name) => `सभी ${name} छुएँ`,
    as: (name) => `সকলো ${name} স্পৰ্শ কৰক`,
    bn: (name) => `সব ${name} স্পর্শ করুন`,
    mni: (name) => `${name} পুম্নমক নাম্মু`,
  };

  const fallbacks = {
    en: "matching items",
    hi: "मेल खाती चीज़ें",
    as: "মিলা বস্তুবোৰ",
    bn: "মিল থাকা বস্তুগুলো",
    mni: "চানবা পোৎলমশিং",
  };

  const currentLang = matchTemplate[lang] ? lang : "en";
  const item = target.kind === "emoji"
    ? EMOJIS.find((e) => e.value === target.value)
    : OBJECT_ITEMS.find((o) => o.id === target.value);

  const localizedName = (item && item[lang]) ? item[lang] : fallbacks[currentLang];
  const renderedText = matchTemplate[currentLang](localizedName);

  return localized({ [lang]: renderedText }, lang, `${target.kind}.${target.value}`);
}

function localized(values, lang, key) {
  if (values[lang]) return values[lang];
  return missingTranslation(lang, key);
}

function makeTargetItem(rule) {
  if (rule.kind === "shape") return { kind: "shape", shape: rule.value, color: "terracotta" };
  if (rule.kind === "emoji") return { kind: "emoji", emoji: rule.value };
  const obj = OBJECT_ITEMS.find((o) => o.id === rule.value) || OBJECT_ITEMS[0];
  return { kind: "object", objectId: obj.id, image: obj.image, label: obj.en };
}

function makeDistractorItem(pool, rule) {
  let candidate;
  let guard = 0;
  do {
    candidate = randomFromPool(pool);
    guard += 1;
  } while (matchesRule(candidate, rule) && guard < 50);
  if (matchesRule(candidate, rule)) {
    return fallbackDistractor(rule);
  }
  return candidate;
}

function randomFromPool(pool) {
  if (pool === "shape") return randomShape();
  if (pool === "emoji") return randomEmoji();
  if (pool === "object") return randomObject();
  const pickKind = Math.floor(Math.random() * 3);
  if (pickKind === 0) return randomShape();
  if (pickKind === 1) return randomEmoji();
  return randomObject();
}

function randomShape() {
  return { kind: "shape", shape: pick(SHAPES), color: "terracotta" };
}

function randomEmoji() {
  return { kind: "emoji", emoji: pick(EMOJIS).value };
}

function randomObject() {
  const obj = pick(OBJECT_ITEMS);
  return { kind: "object", objectId: obj.id, image: obj.image, label: obj.en };
}

function fallbackDistractor(rule) {
  if (rule.kind === "shape") {
    const shape = SHAPES.find((s) => s !== rule.value) || "square";
    return { kind: "shape", shape, color: "terracotta" };
  }
  if (rule.kind === "emoji") {
    const row = EMOJIS.find((e) => e.value !== rule.value) || EMOJIS[0];
    return { kind: "emoji", emoji: row.value };
  }
  const obj = OBJECT_ITEMS.find((o) => o.id !== rule.value) || OBJECT_ITEMS[0];
  return { kind: "object", objectId: obj.id, image: obj.image, label: obj.en };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}