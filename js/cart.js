let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartList = document.getElementById('cart-list');

function renderCart() {
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Giỏ hàng trống.</p>';
        saveCart(cart);
        return;
    }

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
        <thead>
          <tr>
            <th>Tên SP</th>
            <th>Mô tả</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map((item, index) => {
        const subtotal = item.quantity * item.price;
        total += subtotal;
        return `
              <tr>
                <td>${item.name}</td>
                <td>${item.description || ''}</td>
                <td>
                  <div class="qty-controls">
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, -1)">−</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, 1)">+</button>
                  </div>
                </td>
                <td>${item.price.toLocaleString()}₫</td>
                <td>${subtotal.toLocaleString()}₫</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button></td>
              </tr>`;
    }).join('')}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="4" class="text-end">Tổng cộng:</th>
            <th colspan="2">${total.toLocaleString()}₫</th>
          </tr>
        </tfoot>
      `;
    cartList.appendChild(table);
    saveCart(cart);
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    if (confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        cart = [];
        renderCart();
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function sendOrder() {
    const name = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !address) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    let message = `🛒 Đơn hàng mới\n`;
    message += `👤 Tên: ${name}\n📞 Zalo: ${phone}\n📜 Địa chỉ: ${address}\n📦 Sản phẩm:\n`;
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.quantity * item.price;
        total += subtotal;
        message += `- ${item.name} (${item.quantity} x ${item.price.toLocaleString()}₫)\n`;
    });
    message += `\n💰 Tổng: ${total.toLocaleString()}₫`;

    const zaloNumber = '0834338820';
    const encoded = encodeURIComponent(message);
    window.open(`https://zalo.me/${zaloNumber}?text=${encoded}`, '_blank');
}

['fullname', 'phone', 'address'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', e => {
            localStorage.setItem(id, e.target.value);
        });
        window.addEventListener('DOMContentLoaded', () => {
            input.value = localStorage.getItem(id) || '';
        });
    }
});

renderCart();