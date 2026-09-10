const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

const POOLS = {
  en: 'storyContent.js',
  hi: 'Hindi story.js',
  bn: 'Bengali story.js',
  as: 'Assamese story.js',
  mni: 'manipuri story.js',
  brx: 'Bodo story.js',
};

// Must match StoryGame.js speechForQuestion() prefixes exactly.
const PREFIXES = {
  en: 'Option',
  hi: 'विकल्प',
  bn: 'বিকল্প',
  as: 'বিকল্প',
  mni: 'অপশন',
  brx: 'थाखाय',
};

function loadStoryContent() {
  let src = fs.readFileSync(path.join(CONTENT_DIR, 'storyContent.js'), 'utf8');
  src = src.replace(/^import (.+) from ".+";$/gm, (m, name) => `const ${name} = {};`);
  src = src.replace('export default storyContent;', 'module.exports = storyContent;');
  const mod = { exports: {} };
  new Function('module', 'exports', src)(mod, mod.exports);
  return mod.exports;
}

function loadPool(file) {
  let src = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  src = src.replace('export default storyContent;', 'module.exports = storyContent;');
  const mod = { exports: {} };
  new Function('module', 'exports', src)(mod, mod.exports);
  return mod.exports;
}

function phrases(pool, lang) {
  const prefix = PREFIXES[lang] || 'Option';
  const out = {};
  const seen = new Set();
  const add = (key, text) => {
    const t = String(text).trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out[key] = t;
  };
  for (const level of Object.keys(pool)) {
    for (const story of pool[level]) {
      add(`story_${story.id}`, story.text);
      story.questions.forEach((question, i) => {
        add(`question_${story.id}_${i}`, question.question);
        question.options.forEach((option, j) => {
          add(`option_${story.id}_${i}_${j}`, `${prefix} ${j + 1}: ${option}`);
        });
      });
    }
  }
  return out;
}

const all = loadStoryContent();
const result = {};
for (const lang of Object.keys(POOLS)) {
  const pool = lang === 'en' ? all.en : loadPool(POOLS[lang]);
  result[lang] = phrases(pool, lang);
}
process.stdout.write(JSON.stringify(result));