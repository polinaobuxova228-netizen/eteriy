const CART_KEY = 'eteryCartV6';

const box = document.getElementById('cartItems');
const empty = document.getElementById('empty');
const bottom = document.getElementById('cartBottom');

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function money(value) {
    return Number(value).toLocaleString('ru-RU') + ' ₽';
}

function update() {
    const cart = getCart();
    box.innerHTML = '';

    let count = 0;
    let total = 0;

    cart.forEach((item, index) => {
        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);

        count += quantity;
        total += price * quantity;

        const row = document.createElement('article');
        row.className = 'cart-row' + (item.type === 'tariff' ? ' cart-row--tariff' : '');

        if (item.type === 'tariff') {
            row.innerHTML = `
                <div class="cart-name cart-name--tariff">${item.name}</div>
                <div class="cart-price">${money(price)}</div>
                <div class="qty">
                    <button type="button" data-action="minus" data-i="${index}">−</button>
                    <span>${quantity}</span>
                    <button type="button" data-action="plus" data-i="${index}">+</button>
                </div>
                <div class="cart-total">${money(price * quantity)}</div>
                <button class="remove" type="button" data-action="remove" data-i="${index}" aria-label="Удалить">×</button>
            `;
        } else {
            row.innerHTML = `
                <div class="cart-thumb">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-name">${item.name}</div>
                <div class="cart-price">${money(price)}</div>
                <div class="qty">
                    <button type="button" data-action="minus" data-i="${index}">−</button>
                    <span>${quantity}</span>
                    <button type="button" data-action="plus" data-i="${index}">+</button>
                </div>
                <div class="cart-total">${money(price * quantity)}</div>
                <button class="remove" type="button" data-action="remove" data-i="${index}" aria-label="Удалить">×</button>
            `;
        }

        box.appendChild(row);
    });

    empty.style.display = cart.length ? 'none' : 'block';
    bottom.style.display = cart.length ? 'flex' : 'none';

    document.getElementById('cartCountTotal').textContent = count;
    document.getElementById('cartTotalPrice').textContent = money(total);

    const counter = document.getElementById('cartCounter');
    counter.textContent = count;
    counter.classList.toggle('visible', count > 0);
}

box.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;

    const cart = getCart();
    const index = Number(button.dataset.i);
    const action = button.dataset.action;

    if (!cart[index]) return;

    if (action === 'plus') cart[index].quantity += 1;
    if (action === 'minus') cart[index].quantity -= 1;
    if (action === 'remove') cart[index].quantity = 0;

    if (cart[index].quantity <= 0) cart.splice(index, 1);

    saveCart(cart);
    update();
});


document.querySelector('.cart-book')?.addEventListener('click', event => {
    event.preventDefault();

    localStorage.removeItem(CART_KEY);
    update();

    setTimeout(() => {
        window.location.href = 'tariffs.html';
    }, 150);
});

update();
