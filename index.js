"use strict";
const { default: makeWASocket, BufferJSON, initInMemoryKeyStore, DisconnectReason, AnyMessageContent, useMultiFileAuthState, delay, generateWAMessageFromContent, downloadContentFromMessage } = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
const { serialize, getBuffer } = require("./lib/myfunc");
const { color, mylog, infolog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let setting = JSON.parse(fs.readFileSync('./config.json'));
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ organization: setting.ORG_KEY, apiKey: setting.OPENAI_KEY, });
const openai = new OpenAIApi(configuration);
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
const { Low, JSONFile } = low
const path = require('path')
const lodash = require('lodash')
const _ = require('lodash')
const yargs = require('yargs/yargs')

function title() {
      console.clear()
	  console.log(chalk.bold.green(figlet.textSync('Bot OpenAI', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`\n              ${chalk.yellow('[ Editado By BrunoSobrino ]')}\n\n${chalk.red('Bot OpenAI')} : ${chalk.white('WhatsApp Bot OpenAI')}\n${chalk.red('Contactame por WhatsApp')} : ${chalk.white('+52 1 999 612 5657')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

/*-------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */  
/*                                                       */ 
/*       |- [ ⚠ ] - CREDITOS DEL CODIGO - [ ⚠ ] -|      */
/*     —◉ DESAROLLADO POR OTOSAKA:                       */
/*     ◉ Otosaka (https://github.com/6otosaka9)          */
/*     ◉ Número: wa.me/51993966345                       */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ BrunoSobrino (https://github.com/BrunoSobrino)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/*-------------------------------------------------------*/
global.chatgpt = new Low(new JSONFile(path.join(__dirname, '/db/chatgpt.json')));
global.loadChatgptDB = async function loadChatgptDB() {
    if(global.chatgpt.READ) return new Promise((resolve) => setInterval(async function() {
        if(!global.chatgpt.READ) {
            clearInterval(this);
            resolve(global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data);
        }
    }, 1 * 1000));
    if(global.chatgpt.data !== null) return;
    global.chatgpt.READ = true;
    await global.chatgpt.read().catch(console.error);
    global.chatgpt.READ = null;
    global.chatgpt.data = {
        users: {},
        ...(global.chatgpt.data || {})
    };
    global.chatgpt.chain = lodash.chain(global.chatgpt.data);
};

loadChatgptDB();   


global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    chats: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

async function fanStart() {
const connectToWhatsApp = async () => {
	const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
	const conn = makeWASocket({
        printQRInTerminal: true,
        logger: logg({ level: 'fatal' }),
        auth: state,
	patchMessageBeforeSending: (message) => {
        const requiresPatch = !!( message.buttonsMessage || message.templateMessage || message.listMessage );
        if (requiresPatch) { message = { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {}, }, ...message, },},};}
        return message;},	
        browser: ["OpenAI BOT", "Safari", "3.0"],
	getMessage: async key => {
            return {
                
            }
        }
    })
	title()
	
	/* Auto Update */
	require('./lib/myfunc')
	require('./message/msg')
	nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" ha sido actualizado!`)))
	nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" ha sido actualizado!`)))
	
	conn.multi = true
	conn.nopref = false
	conn.prefa = 'anjing'
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		try { if (msg.message.messageContextInfo) delete msg.message.messageContextInfo } catch { }
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5')
		require('./message/msg')(conn, msg, m, openai)
/*-------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */  
/*                                                       */ 
/*       |- [ ⚠ ] - CREDITOS DEL CODIGO - [ ⚠ ] -|      */
/*     —◉ DESAROLLADO POR OTOSAKA:                       */
/*     ◉ Otosaka (https://github.com/6otosaka9)          */
/*     ◉ Número: wa.me/51993966345                       */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ BrunoSobrino (https://github.com/BrunoSobrino)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/*-------------------------------------------------------*/		
	        let senderJid;
                if (msg.isGroup) {
                senderJid = msg.key.participant;
                } else {
                senderJid = msg.sender;}
	        let Dchats = global.db.data.chats[senderJid]
                if (typeof Dchats !== 'object') global.db.data.chats[senderJid] = {}
                if (Dchats) {
                if (!('mute' in Dchats)) Dchats.mute = false
                } else global.db.data.chats[senderJid] = {
                mute: false
                }		
                if (global.chatgpt.data === null) await global.loadChatgptDB();
                let chatgptUser = global.chatgpt.data.users[senderJid];
                if (typeof chatgptUser !== 'object') global.chatgpt.data.users[senderJid] = [];        
              })
	conn.ev.on('connection.update', (update) => {
          if (global.qr !== update.qr) {
           global.qr = update.qr
          }
          const { connection, lastDisconnect } = update
            if (connection === 'close') {
                lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : console.log('connection logged out...')
            }
            if (update.qr != 0 && update.qr != undefined) {
                console.log(chalk.yellow('🚩ㅤEscanea este codigo QR, el codigo QR expira en 60 segundos.'))
            }
            if (connection == 'open') {
                console.log(chalk.yellow('❧ Bot Activo y Funcionando Correctamente ✅\n'))
            }        
            })
	
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
}, 30 * 1000)	
	
conn.ev.on('group-participants.update', async (anu) => {
try {
let metadata = await conn.groupMetadata(anu.id)
let participants = anu.participants
let ppuser
let ppgroup
for (let num of participants) {
try {    
ppuser = await conn.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://i.ibb.co/sbqvDMw/avatar-contact-large-v2.png'} 
try {
ppgroup = await conn.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png'}
let memb = metadata.participants.length
let PPWlcm = await getBuffer(ppuser)
let PPLft = await getBuffer(ppuser)
const time = moment().format('HH:mm:ss')
const date = moment().format('DD/MM/YYYY')
const memberss = metadata.participants.length
const descgc = metadata.desc?.toString() || '*𝚂𝙸𝙽 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽*'
const usertag = `@${num.split("@")[0]}`
const namegc = metadata.subject
let qfake = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${num.split('@')[0]}:${num.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (anu.action == 'add') {
let captionwel = '*╔══════════════*\n*╟❧* @subject\n*╠══════════════*\n*╟❧ @user*\n*╟❧ BIENVENIDO(A)* \n*║*\n*╟❧ LEE LA DESCRIPCIÓN DEL GRUPO!*\n*║*\n*╟❧ DISFRUTA TU ESTADÍA!!*\n*╚══════════════*'
let captionwel2 = captionwel.replace('@user', usertag).replace('@subject', namegc).replace('@desc', descgc)
conn.sendMessage(anu.id, { image: PPWlcm, caption: captionwel2, mentions: [num]}, { quoted: qfake })                  
} else if (anu.action == 'remove') {
let captionbye = '*╔══════════════*\n*╟❧* @user\n*╟❧ HASTA PRONTO 👋🏻* \n*╚══════════════*' 
let captionbye2 = captionbye.replace('@user', usertag)
conn.sendMessage(anu.id, { image: PPLft, caption: captionbye2, mentions: [num]}, { quoted: qfake })                    
}}} catch (e) {
console.log(e)}})
	
	conn.ev.on('creds.update', await saveCreds)

	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })
    
	/*conn.sendMessageFromContent = async(jid, message, options = {}) => {
		var option = { contextInfo: {}, ...options }
		var prepare = await generateWAMessageFromContent(jid, message, option)
		await conn.relayMessage(jid, prepare.message, { messageId: prepare.key.id })
		return prepare
	 }*/
	
	 conn.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
		if (type_file === 'image') {
		var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(path_file, buffer)
		return path_file
		} else if (type_file === 'video') {
		var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
		  buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(path_file, buffer)
		return path_file
		} else if (type_file === 'sticker') {
		var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(path_file, buffer)
		return path_file
		} else if (type_file === 'audio') {
		var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(path_file, buffer)
		return path_file
		}
		}
		conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
			let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
			let buffer
			if (options && (options.packname || options.author)) {
			buffer = await writeExifImg(buff, options)
			} else {
			buffer = await imageToWebp(buff)
			}
			await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
			.then( response => {
			fs.unlinkSync(buffer)
			return response
			})
			}
	
	return conn
}

connectToWhatsApp()
.catch(err => console.log(err))
}

fanStart()
