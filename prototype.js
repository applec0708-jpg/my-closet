/* My Closet prototype behaviour.
   Plain JavaScript, no libraries. State lives in localStorage so choices carry
   across screens (avatar, uploads, saved looks). Prototype only: nothing is sent anywhere.
   Item data comes from prototype-data.js (ITEMS). */
(function () {
  var KEY = 'myCloset.';
  function get(k, d) { try { var v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }
  window.MC = { get: get, set: set };

  /* ------------------------------------------------------------ looks */
  /* What each inspo pin breaks down into. The pieces were read from the photos. */
  var LOOKS = {
    plaid: { name: 'Plaid bomber, light denim', inspo: 'inspo-plaid-bomber-light-denim.jpg',
      outfit: 'top:zipjacket:#c9c9c4; bottom:jeans:#a7b9cc; shoes:boots:black',
      owned: ['black-buckle-boots'],
      shop: [{ slug: 'gray-plaid-zip-jacket', name: 'Gray plaid zip jacket', brand: 'Depop', img: 'gray-plaid-zip-jacket.png', shape: 'short' },
             { slug: 'light-wash-baggy-jeans', name: 'Light-wash baggy jeans', brand: 'Depop', img: 'light-wash-baggy-jeans.png', shape: 'long' }] },
    red: { name: 'Red tee & light denim', inspo: 'inspo-red-tee-light-denim.jpg',
      outfit: 'top:tee:#c8312b; bottom:jeans:#b7c3cf; shoes:loafers:#efe9dc',
      owned: ['red-baseball-tee', 'light-ripped-jeans'],
      shop: [{ slug: 'white-long-sleeve-tee', name: 'White long-sleeve tee', brand: 'Shoppable pin', img: 'white-long-sleeve-tee.jpg', shape: 'top' },
             { slug: 'cream-ballet-flats', name: 'Cream ballet flats', brand: 'Shoppable pin', img: 'cream-ballet-flats.jpg', shape: 'short' }] },
    yellow: { name: 'Yellow polo & baggy jeans', inspo: 'inspo-yellow-polo-baggy-jeans.jpg',
      outfit: 'top:tee:#e9c33b; bottom:jeans:#a9bdd2; shoes:loafers:#e9c33b',
      owned: ['mustard-ringer-tee', 'light-bootcut-jeans'],
      shop: [{ slug: 'yellow-suede-sneakers', name: 'Yellow suede sneakers', brand: 'Shoppable pin', img: 'yellow-suede-sneakers.jpg', shape: 'short' },
             { slug: 'black-shoulder-bag', name: 'Black shoulder bag', brand: 'Shoppable pin', img: 'black-shoulder-bag.jpg', shape: 'top' }] },
    stripes: { name: 'Stripes, scarf & tall boots', inspo: 'inspo-stripes-scarf-boots.jpg',
      outfit: 'top:sweater:#4b5470; bottom:skirt:#5b5f63; shoes:boots:black',
      owned: ['black-buckle-boots'],
      shop: [{ slug: 'striped-long-sleeve', name: 'Striped long-sleeve', brand: 'Shoppable pin', img: 'striped-long-sleeve.jpg', shape: 'top' },
             { slug: 'fringe-knit-scarf', name: 'Fringe knit scarf', brand: 'Shoppable pin', img: 'fringe-knit-scarf.jpg', shape: 'mid' },
             { slug: 'denim-mini-skirt', name: 'Denim mini skirt', brand: 'Shoppable pin', img: 'denim-mini-skirt.jpg', shape: 'short' }] }
  };
  MC.LOOKS = LOOKS;

  function added() { return get('added', []); }
  /* A shop piece you have since uploaded counts as owned. */
  function split(look) {
    var have = added(), owned = look.owned.slice(), shop = [];
    look.shop.forEach(function (p) { if (have.indexOf(p.slug) > -1) owned.push(p.slug); else shop.push(p); });
    return { owned: owned, shop: shop };
  }
  function status(look) {
    var n = split(look).shop.length;
    return n === 0 ? 'All pieces owned' : (n === 1 ? '1 piece to shop' : n + ' pieces to shop');
  }
  MC.split = split; MC.status = status;
  MC.lookKey = function () { var m = location.search.match(/look=(\w+)/); return m && LOOKS[m[1]] ? m[1] : (get('pin', 'plaid')); };

  function ph(label, img, cls) {
    return '<div class="ph ' + (cls || '') + '"><img class="photo" src="../images/' + img + '" alt="" onerror="this.remove()">' + label + '</div>';
  }
  function icon(n, c) { return '<i class="icon ' + (c || '') + '" data-icon="' + n + '"></i>'; }
  MC.ph = ph;

  /* ------------------------------------------------------------ toast */
  MC.toast = function (text, action, href) {
    var old = document.querySelector('.js-toast'); if (old) old.remove();
    var phone = document.querySelector('.phone');
    var footer = phone.querySelector('.screen-footer, .tab-bar');
    var bottom = footer ? footer.offsetHeight + 16 : 48;
    var t = document.createElement('div');
    t.className = 'toast-dock js-toast';
    t.style.bottom = bottom + 'px';
    t.innerHTML = '<div class="toast"><span class="check-badge">' + icon('check') + '</span><span class="toast__text">' + text + '</span>' +
      (action ? '<a class="button button--white" href="' + href + '">' + action + '</a>' : '') + '</div>';
    phone.appendChild(t);
    if (window.drawIcons) window.drawIcons(t);
    clearTimeout(MC._tt); MC._tt = setTimeout(function () { t.remove(); }, 3500);
  };

  /* ------------------------------------------------------------ missing photos */
  /* A photo that isn't in images/ yet is removed, so its labelled tile shows. */
  document.addEventListener('error', function (e) {
    var t = e.target; if (t && t.classList && t.classList.contains('photo')) t.remove();
  }, true);
  function sweepPhotos(root) {
    (root || document).querySelectorAll('img.photo').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) img.remove();
    });
  }

  /* ------------------------------------------------------------ links that carry state */
  /* Hosted pages drop ?query strings, so the chosen look and where you came from are also kept in storage. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href'), m = h.match(/look=(\w+)/);
    if (m) set('pin', m[1]);
    if (/from=closet/.test(h)) set('fromCloset', true);
    if (/02-avatar-setup/.test(h) && !/from=closet/.test(h)) set('fromCloset', false);
  }, true);

  /* ------------------------------------------------------------ page setup */
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function () {
    var page = document.body.dataset.page;
    sweepPhotos(); setTimeout(sweepPhotos, 800);

    /* Closet: pieces you uploaded appear, chips filter */
    if (page === 'closet') {
      var grid = document.querySelector('.closet-masonry');
      added().slice().reverse().forEach(function (slug) {
        if (grid.querySelector('[data-slug="' + slug + '"]') || !ITEMS[slug]) return;
        var it = ITEMS[slug], d = document.createElement('div');
        d.className = 'item'; d.dataset.slug = slug; d.dataset.cat = it.cat;
        d.innerHTML = ph(it.name, slug + '.png', 'ph--cutout shape-' + it.shape);
        grid.insertBefore(d, grid.firstChild);
      });
      var count = grid.querySelectorAll('.item').length;
      var sub = document.querySelector('.nav-bar__title .t-ui-xs'); if (sub) sub.textContent = count + ' items';
      document.querySelectorAll('.chip-row .chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          document.querySelectorAll('.chip-row .chip').forEach(function (c) { c.classList.toggle('is-selected', c === chip); });
          var cat = chip.textContent.trim();
          grid.querySelectorAll('.item').forEach(function (i) { i.hidden = !(cat === 'All' || i.dataset.cat === cat); });
          var shown = grid.querySelectorAll('.item:not([hidden])').length;
          var empty = document.querySelector('.js-filter-empty');
          if (!shown && !empty) { empty = document.createElement('p'); empty.className = 'js-filter-empty t-body-sm t-subtle center'; grid.after(empty); }
          if (empty) empty.textContent = shown ? '' : 'No ' + cat.toLowerCase() + ' yet. Upload one to see it here.';
        });
      });
    }

    /* New item: adding it to the closet is remembered */
    if (page === 'new-item') {
      document.querySelector('.js-add').addEventListener('click', function () {
        var a = added(); if (a.indexOf('gray-plaid-zip-jacket') < 0) a.push('gray-plaid-zip-jacket'); set('added', a);
      });
    }

    /* Board: tap a pin to choose it */
    if (page === 'board') {
      var cta = document.querySelector('.js-cta');
      function choose(key) {
        set('pin', key);
        document.querySelectorAll('.pin[data-look]').forEach(function (p) {
          var on = p.dataset.look === key; p.classList.toggle('is-selected', on);
          var b = p.querySelector('.check-badge');
          if (on && !b) { p.querySelector('.pin__media').insertAdjacentHTML('beforeend', '<span class="check-badge">' + icon('check') + '</span>'); if (window.drawIcons) window.drawIcons(p); }
          if (!on && b) b.remove();
        });
        cta.href = '10-matching.html?look=' + key;
      }
      document.querySelectorAll('.pin[data-look]').forEach(function (p) {
        p.addEventListener('click', function (e) { e.preventDefault(); choose(p.dataset.look); });
      });
      choose(get('pin', 'plaid'));
    }

    /* Matching: show the chosen pin, then move on */
    if (page === 'matching') {
      var key = MC.lookKey(), look = LOOKS[key];
      var slot = document.querySelector('.js-inspo'); if (slot) slot.outerHTML = ph('Inspo', look.inspo, 'js-inspo');
      var steps = document.querySelectorAll('.progress__step'), bar = document.querySelector('.progress__bar i');
      [700, 1400, 2100].forEach(function (t, i) {
        setTimeout(function () { if (steps[i]) steps[i].classList.add('is-done'); if (bar) bar.style.width = ((i + 1) * 33.3) + '%'; }, t);
      });
      setTimeout(function () { location.href = '11-complete-look-a.html?look=' + key; }, 2800);
    }

    /* Complete the look: built from the chosen pin; Save opens the sheet */
    if (page === 'complete-look') renderLook();

    /* Looks: saved looks appear, chips filter */
    if (page === 'looks') {
      var wrap = document.querySelector('.looks-masonry');
      get('saved', []).slice().reverse().forEach(function (s) {
        var look = LOOKS[s.key]; if (!look) return;
        var old = wrap.querySelector('[data-look="' + s.key + '"]'); if (old) old.remove();
        var st = status(look), ready = st === 'All pieces owned';
        var a = document.createElement('a');
        a.className = 'look look--tall'; a.href = '11-complete-look-a.html?look=' + s.key; a.dataset.look = s.key; a.dataset.ready = ready ? '1' : '0';
        a.innerHTML = '<div class="look__media"><div class="avatar-frame"><div class="avatar" data-me data-outfit="' + look.outfit + '"></div></div>' + ph('', look.inspo, 'look__inspo') + '</div>' +
          '<span class="look__name">' + s.name + '</span>' +
          '<span class="look__status' + (ready ? ' is-ready' : '') + '">' + icon(ready ? 'check' : 'bag') + st + '</span>';
        wrap.insertBefore(a, wrap.firstChild);
      });
      /* the built-in plaid card follows the closet too */
      wrap.querySelectorAll('.look[data-look]').forEach(function (a) {
        var look = LOOKS[a.dataset.look], st = status(look), ready = st === 'All pieces owned';
        a.dataset.ready = ready ? '1' : '0';
        var el = a.querySelector('.look__status'); el.className = 'look__status' + (ready ? ' is-ready' : ''); el.innerHTML = icon(ready ? 'check' : 'bag') + st;
      });
      wrap.querySelectorAll('.look:not([data-look])').forEach(function (a) { a.dataset.ready = a.querySelector('.look__status.is-ready') ? '1' : '0'; });
      if (window.drawAvatars) window.drawAvatars(wrap); if (window.drawIcons) window.drawIcons(wrap);
      var n = wrap.querySelectorAll('.look').length;
      var sub2 = document.querySelector('.nav-bar__title .t-ui-xs'); if (sub2) sub2.textContent = n + ' looks';
      document.querySelectorAll('.chip-row .chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          document.querySelectorAll('.chip-row .chip').forEach(function (c) { c.classList.toggle('is-selected', c === chip); });
          var f = chip.textContent.trim();
          wrap.querySelectorAll('.look').forEach(function (l) {
            l.hidden = (f === 'Ready to wear' && l.dataset.ready !== '1') || (f === 'Needs pieces' && l.dataset.ready === '1');
          });
        });
      });
    }

    /* Avatar setup: Done saves your choices for every screen */
    if (page === 'avatar') {
      var me = get('avatar', null), prev = document.getElementById('preview');
      if (me) Object.keys(me).forEach(function (k) {
        var b = document.querySelector('[data-set="' + k + '"][data-value="' + me[k] + '"]'); if (b) b.click();
      });
      document.querySelector('.js-done').addEventListener('click', function (e) {
        set('avatar', { skin: prev.dataset.skin, hair: prev.dataset.hair, hairColor: prev.dataset.hairColor, body: prev.dataset.body });
        /* Opened from your closet: go back there. First time: carry on to the empty closet. */
        if (/from=closet/.test(location.search) || get('fromCloset', false)) { e.preventDefault(); set('fromCloset', false); location.href = '04-closet.html'; }
      });
    }

    /* Save buttons that toggle, Shop buttons that explain */
    document.querySelectorAll('.js-save-toggle').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); var on = b.classList.toggle('button--dark'); b.classList.toggle('button--red', !on);
        b.innerHTML = on ? icon('check') + 'Saved' : 'Save'; if (window.drawIcons) window.drawIcons(b);
        if (on) MC.toast('Saved to Y2K Grunge', 'View', '01-profile.html');
      });
    });
    document.addEventListener('click', function (e) {
      var s = e.target.closest('.js-shop'); if (!s) return;
      e.preventDefault(); MC.toast('Opens the listing on ' + (s.dataset.brand || 'the store'));
    });
  });

  /* ------------------------------------------------------------ complete the look */
  function renderLook() {
    var key = MC.lookKey(), look = LOOKS[key], parts = split(look);
    var total = parts.owned.length + parts.shop.length;
    document.querySelector('.js-look').innerHTML =
      '<div class="avatar-stage"><div class="avatar-frame" style="aspect-ratio: var(--avatar-stage-ratio)"><div class="avatar" data-me data-outfit="' + look.outfit + '" aria-label="You wearing the recreated look"></div></div>' +
      '<div class="avatar-stage__inspo">' + ph('Inspo', look.inspo) + '</div></div>' +
      '<div style="padding: var(--sema-space-400) var(--sema-space-400) 0"><div class="t-heading-md">' + look.name + '</div>' +
      '<div class="t-body-sm t-subtle">' + parts.owned.length + ' of ' + total + ' pieces from your closet' + (parts.shop.length ? ' · ' + parts.shop.length + ' to shop' : ' · ready to wear') + '</div></div>' +
      '<div class="section-head"><span class="t-heading-xs">From my closet</span></div><div class="item-row">' +
      parts.owned.map(function (s) { var it = ITEMS[s]; return '<div class="item">' + ph(it.name, s + '.png', 'ph--cutout shape-top') + '<span class="item__name">' + it.name + '</span></div>'; }).join('') + '</div>' +
      (parts.shop.length ? '<div class="section-head"><span class="t-heading-xs">To complete it</span></div><div class="item-row" style="padding-bottom: var(--sema-space-600)">' +
        parts.shop.map(function (p) { return '<div class="product">' + ph(p.name, p.img, 'ph--cutout shape-top') + '<span class="product__brand">' + p.brand + '</span><span class="product__name">' + p.name + '</span><a class="button button--gray button--md js-shop" data-brand="' + p.brand + '" href="#">Shop</a></div>'; }).join('') + '</div>' : '');
    document.querySelector('.js-lookname').value = look.name;
    if (window.drawAvatars) window.drawAvatars(document.querySelector('.js-look'));
    if (window.drawIcons) window.drawIcons(document);

    var sheet = document.querySelector('.js-sheet'), scrim = document.querySelector('.js-scrim'), saveBtn = document.querySelector('.js-save');
    function open(v) { sheet.hidden = !v; scrim.hidden = !v; }
    var saved = get('saved', []).some(function (s) { return s.key === key; });
    function markSaved() { saveBtn.className = 'button button--dark js-save'; saveBtn.innerHTML = icon('check') + 'Saved'; saveBtn.href = '14-looks.html'; if (window.drawIcons) window.drawIcons(saveBtn); }
    if (saved) markSaved();
    saveBtn.addEventListener('click', function (e) { if (saveBtn.classList.contains('button--dark')) return; e.preventDefault(); open(true); });
    document.querySelectorAll('.js-close').forEach(function (c) { c.addEventListener('click', function (e) { e.preventDefault(); open(false); }); });
    document.querySelectorAll('.js-sheet .list-row[data-board]').forEach(function (r) {
      r.addEventListener('click', function () { r.querySelector('.radio').classList.toggle('is-selected'); });
    });
    document.querySelector('.js-confirm').addEventListener('click', function (e) {
      e.preventDefault();
      var list = get('saved', []).filter(function (s) { return s.key !== key; });
      list.push({ key: key, name: document.querySelector('.js-lookname').value || look.name }); set('saved', list);
      open(false); markSaved(); MC.toast('Saved to My Looks', 'View', '14-looks.html');
    });
  }
})();
