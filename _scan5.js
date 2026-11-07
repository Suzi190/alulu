const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");
const C = (...a) => String.fromCharCode(...a);

function all(k, max = 10) {
  let i = -1; const a = [];
  while ((i = t.indexOf(k, i + 1)) >= 0 && a.length < max) a.push(i);
  return a;
}
const needles = [
  "function normalizeRoleRegexRule",
  "useWorldbookStore",
  'defineStore("worldbook',
  "LuluCharacterCards",
  "readCharacterCard",
  "characterImportDraftFromAi",
  "worldbookDraft=",
  "regexRules",
  "insertWorldbook",
  "worldbookContext",
  "matchWorldbook",
  "wb.match",
  "useWbStore",
];
for (const n of needles) console.log(n.padEnd(32), all(n, 6).join(","));

// dump normalizeRoleRegexRule
const i = t.indexOf("function normalizeRoleRegexRule");
if (i >= 0) {
  console.log("\n===== normalizeRoleRegexRule =====");
  console.log(t.slice(i, i + 1200));
}
