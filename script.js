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
        iNode.style.display = "none";
        vNode.style.display = "block";
        vNode.src = mediaUrl; 
        vNode.load(); 
        vNode.play().catch(e => console.log("Auto-play blocked"));
    } else {
        vNode.style.display = "none";
        iNode.style.display = "block";
        iNode.src = mediaUrl;
    }

    const grid = document.getElementById('price-grid-dynamic');
    const tarifs = [
        {p: '2g', v: 30}, {p: '5g', v: 60}, 
        {p: '10g', v: 110}, {p: '25g', v: 220}
    ];

    grid.innerHTML = "";
    tarifs.forEach(t => {
        grid.innerHTML += `<button onclick="addToCartDetailed('${t.p}', ${t.v})">${t.v}€ ${t.p}</button>`;
    });

    document.getElementById('product-detail-page').classList.add('active');
    window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
}

function closeProduct() {
    document.getElementById('product-detail-page').classList.remove('active');
    document.getElementById('detail-video').pause();
}

function addToCartDetailed(poids, prix) {
    const itemName = `${currentProduct.name} (${poids})`;
    cart.push({ name: itemName, price: prix });
    
    window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
    
    updateCartUI();
    closeProduct();
    window.Telegram?.WebApp?.showAlert(`Ajouté : ${itemName}`);
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

    footer.style.display = 'block';
    list.innerHTML = ''; 
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div style="background:rgba(255,255,255,0.05); margin-bottom:10px; padding:15px; border-radius:15px; display:flex; justify-content:space-between; align-items:center;">
                <div style="text-align: left;"><b>${item.name}</b><br><small>${item.price}€</small></div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff453a; font-weight:bold;">Supprimer</button>
            </div>`;
    });
    footer.innerHTML = `<button onclick="validerCommande()" style="width:100%; padding:15px; border-radius:15px; background:#248bfe; color:white; border:none; font-weight:bold;">Commander (${total}€)</button>`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function validerCommande() {
    if (cart.length === 0) return;
    let total = 0;
    let recap = "";
    cart.forEach(item => {
        recap += `- ${item.name} : ${item.price}€\n`;
        total += item.price;
    });
    const commandeData = {
        items: cart,
        total: total,
        recapitulatif: recap,
        date: new Date().toLocaleString('fr-FR')
    };
    window.Telegram.WebApp.showConfirm(`Confirmer la commande de ${total}€ ?`, (isConfirmed) => {
        if (isConfirmed) {
            window.Telegram.WebApp.sendData(JSON.stringify(commandeData));
        }
    });
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
    window.Telegram?.WebApp?.HapticFeedback.selectionChanged();
}
function filterProducts() {
    const farmValue = document.getElementById('farm-filter').value;
    const catValue = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const farm = product.getAttribute('data-farm');
        const category = product.getAttribute('data-category');

        const farmMatch = (farmValue === 'all' || farm === farmValue);
        const catMatch = (catValue === 'all' || category === catValue);

        if (farmMatch && catMatch) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
