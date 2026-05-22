const loginTriggers = document.querySelectorAll('.login-trigger');

const loginModal = document.createElement('div');
loginModal.className = 'login-modal';
loginModal.setAttribute('aria-hidden', 'true');
loginModal.innerHTML = `
    <div class="login-box" role="dialog" aria-modal="true" aria-label="Foodie sign in">
        <button type="button" class="login-close" aria-label="Close login">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="login-art">
            <div class="login-food" aria-hidden="true">
                <img src="images/foodie-login-logo.svg" alt="">
            </div>
            <h3>Welcome <span>Back!</span></h3>
            <p>Login and order your favorite food faster.</p>
        </div>

        <form class="login-form">
            <h2>Sign in</h2>
            <p class="login-subtitle">Use your email to continue.</p>

            <label class="login-field">
                <span>Email address</span>
                <input type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
            </label>

            <label class="login-field">
                <span>Password</span>
                <input type="password" name="password" placeholder="Password" autocomplete="current-password" required>
            </label>

            <div class="login-row">
                <label>
                    <input type="checkbox" name="remember">
                    Remember me
                </label>
                <a href="#">Forgot?</a>
            </div>

            <button type="submit" class="btn login-submit">Login</button>

            <div class="login-divider">or</div>

            <div class="login-socials" aria-label="Social login options">
                <a href="#" class="google-login" aria-label="Sign in with Google">
                    <span class="google-mark">G</span>
                    <span>Sign in with Google</span>
                </a>
            </div>
        </form>
    </div>
`;

document.body.appendChild(loginModal);

const loginBox = loginModal.querySelector('.login-box');
const loginClose = loginModal.querySelector('.login-close');
const loginForm = loginModal.querySelector('.login-form');

const openLoginModal = () => {
    loginModal.classList.add('login-modal-active');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeLoginModal = () => {
    loginModal.classList.remove('login-modal-active');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

loginTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.mobile-menu')?.classList.remove('mobile-menu-active');
        document.querySelector('.cart-tab')?.classList.remove('cart-tab-active');
        openLoginModal();
    });
});

loginClose.addEventListener('click', closeLoginModal);

loginModal.addEventListener('click', closeLoginModal);

loginBox.addEventListener('click', (e) => {
    e.stopPropagation();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeLoginModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('login-modal-active')) {
        closeLoginModal();
    }
});
