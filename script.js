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
