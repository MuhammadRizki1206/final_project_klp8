// ==========================================
// 1. Data Produk Dummy (Tersimpan Lokal & Aman)
// ==========================================
const products = [
    { id: 1, name: "Mouse Gaming RGB", price: 150000, image: "https://i.pinimg.com/736x/69/50/82/695082caa33e275191ef8ee05bd9b316.jpg", stock: 18 },
    { id: 2, name: "Keyboard Mechanical", price: 450000, image: "https://i.pinimg.com/1200x/8c/9c/1f/8c9c1f742aec1007d6dbba1894f0ef5a.jpg", stock: 7, flashSale: { active: true, discountPercent: 20, durationMs: 2 * 60 * 60 * 1000 } },
    { id: 3, name: "Headset Gaming Surround", price: 350000, image: "https://i.pinimg.com/1200x/7e/37/f7/7e37f7bf17027c0d2b7fc651c4d36c27.jpg", stock: 3 },
    { id: 4, name: "Monitor 24 Inch 144Hz", price: 1800000, image: "https://i.pinimg.com/1200x/26/c8/9f/26c89f0f8ec3bac5f7419357ba25f28e.jpg", stock: 5, flashSale: { active: true, discountPercent: 15, durationMs: 45 * 60 * 1000 } },
    { id: 5, name: "Mousepad Ekstra Lebar", price: 750000, image: "https://i.pinimg.com/1200x/c4/a2/94/c4a294dc59e2586bfac7f2b54f3b6077.jpg", stock: 22 },
    { id: 6, name: "Webcam Full HD 1080p", price: 290000, image: "https://i.pinimg.com/1200x/9c/c5/54/9cc5542e9398bfdb04aa00baebdabd2a.jpg", stock: 25 },
    { id: 7, name: "SSD NVMe 512GB", price: 650000, image: "https://i.pinimg.com/736x/93/30/74/93307460861eae0c04e4a5d50493f75b.jpg", stock: 40, flashSale: { active: true, discountPercent: 25, durationMs: 90 * 60 * 1000 } },
    { id: 8, name: "RAM DDR4 16GB 3200MHz", price: 550000, image: "https://i.pinimg.com/1200x/f7/6f/52/f76f52be8ec3c8f0fbfc8faba8dd7bf5.jpg", stock: 30 },
    { id: 9, name: "Kursi Gaming Ergonomis", price: 2500000, image: "https://i.pinimg.com/736x/35/74/03/3574031ba1fd76f80bf2d5c80025cb91.jpg", stock: 4 },
    { id: 10, name: "Flashdisk 64GB", price: 85000, image: "https://i.pinimg.com/736x/f9/d7/ba/f9d7bab6bd9966cd02a4276037969891.jpg", stock: 60 },
    { id: 11, name: "Kipas Casing RGB 120mm", price: 120000, image: "https://i.pinimg.com/736x/26/dc/1e/26dc1ebd3d684851eacb1dff2f3507f0.jpg", stock: 2 },
    { id: 12, name: "VGA Card Entry Level 4GB", price: 3200000, image: "https://i.pinimg.com/1200x/f4/a2/c5/f4a2c5802983f5463b1c8bed9ecfadff.jpg", stock: 6, flashSale: { active: true, discountPercent: 10, durationMs: 3 * 60 * 60 * 1000 } }
];

// Set waktu berakhir flash sale relatif ke saat halaman dimuat
products.forEach(product => {
    if (product.flashSale && product.flashSale.active) {
        product.flashSale.endsAt = Date.now() + product.flashSale.durationMs;
    }
});


// Array untuk menampung barang belanjaan user
let cart = [];

// ==========================================
// 2. Mengambil Elemen DOM HTML
// ==========================================
const productsGrid = document.getElementById("products-grid");
const productsEmptyState = document.getElementById("products-empty-state");
const paginationEl = document.getElementById("pagination");
const paginationPrev = document.getElementById("pagination-prev");
const paginationNext = document.getElementById("pagination-next");
const paginationPages = document.getElementById("pagination-pages");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const checkoutBtn = document.getElementById("checkout-btn");
const toastContainer = document.getElementById("toast-container");
const cartBadge = document.getElementById("cart-badge");
const cartManifestNo = document.getElementById("cart-manifest-no");
const paletteTrigger = document.getElementById("palette-trigger");
const paletteOverlay = document.getElementById("palette-overlay");
const paletteInput = document.getElementById("palette-input");
const paletteResults = document.getElementById("palette-results");

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
// Fungsi Bantuan: Badge Stok Live
// ==========================================
function getStockBadgeClass(stock) {
    if (stock <= 0) return "out";
    if (stock <= 5) return "low";
    return "";
}

function getStockBadgeHTML(stock) {
    if (stock <= 0) {
        return `<i class="fa-solid fa-ban"></i> Stok habis`;
    }
    if (stock <= 5) {
        return `<i class="fa-solid fa-triangle-exclamation"></i> Stok tersisa: ${stock}`;
    }
    return `<i class="fa-solid fa-box"></i> Stok tersisa: ${stock}`;
}

// ==========================================
// Fungsi Bantuan: Harga Setelah Diskon Flash Sale
// ==========================================
function getDiscountedPrice(product) {
    const discount = product.flashSale.discountPercent;
    return Math.round(product.price * (1 - discount / 100));
}

// ==========================================
// Fungsi Bantuan: Format Countdown (HH:MM:SS)
// ==========================================
function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

// ==========================================
// Memperbarui Tampilan Stok & Tombol Satu Kartu Produk Tanpa Render Ulang
// ==========================================
function refreshStockUI(productId) {
    const product = products.find(p => p.id === productId);
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!product || !card) return;

    const stockBadge = card.querySelector(".stock-badge");
    const btn = card.querySelector(".add-to-cart-btn");

    if (stockBadge) {
        stockBadge.innerHTML = getStockBadgeHTML(product.stock);
        stockBadge.className = "stock-badge " + getStockBadgeClass(product.stock);
    }

    if (btn) {
        btn.disabled = product.stock <= 0;
        btn.textContent = product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang";
    }
}

// ==========================================
// 3. Fungsi Menampilkan Produk (Menggunakan LOOP)
// ==========================================
function buildProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.productId = product.id;

    const hasFlashSale = product.flashSale && product.flashSale.active;

    const flashBadgeHTML = hasFlashSale
        ? `<span class="flash-badge"><i class="fa-solid fa-bolt"></i> -${product.flashSale.discountPercent}%</span>`
        : "";

    const priceHTML = hasFlashSale
        ? `<div class="price-row">
               <span class="price-strike">Rp ${product.price.toLocaleString('id-ID')}</span>
               <span class="price flash">Rp ${getDiscountedPrice(product).toLocaleString('id-ID')}</span>
           </div>`
        : `<div class="price-row"><span class="price">Rp ${product.price.toLocaleString('id-ID')}</span></div>`;

    const countdownHTML = hasFlashSale
        ? `<p class="flash-countdown" data-countdown-id="${product.id}"><i class="fa-solid fa-clock"></i> Berakhir dalam <span class="countdown-text">--:--:--</span></p>`
        : "";

    productCard.innerHTML = `
        <div class="card-media">
            <img src="${product.image}" alt="${product.name}">
            <span class="sku-tag">${formatSku(product.id)}</span>
            ${flashBadgeHTML}
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
        </div>
        <h3>${product.name}</h3>
        <p class="stock-badge ${getStockBadgeClass(product.stock)}">${getStockBadgeHTML(product.stock)}</p>
        ${priceHTML}
        ${countdownHTML}
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${product.stock <= 0 ? "disabled" : ""}>${product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}</button>
    `;

    return productCard;
}

// ==========================================
// Pagination: 6 produk per halaman
// ==========================================
const PRODUCTS_PER_PAGE = 6;
let currentFilteredProducts = products;
let currentPage = 1;

function displayProducts(productsToDisplay) {
    currentFilteredProducts = productsToDisplay;
    currentPage = 1; // Setiap kali filter/search berubah, balik ke halaman 1
    renderCurrentPage();
}

function renderCurrentPage() {
    const totalPages = Math.max(1, Math.ceil(currentFilteredProducts.length / PRODUCTS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageItems = currentFilteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

    productsGrid.innerHTML = "";
    pageItems.forEach(product => productsGrid.appendChild(buildProductCard(product)));

    productsEmptyState.classList.toggle("hidden", currentFilteredProducts.length !== 0);
    productsGrid.classList.toggle("hidden", currentFilteredProducts.length === 0);

    renderPagination(totalPages);
    tickCountdowns(); // Langsung isi angka countdown begitu kartu selesai dirender
}

function renderPagination(totalPages) {
    // Sembunyikan navigasi kalau produk cuma muat 1 halaman
    paginationEl.classList.toggle("hidden", totalPages <= 1);
    if (totalPages <= 1) return;

    paginationPages.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = "pagination-page" + (page === currentPage ? " active" : "");
        pageBtn.textContent = page;
        pageBtn.addEventListener("click", () => {
            currentPage = page;
            renderCurrentPage();
            productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        paginationPages.appendChild(pageBtn);
    }

    paginationPrev.disabled = currentPage === 1;
    paginationNext.disabled = currentPage === totalPages;
}

paginationPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        renderCurrentPage();
        productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

paginationNext.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(currentFilteredProducts.length / PRODUCTS_PER_PAGE));
    if (currentPage < totalPages) {
        currentPage += 1;
        renderCurrentPage();
        productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

// ==========================================
// 4. Fungsi Tambah Barang ke Keranjang
// ==========================================
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId); // Ambil data produk

    if (!product || product.stock <= 0) {
        showToast("Stok produk ini sudah habis.", "error");
        return;
    }

    // Kalau lagi flash sale, harga yang dipakai di keranjang harus harga setelah diskon
    const isFlashSale = product.flashSale && product.flashSale.active;
    const priceToUse = isFlashSale ? getDiscountedPrice(product) : product.price;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, price: priceToUse, quantity: 1 });
    }

    product.stock -= 1; // Kurangi stok live begitu masuk keranjang
    refreshStockUI(productId);

    updateCart();
    
    // Panggil Sonner UI (Warna Hijau)
    showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
};

// ==========================================
// 5. Fungsi Hapus Barang dari Keranjang
// ==========================================
window.removeFromCart = function(productId) {
    const item = cart.find(item => item.id === productId); // Cari item yang dihapus
    const product = products.find(p => p.id === productId);

    if (product && item) {
        product.stock += item.quantity; // Kembalikan semua stok yang dipesan
        refreshStockUI(productId);
    }

    cart = cart.filter(item => item.id !== productId);
    updateCart();
    
    // Panggil Sonner UI (Warna Biru)
    showToast(`${item.name} dihapus dari keranjang.`, 'info');
};

// ==========================================
// 5b. Fungsi Kontrol Quantity (+/-) di Keranjang
// ==========================================
window.increaseQty = function(productId) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    if (!item || !product) return;

    if (product.stock <= 0) {
        showToast("Stok tidak cukup.", "error");
        return;
    }

    item.quantity += 1;
    product.stock -= 1;
    refreshStockUI(productId);
    updateCart();
};

window.decreaseQty = function(productId) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    if (!item) return;

    item.quantity -= 1;
    if (product) {
        product.stock += 1; // Kembalikan 1 stok ke inventori
        refreshStockUI(productId);
    }

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
// 6d. Fungsi Countdown Flash Sale (Update Tiap Detik)
// ==========================================
function tickCountdowns() {
    products.forEach(product => {
        if (!product.flashSale || !product.flashSale.active) return;

        const remaining = product.flashSale.endsAt - Date.now();
        const el = document.querySelector(`[data-countdown-id="${product.id}"] .countdown-text`);

        if (remaining <= 0) {
            // Flash sale berakhir: nonaktifkan dan kembalikan tampilan kartu ke harga normal
            product.flashSale.active = false;
            const card = document.querySelector(`.product-card[data-product-id="${product.id}"]`);
            if (card) {
                const flashBadge = card.querySelector(".flash-badge");
                const countdownEl = card.querySelector(".flash-countdown");
                const priceStrike = card.querySelector(".price-strike");
                const priceEl = card.querySelector(".price");

                if (flashBadge) flashBadge.remove();
                if (countdownEl) countdownEl.remove();
                if (priceStrike) priceStrike.remove();
                if (priceEl) {
                    priceEl.classList.remove("flash");
                    priceEl.textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
                }
            }
            return;
        }

        if (el) el.textContent = formatCountdown(remaining);
    });
}

// Jalankan penghitung mundur setiap detik selama halaman terbuka
setInterval(tickCountdowns, 1000);

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

// ==========================================
// 9. Command Palette (Cmd/Ctrl + K)
// ==========================================
let paletteActiveIndex = 0;
let paletteMatches = [];

function openPalette() {
    paletteOverlay.classList.remove("hidden");
    paletteInput.value = "";
    renderPaletteResults(products);
    // Kasih jeda sedikit biar animasi & focus jalan mulus
    setTimeout(() => paletteInput.focus(), 30);
}

function closePalette() {
    paletteOverlay.classList.add("hidden");
}

function renderPaletteResults(matches) {
    paletteMatches = matches;
    paletteActiveIndex = 0;
    paletteResults.innerHTML = "";

    if (matches.length === 0) {
        paletteResults.innerHTML = `<p class="palette-empty">Tidak ada komponen yang cocok.</p>`;
        return;
    }

    matches.forEach((product, index) => {
        const row = document.createElement("div");
        row.className = "palette-item" + (index === 0 ? " active" : "");
        row.dataset.index = index;

        const hasFlashSale = product.flashSale && product.flashSale.active;
        const priceHTML = hasFlashSale
            ? `<span class="palette-item-price flash">Rp ${getDiscountedPrice(product).toLocaleString('id-ID')}</span>`
            : `<span class="palette-item-price">Rp ${product.price.toLocaleString('id-ID')}</span>`;
        const stockNote = product.stock <= 0
            ? `<span class="palette-item-stock out">Habis</span>`
            : product.stock <= 5
                ? `<span class="palette-item-stock low">Sisa ${product.stock}</span>`
                : "";

        row.innerHTML = `
            <span class="palette-item-sku">${formatSku(product.id)}</span>
            <span class="palette-item-name">${product.name}</span>
            ${stockNote}
            ${priceHTML}
        `;

        row.addEventListener("click", () => {
            addToCart(product.id);
            closePalette();
        });

        row.addEventListener("mouseenter", () => {
            setPaletteActive(index);
        });

        paletteResults.appendChild(row);
    });
}

function setPaletteActive(index) {
    const rows = paletteResults.querySelectorAll(".palette-item");
    rows.forEach(r => r.classList.remove("active"));
    if (rows[index]) {
        rows[index].classList.add("active");
        rows[index].scrollIntoView({ block: "nearest" });
    }
    paletteActiveIndex = index;
}

// Buka palette lewat tombol ⌘K di search box
paletteTrigger.addEventListener("click", openPalette);

// Buka lewat shortcut keyboard Cmd/Ctrl + K, tutup lewat Escape
document.addEventListener("keydown", (e) => {
    const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";

    if (isShortcut) {
        e.preventDefault();
        paletteOverlay.classList.contains("hidden") ? openPalette() : closePalette();
        return;
    }

    if (!paletteOverlay.classList.contains("hidden") && e.key === "Escape") {
        closePalette();
    }
});

// Klik area gelap di luar modal juga menutup palette
paletteOverlay.addEventListener("click", (e) => {
    if (e.target === paletteOverlay) closePalette();
});

// Filter live sesuai ketikan di dalam command palette
paletteInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const matches = products.filter(product =>
        product.name.toLowerCase().includes(keyword) ||
        formatSku(product.id).toLowerCase().includes(keyword)
    );
    renderPaletteResults(matches);
});

// Navigasi keyboard di dalam command palette: atas/bawah pindah pilihan, enter tambah ke keranjang
paletteInput.addEventListener("keydown", (e) => {
    if (paletteMatches.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        setPaletteActive(Math.min(paletteActiveIndex + 1, paletteMatches.length - 1));
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPaletteActive(Math.max(paletteActiveIndex - 1, 0));
    } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = paletteMatches[paletteActiveIndex];
        if (chosen) {
            addToCart(chosen.id);
            closePalette();
        }
    }
});

// Menampilkan semua produk & nomor manifest untuk pertama kali saat halaman dibuka
displayProducts(products);
generateManifestNo();