/* NEW: the personal avatar.
   An illustrated figure the person sets up once: skin tone, hair, body shape.
   Faceless and flat, to sit with Pinterest's quiet look, but each garment
   keeps the details that make it recognisable (collar, ribbing, lapels,
   tweed flecks, plaid, trouser crease).

   Usage:
   <div class="avatar" data-skin="9" data-hair="long" data-hair-color="espresso"
        data-body="straight"
        data-outfit="top:sweater:cream; bottom:trousers:brown; shoes:loafers:black">
   </div>

   Sources:
   - Skin tones: Gestalt's 16 skin tones, kept in tokens.css.
   - Hair and garment colours are illustration content, not UI colours.
     They are taken from the team's reference screens (estimated). */
(function () {
  /* Skin tones are read from tokens.css (--skin-tone-1 to --skin-tone-16). */
  function skinTone(n) {
    return getComputedStyle(document.documentElement).getPropertyValue('--skin-tone-' + n).trim() || '#9A6B52';
  }
  /* estimated from reference screens */
  var HAIR = { black:'#1c1716', espresso:'#3a2a22', chestnut:'#6e4630', honey:'#b08a5a' };
  var CLOTH = { cream:'#ece4d2', white:'#f7f6f2', black:'#222120', brown:'#6b4a33', camel:'#b8916a',
                tweed:'#7b5b42', denim:'#5d7590', plaid:'#7a2f2a', grey:'#9a978f', olive:'#5f6247', navy:'#2f3a4f' };
  /* half-widths at shoulder, waist, hip: four body shapes */
  var BODY = { straight:[25,21,23], curvy:[24,18,29], broad:[29,22,23], full:[29,28,32] };

  function c(name) { return CLOTH[name] || name; }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function parseOutfit(str) {
    var o = {};
    (str || '').split(';').forEach(function (part) {
      var p = part.trim().split(':'); if (p.length < 3) return;
      o[p[0]] = { type: p[1], color: c(p[2]), pattern: p[3] };
    });
    return o;
  }

  /* Avatars marked data-me use the choices saved on the avatar setup screen. */
  function mine(el) {
    if (!el.hasAttribute('data-me') || el.id === 'preview') return;
    try { var me = JSON.parse(localStorage.getItem('myCloset.avatar') || 'null'); } catch (e) { me = null; }
    if (me) Object.keys(me).forEach(function (k) { if (me[k]) el.dataset[k] = me[k]; });
  }

  function draw(el) {
    mine(el);
    var skin = skinTone(el.dataset.skin || 9);
    var hairC = HAIR[el.dataset.hairColor || 'espresso'];
    var hair = el.dataset.hair || 'long';
    var b = BODY[el.dataset.body || 'straight'], s = b[0], w = b[1], h = b[2];
    var o = parseOutfit(el.dataset.outfit);
    var top = o.top || { type: 'tee', color: c('grey') };
    var bottom = o.bottom || { type: 'trousers', color: c('grey') };
    var shoes = o.shoes || { type: 'loafers', color: c('black') };
    var outer = o.outer;
    var cx = 60, sy = 66, wy = 112, hy = 150, out = [];

    /* hair behind the head */
    if (hair === 'long') out.push('<path fill="'+hairC+'" d="M'+(cx-19)+' 30 Q'+cx+' 6 '+(cx+19)+' 30 L'+(cx+22)+' 98 L'+(cx-22)+' 98 Z"/>');
    if (hair === 'bob') out.push('<path fill="'+hairC+'" d="M'+(cx-19)+' 30 Q'+cx+' 8 '+(cx+19)+' 30 L'+(cx+21)+' 56 L'+(cx-21)+' 56 Z"/>');
    if (hair === 'curly') [[-16,30],[16,30],[-19,44],[19,44],[-17,58],[17,58],[0,16],[-10,20],[10,20]].forEach(function (p) { out.push('<circle fill="'+hairC+'" cx="'+(cx+p[0])+'" cy="'+p[1]+'" r="9"/>'); });

    /* legs (skin), only seen under skirts */
    if (bottom.type === 'skirt') out.push('<path stroke="'+skin+'" stroke-width="9" stroke-linecap="round" d="M'+(cx-9)+' 196 L'+(cx-9)+' 270 M'+(cx+9)+' 196 L'+(cx+9)+' 270"/>');

    /* bottoms */
    var bc = bottom.color;
    if (bottom.type === 'trousers' || bottom.type === 'jeans') {
      var ankle = bottom.type === 'jeans' ? 9 : 13;
      out.push('<path fill="'+bc+'" d="M'+(cx-h)+' '+(hy-6)+' L'+(cx+h)+' '+(hy-6)+' L'+(cx+2+ankle*2)+' 272 L'+(cx+2)+' 272 L'+cx+' 178 L'+(cx-2)+' 272 L'+(cx-2-ankle*2)+' 272 Z"/>');
      out.push('<path stroke="'+shade(bc,-24)+'" stroke-width="1" d="M'+(cx-h/2-1)+' 160 L'+(cx-ankle-2)+' 270 M'+(cx+h/2+1)+' 160 L'+(cx+ankle+2)+' 270"/>');
      if (bottom.type === 'jeans') out.push('<path stroke="'+shade(bc,40)+'" stroke-width="1" stroke-dasharray="2 2" fill="none" d="M'+(cx-h+3)+' 152 Q'+(cx-8)+' 160 '+(cx-4)+' 148 M'+(cx+h-3)+' 152 Q'+(cx+8)+' 160 '+(cx+4)+' 148"/>');
    } else if (bottom.type === 'skirt') {
      out.push('<path fill="'+bc+'" d="M'+(cx-h)+' '+(hy-8)+' L'+(cx+h)+' '+(hy-8)+' L'+(cx+h+9)+' 204 L'+(cx-h-9)+' 204 Z"/>');
      if (bottom.pattern === 'plaid') {
        var lines = '';
        for (var y = 152; y < 204; y += 10) lines += 'M'+(cx-h-9)+' '+y+' L'+(cx+h+9)+' '+y+' ';
        for (var x = -h; x <= h; x += 9) lines += 'M'+(cx+x)+' '+(hy-8)+' L'+(cx+x*1.3)+' 204 ';
        out.push('<path stroke="'+shade(bc,50)+'" stroke-width="1.2" opacity="0.7" d="'+lines+'"/>');
      }
    }

    /* shoes */
    var sc = shoes.color;
    if (shoes.type === 'boots') out.push('<path fill="'+sc+'" d="M'+(cx-22)+' 236 h17 v40 h-21 z M'+(cx+5)+' 236 h17 v40 h-21 z"/>');
    else out.push('<path fill="'+sc+'" d="M'+(cx-24)+' 270 h20 v7 q0 3 -3 3 h-19 q-2 0 -2 -3 z M'+(cx+4)+' 270 h20 q2 0 2 3 v4 q0 3 -3 3 h-19 z"/>');

    /* top */
    var tc = top.color, sleeve = outer ? outer.color : tc;
    out.push('<rect fill="'+skin+'" x="'+(cx-5)+'" y="44" width="10" height="'+(sy-42)+'"/>');
    var arms = 'M'+(cx-s+3)+' '+(sy+5)+' L'+(cx-h-7)+' 146 M'+(cx+s-3)+' '+(sy+5)+' L'+(cx+h+7)+' 146';
    if (top.type === 'tee' && !outer) {
      /* short sleeves: bare arms with a sleeve over the upper third */
      out.push('<path stroke="'+skin+'" stroke-width="9" stroke-linecap="round" d="'+arms+'"/>');
      var lx = cx-s+3 + ((cx-h-7)-(cx-s+3))*0.35, rx = cx+s-3 + ((cx+h+7)-(cx+s-3))*0.35, ly = sy+5 + (146-(sy+5))*0.35;
      out.push('<path stroke="'+sleeve+'" stroke-width="13" stroke-linecap="round" d="M'+(cx-s+3)+' '+(sy+5)+' L'+lx+' '+ly+' M'+(cx+s-3)+' '+(sy+5)+' L'+rx+' '+ly+'"/>');
    } else {
      out.push('<path stroke="'+sleeve+'" stroke-width="11" stroke-linecap="round" d="'+arms+'"/>');
    }
    if (top.type === 'zipjacket' && !outer) out.push('<path stroke="#1f1f1f" stroke-width="11" d="M'+(cx-h-6)+' 139 L'+(cx-h-7)+' 146 M'+(cx+h+6)+' 139 L'+(cx+h+7)+' 146"/>');
    out.push('<circle fill="'+skin+'" cx="'+(cx-h-7)+'" cy="152" r="5"/><circle fill="'+skin+'" cx="'+(cx+h+7)+'" cy="152" r="5"/>');
    var torso = 'M'+(cx-s)+' '+sy+' L'+(cx+s)+' '+sy+' L'+(cx+w)+' '+wy+' L'+(cx+h)+' '+(hy-2)+' L'+(cx-h)+' '+(hy-2)+' L'+(cx-w)+' '+wy+' Z';
    out.push('<path fill="'+tc+'" d="'+torso+'"/>');
    if (top.type === 'sweater') {
      out.push('<path stroke="'+shade(tc,-28)+'" stroke-width="1" d="M'+(cx-h+2)+' 141 L'+(cx+h-2)+' 141 M'+(cx-h+2)+' 144 L'+(cx+h-2)+' 144"/>');
      out.push('<path fill="none" stroke="'+shade(tc,-28)+'" stroke-width="1.5" d="M'+(cx-7)+' '+sy+' Q'+cx+' '+(sy+7)+' '+(cx+7)+' '+sy+'"/>');
    }
    if (top.type === 'zipjacket') {
      /* cropped zip jacket: plaid check, centre zip, ribbed hem */
      var uid = 'c' + Math.random().toString(36).slice(2, 8);
      var grid = '';
      for (var gy = sy; gy < hy; gy += 9) grid += '<rect x="'+(cx-s-2)+'" y="'+gy+'" width="'+(s*2+4)+'" height="4" fill="'+shade(tc,-70)+'" opacity="0.55"/>';
      for (var gx = cx-s; gx < cx+s; gx += 9) grid += '<rect x="'+gx+'" y="'+sy+'" width="4" height="'+(hy-sy)+'" fill="'+shade(tc,-70)+'" opacity="0.55"/>';
      out.push('<clipPath id="'+uid+'"><path d="'+torso+'"/></clipPath><g clip-path="url(#'+uid+')">'+grid+'</g>');
      out.push('<path fill="#1f1f1f" d="M'+(cx-h)+' '+(hy-10)+' L'+(cx+h)+' '+(hy-10)+' L'+(cx+h)+' '+(hy-2)+' L'+(cx-h)+' '+(hy-2)+' Z"/>');
      out.push('<path stroke="#1f1f1f" stroke-width="1.6" d="M'+cx+' '+(sy-4)+' L'+cx+' '+(hy-2)+'"/>');
      out.push('<rect fill="'+tc+'" x="'+(cx-8)+'" y="50" width="16" height="'+(sy-48)+'" rx="2"/>');
    }
    if (top.type === 'turtleneck') out.push('<rect fill="'+tc+'" x="'+(cx-7)+'" y="48" width="14" height="'+(sy-46)+'" rx="3"/>');
    if (top.type === 'buttondown') {
      out.push('<path fill="'+shade(tc,-12)+'" d="M'+(cx-9)+' '+(sy-2)+' L'+cx+' '+(sy+9)+' L'+(cx-3)+' '+(sy+12)+' Z M'+(cx+9)+' '+(sy-2)+' L'+cx+' '+(sy+9)+' L'+(cx+3)+' '+(sy+12)+' Z"/>');
      for (var by = sy + 18; by < hy - 6; by += 14) out.push('<circle fill="'+shade(tc,-40)+'" cx="'+cx+'" cy="'+by+'" r="1.3"/>');
    }

    /* outer layer: blazer or long coat, worn open */
    if (outer) {
      var oc = outer.color, len = outer.type === 'coat' ? 214 : hy + 6, hw = outer.type === 'coat' ? h + 6 : h + 2;
      out.push('<path fill="'+oc+'" d="M'+(cx-s-1)+' '+sy+' L'+(cx-8)+' '+sy+' L'+(cx-6)+' '+len+' L'+(cx-hw)+' '+len+' L'+(cx-w-2)+' '+wy+' Z"/>');
      out.push('<path fill="'+oc+'" d="M'+(cx+s+1)+' '+sy+' L'+(cx+8)+' '+sy+' L'+(cx+6)+' '+len+' L'+(cx+hw)+' '+len+' L'+(cx+w+2)+' '+wy+' Z"/>');
      out.push('<path fill="'+shade(oc,-22)+'" d="M'+(cx-8)+' '+sy+' L'+(cx-16)+' '+(sy+4)+' L'+(cx-7)+' '+(sy+34)+' Z M'+(cx+8)+' '+sy+' L'+(cx+16)+' '+(sy+4)+' L'+(cx+7)+' '+(sy+34)+' Z"/>');
      if (outer.pattern === 'tweed') {
        var dots = '';
        [[-18,84],[-12,100],[-20,118],[-14,136],[16,90],[13,108],[19,124],[12,140],[-16,72],[18,74]].forEach(function (d) { dots += '<rect x="'+(cx+d[0])+'" y="'+d[1]+'" width="3" height="1.4" fill="'+shade(oc,46)+'"/>'; });
        out.push(dots);
      }
      if (outer.type === 'coat') out.push('<path stroke="'+shade(oc,-30)+'" stroke-width="1" d="M'+(cx-hw+6)+' 176 h8 M'+(cx+hw-14)+' 176 h8"/>');
    }

    /* head and front hair */
    out.push('<circle fill="'+skin+'" cx="'+cx+'" cy="34" r="14"/>');
    if (hair === 'bun') out.push('<circle fill="'+hairC+'" cx="'+cx+'" cy="15" r="8"/>');
    if (hair !== 'curly') out.push('<path fill="'+hairC+'" d="M'+(cx-15)+' 34 Q'+(cx-15)+' 18 '+cx+' 18 Q'+(cx+15)+' 18 '+(cx+15)+' 34 Q'+(cx+6)+' 24 '+(cx-15)+' 34 Z"/>');
    else out.push('<path fill="'+hairC+'" d="M'+(cx-15)+' 32 Q'+cx+' 12 '+(cx+15)+' 32 Q'+cx+' 22 '+(cx-15)+' 32 Z"/>');

    var label = el.getAttribute('aria-label') || 'Your avatar';
    el.innerHTML = '<svg viewBox="0 0 120 290" role="img" aria-label="'+label+'">' + out.join('') + '</svg>';
  }

  window.drawAvatars = function (root) { (root || document).querySelectorAll('.avatar').forEach(draw); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { window.drawAvatars(); });
  else window.drawAvatars();
})();
