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
let cart = [];

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    
    // Notification Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    
    if (cart.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="duck-icon">🐥</div><p>Votre panier est vide</p></div>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';
    list.innerHTML = ''; // On vide pour reconstruire
    
    cart.forEach((item, index) => {
        list.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff453a;">Supprimer</button>
            </div>
        `;
    });
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function validerCommande() {
    let message = "Nouvelle commande :\n";
    cart.forEach(item => message += "- " + item.name + "\n");
    
    alert("Commande envoyée ! \n" + message);
    // Ici on pourra plus tard envoyer un message direct au bot
}
let currentProduct = {}; // Pour stocker le produit ouvert

function openProduct(name, farm, tag, img, desc) {
    currentProduct = { name, farm };
    
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    document.getElementById('detail-tag').innerText = tag;
    document.getElementById('detail-img').src = img;
    document.getElementById('detail-desc').innerText = desc;
    
    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
}

function addToCartDetailed(poids, prix) {
    const productName = `${currentProduct.name} (${poids})`;
    addToCart(productName, prix); // On réutilise ta fonction de panier
    
    // Optionnel : fermer la page après l'ajout
    closeProduct();
    
    // Petit message de succès
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`Ajouté : ${productName} au panier !`);
    }
}
