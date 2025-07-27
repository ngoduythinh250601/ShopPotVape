const list = document.getElementById('product-list');

function renderProducts() {
    list.innerHTML = '';
    products.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                    <p>${p.description}</p>
                    <p>Giá: <strong>${p.price.toLocaleString()}₫</strong></p>
                    <p>Còn lại: ${p.stock}</p>
                    <div class="input-group mb-2">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${i}, -1)">−</button>
                        <input type="number" id="qty-${i}" value="0" min="0" max="${p.stock}" class="form-control text-center" onchange="validateInput(${i})">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${i}, 1)">+</button>
                    </div>
                    <button class="btn btn-primary w-100" onclick="addToCart(${i})">Thêm vào giỏ</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function changeQuantity(index, delta) {
    const input = document.getElementById(`qty-${index}`);
    let val = parseInt(input.value) + delta;
    if (val < 0) val = 0;
    if (val > products[index].stock) val = products[index].stock;
    input.value = val;
}

function validateInput(index) {
    const input = document.getElementById(`qty-${index}`);
    let val = parseInt(input.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val > products[index].stock) val = products[index].stock;
    input.value = val;
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(index) {
    const input = document.getElementById(`qty-${index}`);
    const qty = parseInt(input.value);
    if (qty <= 0) return;

    const cart = getCart();
    const product = products[index];
    const existing = cart.find(item => item.name === product.name);

    let totalQty = qty;
    if (existing) {
        totalQty += existing.quantity;
        if (totalQty > product.stock) {
            showToast(`Vượt quá số lượng còn lại! Chỉ còn ${product.stock} sản phẩm.`, true);
        }
        else {
            showToast(`Đã cập nhật số lượng ${product.name} thành ${totalQty}.`, false);
            existing.quantity += qty;
        }
    } else {
        if (qty > product.stock) {
            showToast(`Không thể thêm ${qty} sản phẩm. Chỉ còn ${product.stock} sản phẩm.`, true);
            return;
        } else {
            showToast(`Đã thêm ${qty} ${product.name} vào giỏ hàng!`, false);
            cart.push({ name: product.name, quantity: qty, price: product.price });
        }
    }

    saveCart(cart);
    input.value = 0;
}

function saveCartToStorage() {
    const cart = getCart();
    products.forEach((p, i) => {
        const qty = parseInt(document.getElementById(`qty-${i}`).value);
        if (qty > 0) {
            const existing = cart.find(item => item.name === p.name);
            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({ name: p.name, quantity: qty, price: p.price });
            }
        }
    });
    saveCart(cart);
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)'; // Căn giữa ngang
    toast.style.background = isError ? '#dc3545' : '#28a745'; // đỏ hoặc xanh
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = 1000;
    toast.style.opacity = 0;
    toast.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 1;
    }, 10);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}


renderProducts();
