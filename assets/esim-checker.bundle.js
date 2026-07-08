/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           SimTLV — eSIM Compatibility Checker               ║
 * ║           Self-Contained Bundle  v1.1.0  (June 2026)        ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ── QUICK START ──────────────────────────────────────────────────
 *
 *  MODE A — INLINE (embedded in the page):
 *  ----------------------------------------
 *  <div id="esim-checker"></div>
 *  <script src="esim-checker.bundle.js"></script>
 *  <script>
 *    SimTLVeSIM.init({ mode: 'inline', container: '#esim-checker' });
 *  </script>
 *
 *  MODE B — POPUP (opens when a button is clicked):
 *  --------------------------------------------------
 *  <button id="open-esim">בדוק תאימות eSIM</button>
 *  <script src="esim-checker.bundle.js"></script>
 *  <script>
 *    SimTLVeSIM.init({ mode: 'popup', triggerBtn: '#open-esim' });
 *  </script>
 *
 * ── ADD CUSTOM DEVICES ───────────────────────────────────────────
 *
 *  SimTLVeSIM.init({
 *    customDevices: [
 *      { brand: 'Oppo',    model: 'Find X7',    esim: true,  year: 2024 },
 *      { brand: 'Nothing', model: 'Phone (2)',  esim: true,  year: 2023 },
 *      { brand: 'Nokia',   model: 'G60 5G',     esim: false, year: 2022 },
 *    ]
 *  });
 *
 * ── ALL CONFIG OPTIONS ───────────────────────────────────────────
 *
 *  SimTLVeSIM.init({
 *    mode:          'inline',           // 'inline' | 'popup'
 *    container:     '#esim-checker',    // [inline]  CSS selector for host element
 *    triggerBtn:    '#open-esim',       // [popup]   CSS selector for trigger button
 *    popupTitle:    'בדוק תאימות eSIM', // [popup]   popup header title
 *    ctaUrl:        'https://simtlv.co.il',
 *    ctaText:       'קנה eSIM ב-SimTLV',
 *    supportUrl:    'https://wa.me/972...',
 *    loadFont:      true,               // auto-load Heebo from Google Fonts
 *    customDevices: [],                 // extra/override devices (see above)
 *    lang:          'auto',             // 'he' | 'en' | 'auto' (default: 'auto')
 *                                       // 'auto' detects from document.documentElement.lang
 *  });
 *
 * ─────────────────────────────────────────────────────────────────
 */

(function (w, d) {
  'use strict';

  /* ================================================================
     SECTION 1 — CSS
     ================================================================ */
  var CSS = [
    /* base reset */
    '.sew-widget*,.sew-widget *::before,.sew-widget *::after{box-sizing:border-box;margin:0;padding:0}',
    '.sew-popup-overlay *,.sew-popup-overlay *::before,.sew-popup-overlay *::after{box-sizing:border-box;margin:0;padding:0}',
    '.sew-dev-overlay *,.sew-dev-overlay *::before,.sew-dev-overlay *::after{box-sizing:border-box;margin:0;padding:0}',

    /* ── widget wrapper ── */
    '.sew-widget{font-family:"Heebo",Arial,sans-serif;background:#F5F5F7;color:#1d1d1f;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative}',
    '.sew-inner{max-width:860px;margin:0 auto;padding:44px 20px 72px}',

    /* header */
    '.sew-hdr{text-align:center;margin-bottom:36px;position:relative}',
    '.sew-hdr-tag{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #e0e0e0;border-radius:99px;font-size:12px;font-weight:600;color:#555;padding:5px 14px;margin-bottom:16px;letter-spacing:.3px}',
    '.sew-hdr-tag svg{width:14px;height:14px;color:#7c3aed;flex-shrink:0}',
    '.sew-hdr-h1{font-size:clamp(26px,5vw,46px);font-weight:900;color:#1d1d1f;line-height:1.1;letter-spacing:-1px;margin-bottom:10px}',
    '.sew-hdr-h1 em{font-style:normal;background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}',
    '.sew-hdr-p{font-size:16px;color:#6e6e73;font-weight:400}',

    /* lang toggle */
    '.sew-lang-toggle{position:absolute;top:0;left:0;background:rgba(0,0,0,.06);border:none;border-radius:99px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:"Heebo",Arial,sans-serif;color:#555;transition:all .15s;letter-spacing:.3px}',
    '.sew-lang-toggle:hover{background:rgba(0,0,0,.1);color:#1d1d1f}',
    '.sew-widget[dir=ltr] .sew-lang-toggle{left:auto;right:0}',

    /* stats */
    '.sew-stats{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:32px}',
    '.sew-stat{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #e5e5ea;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:600;color:#555}',
    '.sew-stat b{font-size:15px;font-weight:800;color:#7c3aed}',

    /* search */
    '.sew-search-wrap{position:relative;margin-bottom:16px}',
    '.sew-search-wrap svg.sew-si{position:absolute;right:16px;top:50%;transform:translateY(-50%);width:20px;height:20px;color:#aaa;pointer-events:none}',
    '.sew-widget[dir=ltr] .sew-search-wrap svg.sew-si{right:auto;left:16px}',
    '.sew-search{width:100%;padding:14px 48px 14px 46px;font-size:15.5px;font-family:"Heebo",Arial,sans-serif;font-weight:400;color:#1d1d1f;background:#fff;border:1px solid #d5d5d5;border-radius:14px;outline:none;transition:border-color .18s,box-shadow .18s}',
    '.sew-widget[dir=ltr] .sew-search{padding:14px 46px 14px 48px}',
    '.sew-search::placeholder{color:#b0b0b0}',
    '.sew-search:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1)}',
    '.sew-search-x{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;background:#f0f0f0;border:none;cursor:pointer;display:none;align-items:center;justify-content:center;color:#666;font-size:14px;transition:background .15s}',
    '.sew-widget[dir=ltr] .sew-search-x{left:auto;right:14px}',
    '.sew-search-x:hover{background:#e0e0e0}',
    '.sew-search-x.on{display:flex}',

    /* brand tabs */
    '.sew-brands{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}',
    '.sew-brand-btn{display:flex;align-items:center;gap:7px;padding:7px 14px;border-radius:10px;border:1px solid #e0e0e0;background:#fff;cursor:pointer;font-family:"Heebo",Arial,sans-serif;font-size:13px;font-weight:600;color:#444;transition:all .15s;user-select:none}',
    '.sew-brand-btn img{width:18px;height:18px;object-fit:contain;display:block;flex-shrink:0}',
    '.sew-brand-btn:hover{border-color:#bbb;color:#1d1d1f;background:#fafafa}',
    '.sew-brand-btn.active{background:#1d1d1f;border-color:#1d1d1f;color:#fff}',
    '.sew-brand-btn.active img{filter:invert(1) brightness(10)}',
    '.sew-brand-btn.active svg{fill:#fff}',

    /* results info */
    '.sew-rinfo{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;min-height:20px}',
    '.sew-rinfo-text{font-size:13px;color:#999;font-weight:500}',
    '.sew-rinfo-text strong{color:#7c3aed}',
    '.sew-rinfo-dots{display:flex;gap:14px}',
    '.sew-rdot{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#aaa}',
    '.sew-dot{width:8px;height:8px;border-radius:50%}',
    '.sew-dot.ok{background:#34c759}',
    '.sew-dot.no{background:#ff3b30}',

    /* grid */
    '.sew-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:24px}',
    '@media(max-width:620px){.sew-grid{grid-template-columns:1fr 1fr}}',
    '@media(max-width:400px){.sew-grid{grid-template-columns:1fr}}',

    /* card */
    '.sew-card{background:#fff;border:1px solid #e5e5ea;border-radius:14px;padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:border-color .15s,box-shadow .15s,transform .15s;position:relative;overflow:hidden}',
    '.sew-card::after{content:"";position:absolute;top:0;bottom:0;right:0;width:3px;border-radius:0 14px 14px 0}',
    '.sew-widget[dir=ltr] .sew-card::after{right:auto;left:0;border-radius:14px 0 0 14px}',
    '.sew-card.ok::after{background:#34c759}',
    '.sew-card.no::after{background:#ff3b30}',
    '.sew-card:hover{border-color:#ccc;box-shadow:0 4px 20px rgba(0,0,0,.08);transform:translateY(-2px)}',
    '.sew-brand-logo{width:38px;height:38px;border-radius:10px;background:#f5f5f7;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}',
    '.sew-brand-logo img{width:22px;height:22px;object-fit:contain}',
    '.sew-card-info{flex:1;min-width:0}',
    '.sew-card-model{font-size:13.5px;font-weight:700;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;margin-bottom:2px}',
    '.sew-card-brand{font-size:11.5px;color:#aaa;font-weight:500}',
    '.sew-card-badge{flex-shrink:0;font-size:11px;font-weight:700;padding:4px 10px;border-radius:99px;white-space:nowrap}',
    '.sew-card-badge.ok{background:#e8faf0;color:#1a7a3c}',
    '.sew-card-badge.no{background:#ffeaea;color:#c0392b}',

    /* empty */
    '.sew-empty{grid-column:1/-1;text-align:center;padding:56px 20px}',
    '.sew-empty-icon{font-size:40px;margin-bottom:12px;display:block}',
    '.sew-empty-t{font-size:17px;font-weight:700;color:#555;margin-bottom:5px}',
    '.sew-empty-s{font-size:13px;color:#aaa}',

    /* not-sure section */
    '.sew-nsure{background:#fff;border:1.5px dashed #e0e0e0;border-radius:14px;padding:20px;text-align:center}',
    '.sew-nsure-t{font-size:14px;font-weight:700;color:#1d1d1f;margin-bottom:5px}',
    '.sew-nsure-s{font-size:13px;color:#999;margin-bottom:14px}',
    '.sew-nsure-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}',
    '.sew-chip{padding:7px 16px;border-radius:99px;border:1px solid #e0e0e0;background:#fff;font-size:13px;font-weight:600;color:#444;cursor:pointer;font-family:"Heebo",Arial,sans-serif;transition:all .14s}',
    '.sew-chip:hover{background:#f0ecff;border-color:#c4b5fd;color:#7c3aed}',
    '.sew-nsure-divider{border:none;border-top:1px solid #f0f0f0;margin:14px 0}',

    /* support button */
    '.sew-support-btn{display:inline-flex;align-items:center;gap:9px;padding:11px 22px;border-radius:12px;background:#fff;border:1.5px solid #25D366;color:#128a2e;font-family:"Heebo",Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer;transition:all .15s}',
    '.sew-support-btn:hover{background:#25D366;color:#fff;border-color:#25D366}',
    '.sew-support-btn img{width:18px;height:18px;object-fit:contain;flex-shrink:0}',
    '.sew-support-btn:hover img{filter:brightness(10)}',

    /* ── POPUP OVERLAY (wraps entire widget) ── */
    '.sew-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .25s}',
    '.sew-popup-overlay.open{opacity:1;pointer-events:all}',
    '.sew-popup-box{background:#F5F5F7;border-radius:22px;width:100%;max-width:920px;max-height:90vh;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#d5d5d5 transparent;position:relative;transform:scale(.96) translateY(16px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}',
    '.sew-popup-overlay.open .sew-popup-box{transform:none}',
    '.sew-popup-box::-webkit-scrollbar{width:6px}',
    '.sew-popup-box::-webkit-scrollbar-thumb{background:#d5d5d5;border-radius:3px}',
    '.sew-popup-close{position:sticky;top:0;z-index:10;display:flex;justify-content:flex-start;padding:14px 14px 0;background:transparent}',
    '.sew-popup-close-btn{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.08);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#444;font-size:16px;line-height:1;transition:background .14s,transform .14s}',
    '.sew-popup-close-btn:hover{background:rgba(0,0,0,.15);transform:rotate(90deg)}',

    /* ── DEVICE DETAIL OVERLAY ── */
    '.sew-dev-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:9500;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}',
    '.sew-dev-overlay.open{opacity:1;pointer-events:all}',
    '@media(min-width:580px){.sew-dev-overlay{align-items:center}}',

    /* device modal */
    '.sew-dev-modal{background:#fff;border-radius:22px 22px 0 0;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;transform:translateY(48px);transition:transform .3s cubic-bezier(.34,1.56,.64,1);position:relative;font-family:"Heebo",Arial,sans-serif}',
    '.sew-dev-modal::-webkit-scrollbar{display:none}',
    '.sew-dev-overlay.open .sew-dev-modal{transform:none}',
    '@media(min-width:580px){.sew-dev-modal{border-radius:22px;max-height:88vh}}',
    '.sew-dev-handle{display:flex;justify-content:center;padding:12px 0 0}',
    '.sew-dev-bar{width:36px;height:4px;background:#e5e5ea;border-radius:99px}',
    '@media(min-width:580px){.sew-dev-handle{display:none}}',
    '.sew-dev-close{position:absolute;top:14px;left:14px;width:30px;height:30px;border-radius:50%;background:#f0f0f0;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;font-size:15px;line-height:1;transition:background .14s,transform .14s;z-index:5}',
    '.sew-dev-close:hover{background:#e0e0e0;transform:rotate(90deg)}',
    '.sew-dev-body{padding:0 24px 28px}',

    /* device modal hero */
    '.sew-m-hero{text-align:center;padding:18px 0 22px;border-bottom:1px solid #f0f0f0;margin-bottom:22px}',
    '.sew-m-brand-logo{width:64px;height:64px;border-radius:18px;background:#f5f5f7;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px}',
    '.sew-m-brand-logo img{width:36px;height:36px;object-fit:contain}',
    '.sew-m-status{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:6px 16px;border-radius:99px;margin-bottom:10px}',
    '.sew-m-status.ok{background:#e8faf0;color:#1a7a3c}',
    '.sew-m-status.no{background:#ffeaea;color:#c0392b}',
    '.sew-m-model{font-size:22px;font-weight:800;color:#1d1d1f;line-height:1.2;margin-bottom:4px}',
    '.sew-m-meta{font-size:13px;color:#aaa;font-weight:500}',

    /* no-esim box */
    '.sew-m-no{background:#fff8f8;border:1px solid #ffd5d5;border-radius:12px;padding:16px;margin-bottom:20px}',
    '.sew-m-no-t{font-size:13.5px;font-weight:700;color:#c0392b;margin-bottom:6px}',
    '.sew-m-no-s{font-size:13px;color:#666;line-height:1.55}',

    /* section label */
    '.sew-slbl{font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;display:flex;align-items:center;gap:7px}',
    '.sew-slbl::before{content:"";width:3px;height:14px;background:#7c3aed;border-radius:2px;flex-shrink:0}',

    /* steps */
    '.sew-steps{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}',
    '.sew-step{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:#fafafa;border:1px solid #f0f0f0;border-radius:12px}',
    '.sew-step-n{width:26px;height:26px;border-radius:50%;background:#7c3aed;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '.sew-step-t{font-size:13.5px;color:#444;font-weight:500;line-height:1.55;padding-top:3px}',
    '.sew-step-t strong{color:#1d1d1f;font-weight:700}',
    '.sew-path{display:inline-flex;background:#f0ecff;color:#7c3aed;font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:6px;margin:0 2px}',
    '.sew-tick{display:inline-flex;align-items:center;gap:3px;background:#e8faf0;color:#1a7a3c;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:6px;margin-top:4px}',

    /* alt */
    '.sew-alt{background:#fffbef;border:1px solid #fde68a;border-radius:12px;padding:14px;margin-bottom:18px}',
    '.sew-alt-t{font-size:12.5px;font-weight:700;color:#92400e;margin-bottom:6px}',
    '.sew-alt-s{font-size:13px;color:#78350f;line-height:1.55}',
    '.sew-alt-s .sew-path{background:#fef3c7;color:#92400e}',

    /* CTA */
    '.sew-m-cta{background:#1d1d1f;border-radius:16px;padding:20px 18px;text-align:center}',
    '.sew-m-cta-s{font-size:13px;color:rgba(255,255,255,.65);margin-bottom:12px;font-weight:500}',
    '.sew-m-cta-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#1d1d1f;font-family:"Heebo",Arial,sans-serif;font-size:15px;font-weight:800;padding:12px 26px;border-radius:12px;text-decoration:none;border:none;cursor:pointer;transition:transform .15s,box-shadow .15s}',
    '.sew-m-cta-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.18)}',
  ].join('\n');

  /* ================================================================
     SECTION 2 — DEFAULT DEVICE DATABASE
     ================================================================ */
  var BUILT_IN_DEVICES = [
    /* ── Apple ─────────────────────────────────── */
    {brand:'Apple',model:'iPhone XR',         esim:true, year:2018},
    {brand:'Apple',model:'iPhone XS',         esim:true, year:2018},
    {brand:'Apple',model:'iPhone XS Max',     esim:true, year:2018},
    {brand:'Apple',model:'iPhone 11',         esim:true, year:2019},
    {brand:'Apple',model:'iPhone 11 Pro',     esim:true, year:2019},
    {brand:'Apple',model:'iPhone 11 Pro Max', esim:true, year:2019},
    {brand:'Apple',model:'iPhone SE (דור 2)', esim:true, year:2020},
    {brand:'Apple',model:'iPhone 12',         esim:true, year:2020},
    {brand:'Apple',model:'iPhone 12 mini',    esim:true, year:2020},
    {brand:'Apple',model:'iPhone 12 Pro',     esim:true, year:2020},
    {brand:'Apple',model:'iPhone 12 Pro Max', esim:true, year:2020},
    {brand:'Apple',model:'iPhone 13',         esim:true, year:2021},
    {brand:'Apple',model:'iPhone 13 mini',    esim:true, year:2021},
    {brand:'Apple',model:'iPhone 13 Pro',     esim:true, year:2021},
    {brand:'Apple',model:'iPhone 13 Pro Max', esim:true, year:2021},
    {brand:'Apple',model:'iPhone SE (דור 3)', esim:true, year:2022},
    {brand:'Apple',model:'iPhone 14',         esim:true, year:2022},
    {brand:'Apple',model:'iPhone 14 Plus',    esim:true, year:2022},
    {brand:'Apple',model:'iPhone 14 Pro',     esim:true, year:2022},
    {brand:'Apple',model:'iPhone 14 Pro Max', esim:true, year:2022},
    {brand:'Apple',model:'iPhone 15',         esim:true, year:2023},
    {brand:'Apple',model:'iPhone 15 Plus',    esim:true, year:2023},
    {brand:'Apple',model:'iPhone 15 Pro',     esim:true, year:2023},
    {brand:'Apple',model:'iPhone 15 Pro Max', esim:true, year:2023},
    {brand:'Apple',model:'iPhone 16',         esim:true, year:2024},
    {brand:'Apple',model:'iPhone 16 Plus',    esim:true, year:2024},
    {brand:'Apple',model:'iPhone 16 Pro',     esim:true, year:2024},
    {brand:'Apple',model:'iPhone 16 Pro Max', esim:true, year:2024},
    {brand:'Apple',model:'iPhone 16e',        esim:true, year:2025},
    {brand:'Apple',model:'iPhone 17',         esim:true, year:2025},
    {brand:'Apple',model:'iPhone 17 Plus',    esim:true, year:2025},
    {brand:'Apple',model:'iPhone 17 Pro',     esim:true, year:2025},
    {brand:'Apple',model:'iPhone 17 Pro Max', esim:true, year:2025},
    {brand:'Apple',model:'iPhone 17 Air',     esim:true, year:2025},
    {brand:'Apple',model:'iPhone X',          esim:false,year:2017},
    {brand:'Apple',model:'iPhone 8',          esim:false,year:2017},
    {brand:'Apple',model:'iPhone 8 Plus',     esim:false,year:2017},
    {brand:'Apple',model:'iPhone 7',          esim:false,year:2016},
    {brand:'Apple',model:'iPhone 7 Plus',     esim:false,year:2016},
    {brand:'Apple',model:'iPhone 6s',         esim:false,year:2015},
    {brand:'Apple',model:'iPhone 6s Plus',    esim:false,year:2015},
    {brand:'Apple',model:'iPhone SE (דור 1)', esim:false,year:2016},

    /* ── Samsung ────────────────────────────────── */
    {brand:'Samsung',model:'Galaxy Note 10',       esim:true, year:2019},
    {brand:'Samsung',model:'Galaxy Note 10+',      esim:true, year:2019},
    {brand:'Samsung',model:'Galaxy S10 5G',        esim:true, year:2019},
    {brand:'Samsung',model:'Galaxy S20',           esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy S20+',          esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy S20 Ultra',     esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy S20 FE',        esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy Z Flip',        esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy Z Fold 2',      esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy Note 20',       esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy Note 20 Ultra', esim:true, year:2020},
    {brand:'Samsung',model:'Galaxy S21',           esim:true, year:2021},
    {brand:'Samsung',model:'Galaxy S21+',          esim:true, year:2021},
    {brand:'Samsung',model:'Galaxy S21 Ultra',     esim:true, year:2021},
    {brand:'Samsung',model:'Galaxy Z Flip 3',      esim:true, year:2021},
    {brand:'Samsung',model:'Galaxy Z Fold 3',      esim:true, year:2021},
    {brand:'Samsung',model:'Galaxy S21 FE',        esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy S22',           esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy S22+',          esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy S22 Ultra',     esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy Z Flip 4',      esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy Z Fold 4',      esim:true, year:2022},
    {brand:'Samsung',model:'Galaxy S23',           esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy S23+',          esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy S23 Ultra',     esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy S23 FE',        esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy Z Flip 5',      esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy Z Fold 5',      esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy A54',           esim:true, year:2023},
    {brand:'Samsung',model:'Galaxy S24',           esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy S24+',          esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy S24 Ultra',     esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy S24 FE',        esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy Z Flip 6',      esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy Z Fold 6',      esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy A35',           esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy A55',           esim:true, year:2024},
    {brand:'Samsung',model:'Galaxy S25',           esim:true, year:2025},
    {brand:'Samsung',model:'Galaxy S25+',          esim:true, year:2025},
    {brand:'Samsung',model:'Galaxy S25 Ultra',     esim:true, year:2025},
    {brand:'Samsung',model:'Galaxy S25 Edge',      esim:true, year:2025},
    {brand:'Samsung',model:'Galaxy A56',           esim:true, year:2025},
    {brand:'Samsung',model:'Galaxy S26',           esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy S26+',          esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy S26 Ultra',     esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy Z Fold 7',      esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy Z Flip 7',      esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy Z Flip 7 FE',   esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy A36',           esim:true, year:2026},
    {brand:'Samsung',model:'Galaxy S10',           esim:false,year:2019},
    {brand:'Samsung',model:'Galaxy S10+',          esim:false,year:2019},
    {brand:'Samsung',model:'Galaxy S10e',          esim:false,year:2019},
    {brand:'Samsung',model:'Galaxy S9',            esim:false,year:2018},
    {brand:'Samsung',model:'Galaxy S8',            esim:false,year:2017},

    /* ── Google Pixel ───────────────────────────── */
    {brand:'Google',model:'Pixel 3',           esim:true, year:2018},
    {brand:'Google',model:'Pixel 3 XL',        esim:true, year:2018},
    {brand:'Google',model:'Pixel 3a',          esim:true, year:2019},
    {brand:'Google',model:'Pixel 3a XL',       esim:true, year:2019},
    {brand:'Google',model:'Pixel 4',           esim:true, year:2019},
    {brand:'Google',model:'Pixel 4 XL',        esim:true, year:2019},
    {brand:'Google',model:'Pixel 4a',          esim:true, year:2020},
    {brand:'Google',model:'Pixel 4a 5G',       esim:true, year:2020},
    {brand:'Google',model:'Pixel 5',           esim:true, year:2020},
    {brand:'Google',model:'Pixel 5a',          esim:true, year:2021},
    {brand:'Google',model:'Pixel 6',           esim:true, year:2021},
    {brand:'Google',model:'Pixel 6 Pro',       esim:true, year:2021},
    {brand:'Google',model:'Pixel 6a',          esim:true, year:2022},
    {brand:'Google',model:'Pixel 7',           esim:true, year:2022},
    {brand:'Google',model:'Pixel 7 Pro',       esim:true, year:2022},
    {brand:'Google',model:'Pixel 7a',          esim:true, year:2023},
    {brand:'Google',model:'Pixel 8',           esim:true, year:2023},
    {brand:'Google',model:'Pixel 8 Pro',       esim:true, year:2023},
    {brand:'Google',model:'Pixel 8a',          esim:true, year:2024},
    {brand:'Google',model:'Pixel 9',           esim:true, year:2024},
    {brand:'Google',model:'Pixel 9 Pro',       esim:true, year:2024},
    {brand:'Google',model:'Pixel 9 Pro XL',    esim:true, year:2024},
    {brand:'Google',model:'Pixel 9 Pro Fold',  esim:true, year:2024},
    {brand:'Google',model:'Pixel 9a',          esim:true, year:2025},
    {brand:'Google',model:'Pixel 10',          esim:true, year:2025},
    {brand:'Google',model:'Pixel 10 Pro',      esim:true, year:2025},
    {brand:'Google',model:'Pixel 10 Pro XL',   esim:true, year:2025},
    {brand:'Google',model:'Pixel 10 Pro Fold', esim:true, year:2025},
    {brand:'Google',model:'Pixel 2',           esim:false,year:2017},
    {brand:'Google',model:'Pixel 2 XL',        esim:false,year:2017},

    /* ── Motorola ───────────────────────────────── */
    {brand:'Motorola',model:'Razr (2020)',    esim:true, year:2020},
    {brand:'Motorola',model:'Razr 5G',        esim:true, year:2020},
    {brand:'Motorola',model:'Edge+ (2020)',   esim:true, year:2020},
    {brand:'Motorola',model:'Razr (2022)',    esim:true, year:2022},
    {brand:'Motorola',model:'Edge 30 Pro',    esim:true, year:2022},
    {brand:'Motorola',model:'Razr 40',        esim:true, year:2023},
    {brand:'Motorola',model:'Razr 40 Ultra',  esim:true, year:2023},
    {brand:'Motorola',model:'Edge 40 Pro',    esim:true, year:2023},
    {brand:'Motorola',model:'Razr 50',        esim:true, year:2024},
    {brand:'Motorola',model:'Razr 50 Ultra',  esim:true, year:2024},
    {brand:'Motorola',model:'Edge 50 Pro',    esim:true, year:2024},
    {brand:'Motorola',model:'Edge 50 Ultra',  esim:true, year:2024},
    {brand:'Motorola',model:'Razr 2025',      esim:true, year:2025},
    {brand:'Motorola',model:'Razr+ 2025',     esim:true, year:2025},
    {brand:'Motorola',model:'Edge 60 Pro',    esim:true, year:2025},

    /* ── Huawei ─────────────────────────────────── */
    {brand:'Huawei',model:'P40',          esim:true, year:2020},
    {brand:'Huawei',model:'P40 Pro',      esim:true, year:2020},
    {brand:'Huawei',model:'P40 Pro+',     esim:true, year:2020},
    {brand:'Huawei',model:'Mate 40 Pro',  esim:true, year:2020},
    {brand:'Huawei',model:'P50 Pro',      esim:true, year:2021},
    {brand:'Huawei',model:'Mate 50 Pro',  esim:true, year:2022},

    /* ── Sony ───────────────────────────────────── */
    {brand:'Sony',model:'Xperia 1 IV',  esim:true, year:2022},
    {brand:'Sony',model:'Xperia 5 IV',  esim:true, year:2022},
    {brand:'Sony',model:'Xperia 1 V',   esim:true, year:2023},
    {brand:'Sony',model:'Xperia 5 V',   esim:true, year:2023},
    {brand:'Sony',model:'Xperia 10 V',  esim:true, year:2023},
    {brand:'Sony',model:'Xperia 1 VI',  esim:true, year:2024},
    {brand:'Sony',model:'Xperia 5 VI',  esim:true, year:2024},
    {brand:'Sony',model:'Xperia 1 VII', esim:true, year:2025},
    {brand:'Sony',model:'Xperia 5 VII', esim:true, year:2025},

    /* ── OnePlus ────────────────────────────────── */
    {brand:'OnePlus',model:'OnePlus Open', esim:true, year:2023},
    {brand:'OnePlus',model:'OnePlus 12',   esim:true, year:2024},
    {brand:'OnePlus',model:'OnePlus 12R',  esim:true, year:2024},
    {brand:'OnePlus',model:'OnePlus 13',   esim:true, year:2025},
    {brand:'OnePlus',model:'OnePlus 13R',  esim:true, year:2025},

    /* ── Xiaomi ─────────────────────────────────── */
    {brand:'Xiaomi',model:'Xiaomi 12T Pro',  esim:true, year:2022},
    {brand:'Xiaomi',model:'Xiaomi 13',       esim:true, year:2023},
    {brand:'Xiaomi',model:'Xiaomi 13 Pro',   esim:true, year:2023},
    {brand:'Xiaomi',model:'Xiaomi 13T Pro',  esim:true, year:2023},
    {brand:'Xiaomi',model:'Xiaomi 14',       esim:true, year:2024},
    {brand:'Xiaomi',model:'Xiaomi 14 Ultra', esim:true, year:2024},
    {brand:'Xiaomi',model:'Xiaomi 14T Pro',  esim:true, year:2024},
    {brand:'Xiaomi',model:'Xiaomi 15',       esim:true, year:2025},
    {brand:'Xiaomi',model:'Xiaomi 15 Pro',   esim:true, year:2025},
    {brand:'Xiaomi',model:'Xiaomi 15 Ultra', esim:true, year:2025},
    {brand:'Xiaomi',model:'Xiaomi 15T',      esim:true, year:2025},
    {brand:'Xiaomi',model:'Xiaomi 15T Pro',  esim:true, year:2025},
  ];

  /* ================================================================
     SECTION 3 — BRAND LOGOS, INSTRUCTIONS & I18N
     ================================================================ */
  var LOGOS = {
    Apple:    'https://cdn.simpleicons.org/apple/1d1d1f',
    Samsung:  'https://cdn.simpleicons.org/samsung/1428a0',
    Google:   'https://cdn.simpleicons.org/google/4285f4',
    Motorola: 'https://cdn.simpleicons.org/motorola/e51937',
    Huawei:   'https://cdn.simpleicons.org/huawei/cf0a2c',
    Sony:     'https://cdn.simpleicons.org/sony/000000',
    OnePlus:  'https://cdn.simpleicons.org/oneplus/f5010c',
    Xiaomi:   'https://cdn.simpleicons.org/xiaomi/ff6900',
  };

  /* Hebrew device name → English name map */
  var MODEL_NAME_EN = {
    'iPhone SE (דור 1)': 'iPhone SE (1st Gen)',
    'iPhone SE (דור 2)': 'iPhone SE (2nd Gen)',
    'iPhone SE (דור 3)': 'iPhone SE (3rd Gen)',
  };

  /* Bilingual instructions */
  var INSTRUCTIONS = {
    he: {
      Apple:    { title:'כיצד לאמת ב-iPhone שלך',        steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">כללי</span>','לחץ על <span class="sew-path">אודות</span>','חפש <strong>Digital SIM</strong> — אם מופיע, תומך<br><span class="sew-tick">✅ Digital SIM = תומך eSIM</span>'], alt:{t:'💡 בדיקה מהירה נוספת',s:'הגדרות ← <span class="sew-path">סלולרי</span> ← <span class="sew-path">הוסף eSIM</span><br>אם האפשרות קיימת — תומך ✅'} },
      Samsung:  { title:'כיצד לאמת ב-Samsung Galaxy שלך', steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">חיבורים</span>','לחץ על <span class="sew-path">מנהל כרטיס SIM</span>','חפש <strong>"הוסף eSIM"</strong> / <strong>"Add eSIM"</strong><br><span class="sew-tick">✅ האפשרות קיימת = תומך eSIM</span>'], alt:{t:'💡 בדיקת EID דרך חייגן',s:'פתח חייגן ← הקלד <span class="sew-path">*#06#</span><br>מופיע <strong>EID</strong>? = תומך eSIM ✅'} },
      Google:   { title:'כיצד לאמת ב-Google Pixel שלך',  steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">רשת ואינטרנט</span>','לחץ על <span class="sew-path">כרטיסי SIM</span>','חפש <strong>"הורד eSIM חדש"</strong><br><span class="sew-tick">✅ האפשרות קיימת = תומך eSIM</span>'], alt:null },
      Motorola: { title:'כיצד לאמת ב-Motorola שלך',      steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">רשת ואינטרנט</span>','לחץ על <span class="sew-path">כרטיסי SIM</span>','חפש <strong>eSIM</strong> / <strong>SIM דיגיטלי</strong><br><span class="sew-tick">✅ האפשרות קיימת = תומך</span>'], alt:{t:'💡 בדיקת EID דרך חייגן',s:'פתח חייגן ← הקלד <span class="sew-path">*#06#</span><br>מופיע <strong>EID</strong>? = תומך eSIM ✅'} },
      Huawei:   { title:'כיצד לאמת ב-Huawei שלך',        steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">רשת סלולרית</span>','לחץ על <span class="sew-path">כרטיס SIM</span>','חפש <strong>eSIM</strong><br><span class="sew-tick">✅ תפריט eSIM = תומך</span>'], alt:null },
      Sony:     { title:'כיצד לאמת ב-Sony Xperia שלך',   steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">רשת ואינטרנט</span>','לחץ על <span class="sew-path">כרטיסי SIM</span>','חפש <strong>"הורד eSIM"</strong><br><span class="sew-tick">✅ האפשרות קיימת = תומך</span>'], alt:null },
      OnePlus:  { title:'כיצד לאמת ב-OnePlus שלך',       steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">כרטיס SIM ורשת</span>','חפש <span class="sew-path">eSIM</span> / <span class="sew-path">SIM דיגיטלי</span>','אם האפשרות קיימת — תומך ✅'], alt:null },
      Xiaomi:   { title:'כיצד לאמת ב-Xiaomi שלך',        steps:['פתח את <strong>הגדרות</strong> ⚙️','לחץ על <span class="sew-path">כרטיסי SIM וסלולר</span>','חפש <strong>eSIM</strong> / <strong>"הוסף SIM דיגיטלי"</strong>','אם האפשרות קיימת — תומך ✅'], alt:{t:'💡 בדיקת EID דרך חייגן',s:'פתח חייגן ← הקלד <span class="sew-path">*#06#</span><br>מופיע <strong>EID</strong>? = תומך eSIM ✅'} },
      generic:  { title:'בדיקה כללית — כל מכשיר אנדרואיד',steps:['פתח את <strong>הגדרות</strong> ⚙️','חפש <span class="sew-path">רשת</span> / <span class="sew-path">SIM</span> / <span class="sew-path">חיבורים</span>','חפש <strong>eSIM</strong> / <strong>SIM דיגיטלי</strong>','אם האפשרות קיימת — המכשיר תומך ✅'], alt:{t:'💡 שיטת EID — הכי מהיר',s:'פתח חייגן ← הקלד <span class="sew-path">*#06#</span><br>אם מופיע <strong>EID</strong> (32 ספרות) — תומך ✅<br>אם לא — אינו תומך ❌'} },
    },
    en: {
      Apple:    { title:'How to verify on your iPhone',           steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">General</span>','Tap <span class="sew-path">About</span>','Look for <strong>Digital SIM</strong> — if present, it\'s supported<br><span class="sew-tick">✅ Digital SIM = eSIM supported</span>'], alt:{t:'💡 Quick alternate check',s:'Settings → <span class="sew-path">Cellular</span> → <span class="sew-path">Add eSIM</span><br>If the option exists — supported ✅'} },
      Samsung:  { title:'How to verify on your Samsung Galaxy',   steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">Connections</span>','Tap <span class="sew-path">SIM card manager</span>','Look for <strong>"Add eSIM"</strong><br><span class="sew-tick">✅ Option exists = eSIM supported</span>'], alt:{t:'💡 EID check via dialer',s:'Open dialer → dial <span class="sew-path">*#06#</span><br>If <strong>EID</strong> appears = eSIM supported ✅'} },
      Google:   { title:'How to verify on your Google Pixel',     steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">Network &amp; internet</span>','Tap <span class="sew-path">SIMs</span>','Look for <strong>"Download new eSIM"</strong><br><span class="sew-tick">✅ Option exists = eSIM supported</span>'], alt:null },
      Motorola: { title:'How to verify on your Motorola',         steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">Network &amp; internet</span>','Tap <span class="sew-path">SIMs</span>','Look for <strong>eSIM</strong> / <strong>Digital SIM</strong><br><span class="sew-tick">✅ Option exists = supported</span>'], alt:{t:'💡 EID check via dialer',s:'Open dialer → dial <span class="sew-path">*#06#</span><br>If <strong>EID</strong> appears = eSIM supported ✅'} },
      Huawei:   { title:'How to verify on your Huawei',           steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">Mobile network</span>','Tap <span class="sew-path">SIM card</span>','Look for <strong>eSIM</strong><br><span class="sew-tick">✅ eSIM menu present = supported</span>'], alt:null },
      Sony:     { title:'How to verify on your Sony Xperia',      steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">Network &amp; internet</span>','Tap <span class="sew-path">SIMs</span>','Look for <strong>"Download eSIM"</strong><br><span class="sew-tick">✅ Option exists = supported</span>'], alt:null },
      OnePlus:  { title:'How to verify on your OnePlus',          steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">SIM card &amp; mobile network</span>','Look for <span class="sew-path">eSIM</span> / <span class="sew-path">Digital SIM</span>','If the option exists — supported ✅'], alt:null },
      Xiaomi:   { title:'How to verify on your Xiaomi',           steps:['Open <strong>Settings</strong> ⚙️','Tap <span class="sew-path">SIM cards &amp; mobile networks</span>','Look for <strong>eSIM</strong> / <strong>"Add Digital SIM"</strong>','If the option exists — supported ✅'], alt:{t:'💡 EID check via dialer',s:'Open dialer → dial <span class="sew-path">*#06#</span><br>If <strong>EID</strong> appears = eSIM supported ✅'} },
      generic:  { title:'General check — any Android device',     steps:['Open <strong>Settings</strong> ⚙️','Search for <span class="sew-path">Network</span> / <span class="sew-path">SIM</span> / <span class="sew-path">Connections</span>','Look for <strong>eSIM</strong> / <strong>Digital SIM</strong>','If the option exists — device is supported ✅'], alt:{t:'💡 EID method — fastest check',s:'Open dialer → dial <span class="sew-path">*#06#</span><br>If <strong>EID</strong> (32 digits) appears — supported ✅<br>If not — not supported ❌'} },
    },
  };

  /* I18N strings */
  var I18N = {
    he: {
      tagline:          'בדיקת תאימות eSIM',
      title:            'המכשיר שלך תומך ב<em>-eSIM</em>?',
      subtitle:         'חפש את דגם המכשיר וגלה תוך שנייה',
      stat1:            'דגמים במאגר',
      stat2:            'מותגים מובילים',
      stat3:            'עדכני לשנה הנוכחית',
      searchPlaceholder:'חפש מכשיר... לדוג׳ iPhone 17, Galaxy S26',
      allBrands:        'הכל',
      badgeOk:          '✅ תומך',
      badgeNo:          '❌ לא תומך',
      legendOk:         'תומך',
      legendNo:         'לא תומך',
      resultsText:      function(total, ok, no) { return 'נמצאו <strong>' + total + '</strong> מכשירים · <strong style="color:#1a7a3c">' + ok + ' תומכים</strong> · <strong style="color:#c0392b">' + no + ' לא תומכים</strong>'; },
      emptyTitle:       'לא נמצאו תוצאות',
      emptySub:         'נסה שם אחר, או בחר "הכל"',
      notFoundTitle:    '🤔 לא מוצא את המכשיר שלך?',
      notFoundSub:      'סנן לפי מותג, או בצע בדיקה ישירה דרך הגדרות המכשיר',
      generalAndroid:   'בדיקה כללית לאנדרואיד',
      supportBtn:       'לא בטוח? צור קשר עם התמיכה שלנו',
      deviceSupported:  '✅ המכשיר תומך ב-eSIM',
      deviceNotSupported:'❌ המכשיר אינו תומך ב-eSIM',
      noEsimTitle:      'לא ניתן להשתמש ב-eSIM במכשיר זה',
      noEsimDesc:       function(brand, model, year) { return '<strong>' + brand + ' ' + model + '</strong> (' + year + ') אינו כולל שבב eSIM מובנה.<br>💡 דגמים חדשים יותר של ' + brand + ' כן תומכים ב-eSIM.'; },
      noEsimSupport:    'לא בטוח? דבר עם התמיכה שלנו',
      ctaReadyText:     'המכשיר שלך מוכן — קנה eSIM גלובלי עכשיו 🌍',
      ctaReadyGeneric:  'המכשיר תומך? קנה eSIM עכשיו 🌍',
      genericTitle:     'בדיקה כללית',
      genericMeta:      'עובד על כל מכשיר אנדרואיד',
      clearBtn:         'נקה',
      langToggle:       'EN',
      defaultCtaText:   'קנה eSIM ב-SimTLV',
      defaultPopupTitle:'בדיקת תאימות eSIM',
    },
    en: {
      tagline:          'eSIM Compatibility Check',
      title:            'Does your device support <em>eSIM</em>?',
      subtitle:         'Search your device model and find out instantly',
      stat1:            'devices in database',
      stat2:            'leading brands',
      stat3:            'up to date',
      searchPlaceholder:'Search device... e.g. iPhone 17, Galaxy S26',
      allBrands:        'All',
      badgeOk:          '✅ Supported',
      badgeNo:          '❌ Not Supported',
      legendOk:         'Supported',
      legendNo:         'Not Supported',
      resultsText:      function(total, ok, no) { return 'Found <strong>' + total + '</strong> devices · <strong style="color:#1a7a3c">' + ok + ' supported</strong> · <strong style="color:#c0392b">' + no + ' not supported</strong>'; },
      emptyTitle:       'No results found',
      emptySub:         'Try a different name, or select "All"',
      notFoundTitle:    "🤔 Can't find your device?",
      notFoundSub:      'Filter by brand, or check directly through your device settings',
      generalAndroid:   'General Android check',
      supportBtn:       'Not sure? Contact our support',
      deviceSupported:  '✅ Device supports eSIM',
      deviceNotSupported:'❌ Device does not support eSIM',
      noEsimTitle:      'Cannot use eSIM with this device',
      noEsimDesc:       function(brand, model, year) { return '<strong>' + brand + ' ' + model + '</strong> (' + year + ') does not include a built-in eSIM chip.<br>💡 Newer ' + brand + ' models do support eSIM.'; },
      noEsimSupport:    'Not sure? Talk to our support',
      ctaReadyText:     'Your device is ready — Buy a global eSIM now 🌍',
      ctaReadyGeneric:  'Device supported? Buy eSIM now 🌍',
      genericTitle:     'General Check',
      genericMeta:      'Works on any Android device',
      clearBtn:         'Clear',
      langToggle:       'עב',
      defaultCtaText:   'Buy eSIM at SimTLV',
      defaultPopupTitle:'eSIM Compatibility Check',
    },
  };

  /* ================================================================
     SECTION 4 — HELPERS
     ================================================================ */
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function logoImg(brand, size) {
    var s = size || 22;
    var src = LOGOS[brand] || 'https://cdn.simpleicons.org/android/888888';
    return '<img src="' + src + '" width="' + s + '" height="' + s + '" alt="' + esc(brand) + '" loading="lazy">';
  }

  /* Resolve the active language from cfg */
  function resolveLang(cfg) {
    var l = cfg._lang || cfg.lang || 'auto';
    if (l === 'he' || l === 'en') return l;
    /* auto: detect from html[lang] */
    var docLang = (d.documentElement.lang || '').toLowerCase();
    return (docLang.indexOf('en') === 0) ? 'en' : 'he';
  }

  /* Return translated model name for English */
  function modelName(model, lang) {
    if (lang === 'en' && MODEL_NAME_EN[model]) return MODEL_NAME_EN[model];
    return model;
  }

  var SIM_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:.8"><path d="M18 2h-8.17L4 7.83V22h16V2h-2zm0 18H6V8.66L9.66 5H18v15z"/><rect x="8" y="10" width="8" height="2"/><rect x="8" y="14" width="8" height="2"/></svg>';
  var WA_IMG  = '<img src="https://cdn.simpleicons.org/whatsapp/25D366" width="18" height="18" alt="WhatsApp" style="flex-shrink:0">';

  function buildSteps(brand, lang) {
    var ins = INSTRUCTIONS[lang][brand] || INSTRUCTIONS[lang].generic;
    var steps = ins.steps.map(function(s, i) {
      return '<div class="sew-step"><div class="sew-step-n">' + (i+1) + '</div><div class="sew-step-t">' + s + '</div></div>';
    }).join('');
    var alt = ins.alt
      ? '<div class="sew-alt"><div class="sew-alt-t">' + ins.alt.t + '</div><div class="sew-alt-s">' + ins.alt.s + '</div></div>'
      : '';
    return '<div class="sew-slbl">' + ins.title + '</div><div class="sew-steps">' + steps + '</div>' + alt;
  }

  /* ================================================================
     SECTION 5 — HTML BUILDER
     ================================================================ */
  function buildWidgetHTML(cfg, uid) {
    var lang = resolveLang(cfg);
    var t    = I18N[lang];
    var dir  = (lang === 'en') ? 'ltr' : 'rtl';
    var brands = ['Apple','Samsung','Google','Motorola','Huawei','Sony','Xiaomi','OnePlus'];

    var brandBtns =
      '<button class="sew-brand-btn active" data-brand="all">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>' +
        ' ' + t.allBrands +
      '</button>' +
      brands.map(function(b) {
        return '<button class="sew-brand-btn" data-brand="' + b + '">' + logoImg(b, 18) + ' ' + (b === 'Google' ? 'Google Pixel' : b) + '</button>';
      }).join('');

    /* Determine effective CTA text: if user passed explicit ctaText, keep it; otherwise use i18n default */
    var ctaText = cfg._ctaTextOverridden ? cfg.ctaText : t.defaultCtaText;

    return '<div class="sew-widget" id="sew-w-' + uid + '" dir="' + dir + '">' +
      '<div class="sew-inner">' +

        '<!-- HEADER -->' +
        '<div class="sew-hdr">' +
          '<button class="sew-lang-toggle" id="sew-lt-' + uid + '" aria-label="Switch language">' + t.langToggle + '</button>' +
          '<div class="sew-hdr-tag">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1.5 8.5a13 13 0 0 1 21 0M5 12a10 10 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01"/></svg>' +
            t.tagline +
          '</div>' +
          '<h2 class="sew-hdr-h1">' + t.title + '</h2>' +
          '<p class="sew-hdr-p">' + t.subtitle + '</p>' +
        '</div>' +

        '<!-- STATS -->' +
        '<div class="sew-stats">' +
          '<div class="sew-stat"><b>200+</b> ' + t.stat1 + '</div>' +
          '<div class="sew-stat"><b>10</b> ' + t.stat2 + '</div>' +
          '<div class="sew-stat"><b>2026</b> ' + t.stat3 + '</div>' +
        '</div>' +

        '<!-- SEARCH -->' +
        '<div class="sew-search-wrap">' +
          '<svg class="sew-si" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
          '<input type="text" id="sew-search-' + uid + '" class="sew-search" placeholder="' + esc(t.searchPlaceholder) + '" autocomplete="off" spellcheck="false" aria-label="' + esc(t.searchPlaceholder) + '">' +
          '<button class="sew-search-x" id="sew-sx-' + uid + '" aria-label="' + esc(t.clearBtn) + '">✕</button>' +
        '</div>' +

        '<!-- BRANDS -->' +
        '<div class="sew-brands" id="sew-brands-' + uid + '">' + brandBtns + '</div>' +

        '<!-- RESULTS INFO -->' +
        '<div class="sew-rinfo">' +
          '<div class="sew-rinfo-text" id="sew-rinfo-' + uid + '"></div>' +
          '<div class="sew-rinfo-dots">' +
            '<div class="sew-rdot"><span class="sew-dot ok"></span>' + t.legendOk + '</div>' +
            '<div class="sew-rdot"><span class="sew-dot no"></span>' + t.legendNo + '</div>' +
          '</div>' +
        '</div>' +

        '<!-- GRID -->' +
        '<div class="sew-grid" id="sew-grid-' + uid + '"></div>' +

        '<!-- NOT SURE -->' +
        '<div class="sew-nsure">' +
          '<div class="sew-nsure-t">' + t.notFoundTitle + '</div>' +
          '<div class="sew-nsure-s">' + t.notFoundSub + '</div>' +
          '<div class="sew-nsure-chips">' +
            '<button class="sew-chip" data-fb="Apple">Apple iPhone</button>' +
            '<button class="sew-chip" data-fb="Samsung">Samsung Galaxy</button>' +
            '<button class="sew-chip" data-fb="Google">Google Pixel</button>' +
            '<button class="sew-chip" data-generic="1">' + t.generalAndroid + '</button>' +
          '</div>' +
          '<hr class="sew-nsure-divider">' +
          '<a class="sew-support-btn" href="' + esc(cfg.supportUrl) + '" target="_blank" rel="noopener">' +
            WA_IMG + ' ' + t.supportBtn +
          '</a>' +
        '</div>' +

      '</div>' + // /.sew-inner
    '</div>';   // /.sew-widget
  }

  function buildDeviceModalHTML(lang) {
    var dir = (lang === 'en') ? 'ltr' : 'rtl';
    return '<div class="sew-dev-overlay" id="sew-dov"><div class="sew-dev-modal" id="sew-dm">' +
      '<div class="sew-dev-handle"><div class="sew-dev-bar"></div></div>' +
      '<button class="sew-dev-close" id="sew-dc">✕</button>' +
      '<div class="sew-dev-body" id="sew-db" dir="' + dir + '"></div>' +
    '</div></div>';
  }

  /* ================================================================
     SECTION 6 — CORE LOGIC
     ================================================================ */
  function createInstance(cfg) {
    var uid    = cfg._uid;
    var DB     = cfg._db;
    var brand  = 'all';
    var query  = '';
    var lang   = resolveLang(cfg);
    var t      = I18N[lang];

    var searchEl  = d.getElementById('sew-search-' + uid);
    var searchXEl = d.getElementById('sew-sx-'     + uid);
    var brandsEl  = d.getElementById('sew-brands-' + uid);
    var gridEl    = d.getElementById('sew-grid-'   + uid);
    var rinfoEl   = d.getElementById('sew-rinfo-'  + uid);
    var devOvEl   = d.getElementById('sew-dov');
    var devMoEl   = d.getElementById('sew-dm');
    var devBdEl   = d.getElementById('sew-db');
    var devClEl   = d.getElementById('sew-dc');
    var langTogEl = d.getElementById('sew-lt-'     + uid);

    /* Determine effective CTA text */
    var ctaText = cfg._ctaTextOverridden ? cfg.ctaText : t.defaultCtaText;

    /* ── render ── */
    function render() {
      var q = query.toLowerCase().trim();
      var list = DB.filter(function(item) {
        var displayModel = modelName(item.model, lang);
        return (brand === 'all' || item.brand === brand) &&
          (!q || displayModel.toLowerCase().indexOf(q) > -1 || item.brand.toLowerCase().indexOf(q) > -1 || item.model.toLowerCase().indexOf(q) > -1);
      }).sort(function(a, b) { return (b.year - a.year) || (b.esim - a.esim); });

      var ok = list.filter(function(x) { return x.esim; }).length;
      rinfoEl.innerHTML = list.length ? t.resultsText(list.length, ok, list.length - ok) : '';

      if (!list.length) {
        gridEl.innerHTML = '<div class="sew-empty"><span class="sew-empty-icon">🔍</span><div class="sew-empty-t">' + t.emptyTitle + '</div><div class="sew-empty-s">' + t.emptySub + '</div></div>';
        return;
      }
      gridEl.innerHTML = list.map(function(item) {
        var dispModel = modelName(item.model, lang);
        return '<div class="sew-card ' + (item.esim ? 'ok' : 'no') + '" data-brand="' + esc(item.brand) + '" data-model="' + esc(item.model) + '">' +
          '<div class="sew-brand-logo">' + logoImg(item.brand) + '</div>' +
          '<div class="sew-card-info"><div class="sew-card-model">' + esc(dispModel) + '</div><div class="sew-card-brand">' + esc(item.brand) + ' · ' + item.year + '</div></div>' +
          '<div class="sew-card-badge ' + (item.esim ? 'ok' : 'no') + '">' + (item.esim ? t.badgeOk : t.badgeNo) + '</div>' +
        '</div>';
      }).join('');
    }

    /* ── device modal ── */
    function openDevModal()  { devOvEl.classList.add('open'); d.body.style.overflow = 'hidden'; }
    function closeDevModal() { devOvEl.classList.remove('open'); d.body.style.overflow = ''; }

    function showDevice(brandVal, modelVal) {
      var dev = null;
      for (var i = 0; i < DB.length; i++) { if (DB[i].brand === brandVal && DB[i].model === modelVal) { dev = DB[i]; break; } }
      if (!dev) return;

      /* Update body dir for current lang */
      devBdEl.setAttribute('dir', (lang === 'en') ? 'ltr' : 'rtl');

      var dispModel = modelName(dev.model, lang);

      var html =
        '<div class="sew-m-hero">' +
          '<div class="sew-m-brand-logo">' + logoImg(dev.brand, 36) + '</div><br>' +
          '<div class="sew-m-status ' + (dev.esim ? 'ok' : 'no') + '">' + (dev.esim ? t.deviceSupported : t.deviceNotSupported) + '</div>' +
          '<div class="sew-m-model">' + esc(dev.brand) + ' ' + esc(dispModel) + '</div>' +
          '<div class="sew-m-meta">' + esc(dev.brand) + ' · ' + dev.year + '</div>' +
        '</div>';

      if (!dev.esim) {
        html += '<div class="sew-m-no">' +
          '<div class="sew-m-no-t">' + t.noEsimTitle + '</div>' +
          '<div class="sew-m-no-s">' + t.noEsimDesc(esc(dev.brand), esc(dispModel), dev.year) + '</div>' +
          '<div style="text-align:center;margin-top:12px"><a class="sew-support-btn" href="' + esc(cfg.supportUrl) + '" target="_blank" rel="noopener">' + WA_IMG + ' ' + t.noEsimSupport + '</a></div>' +
        '</div>';
      }

      html += buildSteps(dev.brand, lang);

      if (dev.esim) {
        html += '<div class="sew-m-cta">' +
          '<div class="sew-m-cta-s">' + t.ctaReadyText + '</div>' +
          '<a class="sew-m-cta-btn" href="' + esc(cfg.ctaUrl) + '" target="_blank" rel="noopener">' + SIM_SVG + ' ' + esc(ctaText) + ' ←</a>' +
        '</div>';
      }

      devBdEl.innerHTML = html;
      devMoEl.scrollTop = 0;
      openDevModal();
    }

    function showGeneric() {
      var ins = INSTRUCTIONS[lang].generic;
      devBdEl.setAttribute('dir', (lang === 'en') ? 'ltr' : 'rtl');
      var steps = ins.steps.map(function(s, i) {
        return '<div class="sew-step"><div class="sew-step-n">' + (i+1) + '</div><div class="sew-step-t">' + s + '</div></div>';
      }).join('');
      devBdEl.innerHTML =
        '<div class="sew-m-hero"><div class="sew-m-brand-logo" style="font-size:28px;line-height:64px">🔍</div><div class="sew-m-model">' + t.genericTitle + '</div><div class="sew-m-meta">' + t.genericMeta + '</div></div>' +
        '<div class="sew-slbl">' + ins.title + '</div><div class="sew-steps">' + steps + '</div>' +
        '<div class="sew-alt"><div class="sew-alt-t">' + ins.alt.t + '</div><div class="sew-alt-s">' + ins.alt.s + '</div></div>' +
        '<div class="sew-m-cta"><div class="sew-m-cta-s">' + t.ctaReadyGeneric + '</div><a class="sew-m-cta-btn" href="' + esc(cfg.ctaUrl) + '" target="_blank" rel="noopener">' + SIM_SVG + ' ' + esc(ctaText) + ' ←</a></div>';
      devMoEl.scrollTop = 0;
      openDevModal();
    }

    /* ── events ── */
    searchEl.addEventListener('input', function() {
      query = this.value;
      searchXEl.classList.toggle('on', query.length > 0);
      render();
    });
    searchXEl.addEventListener('click', function() { searchEl.value = ''; query = ''; searchXEl.classList.remove('on'); searchEl.focus(); render(); });

    brandsEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.sew-brand-btn');
      if (!btn) return;
      brand = btn.dataset.brand;
      [].forEach.call(brandsEl.querySelectorAll('.sew-brand-btn'), function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    });

    gridEl.addEventListener('click', function(e) {
      var card = e.target.closest('.sew-card');
      if (card) showDevice(card.dataset.brand, card.dataset.model);
    });

    [].forEach.call(d.querySelectorAll('.sew-chip[data-fb],.sew-chip[data-generic]'), function(c) {
      /* Only attach if inside our widget */
      var parentWidget = c.closest('#sew-w-' + uid);
      if (!parentWidget) return;
      c.addEventListener('click', function() {
        if (this.dataset.generic) { showGeneric(); return; }
        if (this.dataset.fb) {
          brand = this.dataset.fb;
          [].forEach.call(brandsEl.querySelectorAll('.sew-brand-btn'), function(b) { b.classList.remove('active'); });
          var targetBtn = brandsEl.querySelector('.sew-brand-btn[data-brand="' + brand + '"]');
          if (targetBtn) targetBtn.classList.add('active');
          render();
        }
      });
    });

    devClEl.addEventListener('click', closeDevModal);
    devOvEl.addEventListener('click', function(e) { if (e.target === devOvEl) closeDevModal(); });
    d.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDevModal(); });

    /* ── lang toggle ── */
    if (langTogEl) {
      langTogEl.addEventListener('click', function() {
        /* Flip language */
        cfg._lang = (lang === 'he') ? 'en' : 'he';
        rerenderWidget(cfg);
      });
    }

    render();
  }

  /* ================================================================
     SECTION 6b — RE-RENDER (for lang toggle)
     ================================================================ */
  function rerenderWidget(cfg) {
    var uid = cfg._uid;

    /* Close device modal if open */
    var devOvEl = d.getElementById('sew-dov');
    if (devOvEl && devOvEl.classList.contains('open')) {
      devOvEl.classList.remove('open');
      d.body.style.overflow = '';
    }

    /* Remove old device modal overlay */
    if (devOvEl) {
      devOvEl.parentNode.removeChild(devOvEl);
    }

    /* Re-build device modal with new lang dir */
    var lang = resolveLang(cfg);
    var tmp2 = d.createElement('div');
    tmp2.innerHTML = buildDeviceModalHTML(lang);
    d.body.appendChild(tmp2.firstChild);

    /* Find the widget host and re-render */
    var widgetEl = d.getElementById('sew-w-' + uid);
    if (!widgetEl) return;

    var host = widgetEl.parentNode;
    if (!host) return;

    /* Rebuild widget HTML in-place */
    host.innerHTML = buildWidgetHTML(cfg, uid);
    createInstance(cfg);
  }

  /* ================================================================
     SECTION 7 — MAIN init()
     ================================================================ */
  function init(userCfg) {
    var cfg = {
      mode:         'inline',
      container:    '#esim-checker',
      triggerBtn:   null,
      popupTitle:   null, /* resolved per-lang below */
      ctaUrl:       'https://simtlv.co.il',
      ctaText:      null, /* resolved per-lang below */
      supportUrl:   'https://wa.me/9720587775678?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%A2%D7%96%D7%A8%D7%94%20%D7%91%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%AA%D7%90%D7%99%D7%9E%D7%95%D7%AA%20eSIM',
      loadFont:     true,
      customDevices: [],
      lang:         'auto',
    };
    for (var k in userCfg) { if (userCfg.hasOwnProperty(k)) cfg[k] = userCfg[k]; }

    /* Track whether user explicitly set ctaText/popupTitle */
    cfg._ctaTextOverridden   = (userCfg && userCfg.ctaText   !== undefined);
    cfg._popupTitleOverridden = (userCfg && userCfg.popupTitle !== undefined);

    /* Build device DB: merge built-in + custom */
    var DB = BUILT_IN_DEVICES.slice();
    if (cfg.customDevices && cfg.customDevices.length) {
      cfg.customDevices.forEach(function(c) {
        var entry = {
          brand: c.brand || c.b,
          model: c.model || c.m,
          esim:  (c.esim !== undefined) ? !!c.esim : (c.e !== undefined ? !!c.e : true),
          year:  c.year  || c.y || new Date().getFullYear(),
        };
        var idx = -1;
        for (var i = 0; i < DB.length; i++) {
          if (DB[i].brand === entry.brand && DB[i].model === entry.model) { idx = i; break; }
        }
        if (idx > -1) { DB[idx] = entry; } else { DB.push(entry); }
      });
    }
    cfg._db  = DB;
    cfg._uid = Math.random().toString(36).slice(2, 8);

    /* Inject CSS once */
    if (!d.getElementById('sew-styles')) {
      var style = d.createElement('style');
      style.id = 'sew-styles';
      style.textContent = CSS;
      d.head.appendChild(style);
    }

    /* Load Heebo font */
    if (cfg.loadFont && !d.getElementById('sew-font')) {
      var link = d.createElement('link');
      link.id   = 'sew-font';
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap';
      d.head.appendChild(link);
    }

    /* Append device modal overlay to body */
    if (!d.getElementById('sew-dov')) {
      var lang = resolveLang(cfg);
      var tmp = d.createElement('div');
      tmp.innerHTML = buildDeviceModalHTML(lang);
      d.body.appendChild(tmp.firstChild);
    }

    /* ── INLINE MODE ── */
    if (cfg.mode === 'inline') {
      var host = d.querySelector(cfg.container);
      if (!host) { console.warn('[SimTLVeSIM] container not found: ' + cfg.container); return; }
      host.innerHTML = buildWidgetHTML(cfg, cfg._uid);
      createInstance(cfg);
    }

    /* ── POPUP MODE ── */
    if (cfg.mode === 'popup') {
      var popupOv = d.createElement('div');
      popupOv.className = 'sew-popup-overlay';
      popupOv.id = 'sew-popup-' + cfg._uid;
      popupOv.innerHTML =
        '<div class="sew-popup-box">' +
          '<div class="sew-popup-close">' +
            '<button class="sew-popup-close-btn" id="sew-pc-' + cfg._uid + '" aria-label="Close">✕</button>' +
          '</div>' +
          buildWidgetHTML(cfg, cfg._uid) +
        '</div>';
      d.body.appendChild(popupOv);

      function openPopup()  { popupOv.classList.add('open'); d.body.style.overflow = 'hidden'; }
      function closePopup() { popupOv.classList.remove('open'); d.body.style.overflow = ''; }

      var triggers = cfg.triggerBtn ? d.querySelectorAll(cfg.triggerBtn) : [];
      [].forEach.call(triggers, function(btn) {
        btn.addEventListener('click', openPopup);
      });

      popupOv.addEventListener('click', function(e) {
        if (e.target === popupOv && !d.getElementById('sew-dov').classList.contains('open')) closePopup();
      });
      d.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          if (d.getElementById('sew-dov').classList.contains('open')) return;
          closePopup();
        }
      });

      d.getElementById('sew-pc-' + cfg._uid).addEventListener('click', closePopup);

      createInstance(cfg);
    }
  }

  /* ================================================================
     SECTION 8 — EXPORT
     ================================================================ */
  w.SimTLVeSIM = { init: init };

})(window, document);
