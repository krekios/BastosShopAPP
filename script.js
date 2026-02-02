let cart = [];
let currentProduct = {}; 

// 1. NAVIGATION PRINCIPALE
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
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

// 3. LOGIQUE DU PANIER (Avec calcul du total)
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartUI();
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    let total = 0; // Ajout du calcul du total
    
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

    // On met à jour le texte du bouton avec le total
    footer.innerHTML = `<button class="tab-btn active" style="width:100%" onclick="validerCommande()">Valider la commande (${total}€)</button>`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 4. OUVERTURE PRODUIT (Optimisé pour la vidéo)
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
        
        // On change la source directement sur l'élément vidéo
        vNode.src = mediaUrl; 
        vNode.load(); // Indispensable pour rafraîchir le lecteur
        vNode.play().catch(e => console.log("Lecture auto bloquée"));
    } else {
        vNode.style.display = "none";
        vNode.pause();
        iNode.style.display = "block";
        iNode.src = mediaUrl;
    }

    // Génération des boutons compacts
    const grid = document.getElementById('price-grid-dynamic');
    const tarifs = [
        {p: '5g', v: 160}, {p: '10g', v: 310}, {p: '20g', v: 600},
        {p: '30g', v: 840}, {p: '50g', v: 1100}, {p: '100g', v: 2100}
    ];

    grid.innerHTML = "";
    tarifs.forEach(t => {
        // Formatage "160€ 5g" sur une seule ligne comme la capture
        grid.innerHTML += `<button onclick="addToCartDetailed('${t.p}', ${t.v})">${t.v}€ ${t.p}</button>`;
    });

    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
    document.getElementById('detail-video').pause(); // On coupe le son/vidéo en fermant
}

function addToCartDetailed(poids, prix) {
    const productName = `${currentProduct.name} (${poids})`;
    addToCart(productName, prix);
    closeProduct();
    
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`Ajouté : ${productName}`);
    }
}

function validerCommande() {
    if(cart.length === 0) return;
    let message = "Salut ! Je souhaite commander :\n\n";
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} - ${item.price}€\n`;
        total += item.price;
    });
    message += `\nTotal : ${total}€`;
    
    // Pour l'instant on affiche, mais on pourra envoyer au bot après
    alert(message);
}
