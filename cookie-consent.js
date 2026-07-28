/* Lou Pa de l'Aze — bandeau de consentement cookies (Google Analytics).
   Google Analytics n'est chargé qu'après consentement explicite ("Accepter").
   Le choix est mémorisé dans localStorage et modifiable via [data-cookie-settings]. */
(function () {
  var GA_ID = 'G-TRGT2MFZTD';
  var STORAGE_KEY = 'lou_cookie_consent'; // 'granted' | 'denied'
  var banner = null;

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }
  function disableGA() {
    window['ga-disable-' + GA_ID] = true;
  }

  function loadGA() {
    if (window.__louGaLoaded) return;
    window.__louGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function hideBanner() {
    if (!banner) return;
    var el = banner;
    banner = null;
    el.style.transform = 'translateY(100%)';
    setTimeout(function () { el.remove(); }, 300);
  }

  function showBanner() {
    if (banner || !document.body) return;
    banner = document.createElement('div');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookies');
    banner.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#2F4B2E;color:#D8E0CF;padding:20px clamp(18px,4vw,40px);box-shadow:0 -10px 30px rgba(0,0,0,.25);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:18px 28px;font-family:\'Lato\',system-ui,sans-serif;transform:translateY(100%);transition:transform .35s ease;';
    banner.innerHTML =
      '<p style="max-width:640px;margin:0;font-size:14px;line-height:1.6;color:#D8E0CF;flex:1 1 320px;">' +
        'Ce site utilise des cookies de mesure d’audience (Google Analytics) pour comprendre sa fréquentation. Vous pouvez accepter ou refuser leur dépôt à tout moment. ' +
        '<a href="/politique-de-confidentialite" style="color:#E6C9A0;font-weight:700;">En savoir plus</a>.' +
      '</p>' +
      '<div style="display:flex;gap:12px;flex:none;">' +
        '<button type="button" data-cookie-refuse style="background:transparent;color:#D8E0CF;border:1px solid rgba(216,224,207,.4);padding:11px 20px;border-radius:2px;font-weight:700;font-size:13.5px;letter-spacing:.3px;cursor:pointer;font-family:inherit;">Refuser</button>' +
        '<button type="button" data-cookie-accept style="background:#C8714B;color:#F7F3EC;border:none;padding:11px 22px;border-radius:2px;font-weight:700;font-size:13.5px;letter-spacing:.3px;cursor:pointer;font-family:inherit;">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-accept]').addEventListener('click', function () {
      setConsent('granted');
      loadGA();
      hideBanner();
    });
    banner.querySelector('[data-cookie-refuse]').addEventListener('click', function () {
      setConsent('denied');
      disableGA();
      hideBanner();
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (banner) banner.style.transform = 'translateY(0)'; });
    });
    if (window.LouI18n) window.LouI18n.apply(window.LouI18n.getLang());
  }

  function bindSettingsLinks() {
    var els = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        if (el.__louBound) return;
        el.__louBound = true;
        el.addEventListener('click', function (e) {
          e.preventDefault();
          hideBanner();
          showBanner();
        });
      })(els[i]);
    }
  }

  function init() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', init); return; }
    bindSettingsLinks();
    var consent = getConsent();
    if (consent === 'granted') { loadGA(); return; }
    if (consent === 'denied') { disableGA(); return; }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
