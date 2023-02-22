"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY } = setting = require('../config.json');
const speed = require("performance-now");
let { ytv } = require('../lib/y2mate')
const ffmpeg = require("fluent-ffmpeg");

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    if (msg.key.fromMe) return
    const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg;
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    const chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
    const args = chats.split(" ");

    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : '-';
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    //const command = chats.toLowerCase().split(" ")[0] || "";

    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''  
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const isOwner = ownerNumber == sender ? true : ["5219996125657@s.whatsapp.net"].includes(sender) ? true : false;
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isCmd = chats.startsWith(prefix)
    const content = JSON.stringify(msg.message)
    const isImage = (type == 'imageMessage')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isVideo = (type == 'videoMessage')
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
 
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
var textReply = `Hola 👋

Soy un Bot de WhatsApp que usa la inteligencia artificial de OpenAI, fui creado para responder a tus preguntas. Por favor, envíame una pregunta y te responderé. 

_La Inteligencia Artificial (IA) es una tecnología que utiliza algoritmos complejos para crear máquinas que piensan y actúan como los seres humanos. La IA se puede utilizar para resolver problemas complejos y tomar decisiones más precisas que los humanos. La IA también se puede utilizar para analizar datos y tomar decisiones basadas en esos datos. La IA también se puede utilizar para mejorar la productividad y la eficiencia, así como para ayudar a los humanos a realizar tareas complejas._

_El Bot se limita a responder ${MAX_TOKEN} palabras como máximo_

Comandos disposibles:
- ${prefix}start
- ${prefix}ping
- ${prefix}runtime
- ${prefix}play
- ${prefix}play2
- ${prefix}chatgpt
- ${prefix}dall-e
- ${prefix}sticker

*Editado By @BrunoSobrino*`
var buttonReply = [
{ urlButton: { displayText: `𝙾𝚆𝙽𝙴𝚁 👑`, url: `https://wa.me/5219996125657` }},
{ urlButton: { displayText: `𝙶𝙸𝚃𝙷𝚄𝙱 🔗`, url: `https://github.com/BrunoSobrino/openai-botwa`}}]
tempButton(from, textReply, '', buttonReply)
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
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n${command} Good Feeling - Flo Rida*`)        
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${chats.replace(command, '')}`) 
let json = await res.json()
sendAud(`${json.result.audio}`)
break
case 'play2':
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n${command} Good Feeling - Flo Rida*`)        
let res2 = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${chats.replace(command, '')}`) 
let json2 = await res2.json()
let mediaa = await ytv('https://youtube.com/watch?v=' + json2.result.id, '360p')
sendVid(mediaa.dl_link, `${json2.result.thumbnail}`)
break    
case 'dall-e': case 'draw': 
if (!args[1]) return reply(`*[❗] Ingrese un texto el cual sera la tematica de la imagen y así usar la función de la IA Dall-E*\n\n*—◉ Ejemplos de peticions:*\n*◉ ${command} gatitos llorando*\n*◉ ${command} hatsune miku beso*`)     
sendImgUrl(`https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${chats.replace(command, '')}`)        
break      
case 'chatgpt': case 'ia': 
if (!args[1]) return reply(`*[❗] Ingrese una petición o una orden para usar la funcion ChatGPT*\n\n*—◉ Ejemplos de peticions u ordenes:*\n*◉ ${command} Reflexion sobre la serie Merlina 2022 de netflix*\n*◉ ${command} Codigo en JS para un juego de cartas*`)           
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: chats.replace(command, ''), temperature: 0, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (q) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + q)       
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chats}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qq) {        
reply("*[❗] Error en el servidor 2, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + qq)  
}} 
break
case 'sticker': case 's':
const pname = 'OpenAI - WaBot'
const athor = '+' + conn.user.id.split(":")[0];
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, "image", `./tmp/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./tmp/${sender.split("@")[0]}.jpeg`)
if (!media) return reply(`*[❗] Responde a una imagen, viode, gif o ingrese el enlace de una imagen terminación .𝚓𝚙𝚐 (o similar) el cual sera convertido en sticker, recuerde que debe mandar una imagen o responder a una imagen con el comando ${command}*`)    
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
//fs.unlinkSync(media)
} else {
if(isVideo || isQuotedVideo) {
var media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
//fs.unlinkSync(media)
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
}}
break    
/*case 'sticker': case 's':   
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
break*/             
default:
if (!chats) return
const botNumber22 = '@' + conn.user.id.split(":")[0];       
if (!chats.startsWith(botNumber22) && isGroup && !isCmd) return        
//if (!['conversation', 'extendedTextMessage'].includes(msg.type)) return reply(`Lo siento, solo leo mensajes de texto!`)
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '') 
if (isGroup) chatstext = chatstext.replace("@", '')      
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: chatstext, temperature: 0, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (e) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + e)       
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (ee) {        
reply("*[❗] Error en el servidor 2, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + ee)  
}} 
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
