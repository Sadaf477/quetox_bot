const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN); // <-- ye line miss thi
const PREMIUM_LINK = "https://t.me/+xxxxxxx"; // Apna group link yahan dalo

bot.start((ctx) => ctx.reply('Salam! Apni Quotex ID bhejo'));

bot.on('text', async (ctx) => {
    const quotexId = ctx.message.text.trim();
    
    // Sirf number check
    if(!isNaN(quotexId) && quotexId.length > 5){
        await ctx.reply(`✅ ID Save: ${quotexId}\n\n⏳ 60 second me Premium link aa jayega...`);
        
        setTimeout(async () => {
            await ctx.reply(`🎉 Mubarak ho!\n\nPremium Group Link:\n${PREMIUM_LINK}\n\nWelcome to Ziddi Premium ✅`);
        }, 60000); // 1 minute
        
    } else {
        await ctx.reply('Please sahi Quotex ID bhejo. Sirf number');
    }
});

bot.launch();
console.log('Bot Started ✅');
