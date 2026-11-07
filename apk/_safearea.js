const fs = require("fs");
const path = require("path");
const root = "D:/alulu/apk/www";
const map = {
  "env(safe-area-inset-top)": "var(--lulu-safe-top, 0px)",
  "env(safe-area-inset-bottom)": "var(--lulu-safe-bottom, 0px)",
  "env(safe-area-inset-left)": "var(--lulu-safe-left, 0px)",
  "env(safe-area-inset-right)": "var(--lulu-safe-right, 0px)"
};
let changed = 0,
  total = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    if (!/\.(css|js|html)$/i.test(entry.name)) continue;
    let text = fs.readFileSync(p, "utf8");
    let hits = 0;
    for (const [from, to] of Object.entries(map)) {
      const parts = text.split(from);
      if (parts.length > 1) { hits += parts.length - 1; text = parts.join(to); }
    }
    if (hits) {
      fs.writeFileSync(p, text, "utf8");
      changed++;
      total += hits;
      console.log(String(hits).padStart(4), path.relative(root, p));
    }
  }
}
walk(root);
console.log("files changed:", changed, "| replacements:", total);
