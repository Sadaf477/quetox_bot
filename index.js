const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

app.use(express.json());

// Railway ke Variables yahan se uthenge
const TOKEN = process.env.TOKEN; 
const PREMIUM_GROUP_LINK = process.env.PREMIUM_LINK;
const MIN_DEPOSIT = 50;

// Token check
if (!TOKEN) {
    console.error("ERROR: TOKEN not found in Environment Variables!");
    process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Database: temp memory. Railway restart hone pe data ud jayega
const users = {}; 

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome! Pehle apni Quotex User ID bhejo.\nExample: 12345678`);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if (text === '/start') return;

    if (!isNaN(text) && text.length > 5) {
        users[chatId] = { quotex_id: text, deposited: false };
        bot.sendMessage(chatId, `✅ ID Save ho gayi: ${text}\n\nAb deposit karo. Deposit hote hi group link mil jayega.`);
    }
});

// Quotex ka Postback yahan aayega
app.get('/check', (req, res) => {
    const { user_id, status, amount } = req.query;
    
    console.log(`Postback aya: ID=${user_id}, Status=${status}, Amount=${amount}`);

    const chatId = Object.keys(users).find(key => users[key].quotex_id === user_id);

    if (chatId && status === 'deposit' && parseFloat(amount) >= MIN_DEPOSIT) {
        users[chatId].deposited = true;
        bot.sendMessage(chatId, `🎉 Mubarak ho! Deposit confirm ho gaya.\n\nPremium Group Join karo:\n${PREMIUM_GROUP_LINK}`);
    }
    
    res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
