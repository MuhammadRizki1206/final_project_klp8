// ==========================================
// 1. Data Produk Dummy (Tersimpan Lokal & Aman)
// ==========================================
const products = [
    { id: 1, name: "Mouse Gaming RGB", price: 150000, image: "https://i.pinimg.com/736x/69/50/82/695082caa33e275191ef8ee05bd9b316.jpg" },
    { id: 2, name: "Keyboard Mechanical", price: 450000, image: "https://i.pinimg.com/1200x/8c/9c/1f/8c9c1f742aec1007d6dbba1894f0ef5a.jpg" },
    { id: 3, name: "Headset Gaming Surround", price: 350000, image: "https://i.pinimg.com/1200x/7e/37/f7/7e37f7bf17027c0d2b7fc651c4d36c27.jpg" },
    { id: 4, name: "Monitor 24 Inch 144Hz", price: 1800000, image: "https://i.pinimg.com/1200x/26/c8/9f/26c89f0f8ec3bac5f7419357ba25f28e.jpg" },
    { id: 5, name: "Mousepad Ekstra Lebar", price: 750000, image: "https://i.pinimg.com/1200x/c4/a2/94/c4a294dc59e2586bfac7f2b54f3b6077.jpg" },
    { id: 6, name: "Webcam Full HD 1080p", price: 290000, image: "https://i.pinimg.com/1200x/9c/c5/54/9cc5542e9398bfdb04aa00baebdabd2a.jpg" }
];


// Array untuk menampung barang belanjaan user
let cart = [];

// ==========================================
// 2. Mengambil Elemen DOM HTML
// ==========================================
const productsGrid = document.getElementById("products-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const checkoutBtn = document.getElementById("checkout-btn");
const toastContainer = document.getElementById("toast-container");
const cartBadge = document.getElementById("cart-badge");
const cartManifestNo = document.getElementById("cart-manifest-no");

// ==========================================
// Fitur Tambahan: Notifikasi ala Sonner (Manipulasi DOM)
// ==========================================
function showToast(message, type = "success") {

    const icons = {
        success: "fa-check",
        error: "fa-xmark",
        info: "fa-circle-info"
    };

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span class="toast-icon"><i class="fa-solid ${icons[type]}"></i></span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Tutup notifikasi"><i class="fa-solid fa-xmark"></i></button>
        <span class="toast-progress"></span>
    `;

    toastContainer.appendChild(toast);

    const dismiss = () => {
        toast.classList.add("hide");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    const timer = setTimeout(dismiss, 3000);

    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(timer);
        dismiss();
    });

}

// ==========================================
// Fungsi Bantuan: Format Kode SKU (SKU-001, SKU-002, dst)
// ==========================================
function formatSku(id) {
    return `SKU-${String(id).padStart(3, "0")}`;
}

// ==========================================
// 3. Fungsi Menampilkan Produk (Menggunakan LOOP)
// ==========================================
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = ""; // Bersihkan grid sebelum merender ulang
    
    // Perulangan (Looping) Array untuk membuat Card HTML tiap produk
    productsToDisplay.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        
        productCard.innerHTML = `
            <div class="card-media">
                <img src="${product.image}" alt="${product.name}">
                <span class="sku-tag">${formatSku(product.id)}</span>
                <span class="corner corner-tl"></span>
                <span class="corner corner-tr"></span>
                <span class="corner corner-bl"></span>
                <span class="corner corner-br"></span>
            </div>
            <h3>${product.name}</h3>
            <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
        `;
        
        productsGrid.appendChild(productCard);
    });

    // Logika Kondisional (If) jika produk yang dicari tidak ada
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #95a5a6; padding: 20px;'>Produk tidak ditemukan.</p>";
    }
}

// ==========================================
// 4. Fungsi Tambah Barang ke Keranjang
// ==========================================
window.addToCart = function(productId) {
    const existingItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId); // Ambil data produk

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    
    // Panggil Sonner UI (Warna Hijau)
    showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
};

// ==========================================
// 5. Fungsi Hapus Barang dari Keranjang
// ==========================================
window.removeFromCart = function(productId) {
    const product = cart.find(item => item.id === productId); // Cari nama produk yang dihapus
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    
    // Panggil Sonner UI (Warna Biru)
    showToast(`${product.name} dihapus dari keranjang.`, 'info');
};

// ==========================================
// 5b. Fungsi Kontrol Quantity (+/-) di Keranjang
// ==========================================
window.increaseQty = function(productId) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += 1;
    updateCart();
};

window.decreaseQty = function(productId) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity -= 1;

    // Kalau quantity habis, hapus otomatis dari keranjang
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
        showToast(`${item.name} dihapus dari keranjang.`, 'info');
    }

    updateCart();
};

// ==========================================
// 6. Fungsi Kalkulasi Total & Pembaruan DOM Keranjang (LOOPING)
// ==========================================
function updateCart() {
    cartItemsContainer.innerHTML = ""; // Kosongkan tampilan lama
    let totalHarga = 0;
    let totalItem = 0; // Akumulasi total quantity untuk badge

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
    } else {
        // Lakukan looping pada barang yang ada di dalam keranjang
        cart.forEach(item => {
            const subTotal = item.price * item.quantity;
            totalHarga += subTotal; // Akumulasi total harga simulation
            totalItem += item.quantity; // Akumulasi total quantity

            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span class="cart-item-price">${formatSku(item.id)} · Rp ${item.price.toLocaleString('id-ID')}/item</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-subtotal">Rp ${subTotal.toLocaleString('id-ID')}</span>
                    <div class="qty-control">
                        <button onclick="decreaseQty(${item.id})" aria-label="Kurangi jumlah">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQty(${item.id})" aria-label="Tambah jumlah">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Manipulasi DOM untuk mengubah teks total harga
    cartTotal.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;

    // Update badge jumlah item di ikon keranjang
    updateCartBadge(totalItem);
}

// ==========================================
// 6b. Fungsi Update Badge Jumlah Item di Cart Icon
// ==========================================
function updateCartBadge(totalItem) {
    if (totalItem > 0) {
        cartBadge.textContent = totalItem > 99 ? "99+" : totalItem;
        cartBadge.classList.remove("hidden");
    } else {
        cartBadge.classList.add("hidden");
    }
}

// ==========================================
// 6c. Fungsi Nomor Manifest (Kode Sesi Keranjang)
// ==========================================
function generateManifestNo() {
    const random = Math.floor(1000 + Math.random() * 9000);
    cartManifestNo.textContent = `MANIFEST NO. ${random}`;
}

// ==========================================
// 7. Event Listener: Fitur Pencarian Real-Time
// ==========================================
searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    
    // Filter array produk berdasarkan huruf yang diketik pengguna
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword)
    );
    
    displayProducts(filteredProducts);
});

// ==========================================
// 8. Event Listener: Simulasi Tombol Checkout
// ==========================================
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        // Panggil Sonner UI (Warna Merah)
        showToast("Keranjang kosong! Pilih produk dulu.", "error");
    } else {
        // Panggil Sonner UI (Warna Hijau)
        showToast("Checkout berhasil! Pesanan diproses.", "success");
        cart = []; 
        updateCart();
        generateManifestNo();
    }
});

// Menampilkan semua produk & nomor manifest untuk pertama kali saat halaman dibuka
displayProducts(products);
generateManifestNo();