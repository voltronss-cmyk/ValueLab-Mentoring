/* ValueLab — prototipe demo. Semua data bersifat contoh; AI belum terintegrasi. */
(function () {
  'use strict';

  // ---- Akun demo (hanya untuk prototipe; JANGAN dipakai di produksi) ----
  var ACCOUNTS = {
    demo1: { password: 'valuelab123', name: 'Peserta Demo 1' },
    demo2: { password: 'valuelab456', name: 'Peserta Demo 2' }
  };
  var SESSION_KEY = 'valuelab_demo_user';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- Navigasi tampilan ----
  function show(view) {
    $$('#app .view').forEach(function (v) { v.classList.remove('active'); });
    var el = $('#view-' + view);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
    if (view === 'home') renderHomeCharts();
    if (view === 'mentoring') renderRadar();
    if (view === 'simulation') startSimulation();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (t) show(t.getAttribute('data-go'));
  });

  // ---- Login ----
  function enterApp(user) {
    $('#view-login').classList.remove('active');
    $('#app').hidden = false;
    $('#user-name').textContent = ACCOUNTS[user].name;
    show('home');
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    $('#app').hidden = true;
    $('#view-login').classList.add('active');
    $('#login-form').reset();
    destroyCharts();
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var u = $('#username').value.trim().toLowerCase();
    var p = $('#password').value;
    var err = $('#login-error');
    if (ACCOUNTS[u] && ACCOUNTS[u].password === p) {
      err.hidden = true;
      try { sessionStorage.setItem(SESSION_KEY, u); } catch (e2) {}
      enterApp(u);
    } else {
      err.textContent = 'Username atau password salah. Periksa kembali data dari mentor Anda.';
      err.hidden = false;
    }
  });
  $$('[data-fill]').forEach(function (b) {
    b.addEventListener('click', function () {
      var parts = b.getAttribute('data-fill').split('|');
      $('#username').value = parts[0];
      $('#password').value = parts[1];
      $('#login-error').hidden = true;
    });
  });
  $('#btn-logout').addEventListener('click', logout);

  // ---- Tahukah kamu ----
  var FACTS = [
    'Banyak profesional berganti karir setidaknya sekali; kejelasan nilai dan minat membuat peralihan lebih terarah.',
    'Pola pikir analitis dapat dilatih lewat studi kasus singkat yang dikerjakan secara rutin.',
    'Umpan balik berkala dari mentor mempercepat pemahaman diri dibanding belajar sendirian.',
    'Menetapkan satu tujuan karir 12 bulan ke depan membantu memilih materi belajar yang paling relevan.',
    'Kesiapan mental sama pentingnya dengan keterampilan teknis dalam menghadapi proses seleksi kerja.'
  ];
  var factIdx = 0;
  function showFact() { $('#dyk-text').textContent = FACTS[factIdx % FACTS.length]; }
  $('#dyk-next').addEventListener('click', function () { factIdx++; showFact(); });
  showFact();

  // ---- Promo modal ----
  var PLANS = {
    Basic: ['Materi bimbingan dasar', '1 simulasi business case / bulan', 'Dukungan via email'],
    Plus: ['Simulasi tanpa batas', 'Laporan Live Cognitive Radar Profile', 'Tanya jawab dengan mentor', 'Prioritas dukungan'],
    Premium: ['Semua fitur Plus', 'Review CV & portofolio', 'Simulasi wawancara', 'Pendampingan karir intensif']
  };
  function openModal(title, html) {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = html;
    $('#modal').hidden = false;
  }
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-promo]');
    if (p) {
      var k = p.getAttribute('data-promo');
      openModal('Membership ' + k,
        '<ul>' + PLANS[k].map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
        '<p class="muted"><em>Demo: informasi dan harga membership belum final.</em></p>');
    }
  });
  $('#modal-close').addEventListener('click', function () { $('#modal').hidden = true; });
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') $('#modal').hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#modal').hidden = true; });

  // ---- Feedback (demo, tidak disimpan) ----
  $('#feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#fb-ok').hidden = false;
    $('#fb-text').value = '';
    setTimeout(function () { $('#fb-ok').hidden = true; }, 5000);
  });

  // ---- Simulasi business case ----
  var QUESTIONS = [
    'Apa masalah utama yang menurut Anda menyebabkan penurunan penjualan, dan data apa yang perlu Anda kumpulkan untuk membuktikannya?',
    'Sebutkan dua atau tiga strategi yang akan Anda usulkan kepada pemilik, beserta alasan memilih strategi tersebut.',
    'Apa risiko terbesar dari strategi pilihan Anda, dan bagaimana Anda mengukur keberhasilannya dalam 3 bulan?'
  ];
  var answers = [];
  var qIdx = 0;
  function renderQuestion() {
    $('#sim-question').textContent = (qIdx + 1) + '. ' + QUESTIONS[qIdx];
    $('#sim-answer').value = answers[qIdx] || '';
    $('#sim-progress').textContent = 'Pertanyaan ' + (qIdx + 1) + ' / ' + QUESTIONS.length;
    $('#sim-bar').style.width = (qIdx / QUESTIONS.length * 100) + '%';
    $('#sim-prev').style.visibility = qIdx === 0 ? 'hidden' : 'visible';
    $('#sim-next').textContent = qIdx === QUESTIONS.length - 1 ? 'Selesai' : 'Lanjut';
    $('#sim-answer').focus();
  }
  function startSimulation() { answers = []; qIdx = 0; renderQuestion(); }
  $('#sim-prev').addEventListener('click', function () {
    answers[qIdx] = $('#sim-answer').value;
    if (qIdx > 0) { qIdx--; renderQuestion(); }
  });
  $('#sim-form').addEventListener('submit', function (e) {
    e.preventDefault();
    answers[qIdx] = $('#sim-answer').value;
    if (qIdx < QUESTIONS.length - 1) { qIdx++; renderQuestion(); }
    else { show('done'); } // Demo: jawaban tidak dikirim/dianalisis
  });

  // ---- Modul bimbingan ----
  var MODULES = [
    { t: 'Mengenal Diri & Nilai Karir', d: 'Petakan minat, nilai, dan kekuatan Anda.', m: '20 menit' },
    { t: 'Memahami Peta Industri', d: 'Kenali peluang dan tren pada bidang yang Anda minati.', m: '25 menit' },
    { t: 'Berpikir Analitis & Pemecahan Masalah', d: 'Latihan kerangka berpikir untuk kasus bisnis.', m: '30 menit' },
    { t: 'Komunikasi & Personal Branding', d: 'Susun cerita profesional yang meyakinkan.', m: '20 menit' },
    { t: 'Menyusun Rencana Karir 12 Bulan', d: 'Terjemahkan tujuan menjadi langkah terukur.', m: '25 menit' }
  ];
  $('#module-list').innerHTML = MODULES.map(function (m, i) {
    return '<button class="module" data-module="' + i + '"><span class="module-num">' + (i + 1) +
      '</span><span><h4>' + m.t + '</h4><p>' + m.d + '</p><small>' + m.m + ' · Materi demo</small></span></button>';
  }).join('');
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-module]');
    if (b) {
      var m = MODULES[+b.getAttribute('data-module')];
      openModal(m.t, '<p>' + m.d + '</p><p class="muted"><em>Demo: isi materi dan pemandu AI belum tersedia. Bagian ini akan diisi setelah AI terintegrasi.</em></p>');
    }
  });

  // ---- Grafik (data contoh) ----
  var charts = {};
  var NAVY = '#0a3560', BLUE = '#12a8e0', DEEP = '#0d86b8';
  function destroyCharts() { Object.keys(charts).forEach(function (k) { charts[k].destroy(); }); charts = {}; }
  function make(id, cfg) {
    if (typeof Chart === 'undefined') return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($('#' + id), cfg);
  }
  var common = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { family: 'Montserrat' } } } } };

  function renderHomeCharts() {
    var weeks = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4', 'Mg 5', 'Mg 6'];
    make('chart-mental', {
      type: 'line',
      data: { labels: weeks, datasets: [
        { label: 'Kesiapan mental (%)', data: [48, 55, 60, 64, 71, 76], borderColor: NAVY, backgroundColor: 'rgba(18,168,224,.15)', fill: true, tension: .35 }
      ] },
      options: Object.assign({}, common, { scales: { y: { min: 0, max: 100 } } })
    });
    make('chart-materi', {
      type: 'bar',
      data: { labels: ['Diri & Nilai', 'Industri', 'Analitis', 'Branding', 'Rencana'], datasets: [
        { label: 'Dikuasai (%)', data: [90, 70, 55, 40, 20], backgroundColor: BLUE }
      ] },
      options: Object.assign({}, common, { scales: { y: { min: 0, max: 100 } } })
    });
    make('chart-skill', {
      type: 'line',
      data: { labels: weeks, datasets: [
        { label: 'Analitis', data: [40, 46, 52, 58, 63, 70], borderColor: NAVY, tension: .3 },
        { label: 'Komunikasi', data: [50, 52, 58, 60, 66, 68], borderColor: BLUE, tension: .3 },
        { label: 'Kepemimpinan', data: [35, 38, 45, 49, 55, 60], borderColor: DEEP, borderDash: [5, 4], tension: .3 }
      ] },
      options: Object.assign({}, common, { scales: { y: { min: 0, max: 100 } } })
    });
    make('chart-karir', {
      type: 'doughnut',
      data: { labels: ['Analis Bisnis', 'Manajemen Produk', 'Konsultan', 'Lainnya'], datasets: [
        { data: [38, 27, 22, 13], backgroundColor: [NAVY, BLUE, DEEP, '#b9d4e8'] }
      ] },
      options: common
    });
  }
  function renderRadar() {
    make('chart-radar', {
      type: 'radar',
      data: { labels: ['Analitis', 'Kreativitas', 'Komunikasi', 'Kepemimpinan', 'Ketahanan', 'Kolaborasi'], datasets: [
        { label: 'Profil contoh', data: [72, 60, 68, 55, 75, 70], borderColor: NAVY, backgroundColor: 'rgba(18,168,224,.25)', pointBackgroundColor: NAVY }
      ] },
      options: Object.assign({}, common, { scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } } })
    });
  }

  try {
    var saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && ACCOUNTS[saved]) enterApp(saved);
  } catch (e) {}
})();
