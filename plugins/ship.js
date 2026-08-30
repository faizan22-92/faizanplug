// Command: .ship @user1 @user2 (ya sirf .ship @user1)
case 'ship': {
    let member1, member2;
    
    // Tagged members check karna
    if (mentionedJid.length >= 2) {
        member1 = mentionedJid[0];
        member2 = mentionedJid[1];
    } else if (mentionedJid.length === 1) {
        member1 = sender; // Command bhejney wala
        member2 = mentionedJid[0];
    } else {
        return reply("❌ Kisi do logon ko tag karein! Example: `.ship @user1 @user2`");
    }

    // Random percentage generate karna
    const percentage = Math.floor(Math.random() * 101);

    // Progress bar banana (10 blocks)
    const filledBlocks = '█'.repeat(Math.round(percentage / 10));
    const emptyBlocks = '░'.repeat(10 - Math.round(percentage / 10));
    const progressBar = `[${filledBlocks}${emptyBlocks}]`;

    // Percentage ke hisaab se fun comments
    let comment = '';
    if (percentage < 25) comment = "💔 Koi chance nahi hai, door raho!";
    else if (percentage < 50) comment = "😐 Sirf achhe dost ban sakte hain.";
    else if (percentage < 75) comment = "😉 Baat ban sakti hai, try karte raho!";
    else comment = "🔥 Perfect Match! Shadi ki tayyari karo! 💍";

    // Result Message (Footer ke sath)
    const text = `💖 *SHIP MATCHMAKER* 💖\n\n` +
                 `👤 *@${member1.split('@')[0]}*\n` +
                 `   ➕\n` +
                 `👤 *@${member2.split('@')[0]}*\n\n` +
                 `📊 *Match:* ${percentage}%\n` +
                 `${progressBar}\n\n` +
                 `💬 *Verdict:* ${comment}\n\n` +
                 `________________________\n` +
                 `© Powered by FAIZAN MD 🚩`;

    await conn.sendMessage(from, { 
        text: text, 
        mentions: [member1, member2] 
    }, { quoted: m });
    break;
}
