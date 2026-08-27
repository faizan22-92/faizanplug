// QUEEN-MD

const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const fs = require('fs');
const path = require('path');
const os = require("os");
const axios = require('axios');

// 📌 Global Configuration
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

cmd({
    pattern: "help",
    alias: ["listcmd", "list", "h", "commands"],
    desc: "Show all available commands with descriptions",
    category: "main",
    react: "🎀",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(Boolean);
        const uptime = runtime(process.uptime());

        // Organize commands into categories with Queen Style
        let menuSections = '';
        categories.forEach(cat => {
            const catCmds = Object.values(commands).filter(c => c.category === cat);
            menuSections += formatCategory(cat, catCmds);
        });

        // --- CUTE PRINCESS INTERFACE DESIGN ---
        let menuText = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  👑 ‣ 𝐎𝐰𝐧𝐞𝐫  : ${config.OWNER_NAME || "Queen Owner"}
  ⏰ ‣ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptime}
  📂 ‣ 𝐂𝐦𝐝𝐬   : ${totalCommands}
  🦋 ‣ 𝐌𝐨𝐝𝐞   : ${config.MODE || "Public"}
  ⚙️ ‣ 𝐏𝐫𝐞𝐟𝐢𝐱 : [ ${config.PREFIX || "."} ]
  💖 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬 : Active & Cute 💕

╰━━━━━━━━━━━━━━━━━━━━━━╯
${menuSections}
> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        await conn.sendMessage(from, {
            image: { url: MAIN_IMAGE },
            caption: menuText.trim(),
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

    } catch (e) {
        console.error('Command List Error:', e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
