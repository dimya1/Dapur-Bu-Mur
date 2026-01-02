let keranjang = [];

// --- LOGIKA MENU BURGER ---
const burgerBtn = document.getElementById('burger-btn');
const navMenu = document.getElementById('nav-menu');

burgerBtn.onclick = () => navMenu.classList.toggle('active');

// Tutup menu saat link navigasi diklik
document.querySelectorAll('nav ul li a').forEach(link => {
    link.onclick = () => navMenu.classList.remove('active');
});

// --- FUNGSI ANIMASI TERBANG ---
function animasiTerbang(event) {
    const btn = event.currentTarget;
    const flyer = document.createElement('div');
    flyer.className = 'fly-item';
    const rect = btn.getBoundingClientRect();
    
    flyer.style.left = rect.left + 'px';
    flyer.style.top = rect.top + 'px';
    document.body.appendChild(flyer);
    
    setTimeout(() => {
        flyer.style.left = '50%';
        flyer.style.top = (window.innerHeight - 50) + 'px';
        flyer.style.opacity = '0';
        flyer.style.transform = 'scale(0.5)';
    }, 10);
    
    setTimeout(() => { flyer.remove(); }, 600);
}

// --- MANAJEMEN KERANJANG ---
function tambahKeKeranjang(nama, harga, idInputCatatan, event) {
    const inputCatatan = document.getElementById(idInputCatatan);
    const catatan = inputCatatan ? inputCatatan.value.trim() : "";
    
    const itemAda = keranjang.find(item => item.nama === nama && item.catatan === catatan);
    
    if (itemAda) { 
        itemAda.jumlah += 1; 
    } else { 
        keranjang.push({ nama: nama, harga: harga, jumlah: 1, catatan: catatan }); 
    }
    
    if(inputCatatan) inputCatatan.value = "";
    if(event) animasiTerbang(event);
    perbaruiTampilan();
}

function tambahVarianKeKeranjang(namaJenis, idSelect, harga, idInputCatatan, event) {
    const selectElement = document.getElementById(idSelect);
    const varianDipilih = selectElement.value;
    const namaLengkap = namaJenis + " " + varianDipilih;
    tambahKeKeranjang(namaLengkap, harga, idInputCatatan, event);
}

function updateCatatan(index, value) { 
    keranjang[index].catatan = value; 
}

function ubahJumlah(index, delta) {
    keranjang[index].jumlah += delta;
    if (keranjang[index].jumlah <= 0) { 
        keranjang.splice(index, 1); 
    }
    perbaruiTampilan();
    updateModal();
}

function kosongkanKeranjang() {
    if (confirm("Hapus semua pesanan?")) {
        keranjang = []; 
        perbaruiTampilan(); 
        tutupModal();
    }
}

function perbaruiTampilan() {
    const panel = document.getElementById('cartPanel');
    const countEl = document.getElementById('cartCount');
    const summaryEl = document.getElementById('cartSummary');
    
    if (keranjang.length > 0) {
        panel.style.display = 'flex';
        let totalItem = 0, totalHarga = 0;
        keranjang.forEach(item => { 
            totalItem += item.jumlah; 
            totalHarga += (item.harga * item.jumlah); 
        });
        countEl.innerText = totalItem + " Item Terpilih";
        summaryEl.innerText = "Total: Rp " + totalHarga.toLocaleString('id-ID');
    } else { 
        panel.style.display = 'none'; 
    }
}

// --- LOGIKA MODAL ---
function bukaModal() { 
    document.getElementById('cartModal').style.display = 'block'; 
    updateModal(); 
}

function tutupModal() { 
    document.getElementById('cartModal').style.display = 'none'; 
}

function updateModal() {
    const modalList = document.getElementById('modalList');
    const modalTotal = document.getElementById('modalTotal');
    modalList.innerHTML = '';
    let total = 0;
    
    if (keranjang.length === 0) { 
        modalList.innerHTML = '<p style="text-align:center; color:#999;">Keranjang kosong.</p>'; 
    }
    
    keranjang.forEach((item, index) => {
        total += (item.harga * item.jumlah);
        modalList.innerHTML += `
            <div class="cart-item-row">
                <div style="flex:1; padding-right: 10px;">
                    <strong>${item.nama}</strong><br>
                    <input type="text" class="note-input" style="width: 100%; margin-top: 5px; font-size: 0.8rem; border: 1px dashed #e67e22;" 
                           value="${item.catatan}" oninput="updateCatatan(${index}, this.value)" placeholder="Edit catatan...">
                    <br><small>Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</small>
                </div>
                <div style="display:flex; align-items:center;">
                    <button class="qty-btn" onclick="ubahJumlah(${index}, -1)">-</button>
                    <span style="margin: 0 10px;">${item.jumlah}</span>
                    <button class="qty-btn" onclick="ubahJumlah(${index}, 1)">+</button>
                </div>
            </div>`;
    });
    modalTotal.innerText = "Total: Rp " + total.toLocaleString('id-ID');
}

// --- INTEGRASI WHATSAPP ---
function kirimWhatsApp() {
    const nomorWA = "6287849780486";
    let pesan = "Halo Rumah Makan Bu Mur 👋🏻,\nSaya ingin memesan menu berikut:\n\n";
    let totalAkhir = 0;
    
    keranjang.forEach((item) => {
        const subTotal = item.harga * item.jumlah;
        pesan += `📌 *${item.nama}* (${item.jumlah}x)\n`;
        if (item.catatan) pesan += `   _Catatan: ${item.catatan}_\n`;
        pesan += `   Harga: Rp ${subTotal.toLocaleString('id-ID')}\n\n`;
        totalAkhir += subTotal;
    });
    
    pesan += `*Total Keseluruhan: Rp ${totalAkhir.toLocaleString('id-ID')}* 💰\n\n`;
    pesan += "Mohon segera diproses ya, terima kasih banyak! 🙏✨\n\n";
    pesan += "_*Pembayaran dilakukan di warung ya_\n\n";
    
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// Menutup modal jika klik di area luar modal
window.onclick = (e) => { 
    if (e.target == document.getElementById('cartModal')) tutupModal(); 
}