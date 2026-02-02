let cart = [];
const tele = window.Telegram.WebApp;
tele.expand();

function showPage(pageId, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
}

function openProduct(name, farm, tag, video, desc, price) {
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    document.getElementById('detail-tag').innerText = tag;
    document.getElementById('detail-desc').innerText = desc;
    document.getElementById('detail-video').src = video;
    
    const grid = document.getElementById('price-grid-dynamic');
    grid.innerHTML = `<button onclick="addToCart('${name}', ${price})">AJOUTER : ${price}€</button>`;
    
    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    closeProduct();
    tele.HapticFeedback.notificationOccurred('success');
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:50px; opacity:0.5;">Panier vide 🐥</div>';
        footer.style.display = 'none';
        return;
    }

    list.innerHTML = '';
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div style="background:rgba(255,255,255,0.05); margin-bottom:10px; padding:15px; border-radius:15px; display:flex; justify-content:space-between; align-items:center;">
                <div style="text-align: left;"><b>${item.name}</b><br><small>${item.price}€</small></div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff453a;">Supprimer</button>
            </div>`;
    });
    footer.style.display = 'block';
    footer.innerHTML = `<button class="btn-primary" style="width:100%; background:#248bfe; color:white; border:none; padding:15px; border-radius:15px;">Total: ${total}€</button>`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'panier') {
        document.getElementById('btn-tab-panier').classList.add('active');
        document.getElementById('content-panier').classList.add('active');
    } else {
        document.getElementById('btn-tab-commandes').classList.add('active');
        document.getElementById('content-commandes').classList.add('active');
    }
}

function goToStep2() {
    if(cart.length === 0) return alert("Ton panier est vide !");
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
    const info = (mode === 'meetup') ? document.getElementById('meetup-location').value : document.getElementById('delivery-address').value;
    
    let recap = "";
    let total = 0;
    cart.forEach(item => {
        recap += `- ${item.name} : ${item.price}€\n`;
        total += item.price;
    });

    const data = {
        recapitulatif: recap,
        total: total + "€",
        mode: mode,
        lieu: info
    };

    tele.showConfirm("Confirmer la commande ?", (confirmed) => {
        if(confirmed) {
            tele.sendData(JSON.stringify(data));
        }
    });
}

function filterProducts() {
    const farmValue = document.getElementById('farm-filter').value;
    const catValue = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const farmMatch = (farmValue === 'all' || product.dataset.farm === farmValue);
        const catMatch = (catValue === 'all' || product.dataset.category === catValue);
        product.style.display = (farmMatch && catMatch) ? "block" : "none";
    });
}
