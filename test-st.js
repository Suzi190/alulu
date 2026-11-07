const fs = require("fs");
const vm = require("vm");
const code = fs.readFileSync("D:/alulu/preview/assets/features/character-card-import-v152.js", "utf8");
vm.runInThisContext(code);
const L = globalThis.LuluCharacterCards;
console.log("exports:", Object.keys(L).join(","));

const stCard = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  data: {
    name: "沈墨",
    description: "冷淡的钢琴师",
    personality: "寡言",
    scenario: "雨夜琴房",
    first_mes: "……你来做什么。",
    mes_example: "<START>",
    alternate_greetings: ["又见面了。", "别碰那架琴。"],
    character_book: {
      name: "沈墨世界书",
      entries: [
        { keys: ["钢琴", "琴房"], content: "琴房在三楼，隔音很差。", enabled: true, insertion_order: 20, position: 0, constant: false, comment: "琴房设定" },
        { keys: [], content: "世界观：近未来都市，常年降雨。", enabled: true, insertion_order: 5, position: 1, constant: true, comment: "世界观" },
        { keys: ["前女友"], content: "他有个不愿提起的前女友。", enabled: false, insertion_order: 90, position: 1, comment: "禁用条目" }
      ]
    },
    extensions: {
      regex_scripts: [
        { id: "r1", scriptName: "去掉思考块", findRegex: "/<think[\\s\\S]*?<\\/think>/gi", replaceString: "", placement: [2], disabled: false },
        { id: "r2", scriptName: "繁简提示词", findRegex: "/\\[OOC\\]/g", replaceString: "[旁白]", placement: [1, 2] }
      ]
    }
  }
};

const parsed = L.parseJsonCard(JSON.stringify(stCard));
const card = parsed.cards[0];
console.log("\n== card ==");
console.log("name:", card.name, "| spec:", card.spec, "| greeting:", card.greeting);
console.log("altGreetings:", JSON.stringify(card.alternateGreetings));
console.log("worldbook:", JSON.stringify(card.worldbook, null, 1));
console.log("regexRules:", JSON.stringify(card.regexRules, null, 1));

const wbFile = {
  name: "都市怪谈",
  entries: {
    "0": { uid: 0, key: ["地铁", "末班车"], keysecondary: ["血"], content: "末班车 03:00 到站。", order: 30, position: 0, constant: false, disable: false, comment: "末班车" },
    "1": { uid: 1, key: [], content: "所有异常都发生在雨天。", order: 10, position: 1, constant: true, comment: "总设定" },
    "2": { uid: 2, key: ["保安"], content: "保安从不说话。", order: 60, position: 4, comment: "保安" }
  }
};
const det = L.detectStandaloneStJson(wbFile);
console.log("\n== standalone worldbook ==  kind:", det && det.kind, "| title:", det && det.title);
console.log(JSON.stringify(det && det.entries, null, 1));

const regexFile = [
  { scriptName: "隐藏状态栏", findRegex: "/\\|status\\|.*?\\n/g", replaceString: "", placement: [2], disabled: false },
  { scriptName: "输入纠正", findRegex: "/^\\s+/g", replaceString: "", placement: [1] }
];
const det2 = L.detectStandaloneStJson(regexFile);
console.log("\n== standalone regex ==  kind:", det2 && det2.kind, "| rules:", det2 && det2.rules.length);
console.log(JSON.stringify(det2 && det2.rules, null, 1));
