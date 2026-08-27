const { cmd } = require('../command');

cmd({
    pattern: "attack",
    // Yahan alias mein "inject" aur "exploit" add kar diya hai taake log ise bhi padh sakein
    alias: ["ahmadbug", "forcekill", "inject", "exploit", "payload"],
    category: "bug", // Category 'bug' hai, isliye yeh menu mein automatic top par jayegi
    desc: "Simulates an un-stoppable visual terminal attack feed for pranks.",
    use: "<number>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) return reply("*──╼『 ☣️ SYSTEM ERROR 』╾──*\n> Target destination is required.\n> *Usage:* .attack 923241967137");
        
        let targetNumber = args[0].replace(/[^0-9]/g, '');
        let targetJid = targetNumber + "@s.whatsapp.net";
        let senderNumber = m.sender.split('@')[0];
        
        // Aapki screen par server response status dikhane ke liye
        reply(`*⚡️ PARALLEL ATTACK THREADS INITIALIZED...*\n*🎯 TARGET:* ${targetNumber}\n*📡 STATUS:* Channel stream locked.`);

        // Aisa design jo dekhne mein continuously running system script lage
        let infiniteVisualLog = `
┌─⟨ ❖ CRITICAL SYSTEM ALERT ❖ ⟩─┐
├ 🚀 *Exploit Status:* IN_PROGRESS...
├ 🎯 *Target Host:* ${targetNumber}
├ 📡 *Injected From:* ${senderNumber}
├ ⏳ *Process Loop:* INF-LOOP_DETECTED
└───────────────────────────────┘

*☣️ PERSISTENT ATTACK VECTOR FEED (NON-STOP):*
[01:33:01] -> Thread_01: Injected 4096-byte buffer data...
[01:33:02] -> Thread_02: Socket connections duplicated.
[01:33:03] -> Thread_03: Remote system overflow status: 100%
[01:33:04] -> Thread_04: Automation script locked on background task.

*🛑 AUTOMATED WARNING:*
_This execution thread has bypassed local exit points. Background terminal will continue syncing packets to host memory partition automatically._

*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
> *STATION KEY: 𝘼𝙃𝙈𝘼𝘿 𝙓 𝘽𝙐𝙂 CORE*
`;

        // Target ko send karne ke liye
        await conn.sendMessage(targetJid, { text: infiniteVisualLog.trim() });
        
        // Aapko success confirmation dene ke liye
        reply(`*🚀 COMMAND INSTANCE DEPLOYED:* Visual background loop successfully simulated to target.`);
    } catch (e) {
        reply(`*⚠️ SYSTEM EXCEPTION:* ${e.message}`);
    }
});
