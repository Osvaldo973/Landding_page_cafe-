document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       VARIABLES
    ============================================= */
    const navbar       = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks     = document.getElementById('nav-links');
    const toast        = document.getElementById('toast');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose   = document.getElementById('modal-close');
    const btnCancel    = document.getElementById('btn-cancel-order');
    const btnSendWA    = document.getElementById('btn-send-whatsapp');
    const orderSummary = document.getElementById('order-summary');
    const modalTotal   = document.getElementById('modal-total');
    const orderNombre  = document.getElementById('order-nombre');
    const orderApellido= document.getElementById('order-apellido');
    const orderTelefono= document.getElementById('order-telefono');

    // Número WhatsApp de Marsel & Elizabeth
    const WA_NUMBER = '18097775551';

    // Producto actualmente seleccionado para pedir
    let selectedProduct = null;

    /* =============================================
       NAVBAR — Scroll shadow & Mobile Menu
    ============================================= */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    /* =============================================
       PRODUCTOS — Catálogo de café
    ============================================= */
    const coffeeProducts = [
        {
            id: 1,
            name: "Café Arábica Premium",
            category: "Café en Grano",
            desc: "Granos 100% Arábica de origen único, con notas de chocolate y frutos rojos. Tostado medio.",
            price: 8.50,
            icon: "fa-seedling",
            iconColor: "#6B3A1F",
            bgColor: "#F2E8D9"
        },
        {
            id: 2,
            name: "Mezcla Especial MP",
            category: "Blend Exclusivo",
            desc: "Nuestra mezcla estrella: Arábica + Robusta para un espresso intenso con crema perfecta.",
            price: 9.00,
            icon: "fa-mug-hot",
            iconColor: "#8B5E3C",
            bgColor: "#FDF8F0"
        },
        {
            id: 3,
            name: "Café Molido Suave",
            category: "Café Molido",
            desc: "Perfecto para cafetera de filtro. Molido medio con sabor suave y aroma floral inigualable.",
            price: 7.50,
            icon: "fa-blender",
            iconColor: "#C8895A",
            bgColor: "#F5ECD7"
        },
        {
            id: 4,
            name: "Cápsulas de Café (x10)",
            category: "Cápsulas",
            desc: "Compatibles con máquinas Nespresso. Intensidad 8 – Sabor tostado con toque caramelizado.",
            price: 12.00,
            icon: "fa-capsules",
            iconColor: "#5C2D0E",
            bgColor: "#F2E8D9"
        },
        {
            id: 5,
            name: "Cold Brew Concentrate",
            category: "Café Frío",
            desc: "Concentrado de café frío listo para diluir, ideal para el verano. Suave, sin acidez.",
            price: 11.00,
            icon: "fa-glass-water",
            iconColor: "#8B5E3C",
            bgColor: "#FDF8F0"
        },
        {
            id: 6,
            name: "Pack Degustación",
            category: "Packs Especiales",
            desc: "3 tipos de café en presentación de 100g cada uno. El regalo perfecto para los amantes del café.",
            price: 22.00,
            icon: "fa-gift",
            iconColor: "#D4A055",
            bgColor: "#F5ECD7"
        }
    ];

    function renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        grid.innerHTML = '';

        coffeeProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card reveal';
            card.innerHTML = `
                <div class="product-image">
                    <div class="placeholder-img" style="background: linear-gradient(135deg, ${product.bgColor}, #e8d5bb);">
                        <i class="fa-solid ${product.icon}" style="font-size: 4rem; color: ${product.iconColor}; opacity: 0.85;"></i>
                    </div>
                </div>
                <div class="product-info">
                    <span class="category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="price">$${parseFloat(product.price).toFixed(2)}</div>
                    <button class="order-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <i class="fa-brands fa-whatsapp"></i>
                        Pedir por WhatsApp
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Asignar eventos a los botones de pedido
        document.querySelectorAll('.order-btn').forEach(btn => {
            btn.addEventListener('click', handleOrderClick);
        });

        // Trigger reveal on newly added cards
        revealOnScroll();
    }

    /* =============================================
       MODAL — Pedido por WhatsApp
    ============================================= */
    function handleOrderClick(e) {
        const btn = e.currentTarget;
        const productId   = parseInt(btn.getAttribute('data-id'));
        const productName = btn.getAttribute('data-name');
        const productPrice= parseFloat(btn.getAttribute('data-price'));

        selectedProduct = { id: productId, name: productName, price: productPrice };

        // Llenar el modal con el producto seleccionado
        orderSummary.innerHTML = `
            <div class="order-item">
                <span>${productName}</span>
                <span class="order-item-price">$${productPrice.toFixed(2)}</span>
            </div>
        `;
        modalTotal.innerHTML = `
            <span>Total a pagar:</span>
            <span>$${productPrice.toFixed(2)}</span>
        `;

        // Limpiar el formulario
        orderNombre.value   = '';
        orderApellido.value = '';
        orderTelefono.value = '';

        openModal();
    }

    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        selectedProduct = null;
    }

    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    /* Enviar pedido por WhatsApp */
    btnSendWA.addEventListener('click', () => {
        if (!selectedProduct) return;

        const nombre   = orderNombre.value.trim();
        const apellido = orderApellido.value.trim();
        const telefono = orderTelefono.value.trim();

        if (!nombre || !apellido || !telefono) {
            showToast('⚠️ Por favor, completa todos tus datos');
            return;
        }

        const mensaje =
            `¡Hola! 👋 Soy *${nombre} ${apellido}*.\n` +
            `📞 Mi teléfono: ${telefono}\n\n` +
            `☕ Me gustaría ordenar:\n` +
            `▶ *${selectedProduct.name}*\n` +
            `💰 Total: *$${selectedProduct.price.toFixed(2)}*\n\n` +
            `¡Gracias, espero su respuesta! ☕`;

        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');

        showToast('✅ ¡Pedido enviado! Te contactamos pronto.');
        closeModal();
    });

    /* =============================================
       TOAST NOTIFICATION
    ============================================= */
    function showToast(message) {
        toast.innerHTML = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    /* =============================================
       HERO PARTICLES (steam / coffee dots)
    ============================================= */
    function createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 6 + 3;
            const x = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = 6 + Math.random() * 8;
            const opacity = 0.08 + Math.random() * 0.18;

            p.style.cssText = `
                position: absolute;
                bottom: -20px;
                left: ${x}%;
                width: ${size}px;
                height: ${size}px;
                background: rgba(212, 160, 85, ${opacity});
                border-radius: 50%;
                animation: floatUp ${duration}s ${delay}s linear infinite;
            `;
            container.appendChild(p);
        }

        // Inject keyframes if not already present
        if (!document.getElementById('particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = `
                @keyframes floatUp {
                    0%   { transform: translateY(0) scale(1);   opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* =============================================
       REVEAL ON SCROLL
    ============================================= */
    function revealOnScroll() {
        const elements = document.querySelectorAll('.reveal:not(.visible)');
        const windowH = window.innerHeight;
        const threshold = 130;

        elements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < windowH - threshold) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });

    /* =============================================
       INIT
    ============================================= */
    renderProducts();
    createParticles();
    revealOnScroll();
});
