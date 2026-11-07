const fs = require("fs");
const P = "D:/alulu/assets1/public/assets/lunara-app-v129.js";
const t = fs.readFileSync(P, "utf8");
const C = (...a) => String.fromCharCode(...a);

const keys = [
  ["世界书", C(0x4E16, 0x754C, 0x4E66)],
  ["正则", C(0x6B63, 0x5219)],
  ["插入", C(0x63D2, 0x5165)],
  ["用户设定", C(0x7528, 0x6237, 0x8BBE, 0x5B9A)],
  ["character_book", "character_book"],
  ["lorebook", "lorebook"],
  ["worldInfo", "worldInfo"],
  ["world_info", "world_info"],
  ["worldbook", "worldbook"],
  ["alternate_greetings", "alternate_greetings"],
  ["insertion_order", "insertion_order"],
  ["useCharsStore", "useCharsStore=defineStore"],
  ["regexScripts", "regexScript"],
  ["findRegex", "findRegex"],
  ["scan_depth", "scan_depth"],
  ["position after char", "position_before"],
];

for (const [label, k] of keys) {
  let i = -1;
  const hits = [];
  while ((i = t.indexOf(k, i + 1)) >= 0 && hits.length < 8) hits.push(i);
  console.log(label.padEnd(20), hits.length, hits.join(","));
}
