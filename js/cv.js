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
    const activeView = document.getElementById(activeTab === 'web' ? 'view-web' : 'view-ats');
    const cvPage = activeView.querySelector('.cv-page');
    const printArea = document.getElementById('print-area');

    printArea.innerHTML = '';
    printArea.appendChild(cvPage.cloneNode(true));

    window.addEventListener('afterprint', () => { printArea.innerHTML = ''; }, { once: true });
    window.print();
}