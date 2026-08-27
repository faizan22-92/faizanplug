const config = require('../config');
const { cmd, commands } = require('../command');
const path = require('path');
const os = require("os");
const fs = require('fs');
const { runtime } = require('../lib/functions');
const axios = require('axios');

// Constant Channel JID & Name (Har jaga yahi use hoga)
const CHANNEL_JID = '120363429017707564@newsletter';
const CHANNEL_NAME = "QUEEN-MD TECH 🦋";
const MAIN_IMAGE = "https://files.catbox.moe/15j4gb.jpg";

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.toLowerCase().split('').map(char => smallCapsMap[char] || char).join('');
};

// --- CUTE QUEEN CATEGORY STYLE ---
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return ''; 
    
    let title = `\n╭━━━⪨ 🌸 *${category.toUpperCase()}* 🌸 ⪩━━━╮\n`;
    let body = validCmds.map(cmd => `  🌸 ‣ \`.${toSmallCaps(cmd.pattern)}\``).join('\n');
    let footer = `\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n`;
    return `${title}${body}${footer}`;
};

// --- PING COMMAND ---
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "🎀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🎀', '👑', '🌸', '🦋', '💖', '✨'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        const end = Date.now();
        const responseTime = end - start;

        const text = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  🌸 ‣ 𝐒𝐩𝐞𝐞𝐝 : \`${responseTime} ms\`
  🎀 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬 : Active & Cute 💕
  🦋 ‣ 𝐌𝐨𝐝𝐞   : VIP Princess
  💖 ‣ 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 : 100% Smooth

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        await conn.sendMessage(from, {
            text: text.trim(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// --- PING2 COMMAND ---
cmd({
    pattern: "ping2",
    desc: "Check bot's response time with dashboard view.",
    category: "main",
    react: "🦋",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 300));
        const endTime = Date.now();
        const ping = endTime - startTime;

        let status;
        let indicator;
        if (ping < 1000) {
            status = "𝐄𝐱𝐜𝐞𝐥𝐥𝐞𝐧𝐭";
            indicator = "🟢";
        } else if (ping < 1500) {
            status = "𝐆𝐨𝐨𝐝";
            indicator = "🟡";
        } else {
            status = "𝐋𝐚𝐠𝐠𝐲";
            indicator = "🔴";
        }

        const msg = `
╭━━━⪨ 🦋 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🦋 ⪩━━━╮
  
  📡 ‣ 𝐋𝐚𝐭𝐞𝐧𝐜𝐲 : \`${ping} ms\`
  🧠 ‣ 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 : ${status} ${indicator}
  ⚡ ‣ 𝐄𝐧𝐠𝐢𝐧𝐞  : Super Fast 💕
  👑 ‣ 𝐌𝐨𝐝𝐞    : VIP Active

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇ丁 ʙʏ QUEEN🦋*`;

        await conn.sendMessage(from, { 
            text: msg.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// --- MENU COMMAND ---
cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu"],
    category: "main",
    react: "🎀",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(Boolean);
        let menuSections = '';
        categories.forEach(cat => {
            const catCmds = Object.values(commands).filter(c => c.category === cat);
            menuSections += formatCategory(cat, catCmds);
        });

        const uptime = runtime(process.uptime());

        let dec = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  👑 ‣ 𝐎𝐰𝐧𝐞𝐫  : ${config.OWNER_NAME || "Queen Owner"}
  ⏰ ‣ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptime}
  📂 ‣ 𝐂𝐦𝐝𝐬   : ${Object.keys(commands).length}
  🦋 ‣ 𝐌𝐨𝐝𝐞   : ${config.MODE || "Public"}
  💖 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬 : Active & Cute 💕

╰━━━━━━━━━━━━━━━━━━━━━━╯
${menuSections}
> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        // 1. Menu Image Send
        await conn.sendMessage(from, { 
            image: { url: MAIN_IMAGE },
            caption: dec.trim(), 
            contextInfo: { 
                mentionedJid: [m.sender], 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: CHANNEL_JID, 
                    newsletterName: CHANNEL_NAME, 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: mek });

        // 2. Audio File Send
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/hoi9ur.mp3" },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: mek });

    } catch (e) { 
        reply(`⚠️ Error: ${e.message}`); 
    } 
});
