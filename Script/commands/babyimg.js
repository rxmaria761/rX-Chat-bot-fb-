const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "babyimg",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "RX Abdullah",
  description: "Send image as reply to trigger word",
  commandCategory: "auto",
  usages: "",
  cooldowns: 0,
  prefix: false
};

const imageTriggers = [
  {
    keywords: ["khabo", "khuda lagse"],
    imageUrl: "https://i.postimg.cc/x8p156pR/8c3b955e8309b478efc1073e09f72075.jpg",
    reply: "🍽️ 😋",
    fileName: "khabo.jpg"
  },
  {
    keywords: ["holpagol", "sex"],
    imageUrl: "https://i.postimg.cc/Vs26JVMf/e052f3e1f21ab2d1c07312c720eda6ae.jpg",
    reply: "🌙 boka nki 😴",
    fileName: "gumkorefela.jpg"
  }
];

module.exports.handleEvent = async function({ api, event }) {
  const msg = event.body?.toLowerCase();
  if (!msg) return;

  for (const trigger of imageTriggers) {
    if (trigger.keywords.some(k => msg.includes(k))) {
      const filePath = path.join(__dirname, trigger.fileName);
      try {
        const res = await axios.get(trigger.imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

        api.sendMessage({
          body: trigger.reply,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID); // ✅ reply to user
      } catch (err) {
        console.log(`❌ Failed to send image for ${trigger.keywords[0]}:`, err.message);
      }
      return;
    }
  }
};

module.exports.run = () => {};
