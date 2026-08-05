const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const TOKEN = process.env.BOT_TOKEN;
const PREMIUM_GROUP_LINK = 'https://t.me/+Y0NDuVj7CiM4Yzc0'; // <-- yahan apna group link dalo
const MIN_DEPOSIT = 50;
const bot = new TelegramBot(TOKEN, {polling: true});

let users = {}; // { "quotex_id": chat_id }

// Step 1: User se ID lena
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome! 👋
Quotex me kam se kam $${MIN_DEPOSIT} deposit karo.
Phir apni Quotex User ID yahan bhej do.
Deposit check hote hi result mil jayega.`);
  
  bot.once('message', (msg2) => {
    const qid = msg2.text.trim();
    users[qid] = msg.chat.id;
    bot.sendMessage(msg.chat.id, `✅ ID Save ho gayi: ${qid}\nAb Quotex se deposit ka wait kar rahe hain...`);
  });
});

// Step 2: Quotex Postback yahan aayega
app.get('/check', (req, res) => {
  const { user_id, status, amount } = req.query; 
  const depositAmount = parseFloat(amount) || 0;
  const chatId = users[user_id];

  console.log(`Postback aya: ID=${user_id}, Status=${status}, Amount=${depositAmount}`);

  if(!chatId){
    console.log("ID bot me save nahi hai");
    return res.send('OK'); 
  }

  if(status === 'deposit' && depositAmount >= MIN_DEPOSIT){
    bot.sendMessage(chatId, `🎉 Mubarak ho! $${depositAmount} Deposit Confirm.\nYeh lo Premium Group ka link: ${PREMIUM_GROUP_LINK}`);
  } else if(status === 'deposit') {
    bot.sendMessage(chatId, `❌ Deposit kam hai.\nAapka deposit: $${depositAmount}\nPremium Group ke liye kam se kam $${MIN_DEPOSIT} zaroori hai.`);
  }

  res.send('OK'); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on ${PORT}`));
