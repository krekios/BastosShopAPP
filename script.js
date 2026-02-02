let cart = [];
const tele = window.Telegram.WebApp;
tele.expand();

function showPage(pageId, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
}

function openProduct(name, farm, category, video, desc, price) {
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-farm').innerText = farm;
    document.getElementById('detail-desc').innerText = desc;
    document.getElementById('detail-video').src = video;
    document.getElementById('add-to-cart-btn').onclick = () => addToCart(name, price);
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
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:50px;">Votre panier est vide 🐥</p>';
        footer.style.display = 'none';
        return;
    }
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between;">
            <div><b>${item.name}</b><br><small>${item.price}€</small></div>
            <button onclick="removeItem(${index})" style="color:#ff453a; background:none; border:none;">Supprimer</button>
        </div>`;
    });
    footer.style.display = 'block';
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function goToStep2() {
    document.getElementById('step-1-cart').style.display = 'none';
    document.getElementById('step-2-delivery').style.display = 'block';
}

function goToStep1() {
    document.getElementById('step-1-cart').style.display = 'block';
    document.getElementById('step-2-delivery').style.display = 'none';
}

function toggleDeliveryFields() {
    const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
    document.getElementById('meetup-fields').style.display = mode === 'meetup' ? 'block' : 'none';
    document.getElementById('livraison-fields').style.display = mode === 'livraison' ? 'block' : 'none';
}

function finaliserCommande() {
    const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
    const loc = mode === 'meetup' ? document.getElementById('meetup-location').value : document.getElementById('delivery-address').value;
    let recap = "";
    let total = 0;
    cart.forEach(i => { recap += `- ${i.name} (${i.price}€)\n`; total += i.price; });

    const data = {
        recapitulatif: recap,
        total: total + "€",
        livraison: mode === 'meetup' ? "📍 Meet-up" : "🚚 Livraison",
        adresse: loc
    };

    tele.showConfirm("Confirmer l'envoi ?", (confirm) => {
        if(confirm) {
            tele.sendData(JSON.stringify(data));
        }
    });
}
