(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W   = canvas.width  = window.innerWidth;
  var H   = canvas.height = window.innerHeight;

  // Palette Salomon-ish : noir, blanc, rouge, gris, jaune-citron
  var COLORS = ['#000000','#ffffff','#af0c1e','#cccccc','#d4e84b','#696969','#0f0f0f'];

  var TOTAL      = 160;
  var FADE_START = 2600;
  var FADE_END   = 3800;
  var startTime  = performance.now();

  // Origine = centre de l'icône check
  var icon = document.querySelector('.success-icon, .ensemble-success-icon');
  var originX = W / 2;
  var originY = H / 2;
  if (icon) {
    var rect = icon.getBoundingClientRect();
    originX = rect.left + rect.width  / 2;
    originY = rect.top  + rect.height / 2;
  }

  var pieces = [];
  for (var i = 0; i < TOTAL; i++) {
    var angle = (Math.random() * Math.PI * 0.8) + Math.PI * 0.1; // éventail vers le haut
    var speed = 3 + Math.random() * 8;
    pieces.push({
      x:     originX,
      y:     originY,
      vx:    Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
      vy:   -Math.sin(angle) * speed,
      w:     3 + Math.random() * 5,   // plus petits
      h:     2 + Math.random() * 3,
      r:     Math.random() * Math.PI * 2,
      vr:    (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.6 ? 'rect' : 'circle',
      gravity: 0.10 + Math.random() * 0.08,  // chute plus lente
      drag:    0.991 + Math.random() * 0.006,
    });
  }

  function draw(now) {
    var elapsed = now - startTime;

    var alpha = 1;
    if (elapsed > FADE_START) {
      alpha = 1 - (elapsed - FADE_START) / (FADE_END - FADE_START);
    }
    if (elapsed >= FADE_END) {
      canvas.parentNode && canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = Math.max(0, alpha);

    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];

      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x  += p.vx;
      p.y  += p.vy;
      p.r  += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
