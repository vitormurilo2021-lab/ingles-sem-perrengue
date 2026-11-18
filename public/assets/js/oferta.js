(function () {
  var cfg = window.ISP_CONFIG || {};
  var qs = new URLSearchParams(location.search);

  // Preço configurável
  document.querySelectorAll('.js-price').forEach(function (el) { if (cfg.PRICE) el.textContent = cfg.PRICE; });
  document.querySelectorAll('.js-price-from').forEach(function (el) { if (cfg.PRICE_FROM) el.textContent = cfg.PRICE_FROM; });

  // Resultado vindo do quiz (?r=48)
  var r = parseInt(qs.get('r'), 10);
  if (!isNaN(r) && r > 0 && r <= 100) {
    document.getElementById('resultPct').textContent = r + '%';
    document.getElementById('resultChip').hidden = false;
  } else {
    document.getElementById('topbar').textContent = 'Treine seu ouvido para a viagem em 21 dias';
  }

  // Checkout: repassa UTMs e dados do quiz
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'src', 'sck'];
  function checkoutUrl() {
    if (!cfg.CHECKOUT_URL) return null;
    try {
      var u = new URL(cfg.CHECKOUT_URL);
      utmKeys.forEach(function (k) { var v = qs.get(k); if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); });
      return u.toString();
    } catch (e) { return cfg.CHECKOUT_URL; }
  }
  document.querySelectorAll('.js-checkout').forEach(function (a) {
    var url = checkoutUrl();
    if (url) a.href = url;
    a.addEventListener('click', function (e) {
      window.ispTrack('InitiateCheckout', { content_name: 'Ingles Sem Perrengue', currency: 'BRL', value: 19.90 });
      if (!url) { e.preventDefault(); alertMissing(a); }
    });
  });
  function alertMissing(a) {
    a.textContent = 'Configure o CHECKOUT_URL em config.js';
    setTimeout(function () { a.textContent = 'QUERO O INGLÊS SEM PERRENGUE'; }, 2500);
  }

  window.ispTrack('ViewContent', { content_name: 'Ingles Sem Perrengue - Oferta' });

  // Abas das 21 cenas
  var weeks = [
    ['Check-in e despacho de bagagem', 'Segurança e portão de embarque', 'Dentro do avião', 'Imigração', 'Bagagem e alfândega', 'Transporte do aeroporto', 'Check-in no hotel'],
    ['Pedir informação e se localizar', 'Restaurante: pedir e pagar', 'Café e fast food', 'Compras e provador', 'Supermercado e farmácia', 'Ingressos e passeios', 'Parques e atrações'],
    ['Problema no quarto', 'Emergência e saúde', 'Alugar carro e posto', 'Small talk: de onde você é?', 'Pedir ajuda e desculpas', 'Reclamar com educação', 'Volta: checkout, aeroporto e tax free']
  ];
  var list = document.getElementById('sceneList');
  var tabs = document.querySelectorAll('.tabs button');
  function show(w) {
    tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === w ? 'true' : 'false'); });
    list.innerHTML = '';
    weeks[w].forEach(function (s, i) {
      var li = document.createElement('li');
      var n = document.createElement('span'); n.className = 'sn'; n.textContent = String(w * 7 + i + 1).padStart(2, '0');
      var t = document.createElement('span'); t.textContent = s;
      li.appendChild(n); li.appendChild(t); list.appendChild(li);
    });
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
  show(0);

  // CTA fixo no celular: aparece depois do topo e some na seção de oferta
  var sticky = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  var offer = document.getElementById('oferta');
  var heroOut = false, offerIn = false;
  function upd() { var on = heroOut && !offerIn; sticky.classList.toggle('show', on); sticky.setAttribute('aria-hidden', on ? 'false' : 'true'); sticky.querySelector('a').tabIndex = on ? 0 : -1; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (e) { offerIn = e[0].isIntersecting; upd(); }).observe(offer);
  }
})();
