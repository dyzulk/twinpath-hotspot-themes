const translations = {
    id: {
        lang_name: "Bahasa Indonesia",
        operational: "Beroperasi",
        online: "Terhubung",
        tab_voucher: "Voucher",
        tab_member: "Member",
        voucher_label: "Kode Voucher",
        voucher_placeholder: "Masukkan kode voucher...",
        user_label: "Nama Pengguna",
        pass_label: "Kata Sandi",
        login_voucher: "Gunakan Voucher",
        login_member: "Masuk Member",
        connect_btn: "Hubungkan",
        scan_btn: "Scan QR Code",
        trial_btn: "Coba Gratis",
        status_dashboard_msg: "Kelola sesi aktif dan pantau penggunaan anda.",
        connection_stats: "Statistik Koneksi",
        quota_left: "Sisa Kuota",
        unlimited: "Tanpa Batas",
        or_text: "Atau",
        scan_file_btn: "Scan dari Galeri",
        point_camera: "Arahkan kamera ke QR Code",
        confirm_title: "Konfirmasi Voucher",
        confirm_msg: "Apakah Anda ingin masuk dengan kode ini?",
        open_browser: "Buka di Browser",
        copy_url: "Salin Link Portal",
        manual_tip: "Kamera/Galeri diblokir sistem? Silakan buka di Chrome/Safari atau salin link portal di bawah.",
        hour: "JAM",
        hours: "JAM",
        day: "HARI",
        week: "MINGGU",
        pricing_title: "Paket Tersedia",
        session_info: "Informasi Sesi",
        ip_address: "Alamat IP",
        upload: "Unggah",
        download: "Unduh",
        time_left: "Sisa Waktu",
        logout_btn: "Keluar (Log Out)",
        logged_out: "Sudah Keluar",
        logged_out_msg: "Anda telah berhasil memutuskan koneksi dari jaringan.",
        login_again: "Masuk Kembali",
        failed_title: "Koneksi Gagal",
        try_again: "Coba Lagi",
        success_title: "Berhasil",
        success_msg: "Anda sekarang terhubung ke jaringan.",
        redirect_msg: "Mengalihkan...",
        redirect_tip: "Klik di sini jika tidak beralih otomatis",
        adv_title: "Iklan",
        adv_msg: "Jika tidak terjadi apa-apa, buka iklan secara manual.",
        adv_link: "iklan",
        adv_manually: "secara manual",
        powered_by: "Didukung oleh",
        qr_err_unauthorized: "Domain Tidak Sah",
        qr_err_invalid_url: "URL Login Hotspot Tidak Sah",
        qr_err_invalid_content: "Konten Tidak Sah (Hanya URL)",
        qr_err_parse: "Gagal Membaca QR"
    },
    en: {
        lang_name: "English",
        operational: "Operational",
        online: "Online",
        tab_voucher: "Voucher",
        tab_member: "Member",
        voucher_label: "Voucher Code",
        voucher_placeholder: "Enter code received...",
        user_label: "Username",
        pass_label: "Password",
        login_voucher: "Use Voucher",
        login_member: "Member Login",
        connect_btn: "Connect",
        scan_btn: "Scan QR Code",
        trial_btn: "Free Trial Access",
        status_dashboard_msg: "Manage your active session and monitor your usage.",
        connection_stats: "Connection Stats",
        quota_left: "Quota Remaining",
        unlimited: "Unlimited",
        or_text: "Or",
        scan_file_btn: "Scan from Gallery",
        point_camera: "Point camera at QR Code",
        confirm_title: "Confirm Voucher",
        confirm_msg: "Do you want to log in with this code?",
        open_browser: "Open in Browser",
        copy_url: "Copy Portal Link",
        manual_tip: "Camera/Gallery restricted? Please open in Chrome/Safari or copy the portal link below.",
        hour: "HOUR",
        hours: "HOURS",
        day: "DAY",
        week: "WEEK",
        pricing_title: "Available Packages",
        session_info: "Session Information",
        ip_address: "IP Address",
        upload: "Upload",
        download: "Download",
        time_left: "Time Remaining",
        logout_btn: "Log Out",
        logged_out: "Logged Out",
        logged_out_msg: "You have successfully disconnected from the network.",
        login_again: "Log In Again",
        failed_title: "Connection Failed",
        try_again: "Try Again",
        success_title: "Success",
        success_msg: "You are now connected to the network.",
        redirect_msg: "Redirecting...",
        redirect_tip: "Click here if not redirected automatically",
        adv_title: "Advertisement",
        adv_msg: "If nothing happens, open advertisement manually.",
        adv_link: "advertisement",
        adv_manually: "manually",
        powered_by: "Powered by",
        qr_err_unauthorized: "Unauthorized Domain",
        qr_err_invalid_url: "Invalid Hotspot Login URL",
        qr_err_invalid_content: "Invalid Content (Only URL allowed)",
        qr_err_parse: "QR Parse Error"
    }
};

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });
    localStorage.setItem('twinpath_lang', lang);
    document.documentElement.lang = lang;
    
    // Update active state in custom menu
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    
    // Update button text
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.innerText = lang.toUpperCase();

    // Refresh dynamic content if on dashboard
    if (typeof initDashboard === 'function') {
        initDashboard();
    }
}

function toggleLangMenu() {
    const menu = document.getElementById('lang-menu');
    if (menu) menu.classList.toggle('show');
}

// Close menu when clicking outside
window.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.lang-dropdown');
    const menu = document.getElementById('lang-menu');
    if (menu && dropdown && !dropdown.contains(e.target)) {
        menu.classList.remove('show');
    }
});

function initLanguage() {
    const savedLang = localStorage.getItem('twinpath_lang') || 'en';
    applyLanguage(savedLang);
}

function getTranslation(key) {
    const lang = localStorage.getItem('twinpath_lang') || 'en';
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
}

document.addEventListener('DOMContentLoaded', initLanguage);
