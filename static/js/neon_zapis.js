(function () {
    const neon = getComputedStyle(document.documentElement).getPropertyValue('--neon') || '#ff5e00';


    function showToast(message) {
// remove previous toast if exists
        const old = document.querySelector('.z-toast');
        if (old) old.remove();
        const t = document.createElement('div');
        t.className = 'z-toast';
        t.textContent = message;
        document.body.appendChild(t);
// force reflow then show
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 300);
        }, 1800);
    }


    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Скопировано: ' + text);
        } catch (e) {
// fallback: select hidden textarea (для старых браузеров)
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast('Скопировано: ' + text);
            } finally {
                ta.remove();
            }
        }
    }


// Event delegation for copy buttons and clickable text
    document.addEventListener('click', (e) => {
        const copyEl = e.target.closest('[data-copy]');
        if (copyEl) {
            copyToClipboard(copyEl.getAttribute('data-copy'));
            return;
        }


        const btn = e.target.closest('.zapis-copy');
        if (btn) {
            const row = btn.closest('.zapis-row');
            const targetSel = btn.getAttribute('data-copy-target');
            const t = row && row.querySelector(targetSel);
            if (t) copyToClipboard(t.getAttribute('data-copy') || t.textContent.trim());
        }
    });


// Reveal on scroll using IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    const onIntersect = (entries, obs) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                ent.target.classList.add('is-visible');
                obs.unobserve(ent.target); // показываем один раз
            }
        });
    };


    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(onIntersect, {root: null, rootMargin: '0px 0px -10% 0px', threshold: .1});
        revealEls.forEach(el => io.observe(el));
    } else {
// старые браузеры: показываем сразу
        revealEls.forEach(el => el.classList.add('is-visible'));
    }
})();