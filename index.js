const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TRADE_LINK = 'https://quetox.com/trade';
const MIN_DEPOSIT = 50; // yahan se amount change kar sakte ho
const bot = new TelegramBot(TOKEN, {polling: true});

let users = {}; // { "quetox_id": chat_id }

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Salam! 👋
Quetox Auto Link Bot me welcome.

${MIN_DEPOSIT}$ ya usse zyada deposit pe auto trading link pane ke liye apni Quetox User ID bhej do.`);

  bot.once('message', (msg2) => {
    const qid = msg2.text.trim();
    users[qid] = msg.chat.id;
    bot.sendMessage(msg.chat.id, `✅ ID Save: ${qid}
${MIN_DEPOSIT}$+ deposit hone pe link yahin DM ho jayega.`);
  });
});

// IMPORTANT: Quetox se user_id, status, amount teeno bhejne hain
app.post('/webhook', (req, res) => {
  const { user_id, status, amount } = req.body;
  const depositAmount = parseFloat(amount) || 0;

  if(status === 'deposit' && depositAmount >= MIN_DEPOSIT && users[user_id]){
    bot.sendMessage(users[user_id], `🎉 Mubarak ho! $${depositAmount} Deposit Confirm hua.
Yeh lo trading link: ${TRADE_LINK}`);
  }

  // Agar kam deposit hua to usko bata do
  else if(status === 'deposit' && depositAmount < MIN_DEPOSIT && users[user_id]){
    bot.sendMessage(users[user_id], `Deposit: $${depositAmount} received.
${MIN_DEPOSIT}$+ pe trading link activate hoga.`);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on ${PORT}`));
