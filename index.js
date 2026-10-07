const CART_KEY = 'eteryCartV6';
const CLEANUP_KEY = 'eteryCartV6Initialized';

if (localStorage.getItem(CLEANUP_KEY) !== 'yes') {
    [
        'eteryCart',
        'eteryCartV2',
        'eteryCartV3',
        'eteryCartV4',
        'eteryCartV5'
    ].forEach(key => localStorage.removeItem(key));

    localStorage.removeItem(CART_KEY);
    localStorage.setItem(CLEANUP_KEY, 'yes');
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
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

document.querySelectorAll('a[href="index.html#programs"]').forEach(link => {
    link.addEventListener('click', event => {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            event.preventDefault();
            document.getElementById('programs')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.querySelectorAll('a[href="#programs"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        document.getElementById('programs')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

updateCounter();
window.addEventListener('storage', updateCounter);
