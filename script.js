let cart = [];
let currentProduct = {};

// Navigation entre les pages
function showPage(pageId, element) {
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    // Afficher la page sélectionnée
    document.getElementById(pageId).style.display = 'block';
    
    // Gérer l'état actif dans la nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
    window.Telegram?.WebApp?.HapticFeedback.selectionChanged();
}

// Ouvrir un produit
function openProduct(name, farm, tag, mediaUrl, desc, isVideo = false) {
    currentProduct = { name, farm };
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    
    const v = document.getElementById('detail-video');
    const i = document.getElementById('detail-img');
    
    if(isVideo) {
        v.style.display = "block"; i.style.display = "none"; v.src = mediaUrl; v.play();
    } else {
        v.style.display = "none"; i.style.display = "block"; i.src = mediaUrl;
    }

    const grid = document.getElementById('price-grid-dynamic');
    const tarifs = [{p:'2g',v:30},{p:'5g',v:60},{p:'10g',v:110}];
    grid.innerHTML = "";
    tarifs.forEach(t => {
        grid.innerHTML += `<button onclick="addToCart('${t.p}', ${t.v})">${t.v}€ - ${t.p}</button>`;
    });

    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
}

// Panier
function addToCart(poids, prix) {
    cart.push({ name: `${currentProduct.name} (${poids})`, price: prix });
    updateCartUI();
    closeProduct();
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:50px; opacity:0.5;">Panier vide 🐥</p>';
        return;
    }
    list.innerHTML = cart.map((item, index) => `
        <div class="info-block" style="display:flex; justify-content:space-between; align-items:center;">
            <div><b>${item.name}</b><br>${item.price}€</div>
            <button onclick="removeItem(${index})" style="color:red; background:none; border:none;">Supprimer</button>
        </div>
    `).join('');
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Tunnel de commande
function goToStep2() {
    if(cart.length === 0) return window.Telegram?.WebApp?.showAlert("Ton panier est vide");
    document.getElementById('step-1-cart').style.display = 'none';
    document.getElementById('step-2-delivery').style.display = 'block';
}

function goToStep1() {
    document.getElementById('step-1-cart').style.display = 'block';
    document.getElementById('step-2-delivery').style.display = 'none';
}

function toggleDeliveryFields() {
    const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
    document.getElementById('meetup-fields').style.display = (mode === 'meetup') ? 'block' : 'none';
    document.getElementById('livraison-fields').style.display = (mode === 'livraison') ? 'block' : 'none';
}

function finaliserCommande() {
    const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
    const info = mode === 'meetup' ? document.getElementById('meetup-location').value : document.getElementById('delivery-address').value;
    
    if(mode === 'livraison' && info.length < 5) return window.Telegram?.WebApp?.showAlert("Précise l'adresse !");

    const total = cart.reduce((a, b) => a + b.price, 0);
    const data = {
        commande: cart.map(i => i.name).join(', '),
        total: total + "€",
        mode: mode,
        infos: info
    };

    window.Telegram.WebApp.showConfirm(`Confirmer la commande de ${total}€ ?`, (ok) => {
        if(ok) window.Telegram.WebApp.sendData(JSON.stringify(data));
    });
}

function filterProducts() {
    const farm = document.getElementById('farm-filter').value;
    const cat = document.getElementById('category-filter').value;
    document.querySelectorAll('.product-card').forEach(p => {
        const farmMatch = farm === 'all' || p.dataset.farm === farm;
        const catMatch = cat === 'all' || p.dataset.category === cat;
        p.style.display = (farmMatch && catMatch) ? "block" : "none";
    });
}

// Initialisation Telegram
window.Telegram.WebApp.expand();
