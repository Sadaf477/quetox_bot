const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

app.use(express.json());

// Railway ke Variables yahan se uthenge
const TOKEN = process.env.TOKEN;
const PREMIUM_GROUP_LINK = process.env.PREMIUM_LINK;
const MIN_DEPOSIT = 50;

// Token check
if (!TOKEN ||!PREMIUM_GROUP_LINK) {
    console.error("ERROR: TOKEN ya PREMIUM_LINK missing in Environment Variables!");
    process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Database: temp memory. Railway restart hone pe data ud jayega
// Production ke liye baad me MongoDB laga dena
const users = {};

// Step 1: /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome! Pehle apni Quotex User ID bhejo.\nExample: 12345678`);
});

// Step 2: Quotex ID save karo
bot.onText(/^\d{5,}$/, (msg) => {
    const chatId = msg.chat.id;
    const quotex_id = msg.text;

    users[chatId] = { quotex_id: quotex_id, deposited: false };
    bot.sendMessage(chatId, `✅ ID Save ho gayi: ${quotex_id}\n\nAb deposit karo. Deposit hote hi group link mil jayega.\n\nTumhara link:\nhttps://broker-qx.pro/sign-up/?lid=2225212&subid=${chatId}`);
});

// Step 3: Quotex ka Postback yahan aayega
app.get('/check', (req, res) => {
    const { user_id, status, amount } = req.query;

    console.log(`Postback aya: ID=${user_id}, Status=${status}, Amount=${amount}`);

    // Quotex ID se Telegram ChatID dhoondo
    const chatId = Object.keys(users).find(key => users[key].quotex_id === user_id);

    if (!chatId) {
        console.log(`ERROR: User ${user_id} nahi mila. Pehle /start karke ID bhejni hogi`);
        return res.status(404).send('User not found');
    }

    if (status === 'deposit' && parseFloat(amount) >= MIN_DEPOSIT) {
        if (!users[chatId].deposited) { // duplicate DM na jaye
            users[chatId].deposited = true;
            bot.sendMessage(chatId, `🎉 Mubarak ho! $${amount} Deposit confirm ho gaya.\n\nPremium Group Join karo:\n${PREMIUM_GROUP_LINK}`);
            console.log(`DM sent to ${chatId}`);
        }
    } else {
        console.log(`Deposit kam hai. Min: $${MIN_DEPOSIT}`);
    }

    res.send({status: "ok"});
});

app.get('/', (req, res) => {
    res.send('Bot is Live');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
