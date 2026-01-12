const brandConfig = {
    brandName: "TwinpathNet",
    portalUrl: "http://welcome.dyzulk.com/login",
    allowedDomains: [
        "welcome.dyzulk.com"
    ],
    creditName: "dyzulk.com",
    creditUrl: "https://dyzulk.com",
    mikhmonUrl: "https://mikhmon.dyzulk.com",
    mikhmonSession: "Twinpath-Net",
    assets: {
        logo: "img/logo-twinpath.svg",
        icon_ticket: "svg/ticket.svg",
        icon_user: "svg/user.svg",
        icon_lock: "svg/lock.svg",
        icon_scan: "svg/scan-line.svg",
        icon_image: "svg/image.svg",
        icon_external: "svg/external-link.svg",
        icon_copy: "svg/copy.svg",
        icon_logout: "svg/log-out.svg",
        icon_success: "svg/check-circle.svg",
        icon_error: "svg/alert-circle.svg",
        icon_clock: "svg/clock.svg",
        icon_upload: "svg/upload-cloud.svg",
        icon_download: "svg/download-cloud.svg",
        icon_wifi: "svg/wifi.svg",
        icon_search: "svg/search.svg"
    }
};

function applyBranding() {
    // Update Document Title
    const currentTitle = document.title;
    if (currentTitle.includes('TwinpathNet')) {
        document.title = currentTitle.replace('TwinpathNet', brandConfig.brandName);
    } else if (!currentTitle.includes(brandConfig.brandName)) {
        document.title = `${brandConfig.brandName} > ${currentTitle}`;
    }

    // Update Elements with data-brand-name
    document.querySelectorAll('[data-brand-name]').forEach(el => {
        el.innerText = brandConfig.brandName;
        if (el.tagName === 'IMG') el.alt = brandConfig.brandName;
    });

    // Update Elements with data-brand-credit
    document.querySelectorAll('[data-brand-credit]').forEach(el => {
        el.innerText = brandConfig.creditName;
    });

    // Update Links with data-brand-link
    document.querySelectorAll('[data-brand-link="credit"]').forEach(el => {
        el.href = brandConfig.creditUrl;
    });

    // Update Assets (Images/Icons)
    document.querySelectorAll('[data-asset]').forEach(el => {
        const assetKey = el.getAttribute('data-asset');
        if (brandConfig.assets[assetKey]) {
            el.src = brandConfig.assets[assetKey];
        }
    });
}

// Apply branding as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
} else {
    applyBranding();
}
