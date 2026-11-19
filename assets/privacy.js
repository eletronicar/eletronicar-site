/* Preferências locais. Etiqueta Google carregada somente após autorização. */
(() => {
  'use strict';
  const KEY = 'eletronicar_privacy_v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const TAG = 'AW-18581527528';
  let preference = null;
  let loaded = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const denied = { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.gtag('consent', 'default', denied);
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (value && value.version === 1 && typeof value.measurement === 'boolean' &&
        typeof value.time === 'number' && value.time <= Date.now() && Date.now() - value.time < MAX_AGE) preference = value;
    else localStorage.removeItem(KEY);
  } catch (_) { /* Sem armazenamento, a escolha vale apenas nesta página. */ }

  function enableMeasurement() {
    window.gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'denied', ad_user_data: 'granted', ad_personalization: 'denied' });
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('set', 'allow_ad_personalization_signals', false);
    window.gtag('config', TAG, { allow_ad_personalization_signals: false });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG;
    document.head.appendChild(tag);
  }
  function clearMeasurementCookies() {
    const domains = ['', location.hostname, '.' + location.hostname];
    document.cookie.split(';').forEach(item => {
      const name = item.trim().split('=')[0];
      if (!/^_gcl_|^_gac_/.test(name)) return;
      domains.forEach(domain => {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure' + (domain ? '; Domain=' + domain : '');
      });
    });
  }
  const panel = document.getElementById('privacy-panel');
  const status = document.getElementById('privacy-status');
  function refreshStatus() {
    if (status) status.textContent = preference && preference.measurement ? 'Medição autorizada. Personalização de anúncios desativada.' : 'Medição opcional desativada.';
  }
  function choose(measurement) {
    const wasLoaded = loaded;
    preference = { version: 1, measurement, time: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(preference)); } catch (_) { /* Continua sem persistência. */ }
    if (measurement) enableMeasurement();
    else { window.gtag('consent', 'update', denied); clearMeasurementCookies(); }
    panel.hidden = true;
    refreshStatus();
    const opener = document.querySelector('[data-privacy-open]');
    if (opener) opener.focus({ preventScroll: true });
    // Recarregar remove da página a biblioteca já carregada após revogação.
    if (!measurement && wasLoaded) location.reload();
  }
  document.querySelectorAll('[data-privacy-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.privacyChoice === 'accept')));
  document.querySelectorAll('[data-privacy-open]').forEach(button => button.addEventListener('click', () => {
    panel.hidden = false;
    panel.querySelector('button').focus({ preventScroll: true });
  }));
  if (preference && preference.measurement) enableMeasurement();
  if (preference && !preference.measurement) clearMeasurementCookies();
  panel.hidden = Boolean(preference);
  refreshStatus();

  document.querySelectorAll('.wa-link').forEach(link => link.addEventListener('click', () => {
    if (!preference || !preference.measurement) return;
    window.gtag('event', 'clique_whatsapp');
    window.gtag('event', 'conversion', { send_to: TAG + '/gz1ICJq4tLodEOi3rpxF', value: 1.0, currency: 'BRL', transport_type: 'beacon' });
  }));
  document.querySelectorAll('[data-load-map]').forEach(button => button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.className = 'map';
    frame.title = 'Mapa da Eletronicar';
    frame.referrerPolicy = 'no-referrer';
    frame.src = 'https://www.google.com/maps?q=Rua+Jo%C3%A3o+Pessoa,+557,+S%C3%A3o+Jo%C3%A3o+da+Boa+Vista+-+SP,+13870-676&output=embed';
    button.closest('.map-placeholder').replaceWith(frame);
  }));
})();
