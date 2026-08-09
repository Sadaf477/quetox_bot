const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const PREMIUM_LINK = "https://t.me/+xxxxxxx"; // YAHAN APNA GROUP LINK DALO

bot.start((ctx) => ctx.reply('Salam! \nApni Quotex ID bhejiye'));

bot.on('text', async (ctx) => {
    const quotexId = ctx.message.text.trim();
    
    if(!isNaN(quotexId) && quotexId.length > 5){
        await ctx.reply(`✅ ID Save: ${quotexId}\n\n⏳ 60 second me Premium link aa jayega...`);
        
        setTimeout(async () => {
            await ctx.reply(`🎉 Mubarak ho!\n\nPremium Group Link:\n${PREMIUM_LINK}\n\nRule: SL/TL lazmi\nWelcome to Ziddi Premium ✅`);
        }, 60000); // 60 second
        
    } else {
        await ctx.reply('Please sahi Quotex ID bhejo. Sirf number');
    }
});

bot.launch();
console.log('Bot Started ✅');
