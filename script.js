function showPage(pageId, element) {
    // Cache toutes les pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Affiche la page demandée
    document.getElementById(pageId).classList.add('active');

    // Gère le style actif dans la barre de nav
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');
}
