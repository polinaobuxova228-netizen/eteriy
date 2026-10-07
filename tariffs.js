const CART_KEY = 'eteryCartV6';

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

function updateCounter() {
    const counter = document.getElementById('cartCounter');
    if (!counter) return;

    const total = getCart().reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    counter.textContent = total;
    counter.classList.toggle('visible', total > 0);
}

document.querySelectorAll('.tariff button').forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const cart = getCart();
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const existing = cart.find(item => item.name === name && item.type === 'tariff');

        if (existing) {
            existing.quantity += 1;
        } else {

            cart.push({
                name,
                price,
                quantity: 1,
                type: 'tariff'
            });
        }

        saveCart(cart);
        updateCounter();

        const oldText = button.innerHTML;
        button.innerHTML = 'ДОБАВЛЕНО ✓';
        button.classList.add('added');

        setTimeout(() => {
            button.innerHTML = oldText;
            button.classList.remove('added');
        }, 1300);
    });
});

updateCounter();
window.addEventListener('storage', updateCounter);
