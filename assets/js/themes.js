/**
 * DAMEYO — themes.js
 * ==================
 * Thèmes saisonniers automatiques avec :
 *   - Animations visuelles par thème (canvas plein écran)
 *   - Toggle de désactivation persistant (localStorage)
 *   - Bouton flottant discret pour activer/désactiver
 *
 * COMMANDES CONSOLE :
 *   DameyoTheme.set('noel')    → force un thème
 *   DameyoTheme.set('default') → charte normale
 *   DameyoTheme.disable()      → désactive les effets visuels
 *   DameyoTheme.enable()       → réactive les effets visuels
 *   DameyoTheme.reset()        → retour détection auto par date
 *   DameyoTheme.current()      → nom du thème actif
 */

(function () {
  'use strict';

  /* ====================================================
     CONFIGURATION DES THÈMES
  ==================================================== */
  var THEMES = {

    noel: {
      periods     : [
        { fromMonth: 12, fromDay: 1,  toMonth: 12, toDay: 31 },
        { fromMonth: 1,  fromDay: 1,  toMonth: 1,  toDay: 6  }
      ],
      bannerEmoji : '🎄',
      bannerText  : 'Joyeux Noël — on régale même le Père Noël',
      eyebrow     : 'Menu spécial fêtes 🎅',
      particles   : [
        { type: 'luge',  emoji: '🛷',  count: 1,  speedX: [-4.5,-3],   speedY: [0.1,0.3],  size:[52,68], startRight:true,  wobble:false, floatUp:false },
        { type: 'flake', emoji: '❄️',  count: 18, speedX: [-0.5,0.5],  speedY: [0.8,2.0],  size:[12,24], startRight:false, wobble:true,  floatUp:false },
        { type: 'star',  emoji: '⭐',  count: 7,  speedX: [-0.3,0.3],  speedY: [0.4,1.0],  size:[10,16], startRight:false, wobble:true,  floatUp:false }
      ]
    },

    galette: {
      periods     : [
        { fromMonth: 1, fromDay: 7, toMonth: 1, toDay: 31 }
      ],
      bannerEmoji : '👑',
      bannerText  : 'Qui aura la fève ? Pas dans nos burgers, promis',
      eyebrow     : 'Bonne année 🥂',
      particles   : [
        { type: 'crown', emoji: '👑', count: 5,  speedX: [-0.4,0.4], speedY: [0.5,1.2], size:[22,34], startRight:false, wobble:true,  floatUp:false },
        { type: 'coin',  emoji: '🪙', count: 12, speedX: [-0.8,0.8], speedY: [0.8,2.0], size:[14,22], startRight:false, wobble:false, floatUp:false }
      ]
    },

    ramadan: {
      /*
        Dates exactes du Ramadan jusqu'en 2035 (calendrier lunaire).
        Source : calculs islamiques officiels (Umm al-Qura).
        Le Ramadan décale d'environ 10-11 jours chaque année.
        À mettre à jour après 2035 → remplacer RAMADAN_DATES dans themes.js.
        Pour forcer manuellement : DameyoTheme.set('ramadan')
      */
      periods     : 'RAMADAN',
      bannerEmoji : '🌙',
      bannerText  : 'Ramadan Mubarak — nos saveurs vous accompagnent',
      eyebrow     : 'Ramadan Kareem 🌙✨',
      particles   : [
        { type: 'lantern',  emoji: '🪔', count: 5,  speedX: [-0.3,0.3], speedY: [-0.7,-0.3], size:[28,42], startRight:false, wobble:true,  floatUp:true },
        { type: 'crescent', emoji: '🌙', count: 8,  speedX: [-0.4,0.4], speedY: [-0.9,-0.3], size:[18,30], startRight:false, wobble:true,  floatUp:true },
        { type: 'sparkle',  emoji: '✨', count: 14, speedX: [-0.5,0.5], speedY: [-1.3,-0.5], size:[10,18], startRight:false, wobble:false, floatUp:true }
      ]
    },

    halloween: {
      periods     : [
        { fromMonth: 10, fromDay: 1, toMonth: 10, toDay: 31 }
      ],
      bannerEmoji : '🎃',
      bannerText  : 'Trick or Treat ? On choisit le burger',
      eyebrow     : 'La saison qui fait peur 👻',
      particles   : [
        { type: 'spider',  emoji: '🕷️', count: 8, speedX: [0,0],      speedY: [0.5,1.6], size:[16,30], startRight:false, wobble:false, floatUp:false, thread:true },
        { type: 'bat',     emoji: '🦇', count: 6, speedX: [-2.8,-1.5], speedY: [-0.5,0.5],size:[22,36], startRight:true,  wobble:true,  floatUp:false },
        { type: 'pumpkin', emoji: '🎃', count: 4, speedX: [-0.3,0.3],  speedY: [0.4,1.0], size:[20,30], startRight:false, wobble:true,  floatUp:false }
      ]
    },

    ete: {
      periods     : [
        { fromMonth: 7, fromDay: 1, toMonth: 8, toDay: 31 }
      ],
      bannerEmoji : '☀️',
      bannerText  : "L'été, ça se fête avec un bon burger",
      eyebrow     : "L'été qui claque 🏖️",
      particles   : [
        { type: 'sun',   emoji: '☀️', count: 3, speedX: [0.3,0.8],  speedY: [-0.2,0.2], size:[30,44], startRight:false, wobble:true,  floatUp:false },
        { type: 'wave',  emoji: '🌊', count: 5, speedX: [0.6,1.4],  speedY: [0,0],      size:[28,40], startRight:false, wobble:false, floatUp:false },
        { type: 'gelato',emoji: '🍦', count: 6, speedX: [-0.4,0.4], speedY: [0.6,1.4],  size:[18,26], startRight:false, wobble:true,  floatUp:false }
      ]
    }

  };

  /* ====================================================
     ÉTAT GLOBAL
  ==================================================== */
  var currentTheme = 'default';
  var isDisabled   = false;
  var animFrame    = null;
  var particles    = [];
  var canvas       = null;
  var ctx          = null;

  /* ====================================================
     TABLE DES DATES DU RAMADAN (calendrier Umm al-Qura)
     Format : { year, start: [mois,jour], end: [mois,jour] }
     À mettre à jour après 2035.
  ==================================================== */
  var RAMADAN_DATES = [
    { year: 2024, start: [3, 11],  end: [4,  9]  },
    { year: 2025, start: [3,  1],  end: [3, 30]  },
    { year: 2026, start: [2, 18],  end: [3, 19]  },
    { year: 2027, start: [2,  8],  end: [3,  9]  },
    { year: 2028, start: [1, 28],  end: [2, 26]  },
    { year: 2029, start: [1, 16],  end: [2, 14]  },
    { year: 2030, start: [1,  6],  end: [2,  4]  },
    { year: 2030, start: [12, 26], end: [12, 31] }, /* 2e Ramadan en 2030 */
    { year: 2031, start: [1,  1],  end: [1, 24]  },
    { year: 2031, start: [12, 15], end: [12, 31] },
    { year: 2032, start: [1,  1],  end: [1, 13]  },
    { year: 2032, start: [12,  3], end: [12, 31] },
    { year: 2033, start: [1,  1],  end: [1,  2]  },
    { year: 2033, start: [11, 23], end: [12, 22] },
    { year: 2034, start: [11, 12], end: [12, 11] },
    { year: 2035, start: [11,  1], end: [11, 30] }
  ];

  function isRamadan(year, month, day) {
    for (var i = 0; i < RAMADAN_DATES.length; i++) {
      var r = RAMADAN_DATES[i];
      if (r.year !== year) continue;
      /* Comparer en timestamp pour gérer les chevauchements de mois */
      var now   = new Date(year, month - 1, day).getTime();
      var start = new Date(year, r.start[0] - 1, r.start[1]).getTime();
      var end   = new Date(year, r.end[0]   - 1, r.end[1]).getTime();
      if (now >= start && now <= end) return true;
    }
    return false;
  }

  /* ====================================================
     DÉTECTION DE LA DATE
  ==================================================== */
  function detectTheme() {
    var now   = new Date();
    var year  = now.getFullYear();
    var month = now.getMonth() + 1;
    var day   = now.getDate();

    /* Ramadan : vérification via table exacte */
    if (isRamadan(year, month, day)) return 'ramadan';

    /* Autres thèmes */
    for (var name in THEMES) {
      if (name === 'ramadan') continue; /* déjà géré ci-dessus */
      var theme = THEMES[name];
      for (var i = 0; i < theme.periods.length; i++) {
        var p = theme.periods[i];
        if (
          (month === p.fromMonth && day >= p.fromDay) ||
          (month === p.toMonth   && day <= p.toDay)   ||
          (p.fromMonth !== p.toMonth && month > p.fromMonth && month < p.toMonth)
        ) return name;
      }
    }
    return 'default';
  }

  /* ====================================================
     CANVAS PARTICULES
  ==================================================== */

  function createCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'dameyo-theme-canvas';

    /* Mobile : canvas clipé dans le hero mobile
       pour ne pas déborder sur la zone vidéo */
    var isMob = window.innerWidth <= 768;
    var hero  = document.getElementById('heroMobile');

    if (isMob && hero) {
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;opacity:0.82';
      hero.style.position  = 'relative';
      hero.style.overflow  = 'hidden';
      hero.appendChild(canvas);
    } else {
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.82';
      document.body.appendChild(canvas);
    }

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    /* Si le canvas est dans un parent (mobile), prendre ses dimensions */
    if (canvas.parentElement && canvas.parentElement.id === 'heroMobile') {
      canvas.width  = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    } else {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function removeCanvas() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (canvas)    {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; ctx = null;
    }
    particles = [];
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function spawnParticle(cfg) {
    var W = window.innerWidth;
    var H = window.innerHeight;
    var size = rand(cfg.size[0], cfg.size[1]);
    var vx   = rand(cfg.speedX[0], cfg.speedX[1]);
    var vy   = rand(cfg.speedY[0], cfg.speedY[1]);
    var x, y;

    if (cfg.type === 'spider') {
      x = rand(size, W - size);
      y = -size;
    } else if (cfg.startRight) {
      x = W + size;
      y = rand(0, H * 0.65);
    } else if (cfg.floatUp) {
      x = rand(size, W - size);
      y = H + size;
    } else {
      x = rand(0, W);
      y = -size;
    }

    return {
      cfg      : cfg,
      emoji    : cfg.emoji,
      x        : x,
      y        : y,
      vx       : vx,
      vy       : vy,
      size     : size,
      alpha    : rand(0.55, 0.95),
      wobble   : cfg.wobble,
      wt       : rand(0, Math.PI * 2),
      thread   : cfg.thread || false,
      floatUp  : cfg.floatUp || false,
      startRight: cfg.startRight || false,
      rot      : rand(0, Math.PI * 2),
      rotSpd   : rand(-0.03, 0.03)
    };
  }

  function initParticles(themeCfg) {
    particles = [];
    if (!themeCfg || !themeCfg.particles) return;
    themeCfg.particles.forEach(function (cfg) {
      for (var i = 0; i < cfg.count; i++) {
        var p = spawnParticle(cfg);
        /* Répartir les positions initiales */
        if (!cfg.floatUp && !cfg.startRight && cfg.type !== 'spider') {
          p.y = rand(-p.size, window.innerHeight * 1.2);
        }
        if (cfg.floatUp) {
          p.y = rand(window.innerHeight * 0.2, window.innerHeight + p.size);
        }
        particles.push(p);
      }
    });
  }

  /* Fade-out progressif après FADE_AFTER ms, durée FADE_DURATION ms */
  var FADE_AFTER    = 15000; /* 15s avant de commencer à disparaître */
  var FADE_DURATION = 4000;  /* 4s pour disparaître complètement */
  var fadeStartTime = null;
  var masterAlpha   = 1;

  function drawLoop() {
    if (!ctx || !canvas) return;
    var W = canvas.width;
    var H = canvas.height;

    /* Calcul du fade global */
    if (fadeStartTime === null) fadeStartTime = Date.now();
    var elapsed = Date.now() - fadeStartTime;
    if (elapsed >= FADE_AFTER + FADE_DURATION) {
      /* Complètement fondu : on arrête tout proprement */
      removeCanvas();
      return;
    } else if (elapsed > FADE_AFTER) {
      /* En train de fondre */
      masterAlpha = 1 - (elapsed - FADE_AFTER) / FADE_DURATION;
    } else {
      masterAlpha = 1;
    }

    ctx.clearRect(0, 0, W, H);

    particles.forEach(function (p) {
      /* Mouvement */
      p.wt += 0.025;
      if (p.wobble) p.x += Math.sin(p.wt) * 0.7;
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotSpd;

      /* Dessin fil araignée */
      if (p.thread) {
        ctx.save();
        ctx.strokeStyle = 'rgba(180,180,180,' + (0.45 * masterAlpha) + ')';
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, Math.max(0, p.y - p.size / 2));
        ctx.stroke();
        ctx.restore();
      }

      /* Dessin emoji */
      ctx.save();
      ctx.globalAlpha   = p.alpha * masterAlpha;
      ctx.font          = Math.round(p.size) + 'px serif';
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      /* Recycle si hors écran */
      var out = false;
      if (p.floatUp   && p.y < -p.size)       out = true;
      if (!p.floatUp  && !p.startRight && p.y > H + p.size) out = true;
      if (p.startRight && p.x < -p.size)       out = true;
      if (p.thread    && p.y > H + p.size)     out = true;

      if (out) {
        var fresh = spawnParticle(p.cfg);
        Object.assign(p, fresh);
      }
    });

    animFrame = requestAnimationFrame(drawLoop);
  }

  /* ====================================================
     ACTIVER / DÉSACTIVER
  ==================================================== */

  function disableEffects() {
    isDisabled = true;
    removeCanvas();
    try { localStorage.setItem('dameyo_effects', 'off'); } catch(e) {}
  }

  function enableEffects() {
    isDisabled = false;
    try { localStorage.removeItem('dameyo_effects'); } catch(e) {}
    if (currentTheme !== 'default' && THEMES[currentTheme]) {
      fadeStartTime = null;
      masterAlpha   = 1;
      createCanvas();
      initParticles(THEMES[currentTheme]);
      drawLoop();
    }
  }


  /* ====================================================
     LOGO DYNAMIQUE — superposition canvas sur le logo img
     Chaque thème ajoute un décor autour/sur le logo :
       noel      : flocon + bonnet rouge
       galette   : couronne dorée
       ramadan   : croissant + étoile
       halloween : toile d'araignée + chauve-souris
       ete       : lunettes de soleil + soleil
  ==================================================== */

  var logoCanvas    = null;
  var logoCtx       = null;
  var logoAnim      = null;
  var logoAnimT     = 0;

  function removeLogo() {
    if (logoAnim)   { cancelAnimationFrame(logoAnim); logoAnim = null; }
    if (logoCanvas) { logoCanvas.parentNode && logoCanvas.parentNode.removeChild(logoCanvas); logoCanvas = null; logoCtx = null; }
  }

  function initLogoDeco(themeName) {
    removeLogo();
    if (!themeName || themeName === 'default') return;

    /* Trouver toutes les images logo (navbar + footer) */
    var logos = document.querySelectorAll('.navbar__logo img, .footer__logo');
    if (!logos.length) return;

    /* On décore le logo de la navbar uniquement (le plus visible) */
    var img = logos[0];
    var wrap = img.parentElement;

    /* Wrapper positionné */
    wrap.style.position = 'relative';
    wrap.style.display  = 'inline-flex';
    wrap.style.alignItems = 'center';

    logoCanvas = document.createElement('canvas');
    logoCanvas.id = 'dameyo-logo-canvas';
    logoCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;overflow:visible';
    wrap.appendChild(logoCanvas);
    logoCtx = logoCanvas.getContext('2d');

    function resizeLogo() {
      if (!logoCanvas || !img) return;
      /* Canvas un peu plus grand pour les décorations qui débordent */
      logoCanvas.width  = img.offsetWidth  + 40;
      logoCanvas.height = img.offsetHeight + 40;
      logoCanvas.style.left   = '-20px';
      logoCanvas.style.top    = '-20px';
      logoCanvas.style.width  = (img.offsetWidth  + 40) + 'px';
      logoCanvas.style.height = (img.offsetHeight + 40) + 'px';
    }

    resizeLogo();
    window.addEventListener('resize', resizeLogo);

    function drawLogoDecos() {
      if (!logoCtx || !logoCanvas) return;
      var W  = logoCanvas.width;
      var H  = logoCanvas.height;
      var cx = W / 2;
      var cy = H / 2;
      logoCtx.clearRect(0, 0, W, H);
      logoAnimT += 0.025;

      var t   = logoAnimT;
      var fs  = Math.max(12, Math.round(img.offsetHeight * 0.55));

      if (themeName === 'noel') {
        /* Flocons qui tombent autour du logo */
        logoCtx.font         = fs * 0.6 + 'px serif';
        logoCtx.textAlign    = 'center';
        logoCtx.textBaseline = 'middle';

        var flakes = [
          { ox: -0.45, oy: -0.5,  phase: 0    },
          { ox:  0.48, oy: -0.45, phase: 1.2  },
          { ox: -0.5,  oy:  0.3,  phase: 2.1  },
          { ox:  0.44, oy:  0.4,  phase: 0.7  },
          { ox:  0.1,  oy: -0.52, phase: 1.8  }
        ];
        flakes.forEach(function(f) {
          var bounce = Math.sin(t + f.phase) * 3;
          logoCtx.globalAlpha = 0.7 + Math.sin(t + f.phase) * 0.3;
          logoCtx.fillText('❄️', cx + f.ox * W * 0.5, cy + f.oy * H * 0.5 + bounce);
        });

        /* Bonnet rouge en haut à gauche du logo */
        logoCtx.font         = fs * 0.85 + 'px serif';
        logoCtx.globalAlpha  = 0.9;
        logoCtx.save();
        logoCtx.translate(cx - W * 0.28, cy - H * 0.42);
        logoCtx.rotate(-0.35 + Math.sin(t * 0.4) * 0.06);
        logoCtx.fillText('🎅', 0, 0);
        logoCtx.restore();

      } else if (themeName === 'galette') {
        /* Couronne dorée au-dessus */
        logoCtx.font         = fs * 0.95 + 'px serif';
        logoCtx.textAlign    = 'center';
        logoCtx.textBaseline = 'middle';
        logoCtx.globalAlpha  = 0.88 + Math.sin(t) * 0.12;
        var crownY = cy - H * 0.48 + Math.sin(t * 0.7) * 2;
        logoCtx.fillText('👑', cx, crownY);

        /* Pièces flottantes */
        logoCtx.font = fs * 0.5 + 'px serif';
        [[0.44, -0.3, 0], [-0.44, -0.25, 1.5]].forEach(function(c) {
          logoCtx.globalAlpha = 0.65 + Math.sin(t + c[2]) * 0.2;
          logoCtx.fillText('🪙', cx + c[0]*W*0.5, cy + c[1]*H*0.5 + Math.sin(t+c[2])*3);
        });

      } else if (themeName === 'ramadan') {
        /* Croissant à droite du logo */
        logoCtx.font         = fs * 0.9 + 'px serif';
        logoCtx.textAlign    = 'center';
        logoCtx.textBaseline = 'middle';
        logoCtx.globalAlpha  = 0.85 + Math.sin(t * 0.6) * 0.15;
        var moonX = cx + W * 0.5 - 4 + Math.sin(t * 0.5) * 2;
        var moonY = cy - H * 0.15 + Math.sin(t * 0.8) * 2;
        logoCtx.fillText('🌙', moonX, moonY);

        /* Étoiles scintillantes */
        logoCtx.font = fs * 0.45 + 'px serif';
        [[0.35, -0.48, 0], [-0.42, -0.4, 1.3], [0.48, 0.3, 0.7]].forEach(function(s) {
          logoCtx.globalAlpha = 0.4 + Math.abs(Math.sin(t * 1.5 + s[2])) * 0.55;
          logoCtx.fillText('✨', cx + s[0]*W*0.5, cy + s[1]*H*0.5);
        });

      } else if (themeName === 'halloween') {
        /* Toile d'araignée coin haut-gauche */
        logoCtx.globalAlpha = 0.55 + Math.sin(t * 0.5) * 0.1;
        logoCtx.font        = fs * 0.8 + 'px serif';
        logoCtx.textAlign   = 'center';
        logoCtx.textBaseline= 'middle';
        logoCtx.fillText('🕸️', cx - W * 0.42, cy - H * 0.38);

        /* Araignée qui se balance sur un fil */
        var spiderX = cx + W * 0.38 + Math.sin(t * 0.9) * 8;
        var spiderY = cy - H * 0.5 + 10 + Math.abs(Math.sin(t * 0.5)) * 12;
        logoCtx.strokeStyle = 'rgba(200,200,200,0.4)';
        logoCtx.lineWidth   = 0.8;
        logoCtx.globalAlpha = 0.5;
        logoCtx.beginPath();
        logoCtx.moveTo(spiderX, 0);
        logoCtx.lineTo(spiderX, spiderY - fs * 0.3);
        logoCtx.stroke();
        logoCtx.globalAlpha = 0.85;
        logoCtx.font        = fs * 0.6 + 'px serif';
        logoCtx.fillText('🕷️', spiderX, spiderY);

        /* Chauve-souris */
        logoCtx.font        = fs * 0.65 + 'px serif';
        logoCtx.globalAlpha = 0.75 + Math.sin(t * 1.2) * 0.2;
        logoCtx.save();
        logoCtx.translate(cx - W * 0.38, cy - H * 0.44 + Math.sin(t * 0.8) * 4);
        logoCtx.rotate(Math.sin(t * 0.6) * 0.15);
        logoCtx.fillText('🦇', 0, 0);
        logoCtx.restore();

      } else if (themeName === 'ete') {
        /* Lunettes de soleil sur le logo */
        logoCtx.font         = fs * 1.05 + 'px serif';
        logoCtx.textAlign    = 'center';
        logoCtx.textBaseline = 'middle';
        logoCtx.globalAlpha  = 0.92;
        /* Légère oscillation comme si elles tombaient */
        logoCtx.save();
        logoCtx.translate(cx, cy + H * 0.05);
        logoCtx.rotate(Math.sin(t * 0.4) * 0.04);
        logoCtx.fillText('🕶️', 0, 0);
        logoCtx.restore();

        /* Petit soleil en haut à droite */
        logoCtx.font = fs * 0.75 + 'px serif';
        logoCtx.globalAlpha = 0.8 + Math.sin(t * 0.9) * 0.2;
        logoCtx.save();
        logoCtx.translate(cx + W * 0.44, cy - H * 0.38);
        logoCtx.rotate(t * 0.2);
        logoCtx.fillText('☀️', 0, 0);
        logoCtx.restore();

        /* Vague en bas */
        logoCtx.font        = fs * 0.55 + 'px serif';
        logoCtx.globalAlpha = 0.6 + Math.sin(t * 0.7) * 0.2;
        logoCtx.fillText('🌊', cx - W * 0.35, cy + H * 0.46 + Math.sin(t) * 2);
        logoCtx.fillText('🌊', cx + W * 0.25, cy + H * 0.46 + Math.sin(t + 1) * 2);
      }

      logoAnim = requestAnimationFrame(drawLogoDecos);
    }

    drawLogoDecos();
  }

  /* ====================================================
     APPLICATION DU THÈME
  ==================================================== */

  var ALL_CLASSES = ['theme-noel','theme-galette','theme-ramadan','theme-halloween','theme-ete'];

  function applyTheme(name) {
    var html     = document.documentElement;
    currentTheme = name;

    ALL_CLASSES.forEach(function (c) { html.classList.remove(c); });
    removeCanvas();

    var cfg = THEMES[name];

    if (name !== 'default' && cfg) {
      html.classList.add('theme-' + name);

      /* Logo décoré */
      initLogoDeco(name);

      document.querySelectorAll('.seasonal-banner__emoji').forEach(function (el) { el.textContent = cfg.bannerEmoji; });
      document.querySelectorAll('.seasonal-banner__text').forEach(function (el)  { el.textContent = cfg.bannerText;  });
      document.querySelectorAll('.hero-slide-content__eyebrow, .hero-mobile__eyebrow').forEach(function (el) {
        el.textContent = cfg.eyebrow;
      });

      if (!isDisabled) {
        fadeStartTime = null; /* repart à zéro à chaque activation */
        masterAlpha   = 1;
        createCanvas();
        initParticles(cfg);
        drawLoop();
      }
    } else {
      /* Retirer le logo décoré */
      removeLogo();
      /* Reset textes thème default */
      document.querySelectorAll('.seasonal-banner__emoji').forEach(function (el) { el.textContent = ''; });
      document.querySelectorAll('.seasonal-banner__text').forEach(function (el)  { el.textContent = ''; });
      document.querySelectorAll('.hero-slide-content__eyebrow, .hero-mobile__eyebrow').forEach(function (el) {
        el.textContent = 'Fast-food à votre service';
      });
    }

  }

  /* ====================================================
     INIT
  ==================================================== */

  function init() {
    var forced  = null;
    var effects = null;
    try { forced  = localStorage.getItem('dameyo_theme');   } catch(e) {}
    try { effects = localStorage.getItem('dameyo_effects'); } catch(e) {}

    isDisabled = (effects === 'off');

    applyTheme(forced || detectTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ====================================================
     API PUBLIQUE
  ==================================================== */
  window.DameyoTheme = {
    set    : function (n) { try { localStorage.setItem('dameyo_theme', n); } catch(e) {} applyTheme(n); },
    reset  : function ()  { try { localStorage.removeItem('dameyo_theme'); } catch(e) {} applyTheme(detectTheme()); },
    disable: disableEffects,
    enable : enableEffects,
    current: function ()  { return currentTheme; }
  };

})();
