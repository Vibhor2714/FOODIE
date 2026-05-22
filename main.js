if (typeof Swiper !== 'undefined') {
    var swiper = new Swiper(".mySwiper", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },
    });
}


const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeCartBtn = document.querySelector('.close-btn');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const menuPopout = document.querySelector('.menu-popout');
const menuTriggers = document.querySelectorAll('.menu-trigger');
const menuCloseButtons = document.querySelectorAll('[data-menu-close]');
const subscribeForm = document.querySelector('.subscribe-form');
const subscribeMessage = document.querySelector('.subscribe-message');
const orderNowBtn = document.querySelector('.order-now-btn');

const updateCartPosition = () => {
    if (!cartIcon || !cartTab) return;

    const iconRect = cartIcon.getBoundingClientRect();
    const popupWidth = Math.min(392, window.innerWidth - 32);
    const top = iconRect.bottom + 20;
    let left = iconRect.left + (iconRect.width / 2) - (popupWidth * 0.62);

    left = Math.max(16, Math.min(left, window.innerWidth - popupWidth - 16));

    cartTab.style.top = `${top}px`;
    cartTab.style.left = `${left}px`;
    cartTab.style.setProperty('--cart-arrow-left', `${iconRect.left + (iconRect.width / 2) - left - 12}px`);
};

const openMenuPopout = () => {
    if (!menuPopout) return;
    menuPopout.classList.add('menu-popout-active');
    menuPopout.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeMenuPopout = () => {
    if (!menuPopout) return;
    menuPopout.classList.remove('menu-popout-active');
    menuPopout.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

cartIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartPosition();
    cartTab?.classList.toggle('cart-tab-active');
});

closeCartBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartTab?.classList.remove('cart-tab-active');
});

cartTab?.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('click', () => {
    cartTab?.classList.remove('cart-tab-active');
});

window.addEventListener('resize', () => {
    if (cartTab?.classList.contains('cart-tab-active')) {
        updateCartPosition();
    }
});

hamburger?.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu?.classList.toggle('mobile-menu-active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileMenu?.classList.remove('mobile-menu-active');

        if (link.classList.contains('menu-trigger')) {
            setTimeout(openMenuPopout, 520);
        }
    });
});

menuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        if (trigger.getAttribute('href') === '#') {
            e.preventDefault();
            openMenuPopout();
        }
    });
});

menuCloseButtons.forEach(button => {
    button.addEventListener('click', closeMenuPopout);
});

orderNowBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(openMenuPopout, 520);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenuPopout();
        cartTab?.classList.remove('cart-tab-active');
        mobileMenu?.classList.remove('mobile-menu-active');
    }
});

const sections = document.querySelectorAll('section[id], footer[id]');
const setActiveNav = (id) => {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
};

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveNav(entry.target.id);
            }
        });
    }, {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
}

subscribeForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    subscribeMessage.classList.remove('error');

    if (!isValidEmail) {
        subscribeMessage.textContent = 'Please enter a valid email address.';
        subscribeMessage.classList.add('error');
        emailInput.focus();
        return;
    }

    const subscribers = JSON.parse(localStorage.getItem('foodieSubscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('foodieSubscribers', JSON.stringify(subscribers));
    }

    subscribeMessage.textContent = 'Thanks for subscribing!';
    emailInput.value = '';
});

const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');


let productList = [];
let cartproducts = [];

const getPrice = (product) => parseInt(product.price.replace(/[^\d]/g, ''));

const updateTotals = () => {
    const totalElement = document.querySelector('.cart-total');
    const iconValue = document.querySelector('.icon-value');
    let total = 0;
    let itemCount = 0;

    cartproducts.forEach(product => {
        const price = getPrice(product);
        total += price * product.quantity;
        itemCount += product.quantity;
    });

    totalElement.textContent = `₹${total}`;
    iconValue.textContent = itemCount;
};

const updateCartItemDisplay = (product) => {
    const cartItem = cartList.querySelector(`.item[data-id="${product.id}"]`);
    if (!cartItem) return;

    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const price = getPrice(product);

    quantityValue.textContent = product.quantity;
    itemTotal.textContent = `₹${price * product.quantity}`;
};

const getProductFromCard = (button) => {
    const productId = Number(button.dataset.id);
    const product = productList.find(item => item.id === productId)
        || fallbackProducts.find(item => item.id === productId);

    if (product) return product;

    const card = button.closest('.order-card');
    return {
        id: card.querySelector('h4').textContent.trim(),
        name: card.querySelector('h4').textContent.trim(),
        price: card.querySelector('.Price').textContent.trim(),
        image: card.querySelector('img').getAttribute('src')
    };
};


const fallbackProducts = [
    {
        "id": 1,
        "name": "Double Beef Burger",
        "price": "₹75",
        "image": "images/burger.png"
    },
    {
        "id": 2,
        "name": "Veggie Pizza",
        "price": "₹200",
        "image": "images/pizza.png"
    },
    {
        "id": 3,
        "name": "Fried Chicken",
        "price": "₹450",
        "image": "images/fried-chicken.png"
    },
    {
        "id": 4,
        "name": "Chicken Roll",
        "price": "₹300",
        "image": "images/chicken-roll.png"
    },
    {
        "id": 5,
        "name": "Sub Sandwich",
        "price": "₹220",
        "image": "images/sandwich.png"
    },
    {
        "id": 6,
        "name": "Chicken Lasagna",
        "price": "₹450",
        "image": "images/lasagna.png"
    },
    {
        "id": 7,
        "name": "Italian Spaghetti",
        "price": "₹250",
        "image": "images/spaghetti.png"
    },
    {
        "id": 8,
        "name": "Spring Roll",
        "price": "₹120",
        "image": "images/spring-roll.png"
    }
];


const showcard = () => {
    cardList.innerHTML = '';

    productList.forEach(product => {

        const ordercard = document.createElement('div');
        ordercard.classList.add('order-card');

        ordercard.innerHTML = `
        <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="Price">${product.price}</h4>
        <a href="#" class="btn card-btn" data-id="${product.id}">Add to Cart</a>
        `;
        cardList.appendChild(ordercard);
    });
};

const addToCart = (product) => {

    const existingProduct = cartproducts.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
        updateCartItemDisplay(existingProduct);
        updateTotals();
        return;
    }
    
    cartproducts.push({ ...product, quantity: 1 });
    updateTotals();

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');
    cartItem.dataset.id = product.id;
    cartItem.innerHTML = `

      <div class="item-image">
        <img src="${product.image}" alt="${product.name}">
            </div>
        <div class="details">
    <h4>${product.name}</h4>
    <h4 class="item-total">${product.price}</h4>
        </div>
            <div class="flex">
    <a href="#" class="quantity-btn minus">
     <i class="fa-solid fa-minus"></i>
        </a>
    <h4 class="quantity-value">1</h4>
    <a href="#" class="quantity-btn plus">
    <i class="fa-solid fa-plus"></i>
        </a>
        </div>
    `;
    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cartProduct = cartproducts.find(item => item.id === product.id);
        cartProduct.quantity++;
        updateCartItemDisplay(cartProduct);
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cartProduct = cartproducts.find(item => item.id === product.id);
        if (cartProduct.quantity > 1) {
            cartProduct.quantity--;
            updateCartItemDisplay(cartProduct);
            updateTotals();
        } else {
            cartItem.classList.add('slide-out');
            setTimeout(() => {
                cartList.removeChild(cartItem);
                cartproducts = cartproducts.filter(item => item.id !== product.id);
                updateTotals();
            }, 300);
        }
    });
};

cardList.addEventListener('click', (e) => {
    const cardBtn = e.target.closest('.card-btn, .order-card .btn');
    if (!cardBtn) return;

    e.preventDefault();
    const product = getProductFromCard(cardBtn);
    addToCart(product);
});

const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productList = data;
            showcard();
        })
        .catch(() => {
            productList = fallbackProducts;
            showcard();
        });
};

initApp();
