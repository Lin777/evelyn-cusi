let currentLang = 'en';
let currentIndex = 0;
const track = document.getElementById('impactTrack');
const cards = Array.from(track.children);

// Clone cards for infinite effect
function setupCarousel() {
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

    // Clear existing clones if any
    while (track.querySelectorAll('.clone').length > 0) {
        track.querySelector('.clone').remove();
    }

    // Clone start cards and end cards
    for (let i = 0; i < visibleCards; i++) {
        const startClone = cards[i].cloneNode(true);
        startClone.classList.add('clone');
        track.appendChild(startClone);

        const endClone = cards[cards.length - 1 - i].cloneNode(true);
        endClone.classList.add('clone');
        track.insertBefore(endClone, track.firstChild);
    }

    currentIndex = visibleCards;
    updateCarousel(false);
}

function moveCarousel(dir) {
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    currentIndex += dir;
    updateCarousel(true);

    // Cyclic jump logic
    track.addEventListener('transitionend', () => {
        if (currentIndex >= cards.length + visibleCards) {
            currentIndex = visibleCards;
            updateCarousel(false);
        }
        if (currentIndex < visibleCards) {
            currentIndex = cards.length + visibleCards - 1;
            updateCarousel(false);
        }
    }, { once: true });
}

function updateCarousel(animate) {
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const gap = 32; // 2rem
    const containerWidth = track.parentElement.offsetWidth;
    const cardWidth = (containerWidth - (visibleCards - 1) * gap) / visibleCards;

    track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
}

// const experiences = {
//     'exp-datec': {
//         title: "Lead AI Engineer & Data Scientist @ Datec",
//         bodyEn: "• Led production AI systems delivery.<br>• Automated 90% manual processing via GCP/YOLOX/OCR/LLMs.<br>• Forecasting for 500+ SKUs on Databricks.<br>• Enterprise RAG platforms.",
//         bodyEs: "• Liderazgo en IA en producción.<br>• Automatización del 90% mediante GCP/YOLOX/OCR/LLMs.<br>• Predicción para +500 SKUs en Databricks.<br>• Plataformas RAG corporativas."
//     },
//     'exp-p44': {
//         title: "Data Scientist @ Project44",
//         bodyEn: "• Improved ETA accuracy by 21%.<br>• Custom Snowflake Geospatial solutions.<br>• GPS anomaly detection pipelines.",
//         bodyEs: "• Mejora de precisión ETA en 21%.<br>• Soluciones geoespaciales en Snowflake.<br>• Pipelines de detección de anomalías GPS."
//     },
//     'exp-semantics': {
//         title: "Software Engineer @ Semantics S.R.L.",
//         bodyEn: "• Scalable backend systems and automation tools.<br>• Algorithmic solutions.<br>• Engineering practices: TDD, Scrum, clean code.<br>• Strong technical foundation for production ML/AI systems.",
//         bodyEs: "• Backend y herramientas de automatización escalables.<br>• Soluciones algorítmicas.<br>• Prácticas de ingeniería: TDD, Scrum, clean code.<br>• Sólida base técnica para sistemas de ML/IA en producción."
//     }
// };

const experiences = Object.fromEntries(
    (window.__EXPERIENCE_DATA__ || []).map(exp => [
        exp.id,
        {
            title: `${exp.role.en} @ ${exp.company}`,
            bodyEn: (exp.highlights?.en || []).map(item => `• ${item}`).join("<br>"),
            bodyEs: (exp.highlights?.es || []).map(item => `• ${item}`).join("<br>")
        }
    ])
);

function toggleLang() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    document.body.className = `lang-${currentLang}`;
    document.getElementById('lang-label').innerText = currentLang === 'en' ? 'ES' : 'EN';
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.getAttribute('data-lang') === currentLang ? 'inline' : 'none';
    });
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
}

function openModal(id) {
    const exp = experiences[id];
    const content = document.getElementById('modal-content');
    content.innerHTML = `<h3 class="text-4xl font-bold mb-8 text-[var(--accent)]">${exp.title}</h3>
                                <div class="opacity-80 leading-relaxed text-lg font-light">${currentLang === 'en' ? exp.bodyEn : exp.bodyEs}</div>`;
    document.getElementById('modal-container').classList.remove('hidden');
    document.getElementById('modal-container').classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('modal-container');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

window.onscroll = () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('bg-[var(--bg-primary)]', 'bg-opacity-80', 'backdrop-blur-md', 'border-white/5');
    else nav.classList.remove('bg-[var(--bg-primary)]', 'bg-opacity-80', 'backdrop-blur-md', 'border-white/5');

    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
    });
};

window.addEventListener('resize', () => {
    setupCarousel();
});

window.onload = () => {
    setupCarousel();
    toggleLang();
    window.onscroll();
};