function setMode(mode) {
    const voucherMode = document.getElementById('voucher-mode');
    const memberMode = document.getElementById('member-mode');
    const voucherTab = document.querySelector('.tab-btn:nth-child(1)');
    const memberTab = document.querySelector('.tab-btn:nth-child(2)');
    const form = document.login;

    if (mode === 'voucher') {
        voucherMode.classList.remove('hidden');
        memberMode.classList.add('hidden');
        voucherTab.classList.add('active');
        memberTab.classList.remove('active');
        
        // Sync to form immediately
        if (form) {
            const code = document.getElementById('voucher-input').value;
            form.username.value = code;
            form.password.value = document.getElementById('voucher-pass').value || code;
        }
    } else {
        voucherMode.classList.add('hidden');
        memberMode.classList.remove('hidden');
        voucherTab.classList.remove('active');
        memberTab.classList.add('active');
        
        // Sync to form immediately
        if (form) {
            form.username.value = document.getElementById('member-user').value;
            form.password.value = document.getElementById('member-pass').value;
        }
    }

    // Update login button text based on mode
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        const lang = localStorage.getItem('twinpath_lang') || 'en';
        const key = mode === 'voucher' ? 'login_voucher' : 'login_member';
        loginBtn.setAttribute('data-i18n', key);
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            loginBtn.innerText = translations[lang][key];
        }
    }
}

function doLogin() {
    const form = document.login;
    const mode = document.querySelector('.tab-btn.active').innerText.toLowerCase();

    // Sync inputs based on mode
    if (mode === 'voucher') {
        const code = document.getElementById('voucher-input').value;
        form.username.value = code;
        form.password.value = code; // Voucher usually uses same code for user/pass or just user with empty pass (depends on config)
        // Note: Check your hotspot config. Often Vouchers are "Username = Password"
    } else {
        form.username.value = document.getElementById('member-user').value;
        form.password.value = document.getElementById('member-pass').value;
    }

    // Handle CHAP security if available
    // Note: This relies on variables injected by TwinpathNet (Mikrotik) into the HTML/JS context
    // We assume 'hexMD5' is available from md5.js
    /* 
       TwinpathNet usually puts this logic in the <script> block directly in login.html 
       to access $(chap-id) and $(chap-challenge).
       Since we extracted this to an external file, we need to ensure those vars are accessible.
       However, usually $(variables) are NOT replaced in .js files by TwinpathNet.
       They are ONLY replaced in .html files.
       
       So, strict MD5 hashing MUST be done inside login.html <script> block, OR
       we submit plain text and let RouterOS handle PAP (if enabled).
       
       For this "Cool" template, we will assume PAP is enabled for simplicity, 
       OR we can trust the form to submit properly.
    */
    
    return true;
}

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("URL Berhasil Disalin! Silakan buka Chrome dan tempel (paste) di sana.");
}

function openInExternalBrowser() {
    const url = brandConfig.portalUrl;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        // Android Intent for Chrome
        const domain = new URL(brandConfig.portalUrl).hostname;
        window.location.href = `intent://${domain}#Intent;scheme=http;package=com.android.chrome;end`;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // iOS: No magic intent from CNA usually works, so we guide them to use the copy button
        alert("Untuk pengguna iPhone/iPad: Silakan klik tombol 'Salin Link Portal' lalu buka Safari dan tempel alamatnya.");
    } else {
        // Other devices
        window.open(url, '_blank');
    }
}

function formatMikrotikTime(timeStr) {
    if (!timeStr || timeStr === 'unlimited' || timeStr.includes('$(')) return timeStr;

    const regex = /(\d+)([wdhms])/g;
    let parts = [];
    let match;
    
    const unitMap = {
        'w': { 'en': 'w', 'id': ' Minggu' },
        'd': { 'en': 'd', 'id': ' Hari' },
        'h': { 'en': 'h', 'id': ' Jam' },
        'm': { 'en': 'm', 'id': ' Menit' },
        's': { 'en': 's', 'id': ' Detik' }
    };

    const lang = localStorage.getItem('twinpath_lang') || 'en';

    while ((match = regex.exec(timeStr)) !== null) {
        const val = match[1];
        const unit = match[2];
        parts.push(val + (unitMap[unit][lang] || unit));
    }

    if (parts.length === 0) return timeStr;
    return parts.slice(0, 3).join(' ');
}

function parseMikrotikTimeToSeconds(timeStr) {
    if (!timeStr || timeStr.includes('$(')) return 0;
    const regex = /(\d+)([wdhms])/g;
    let totalSeconds = 0;
    let match;
    const multipliers = { 'w': 604800, 'd': 86400, 'h': 3600, 'm': 60, 's': 1 };
    
    while ((match = regex.exec(timeStr)) !== null) {
        totalSeconds += parseInt(match[1]) * (multipliers[match[2]] || 0);
    }
    return totalSeconds;
}

function updateProgressBars() {
    const data = document.getElementById('dashboard-data');
    if (!data) return;

    const limitUptime = parseMikrotikTimeToSeconds(data.getAttribute('data-limit-uptime'));
    const uptime = parseMikrotikTimeToSeconds(data.getAttribute('data-uptime'));
    const limitBytes = parseInt(data.getAttribute('data-limit-bytes')) || 0;
    const bytesOut = parseInt(data.getAttribute('data-bytes-out')) || 0;

    // Time Progress: (Total - Used) / Total -> Remaining %
    if (limitUptime > 0) {
        const remainingTime = Math.max(0, limitUptime - uptime);
        const timePercent = (remainingTime / limitUptime) * 100;
        const timeBar = document.querySelector('.progress-time');
        if (timeBar) timeBar.style.width = timePercent + '%';
    } else {
        const timeBar = document.querySelector('.progress-time');
        if (timeBar) timeBar.style.width = '100%'; // Unlimited
    }

    // Quota Progress: (Total - Used) / Total -> Remaining %
    if (limitBytes > 0) {
        const remainingBytes = Math.max(0, limitBytes - bytesOut);
        const quotaPercent = (remainingBytes / limitBytes) * 100;
        const quotaBar = document.querySelector('.progress-quota');
        if (quotaBar) quotaBar.style.width = quotaPercent + '%';
    } else {
        const quotaBar = document.querySelector('.progress-quota');
        if (quotaBar) quotaBar.style.width = '100%'; // Unlimited
    }
}

function initDashboard() {
    // 1. Set Greetings
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
        const hour = new Date().getHours();
        const lang = localStorage.getItem('twinpath_lang') || 'en';
        let greeting = "";
        
        if (lang === 'id') {
            if (hour < 11) greeting = "Selamat Pagi";
            else if (hour < 15) greeting = "Selamat Siang";
            else if (hour < 19) greeting = "Selamat Sore";
            else greeting = "Selamat Malam";
        } else {
            if (hour < 12) greeting = "Good Morning";
            else if (hour < 17) greeting = "Good Afternoon";
            else greeting = "Good Evening";
        }
        greetingEl.innerText = greeting + "!";
    }

    // 2. Format Time Components
    document.querySelectorAll('[data-type="mikrotik-time"]').forEach(el => {
        let val = el.innerText.trim();
        // If empty or Mikrotik failed to replace (still contains $), it's Unlimited
        if (!val || val.includes('$(')) {
            const lang = localStorage.getItem('twinpath_lang') || 'en';
            el.innerText = (translations[lang] && translations[lang]['unlimited']) || 'Unlimited';
        } else {
            el.innerText = formatMikrotikTime(val);
        }
    });

    // 3. Dynamic Progress Bars
    updateProgressBars();
}

// Update DOMContentLoaded to include initDashboard
document.addEventListener('DOMContentLoaded', () => {
    // Determine page type
    const isLogin = !!document.getElementById('voucher-input');
    const isStatus = !!document.getElementById('greeting-text');

    if (isLogin) {
        setMode('voucher');
    }

    initDashboard();

    // Escape modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('qr-scanner-modal');
            if (modal && modal.style.display === 'flex') {
                if (typeof closeQR === 'function') {
                    closeQR();
                }
            }
        }
    });
});

function togglePassword(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = button.querySelector('img');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'svg/eye-off.svg';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'svg/eye.svg';
    }
}



