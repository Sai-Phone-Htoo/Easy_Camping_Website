document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your login logic here
            console.log('Login form submitted');
            // Example: Validate and redirect
            // window.location.href = '../index.html';
        });
    }
});

//Hero Section Slie Show//
class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-arrow');
        this.nextBtn = document.querySelector('.next-arrow');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        this.showSlide(this.currentIndex);
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(ind => ind.classList.remove('active'));

        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Slideshow();
});
console.log(document.querySelectorAll('.slide'));
console.log(document.querySelectorAll('.indicator'));


//Code for Cart System//  
class CartSystem {
    
    constructor() {
        this.cartKey = 'easyCampingCart';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCounter();
        if (document.getElementById('cart-items-container')) {
            this.displayCartItems();
        }
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                this.addToCart(btn);
            }


            // Cart page controls
            if (e.target.classList.contains('decrease-quantity') || e.target.closest('.decrease-quantity')) {
                const btn = e.target.classList.contains('decrease-quantity') ? e.target : e.target.closest('.decrease-quantity');
                this.adjustQuantity(btn, -1);
            }

            if (e.target.classList.contains('increase-quantity') || e.target.closest('.increase-quantity')) {
                const btn = e.target.classList.contains('increase-quantity') ? e.target : e.target.closest('.increase-quantity');
                this.adjustQuantity(btn, 1);
            }

            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const btn = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                this.removeItem(btn);
            }
        });
    }

    getCart() {
        return JSON.parse(localStorage.getItem(this.cartKey)) || [];
    }

    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartCounter();
    }

    addToCart(button) {
        const productCard = button.closest('.product-card,.product-card1');
        const product = {
            id: productCard.dataset.id || Date.now().toString(),
            name: productCard.dataset.name || productCard.querySelector('.card-title').textContent,
            price: parseFloat(productCard.dataset.price || productCard.querySelector('.price').textContent.replace('$', '')),
            image: productCard.dataset.image || productCard.querySelector('img').src,
            quantity: 1
        };

        // Button animation
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 1000);

        let cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }

        this.saveCart(cart);
        this.showAddToCartNotification(product.name);
    }

    showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 10);
    }

    updateCartCounter() {
        const cart = this.getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    displayCartItems() {
        const cartContainer = document.getElementById('cart-items-container');
        const cart = this.getCart();
         
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="Sale&Product.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            this.updateOrderSummary(0);
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="btn btn-quantity decrease-quantity">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="btn btn-quantity increase-quantity">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <span class="item-total">$${itemTotal.toFixed(2)}</span>
                        <button class="btn btn-remove remove-item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartContainer.innerHTML = html;
        this.updateOrderSummary(subtotal);
    }

    updateOrderSummary(subtotal) {
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
        
        const cart = this.getCart();
        document.getElementById('item-count').textContent = 
            cart.reduce((total, item) => total + item.quantity, 0);
    }

    adjustQuantity(button, change) {
        const cartItem = button.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        let cart = this.getCart();
        const item = cart.find(item => item.id === itemId);

        if (item) {
            item.quantity += change;
            
            if (item.quantity < 1) {
                this.removeItem(button);
                return;
            }

            this.saveCart(cart);
            this.displayCartItems();
        }
    }

    removeItem(button) {
        if (!confirm('Remove this item from your cart?')) return;
        
        const cartItem = button.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        let cart = this.getCart();
        
        cart = cart.filter(item => item.id !== itemId);
        this.saveCart(cart);
        this.displayCartItems();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CartSystem();
});



//Code for Product page slide show//
{/* <script> */}
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    let index = 0;
    let autoSlide = true;

    const showSlide = (i) => {
        slides.forEach(slide => slide.classList.remove('show'));
        slides[i].classList.add('show');
    };

    const nextSlide = () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    };

    const interval = setInterval(() => {
        if (autoSlide) nextSlide();
    }, 3000);

    // Pause on touch/click
    document.querySelector('.carousel-wrapper').addEventListener('touchstart', () => {
        autoSlide = false;
    });

    document.querySelector('.carousel-wrapper').addEventListener('mousedown', () => {
        autoSlide = false;
    });
});
{/* </script> */}

