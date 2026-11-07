const fs = require("fs");
const t = fs.readFileSync("D:/alulu/preview/assets/lunara-app-v129.js", "utf8");
const ks = ["createObjectURL", "download=", "a.download", "showSaveFilePicker", "msSaveBlob", "downloadBlob", "navigator.share", "__LULU_NATIVE_SAVE_IMAGE__", "LuluMedia", "saveBlob", "exportData", "exportBackup", "backup"];
for (const k of ks) { let i = -1, c = 0; while ((i = t.indexOf(k, i + 1)) >= 0) c++; console.log(k.padEnd(30), c); }
let i = t.indexOf("createObjectURL");
while (i >= 0 && i < t.length) {
  console.log("\n--- ctx @" + i);
  console.log(t.slice(Math.max(0, i - 500), i + 400));
  i = t.indexOf("createObjectURL", i + 1);
}
