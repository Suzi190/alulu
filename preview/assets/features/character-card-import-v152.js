(function(global){"use strict";const TEXT_EXTENSIONS=new Set(["txt","md","markdown"]),MAX_DOCX_XML_BYTES=16*1024*1024,MAX_DOCX_ENTRY_BYTES=16*1024*1024,FIELD_ALIASES={name:["name","charname","char_name","charactername","\u89D2\u8272\u540D","\u59D3\u540D","\u4EBA\u7269\u540D","\u540D\u5B57"],description:["description","desc","\u7B80\u4ECB","\u63CF\u8FF0","\u80CC\u666F\u8BBE\u5B9A","\u89D2\u8272\u7B80\u4ECB"],personality:["personality","persona","char_persona","\u6027\u683C","\u4EBA\u8BBE","\u6027\u683C\u8BBE\u5B9A"],scenario:["scenario","scene","world_scenario","\u4E16\u754C\u573A\u666F","\u573A\u666F","\u4E16\u754C\u89C2","\u5F53\u524D\u573A\u666F"],greeting:["first_mes","char_greeting","first message","greeting","opening","\u5F00\u573A\u767D","\u521D\u59CB\u6D88\u606F","\u7B2C\u4E00\u53E5\u8BDD","\u9996\u53E5"],exampleDialogue:["mes_example","example_dialogue","example dialogue","example","\u793A\u4F8B\u5BF9\u8BDD","\u5BF9\u8BDD\u793A\u4F8B","\u5BF9\u8BDD\u8303\u4F8B"],systemPrompt:["system_prompt","system prompt","\u7CFB\u7EDF\u63D0\u793A\u8BCD","\u7CFB\u7EDF\u63D0\u793A","\u7CFB\u7EDF\u8BBE\u5B9A"],postHistory:["post_history_instructions","post history instructions","\u5386\u53F2\u6D88\u606F\u6307\u4EE4","\u5386\u53F2\u6307\u4EE4"],creatorNotes:["creator_notes","creator notes","\u4F5C\u8005\u6CE8\u91CA","\u4F5C\u8005\u5907\u6CE8"],identity:["identity","role","occupation","\u8EAB\u4EFD","\u89D2\u8272\u8EAB\u4EFD","\u804C\u4E1A","\u89D2\u8272\u5B9A\u4F4D"],background:["background","backstory","\u80CC\u666F","\u80CC\u666F\u6545\u4E8B","\u6210\u957F\u7ECF\u5386","\u5BB6\u5EAD\u80CC\u666F","\u7ECF\u5386"],personaDetails:["details","character details","\u89D2\u8272\u7EC6\u8282","\u884C\u4E3A\u7EC6\u8282","\u65E5\u5E38\u884C\u4E3A","\u8BED\u8A00\u98CE\u683C","\u6587\u98CE"],boundaries:["boundaries","boundary","rules","\u7981\u6B62\u9879","\u7981\u6B62","\u8FB9\u754C","\u7EA2\u7EBF","\u5E95\u7EBF","\u7EA6\u675F","\u6CE8\u610F\u4E8B\u9879"],avatar:["avatar","avatar_url","avatar url","image","\u5934\u50CF","\u5934\u50CF\u94FE\u63A5","\u7ACB\u7ED8"],tags:["tags","tag","\u6807\u7B7E"]};function asText(value){return value==null?"":Array.isArray(value)?value.map(asText).filter(Boolean).join(`
`):typeof value=="object"?"":String(value).trim()}function extension(name){return String(name||"").toLowerCase().split(".").pop()||""}function stem(name){return String(name||"\u89D2\u8272\u5361").replace(/\.[^/.]+$/,"").trim()||"\u89D2\u8272\u5361"}function normalizedKey(value){return String(value||"").toLowerCase().replace(/[\s_\-：:]+/g,"")}function fieldFor(label){const key=normalizedKey(label);for(const[field,aliases]of Object.entries(FIELD_ALIASES))if(aliases.some(alias=>normalizedKey(alias)===key))return field;return""}function sectionFieldFor(label){const value=String(label||"").replace(/[“”"']/g,"").trim();return value?/开场|初始|第一句话|首句|欢迎/.test(value)?"greeting":/禁止|边界|红线|底线|约束|注意事项|不可(?:以|越过)?|规则/.test(value)?"boundaries":/外貌|长相|身高|发型|穿着|形象|外在/.test(value)?"description":/身份|职业|角色定位|工作|设定中的|用户/.test(value)?"identity":/性格|人格|脾气|情感|语言|文风|说话|行为|习惯|日常|替身/.test(value)?"personaDetails":/背景|家庭|成长|经历|前男友|关系|重逢|分手|恶魔|城市|世界|时代|地点|环境|剧情|故事/.test(value)?"background":/作者|创作|备注|提示/.test(value)?"creatorNotes":"":""}function appendField(fields,key,value){const text=String(value||"").trim();text&&(fields[key]=`${fields[key]||""}${fields[key]?`
`:""}${text}`.trim())}function parseLabeledText(text){var _a,_b;const fields={},free=[],lines=String(text||"").replace(/^\uFEFF/,"").replace(/\r\n?/g,`
`).split(`
`);let current="";for(const raw of lines){const line=raw.trim();if(!line){current&&fields[current]&&(fields[current]+=`
`);continue}const heading=line.match(/^【([^】]+)】\s*(?::|：)?\s*(.*)$/)||line.match(/^［([^］]+)］\s*(?::|：)?\s*(.*)$/)||line.match(/^#{1,6}\s*([^:：]+?)\s*(?:[:：]\s*(.*))?$/)||line.match(/^\[([^\]]+)\]\s*(?::|：)?\s*(.*)$/),labeled=line.match(/^([^:：]{1,40})\s*[:：]\s*(.*)$/),match=heading||labeled,label=(match==null?void 0:match[1])||"",inferredName=(_b=(_a=label.match(/^([^|＝=]{2,20}?)(?:的)?(?:身份|外貌|性格|背景)$/))==null?void 0:_a[1])==null?void 0:_b.trim();inferredName&&!fields.name&&!/设定中的|用户|角色/.test(inferredName)&&(fields.name=inferredName);const field=fieldFor(label)||sectionFieldFor(label);if(field){current=field;const inline=String((match==null?void 0:match[2])||"").trim();inline&&appendField(fields,field,inline);continue}if(heading&&label){current="creatorNotes",appendField(fields,current,`\u3010${label}\u3011`);continue}current?appendField(fields,current,line):free.push(line)}return free.length&&appendField(fields,"prompt",free.join(`
`)),fields}function combinePrompt(data){const parts=[],explicit=asText(data.prompt||data.char_prompt||data.character_prompt||data.persona);return explicit&&parts.push(explicit),[["\u89D2\u8272\u7B80\u4ECB",data.description],["\u8EAB\u4EFD\u4E0E\u804C\u4E1A",data.identity],["\u6027\u683C\u4E0E\u4EBA\u8BBE",data.personality],["\u6027\u683C\u7EC6\u8282\u4E0E\u884C\u4E3A",data.personaDetails],["\u80CC\u666F\u4E0E\u7ECF\u5386",data.background],["\u573A\u666F\u4E0E\u4E16\u754C\u89C2",data.scenario],["\u8FB9\u754C\u4E0E\u7981\u6B62\u9879",data.boundaries],["\u7CFB\u7EDF\u63D0\u793A",data.systemPrompt],["\u5386\u53F2\u6D88\u606F\u6307\u4EE4",data.postHistory],["\u4F5C\u8005\u5907\u6CE8",data.creatorNotes],["\u793A\u4F8B\u5BF9\u8BDD",data.exampleDialogue]].filter(([,value])=>asText(value)).forEach(([label,value])=>parts.push(`${label}\uFF1A
${asText(value)}`)),parts.join(`

`)}function normalizeCard(input,options={}){const raw=input&&typeof input=="object"?input:{},nested=raw.data&&typeof raw.data=="object"?raw.data:raw,data={...raw,...nested,name:raw.name||raw.char_name||nested.name||nested.char_name,description:raw.description||nested.description,identity:raw.identity||raw.role||raw.occupation||nested.identity||nested.role||nested.occupation,personality:raw.personality||raw.persona||raw.char_persona||nested.personality||nested.persona||nested.char_persona,personaDetails:raw.personaDetails||raw.details||raw.characterDetails||nested.personaDetails||nested.details||nested.characterDetails,background:raw.background||raw.backstory||nested.background||nested.backstory,scenario:raw.scenario||raw.world_scenario||nested.scenario||nested.world_scenario,greeting:raw.greeting||raw.first_mes||raw.char_greeting||nested.greeting||nested.first_mes||nested.char_greeting,exampleDialogue:raw.exampleDialogue||raw.mes_example||raw.example_dialogue||nested.exampleDialogue||nested.mes_example||nested.example_dialogue,systemPrompt:raw.systemPrompt||raw.system_prompt||nested.systemPrompt||nested.system_prompt,postHistory:raw.postHistory||raw.post_history_instructions||nested.postHistory||nested.post_history_instructions,creatorNotes:raw.creatorNotes||raw.creator_notes||nested.creatorNotes||nested.creator_notes,boundaries:raw.boundaries||raw.boundary||raw.rules||nested.boundaries||nested.boundary||nested.rules,avatar:raw.avatarUrl||raw.avatar_url||raw.image||nested.avatarUrl||nested.avatar_url||nested.image||(/^https?:|^data:image/i.test(String(raw.avatar||nested.avatar||""))?raw.avatar||nested.avatar:""),tags:raw.tags||nested.tags},card={schema:"lulu-character-card-v152",sourceId:asText(data.id),name:asText(data.name)||stem(options.filename),prompt:combinePrompt(data),description:asText(data.description),identity:asText(data.identity),personality:asText(data.personality),personaDetails:asText(data.personaDetails),background:asText(data.background),scenario:asText(data.scenario),boundaries:asText(data.boundaries),greeting:asText(data.greeting),exampleDialogue:asText(data.exampleDialogue),systemPrompt:asText(data.systemPrompt),postHistoryInstructions:asText(data.postHistory),creatorNotes:asText(data.creatorNotes),avatar:asText(data.avatar),tags:Array.isArray(data.tags)?data.tags.map(asText).filter(Boolean):asText(data.tags).split(/[,，、]/).map(x=>x.trim()).filter(Boolean),sourceFormat:options.sourceFormat||"json",sourceFile:asText(options.filename),raw};return!card.prompt&&card.greeting&&(card.prompt=`\u89D2\u8272\u5F00\u573A\u767D\uFF1A
${card.greeting}`),card}function looksLikeCard(value){if(!value||typeof value!="object")return!1;const data=value.data&&typeof value.data=="object"?value.data:value;return["name","char_name","prompt","persona","char_persona","char_prompt","description","personality","scenario","world_scenario","greeting","first_mes","char_greeting","system_prompt","avatar_url","spec"].some(key=>value[key]!=null||data[key]!=null)}function parseJsonCard(value,options={}){if(typeof value=="string")try{value=JSON.parse(value.replace(/^\uFEFF/,""))}catch(error){throw new Error(`JSON \u89E3\u6790\u5931\u8D25\uFF1A${error.message}`)}if(value&&typeof value=="object"&&Array.isArray(value.contacts))throw new Error("\u8FD9\u662F\u6574\u673A\u5907\u4EFD JSON\uFF0C\u8BF7\u5230\u201C\u5907\u4EFD\u6570\u636E\u201D\u9875\u9762\u6062\u590D");let rows=Array.isArray(value)?value:Array.isArray(value==null?void 0:value.roles)?value.roles:Array.isArray(value==null?void 0:value.characters)?value.characters:value!=null&&value.role?[value.role]:[value];if(!rows.length||rows.some(row=>!looksLikeCard(row)))throw new Error("JSON \u4E2D\u6CA1\u6709\u627E\u5230\u53EF\u8BC6\u522B\u7684\u89D2\u8272\u5361\u5B57\u6BB5");const sourceFormat=options.sourceFormat||"json";return{kind:rows.length>1?"cards":"card",format:sourceFormat,cards:rows.map(row=>normalizeCard(row,{...options,sourceFormat}))}}function parseTextCard(text,options={}){const fields=parseLabeledText(text),card=normalizeCard(fields,{...options,sourceFormat:options.sourceFormat||"txt"});return!card.prompt&&String(text||"").trim()&&(card.prompt=String(text).trim()),{kind:"card",format:card.sourceFormat,cards:[card]}}function uint32(bytes,offset){return(bytes[offset]<<24>>>0|bytes[offset+1]<<16|bytes[offset+2]<<8|bytes[offset+3])>>>0}function uint16LE(bytes,offset){return(bytes[offset]|bytes[offset+1]<<8)>>>0}function uint32LE(bytes,offset){return(bytes[offset]|bytes[offset+1]<<8|bytes[offset+2]<<16|bytes[offset+3]<<24)>>>0}function byteRange(bytes,start,length){return Number.isSafeInteger(start)&&Number.isSafeInteger(length)&&start>=0&&length>=0&&start+length<=bytes.length}function utf8(bytes){return new TextDecoder("utf-8").decode(bytes)}function base64Json(value){const text=String(value||"").trim();if(text.startsWith("{")||text.startsWith("["))return JSON.parse(text);const normalized=text.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((text.length+3)%4),binary=global.atob(normalized),bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return JSON.parse(utf8(bytes))}async function decompress(bytes,format,maxOutput=0){if(typeof global.DecompressionStream!="function")throw new Error("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u538B\u7F29\u89D2\u8272\u5361");const stream=new Blob([bytes]).stream().pipeThrough(new global.DecompressionStream(format)),reader=stream.getReader(),chunks=[];let total=0;for(;;){const item=await reader.read();if(item.done)break;const chunk=item.value||new Uint8Array;if(total+=chunk.length,maxOutput&&total>maxOutput){try{await reader.cancel()}catch{}throw new Error("DOCX \u6B63\u6587\u5C55\u5F00\u540E\u8D85\u8FC7\u5B89\u5168\u4E0A\u9650")}chunks.push(chunk)}const output=new Uint8Array(total);let offset=0;for(const chunk of chunks)output.set(chunk,offset),offset+=chunk.length;return output}function parseITXt(bytes){const zero=bytes.indexOf(0);if(zero<0)return null;const keyword=utf8(bytes.slice(0,zero));let i=zero+1,compressed=bytes[i++];i++;const languageEnd=bytes.indexOf(0,i);if(languageEnd<0)return null;i=languageEnd+1;const translatedEnd=bytes.indexOf(0,i);return translatedEnd<0||(i=translatedEnd+1,compressed===1)?null:{keyword,text:utf8(bytes.slice(i))}}async function parsePngCard(buffer,options={}){const bytes=new Uint8Array(buffer),signature=[137,80,78,71,13,10,26,10];if(bytes.length<24||!signature.every((value,index)=>bytes[index]===value))throw new Error("\u4E0D\u662F\u6709\u6548\u7684 PNG \u6587\u4EF6");let offset=8,encoded="";for(;offset+12<=bytes.length;){const length=uint32(bytes,offset),type=utf8(bytes.slice(offset+4,offset+8)),start=offset+8,end=start+length;if(end>bytes.length)break;const chunk=bytes.slice(start,end);if(type==="tEXt"){const zero=chunk.indexOf(0),keyword=zero>=0?utf8(chunk.slice(0,zero)).toLowerCase():"";["chara","ccv3"].includes(keyword)&&(encoded=utf8(chunk.slice(zero+1)))}else if(type==="iTXt"){const item=parseITXt(chunk);item&&["chara","ccv3"].includes(item.keyword.toLowerCase())&&(encoded=item.text)}else if(type==="zTXt"){const zero=chunk.indexOf(0),keyword=zero>=0?utf8(chunk.slice(0,zero)).toLowerCase():"";if(["chara","ccv3"].includes(keyword))try{encoded=utf8(await decompress(chunk.slice(zero+2),"deflate"))}catch{}}if(offset=end+4,type==="IEND")break}if(!encoded)throw new Error("PNG \u4E2D\u6CA1\u6709\u627E\u5230 chara/ccv3 \u89D2\u8272\u5361\u6570\u636E");return{...parseJsonCard(base64Json(encoded),{...options,sourceFormat:"png"}),format:"png"}}function findDocxCentralEntry(bytes,target){if(bytes.length<22)return null;const minOffset=Math.max(0,bytes.length-22-65535);let eocd=-1;for(let offset2=bytes.length-22;offset2>=minOffset;offset2--)if(uint32LE(bytes,offset2)===101010256){eocd=offset2;break}if(eocd<0)return null;const disk=uint16LE(bytes,eocd+4),centralDisk=uint16LE(bytes,eocd+6),entryCount=uint16LE(bytes,eocd+10),centralSize=uint32LE(bytes,eocd+12),centralOffset=uint32LE(bytes,eocd+16);if(disk!==0||centralDisk!==0)throw new Error("DOCX \u4F7F\u7528\u4E86\u4E0D\u652F\u6301\u7684\u5206\u5377 ZIP");if(entryCount===65535||centralSize===4294967295||centralOffset===4294967295)throw new Error("DOCX \u4F7F\u7528\u4E86\u6682\u4E0D\u652F\u6301\u7684 ZIP64 \u683C\u5F0F");if(!byteRange(bytes,centralOffset,centralSize))throw new Error("DOCX \u7684 ZIP \u4E2D\u592E\u76EE\u5F55\u635F\u574F");let offset=centralOffset,end=centralOffset+centralSize;for(let index=0;index<entryCount&&offset+46<=end;index++){if(uint32LE(bytes,offset)!==33639248)throw new Error("DOCX \u7684 ZIP \u4E2D\u592E\u76EE\u5F55\u6761\u76EE\u635F\u574F");const flags=uint16LE(bytes,offset+8),method=uint16LE(bytes,offset+10),compressedSize=uint32LE(bytes,offset+20),nameSize=uint16LE(bytes,offset+28),extraSize=uint16LE(bytes,offset+30),commentSize=uint16LE(bytes,offset+32),localHeaderOffset=uint32LE(bytes,offset+42),nameStart=offset+46;if(compressedSize===4294967295||localHeaderOffset===4294967295)throw new Error("DOCX \u7684\u6B63\u6587\u4F7F\u7528\u4E86\u6682\u4E0D\u652F\u6301\u7684 ZIP64 \u6761\u76EE");if(!byteRange(bytes,nameStart,nameSize)||!byteRange(bytes,nameStart+nameSize,extraSize+commentSize))throw new Error("DOCX \u7684 ZIP \u6587\u4EF6\u540D\u533A\u57DF\u635F\u574F");if(utf8(bytes.slice(nameStart,nameStart+nameSize))===target)return{flags,method,compressedSize,localHeaderOffset};offset=nameStart+nameSize+extraSize+commentSize}return null}function findDocxLocalEntry(bytes,target){for(let offset=0;offset+30<=bytes.length;offset++){if(uint32LE(bytes,offset)!==67324752)continue;const flags=uint16LE(bytes,offset+6),method=uint16LE(bytes,offset+8),compressedSize=uint32LE(bytes,offset+18),nameSize=uint16LE(bytes,offset+26),extraSize=uint16LE(bytes,offset+28),nameStart=offset+30;if(!(!byteRange(bytes,nameStart,nameSize)||!byteRange(bytes,nameStart+nameSize,extraSize)||utf8(bytes.slice(nameStart,nameStart+nameSize))!==target)){if(flags&8&&!compressedSize)throw new Error("DOCX \u7F3A\u5C11\u53EF\u5B9A\u4F4D\u6B63\u6587\u7684 ZIP \u4E2D\u592E\u76EE\u5F55");return{flags,method,compressedSize,localHeaderOffset:offset}}}return null}async function parseDocx(file,options={}){const bytes=new Uint8Array(await file.arrayBuffer()),target="word/document.xml";if(bytes.length>25*1024*1024)throw new Error("DOCX \u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7 25 MB");let entry=findDocxCentralEntry(bytes,target);if(entry||(entry=findDocxLocalEntry(bytes,target)),!entry)throw new Error("DOCX \u4E2D\u6CA1\u6709\u627E\u5230\u6B63\u6587 word/document.xml");const local=entry.localHeaderOffset;if(!byteRange(bytes,local,30)||uint32LE(bytes,local)!==67324752)throw new Error("DOCX \u7684\u6B63\u6587\u672C\u5730\u6587\u4EF6\u5934\u635F\u574F");const localNameSize=uint16LE(bytes,local+26),localExtraSize=uint16LE(bytes,local+28),dataStart=local+30+localNameSize+localExtraSize;if(entry.compressedSize>MAX_DOCX_ENTRY_BYTES)throw new Error("DOCX \u6B63\u6587\u538B\u7F29\u6761\u76EE\u8D85\u8FC7\u5B89\u5168\u4E0A\u9650");if(!byteRange(bytes,dataStart,entry.compressedSize))throw new Error("DOCX \u7684\u6B63\u6587\u6570\u636E\u533A\u57DF\u635F\u574F");const compressed=bytes.slice(dataStart,dataStart+entry.compressedSize);let raw;if(entry.method===0)raw=compressed;else if(entry.method===8)raw=await decompress(compressed,"deflate-raw",MAX_DOCX_XML_BYTES);else throw new Error(`DOCX \u4F7F\u7528\u4E86\u4E0D\u652F\u6301\u7684\u538B\u7F29\u65B9\u5F0F\uFF1A${entry.method}`);if(raw.length>MAX_DOCX_XML_BYTES)throw new Error("DOCX \u6B63\u6587\u5C55\u5F00\u540E\u8D85\u8FC7\u5B89\u5168\u4E0A\u9650");const xml=utf8(raw),doc=new DOMParser().parseFromString(xml,"application/xml"),paragraphs=[...doc.getElementsByTagNameNS("*","p")];if(!paragraphs.length)throw new Error("DOCX \u6B63\u6587\u4E3A\u7A7A\u6216\u65E0\u6CD5\u8BFB\u53D6\u6BB5\u843D");const text=paragraphs.map(p=>[...p.getElementsByTagNameNS("*","t")].map(t=>t.textContent||"").join("")).join(`
`);if(!text.trim())throw new Error("DOCX \u6B63\u6587\u4E3A\u7A7A");return parseTextCard(text,{...options,sourceFormat:"docx"})}function dataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader;reader.onload=()=>resolve(String(reader.result||"")),reader.onerror=()=>reject(reader.error||new Error("\u56FE\u7247\u8BFB\u53D6\u5931\u8D25")),reader.readAsDataURL(file)})}async function readCharacterCard(file){if(!file)throw new Error("\u6CA1\u6709\u9009\u62E9\u6587\u4EF6");if(Number(file.size||0)>25*1024*1024)throw new Error("\u89D2\u8272\u5361\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7 25 MB");const ext=extension(file.name),options={filename:file.name};if(TEXT_EXTENSIONS.has(ext))return parseTextCard(await file.text(),options);if(ext==="json")return parseJsonCard(await file.text(),options);if(ext==="docx")return parseDocx(file,options);if(ext==="png"){const result=await parsePngCard(await file.arrayBuffer(),options);for(const card of result.cards)card.avatar||(card.avatar=await dataUrl(file));return result}throw new Error("\u652F\u6301 .txt\u3001.md\u3001.markdown\u3001.docx\u3001.json \u548C\u5E26\u89D2\u8272\u5361\u5143\u6570\u636E\u7684 .png")}/* ===================== SillyTavern 兼容层 v153-ST ===================== */
const ST_RULE_LIMIT=80,ST_ENTRY_LIMIT=200;
function stNumber(value,fallback){const n=Number(value);return Number.isFinite(n)?n:fallback}
function stParseFindRegex(value){
  const raw=String(value==null?"":value).trim(),m=raw.match(/^\/([\s\S]+)\/([a-z]*)$/i);
  if(!m)return{pattern:raw,flags:""};
  return{pattern:m[1],flags:String(m[2]||"").replace(/[^dgimsuvy]/g,"")};
}
function stInsertPosition(source){
  const raw=source?(source.insertPosition??source.position):null,tag=String(raw==null?"":raw).toLowerCase();
  if(["system-top","before-char","after-char"].includes(tag))return tag;
  if(/before/.test(tag))return"before-char";
  if(/after/.test(tag))return"after-char";
  const n=stNumber(raw,NaN);
  if(!Number.isFinite(n))return"after-char";
  return n===0||n===2?"before-char":"after-char";
}
function stActivationMode(source,keywords){
  const constant=source?(source.constant===true||source.always===true||source.activationMode==="always"):false;
  if(constant)return"always";
  return Array.isArray(keywords)&&keywords.length?"keywords":"always";
}
function stWorldbookRows(book){
  if(!book)return[];
  const list=Array.isArray(book)?book:Array.isArray(book.entries)?book.entries:book.entries&&typeof book.entries==="object"?Object.values(book.entries):[];
  return Array.isArray(list)?list:[];
}
function toWbEntries(list,options={}){
  const rows=stWorldbookRows(list),prepared=[],prefix=String(options.titlePrefix||"世界书");
  for(let index=0;index<rows.length;index++){
    const source=rows[index];
    if(!source||typeof source!=="object")continue;
    const content=String(source.content??source.text??source.body??source.description??"").trim();
    if(!content)continue;
    const rawKeys=source.keys??source.keywords??source.key??[];
    const keywordList=(Array.isArray(rawKeys)?rawKeys:String(rawKeys).split(/[，,\n]/)).map(item=>String(item==null?"":item).trim()).filter(Boolean);
    const keywords=[...new Set(keywordList)].slice(0,40),secondary=source.keysecondary??source.secondary_keys??source.secondaryKeys;
    const order=stNumber(source.order??source.insertion_order??source.priority,100);
    prepared.push({index,order,entry:{
      title:String(source.comment??source.name??source.title??`${prefix} · ${index+1}`).replace(/\s+/g," ").trim().slice(0,160),
      content:content.slice(0,20000),
      keywords,
      activationMode:stActivationMode(source,keywords),
      insertPosition:stInsertPosition(source),
      enabled:source.enabled!==false&&source.disable!==true,
      priority:50,
      hardRule:false,
      surfaces:[],
      source:"character-import",
      st:{order,secondaryKeys:Array.isArray(secondary)?secondary.map(String).filter(Boolean):[],depth:stNumber(source.depth,0),probability:stNumber(source.probability,100),useProbability:source.useProbability===true,selective:source.selective===true,useRegex:source.use_regex===true}
    }});
    if(prepared.length>=ST_ENTRY_LIMIT)break;
  }
  const ranked=[...prepared].sort((a,b)=>a.order-b.order||a.index-b.index);
  ranked.forEach((item,rank)=>{item.entry.priority=ranked.length<=1?60:Math.round(100-(80*rank)/Math.max(1,ranked.length-1))});
  return prepared.map(item=>item.entry);
}
function normalizeStRegexRules(...sources){
  const out=[],seen=new Set;
  function collect(item){
    if(!item||typeof item!=="object"||out.length>=ST_RULE_LIMIT)return;
    const parsed=stParseFindRegex(item.findRegex??item.find??""),pattern=String(parsed.pattern||"").trim();
    if(!pattern)return;
    const placement=(Array.isArray(item.placement)?item.placement:[]).map(value=>String(value)).slice(0,8);
    let stage="";
    if(placement.includes("1")&&placement.includes("2"))stage="all";
    else if(placement.includes("1"))stage="input";
    else if(placement.includes("2"))stage="output";
    else if(placement.includes("3")||placement.includes("5")||placement.includes("6"))stage="history";
    if(!stage)stage="all";
    if(item.promptOnly===true&&stage==="output")stage="all";
    const rule={
      id:String(item.id||`st-regex-${out.length}`),
      name:String(item.scriptName??item.name??`正则 ${out.length+1}`).replace(/[<>]/g,"").slice(0,120),
      findRegex:pattern.slice(0,1200),
      replaceString:String(item.replaceString??item.replace??"").slice(0,1200),
      flags:parsed.flags||"gi",
      stage,
      placement,
      disabled:item.disabled===true||item.enabled===false,
      markdownOnly:item.markdownOnly===true,
      promptOnly:item.promptOnly===true,
      historyOnly:item.historyOnly===true,
      st:{trimStrings:Array.isArray(item.trimStrings)?item.trimStrings.map(String).slice(0,20):[],runOnEdit:item.runOnEdit===true,substituteRegex:stNumber(item.substituteRegex,0)}
    };
    const signature=`${rule.findRegex}\u0000${rule.replaceString}`;
    if(seen.has(signature))return;
    seen.add(signature),out.push(rule);
  }
  function pushList(value){if(Array.isArray(value))for(const item of value)collect(item)}
  for(const source of sources){
    if(!source)continue;
    if(Array.isArray(source)){pushList(source);continue}
    pushList(source.regex_scripts??source.regexScripts??source.rules);
  }
  return out;
}
function stCardSources(raw){
  const root=raw&&typeof raw==="object"?raw:{},data=root.data&&typeof root.data==="object"?root.data:root;
  return{root,data};
}
function worldbookFromCard(raw){
  const root=raw&&typeof raw==="object"?raw:{},data=root.data&&typeof root.data==="object"?root.data:root;
  const book=data.character_book??root.character_book??(data.extensions&&data.extensions.character_book)??(root.extensions&&root.extensions.character_book)??null;
  return toWbEntries(book);
}
function regexFromCard(raw){
  const root=raw&&typeof raw==="object"?raw:{},data=root.data&&typeof root.data==="object"?root.data:root;
  return normalizeStRegexRules(data.extensions&&data.extensions.regex_scripts,root.extensions&&root.extensions.regex_scripts,data.regex_scripts,root.regex_scripts,data.regexRules,root.regexRules);
}
function alternatesFromCard(raw){
  const root=raw&&typeof raw==="object"?raw:{},data=root.data&&typeof root.data==="object"?root.data:root;
  const alt=data.alternate_greetings??root.alternate_greetings;
  return Array.isArray(alt)?alt.map(item=>String(item==null?"":item).trim()).filter(Boolean).slice(0,20):[];
}
function enrichCard(card){
  if(!card||typeof card!=="object")return card;
  const raw=card.raw&&typeof card.raw==="object"?card.raw:{},data=stCardSources(raw).data;
  try{card.spec=String(data.spec||raw.spec||card.spec||"")}catch{}
  try{card.worldbook=worldbookFromCard(raw)}catch{card.worldbook=[]}
  try{card.regexRules=regexFromCard(raw)}catch{card.regexRules=[]}
  try{card.alternateGreetings=alternatesFromCard(raw)}catch{card.alternateGreetings=[]}
  return card;
}
function detectStandaloneStJson(value){
  if(!value||typeof value!=="object")return null;
  if(Array.isArray(value)){
    const rows=value.filter(item=>item&&typeof item==="object");
    if(rows.length&&rows.every(item=>item.findRegex!=null||(item.scriptName!=null&&item.replaceString!=null))){
      const rules=normalizeStRegexRules(value);
      if(rules.length)return{kind:"regex",format:"sillytavern-regex",rules};
    }
    return null;
  }
  const entries=value.entries,list=Array.isArray(entries)?entries:entries&&typeof entries==="object"?Object.values(entries):null;
  const bookish=entries!=null&&value.first_mes==null&&value.description==null&&value.mes_example==null&&value.personality==null;
  if(bookish&&list&&list.length&&list.every(item=>item&&typeof item==="object"&&(item.content!=null||item.text!=null))){
    const rows=toWbEntries(list);
    if(rows.length)return{kind:"worldbook",format:"sillytavern-worldbook",title:String(value.name||value.title||"导入世界书"),entries:rows};
  }
  return null;
}
async function readCharacterCardSt(file,options){
  if(file&&/^json$/i.test(String(file.name||"").split(".").pop()||"")){
    try{
      const detected=detectStandaloneStJson(JSON.parse(String(await file.text()).replace(/^\uFEFF/,"")));
      if(detected)return detected;
    }catch{}
  }
  const result=await readCharacterCard(file,options);
  for(const card of result.cards||[])enrichCard(card);
  return result;
}
function parseJsonCardSt(value,options){
  const result=parseJsonCard(value,options);
  for(const card of result.cards||[])enrichCard(card);
  return result;
}
global.LuluCharacterCards={readCharacterCard:readCharacterCardSt,parseTextCard,parseJsonCard:parseJsonCardSt,parsePngCard,normalizeCard,toWbEntries,normalizeStRegexRules,enrichCard,detectStandaloneStJson}})(globalThis);
