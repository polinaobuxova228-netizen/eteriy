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

const selected = {};

document.querySelectorAll('.product').forEach((product, index) => {
    const options = product.querySelectorAll('.options button');

    options.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            options.forEach(item => item.classList.remove('chosen'));
            button.classList.add('chosen');
            selected[index] = button.textContent.trim();
        });
    });

    const addButton = product.querySelector('.add');
    if (!addButton) return;

    addButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        let name = addButton.dataset.name;
        const option = selected[index];

        if (option) name += ' / ' + option;

        const cart = getCart();
        const existing = cart.find(item => item.name === name && item.type === 'merch');

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                name,
                price: Number(addButton.dataset.price),
                quantity: 1,
                image: addButton.dataset.image,
                type: 'merch'
            });
        }

        saveCart(cart);
        updateCounter();

        const oldText = addButton.textContent;
        addButton.textContent = 'ДОБАВЛЕНО ✓';
        addButton.classList.add('added');

        setTimeout(() => {
            addButton.textContent = oldText;
            addButton.classList.remove('added');
        }, 1300);
    });
});

updateCounter();
window.addEventListener('storage', updateCounter);
