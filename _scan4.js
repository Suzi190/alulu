const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");

function show(label, at, before, after) {
  console.log("\n########## " + label + " @" + at);
  console.log(t.slice(Math.max(0, at - before), at + after));
}

show("worldbook store", 78000, 400, 2600);
show("character_book/lorebook", 1860208, 900, 900);
show("findRegex-1728796", 1728796, 800, 700);
