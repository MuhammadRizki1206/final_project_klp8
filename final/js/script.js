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
const toastContainer = document.getElementById("toast-container"); // Tambahkan baris ini

// ==========================================
// Fitur Tambahan: Notifikasi ala Sonner (Manipulasi DOM)
// ==========================================
function showToast(message, type = "success") {

    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️"
    };

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${icons[type]}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        toast.addEventListener("animationend", () => {
            toast.remove();
        });

    },3000);

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
            <img src="${product.image}" alt="${product.name}">
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
// 6. Fungsi Kalkulasi Total & Pembaruan DOM Keranjang (LOOPING)
// ==========================================
function updateCart() {
    cartItemsContainer.innerHTML = ""; // Kosongkan tampilan lama
    let totalHarga = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
    } else {
        // Lakukan looping pada barang yang ada di dalam keranjang
        cart.forEach(item => {
            const subTotal = item.price * item.quantity;
            totalHarga += subTotal; // Akumulasi total harga simulation

            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</small>
                </div>
                <div style="text-align: right;">
                    <span style="display:block; margin-bottom:4px; font-weight:600;">Rp ${subTotal.toLocaleString('id-ID')}</span>
                    <button onclick="removeFromCart(${item.id})">Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Manipulasi DOM untuk mengubah teks total harga
    cartTotal.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
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
    }
});

// Menampilkan semua produk untuk pertama kali saat halaman dibuka
displayProducts(products);