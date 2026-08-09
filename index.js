const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// YAHAN APNA QUOTEX REFERRAL LINK DALO
const QUOTEX_REF_LINK = "https://broker-qx.pro/sign-up/?lid=2225212"; 
// YAHAN APNA PREMIUM GROUP LINK DALO
const PREMIUM_GROUP_LINK = "https://t.me/+Y0NDuVj7CiM4Yzc0";

bot.start((ctx) => {
    ctx.reply(`Salam! 👋

Ziddi Premium Join karne ke liye ye 2 step hain:

Step 1: Is link se Quotex Account banao / Login karo
${QUOTEX_REF_LINK}

Step 2: Login ke baad apni Quotex ID yahan bhej do
Example: 91877382

60 second me Premium Group ka link mil jayega ✅`);
});

bot.on('text', async (ctx) => {
    const quotexId = ctx.message.text.trim();
    
    // Sirf number wali ID check
    if(!isNaN(quotexId) && quotexId.length > 5){
        await ctx.reply(`✅ ID mil gayi: ${quotexId}

⏳ Verify ho rahi hai... 60 second wait karo`);

        // 1 minute baad isi chat me link
        setTimeout(async () => {
            await ctx.reply(`🎉 Verify ho gayi!

Ye raha Tumhara Premium Group Link:
${PREMIUM_GROUP_LINK}

Welcome to Ziddi Premium ✅
Note: Bina $50 deposit ke kick kar diya jayega`);
        }, 60000); // 60 second
        
    }
});

bot.launch();
console.log('Bot Started ✅');
