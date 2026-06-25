// admin.js
import { auth, db, storage } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, 
    getDocs, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    ref, 
    uploadBytesResumable, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       DOM ELEMENTS
       ============================================= */
    const loginContainer     = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm          = document.getElementById('login-form');
    const loginEmail         = document.getElementById('login-email');
    const loginPassword      = document.getElementById('login-password');
    const userDisplayEmail   = document.getElementById('user-display-email');
    const btnLogout          = document.getElementById('btn-logout');
    const toast              = document.getElementById('toast');
    
    // Product List & Management
    const dbProductsList     = document.getElementById('db-products-list');
    const btnAddProduct      = document.getElementById('btn-add-product');
    
    // Modal Product Elements
    const productModalOverlay= document.getElementById('product-modal-overlay');
    const productModal       = document.getElementById('product-modal');
    const productModalClose  = document.getElementById('product-modal-close');
    const btnCancelProduct   = document.getElementById('btn-cancel-product');
    const productForm        = document.getElementById('product-form');
    const modalTitleText     = document.getElementById('modal-title-text');
    
    // Form Inputs
    const productIdInput     = document.getElementById('product-id');
    const productNameInput   = document.getElementById('product-name');
    const productCategorySelect= document.getElementById('product-category');
    const productPriceInput  = document.getElementById('product-price');
    const productDescTextarea= document.getElementById('product-desc');
    const productFallbackIcon= document.getElementById('product-fallback-icon');
    const productFileImgInput= document.getElementById('product-image-file');
    const imgUploadZone      = document.getElementById('image-upload-zone');
    const imgPreview         = document.getElementById('image-preview');
    const uploadProgressCont = document.getElementById('upload-progress-container');
    const uploadProgressBar  = document.getElementById('upload-progress-bar');

    /* =============================================
       STATE
       ============================================= */
    let localProducts = [];
    let selectedFile = null;
    let currentEditingImageUrl = ""; // To preserve image url when editing without changing image

    // Default coffee products for initial seeding
    const defaultProducts = [
        {
            name: "Café Arábica Premium",
            category: "Café en Grano",
            desc: "Granos 100% Arábica de origen único, con notas de chocolate y frutos rojos. Tostado medio.",
            price: 8.50,
            icon: "fa-seedling",
            iconColor: "#6B3A1F",
            bgColor: "#F2E8D9",
            imageUrl: ""
        },
        {
            name: "Mezcla Especial MP",
            category: "Blend Exclusivo",
            desc: "Nuestra mezcla estrella: Arábica + Robusta para un espresso intenso con crema perfecta.",
            price: 9.00,
            icon: "fa-mug-hot",
            iconColor: "#8B5E3C",
            bgColor: "#FDF8F0",
            imageUrl: ""
        },
        {
            name: "Café Molido Suave",
            category: "Café Molido",
            desc: "Perfecto para cafetera de filtro. Molido medio con sabor suave y aroma floral inigualable.",
            price: 7.50,
            icon: "fa-blender",
            iconColor: "#C8895A",
            bgColor: "#F5ECD7",
            imageUrl: ""
        },
        {
            name: "Cápsulas de Café (x10)",
            category: "Cápsulas",
            desc: "Compatibles con máquinas Nespresso. Intensidad 8 – Sabor tostado con toque caramelizado.",
            price: 12.00,
            icon: "fa-capsules",
            iconColor: "#5C2D0E",
            bgColor: "#F2E8D9",
            imageUrl: ""
        },
        {
            name: "Cold Brew Concentrate",
            category: "Café Frío",
            desc: "Concentrado de café frío listo para diluir, ideal para el verano. Suave, sin acidez.",
            price: 11.00,
            icon: "fa-glass-water",
            iconColor: "#8B5E3C",
            bgColor: "#FDF8F0",
            imageUrl: ""
        },
        {
            name: "Pack Degustación",
            category: "Packs Especiales",
            desc: "3 tipos de café en presentación de 100g cada uno. El regalo perfecto para los amantes del café.",
            price: 22.00,
            icon: "fa-gift",
            iconColor: "#D4A055",
            bgColor: "#F5ECD7",
            imageUrl: ""
        }
    ];

    /* =============================================
       AUTHENTICATION STATE TRACKER
       ============================================= */
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            loginContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            document.body.classList.add('admin-logged-in');
            userDisplayEmail.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${user.email}`;
            loadProducts();
        } else {
            // User is signed out.
            loginContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
            document.body.classList.remove('admin-logged-in');
            dbProductsList.innerHTML = '';
        }
    });

    /* =============================================
       LOGIN PROCESS
       ============================================= */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        showToast('🔑 Verificando credenciales...');
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showToast('✅ ¡Sesión iniciada con éxito!');
                loginForm.reset();
            })
            .catch((error) => {
                console.error("Login Error:", error);
                let userMessage = '❌ Error al iniciar sesión';
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    userMessage = '❌ Correo o contraseña incorrectos';
                } else if (error.code === 'auth/too-many-requests') {
                    userMessage = '⚠️ Acceso bloqueado temporalmente por demasiados intentos fallidos';
                }
                showToast(userMessage);
            });
    });

    /* =============================================
       LOGOUT PROCESS
       ============================================= */
    btnLogout.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                showToast('🔒 Sesión cerrada.');
            })
            .catch((error) => {
                showToast('❌ Error al cerrar sesión');
            });
    });

    /* =============================================
       LOAD & RENDER PRODUCTS FROM FIRESTORE
       ============================================= */
    async function loadProducts() {
        try {
            dbProductsList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <div class="loading-spinner-wrapper">
                            <i class="fa-solid fa-circle-notch fa-spin loading-spinner"></i>
                            <span>Cargando productos...</span>
                        </div>
                    </td>
                </tr>
            `;

            const querySnapshot = await getDocs(collection(db, "products"));
            let products = [];
            
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });

            // If empty, seed default products
            if (products.length === 0) {
                showToast('🌱 Inicializando catálogo por defecto...');
                for (const p of defaultProducts) {
                    await addDoc(collection(db, "products"), p);
                }
                // Reload after seeding
                return loadProducts();
            }

            // Sort products by name or default index
            products.sort((a, b) => a.name.localeCompare(b.name));
            localProducts = products;
            
            renderAdminProducts(products);
        } catch (error) {
            console.error("Error loading products:", error);
            dbProductsList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 error-text">
                        <i class="fa-solid fa-triangle-exclamation"></i> Error al cargar productos desde Firestore.
                        <br><small>Verifica las reglas de seguridad o tu conexión.</small>
                    </td>
                </tr>
            `;
            showToast('❌ Error al cargar productos');
        }
    }

    function renderAdminProducts(products) {
        if (products.length === 0) {
            dbProductsList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        No hay productos registrados en el catálogo. ¡Agrega uno nuevo!
                    </td>
                </tr>
            `;
            return;
        }

        dbProductsList.innerHTML = '';
        products.forEach(p => {
            const tr = document.createElement('tr');
            
            // Render thumbnail image or icon
            let mediaHtml = '';
            if (p.imageUrl) {
                mediaHtml = `<div class="table-img-preview" style="background-image: url('${p.imageUrl}')"></div>`;
            } else {
                mediaHtml = `
                    <div class="table-icon-preview" style="background-color: ${p.bgColor || '#F2E8D9'}">
                        <i class="fa-solid ${p.icon || 'fa-mug-hot'}" style="color: ${p.iconColor || '#6B3A1F'}"></i>
                    </div>
                `;
            }

            tr.innerHTML = `
                <td>${mediaHtml}</td>
                <td><strong>${p.name}</strong></td>
                <td><span class="db-badge">${p.category}</span></td>
                <td><div class="table-desc-limit">${p.desc}</div></td>
                <td><strong>$${parseFloat(p.price).toFixed(2)}</strong></td>
                <td class="text-right actions-cell">
                    <button class="btn-action btn-edit" data-id="${p.id}" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${p.id}" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            dbProductsList.appendChild(tr);
        });

        // Add Event Listeners to actions
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', handleEditProductClick);
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', handleDeleteProductClick);
        });
    }

    /* =============================================
       MODAL CONTROLS & FORM PREPARATION
       ============================================= */
    function openProductModal() {
        productModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        productModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        productForm.reset();
        selectedFile = null;
        currentEditingImageUrl = "";
        uploadProgressCont.classList.add('hidden');
        uploadProgressBar.style.width = '0%';
        uploadProgressBar.innerText = '0%';
        resetImagePreview();
    }

    productModalClose.addEventListener('click', closeProductModal);
    btnCancelProduct.addEventListener('click', closeProductModal);
    productModalOverlay.addEventListener('click', (e) => {
        if (e.target === productModalOverlay) closeProductModal();
    });

    btnAddProduct.addEventListener('click', () => {
        modalTitleText.innerHTML = `<i class="fa-solid fa-plus"></i> Agregar Nuevo Producto`;
        productIdInput.value = '';
        currentEditingImageUrl = '';
        openProductModal();
    });

    // Reset Image Preview
    function resetImagePreview() {
        imgPreview.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
            <span>Selecciona o arrastra una imagen</span>
        `;
        imgPreview.style.backgroundImage = '';
    }

    // Set Image Preview
    function setImagePreviewUrl(url) {
        imgPreview.innerHTML = '';
        imgPreview.style.backgroundImage = `url('${url}')`;
        imgPreview.style.backgroundSize = 'cover';
        imgPreview.style.backgroundPosition = 'center';
    }

    /* Handle file selection and drag-and-drop preview */
    imgUploadZone.addEventListener('click', () => {
        productFileImgInput.click();
    });

    productFileImgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleSelectedFile(file);
    });

    // Drag and drop events
    imgUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imgUploadZone.classList.add('dragover');
    });

    imgUploadZone.addEventListener('dragleave', () => {
        imgUploadZone.classList.remove('dragover');
    });

    imgUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imgUploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleSelectedFile(file);
    });

    function handleSelectedFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('⚠️ Por favor, selecciona solo archivos de imagen');
            return;
        }

        selectedFile = file;

        // Display local preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /* =============================================
       SAVE / UPDATE PRODUCT (CRUD)
       ============================================= */
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pId = productIdInput.value;
        const pName = productNameInput.value.trim();
        const pCategory = productCategorySelect.value;
        const pPrice = parseFloat(productPriceInput.value);
        const pDesc = productDescTextarea.value.trim();
        const pFallbackIcon = productFallbackIcon.value;

        if (!pName || !pCategory || isNaN(pPrice) || !pDesc) {
            showToast('⚠️ Por favor, completa todos los campos requeridos');
            return;
        }

        // Set colors and background dynamically matching the original design styles
        let iconColor = "#8B5E3C";
        let bgColor = "#FDF8F0";

        if (pCategory === "Café en Grano") {
            iconColor = "#6B3A1F";
            bgColor = "#F2E8D9";
        } else if (pCategory === "Blend Exclusivo") {
            iconColor = "#8B5E3C";
            bgColor = "#FDF8F0";
        } else if (pCategory === "Café Molido") {
            iconColor = "#C8895A";
            bgColor = "#F5ECD7";
        } else if (pCategory === "Cápsulas") {
            iconColor = "#5C2D0E";
            bgColor = "#F2E8D9";
        } else if (pCategory === "Café Frío") {
            iconColor = "#8B5E3C";
            bgColor = "#FDF8F0";
        } else if (pCategory === "Packs Especiales") {
            iconColor = "#D4A055";
            bgColor = "#F5ECD7";
        }

        try {
            // Disable save button to prevent double click
            const btnSave = document.getElementById('btn-save-product');
            btnSave.disabled = true;
            btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

            let imageUrl = currentEditingImageUrl;

            // 1. Upload file if selected
            if (selectedFile) {
                uploadProgressCont.classList.remove('hidden');
                
                const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, selectedFile);

                // Wait for upload promise
                imageUrl = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            uploadProgressBar.style.width = progress + '%';
                            uploadProgressBar.innerText = progress + '%';
                        }, 
                        (error) => {
                            console.error("Upload Error:", error);
                            reject(error);
                        }, 
                        async () => {
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadUrl);
                        }
                    );
                });
            }

            // 2. Prepare data object
            const productData = {
                name: pName,
                category: pCategory,
                price: pPrice,
                desc: pDesc,
                icon: pFallbackIcon,
                iconColor: iconColor,
                bgColor: bgColor,
                imageUrl: imageUrl
            };

            // 3. Save to Firestore
            if (pId) {
                // Update existing
                await updateDoc(doc(db, "products", pId), productData);
                showToast('✅ Producto actualizado correctamente');
            } else {
                // Create new
                await addDoc(collection(db, "products"), productData);
                showToast('✅ Producto creado correctamente');
            }

            // Reset and close modal
            closeProductModal();
            loadProducts();
            
        } catch (error) {
            console.error("Save Error:", error);
            showToast('❌ Error al guardar el producto');
        } finally {
            const btnSave = document.getElementById('btn-save-product');
            btnSave.disabled = false;
            btnSave.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Producto`;
        }
    });

    /* =============================================
       EDIT PRODUCT LOGIC
       ============================================= */
    function handleEditProductClick(e) {
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-id');
        const product = localProducts.find(p => p.id === productId);

        if (!product) return;

        // Populate Modal Fields
        modalTitleText.innerHTML = `<i class="fa-solid fa-pen"></i> Editar Producto: ${product.name}`;
        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productCategorySelect.value = product.category;
        productPriceInput.value = product.price;
        productDescTextarea.value = product.desc;
        productFallbackIcon.value = product.icon || 'fa-mug-hot';
        
        currentEditingImageUrl = product.imageUrl || '';
        
        if (currentEditingImageUrl) {
            setImagePreviewUrl(currentEditingImageUrl);
        } else {
            resetImagePreview();
        }

        openProductModal();
    }

    /* =============================================
       DELETE PRODUCT LOGIC
       ============================================= */
    async function handleDeleteProductClick(e) {
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-id');
        const product = localProducts.find(p => p.id === productId);

        if (!product) return;

        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}" del catálogo?`);
        if (!confirmDelete) return;

        try {
            showToast('🗑️ Eliminando producto...');
            await deleteDoc(doc(db, "products", productId));
            showToast('✅ Producto eliminado del catálogo');
            loadProducts();
        } catch (error) {
            console.error("Delete Error:", error);
            showToast('❌ Error al eliminar el producto');
        }
    }

    /* =============================================
       TOAST NOTIFICATION UTILITY
       ============================================= */
    function showToast(message) {
        toast.innerHTML = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
});
