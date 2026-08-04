const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TRADE_LINK = 'https://quetox.com/trade';
const bot = new TelegramBot(TOKEN, {polling: true});

let users = {}; // { "quetox_id": chat_id }

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Salam! 👋
Quetox Auto Link Bot me welcome.

Deposit ka auto link pane ke liye apni Quetox User ID bhej do.`);

  bot.once('message', (msg2) => {
    const qid = msg2.text.trim();
    users[qid] = msg.chat.id;
    bot.sendMessage(msg.chat.id, `✅ ID Save: ${qid}
Jese hi deposit hoga, link yahin DM ho jayega.`);
  });
});

// Ye URL Quetox me lagana hai
app.post('/webhook', (req, res) => {
  const { user_id, status } = req.body;

  if(status === 'deposit' && users[user_id]){
    bot.sendMessage(users[user_id], `🎉 Mubarak ho! Deposit Confirm hua.
Yeh lo trading link: ${TRADE_LINK}`);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on ${PORT}`));
