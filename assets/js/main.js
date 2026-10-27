/*!
 * Global Endtime Harvest — site script
 * No dependencies. Loaded with `defer` on every page.
 */
(function () {
  'use strict';

  /* =========================================================
     SITE SETTINGS — edit here
     ========================================================= */
  var SETTINGS = {
    // YouTube video ID of the Ilaro Jesus Crusade 2026 recap.
    // From https://www.youtube.com/watch?v=AbCdEfGhIjK  ->  'AbCdEfGhIjK'
    recapVideoId: '3LgG6f70f_g',   // https://www.youtube.com/shorts/3LgG6f70f_g
    whatsappNumber: '2349037444800',
    email: 'globalendtimeharvestmission@gmail.com'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- Mobile menu ---------- */
  var mnav = $('#mnav'), burger = $('#burger'), mclose = $('#mclose');
  function openMenu() {
    if (!mnav) return;
    mnav.classList.add('open'); mnav.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
    if (mclose) mclose.focus();
  }
  function closeMenu() {
    if (!mnav || !mnav.classList.contains('open')) return;
    mnav.classList.remove('open'); mnav.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    burger.focus();
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (mclose) mclose.addEventListener('click', closeMenu);
  if (mnav) $$('a', mnav).forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- Scroll reveal ---------- */
  // Progressive: content is visible by default; it is only hidden for animation once we know
  // the observer works. Anything already on screen is shown at once, and a safety timer reveals
  // everything if the observer never reports (old browsers, unusual webviews).
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var vh = window.innerHeight || document.documentElement.clientHeight, reported = false;
    reveals.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('in'); });
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      reported = true;
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
    setTimeout(function () { if (!reported) reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(v) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(v);
    return new Promise(function (resolve) {
      var ta = document.createElement('textarea');
      ta.value = v; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); resolve();
    });
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy'), orig = b.innerHTML;
      copyText(v).then(function () {
        b.classList.add('done'); b.textContent = 'Copied ✓'; toast('Copied: ' + v);
        setTimeout(function () { b.classList.remove('done'); b.innerHTML = orig; }, 2200);
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = $('#lb');
  if (lb) {
    var lbImg = $('img', lb), lbClose = $('#lbx'), lastFocus;
    $$('.gallery .photo img').forEach(function (img) {
      img.setAttribute('tabindex', '0');
      var open = function () {
        lastFocus = img; lbImg.src = img.getAttribute('data-full') || img.currentSrc || img.src; lbImg.alt = img.alt;
        lb.classList.add('open'); lbClose.focus();
      };
      img.addEventListener('click', open);
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    var closeLb = function () { lb.classList.remove('open'); lbImg.src = ''; if (lastFocus) lastFocus.focus(); };
    lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Partner: one-time / monthly selector ---------- */
  var gift = $('#gift');
  function setTab(name) {
    $$('.gtab').forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === name)); });
    $$('.gpanel').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-panel') === name); });
  }
  if (gift) {
    $$('.gtab').forEach(function (t) { t.addEventListener('click', function () { setTab(t.getAttribute('data-tab')); }); });
    // links like href="#monthly" data-tab="monthly" on this page
    $$('a[data-tab]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); setTab(a.getAttribute('data-tab'));
        gift.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', '#' + (a.getAttribute('data-tab') === 'once' ? 'one-time' : 'monthly'));
      });
    });
    // arriving from another page: partner.html#monthly / #one-time
    var h = location.hash;
    if (h === '#monthly' || h === '#one-time') {
      setTab(h === '#monthly' ? 'monthly' : 'once');
      var jump = function () { gift.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      if (document.readyState === 'complete') jump(); else window.addEventListener('load', jump);
    }
  }

  /* ---------- Partner hero slideshow ---------- */
  var slides = $$('#pslides div'), dots = $('#pdots');
  if (slides.length > 1 && dots) {
    var cur = 0, timer;
    var show = function (k) {
      slides[cur].classList.remove('on'); dots.children[cur].classList.remove('on');
      cur = k; slides[cur].classList.add('on'); dots.children[cur].classList.add('on');
    };
    var restart = function () { clearInterval(timer); timer = setInterval(function () { show((cur + 1) % slides.length); }, 5500); };
    slides.forEach(function (_, k) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show slide ' + (k + 1));
      b.addEventListener('click', function () { show(k); restart(); });
      dots.appendChild(b);
    });
    dots.children[0].classList.add('on');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) restart();
  }

  /* ---------- YouTube (loads only when clicked, privacy-enhanced domain) ---------- */
  $$('.video[data-yt]').forEach(function (v) {
    var id = v.getAttribute('data-yt') === 'recap' ? SETTINGS.recapVideoId : v.getAttribute('data-yt');
    if (!id) { v.classList.add('pending'); v.removeAttribute('role'); v.removeAttribute('tabindex'); return; }
    var play = function () {
      if (v.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = v.getAttribute('aria-label') || 'YouTube video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      v.innerHTML = ''; v.appendChild(f);
    };
    v.addEventListener('click', play);
    v.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
  });

  /* ---------- Forms: compose a WhatsApp message or an email ---------- */
  $$('form[data-compose]').forEach(function (form) {
    var kind = form.getAttribute('data-compose');
    var subject = kind === 'invite' ? 'Ministry Invitation Request' : 'Website Enquiry';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'email';
      var firstBad = null, lines = [];
      $$('input, select, textarea', form).forEach(function (f) {
        var fg = f.closest('.fg'), label = $('label[for="' + f.id + '"]', form);
        var name = label ? label.textContent.replace('*', '').trim() : f.name;
        var ok = f.checkValidity();
        if (fg) fg.classList.toggle('invalid', !ok);
        if (!ok && !firstBad) firstBad = f;
        if (f.value.trim()) lines.push(name + ': ' + f.value.trim());
      });
      if (firstBad) { firstBad.focus(); toast('Please complete the highlighted fields.'); return; }
      var body = lines.join('\n');
      if (via === 'whatsapp') {
        window.open('https://wa.me/' + SETTINGS.whatsappNumber + '?text=' + encodeURIComponent('*' + subject + '*\n\n' + body), '_blank', 'noopener');
      } else {
        location.href = 'mailto:' + SETTINGS.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      }
      toast(via === 'whatsapp' ? 'Opening WhatsApp…' : 'Opening your email app…');
    });
    $$('input, select, textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { var fg = f.closest('.fg'); if (fg && f.checkValidity()) fg.classList.remove('invalid'); });
    });
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
