let cart = [];
let currentProduct = {};

function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function openProduct(name, farm, tag, mediaUrl, desc, isVideo = false) {
    currentProduct = { name, farm };
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    document.getElementById('detail-tag').innerText = tag;
    document.getElementById('detail-desc').innerText = desc;

    const vNode = document.getElementById('detail-video');
    const iNode = document.getElementById('detail-img');
    if(isVideo) {
        vNode.style.display = "block"; iNode.style.display = "none"; vNode.src = mediaUrl; vNode.play();
    } else {
        vNode.style.display = "none"; iNode.style.display = "block"; iNode.src = mediaUrl;
    }

    const grid = document.getElementById('price-grid-dynamic');
    const tarifs = [{p:'2g',v:30},{p:'5g',v:60},{p:'10g',v:110},{p:'25g',v:220}];
    grid.innerHTML = "";
    tarifs.forEach(t => {
        grid.innerHTML += `<button onclick="addToCartDetailed('${t.p}', ${t.v})">${t.v}€ - ${t.p}</button>`;
    });
    document.getElementById('product-detail-page').classList.add('active');
}

function closeProduct() { document.getElementById('product-detail-page').classList.remove('active'); }

function addToCartDetailed(poids, prix) {
    cart.push({ name: `${currentProduct.name} (${poids})`, price: prix });
    updateCartUI();
    closeProduct();
    window.Telegram?.WebApp?.showAlert("Ajouté au panier !");
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:50px;">Panier vide 🐥</p>';
        return;
    }
    list.innerHTML = cart.map((item, i) => `
        <div style="background:rgba(255,255,255,0.05); padding:15px; margin-bottom:10px; border-radius:15px; display:flex; justify-content:space-between;">
            <span>${item.name}</span><b>${item.price}€</b>
        </div>
    `).join('');
}

function goToStep2() {
    if(cart.length === 0) return;
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
    const data = { items: cart, total: cart.reduce((a, b) => a + b.price, 0), livraison: info };
    window.Telegram.WebApp.sendData(JSON.stringify(data));
}

function filterProducts() {
    const farm = document.getElementById('farm-filter').value;
    const cat = document.getElementById('category-filter').value;
    document.querySelectorAll('.product-card').forEach(p => {
        const fM = farm === 'all' || p.dataset.farm === farm;
        const cM = cat === 'all' || p.dataset.category === cat;
        p.style.display = (fM && cM) ? "block" : "none";
    });
}
