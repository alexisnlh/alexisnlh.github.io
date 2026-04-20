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
    document.body.classList.add(`printing-${activeTab}`);

    const restore = () => document.body.classList.remove('printing-web', 'printing-ats');
    window.addEventListener('afterprint', restore, { once: true });

    window.print();
}