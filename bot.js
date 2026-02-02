const { Telegraf } = require('telegraf');
const config = require('./config.js');

const bot = new Telegraf(config.TOKEN);
bot.start((ctx) => {
    return ctx.reply(
        `Bienvenue sur Bastos Shop ! 🌴\n\nClique sur le bouton ci-dessous pour ouvrir la boutique et passer commande.`,
        Markup.keyboard([
            [Markup.button.webApp('🚀 Ouvrir la Boutique', 'https://ton-lien-github.io/')]
        ]).resize() 
    );
});

bot.on('web_app_data', (ctx) => {
    try {
       
        const data = JSON.parse(ctx.webAppData.data.json_string); 
        
        const messageCommande = `
const messageCommande = `
🛍️ **NOUVELLE COMMANDE**
━━━━━━━━━━━━━━━━━━
👤 **Client :** @${ctx.from.username}
🆔 **ID :** ${ctx.from.id}

📋 **DÉTAILS :**
${data.recapitulatif}

🚀 **MODE : ${data.livraison}** <-- L'info apparaîtra ici !

💰 **TOTAL : ${data.total}**
━━━━━━━━━━━━━━━━━━
`;

      
        bot.telegram.sendMessage(MON_ID_PERSONNEL, messageCommande, { parse_mode: 'Markdown' });

        
        ctx.reply("✅ Ta commande a été envoyée avec succès !");
        
    } catch (err) {
        console.error("Erreur réception commande:", err);
        ctx.reply("❌ Erreur lors de la réception de la commande.");
    }
});


bot.launch().then(() => {
    console.log("🚀 Le bot BASTOS SHOP est en ligne et attend les commandes...");
}).catch((err) => {
    console.error("❌ ERREUR DE LANCEMENT :", err.message);
});
