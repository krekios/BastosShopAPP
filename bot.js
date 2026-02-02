const { Telegraf } = require('telegraf');

// 1. Remplace par le Token que BotFather t'a donné
const bot = new Telegraf('TON_TOKEN_BOT_ICI'); 

// 2. Remplace par ton ID récupéré à l'étape 1
const MON_ID_PERSONNEL = 'TON_ID_ICI'; 

bot.on('web_app_data', (ctx) => {
    // On reçoit les données JSON de ta Mini App
    const data = JSON.parse(ctx.webAppMessage.text);
    
    const messageCommande = `
🛍️ **NOUVELLE COMMANDE DRYPLUG**
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
    ctx.reply("✅ Ta commande a été envoyée ! Un vendeur va te contacter.");
});

bot.launch();
console.log("🚀 Le bot DryPlug est en ligne et écoute les commandes...");
