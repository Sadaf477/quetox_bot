const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const TOKEN = process.env.BOT_TOKEN;
const PREMIUM_GROUP_LINK = 'https://t.me/+Y0NDuVj7CiM4Yzc0'; // yahan apna group link
const MIN_DEPOSIT = 50;
const bot = new TelegramBot(TOKEN, {polling: true});

let users = {}; // { "quotex_id": chat_id }

// Step 1: User bot ko /start karega
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome! 👋
Quotex me kam se kam $${MIN_DEPOSIT} deposit karo.

Phir apni Quotex User ID yahan bhej do.
Deposit confirm hote hi Premium Group ka link mil jayega.`);
  
  bot.once('message', (msg2) => {
    const qid = msg2.text.trim();
    users[qid] = msg.chat.id;
    bot.sendMessage(msg.chat.id, `✅ ID Save ho gayi: ${qid}
$${MIN_DEPOSIT}+ deposit pe link auto DM ho jayega.`);
  });
});

// Step 2: Quotex Postback yahan aayega - GET method
app.get('/check', (req, res) => {
  const { user_id, status, amount } = req.query; // GET me query use hota hai
  const depositAmount = parseFloat(amount) || 0;

  console.log(`Postback aya: ID=${user_id}, Status=${status}, Amount=${depositAmount}`);

  if(status === 'deposit' && depositAmount >= MIN_DEPOSIT && users[user_id]){
    bot.sendMessage(users[user_id], `🎉 Mubarak ho! $${depositAmount} Deposit Confirm.
Yeh lo Premium Group ka link: ${PREMIUM_GROUP_LINK}`);
  }

  res.send('OK'); // Quotex ko 200 OK chahiye
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on ${PORT}`));
