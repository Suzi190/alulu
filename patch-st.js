const fs = require("fs");
const P = "D:/alulu/preview/assets/lunara-app-v129.js";
let t = fs.readFileSync(P, "utf8");
const before = t.length;

const helper1 = `function importRoleWorldbookInto(card,charId){try{const rows=Array.isArray(card&&card.worldbook)?card.worldbook:[];if(!rows.length)return 0;const store=useWBStore();let count=0;for(const row of rows){store.add({...row,charIds:[String(charId)],source:"character-import"}),count++}return count}catch(error){console.warn("worldbook import failed",error);return 0}}
async function confirmRoleCardImport(){`;

const helper2 = `function stWorldbookPosition(source){const raw=source?(source.insertPosition??source.position):null,tag=String(raw==null?"":raw).toLowerCase();if(["system-top","before-char","after-char"].includes(tag))return tag;if(/before/.test(tag))return"before-char";if(/after/.test(tag))return"after-char";const n=Number(raw);if(!Number.isFinite(n))return"after-char";return n===0||n===2?"before-char":"after-char"}
function normalizeImportedEntries(`;

const patches = [
  ["B1 wb-import helper", "async function confirmRoleCardImport(){", helper1],
  ["B2 copy branch", "chars.add(importedRoleData(card,name)),added++",
    'const newRoleRow=chars.add(importedRoleData(card,name));importRoleWorldbookInto(card,newRoleRow.id),added++'],
  ["B3 overwrite branch", "chars.update(existing.id,importedRoleData(card,baseName)),updated++;continue",
    'chars.update(existing.id,importedRoleData(card,baseName));importRoleWorldbookInto(card,existing.id),updated++;continue'],
  ["B4 regexRules on role", 'avatarUrl:imageAvatar?avatar:"",',
    'avatarUrl:imageAvatar?avatar:"",regexRules:Array.isArray(card&&card.regexRules)?card.regexRules:keep.regexRules,' +
    'characterCardImportAltGreetings:Array.isArray(card&&card.alternateGreetings)?card.alternateGreetings.slice(0,20):[],'],
  ["B5 standalone wb/regex import",
    "const result=await window.LuluCharacterCards.readCharacterCard(file);cardImportCards.value=result.cards||[],cardImportOpen.value=!0",
    'const result=await window.LuluCharacterCards.readCharacterCard(file);' +
    'if(result&&result.kind==="worldbook"){const wbImport=useWBStore();let wbCount=0;for(const row of result.entries||[]){wbImport.add({...row,source:"sillytavern-worldbook"}),wbCount++}batchMsg.value=`世界书导入完成：${wbCount} 条（${file.name}）· 关键词触发/常开、插入位置与顺序已按世界书设定映射`;return}' +
    'if(result&&result.kind==="regex"){const chNow=chars.active;if(!chNow)throw new Error("请先在角色页选中一个角色，再导入 SillyTavern 正则");const merged=[...(chNow.regexRules||[]),...(result.rules||[])].slice(0,80);chars.update(chNow.id,{regexRules:merged});batchMsg.value=`专属正则已合并到「${chNow.name}」：新增 ${(result.rules||[]).length} 条，当前共 ${merged.length} 条`;return}' +
    "cardImportCards.value=result.cards||[],cardImportOpen.value=!0"],
  ["B6 priority from ST order", "priority:Number(source.priority)||50",
    "priority:Math.max(0,Math.min(100,Number(source.priority??source.order??source.insertion_order)||50))"],
  ["B7 position helper", "function normalizeImportedEntries(", helper2],
  ["B8 position mapping",
    'insertPosition:["system-top","before-char","after-char"].includes(source.insertPosition)?source.insertPosition:source.position==="before_char"?"before-char":"after-char"',
    "insertPosition:stWorldbookPosition(source)"],
  ["B9 dialog hint",
    "{{cardImportCards.length}} \\u4E2A\\u89D2\\u8272\\uFF0C\\u786E\\u8BA4\\u524D",
    "{{cardImportCards.length}} \\u4E2A\\u89D2\\u8272<template v-if=\"cardImportCards.some(c=>(c.worldbook||[]).length||(c.regexRules||[]).length)\"> \\xB7 \\u9644\\u5E26\\u4E16\\u754C\\u4E66 {{cardImportCards.reduce((n,c)=>n+((c.worldbook||[]).length),0)}} \\u6761 / \\u6B63\\u5219 {{cardImportCards.reduce((n,c)=>n+((c.regexRules||[]).length),0)}} \\u6761</template>\\uFF0C\\u786E\\u8BA4\\u524D"]
];

let ok = true;
for (const [name, from, to] of patches) {
  const count = t.split(from).length - 1;
  console.log(String(count).padStart(2), name);
  if (count !== 1) { ok = false; continue; }
  t = t.replace(from, to);
}
if (!ok) { console.log("!! ABORT: target not unique"); process.exit(1); }
fs.writeFileSync(P, t, "utf8");
console.log("bundle patched:", before, "->", t.length);
console.log("ST_PATCH_OK");
