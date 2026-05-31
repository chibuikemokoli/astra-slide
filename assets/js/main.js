function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function getOrSetVisitorId() {
    const key = "astraslide_visitor";
    let id = getCookie(key);
    if (!id) {
        id = "vis_" + Math.random().toString(36).substr(2, 9);
        setCookie(key, id, 365);
    }
    return id;
}

function initFirstAndLastVisit() {
    const firstKey = "astraslide_first_visit";
    const lastKey = "astraslide_last_visit";
    const now = new Date().toISOString();

    if (!getCookie(firstKey)) {
        setCookie(firstKey, now, 365);
    }
    setCookie(lastKey, now, 365);
}

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
});

const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}, { passive: true });
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


document.body.classList.add('js-loaded');

const revealEls = document.querySelectorAll('.reveal');

function revealEl(el) { el.classList.add('visible'); }

function revealInViewport() {
    revealEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 80 && r.bottom > 0) revealEl(el);
    });
}
revealInViewport();

try {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { revealEl(e.target); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => { if (!el.classList.contains('visible')) io.observe(el); });
} catch (e) {
    revealEls.forEach(revealEl);
}

setTimeout(() => revealEls.forEach(revealEl), 800);

function initSlider(id) {
    const slider = document.getElementById(id);
    if (!slider) return;
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPos(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(2, Math.min(98, pct));
        before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
    slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('touchend', () => dragging = false);
}

initSlider('slider1');
initSlider('slider2');
initSlider('slider3');
initSlider('slider4');

const ICON_PLUS = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>';
const ICON_MINUS = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 7h10"/></svg>';

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.classList.contains('open');

        document.querySelectorAll('.faq-question').forEach(b => {
            b.classList.remove('open');
            b.setAttribute('aria-expanded', 'false');
            b.nextElementSibling.classList.remove('open');
            b.querySelector('.faq-icon').innerHTML = ICON_PLUS;
        });

        if (!isOpen) {
            btn.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            answer.classList.add('open');
            btn.querySelector('.faq-icon').innerHTML = ICON_MINUS;
        }
    });
});

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

(function () {
    const url = new URL(window.location.href);

    const remove = ["_gl", "_ga", "_gcl_au", "fbclid", "utm_source", "utm_medium"];

    let changed = false;

    remove.forEach(p => {
        if (url.searchParams.has(p)) {
            url.searchParams.delete(p);
            changed = true;
        }
    });

    if (changed) {
        window.history.replaceState({}, document.title, url.pathname);
    }
})();