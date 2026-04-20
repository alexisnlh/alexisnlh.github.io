/* THEME */
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('anlh-theme') || 'dark';

function applyTheme(t) {
    html.dataset.theme = t;
    toggleBtn.textContent = t === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('anlh-theme', t);
    currentTheme = t;
}
applyTheme(currentTheme);

toggleBtn.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));

/* TYPED EFFECT */
const roles = ['Backend Engineer', 'Data Engineer', 'Python Developer', 'ETL Architect'];
let ri = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');

function type() {
    const cur = roles[ri];
    if (!del) {
        typedEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
    } else {
        typedEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 50 : 90);
}
type();

/* SCROLL PROGRESS */
window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
});

/* NAV ACTIVE */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollY = window.scrollY + 80;
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10;
    let current = '';
    sections.forEach(s => {
        if (scrollY >= s.offsetTop) current = s.id;
    });
    // If at the very bottom, force contact active
    if (atBottom) current = 'contact';
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Highlight immediately on click, then let scroll take over
navLinks.forEach(a => {
    a.addEventListener('click', () => {
        navLinks.forEach(b => b.classList.remove('active'));
        a.classList.add('active');
    });
});

/* REVEAL ON SCROLL */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* COUNTERS */
function animateCounter(el) {
    const target = +el.dataset.target;
    const suffix = target === 97 ? '%' : '+';
    let start = null;
    function upd(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1500, 1);
        el.textContent = Math.round(p * p * target) + suffix;
        if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
}
const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            cntObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

/* PROJECT FILTER */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
        });
    });
});

/* ── MODAL DATA ── */
const projects = [
    {
        cat: 'Backend API',
        title: 'API REST — Gestión de Incidencias',
        context: 'Las aplicaciones internas necesitaban comunicarse con el sistema externo Oceane para gestionar incidencias, pero no existía una capa de abstracción que manejara autenticación, validaciones y logging.',
        metrics: [
            { v: '+10K', l: 'Peticiones por hora' },
            { v: '+170', l: 'Usuarios activos' },
            { v: '80%', l: 'Reducción tiempo' },
            { v: '<20/h', l: 'Consultas manuales' }
        ],
        bullets: [
            'Reducción drástica de consultas manuales a la plataforma Oceane/Marine',
            'Reducción del 80% en tiempo de desarrollo de nuevas integraciones',
            'Sistema de alertas automáticas por email ante errores críticos',
            'Logging completo de todas las operaciones para auditoría'
        ],
        stack: ['Python', 'Django', 'Django REST Framework', 'MySQL', 'OAuth']
    },
    {
        cat: 'Data Engineering',
        title: 'Sistema ETL — Gestión de Inventario',
        context: 'El equipo dedicaba más de 6 horas diarias a procesar manualmente archivos de proveedores (Excel, CSV) para actualizar el inventario. Cada proveedor tenía formatos diferentes.',
        metrics: [
            { v: '6h→10m', l: 'Tiempo proceso' },
            { v: '+5', l: 'Proveedores integrados' },
            { v: 'Miles', l: 'Equipos/día' },
            { v: '97%', l: 'Reducción errores' }
        ],
        bullets: [
            'Automatización completa de 6 horas manuales a 10 minutos',
            'Eliminación del procesamiento manual de ficheros SFTP y email',
            'Generación automática de reportes KPI con cálculo de riesgo de stock',
            'Sincronización en tiempo real de entradas/salidas de equipos'
        ],
        stack: ['Python', 'Pandas', 'SQLAlchemy', 'Elasticsearch', 'Cron']
    },
    {
        cat: 'Data Science · TFM Máster',
        title: 'DSMarket — Sales Forecasting & Supply Optimization',
        context: 'Trabajo Final de Máster en Data Science & AI. Solución end-to-end para cadena de supermercados con presencia en Nueva York, Boston y Filadelfia.',
        metrics: [
            { v: '57.4M', l: 'Registros analizados' },
            { v: '13.1%', l: 'Mejor RMSE' },
            { v: '5', l: 'Modelos comparados' },
            { v: '63%', l: 'Más rápido que LightGBM' }
        ],
        bullets: [
            'EDA con patrones de ventas por ciudad, temporalidad y eventos especiales',
            'Clustering de productos (k=5) y tiendas (k=3) con Elbow Method',
            'Forecasting a 28 días con Ridge, Random Forest, XGBoost, LightGBM y CatBoost',
            'Optimización de hiperparámetros con Optuna — XGBoost ganador: RMSE 1.8994',
            'Sistema de reposición de stock con stock de seguridad y punto de reorden'
        ],
        stack: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'Optuna', 'K-means', 'Power BI']
    },
    {
        cat: 'Data Science',
        title: 'Malware Detection — Supervised ML',
        context: 'Proyecto del Máster enfocado en la detección preventiva de malware en Windows mediante ML supervisado, con ~500K registros y 83 features de telemetría de Windows Defender.',
        metrics: [
            { v: '500K', l: 'Registros analizados' },
            { v: '71%', l: 'ROC-AUC Score' },
            { v: '65%', l: 'Accuracy' },
            { v: '4', l: 'Modelos comparados' }
        ],
        bullets: [
            'Limpieza y normalización de datos con tratamiento de duplicados',
            'EDA completo con visualizaciones de variables vs. target',
            'Feature engineering: Frequency Encoding, One-Hot, selección por varianza',
            'Entrenamiento de 4 modelos: Decision Tree, Random Forest, XGBoost, LightGBM',
            'Modelo seleccionado: LightGBM (mejor balance rendimiento/overfitting)'
        ],
        stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'XGBoost', 'LightGBM']
    }
];

/* MODAL LOGIC */
const overlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal(idx) {
    const p = projects[idx];
    document.getElementById('modalCat').textContent = p.cat;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-section"><h3>Contexto</h3><p>${p.context}</p></div>
        <div class="modal-section"><h3>Resultados</h3><div class="modal-metrics">${p.metrics.map(m => `<div class="modal-metric"><strong>${m.v}</strong><span>${m.l}</span></div>`).join('')}</div></div>
        <div class="modal-section"><h3>Impacto</h3><ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Stack</h3><div class="skill-tags">${p.stack.map(t => `<span class="tag accent">${t}</span>`).join('')}</div></div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset modal scroll to top on every open
    overlay.querySelector('.modal').scrollTop = 0;
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.project));
});

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
