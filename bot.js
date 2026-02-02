const { Telegraf } = require('telegraf');
const config = require('./config.js'); 

const bot = new Telegraf(config.TOKEN);
const MON_ID_PERSONNEL = config.MY_ID;

bot.on('web_app_data', (ctx) => {
    // On reçoit les données JSON de ta Mini App
    const data = JSON.parse(ctx.webAppMessage.text);
    
    const messageCommande = `
🛍️ **NOUVELLE COMMANDE BASTOS SHOP**
━━━━━━━━━━━━━━━━━━
👤 **Client :** @${ctx.from.username || ctx.from.first_name}
🆔 **ID :** ${ctx.from.id}

📋 **DÉTAILS :**
${data.recapitulatif}

💰 **TOTAL À PAYER : ${data.total}€**
━━━━━━━━━━━━━━━━━━
📅 _Le ${data.date}_
    `;

    // Le bot t'envoie la commande à TOI
    ctx.telegram.sendMessage(MON_ID_PERSONNEL, messageCommande, { parse_mode: 'Markdown' });

    // Le bot répond au client dans la conversation
    ctx.reply("✅ Ta commande a été envoyée !");
});

bot.launch();
console.log("🚀 Le bot BASTOS SHOP est en ligne et attends les commandes...");
