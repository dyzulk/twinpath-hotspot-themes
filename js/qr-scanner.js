let html5QrCode;
let scannedUrl = "";

function safePause() {
    try {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.pause();
        }
    } catch (e) {
        console.warn("SafePause: Scanner already paused or not scanning", e);
    }
}

function safeResume() {
    try {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.resume();
        }
    } catch (e) {
        console.warn("SafeResume: Scanner not paused or not scanning", e);
    }
}

function handleDecodedText(decodedText) {
    console.log(`Scan result: ${decodedText}`);
    
    let username = "";
    let password = "";
    let isUnauthorized = false;
    let blockReason = ""; // Track why it was blocked
    scannedUrl = "";

    // Check if result is a URL
    try {
        if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
            const url = new URL(decodedText);
            const hostname = url.hostname;
            const currentHostname = window.location.hostname;
            
            // SECURITY CHECK 1: Domain Whitelist
            const isAllowed = (hostname === currentHostname) || (brandConfig.allowedDomains && brandConfig.allowedDomains.some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            ));

            if (isAllowed) {
                // SECURITY CHECK 2: MikroTik Standards (Must have at least username)
                const searchParams = url.search || (decodedText.includes('?') ? '?' + decodedText.split('?')[1] : '');
                const params = new URLSearchParams(searchParams);
                
                if (params.has('username')) {
                    scannedUrl = decodedText; // Approved for redirection
                    username = params.get('username');
                    if (params.has('password')) {
                        password = params.get('password');
                    }
                } else {
                    isUnauthorized = true;
                    blockReason = "Invalid Hotspot Login URL";
                }
            } else {
                // ILLEGAL DOMAIN: Strict blocking
                console.warn(`Blocked unauthorized domain: ${hostname}`);
                isUnauthorized = true;
                blockReason = `Unauthorized Domain: ${hostname}`;
            }
        } else {
            // NOT A URL: Block plain text / WiFi SSIDs per requirement
            isUnauthorized = true;
            blockReason = "Invalid Content (Only URL allowed)";
            console.warn("Blocked non-URL content:", decodedText);
        }
    } catch (e) {
        console.error("Error parsing QR URL:", e);
        isUnauthorized = true;
        blockReason = "QR Parse Error";
    }

    // Fill inputs (only if authorized)
    if (!isUnauthorized && username) {
        const voucherInput = document.getElementById('voucher-input');
        const passField = document.getElementById('voucher-pass');
        if (voucherInput) voucherInput.value = username;
        if (passField) passField.value = password || username;
    }

    // Show confirmation overlay
    const overlay = document.getElementById('qr-confirm-overlay');
    const confirmUser = document.getElementById('confirm-user');
    const connectBtn = document.querySelector('button[onclick="proceedSubmit()"]');
    
    if (overlay && confirmUser) {
        if (isUnauthorized) {
            confirmUser.innerHTML = `<span style="color: #ff4d4d;">Blocked: ${blockReason}</span>`;
            if (connectBtn) connectBtn.style.display = 'none';
        } else {
            confirmUser.innerText = username;
            if (connectBtn) connectBtn.style.display = 'block';
        }
        overlay.classList.remove('hidden');
    }

    // Pause camera scanning while confirming
    safePause();
}

function cancelConfirm() {
    const overlay = document.getElementById('qr-confirm-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    safeResume();
}

function proceedSubmit() {
    // If it's a URL, redirect directly
    if (scannedUrl) {
        console.log("Redirecting to scanned URL:", scannedUrl);
        window.location.href = scannedUrl;
        return;
    }

    // Switch to voucher mode for manual codes
    setMode('voucher');
    
    // Sync values to the actual form fields
    const voucherInput = document.getElementById('voucher-input');
    const voucherPass = document.getElementById('voucher-pass');
    const form = document.login;
    
    if (form && voucherInput) {
        form.username.value = voucherInput.value;
        form.password.value = voucherPass ? voucherPass.value : voucherInput.value;
    }

    // Close scanner
    closeQR();

    // Submit
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.click();
    }
}

function scanFromFile(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            console.log("No file selected.");
            return;
        }

        console.log("File selected:", file.name, file.type, file.size);
        
        // Ensure library is available
        if (typeof Html5Qrcode === 'undefined') {
            alert("QR Scanner library not loaded. Please wait or refresh.");
            return;
        }

        // Pause camera gracefully
        safePause();

        // Show a loading state
        const confirmUser = document.getElementById('confirm-user');
        if (confirmUser) confirmUser.innerText = "Scanning file...";
        
        // Hide overlay if it was open
        const overlay = document.getElementById('qr-confirm-overlay');
        if (overlay) overlay.classList.add('hidden');

        // Reuse instance if possible, or create temporary one for file
        const fileScanner = new Html5Qrcode("qr-file-reader");

        fileScanner.scanFile(file, true)
            .then(decodedText => {
                console.log("Success scanning file:", decodedText);
                handleDecodedText(decodedText);
                fileScanner.clear(); // Cleanup
            })
            .catch(err => {
                console.error(`Error scanning file: ${err}`);
                let msg = "No QR Code found.";
                if (typeof err === "string" && err.includes("not found")) {
                    msg = "QR Code not detected. Try a clearer or closer photo.";
                }
                alert(msg);
                
                if (confirmUser) confirmUser.innerText = "";
                
                // Resume camera
                if (html5QrCode && html5QrCode.isScanning) {
                    html5QrCode.resume();
                }
                fileScanner.clear(); // Cleanup
            });
            
        // Reset input so searching for the same file again triggers change
        event.target.value = "";

    } catch (e) {
        console.error("Fatal error in scanFromFile:", e);
        const errorMsg = e.message || JSON.stringify(e) || e;
        alert("An error occurred while opening the file: " + errorMsg);
        
        // Try to resume camera if it crashed here
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.resume();
        }
    }
}




function openQR() {
    const modal = document.getElementById('qr-scanner-modal');
    modal.style.display = 'flex';
    
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        handleDecodedText
    ).catch(err => {
        console.error("Scanner start error:", err);
    });
}

function closeQR() {
    const modal = document.getElementById('qr-scanner-modal');
    const overlay = document.getElementById('qr-confirm-overlay');
    
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.add('hidden');
    
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("Scanner stopped");
        }).catch((err) => {
            // Ignore error if already stopped
        });
    }
}


