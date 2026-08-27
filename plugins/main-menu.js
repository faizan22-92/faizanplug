const config = require('../config');
const { cmd, commands } = require('../command');
const path = require('path');
const os = require("os");
const fs = require('fs');
const { runtime } = require('../lib/functions');
const axios = require('axios');

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

// --- FAIZAN CATEGORY STYLE ---
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return ''; 
    
    let title = `\n╭━━━⪨ ⚡ *${category.toUpperCase()}* ⚡ ⪩━━━╮\n`;
    let body = validCmds.map(cmd => `  ⚡ ‣ \`.${toSmallCaps(cmd.pattern)}\``).join('\n');
    let footer = `\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n`;
    return `${title}${body}${footer}`;
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu"],
    category: "main",
    react: "🔥",
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

        const BOT_NAME = "FAIZAN-MD";
        const uptime = runtime(process.uptime());

        // --- FAIZAN INTERFACE DESIGN ---
        let dec = `
╭━━━⪨ ⚡ 𝐅𝐀𝐈𝐙𝐀𝐍 𝐌𝐃 ⚡ ⪩━━━╮
  
  👑 ‣ 𝐎𝐰𝐧𝐞𝐫  : ${config.OWNER_NAME || "Faizan"}
  ⏰ ‣ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptime}
  📂 ‣ 𝐂𝐦𝐝𝐬   : ${Object.keys(commands).length}
  🦋 ‣ 𝐌𝐨𝐝𝐞   : ${config.MODE || "Public"}
  💖 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬 : Active & Online 🔥

╰━━━━━━━━━━━━━━━━━━━━━━╯
${menuSections}
> ⚡ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ FAIZAN⚡*`;

        // Main Image Link
        const mainImage = "https://files.catbox.moe/12pwyf.jpg";

        // 1. Menu Image Send
        await conn.sendMessage(from, { 
            image: { url: mainImage },
            caption: dec.trim(), 
            contextInfo: { 
                mentionedJid: [m.sender], 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363430083423038@newsletter', 
                    newsletterName: "FAIZAN-MD TECH ⚡", 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: mek });

        // 2. Audio File Send
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe" },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: mek });

    } catch (e) { 
        reply(`⚠️ Error: ${e.message}`); 
    } 
});
                            
