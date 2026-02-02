const { Telegraf } = require('telegraf');
const config = require('./config.js');

const bot = new Telegraf(config.TOKEN);
const MON_ID_PERSONNEL = config.MY_ID;

bot.start((ctx) => ctx.reply('Bastos Bot est vivant ! 🚀'));

bot.on('web_app_data', (ctx) => {
    try {
        // On reçoit les données de la Mini App
        const data = JSON.parse(ctx.webAppData.data.json_string); // Version corrigée pour Telegraf
        
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

        // Envoie la commande à l'admin
        bot.telegram.sendMessage(MON_ID_PERSONNEL, messageCommande, { parse_mode: 'Markdown' });

        // Répond au client
        ctx.reply("✅ Ta commande a été envoyée avec succès !");
        
    } catch (err) {
        console.error("Erreur réception commande:", err);
        ctx.reply("❌ Erreur lors de la réception de la commande.");
    }
});

// Lancement unique du bot
bot.launch().then(() => {
    console.log("🚀 Le bot BASTOS SHOP est en ligne et attend les commandes...");
}).catch((err) => {
    console.error("❌ ERREUR DE LANCEMENT :", err.message);
});
