"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
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

    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~xzZ+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
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

Soy un Bot de WhatsApp que usa la inteligencia artificial de OpenAI (ChatGPT), fui creado para responder a tus preguntas. Envíame una pregunta y te responderé!. 

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
var templateButtons = [
{index: 1, urlButton: {displayText: '𝙾𝚆𝙽𝙴𝚁 👑', url: 'https://wa.me/5219996125657'}},
{index: 2, urlButton: {displayText: '𝙶𝙸𝚃𝙷𝚄𝙱 🔗', url: 'https://github.com/BrunoSobrino/openai-botwa'}}]
let templateMessage = { image: {url: 'https://www.mizanurrmizan.info/wp-content/uploads/2023/02/chatgpt.jpg'}, caption: textReply, footer: null, templateButtons: templateButtons, viewOnce: true };
conn.sendMessage(from, templateMessage, { quoted: msg });
/*var buttonReply = [
{ urlButton: { displayText: `𝙾𝚆𝙽𝙴𝚁 👑`, url: `https://wa.me/5219996125657` }},
{ urlButton: { displayText: `𝙶𝙸𝚃𝙷𝚄𝙱 🔗`, url: `https://github.com/BrunoSobrino/openai-botwa`}}]
tempButton(from, textReply, '', buttonReply)*/
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
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n${prefix + command} Good Feeling - Flo Rida*`)        
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${chats.replace(command, '')}`) 
let json = await res.json()
sendAud(`${json.result.audio}`)
break
case 'play2':
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n${prefix + command} Good Feeling - Flo Rida*`)        
let res2 = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${chats.replace(command, '')}`) 
let json2 = await res2.json()
let mediaa = await ytv('https://youtube.com/watch?v=' + json2.result.id, '360p')
sendVid(mediaa.dl_link, `${json2.result.thumbnail}`)
break    
case 'dall-e': case 'draw': 
if (!args[1]) return reply(`*[❗] Ingrese un texto el cual sera la tematica de la imagen y así usar la función de la IA Dall-E*\n\n*—◉ Ejemplos de peticions:*\n*◉ ${prefix + command} gatitos llorando*\n*◉ ${prefix + command} hatsune miku beso*`)    
try {       
const responsee = await openai.createImage({ prompt: chats.replace(command, ''), n: 1, size: "512x512", });    
sendImgUrl(responsee.data.data[0].url)        
} catch (jj) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + jj)       
try {      
sendImgUrl(`https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${chats.replace(command, '')}`)  
} catch (jj2) {
reply("*[❗] Error en el servidor 2, no se obtuvo ninguna imagen de la IA...*\n\n*—◉ Error:*\n" + jj2)        
}}
break
case 'chatgpt': case 'ia': 
if (!args[1]) return reply(`*[❗] Ingrese una petición o una orden para usar la funcion ChatGPT*\n\n*—◉ Ejemplos de peticions u ordenes:*\n*◉ ${prefix + command} Reflexion sobre la serie Merlina 2022 de netflix*\n*◉ ${prefix + command} Codigo en JS para un juego de cartas*`)           
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: chats.replace(command, ''), temperature: 0, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + qe)       
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chats}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qqe) {        
reply("*[❗] Error en el servidor 2, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + qqe)  
}} 
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
} catch (eee) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + eee)       
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (eeee) {        
reply("*[❗] Error en el servidor 2, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + eeee)  
}} 
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
