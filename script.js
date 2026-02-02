let cart = [];
let currentProduct = {}; 

// 1. NAVIGATION PRINCIPALE
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
    // Vibration légère pour Telegram
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// 2. ONGLETS PANIER / COMMANDES
function switchTab(tabName) {
    document.getElementById('btn-tab-panier').classList.remove('active');
    document.getElementById('btn-tab-commandes').classList.remove('active');
    document.getElementById('content-panier').classList.remove('active');
    document.getElementById('content-commandes').classList.remove('active');

    if (tabName === 'panier') {
        document.getElementById('btn-tab-panier').classList.add('active');
        document.getElementById('content-panier').classList.add('active');
    } else {
        document.getElementById('btn-tab-commandes').classList.add('active');
        document.getElementById('content-commandes').classList.add('active');
    }

    window.Telegram?.WebApp?.HapticFeedback.selectionChanged();
}

// 3. LOGIQUE DU PANIER
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    let total = 0;
    
    if (cart.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="duck-icon">🐥</div><p>Votre panier est vide</p></div>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';
    list.innerHTML = ''; 
    
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price}€</span>
                </div>
                <button onclick="removeItem(${index})" class="delete-btn">Supprimer</button>
            </div>
        `;
    });

    // Mise à jour du bouton avec le total cumulé
    footer.innerHTML = `<button class="tab-btn active" style="width:100%" onclick="validerCommande()">Valider la commande (${total}€)</button>`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 4. OUVERTURE PRODUIT (Version Corrigée et Unique)
function openProduct(name, farm, tag, mediaUrl, desc, isVideo = false) {
    currentProduct = { name, farm };
    
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    document.getElementById('detail-tag').innerText = tag;
    document.getElementById('detail-desc').innerText = desc;

    const vNode = document.getElementById('detail-video');
    const iNode = document.getElementById('detail-img');

    if(isVideo) {
        iNode.style.display = "none";
        vNode.style.display = "block";
        vNode.src = mediaUrl; 
        vNode.load(); // Recharge le média pour éviter l'écran noir
        vNode.play().catch(e => console.log("Lecture auto bloquée : ", e));
    } else {
        vNode.style.display = "none";
        vNode.pause();
        iNode.style.display = "block";
        iNode.src = mediaUrl;
    }

    // Génération dynamique des boutons de prix (Grille compacte)
    const grid = document.getElementById('price-grid-dynamic');
    const tarifs = [
        {p: '5g', v: 160}, {p: '10g', v: 310}, 
        {p: '20g', v: 600}, {p: '30g', v: 840},
        {p: '50g', v: 1100}, {p: '100g', v: 2100}
    ];

    grid.innerHTML = "";
    tarifs.forEach(t => {
        grid.innerHTML += `<button onclick="addToCartDetailed('${t.p}', ${t.v})">${t.v}€ ${t.p}</button>`;
    });

    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
    const vNode = document.getElementById('detail-video');
    vNode.pause(); 
    vNode.src = ""; // Libère la mémoire
}

function addToCartDetailed(poids, prix) {
    const productName = `${currentProduct.name} (${poids})`;
    addToCart(productName, prix);
    
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`Ajouté : ${productName}`);
    }
    // Optionnel : décommente la ligne dessous si tu veux fermer la fiche après l'ajout
    // closeProduct(); 
}

// 5. VALIDATION DE COMMANDE
function validerCommande() {
    if(cart.length === 0) return;
    
    let total = 0;
    let message = "Salut ! Je souhaite passer commande :\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name} - ${item.price}€\n`;
        total += item.price;
    });
    
    message += `\nTOTAL : ${total}€`;

    // Affiche le récapitulatif (plus tard on l'enverra au bot)
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showConfirm(message, (ok) => {
            if(ok) window.Telegram.WebApp.showAlert("Commande confirmée !");
        });
    } else {
        alert(message);
    }
}
