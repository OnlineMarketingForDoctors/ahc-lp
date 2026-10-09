/* Hair transplant in Greece · page interactions (built on the homepage script) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const A = '/assets';

  /* ---------- Load sequence ---------- */
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));

  /* ---------- Header, back to top, mobile menu ---------- */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > innerHeight * 0.9);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const menuBtn = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* ---------- Hero: flight time from the visitor's city ---------- */
  // Typical direct flight times to Athens, rounded. Shown as "about".
  const flights = {
    london: ['LHR', '3 h 40 min'], manchester: ['MAN', '3 h 55 min'], dublin: ['DUB', '4 h'],
    paris: ['CDG', '3 h 15 min'], amsterdam: ['AMS', '3 h 20 min'], frankfurt: ['FRA', '2 h 50 min'],
    zurich: ['ZRH', '2 h 30 min'], stockholm: ['ARN', '3 h 35 min'], dubai: ['DXB', '4 h 40 min'],
    newyork: ['JFK', '9 h 50 min'], toronto: ['YYZ', '10 h'],
  };
  const fCity = $('#flight-city');
  const fRoute = $('.flight-route');
  // The arc SVG stretches to the card, so the plane's path is rebuilt from the
  // arc's rendered box using the same curve as the SVG (viewBox 200 x 50).
  const fTrack = $('.fr-track');
  const fPlane = $('.fr-plane');
  const fitPlanePath = () => {
    const { width: w, height: h } = fTrack.getBoundingClientRect();
    const x = (v) => (v / 200 * w).toFixed(1);
    const y = (v) => (v / 50 * h).toFixed(1);
    fPlane.style.offsetPath = `path("M${x(4)} ${y(46)} Q${x(100)} ${y(-14)} ${x(196)} ${y(46)}")`;
  };
  fitPlanePath();
  addEventListener('resize', fitPlanePath);
  const setFlight = () => {
    const [code, time] = flights[fCity.value];
    $('#flight-code').textContent = code;
    $('#flight-time').textContent = time;
    if (reduceMotion) return;
    fRoute.classList.remove('is-flying');
    void fRoute.offsetWidth; // restart the animation
    fRoute.classList.add('is-flying');
  };
  // Start from the visitor's own time zone where it matches a listed city.
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  const byZone = { 'Europe/London': 'london', 'Europe/Dublin': 'dublin', 'Europe/Paris': 'paris', 'Europe/Amsterdam': 'amsterdam',
    'Europe/Berlin': 'frankfurt', 'Europe/Zurich': 'zurich', 'Europe/Stockholm': 'stockholm', 'Asia/Dubai': 'dubai',
    'America/New_York': 'newyork', 'America/Toronto': 'toronto' };
  if (byZone[tz]) fCity.value = byZone[tz];
  fCity.addEventListener('change', setFlight);
  setFlight();
  if (!reduceMotion) { fRoute.classList.remove('is-flying'); setTimeout(() => fRoute.classList.add('is-flying'), 1900); }

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      countIO.unobserve(target);
      const end = +target.dataset.count;
      if (reduceMotion) return;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 1600);
        target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-GB');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((c) => countIO.observe(c));

  /* ---------- Reviews ---------- */
  // Ordered: reviews naming Dr Vekris and describing the experience first.
  const reviews = [
    { n: 'Kon Kal', c: '#4A4E9C', t: 'The Best Hair Clinic that you can find out there. Professional and highly experienced staff made me feel as comfortable as possible, by answering all of my questions from our first appointment. I had a 2 day hair implantation, the procedure was smooth and the doctors were excellent. I now know why people from all over the world prefer Mr. Vekris. If you want to look as you imagine, this is the place.' },
    { n: 'Stelios Galanis', c: '#3B2A5C', t: 'I had my session 6 months ago and my result so far is absolutely amazing. I highly recommend the Clinic, Dr Vekris, Ms Agiant and the whole medical team. Thank you, you have changed my life!!' },
    { n: 'Zlatko Kljajic', c: '#5B6B7A', t: 'If you are looking for best clinic to do hair transplant, you do not need to waist your time exploring to whom you will give your trust. All protocols and methods for doing hair transplant in this clinic are on highest standard. Staff is very professional and they will explain you everything in details. The most important that results of hair transplants are really natural with no complication at all.' },
    { n: 'Jad', c: '#6A5ACD', t: 'I had my hair surgery a couple of days ago, and I must say, everything was perfect from start to finish. It was truly a 7-star experience. A huge thanks to Klodiana for her professionalism and to Dr. Alexandrios for his attention and care throughout the surgery.' },
    { n: 'Paulos Papamichail', c: '#2E7D6B', t: 'Great job in Advanced Hair Clinics. Dr Vekris and the rest of the medical team are highly specialised and experienced. I had a two days session with great results in 12 months.' },
    { n: 'O V', c: '#C2185B', t: 'One can only recommend the clinics of Dr Anastasios Vekris, a highly professional team with high quality equipment in very secure environment. The right advise and perfect results. This is what I personally experienced and would recommend the team with no hesitation.' },
    { n: 'Stefan Prikulovic', c: '#C0502B', t: 'Excellent experience with Advanced Hair Clinics. I chose the clinic because of my trust in Dr. Dimitris Alexandris and my expectations were fully met. Special thanks to Klodiana and Dr. Chorianopoulou for their professionalism, kindness, and support throughout the process. Highly recommended!' },
    { n: 'Theodoros Thodas', c: '#1E88A8', t: 'I recently visited Advanced Hair Clinics, and I am truly impressed with the level of professionalism and expertise they demonstrated. From the initial consultation to the procedure itself, the team was incredibly attentive, knowledgeable, and thorough in addressing all my questions and concerns. What sets Advanced Hair Clinics apart is their personalized approach. They tailored a treatment plan specifically to my needs, ensuring optimal results. The procedure was virtually painless, and the aftercare instructions were detailed and easy to follow.' },
    { n: 'Apostolos Modas', c: '#7B5E3B', t: 'It is the second time I do a hair transplant with Advanced Hair Clinics. Both times everything was exceptional! High professionalism, personalized support/care, and excellent and natural result. Many thanks to everyone involved in my operation; namely Lilly, Alberta and Iro. Highly recommended.' },
    { n: 'George Tsichlis', c: '#512DA8', t: 'I had my hair transplant three days ago, and the entire experience went smoothly with no pain or discomfort. Dr. Dimitris and his team were highly professional, and they made the time pass quickly in a relaxed and comfortable atmosphere. I had a great experience during the procedure. I would highly recommend them!' },
    { n: 'Marios Bompoulos', c: '#E67E22', t: 'Amazing experience. I performed hair transplant with excellent results. Extremely helpful and friendly staff. The whole processes was seamless. I highly recommend them to anyone who is looking for a hair transplant.' },
    { n: 'Eleni Theodorakopoulou', c: '#1565C0', t: 'Congratulations to the whole team of Advanced Hair Clinics. I solved my hairloss problem combining the unshaved FUE technique and conservative treatment of minoxidil and prp. My hair is now falling less and is thicker and more strong. Many thanks to Dr Anastasios Vekris and Dr Antonia Andriopoulou!' },
  ];
  const gSmall = '<svg class="g-logo" viewBox="0 0 48 48" aria-label="Google review"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const track = $('#reviews-track');
  track.innerHTML = reviews.map((r) => `
    <li class="review">
      <div class="review-top">
        <span class="avatar" style="background:${r.c}" aria-hidden="true">${esc(r.n[0])}</span>
        <div><p class="review-name">${esc(r.n)}</p><p class="review-meta"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span></p></div>
        ${gSmall}
      </div>
      <p class="review-text is-clamped">${esc(r.t).replace(/Vekris/g, '<mark>Vekris</mark>')}</p>
    </li>`).join('');
  $$('.review-text', track).forEach((p) => {
    if (p.scrollHeight <= p.clientHeight + 2) return;
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'review-more';
    more.textContent = 'Read more';
    more.setAttribute('aria-expanded', 'false');
    more.addEventListener('click', () => {
      const open = p.classList.toggle('is-clamped') === false;
      more.textContent = open ? 'Show less' : 'Read more';
      more.setAttribute('aria-expanded', open);
    });
    p.after(more);
  });
  if (!reduceMotion) {
    $$('.review', track).forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.inert = true;
      track.appendChild(c);
    });
    const setSpeed = () => track.style.setProperty('--ticker-dur', `${Math.round(track.scrollWidth / 2 / 45)}s`);
    setSpeed();
    addEventListener('resize', setSpeed);
    track.classList.add('is-ticking');
    const vp = $('.reviews-viewport');
    vp.addEventListener('touchstart', () => vp.classList.add('is-paused'), { passive: true });
    vp.addEventListener('touchend', () => setTimeout(() => vp.classList.remove('is-paused'), 2500));
  }

  /* ---------- Why Dr Vekris (tabs with video) ---------- */
  const why = [
    { t: 'A surgeon other surgeons learn from', media: 'timelapse',
      p: ['Dr Anastasios Vekris is President of the FUE Europe Society and an invited trainer at the world’s leading hair restoration congresses. Every year, doctors and nurses from around the world come to Advanced Hair Clinics in Athens to learn his techniques.',
        'He is the only doctor to have performed hair transplant surgery in 17 countries, and he openly presents the results of his clinic to the most demanding scientific audiences, including the ISHRS World Congress.'] },
    { t: 'Exclusively by doctors, from start to finish', media: 'timelapse',
      p: ['At Advanced Hair Clinics a hair transplant is treated as what it is: a medical procedure. Local anaesthesia, extraction and implantation are performed only by doctors, never delegated to technicians.',
        'Every doctor on the team was trained by Dr Vekris and works to the planning and hairline standards he created, so the same care goes into every graft whichever package you choose.'] },
    { t: 'Direct implantation with the Sharp Implanter', media: 'sharp-implanter',
      p: ['Grafts are placed in one step with the Sharp Implanter, without first opening holes in the recipient area. Its tip is less than 1 mm wide, for precise placement at the angle and direction of your natural hair growth.'],
      l: ['Less trauma to the scalp and a lower chance of swelling after the procedure', 'Grafts are handled gently, which supports their survival and growth', 'Natural density, with single-hair grafts along the hairline'] },
    { t: 'Unshaven and Long Hair FUE for discretion', media: 'unshaven-fue',
      p: ['If you would rather nobody knew, ask about Unshaven FUE. Only the donor area is trimmed and grafts are placed between your existing hairs, so most patients go back to work and social life within 24 to 48 hours.',
        'Our teams are also among the very few in Greece who perform Long Hair FUE, where the hair is not cut at all, whatever its length.'] },
    { t: 'Hairline design that suits your face', media: 'hairline-distance',
      p: ['The hairline is what makes a transplant look natural or obvious. Our doctors design it around the shape of your face, your age, gender and ethnicity, the quality of your hair and how your hair loss is likely to progress.'],
      l: ['An irregular, “asymmetrically symmetrical” front line, as in nature', 'Single-hair grafts at the front, denser grafts behind for volume', 'Planned for how you will look in 10 and 20 years, not just next year'] },
    { t: 'Planning supported by artificial intelligence', media: 'ai-planning',
      p: ['Your plan combines the doctor’s experience with AI planning software, so you can see how your transplanted hair is expected to grow and how your donor area is used.'],
      l: ['Better use of every available graft', 'A donor area preserved for any future needs', 'A clear picture of the result before you travel'] },
    { t: 'Experience with every hair type', media: 'afro-fue',
      p: ['Dr Vekris teaches Afro Hair FUE at international workshops and has in-depth knowledge of how hairline shape and hair quality differ between ethnic backgrounds. Patients with curly, Afro-textured or very fine hair travel to Athens for this expertise.'] },
    { t: 'Care that continues after you fly home', media: 'aftercare',
      p: ['Our surgeons, nurses and coordinators stay in touch for 12 months by video, phone and WhatsApp, checking that your new hair grows as expected and that you follow the conservative treatment that protects your result.',
        'Patients who trust us become “our people”, and know they can reach us at any time with any question.'] },
  ];
  const WHY_DUR = 9000;
  const tabs = $('#why-tabs');
  const media = $('#why-media');
  const panel = $('#why-panel');
  document.documentElement.style.setProperty('--why-dur', `${WHY_DUR / 1000}s`);
  tabs.innerHTML = why.map((w, i) => `<button type="button" role="tab" id="why-t${i}" aria-controls="why-panel" aria-selected="${i === 0}" data-i="${i}"><span class="bar" aria-hidden="true"></span>${w.t}</button>`).join('');
  // One video element per clip, shared by tabs that use the same clip.
  const clips = [...new Set(why.map((w) => w.media))];
  media.innerHTML = clips.map((v) => `<video muted loop playsinline preload="none" poster="${A}/video/${v}-poster.webp" aria-hidden="true" data-clip="${v}"><source src="${A}/video/${v}.mp4" type="video/mp4"></video>`).join('');
  const mediaEls = [...media.children];
  let wIdx = 0, wTimer, wStart = 0, wRemain = WHY_DUR, whyVisible = false, wExpanded = false, wHover = false;
  const schedule = (ms) => {
    clearTimeout(wTimer);
    if (reduceMotion || !whyVisible) return;
    wStart = performance.now();
    wRemain = ms;
    wTimer = setTimeout(() => showWhy((wIdx + 1) % why.length), ms);
  };
  const hold = () => {
    if (tabs.classList.contains('is-held')) return;
    clearTimeout(wTimer);
    wRemain = Math.max(800, wRemain - (performance.now() - wStart));
    tabs.classList.add('is-held');
  };
  const release = () => {
    if (wExpanded || wHover || !tabs.classList.contains('is-held')) return;
    tabs.classList.remove('is-held');
    schedule(wRemain);
  };
  const showWhy = (i, user) => {
    wIdx = i;
    wExpanded = false;
    const w = why[i];
    $$('button', tabs).forEach((b) => b.setAttribute('aria-selected', b.dataset.i == i));
    mediaEls.forEach((el) => {
      const on = el.dataset.clip === w.media;
      el.classList.toggle('is-active', on);
      if (on && whyVisible && !reduceMotion) { el.preload = 'auto'; el.play().catch(() => {}); } else if (!on) el.pause();
    });
    panel.setAttribute('aria-labelledby', `why-t${i}`);
    panel.classList.add('is-swapping');
    setTimeout(() => {
      const [first, ...rest] = w.p;
      const extra = rest.map((x) => `<p>${x}</p>`).join('') + (w.l ? `<ul>${w.l.map((x) => `<li>${x}</li>`).join('')}</ul>` : '');
      panel.innerHTML = `<h3>${w.t}</h3><p>${first}</p>`
        + (extra ? `<div class="why-more" id="why-more" hidden>${extra}</div><button type="button" class="why-toggle" aria-expanded="false" aria-controls="why-more">Read more</button>` : '');
      panel.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 200);
    if (user && innerWidth <= 1120) $$('button', tabs)[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    tabs.classList.remove('is-held');
    schedule(WHY_DUR);
    if (wHover) hold();
  };
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.why-toggle');
    if (!btn) return;
    const more = $('#why-more', panel);
    wExpanded = more.hidden;
    more.hidden = !wExpanded;
    btn.textContent = wExpanded ? 'Show less' : 'Read more';
    btn.setAttribute('aria-expanded', wExpanded);
    if (wExpanded) hold(); else release();
  });
  const whyStage = $('.why-stage');
  whyStage.addEventListener('mouseenter', () => { wHover = true; hold(); });
  whyStage.addEventListener('mouseleave', () => { wHover = false; release(); });
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showWhy(+b.dataset.i, true); });
  tabs.addEventListener('keydown', (e) => {
    const vertical = innerWidth > 1120;
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key !== next && e.key !== prev) return;
    e.preventDefault();
    const i = (wIdx + (e.key === next ? 1 : -1) + why.length) % why.length;
    showWhy(i, true);
    $$('button', tabs)[i].focus();
  });
  new IntersectionObserver(([en]) => {
    whyVisible = en.isIntersecting;
    if (whyVisible) { showWhy(wIdx); return; }
    clearTimeout(wTimer);
    mediaEls.forEach((el) => el.pause());
  }, { threshold: 0.35 }).observe(whyStage);
  showWhy(0);

  /* ---------- Why on phones: the same content as an accordion ---------- */
  const whyAcc = document.createElement('div');
  whyAcc.className = 'why-acc';
  whyAcc.innerHTML = why.map((w, i) => `<details${i === 0 ? ' open' : ''}><summary>${w.t}</summary><div class="wa-body">
    <video muted loop playsinline preload="none" poster="${A}/video/${w.media}-poster.webp" aria-hidden="true"><source src="${A}/video/${w.media}.mp4" type="video/mp4"></video>
    ${w.p.map((x) => `<p>${x}</p>`).join('')}${w.l ? `<ul>${w.l.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}</div></details>`).join('');
  $('.why-body').after(whyAcc);
  const accItems = $$('details', whyAcc);
  let accVisible = false;
  const accPlay = () => accItems.forEach((d) => {
    const v = $('video', d);
    if (d.open && accVisible && !reduceMotion) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  });
  accItems.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) {
      accItems.forEach((o) => { if (o !== d) o.open = false; });
      // Bring the opened item's heading into view if closing the one above moved it off screen
      const top = d.getBoundingClientRect().top;
      if (top < 80) scrollTo({ top: scrollY + top - 90, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    accPlay();
  }));
  new IntersectionObserver(([en]) => { accVisible = en.isIntersecting; accPlay(); }, { threshold: 0.2 }).observe(whyAcc);

  /* ---------- Packages: preselect the package in the form ---------- */
  $$('[data-package]').forEach((a) => a.addEventListener('click', () => {
    const r = $(`input[name="package"][value="${a.dataset.package}"]`);
    if (r) r.checked = true;
  }));

  /* ---------- Before & after gallery (hair transplant only) ---------- */
  // Cases, grafts, hairs and months are from the clinic's results page:
  // advancedhairclinics.gr/en/hair-transplant-results-before-after
  const cases = [
    { f: 'hair-transplant-128-a', g: '4,267', h: '8,446', m: 15 },
    { f: 'unshaven-fue-006', g: '1,656', h: '3,477', m: 12, label: 'Unshaven FUE hair transplant' },
    { f: 'hair-transplant-126-e', g: '2,318', h: '4,103', m: 12 },
    { f: 'hair-transplant-125-a', g: '2,304', h: '4,879', m: 12 },
    { f: 'hair-transplant-124-a', g: '2,288', h: '4,983', m: 12 },
    { f: 'hair-transplant-123', g: '2,543', h: '7,061', m: 6 },
    { f: 'hair-transplant-122-a', g: '4,484', h: '8,396', m: 6 },
    { f: 'hair-transplant-121-a', g: '2,278', h: '4,785', m: 12 },
    { f: 'hair-transplant-120', g: '1,831', h: '4,487', m: 12 },
    { f: 'hair-transplant-119', g: '1,029', h: '2,543', m: 3 },
    { f: 'hair-transplant-118', g: '4,407', h: '9,300', m: 12 },
  ];
  const thumbs = $('#ba-thumbs');
  const baMain = $('#ba-main');
  const label = (c) => c.label || 'FUE hair transplant';
  thumbs.innerHTML = cases.map((c, i) => `
    <li><button type="button" aria-pressed="${i === 0}" data-i="${i}" aria-label="Show ${label(c)}, ${c.g} grafts">
      <img src="${A}/img/ba/${c.f}.webp" alt="" loading="lazy" width="800" height="500"><span class="t-label">${c.g} grafts</span>
    </button></li>`).join('');
  let baCur = 0;
  const showCase = (i, fromThumb) => {
    baCur = (i + cases.length) % cases.length;
    const c = cases[baCur];
    const btns = $$('button', thumbs);
    btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.i == baCur));
    // Keep the active thumbnail in view inside the scrolling panel without moving the page
    if (!fromThumb) {
      // The panel scrolls down on desktop and sideways on smaller screens
      const t = btns[baCur].parentElement;
      const wrap = thumbs.parentElement;
      const sideways = wrap.scrollWidth > wrap.clientWidth;
      const [pos, size, view, scroll] = sideways
        ? [t.offsetLeft, t.offsetWidth, wrap.clientWidth, wrap.scrollLeft]
        : [t.offsetTop, t.offsetHeight, wrap.clientHeight, wrap.scrollTop];
      if (pos < scroll || pos + size > scroll + view) {
        wrap.scrollTo({ [sideways ? 'left' : 'top']: pos - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
    baMain.classList.add('is-swapping');
    setTimeout(() => {
      baMain.src = `${A}/img/ba/${c.f}.webp`;
      baMain.alt = `Before and after an ${label(c)} with ${c.g} grafts. Open full screen`;
      $('#ba-type').textContent = label(c);
      $('#ba-grafts').textContent = c.g;
      $('#ba-hairs').textContent = c.h;
      $('#ba-months').textContent = `${c.m} months`;
      $('#ba-count').textContent = `${baCur + 1} / ${cases.length}`;
      const done = () => baMain.classList.remove('is-swapping');
      (baMain.decode ? baMain.decode() : Promise.resolve()).then(done, done);
    }, reduceMotion ? 0 : 260);
  };
  thumbs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showCase(+b.dataset.i, true); });
  $$('.ba-step').forEach((b) => b.addEventListener('click', () => showCase(baCur + +b.dataset.step)));
  // Swipe on the main photo on touch screens
  let tx = null;
  baMain.parentElement.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  baMain.parentElement.addEventListener('touchend', (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) showCase(baCur + (dx < 0 ? 1 : -1));
    tx = null;
  });
  showCase(0, true);

  /* ---------- Lightbox: the main before and after photo opens full screen ---------- */
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Before and after photo');
  lb.innerHTML = `
    <div class="lb-top"><span class="lb-count" id="lb-count"></span>
      <button type="button" class="lb-btn lb-close" aria-label="Close">${icon('M6 6l12 12M18 6L6 18')}</button></div>
    <div class="lb-stage">
      <button type="button" class="lb-btn" data-step="-1" aria-label="Previous case">${icon('M15 6l-6 6 6 6')}</button>
      <img id="lb-img" alt="">
      <button type="button" class="lb-btn" data-step="1" aria-label="Next case">${icon('M9 6l6 6-6 6')}</button>
    </div>
    <p class="lb-cap" id="lb-cap"></p>`;
  document.body.appendChild(lb);
  const lbImg = $('#lb-img', lb);
  let lbReturn = null;
  const lbRender = () => {
    const c = cases[baCur];
    lbImg.classList.add('is-swapping');
    lbImg.onload = () => lbImg.classList.remove('is-swapping');
    lbImg.src = `${A}/img/ba/${c.f}.webp`;
    lbImg.alt = `Before and after an ${label(c)} with ${c.g} grafts`;
    $('#lb-count', lb).textContent = `${baCur + 1} / ${cases.length}`;
    $('#lb-cap', lb).innerHTML = `<strong>${label(c)}</strong><span>Grafts<b>${c.g}</b></span><span>Hairs<b>${c.h}</b></span><span>Post-procedure<b>${c.m} months</b></span>`;
  };
  // Stepping in the lightbox moves the gallery behind it too
  const lbStep = (d) => { showCase(baCur + d); lbRender(); };
  const lbOpen = () => {
    lbReturn = document.activeElement;
    lbRender();
    lb.hidden = false;
    document.body.classList.add('lb-open');
    $('.lb-close', lb).focus();
  };
  const lbClose = () => {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    if (lbReturn) lbReturn.focus();
  };
  baMain.addEventListener('click', lbOpen);
  baMain.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(); } });
  lb.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && b.dataset.step) return lbStep(+b.dataset.step);
    if (b && b.classList.contains('lb-close')) return lbClose();
    if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose(); // tap outside the photo
  });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('button', lb);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  let lbX = null;
  lbImg.addEventListener('touchstart', (e) => { lbX = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener('touchend', (e) => {
    if (lbX === null) return;
    const dx = e.changedTouches[0].clientX - lbX;
    if (Math.abs(dx) > 40) lbStep(dx < 0 ? 1 : -1);
    lbX = null;
  });

  /* ---------- Meet Dr Vekris: Read more ---------- */
  const meetBtn = $('.meet-toggle');
  meetBtn.addEventListener('click', () => {
    const more = $('#meet-more');
    more.hidden = !more.hidden;
    meetBtn.textContent = more.hidden ? 'Read more' : 'Show less';
    meetBtn.setAttribute('aria-expanded', !more.hidden);
    setupJourney();
  });

  /* ---------- Video testimonials ---------- */
  const vids = [
    { id: 'GztrgiQqlYM', img: 'real-results', name: 'Real results: hair transplant at Advanced Hair Clinics', t: 'FUE Hair Transplant', g: '3,850', h: '8,565', d: '2' },
    { id: 'nj68iQf_e6Q', img: 'steve-tesser', name: 'Hair transplant: Steve Tesser', t: 'FUE Hair Transplant', g: '2,543', h: '5,403', d: '2' },
    { id: 'adFcivrSJjg', img: 'my-experience', name: 'Hair transplant: my experience at Advanced Hair Clinics', t: 'FUE Hair Transplant', g: '2,287', h: '5,511', d: '1' },
    { id: '_lF3QzLdcqQ', img: 'dimos-beke', name: 'Dimos Beke: my experience at Advanced Hair Clinics', t: 'Unshaven FUE Hair Transplant', g: '1,820', h: '4,145', d: '1' },
    { id: 'g4F6fGoYw1A', img: 'result-after', name: 'Result after hair transplant', t: 'FUE Hair Transplant', g: '2,318', h: '4,103', d: '1' },
  ];
  const vtPlayer = $('#vt-player');
  const vtList = $('#vt-list');
  let vCur = 0;
  const vSrc = (v) => `${A}/img/testimonials/${v.img}.webp`;
  vtList.innerHTML = vids.map((v, i) => `<li><button type="button" data-i="${i}" aria-current="${i === 0}">
    <span class="vt-thumb"><img src="${vSrc(v)}" alt="" loading="lazy" width="640" height="360"></span>
    <span><strong>${v.name}</strong><span>${v.g} grafts</span></span></button></li>`).join('');
  // English captions: use an English track when the video has one, otherwise ask the player to
  // auto-translate the video's own captions into English (YouTube's Auto-translate option).
  // The translation call is not in YouTube's documented API, so every step falls back safely:
  // if the player script never loads, the plain embed plays with captions on.
  const ytParams = 'autoplay=1&rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=en&hl=en';
  const plainEmbed = (v) => `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?${ytParams}" title="${v.name}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  let ytApi;
  const loadYT = () => ytApi || (ytApi = new Promise((res, rej) => {
    if (window.YT && window.YT.Player) return res();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); res(); };
    const sc = document.createElement('script');
    sc.src = 'https://www.youtube.com/iframe_api';
    sc.onerror = rej;
    document.head.appendChild(sc);
    setTimeout(rej, 5000);
  }));
  const captionsToEnglish = (player) => {
    try {
      const list = player.getOption('captions', 'tracklist') || [];
      if (!list.length) return false;
      const en = list.find((t) => /^en/i.test(t.languageCode));
      player.setOption('captions', 'track', en
        ? { languageCode: en.languageCode }
        : { languageCode: list[0].languageCode, translationLanguage: { languageCode: 'en', languageName: 'English' } });
      return true;
    } catch (e) { return false; }
  };
  let vtToken = 0;
  const playWithEnglishCaptions = (v) => {
    const token = ++vtToken;
    vtPlayer.innerHTML = '<div id="vt-yt"></div>';
    loadYT().then(() => {
      if (token !== vtToken) return; // another video was chosen meanwhile
      let done = false;
      const tryEnglish = (p) => { if (!done) done = captionsToEnglish(p); };
      new window.YT.Player('vt-yt', {
        host: 'https://www.youtube-nocookie.com',
        videoId: v.id,
        width: '100%', height: '100%',
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, cc_load_policy: 1, cc_lang_pref: 'en', hl: 'en', playsinline: 1 },
        events: {
          onReady: (e) => { e.target.getIframe().title = v.name; e.target.playVideo(); },
          // The captions module reports its tracks once it loads
          onApiChange: (e) => tryEnglish(e.target),
          onStateChange: (e) => { if (e.data === 1) { tryEnglish(e.target); setTimeout(() => tryEnglish(e.target), 1500); } },
        },
      });
    }).catch(() => { if (token === vtToken) vtPlayer.innerHTML = plainEmbed(v); });
  };
  const showVid = (i, play) => {
    vCur = i;
    const v = vids[i];
    $$('button', vtList).forEach((b) => b.setAttribute('aria-current', b.dataset.i == i));
    $('#vt-name').textContent = v.name;
    $('#vt-stats').innerHTML = [['Treatment', v.t], ['Grafts', v.g], ['Hairs', v.h], ['Treatment days', v.d]]
      .map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('');
    if (play) {
      playWithEnglishCaptions(v);
      return;
    }
    vtPlayer.innerHTML = `<button type="button" class="vt-poster" aria-label="Play video: ${v.name}"><img src="${vSrc(v)}" alt="${v.name}" width="1600" height="900" loading="lazy"><span class="vt-play" aria-hidden="true"></span></button>`;
  };
  vtPlayer.addEventListener('click', (e) => { if (e.target.closest('.vt-poster')) showVid(vCur, true); });
  vtList.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    vtToken++;
    showVid(+b.dataset.i, false);
    if (innerWidth <= 1120) vtPlayer.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  showVid(0, false);

  /* ---------- Journey: pinned horizontal scroll ---------- */
  const journey = $('.journey');
  const jTrack = $('#journey-track');
  const jBar = $('.journey-bar span');
  const desktopPin = matchMedia('(min-width: 1121px)');
  const jCards = $$('.j-card', jTrack);
  jCards.forEach((c, i) => {
    const node = document.createElement('span');
    node.className = 'j-node';
    node.setAttribute('aria-hidden', 'true');
    node.textContent = i === jCards.length - 1 ? '✓' : i + 1;
    const arrow = document.createElement('span');
    arrow.className = 'j-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    c.prepend(node, arrow);
  });
  const fillTimeline = (shift, viewW) => {
    const start = jCards[0].offsetLeft;
    const reach = shift + viewW * 0.6;
    jTrack.style.setProperty('--fill', `${Math.max(0, reach - start)}px`);
    jCards.forEach((c) => c.classList.toggle('is-reached', c.offsetLeft <= reach));
  };
  const moveJourney = () => {
    if (journey.classList.contains('is-native')) return;
    const dist = +journey.dataset.dist || 0;
    const top = journey.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / (journey.offsetHeight - innerHeight || 1)));
    jTrack.style.transform = `translate3d(${-p * dist}px,0,0)`;
    jBar.style.width = `${p * 100}%`;
    fillTimeline(p * dist + (p > 0.98 ? innerWidth : 0), innerWidth);
  };
  function setupJourney() {
    const native = reduceMotion || !desktopPin.matches;
    journey.classList.toggle('is-native', native);
    if (native) { journey.style.height = ''; fillTimeline(jTrack.scrollLeft, jTrack.clientWidth); return; }
    const dist = jTrack.scrollWidth - innerWidth;
    journey.style.height = `${innerHeight + Math.max(0, dist)}px`;
    journey.dataset.dist = Math.max(0, dist);
    moveJourney();
  }
  addEventListener('scroll', moveJourney, { passive: true });
  addEventListener('resize', setupJourney);
  addEventListener('load', setupJourney);
  setupJourney();
  jTrack.addEventListener('scroll', () => {
    if (!journey.classList.contains('is-native')) return;
    const max = jTrack.scrollWidth - jTrack.clientWidth;
    jBar.style.width = `${max ? (jTrack.scrollLeft / max) * 100 : 0}%`;
    fillTimeline(jTrack.scrollLeft + (jTrack.scrollLeft >= max - 2 ? jTrack.clientWidth : 0), jTrack.clientWidth);
  }, { passive: true });

  /* ---------- FAQ: one answer open at a time ---------- */
  const faqs = $$('.faq-list details');
  faqs.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- Enquiry form ---------- */
  // Not connected to a destination yet: on a valid submit it shows the confirmation only.
  const form = $('#enquiry-form');
  const rules = {
    'ef-name': (el) => el.value.trim().length > 1,
    'ef-email': (el) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()),
    'ef-phone': (el) => el.value.replace(/[^\d]/g, '').length >= 8,
    'ef-country': (el) => !!el.value,
    'ef-consent': (el) => el.checked,
  };
  const check = (id) => {
    const el = $(`#${id}`);
    const ok = rules[id](el);
    el.setAttribute('aria-invalid', String(!ok));
    const err = $(`#${id}-err`);
    err.hidden = ok;
    if (!ok) el.setAttribute('aria-describedby', `${id}-err`); else el.removeAttribute('aria-describedby');
    return ok;
  };
  // Errors appear on submit and clear as soon as the field is fixed. Validating on blur
  // would move the layout under the pointer and swallow the next click.
  Object.keys(rules).forEach((id) => {
    const el = $(`#${id}`);
    const recheck = () => { if (el.getAttribute('aria-invalid') === 'true') check(id); };
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((id) => !check(id));
    if (bad.length) { $(`#${bad[0]}`).focus(); return; }
    form.classList.add('is-sent');
    const done = $('#ef-done');
    done.hidden = false;
    done.focus();
  });
  const photos = $('#ef-photos');
  const drop = photos.closest('.file-drop');
  const hint = $('#ef-photos-hint');
  const hintText = hint.textContent;
  photos.addEventListener('change', () => {
    const n = photos.files.length;
    hint.textContent = n ? `${n} photo${n > 1 ? 's' : ''} added: ${[...photos.files].map((f) => f.name).join(', ')}` : hintText;
  });
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, () => drop.classList.add('is-over')));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));

  /* ---------- Editorial image reveal + gentle parallax ---------- */
  if (!reduceMotion) {
    const revealTargets = $$('.ba-frame, .why-media, .clinics-media img, .pk-media, .faq-media img');
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const owner = new Map();
    const rIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      (owner.get(e.target) || []).forEach((el) => el.classList.add('is-in'));
      rIO.unobserve(e.target);
    }), { threshold: 0.1 });
    revealTargets.forEach((el) => {
      const host = el.parentElement;
      owner.set(host, [...(owner.get(host) || []), el]);
      rIO.observe(host);
    });

    const par = $$('.athens-bg img');
    const doPar = () => par.forEach((img) => {
      const r = img.closest('section').getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translate3d(0, ${p * -60 - 40}px, 0)`;
    });
    addEventListener('scroll', doPar, { passive: true });
    doPar();
  }
})();
