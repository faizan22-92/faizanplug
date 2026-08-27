const { cmd, commands } = require('../command');
const os = require("os");
const config = require('../config');

// 📌 Global Configuration
const CHANNEL_JID = '120363429017707564@newsletter';
const CHANNEL_NAME = "QUEEN-MD TECH 🦋";
const MAIN_IMAGE = "https://files.catbox.moe/15j4gb.jpg";

cmd({
    pattern: "alive",
    alias: ["bot", "online"],
    desc: "Check uptime and system status",
    category: "main",
    react: "🎀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // ⏳ Initial React
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${secs}s`;
        };

        const uptime = formatUptime(process.uptime());
        const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const platform = os.platform();

        // CUTE QUEEN INTERFACE DESIGN
        const status = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  👑 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬   : Active & Cute 💕
  ⏰ ‣ 𝐔𝐩𝐭𝐢𝐦𝐞   : ${uptime}
  📟 ‣ 𝐑𝐀𝐌      : ${RAM} MB
  💻 ‣ 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦 : ${platform}
  🦋 ‣ 𝐌𝐨𝐝𝐞     : VIP Princess

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        // Image with Caption send karna
        await conn.sendMessage(from, { 
            image: { url: MAIN_IMAGE },
            caption: status.trim(),
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

        // ✅ Success React
        await conn.sendMessage(from, { react: { text: '🎀', key: m.key } });

    } catch (e) {
        console.error("Error in alive command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`⚠️ System Error: ${e.message}`);
    }
});
