// ════════════════════════════════════════════════════════
// 🎵 PLAY / SONG COMMAND FIXED
// ✅ Stable Audio Downloader
// ⚡ Powered By AHMAD-MD
// ════════════════════════════════════════════════════════

const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "play",
    alias: ["song", "music", "play2"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        // ❌ No Query
        if (!q) {
            return reply(
                "🎵 Please provide a song name\n\nExample: .play Faded Alan Walker"
            );
        }

        // 🎶 Reaction
        await conn.sendMessage(from, {
            react: {
                text: "🎶",
                key: m.key
            }
        });

        // 🔍 Search YouTube
        const search = await yts(q);

        if (!search.videos || search.videos.length === 0) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });

            return reply("❌ No results found");
        }

        const video = search.videos[0];

        // 📥 API Request
        const api =
`https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(video.url)}`;

        const { data } = await axios.get(api, {
            timeout: 30000
        });

        console.log("API RESPONSE:", data);

        // 🎧 Audio URL Detect
        const audioUrl =
            data?.result?.audio ||
            data?.result?.url ||
            data?.audio ||
            data?.url ||
            data?.result?.mp3;

        // ❌ No Audio
        if (!audioUrl) {
            throw new Error("Audio URL not found");
        }

        // 🖼️ Song Info
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption:
`╭━━━〔 🎵 SONG DOWNLOADER 〕━━━⬣
┃
┃ 🎵 *Title:* ${video.title}
┃ 👤 *Author:* ${video.author?.name || "Unknown"}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃
┃ 📥 *Status:* Downloading...
┃
╰━━━━━━━━━━━━━━━━━━⬣

> Powered By 𝙌𝙐𝙀𝙀𝙉🦋`
        }, { quoted: mek });

        // 📥 Download Audio Buffer
        const audioBuffer = await axios.get(audioUrl, {
            responseType: "arraybuffer",
            timeout: 30000
        });

        // 📂 Temp File
        const filePath = path.join(__dirname, "temp_song.mp3");

        fs.writeFileSync(filePath, audioBuffer.data);

        // 🎧 Send Audio
        await conn.sendMessage(from, {
            audio: fs.readFileSync(filePath),
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`,
            ptt: false,

            contextInfo: {
                externalAdReply: {
                    title: video.title,
                    body: "YouTube Audio",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }

        }, { quoted: mek });

        // 🗑️ Delete Temp File
        fs.unlinkSync(filePath);

        // ✅ Success Reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {

        console.log("PLAY ERROR:", e);

        // ❌ Error Reaction
        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        reply("⚠️ Error while processing request");
    }

});

                    
