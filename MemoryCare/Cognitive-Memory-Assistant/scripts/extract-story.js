const fs = require('fs');
const path = require('path');

function load(poolFile) {
  let src = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'content', poolFile),
    'utf8'
  );
  src = src.replace('export default storyContent;', 'module.exports = storyContent;');
  const mod = { exports: {} };
  new Function('module', 'exports', src)(mod, mod.exports);
  return mod.exports;
}

function phrases(pool) {
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
          add(`option_${story.id}_${i}_${j}`, `Option ${String.fromCharCode(65 + j)}: ${option}`);
        });
      });
    }
  }
  return out;
}

const result = {
  hi: phrases(load('Hindi story.js')),
  bn: phrases(load('Bengali story.js')),
};
process.stdout.write(JSON.stringify(result));