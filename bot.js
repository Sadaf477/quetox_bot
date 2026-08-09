const TelegramBot = require('node-telegram-bot-api');

// Dono cheezein Environment se le rahe hain
const token = process.env.BOT_TOKEN;
const PREMIUM_LINK = process.env.PREMIUM_LINK;

const bot = new TelegramBot(token, {polling: true});

let userState = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userState[chatId] = {step: 'ask_id'};
  bot.sendMessage(chatId, '👋 Welcome!\n\nPremium access ke liye apni Quotex ID bhejo');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(!userState[chatId]) return;

  if(userState[chatId].step === 'ask_id'){
    userState[chatId].quotexId = text;
    userState[chatId].step = 'ask_deposit';
    bot.sendMessage(chatId, `ID: ${text} save ho gayi ✅\n\nKya aapne $50 deposit kar diya hai?`, {
      reply_markup: {
        keyboard: [['Yes - Deposit Done'], ['No - Not Yet']],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  }

  else if(userState[chatId].step === 'ask_deposit'){
    if(text.includes('Yes')){
      bot.sendMessage(chatId, `✅ Verified\nYe raha apka Premium Link:\n${PREMIUM_LINK}\n\nEnjoy!`);
      userState[chatId] = null;
    }
    else if(text.includes('No')){
      bot.sendMessage(chatId, `❌ Sorry\nDeposit na karne ki waja se access remove kar di gayi.`);
      userState[chatId] = null;
    }
  }
});

console.log('Bot chal gaya ✅');
