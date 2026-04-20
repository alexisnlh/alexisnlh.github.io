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
    const activeView  = document.getElementById(activeTab === 'web' ? 'view-web' : 'view-ats');
    const inactiveView = document.getElementById(activeTab === 'web' ? 'view-ats' : 'view-web');
    const topbar  = document.querySelector('.topbar');
    const cvPage  = activeView.querySelector('.cv-page');
    const cvInner = cvPage.firstElementChild;

    activeView.style.setProperty('display', 'block', 'important');
    inactiveView.style.setProperty('display', 'none', 'important');
    if (topbar) topbar.style.setProperty('display', 'none', 'important');
    cvPage.style.setProperty('overflow', 'visible', 'important');
    cvPage.style.setProperty('height', 'auto', 'important');
    if (cvInner) cvInner.style.setProperty('overflow', 'visible', 'important');

    const restore = () => {
        activeView.style.removeProperty('display');
        inactiveView.style.removeProperty('display');
        if (topbar) topbar.style.removeProperty('display');
        cvPage.style.removeProperty('overflow');
        cvPage.style.removeProperty('height');
        if (cvInner) cvInner.style.removeProperty('overflow');
    };

    window.addEventListener('afterprint', restore, { once: true });
    window.print();
}