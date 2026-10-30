/* Icons for My Closet.
   Pinterest's own icons ship inside Gestalt as React components, and
   Apple's SF Symbols are not published for the web, so these are simple
   SVG copies drawn to match the shapes in the team's reference screens.
   Usage: <i class="icon" data-icon="back"></i>
   Size and colour come from CSS (tokens), not from this file. */
(function () {
  var P = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    more: '<circle cx="5" cy="12" r="1.6" class="fill"/><circle cx="12" cy="12" r="1.6" class="fill"/><circle cx="19" cy="12" r="1.6" class="fill"/>',
    share: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 13v6h14v-6"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    sparkle: '<path class="fill" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path class="fill" d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7l1.5-2.5h3L15 7"/><circle cx="12" cy="13.5" r="3.5"/>',
    photos: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    hanger: '<path d="M12 8.5a2 2 0 1 1 2-2"/><path d="M12 8.5v1.5L3.5 16.5c-.8.6-.4 1.5.5 1.5h16c.9 0 1.3-.9.5-1.5L12 10"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>',
    message: '<path d="M4.5 5h15v11h-9l-4.5 4v-4h-1.5z"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>'
  };
  function draw(el) {
    var name = el.getAttribute('data-icon');
    if (!P[name]) return;
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + P[name] + '</svg>';
  }
  function run(root) { (root || document).querySelectorAll('[data-icon]').forEach(draw); }
  window.drawIcons = run;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); }); else run();
})();
