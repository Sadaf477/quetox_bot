bot.on('message', async (ctx) => {
    const quotexId = ctx.message.text;
    
    // Sirf number wali ID accept karo
    if(!isNaN(quotexId) && quotexId.length > 5){
        
        await ctx.reply(`✅ ID Save ho gayi: ${quotexId}
        
        ⏳ 1 minute me Premium Group ka link mil jayega...`);

        // 1 minute baad link bhej do
        setTimeout(async () => {
            await ctx.reply(`🎉 Mubarak ho!

Tumhara Premium Group Link:
https://t.me/+xxxxxxx

Welcome to Ziddi Premium ✅
Rule: Signals follow karo, SL/TL lazmi lagao`);
        }, 60000); // 60000ms = 1 minute
        
    } else {
        await ctx.reply('Please sahi Quotex ID bhejo');
    }
});
