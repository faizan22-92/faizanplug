const fs = require("fs");
const config = require("../config");
const { cmd, commands } = require("../command");
const path = require('path');
const axios = require("axios");

// 📌 Global Configuration
const CHANNEL_JID = '120363429017707564@newsletter';
const CHANNEL_NAME = "QUEEN-MD TECH 🦋";
const MAIN_IMAGE = "https://files.catbox.moe/15j4gb.jpg";

// --- PRIVACY MENU COMMAND ---
cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "setting",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        let privacyMenu = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  🔐 ‣ 𝐏𝐫𝐢𝐯𝐚𝐜𝐲 𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬 𝐌𝐞𝐧𝐮
  
  🌸 ‣ \`.blocklist\` - View blocked users
  🌸 ‣ \`.getbio\` - Get user's bio
  🌸 ‣ \`.setppall\` - Set profile pic privacy
  🌸 ‣ \`.setonline\` - Set online privacy
  🌸 ‣ \`.setname\` - Change bot's name
  🌸 ‣ \`.updatebio\` - Change bot's bio
  🌸 ‣ \`.groupsprivacy\` - Set group add privacy
  🌸 ‣ \`.getprivacy\` - View privacy settings

  📌 *Options for privacy commands:*
  • \`all\` - Everyone
  • \`contacts\` - My contacts only
  • \`contact_blacklist\` - Except blocked
  • \`none\` - Nobody
  • \`match_last_seen\` - Match last seen

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        await conn.sendMessage(
            from,
            {
                image: { url: MAIN_IMAGE },
                caption: privacyMenu.trim(),
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
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// --- BLOCKLIST COMMAND ---
cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "setting",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { isCreator, reply }) => {
    if (!isCreator) return reply("⚠️ *You are not the owner!*");

    try {
        const blockedUsers = await conn.fetchBlocklist();

        if (blockedUsers.length === 0) {
            return reply("📋 Your block list is empty.");
        }

        const list = blockedUsers
            .map((user) => `🚧 BLOCKED: ${user.split('@')[0]}`)
            .join('\n');

        const count = blockedUsers.length;
        
        let blockMsg = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  🚫 ‣ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 𝐔𝐬𝐞𝐫𝐬 : ${count}

${list}

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        reply(blockMsg.trim());
    } catch (err) {
        console.error(err);
        reply(`⚠️ Failed to fetch block list: ${err.message}`);
    }
});

// --- GETBIO COMMAND ---
cmd({
    pattern: "getbio",
    desc: "Displays the user's bio.",
    category: "setting",
    react: "🌸",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await conn.fetchStatus?.(jid);
        if (!about) return reply("⚠️ No bio found.");
        
        let bioMsg = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  📝 ‣ 𝐔𝐬𝐞𝐫 𝐁𝐢𝐨 :
  ${about.status}

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        return reply(bioMsg.trim());
    } catch (error) {
        console.error("Error in bio command:", error);
        reply("⚠️ No bio found.");
    }
});

// --- SET PROFILE PIC PRIVACY ---
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("⚠️ You are not the owner!");
    
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];  
        
        if (!validValues.includes(value)) {
            return reply("⚠️ Invalid option. Options: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }
        
        await conn.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy updated to: \`${value}\``);
    } catch (e) {
        return reply(`⚠️ Error: ${e.message}`);
    }
});

// --- SET ONLINE PRIVACY ---
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("⚠️ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'match_last_seen'];
        
        if (!validValues.includes(value)) {
            return reply("⚠️ Invalid option. Options: 'all', 'match_last_seen'.");
        }

        await conn.updateOnlinePrivacy(value);
        reply(`✅ Online privacy updated to: \`${value}\``);
    } catch (e) {
        return reply(`⚠️ Error: ${e.message}`);
    }
});

// --- SET NAME ---
cmd({
    pattern: "setname",
    desc: "Set your WhatsApp display name.",
    category: "setting",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { isCreator, reply, args }) => {
    if (!isCreator) return reply("⚠️ You are not the owner!");

    const displayName = args.join(" ");
    if (!displayName) return reply("⚠️ Please provide a display name.");

    try {
        await conn.updateProfileName(displayName);
        reply(`✅ Display name set to: *${displayName}*`);
    } catch (err) {
        console.error(err);
        reply("⚠️ Failed to set display name.");
    }
});

// --- UPDATE BIO ---
cmd({
    pattern: "updatebio",
    react: "💖",
    desc: "Change the Bot number Bio.",
    category: "setting",
    use: '.updatebio',
    filename: __filename
},
async (conn, mek, m, { q, isCreator, reply }) => {
    try {
        if (!isCreator) return reply('⚠️ *You must be an Owner to use this command*');
        if (!q) return reply('❓ *Enter the New Bio*');
        if (q.length > 139) return reply('❗ *Character limit exceeded (Max 139)*');
        await conn.updateProfileStatus(q);
        reply("✅ *New Bio Added Successfully 💕*");
    } catch (e) {
        reply('⚠️ Error: ' + e.message);
    }
});

// --- GROUPS PRIVACY ---
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("⚠️ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        
        if (!validValues.includes(value)) {
            return reply("⚠️ Invalid option. Options: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }

        await conn.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy updated to: \`${value}\``);
    } catch (e) {
        return reply(`⚠️ Error: ${e.message}`);
    }
});

// --- GET PRIVACY SETTINGS ---
cmd({
    pattern: "getprivacy",
    desc: "Get the bot Number Privacy Setting Updates.",
    category: "setting",
    use: '.getprivacy',
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) return reply('⚠️ *You must be an Owner to use this command*');
        const duka = await conn.fetchPrivacySettings?.(true);
        if (!duka) return reply('⚠️ *Failed to fetch privacy settings*');
        
        let puka = `
╭━━━⪨ 🎀 𝐐𝐔𝐄𝐄𝐍 𝐌𝐃 🎀 ⪩━━━╮
  
  ⚙️ ‣ 𝐑𝐞𝐚𝐝 𝐑𝐞𝐜𝐞𝐢𝐩𝐭 : ${duka.readreceipts}  
  🖼️ ‣ 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜   : ${duka.profile}  
  📝 ‣ 𝐒𝐭𝐚𝐭𝐮𝐬        : ${duka.status}  
  🟢 ‣ 𝐎𝐧𝐥𝐢𝐧𝐞        : ${duka.online}  
  ⏱️ ‣ 𝐋𝐚𝐬𝐭 𝐒𝐞𝐞𝐧     : ${duka.last}  
  👥 ‣ 𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐝     : ${duka.groupadd}  
  📞 ‣ 𝐂𝐚𝐥𝐥 𝐀𝐝𝐝      : ${duka.calladd}  

╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🎀 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ QUEEN🦋*`;

        await conn.sendMessage(from, { text: puka.trim() }, { quoted: mek });
    } catch (e) {
        reply('⚠️ Error: ' + e.message);
    }
});
