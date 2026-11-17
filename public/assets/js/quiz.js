(function () {
  'use strict';
  var app = document.getElementById('app');
  var route = document.getElementById('route');
  var routeFill = document.getElementById('routeFill');
  var plane = document.getElementById('plane');
  var kicker = document.getElementById('kicker');
  var qs = new URLSearchParams(location.search);

  var FLAGS = {
    us: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#B22234"/><path d="M0 3h30M0 6.1h30M0 9.2h30M0 12.3h30M0 15.4h30M0 18.5h30" stroke="#fff" stroke-width="1.5"/><rect width="13" height="10.8" fill="#3C3B6E"/></svg>',
    ca: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#D52B1E"/><rect x="22.5" width="7.5" height="20" fill="#D52B1E"/><path d="M15 4l1.2 2.6 2.3-.8-.8 3.4 2.2-.4-1 1.6 1.4 1-3.6.8.3 2.8h-1.7v1.8h-.6V15h-1.7l.3-2.8-3.6-.8 1.4-1-1-1.6 2.2.4-.8-3.4 2.3.8z" fill="#D52B1E"/></svg>',
    uk: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.5"/></svg>'
  };
  var ICON = {
    globe: '<svg class="ico" aria-hidden="true" width="33" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/></svg>',
    compass: '<svg class="ico" aria-hidden="true" width="33" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="#7A1F2B" stroke="#7A1F2B"/></svg>',
    pin: '<svg class="ico" aria-hidden="true" width="22" height="28" viewBox="0 0 24 30" fill="none" stroke="#7A1F2B" stroke-width="2"><path d="M12 28s9-8.6 9-15.5A9 9 0 0 0 3 12.5C3 19.4 12 28 12 28z"/><circle cx="12" cy="12.5" r="3.2"/></svg>',
    pinFill: '<svg aria-hidden="true" width="18" height="24" viewBox="0 0 24 30" fill="#7A1F2B"><path d="M12 29s10-9.5 10-17A10 10 0 0 0 2 12c0 7.5 10 17 10 17z"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>',
    play: '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="#FBF4E2"><path d="M7 4.5v15l13-7.5z"/></svg>',
    plane: '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="#1B2A4A"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>'
  };

  // Áudios: coloque hotel.mp3 e lanchonete.mp3 em /assets/audio/. Sem os arquivos, usa a voz do navegador.
  var AUDIO = {
    hotel: { src: '/assets/audio/hotel.mp3', text: "Hi there! Do you have a reservation with us? Great. I'll just need a card for incidentals, and breakfast is from seven to ten." },
    food: { src: '/assets/audio/lanchonete.mp3', text: "Okay, one cheeseburger combo. Would you like that for here or to go?" }
  };

  var Q = {
    dest: { title: 'Para onde é a sua próxima viagem?', sub: 'Vamos montar o seu Passaporte a partir do destino.', opts: [['us', 'Estados Unidos', 'us'], ['ca', 'Canadá', 'ca'], ['uk', 'Reino Unido', 'uk'], ['eu', 'Outro país da Europa', 'globe'], ['nd', 'Ainda vou decidir', 'compass']] },
    when: { title: 'Quando você embarca?', sub: 'O plano se ajusta à sua data.', opts: [['w2', 'Em menos de 2 semanas'], ['w4', 'Entre 2 e 4 semanas'], ['m3', 'Entre 1 e 3 meses'], ['nd', 'Ainda sem data']] },
    who: { title: 'Com quem você vai?', opts: [['solo', 'Sozinho(a)'], ['casal', 'Em casal'], ['familia', 'Com a família e filhos'], ['amigos', 'Com amigos']] },
    worry: { title: 'Qual momento da viagem mais te preocupa?', sub: 'Escolha o que mais te tira o sono.', opts: [['imig', 'Passar pela imigração'], ['hotel', 'Check-in e problemas no hotel'], ['rest', 'Pedir comida e pagar'], ['perder', 'Me localizar e pegar transporte'], ['emerg', 'Ter uma emergência']] },
    level: { title: 'Quando alguém fala inglês com você, o que acontece?', opts: [['nada', 'Não entendo quase nada'], ['palavras', 'Pego uma ou outra palavra'], ['devagar', 'Entendo se falarem devagar'], ['bem', 'Entendo bem, mas travo pra responder']] },
    age: { title: 'Qual a sua faixa de idade?', sub: 'Para ajustar o ritmo do seu plano.', opts: [['a1', 'Até 29 anos'], ['a2', '30 a 39 anos'], ['a3', '40 a 49 anos'], ['a4', '50 a 59 anos'], ['a5', '60 anos ou mais']] },
    time: { title: 'Quanto tempo por dia você consegue separar?', opts: [['10', '10 minutos'], ['15', '15 minutos'], ['30', '30 minutos ou mais']] }
  };
  // Ordem das telas. num = número exibido da pergunta (de 9).
  var FLOW = [
    { id: 'intro' },
    { id: 'dest', q: 1 }, { id: 'when', q: 2 }, { id: 'who', q: 3 }, { id: 'worry', q: 4 }, { id: 'level', q: 5 },
    { id: 't1', q: 6 }, { id: 't1r', q: 6 }, { id: 't2', q: 7 },
    { id: 'age', q: 8 }, { id: 'time', q: 9 },
    { id: 'loading' }, { id: 'result' }
  ];
  var TOTAL = 9;

  var st = { i: 0, a: {}, t1: null, t2: null, history: [] };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- áudio ----------
  var current = null, speaking = false;
  function stopAudio() {
    if (current) { try { current.pause(); } catch (e) {} current = null; }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    document.querySelectorAll('.play.playing').forEach(function (b) { b.classList.remove('playing'); });
  }
  function speak(text, rate, btn, onFail) {
    try {
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') { onFail(); return; }
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = rate;
      var voices = window.speechSynthesis.getVoices() || [];
      var v = voices.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0];
      if (v) u.voice = v;
      u.onend = function () { if (btn) btn.classList.remove('playing'); };
      if (btn) btn.classList.add('playing');
      window.speechSynthesis.speak(u);
    } catch (e) { onFail(); }
  }
  function play(key, rate, btn, onFail) {
    stopAudio();
    var item = AUDIO[key];
    var a = new Audio(item.src);
    a.preload = 'auto';
    try { a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true; } catch (e) {}
    a.playbackRate = rate;
    current = a;
    if (btn) btn.classList.add('playing');
    a.onended = function () { if (btn) btn.classList.remove('playing'); };
    var fell = false;
    function fallback() { if (fell) return; fell = true; current = null; speak(item.text, rate === 1 ? 1.05 : rate, btn, onFail); }
    a.onerror = fallback;
    var p = a.play();
    if (p && p.catch) p.catch(fallback);
  }

  // ---------- render ----------
  function setProgress() {
    var step = FLOW[st.i];
    if (step.q) {
      route.hidden = false;
      var pct = Math.round(step.q / TOTAL * 100);
      routeFill.style.width = pct + '%';
      plane.style.left = Math.min(Math.max(pct, 4), 96) + '%';
      kicker.textContent = 'PERGUNTA ' + step.q + ' DE ' + TOTAL;
    } else { route.hidden = true; kicker.textContent = ''; }
  }

  function go(i, push) {
    stopAudio();
    if (push !== false) st.history.push(st.i);
    st.i = i;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function next() { go(st.i + 1); }
  function back() {
    var prev = st.history.pop();
    if (prev === undefined) return;
    if (FLOW[prev].id === 't1r') prev = st.history.pop();
    if (FLOW[st.i].id === 'age') st.t2 = null;
    go(prev, false);
  }
  function backHtml() { return st.i > 1 && FLOW[st.i].q ? '<div class="back"><button type="button" data-act="back">← Voltar</button></div>' : ''; }

  function render() {
    setProgress();
    var step = FLOW[st.i];
    var html = '';
    if (step.id === 'intro') html = intro();
    else if (Q[step.id]) html = question(step.id);
    else if (step.id === 't1') html = test1();
    else if (step.id === 't1r') html = test1Reveal();
    else if (step.id === 't2') html = test2();
    else if (step.id === 'loading') html = loading();
    else if (step.id === 'result') html = result();
    app.innerHTML = html + backHtml();
    bind(step.id);
    var h = app.querySelector('h1,h2');
    if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
  }

  function intro() {
    return '<section class="screen">' +
      '<div class="stamp" aria-hidden="true">TESTE GRÁTIS · 1 MIN</div>' +
      '<h1 class="h1">Quanto do inglês de viagem o seu ouvido entende hoje?</h1>' +
      '<p class="intro-p">Faça o <strong>Teste do Ouvido</strong> com 2 áudios reais de viagem e receba um plano de 21 dias montado para o seu destino.</p>' +
      '<div class="map-art" aria-hidden="true"><svg class="path" viewBox="0 0 320 92" preserveAspectRatio="none" fill="none"><path d="M18 70 C 80 10, 140 90, 200 40 S 290 20, 302 30" stroke="#B99B5E" stroke-width="2.5" stroke-dasharray="7 7"/></svg>' +
      '<svg class="p1" width="22" height="28" viewBox="0 0 24 30" fill="#7A1F2B"><path d="M12 29s10-9.5 10-17A10 10 0 0 0 2 12c0 7.5 10 17 10 17z"/><circle cx="12" cy="12" r="4" fill="#FBF4E2"/></svg>' +
      '<svg class="p2" width="22" height="28" viewBox="0 0 24 30" fill="#1B2A4A"><path d="M12 29s10-9.5 10-17A10 10 0 0 0 2 12c0 7.5 10 17 10 17z"/><circle cx="12" cy="12" r="4" fill="#FBF4E2"/></svg>' +
      '<span class="l1">Brasil</span><span class="l2">sua viagem</span></div>' +
      '<div class="howlist"><div><b>1</b>Responda 9 perguntas rápidas</div><div><b>2</b>Ouça 2 cenas reais: hotel e lanchonete</div><div><b>3</b>Receba seu Passaporte com o resultado</div></div>' +
      '<button type="button" class="btn pulse" data-act="start">COMEÇAR O TESTE</button>' +
      '<p class="hint">Use fone de ouvido ou aumente o volume</p>' +
      '</section>';
  }

  function question(key) {
    var q = Q[key];
    var opts = q.opts.map(function (o) {
      var icon = o[2] ? (FLAGS[o[2]] ? '<span class="flag" aria-hidden="true">' + FLAGS[o[2]] + '</span>' : ICON[o[2]]) : ICON.pin;
      return '<button type="button" class="opt" data-val="' + esc(o[0]) + '">' + icon + '<span>' + esc(o[1]) + '</span></button>';
    }).join('');
    return '<section class="screen"><h2 class="qtitle">' + esc(q.title) + '</h2>' + (q.sub ? '<p class="qsub">' + esc(q.sub) + '</p>' : '') + '<div class="opts">' + opts + '</div></section>';
  }

  function audioBlock(label) {
    return '<button type="button" class="play pulse" data-act="play" aria-label="' + label + '">' + ICON.play + '</button>' +
      '<p class="plays">toque para ouvir · pode repetir</p><div class="warn" data-warn hidden></div>';
  }

  function test1() {
    var o = [['a', 'Seu passaporte de novo'], ['b', 'Um cartão para gastos extras (caução)'], ['c', 'Que você volte às dez horas'], ['d', 'O nome de quem fez a reserva']];
    return '<section class="screen"><span class="badge">TESTE DO OUVIDO · CENA 1</span>' +
      '<h2 class="qtitle">Você chegou ao hotel. Ouça a recepcionista.</h2>' +
      '<p class="qsub">Velocidade real, sem legenda.</p>' + audioBlock('Ouvir a recepcionista') +
      '<p class="ask">O que ela pediu para você?</p><div class="opts">' +
      o.map(function (x) { return '<button type="button" class="opt" data-val="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div></section>';
  }

  function test1Reveal() {
    var ok = st.t1 === 'b';
    return '<section class="screen">' +
      '<p class="verdict ' + (ok ? 'good' : 'miss') + '">' + (ok ? 'Boa! Ela pediu um cartão para a caução.' : 'Quase! Ela pediu um cartão para a caução, não o passaporte.') + '</p>' +
      '<h2 class="qtitle">Agora ouça a mesma frase na velocidade de treino</h2>' +
      '<div class="speedbtns"><button type="button" class="sbtn" style="background:#A5D8FF" data-act="slow" data-rate="0.6">Ouvir em 0.6x</button><button type="button" class="sbtn" style="background:#FFE45C" data-act="slow" data-rate="0.8">Ouvir em 0.8x</button></div>' +
      '<div class="warn" data-warn hidden></div>' +
      '<div class="transcript"><div>Hi there! Do you have a <span class="mark">reservation</span> with us?</div><div>Great. I\'ll just need a <span class="mark">card for incidentals</span>,</div><div>and breakfast is from seven to ten.</div>' +
      '<div class="tip">"incidentals" = caução para gastos extras. Ela pediu um cartão, não o passaporte!</div></div>' +
      '<div class="info">Percebeu? Devagar, as palavras se separam e você entende. É assim que funciona o <strong>Treino de Ouvido em 3 Velocidades</strong>.</div>' +
      '<button type="button" class="btn" data-act="next">ENTENDI! PRÓXIMA CENA</button></section>';
  }

  function test2() {
    var o = [['a', 'Se você quer pagar agora'], ['b', 'Se vai comer aqui ou levar'], ['c', 'Se quer a batata maior'], ['d', 'Quantas pessoas vão comer']];
    var done = !!st.t2, ok = st.t2 === 'b';
    var opts = o.map(function (x) {
      var cls = 'opt';
      if (done && x[0] === 'b') cls += ' ok'; else if (done && x[0] === st.t2) cls += ' bad';
      return '<button type="button" class="' + cls + '" data-val="' + x[0] + '"' + (done ? ' disabled' : '') + '>' + esc(x[1]) + '</button>';
    }).join('');
    var fb = done ? '<div class="fb"><p class="verdict ' + (ok ? 'good' : 'miss') + '" style="text-align:left">' + (ok ? 'Acertou! Ele perguntou se é pra comer aqui ou levar.' : 'Essa pega muita gente! Ele perguntou se é pra comer aqui ou levar.') + '</p>' +
      '<div>"Would you like that <span class="mark">for here or to go</span>?"</div><div style="color:#5A4A2E">Pra comer aqui ou pra levar?</div>' +
      '<div class="speedbtns" style="justify-content:flex-start;margin-top:10px"><button type="button" class="sbtn" style="background:#A5D8FF" data-act="slow" data-rate="0.6">Ouvir em 0.6x</button></div></div>' +
      '<button type="button" class="btn" data-act="next">CONTINUAR</button>' : '';
    return '<section class="screen"><span class="badge">TESTE DO OUVIDO · CENA 2</span>' +
      '<h2 class="qtitle">Você pediu um lanche. Ouça o atendente.</h2>' + audioBlock('Ouvir o atendente') +
      '<p class="ask">O que ele perguntou?</p><div class="opts">' + opts + '</div>' + fb + '</section>';
  }

  var DEST = { us: 'Estados Unidos', ca: 'Canadá', uk: 'Reino Unido', eu: 'Europa', nd: 'A definir' };
  var WHEN = { w2: 'Menos de 2 semanas', w4: '2 a 4 semanas', m3: '1 a 3 meses', nd: 'Sem data ainda' };
  var WHO = { solo: 'Sozinho(a)', casal: 'Em casal', familia: 'Com a família', amigos: 'Com amigos' };
  var CRIT = {
    imig: ['Imigração', 'Bagagem e alfândega', 'Transporte do aeroporto'],
    hotel: ['Check-in no hotel', 'Problema no quarto', 'Pedir informação e se localizar'],
    rest: ['Restaurante: pedir e pagar', 'Café e fast food', 'Supermercado e farmácia'],
    perder: ['Pedir informação e se localizar', 'Transporte do aeroporto', 'Ingressos e passeios'],
    emerg: ['Emergência e saúde', 'Pedir ajuda e desculpas', 'Problema no quarto']
  };
  var PLAN = {
    w2: 'Seu embarque está perto: o plano começa pelas suas 3 cenas críticas, para você chegar seguro mesmo sem completar as 21.',
    w4: 'Em 21 dias você completa as 21 cenas e embarca com o Passaporte carimbado.',
    m3: 'Você termina as 21 cenas com folga e ainda revisa as críticas na semana da viagem.',
    nd: 'Comece agora: quando a data sair, você já vai estar com o ouvido treinado.'
  };
  function score() {
    var base = { nada: 15, palavras: 30, devagar: 45, bem: 60 }[st.a.level] || 30;
    return base + (st.t1 === 'b' ? 15 : 0) + (st.t2 === 'b' ? 10 : 0);
  }

  function loading() {
    return '<section class="screen loading"><h2 class="qtitle">Montando o seu Passaporte…</h2>' +
      '<div class="fly"><div class="line" aria-hidden="true"></div>' + ICON.plane + '</div>' +
      '<div class="lsteps"><div>Analisando o seu Teste do Ouvido</div><div>Separando as cenas críticas para ' + esc(DEST[st.a.dest] || 'a sua viagem') + '</div><div>Ajustando o plano à sua data de embarque</div></div></section>';
  }

  function offerUrl(p) {
    var u = new URL('/oferta/', location.origin);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'src', 'sck'].forEach(function (k) { var v = qs.get(k); if (v) u.searchParams.set(k, v); });
    u.searchParams.set('r', p);
    if (st.a.dest) u.searchParams.set('d', st.a.dest);
    if (st.a.worry) u.searchParams.set('k', st.a.worry);
    return u.pathname + u.search;
  }

  function result() {
    var p = score();
    var is40 = ['a3', 'a4', 'a5'].indexOf(st.a.age) >= 0;
    var crit = (CRIT[st.a.worry] || CRIT.imig).map(function (t) { return '<div class="crit">' + ICON.pinFill + '<span>' + esc(t) + '</span></div>'; }).join('');
    return '<section class="screen result">' +
      '<div class="ok-stamp" aria-hidden="true">APROVADO<br>PARA EMBARQUE</div>' +
      '<div class="rlabel">SEU PASSAPORTE</div>' +
      '<h2 class="rtitle">Seu ouvido entende hoje</h2>' +
      '<div class="pct"><b>' + p + '%</b><span>do inglês<br>de viagem</span></div>' +
      '<div class="bar" aria-hidden="true"><i data-w="' + p + '%"></i></div>' +
      '<p class="rp">Isso é comum: o brasileiro lê inglês melhor do que ouve. A boa notícia é que <strong>ouvido se treina</strong>, e com o seu destino e a sua data dá pra chegar pronto.</p>' +
      '<div class="facts"><div><small>DESTINO</small><strong>' + esc(DEST[st.a.dest] || '—') + '</strong></div><div><small>EMBARQUE</small><strong>' + esc(WHEN[st.a.when] || '—') + '</strong></div>' +
      '<div><small>VIAJA</small><strong>' + esc(WHO[st.a.who] || '—') + '</strong></div><div><small>ROTINA</small><strong>' + esc(st.a.time || '15') + ' min por dia</strong></div></div>' +
      '<div class="crit-t">suas 3 cenas críticas:</div>' + crit +
      '<div class="info">' + esc(PLAN[st.a.when] || PLAN.w4) + '</div>' +
      (is40 ? '<div class="note40">Seu plano segue o ritmo de quem começa mais tarde: sem gramática e sem decoreba, uma cena por dia.</div>' : '') +
      '<img class="preview" src="/assets/img/passaporte.webp" width="1400" height="900" alt="Prévia do Passaporte de Progresso">' +
      '<a class="btn pulse" href="' + esc(offerUrl(p)) + '" data-act="offer">VER MEU PLANO DE 21 DIAS</a>' +
      '<button type="button" class="linkbtn" data-act="restart">Refazer o teste</button></section>';
  }

  function warn(msg) {
    var w = app.querySelector('[data-warn]');
    if (w) { w.hidden = false; w.textContent = msg; }
  }

  function bind(id) {
    app.querySelectorAll('[data-act]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var act = el.getAttribute('data-act');
        if (act === 'start') { window.ispTrack('QuizStart', {}, true); next(); }
        else if (act === 'next') next();
        else if (act === 'back') back();
        else if (act === 'restart') { st = { i: 0, a: {}, t1: null, t2: null, history: [] }; render(); }
        else if (act === 'offer') { window.ispTrack('QuizToOffer', { score: score() }, true); }
        else if (act === 'play') {
          var key = id === 't2' ? 'food' : 'hotel';
          play(key, 1, el, function () { warn('Seu navegador não tocou o áudio. Leia rápido e responda: "' + AUDIO[key].text + '"'); });
        } else if (act === 'slow') {
          var k = id === 't2' ? 'food' : 'hotel';
          play(k, parseFloat(el.getAttribute('data-rate')), null, function () { warn('Seu navegador não tocou o áudio.'); });
        }
      });
    });
    app.querySelectorAll('.opt').forEach(function (el) {
      el.addEventListener('click', function () {
        var v = el.getAttribute('data-val');
        if (Q[id]) {
          st.a[id] = v;
          window.ispTrack('QuizStep', { step: id, answer: v }, true);
          if (id === 'time') { go(st.i + 1); setTimeout(function () { st.history.push(st.i); st.i += 1; window.ispTrack('QuizComplete', { score: score(), dest: st.a.dest }, true); render(); }, 2700); }
          else next();
        } else if (id === 't1') { st.t1 = v; window.ispTrack('QuizStep', { step: 't1', correct: v === 'b' }, true); next(); }
        else if (id === 't2' && !st.t2) { st.t2 = v; window.ispTrack('QuizStep', { step: 't2', correct: v === 'b' }, true); stopAudio(); render(); }
      });
    });
    var bar = app.querySelector('.bar i');
    if (bar) requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.width = bar.getAttribute('data-w'); }); });
  }

  if (window.speechSynthesis) { try { window.speechSynthesis.getVoices(); } catch (e) {} }
  render();
})();
