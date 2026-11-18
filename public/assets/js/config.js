/*
 * Configuração do funil Inglês Sem Perrengue.
 * Preencha antes de rodar tráfego:
 *  - PIXEL_ID: ID do seu Pixel da Meta (ex.: '123456789012345'). Vazio = pixel desligado.
 *  - CHECKOUT_URL: link do checkout (Hotmart, Kiwify, etc.). Os parâmetros UTM da visita são repassados.
 *  - PRICE: preço exibido na página de oferta.
 */
window.ISP_CONFIG = {
  PIXEL_ID: '',
  CHECKOUT_URL: 'https://pay.cakto.com.br/9muy2hq_1338708',
  PRICE: 'R$ 19,90',
  PRICE_FROM: 'R$ 440'
};

(function () {
  var cfg = window.ISP_CONFIG;
  window.ispTrack = function (event, params, custom) {
    try {
      if (window.fbq) window.fbq(custom ? 'trackCustom' : 'track', event, params || {});
    } catch (e) {}
  };
  if (!cfg.PIXEL_ID) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', cfg.PIXEL_ID);
  window.fbq('track', 'PageView');
})();
