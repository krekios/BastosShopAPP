function showPage(pageId, element) {
    // 1. On cache toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. On affiche la page sur laquelle on a cliqué
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 3. On retire le style "actif" de tous les boutons de navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // 4. On ajoute le style "actif" au bouton cliqué
    element.classList.add('active');
    
    // Optionnel : fait vibrer légèrement le téléphone (si sur Telegram)
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}
function switchTab(tabName) {
    // 1. Gérer les boutons
    document.getElementById('btn-tab-panier').classList.remove('active');
    document.getElementById('btn-tab-commandes').classList.remove('active');
    
    // 2. Gérer les contenus
    document.getElementById('content-panier').classList.remove('active');
    document.getElementById('content-commandes').classList.remove('active');

    if (tabName === 'panier') {
        document.getElementById('btn-tab-panier').classList.add('active');
        document.getElementById('content-panier').classList.add('active');
    } else {
        document.getElementById('btn-tab-commandes').classList.add('active');
        document.getElementById('content-commandes').classList.add('active');
    }

    // Petit retour haptique pour le feeling "App"
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
}
