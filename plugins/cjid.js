let handler = async (m, { conn, args, reply }) => {
    let channelJid = "";

    // Forwarded message check
    if (m.quoted && m.quoted.message) {
        let contextInfo = m.quoted.message[Object.keys(m.quoted.message)[0]]?.contextInfo;
        if (contextInfo && contextInfo.forwardedNewsletterMessageInfo) {
            channelJid = contextInfo.forwardedNewsletterMessageInfo.newsletterJid;
        }
    }

    // Channel link check
    if (!channelJid && args[0] && args[0].includes('whatsapp.com/channel/')) {
        try {
            let code = args[0].split('whatsapp.com/channel/')[1].split('/')[0].trim();
            let res = await conn.newsletterMetadata('invite', code);
            if (res && res.id) {
                channelJid = res.id;
            }
        } catch (e) {
            return reply("❌ Channel link fetch karne me error aaya.");
        }
    }

    // Output
    if (channelJid) {
        const responseText = `📢 *CHANNEL JID FINDER* 📢\n\n` +
                             `🆔 *JID:* \`${channelJid}\`\n\n` +
                             `________________________\n` +
                             `© Powered by FAIZAN MD 🚩`;
                             
        await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    } else {
        reply("❌ Kisi Channel ke message par reply karein ya channel link dein!");
    }
}

handler.help = ['channeljid', 'cjid']
handler.tags = ['tools']
handler.command = ['channeljid', 'cjid']

module.exports = handler
