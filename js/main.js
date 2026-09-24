/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'cartolibreria-barbara',    // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Scheda Google (24/9/2026): lun–ven 09:00–19:30 continuato, sabato 10–13 e 15–19, domenica chiuso. */
    hours: {
      0: [],
      1: [['09:00', '19:30']],
      2: [['09:00', '19:30']],
      3: [['09:00', '19:30']],
      4: [['09:00', '19:30']],
      5: [['09:00', '19:30']],
      6: [['10:00', '13:00'], ['15:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "intro.skip": "skip",
      "nav.home": "Cartolibreria Barbara, back to top",
      "nav.apri": "Open the menu",
      "marchio.s": "stationery · bookshop · since 2007",
      "nav.cancelleria": "Stationery",
      "nav.scuola": "School",
      "nav.libri": "Books",
      "nav.servizi": "Prints & stamps",
      "nav.dove": "Where & hours",
      "cta.chiama": "Call",
      "cta.chiama2": "Call 327 731 0490",
      "h.kicker": "Cartolibreria Barbara · Via Rucellai 12, Precotto, Milan",
      "h.w1": "Small,",
      "h.w2": "but it's all here.",
      "h.sub": "Customers write it, and the shelves confirm it: pens and notebooks, backpacks and books, gifts, photocopies, prints and stamps, in a shop where people know you by name. Since 2007, a step from the Precotto metro station.",
      "h.cta1": "Call Barbara",
      "h.cta2": "Open the compartments",
      "h.alt": "The aisle of the stationery shop with shelves full to the ceiling of notebooks, backpacks, pens and books",
      "h.ad1": "since 2007",
      "h.cap": "The aisle, full to the ceiling",
      "z.hint": "scroll: it opens ↓",
      "e.n1": "Compartment 1",
      "e.t1": "Stationery",
      "e.n2": "Compartment 2",
      "e.t2": "School",
      "e.n3": "Compartment 3",
      "e.t3": "Books",
      "e.n4": "Compartment 4",
      "e.t4": "Gifts and ideas",
      "e.n5": "Compartment 5",
      "e.t5": "Prints, stamps and shipping",
      "e.n6": "At the counter",
      "e.t6": "Who's here",
      "e.n7": "The reviews",
      "e.t7": "What people write",
      "e.n8": "Where and when",
      "e.t8": "Via Rucellai 12",
      "e.n9": "Last compartment",
      "e.t9": "Questions",
      "s1.h": "Pens, notebooks, planners: everyday stationery.",
      "s1.p": "What you need at home, at the office and at school, with the brands you see in the window: tintaUNITA, of which the shop is a retailer, and Pentel, which chose the shop as a Premium Shop. If something isn't here, it can be ordered.",
      "s1.l1": "Writing",
      "s1.l1d": "pens, pencils, highlighters, correctors, markers",
      "s1.l2": "Paper",
      "s1.l2d": "notebooks, pads, planners, diaries, calendars",
      "s1.l3": "Office",
      "s1.l3d": "envelopes, folders, filing, tapes and glues",
      "s1.l4": "Drawing",
      "s1.l4d": "technical and art drawing supplies, Pentel Arts",
      "s1.a1": "tintaUNITA highlighters lined up on the shelf",
      "s1.c1": "The tintaUNITA highlighters",
      "s1.a2": "The wall of pens, dozens of models in a row",
      "s1.c2": "The wall of pens",
      "s1.a3": "A yellow pen holder with a smiley face, full of markers",
      "s1.c3": "The pen holder that smiles",
      "s2.h": "Backpacks, pencil cases and diaries: school starts here.",
      "s2.p": "In September the shelves change face: Invicta and Seven backpacks, all-zip pencil cases, diaries, planners for students and teachers. With the school list in hand it goes faster, and what is missing gets ordered: it arrives in a couple of days.",
      "s2.l1": "Backpacks",
      "s2.l1d": "Invicta, Seven and the brands of the moment, wheeled ones too",
      "s2.l2": "Pencil cases",
      "s2.l2d": "all-zip, pouches, already filled or to fill",
      "s2.l3": "Diaries and planners",
      "s2.l3d": "for students, and the teacher's planner",
      "s2.l4": "The list",
      "s2.l4d": "notebooks, covers, labels, rulers: ticked off together at the counter",
      "s2.a1": "A blue Invicta backpack on the shop floor",
      "s2.c1": "Invicta",
      "s2.a2": "A Seven backpack with colourful graffiti",
      "s2.c2": "Seven",
      "s2.a3": "Colourful tintaUNITA «all zip» pencil cases on the shelf",
      "s2.c3": "The «all zip» pencil cases",
      "s2.a4": "A black Seven backpack with coloured sprays, in front of the book shelves",
      "s2.c4": "Seven, the other one",
      "s2.a5": "An iridescent backpack with a front pocket",
      "s2.c5": "The shiny one",
      "s2.a6": "A rainbow tie-dye backpack",
      "s2.c6": "The tie-dye one",
      "s3.h": "The «Libreria» corner, with the armchair.",
      "s3.p": "It is hand-painted in green above the shelves: Libreria. Fiction, school books and books for school, books for children and teenagers, including editions for inclusive teaching. You sit, you browse, and if a title isn't here it gets ordered.",
      "s3.l1": "Fiction",
      "s3.l1d": "new titles and the ones people ask for at the counter",
      "s3.l2": "School",
      "s3.l2d": "textbooks, holiday reading, the classics in editions for young readers",
      "s3.l3": "Children",
      "s3.l3d": "picture books, first books, Montessori activities, bilingual books",
      "s3.l4": "Inclusive teaching",
      "s3.l4d": "high-readability editions for those who struggle more",
      "s3.a1": "The Libreria corner of the shop with the book shelves and an armchair",
      "s3.c1": "The Libreria corner",
      "s3.a2": "The word Libreria painted in green above the shelves",
      "s3.c2": "The painted sign",
      "s3.a3": "Covers of the «I miti» series in an inclusive-teaching edition",
      "s3.c3": "The myths, inclusive edition",
      "s3.a4": "A pile of Montessori activity books",
      "s3.c4": "Montessori activities",
      "s3.a5": "A bilingual children’s book about animals",
      "s3.c5": "Bilingual, for the little ones",
      "s4.h": "A little gift, even at the last minute.",
      "s4.p": "Naj Oleari bags and wallets, Pokémon cards, the Calendario Filosofico, boxes, candles, bracelets: pretty and original things for a small present, especially for children and teenagers up to twelve, thirteen years old. And at the counter, ideas never run out.",
      "s4.l1": "For children",
      "s4.l1d": "games, cards, books, pencil cases: the gift for the party",
      "s4.l2": "For the home",
      "s4.l2d": "calendars, candles, planners, small objects",
      "s4.l3": "For those who write",
      "s4.l3d": "gift pens and notebooks, Naj Oleari bags and wallets",
      "s4.a1": "Naj Oleari bags with flowers and hearts in the window",
      "s4.c1": "The Naj Oleari bags",
      "s4.a2": "Boxes of Pokémon cards on the shelf",
      "s4.c2": "The Pokémon cards",
      "s4.a3": "The 2027 Calendario Filosofico displayed on the counter",
      "s4.c3": "The Calendario Filosofico",
      "s4.a4": "Gift boxes with gold dots and a pink ribbon",
      "s4.c4": "Boxes for gifts",
      "s4.a5": "Filo Magico bracelets hanging on little cards",
      "s4.c5": "The Filo Magico bracelets",
      "s5.h": "Copies, prints, scans, fax, stamps.",
      "s5.p": "It is written on the sign and it is done at the counter: black-and-white and colour copies, digital prints even from a file sent by email, scans, fax to Italy and abroad, stamps and plaques. And the shipping label to print for the parcel you need to send back.",
      "s5.l1": "Copies",
      "s5.l1d": "in black and white and in colour",
      "s5.l2": "Digital prints",
      "s5.l2d": "from a USB stick or a file sent by email",
      "s5.l3": "Scans and fax",
      "s5.l3d": "fax to Italy and abroad",
      "s5.l4": "Stamps and plaques",
      "s5.l4d": "made to order, with the text you bring",
      "s5.l5": "Shipping labels",
      "s5.l5d": "printed on the spot for returns and parcels",
      "s5.a1": "The purple Cartolibreria sign with the strip of services: black-and-white and colour copies, digital prints, scans, fax to Italy and abroad, stamps",
      "s5.c1": "The sign, with the strip of services",
      "s5.a2": "The entrance of the shop with the full window and the social media stickers on the door",
      "s5.c2": "The entrance, Via Rucellai 12",
      "b.h": "I'm Barbara.",
      "b.p": "That is how she introduces herself on Instagram, and that is how she welcomes whoever comes in: since 2007, on Via Rucellai, with the people who work with her at the counter. A women-owned shop that replies to every review, in Italian and in English, with a thank-you and a smile.",
      "b.d1": "reviews out of 109 with a reply",
      "b.d2": "the year it opened, on Via Rucellai",
      "b.d3": "Instagram posts, almost one a day",
      "b.a1": "The other aisle of the shop, towards the entrance, with the shelves of notebooks and pencil cases",
      "b.c1": "Towards the entrance",
      "b.a2": "The shop window with the decorations and the toys",
      "b.c2": "The window",
      "b.a3": "The shelves of books and notebooks",
      "b.c3": "The shelves",
      "v.h": "Counted one by one.",
      "v.badge": "from 108 Google reviews",
      "v.t1": "talk about kindness, helpfulness, a warm welcome",
      "v.t2": "say it is well stocked, that it's all here",
      "v.t3": "mention Barbara by name",
      "v.t4": "talk about the books",
      "v.t5": "start with «small, but…»",
      "v.t6": "call it the neighbourhood's point of reference",
      "v.t7": "say thank you for the advice",
      "v.t8": "talk about the gift ideas",
      "v.nota": "Words counted in the 108 Google reviews that have a text, on 24 September 2026.",
      "v.cit": "«Small but well stocked, and almost always open on Saturday afternoon too»",
      "v.citda": "From a Google review (translated)",
      "v.btn": "Read all the reviews on Google",
      "d.h": "A step from the Precotto metro station.",
      "d.p": "At Via Bernardo Rucellai 12, between Viale Monza and the Precotto station on the red line. You come in, you ask, and if you're short of time you phone first.",
      "d.no1": "<b>Saturday</b> with a break: 10–1 and 3–7 pm.",
      "d.no2": "<b>Sunday</b> closed.",
      "d.no3": "<b>If you're in a hurry</b>, phone before coming.",
      "d.no4": "<b>In-store pickup</b> and home delivery, on request.",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "d.strada": "Take me there with Google Maps",
      "d.mappa": "Map: Cartolibreria Barbara, Via Bernardo Rucellai 12, Milan",
      "d.alt": "The entrance of the shop in the evening, with the window lit up",
      "d.cap": "In the evening, with the window lit",
      "do.h": "What we are asked.",
      "qa.1": "What are your hours?",
      "ra.1": "Monday to Friday from 9 am to 7.30 pm, no lunch break; Saturday from 10 to 1 and from 3 to 7 pm. Closed on Sunday. If you are in a hurry, phone first: 327 731 0490.",
      "qa.2": "Do you do photocopies and prints?",
      "ra.2": "Yes: black-and-white and colour copies, digital prints even from a file sent by email, scans and fax to Italy and abroad. Also the shipping label to print for a return.",
      "qa.3": "Do you have school books?",
      "ra.3": "Yes: school books and fiction, books for children and teenagers, including inclusive-teaching editions. What isn't here gets ordered and arrives in a couple of days.",
      "qa.4": "Do you make stamps and plaques?",
      "ra.4": "Yes, stamps and plaques to order: you come in with the text and we agree on the pickup.",
      "qa.5": "If an item isn't in stock, can you order it?",
      "ra.5": "Yes: what is missing gets ordered and usually arrives in a couple of days.",
      "qa.6": "Do you deliver?",
      "ra.6": "The Google listing shows in-store pickup and home delivery: a phone call is enough to arrange it.",
      "piede.s": "stationery · bookshop · Milan, Precotto · since 2007",
      "piede.d": "Cartoleria Vono Barbara · Via Bernardo Rucellai 12, 20126 Milan · <a href='tel:+393277310490'>327 731 0490</a> · <a href='tel:+390239664434'>02 3966 4434</a>",
      "piede.b": "Demo website made by <a href='https://bespokestud.io' target='_blank' rel='noopener'>Bespoke Studio</a> · texts, hours and services from the business's public sources; photographs published by the business on Google and Instagram.",
      "b.chiama": "Call",
      "b.scomparti": "Inside",
      "b.orari": "Hours",
      "b.mappa": "Map",
      "lb.chiudi": "Close",
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ═══ FIRMA · Cartolibreria Barbara — «Piccola, ma c'è tutto.» ═══
     Il sito è un astuccio: in apertura è chiuso, con la cerniera; scorrendo la zip si apre
     (il cursore corre lungo i denti, i due lembi si scostano a V e poi vanno via) e dentro
     c'è tutto. Le etichette degli scomparti si «attaccano», i numeri salgono al valore.
     Regole: gsap.set + gsap.to / ScrollTrigger.create; nessun elemento-firma è un .reveal;
     senza GSAP o con motion ridotto la zip non c'è e la pagina è aperta. */

  var zip = document.getElementById('zip');
  var zipA = document.getElementById('zipA'), zipB = document.getElementById('zipB');
  var zipTop = document.getElementById('zipTop'), zipBottom = document.getElementById('zipBottom'), zipClosed = document.getElementById('zipClosed');
  var zipFT = document.getElementById('zipFondoTop'), zipFB = document.getElementById('zipFondoBottom'), zipFC = document.getElementById('zipFondoClosed');
  var zipCursore = document.getElementById('zipCursore'), zipHint = document.getElementById('zipHint'), zipNome = document.getElementById('zipNome');
  var astuccio = document.querySelector('.astuccio');
  var zipViva = hasGsap && hasST && !reducedMotion && zip && astuccio;

  function setZip(p) {
    if (!zip) return;
    p = Math.max(0, Math.min(1, p));
    var s = Math.min(1, p / 0.6);                 // fase 1: il cursore corre, la V si apre
    var t = Math.max(0, (p - 0.6) / 0.4);         // fase 2: i lembi vanno via
    var sx = s * 100, g = 40 * s;
    zipA.style.clipPath = 'polygon(0 0,100% 0,100% 50%,' + sx.toFixed(2) + '% 50%,0 ' + (50 - g).toFixed(2) + '%)';
    zipB.style.clipPath = 'polygon(0 100%,100% 100%,100% 50%,' + sx.toFixed(2) + '% 50%,0 ' + (50 + g).toFixed(2) + '%)';
    zipA.style.transform = 'translateY(' + (-t * 112).toFixed(2) + '%)';
    zipB.style.transform = 'translateY(' + (t * 112).toFixed(2) + '%)';
    var dTop = 'M0 ' + (50 - g).toFixed(2) + ' L' + sx.toFixed(2) + ' 50';
    var dBot = 'M0 ' + (50 + g).toFixed(2) + ' L' + sx.toFixed(2) + ' 50';
    var dCl = 'M' + sx.toFixed(2) + ' 50 L100 50';
    zipTop.setAttribute('d', dTop); zipFT.setAttribute('d', dTop);
    zipBottom.setAttribute('d', dBot); zipFB.setAttribute('d', dBot);
    zipClosed.setAttribute('d', dCl); zipFC.setAttribute('d', dCl);
    var op = (1 - t).toFixed(2);
    zipTop.style.opacity = op; zipBottom.style.opacity = op; zipClosed.style.opacity = op;
    zipFT.style.opacity = op; zipFB.style.opacity = op; zipFC.style.opacity = op;
    zipCursore.style.left = (sx + t * 30).toFixed(2) + '%';
    zipCursore.style.opacity = op;
    if (zipHint) zipHint.style.opacity = (1 - Math.min(1, p / 0.25)).toFixed(2);
    if (zipNome) zipNome.style.opacity = (1 - Math.min(1, p / 0.5)).toFixed(2);
    zip.style.visibility = p >= 0.999 ? 'hidden' : 'visible';
    zip.setAttribute('data-p', p.toFixed(2));
  }
  if (zip && !zipViva) zip.style.display = 'none';   // senza GSAP o con motion ridotto: pagina aperta, subito
  if (zipViva) setZip(0);

  /* — i numeri che salgono — */
  var numeri = Array.prototype.slice.call(document.querySelectorAll('[data-n]'));
  function setNum(el, frac) { el.textContent = Math.round((+el.getAttribute('data-n') || 0) * frac); }
  numeri.forEach(function (el) { setNum(el, 1); });   // stato finale subito: i numeri sono veri anche senza GSAP

  /* entrata: chiamata dal plumbing a fine intro. Con la zip chiusa, il cursore fa un cenno. */
  window.bespokeHeroEntrance = function () {
    if (!hasGsap || reducedMotion) return;
    if (zipViva && zipCursore) gsap.fromTo(zipCursore, { x: 0 }, { x: 10, duration: 0.35, yoyo: true, repeat: 3, ease: 'power1.inOut' });
    if (zipHint) gsap.from(zipHint, { opacity: 0, y: 8, duration: 0.6, delay: 0.3 });
  };

  if (zipViva) {
    ScrollTrigger.create({
      trigger: astuccio, start: 'top top', end: 'bottom bottom', scrub: 0.4,
      onUpdate: function (self) { setZip(self.progress); }
    });
  }
  if (hasGsap && hasST && !reducedMotion) {
    /* le etichette degli scomparti si attaccano */
    gsap.utils.toArray('.etichetta').forEach(function (el) {
      gsap.set(el, { opacity: 0, scale: 1.12, rotation: 3, transformOrigin: '50% 50%' });
      gsap.to(el, { opacity: 1, scale: 1, rotation: -2, duration: 0.55, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    /* gli adesivi dell'apertura, dopo che la zip si è aperta */
    gsap.utils.toArray('.adesivo').forEach(function (el, i) {
      gsap.set(el, { opacity: 0, scale: 1.3 });
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)', delay: i * 0.15, scrollTrigger: { trigger: astuccio, start: '70% bottom', once: true } });
    });
    /* i numeri salgono quando entrano */
    numeri.forEach(function (el, i) {
      setNum(el, 0);
      var proxy = { f: 0 };
      gsap.to(proxy, { f: 1, duration: 1.2, ease: 'power2.out', delay: (i % 8) * 0.07, onUpdate: function () { setNum(el, proxy.f); }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }
})();
