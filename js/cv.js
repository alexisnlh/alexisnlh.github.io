/* TAB SWITCHER */
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', (i === 0 && tab === 'web') || (i === 1 && tab === 'ats'));
    });
    document.getElementById('view-web').classList.toggle('active', tab === 'web');
    document.getElementById('view-ats').classList.toggle('active', tab === 'ats');
    localStorage.setItem('cv-tab', tab);
}

/* RESTORE LAST TAB */
const savedTab = localStorage.getItem('cv-tab');
if (savedTab) switchTab(savedTab);

function printCV() {
    const activeTab = localStorage.getItem('cv-tab') || 'web';
    const webView = document.getElementById('view-web');
    const atsView = document.getElementById('view-ats');
    const topbar = document.querySelector('.topbar');
    const cvPage = document.querySelector('.cv-page');
    const cvInner = cvPage ? cvPage.firstElementChild : null;

    /* Guardar estado original */
    const origWeb = webView.style.display;
    const origAts = atsView.style.display;
    const origTopbar = topbar ? topbar.style.display : '';
    const origOverflow = cvPage ? cvPage.style.overflow : '';
    const origMaxH = cvPage ? cvPage.style.maxHeight : '';
    const origH = cvInner ? cvInner.style.height : '';

    /* Preparar para imprimir */
    if (topbar) topbar.style.display = 'none';
    webView.style.display = activeTab === 'web' ? 'block' : 'none';
    atsView.style.display = activeTab === 'ats' ? 'block' : 'none';
    if (cvPage) {
        cvPage.style.overflow = 'visible';
        cvPage.style.maxHeight = 'none';
    }
    if (cvInner) {
        cvInner.style.height = 'auto';
    }

    window.print();

    /* Restaurar estado tras imprimir */
    const restore = () => {
        if (topbar) topbar.style.display = origTopbar;
        webView.style.display = origWeb;
        atsView.style.display = origAts;
        if (cvPage) {
            cvPage.style.overflow = origOverflow;
            cvPage.style.maxHeight = origMaxH;
        }
        if (cvInner) {
            cvInner.style.height = origH;
        }
        switchTab(activeTab);
    };

    if ('onafterprint' in window) {
        window.onafterprint = restore;
    } else {
        /* Fallback para navegadores sin onafterprint */
        setTimeout(restore, 1000);
    }
}