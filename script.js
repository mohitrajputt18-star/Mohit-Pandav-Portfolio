/* ═══════════════════════════════════════════
   MOHIT PANDAV — PORTFOLIO JAVASCRIPT
   Canvas Particles · Simple Cursor · 3D Tilt
   Scroll Animations · Stats Counter · Timeline
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Environment Checks ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = window.innerWidth < 768;

  // ═══════════════════════════════════════════
  // 1. PAGE LOAD ANIMATION SEQUENCE
  // ═══════════════════════════════════════════
  function initLoadSequence() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero-title .word, .availability-tag, .hero-subtitle, .btn-primary, .btn-secondary, .scroll-indicator, .navbar')
        .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      document.querySelector('.navbar').classList.add('visible');
      return;
    }

    const navbar = document.getElementById('navbar');
    const tag = document.getElementById('availability-tag');
    const words = document.querySelectorAll('.hero-title .word');
    const subtitle = document.getElementById('hero-subtitle');
    const cta1 = document.getElementById('hero-cta1');
    const cta2 = document.getElementById('hero-cta2');
    const scrollInd = document.getElementById('scroll-indicator');

    setTimeout(() => { navbar.classList.add('visible'); }, 100);

    setTimeout(() => {
      tag.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      tag.style.opacity = '1';
      tag.style.transform = 'translateY(0)';
    }, 300);

    words.forEach((word, i) => {
      setTimeout(() => {
        word.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
      }, 500 + i * 80);
    });

    setTimeout(() => {
      subtitle.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, 900);

    setTimeout(() => {
      cta1.style.transition = 'opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, box-shadow 0.2s ease';
      cta1.style.opacity = '1';
      cta1.style.transform = 'scale(1)';
    }, 1050);

    setTimeout(() => {
      cta2.style.transition = 'opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background 0.2s ease';
      cta2.style.opacity = '1';
      cta2.style.transform = 'scale(1)';
    }, 1130);

    setTimeout(() => {
      scrollInd.style.transition = 'opacity 0.3s ease';
      scrollInd.style.opacity = '1';
    }, 1100);
  }

  // ═══════════════════════════════════════════
  // 2. CANVAS 2D PARTICLE FIELD (Hero)
  // ═══════════════════════════════════════════
  function initParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    let W, H;
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const particleCount = isMobile ? 600 : 1200;
    const particles = [];

    // Generate </> symbol shape target points
    function getSymbolTargets() {
      const targets = [];
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) * 0.25;

      // '<' character — vertex on left, ends on right
      for (let i = 0; i < particleCount * 0.23; i++) {
        const t = Math.random();
        const p = Math.random();
        let x, y;
        if (t < 0.5) {
          x = cx - scale * 0.9 + p * scale * 0.5;
          y = cy - scale * 0.5 * p;
        } else {
          x = cx - scale * 0.9 + p * scale * 0.5;
          y = cy + scale * 0.5 * p;
        }
        x += (Math.random() - 0.5) * 4;
        y += (Math.random() - 0.5) * 4;
        targets.push({ x, y });
      }

      // '/' character — diagonal line
      for (let i = 0; i < particleCount * 0.18; i++) {
        const t = Math.random();
        const x = cx - scale * 0.15 + t * scale * 0.3;
        const y = cy + scale * 0.5 - t * scale;
        targets.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4
        });
      }

      // '>' character — vertex on right, ends on left
      for (let i = 0; i < particleCount * 0.23; i++) {
        const t = Math.random();
        const p = Math.random();
        let x, y;
        if (t < 0.5) {
          x = cx + scale * 0.9 - p * scale * 0.5;
          y = cy - scale * 0.5 * p;
        } else {
          x = cx + scale * 0.9 - p * scale * 0.5;
          y = cy + scale * 0.5 * p;
        }
        x += (Math.random() - 0.5) * 4;
        y += (Math.random() - 0.5) * 4;
        targets.push({ x, y });
      }

      // Remaining particles: ambient scatter
      while (targets.length < particleCount) {
        targets.push({
          x: Math.random() * W,
          y: Math.random() * H
        });
      }

      return targets;
    }

    let targets = getSymbolTargets();

    // Initialize particles at center
    for (let i = 0; i < particleCount; i++) {
      const isLime = Math.random() < 0.12;
      particles.push({
        x: W / 2,
        y: H / 2,
        tx: targets[i].x,
        ty: targets[i].y,
        vx: 0,
        vy: 0,
        size: isLime ? (1.5 + Math.random()) : (0.8 + Math.random() * 1.2),
        color: isLime ? 'rgba(200, 240, 90, 0.8)' : 'rgba(245, 245, 240, 0.35)',
        isLime: isLime,
        delay: Math.random() * 0.3,
        damping: 0.88 + Math.random() * 0.07,
        isSymbol: i < particleCount * 0.64,
      });
    }

    // Mouse tracking
    const mouse = { x: -1000, y: -1000, active: false };
    parent.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    parent.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
    parent.addEventListener('click', () => {
      if (window.innerWidth < 768) return;
      // Explosion
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.min(15, 300 / dist);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      });
    });

    let time = 0;
    let spawned = false;
    let spawnStart = 0;

    setTimeout(() => { spawned = true; spawnStart = performance.now(); }, 800);

    function animate() {
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      if (!spawned) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = (performance.now() - spawnStart) / 1000;

      particles.forEach((p, i) => {
        // Spawn easing
        const spawnProgress = Math.min(1, Math.max(0, (elapsed - p.delay) / 1.2));
        const ease = 1 - Math.pow(1 - spawnProgress, 3);

        // Noise-based drift for symbol particles
        let noiseX = 0, noiseY = 0;
        if (p.isSymbol) {
          noiseX = Math.sin(time * 0.3 + i * 0.1) * 3;
          noiseY = Math.cos(time * 0.25 + i * 0.08) * 3;
        } else {
          noiseX = Math.sin(time * 0.15 + i * 0.05) * 8;
          noiseY = Math.cos(time * 0.12 + i * 0.07) * 8;
        }

        const targetX = p.tx + noiseX;
        const targetY = p.ty + noiseY;

        if (spawnProgress < 1) {
          // Fly from center to target
          p.x = W / 2 + (targetX - W / 2) * ease;
          p.y = H / 2 + (targetY - H / 2) * ease;
        } else {
          // Spring physics toward target
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          p.vx += dx * 0.02;
          p.vy += dy * 0.02;
          p.vx *= p.damping;
          p.vy *= p.damping;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Mouse repulsion (desktop)
        if (mouse.active && window.innerWidth >= 768) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const repelRadius = 80;
          if (mDist < repelRadius) {
            const force = (repelRadius - mDist) / repelRadius;
            p.vx += (mdx / mDist) * force * 2.5;
            p.vy += (mdy / mDist) * force * 2.5;
          }
        }

        // Draw particle
        const alpha = spawnProgress;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isLime
          ? `rgba(200, 240, 90, ${0.8 * alpha})`
          : `rgba(245, 245, 240, ${0.35 * alpha})`;
        ctx.fill();

        // Glow for lime particles
        if (p.isLime && alpha > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 240, 90, ${0.06 * alpha})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        targets = getSymbolTargets();
        particles.forEach((p, i) => {
          if (targets[i]) {
            p.tx = targets[i].x;
            p.ty = targets[i].y;
          }
        });
      }, 250);
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        spawnStart = performance.now() - 2000;
      }
    });
  }

  // ═══════════════════════════════════════════
  // 3. ABOUT SECTION — CANVAS 2D WIREFRAME
  // ═══════════════════════════════════════════
  function initAboutShape() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let size = canvas.clientWidth || (window.innerWidth < 768 ? 220 : 340);
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resizeAboutCanvas() {
      size = canvas.clientWidth || (window.innerWidth < 768 ? 220 : 340);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeAboutCanvas();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeAboutCanvas, 100);
    });

    // Icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];
    const edges = [
      [0,1],[0,5],[0,7],[0,10],[0,11],
      [1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],
      [3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,8],[7,10],
      [8,9],
      [10,11]
    ];

    let rotY = 0, rotX = 0;
    let hovered = false;

    canvas.addEventListener('mouseenter', () => { hovered = true; });
    canvas.addEventListener('mouseleave', () => { hovered = false; });

    function project(v, rY, rX) {
      // Rotate Y
      let x = v[0] * Math.cos(rY) - v[2] * Math.sin(rY);
      let z = v[0] * Math.sin(rY) + v[2] * Math.cos(rY);
      let y = v[1];
      // Rotate X
      const y2 = y * Math.cos(rX) - z * Math.sin(rX);
      const z2 = y * Math.sin(rX) + z * Math.cos(rX);
      // Project
      const scale = size * 0.18;
      const perspective = 5;
      const factor = perspective / (perspective + z2);
      return {
        x: size / 2 + x * scale * factor,
        y: size / 2 - y2 * scale * factor,
        z: z2
      };
    }

    function drawShape() {
      ctx.clearRect(0, 0, size, size);

      const speed = hovered ? 0.012 : 0.003;
      rotY += speed;
      rotX += speed * 0.4;

      // Draw edges
      ctx.strokeStyle = 'rgba(200, 240, 90, 0.25)';
      ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        const p1 = project(verts[a], rotY, rotX);
        const p2 = project(verts[b], rotY, rotX);
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = 0.12 + (avgZ + 2) * 0.08;
        ctx.strokeStyle = `rgba(200, 240, 90, ${Math.max(0.05, Math.min(0.4, alpha))})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw vertices
      verts.forEach(v => {
        const p = project(v, rotY, rotX);
        const alpha = 0.2 + (p.z + 2) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 240, 90, ${Math.max(0.1, Math.min(0.5, alpha))})`;
        ctx.fill();
      });

      requestAnimationFrame(drawShape);
    }

    requestAnimationFrame(drawShape);
  }

  // ═══════════════════════════════════════════
  // 4. SIMPLE CURSOR ANIMATION
  // ═══════════════════════════════════════════
  function initCursor() {
    if (isTouchDevice || prefersReducedMotion || isMobile) return;

    // Create cursor elements
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    // Styles
    Object.assign(dot.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '6px',
      height: '6px',
      background: '#C8F05A',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
      mixBlendMode: 'difference',
      opacity: '0',
    });

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);

    Object.assign(ring.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '32px',
      height: '32px',
      border: '1px solid rgba(200, 240, 90, 0.3)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9998',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
      opacity: '0',
    });

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });

    // Ring follows with lag
    function updateRing() {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(updateRing);
    }
    updateRing();

    // Hover effect on interactive elements
    const interactiveEls = 'a, button, .btn-primary, .btn-secondary, .card-back-cta, .contact-main-cta, .tech-pill, .skill-pill, .card-wrapper';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveEls)) {
        dot.style.width = '10px';
        dot.style.height = '10px';
        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = 'rgba(200, 240, 90, 0.5)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveEls)) {
        dot.style.width = '6px';
        dot.style.height = '6px';
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(200, 240, 90, 0.3)';
      }
    });

    // Click feedback
    document.addEventListener('mousedown', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
      ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hide near edges
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      visible = false;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      visible = true;
    });
  }

  // ═══════════════════════════════════════════
  // 5. SCROLL ANIMATIONS (IntersectionObserver)
  // ═══════════════════════════════════════════
  function initScrollAnimations() {
    if (prefersReducedMotion) return;

    // General reveals
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    // Stats counter
    const statsSection = document.getElementById('stats');
    let statsCounted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    if (statsSection) statsObserver.observe(statsSection);

    // Project cards stagger
    const cardWrappers = document.querySelectorAll('.card-wrapper');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cardWrappers.forEach((card, i) => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 120);
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    if (cardWrappers.length > 0) cardObserver.observe(cardWrappers[0]);

    // Skill cards stagger
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillCards.forEach((card, i) => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';

              const pills = card.querySelectorAll('.skill-pill');
              pills.forEach((pill, j) => {
                const rx = (Math.random() * 60 - 30);
                const ry = (Math.random() * 30 + 20);
                pill.style.opacity = '0';
                pill.style.transform = `translate(${rx}px, ${ry}px)`;
                setTimeout(() => {
                  pill.style.transition = 'opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.15s ease, color 0.15s ease, background 0.15s ease';
                  pill.style.opacity = '1';
                  pill.style.transform = 'translate(0, 0)';
                }, j * 40);
              });
            }, i * 80);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    if (skillCards.length > 0) skillObserver.observe(skillCards[0]);

    // Stat items entry
    const statItems = document.querySelectorAll('.stat-item');
    const statItemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statItems.forEach((item, i) => {
            setTimeout(() => {
              item.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, i * 100);
          });
          statItemObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    if (statItems.length > 0) statItemObserver.observe(statItems[0]);

    initTimelineAnimation();
    initBioReveal();
    initLanguageChips();
    initContactAnimation();
  }

  // ═══════════════════════════════════════════
  // 6. STATS COUNTER
  // ═══════════════════════════════════════════
  function animateStats() {
    const items = document.querySelectorAll('.stat-item');

    items.forEach(item => {
      const el = item.querySelector('.stat-number');
      const target = parseFloat(item.dataset.target);
      const suffix = item.dataset.suffix || '';
      const decimals = parseInt(item.dataset.decimals) || 0;
      const duration = 1500;
      const start = performance.now();

      function easeOutExpo(t) {
        return 1 - Math.pow(2, -10 * t);
      }

      function update(currentTime) {
        const elapsed = currentTime - start;
        let progress = Math.min(elapsed / duration, 1);
        let easedProgress = easeOutExpo(progress);

        if (target === 100 && easedProgress > 0.8) {
          const extra = (easedProgress - 0.8) / 0.2;
          easedProgress = 0.8 + extra * extra * 0.2;
        }

        const current = easedProgress * target;
        el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
          if (suffix) {
            const suffixSpan = document.createElement('span');
            suffixSpan.className = 'suffix';
            suffixSpan.textContent = suffix;
            suffixSpan.style.display = 'inline-block';
            suffixSpan.style.transform = 'scale(0)';
            suffixSpan.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
            el.appendChild(suffixSpan);
            requestAnimationFrame(() => {
              suffixSpan.style.transform = 'scale(1)';
            });
          }

          el.style.textShadow = '0 0 20px rgba(200, 240, 90, 0.7)';
          el.style.transition = 'text-shadow 0.4s ease-out';
          setTimeout(() => { el.style.textShadow = 'none'; }, 400);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ═══════════════════════════════════════════
  // 7. 3D TILT EFFECT (Skill Cards)
  // ═══════════════════════════════════════════
  function initTilt() {
    if (isTouchDevice || prefersReducedMotion) return;

    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -(y - centerY) / centerY * 12;
        const rotateY = (x - centerX) / centerX * 12;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const inner = card.querySelector('.skill-card-header');
        if (inner) inner.style.transform = `translateZ(10px)`;

        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.04) 0%, var(--bg-surface) 80%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.background = 'var(--bg-surface)';
        const inner = card.querySelector('.skill-card-header');
        if (inner) inner.style.transform = 'translateZ(0)';
      });

      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
    });
  }

  // ═══════════════════════════════════════════
  // 8. TIMELINE ANIMATION
  // ═══════════════════════════════════════════
  function initTimelineAnimation() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const timelineFill = document.getElementById('timeline-fill');
    const dot = document.getElementById('timeline-dot-1');
    const entry = document.getElementById('timeline-entry-1');

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(obs => {
        if (obs.isIntersecting) {
          if (timelineFill) {
            timelineFill.style.transition = 'height 1s ease-in-out';
            timelineFill.style.height = '100%';
          }

          setTimeout(() => {
            if (dot) {
              dot.style.transition = 'opacity 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
              dot.style.opacity = '1';
              dot.style.transform = 'scale(1)';
            }
          }, 500);

          setTimeout(() => {
            if (entry) {
              entry.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
              entry.style.opacity = '1';
              entry.style.transform = 'translateX(0)';
            }
            const bullets = document.querySelectorAll('.exp-item');
            bullets.forEach((bullet, i) => {
              setTimeout(() => {
                bullet.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                bullet.style.opacity = '1';
                bullet.style.transform = 'translateX(0)';
              }, i * 60);
            });
          }, 700);

          timelineObserver.unobserve(obs.target);
        }
      });
    }, { threshold: 0.15 });

    timelineObserver.observe(timeline);
  }

  // ═══════════════════════════════════════════
  // 9. ABOUT — BIO WORD REVEAL
  // ═══════════════════════════════════════════
  function initBioReveal() {
    const bioEl = document.getElementById('about-bio');
    if (!bioEl) return;

    const text = bioEl.textContent.trim();
    const words = text.split(/\s+/);
    bioEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

    const wordSpans = bioEl.querySelectorAll('.word');

    const bioObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wordSpans.forEach((span, i) => {
            setTimeout(() => {
              span.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            }, i * 30);
          });
          bioObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    bioObserver.observe(bioEl);

    const eduCard = document.getElementById('edu-card');
    if (eduCard) {
      const eduObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            eduCard.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            eduCard.style.opacity = '1';
            eduCard.style.transform = 'translateY(0)';
            eduObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      eduObserver.observe(eduCard);
    }
  }

  // ═══════════════════════════════════════════
  // 10. LANGUAGE CHIPS BOUNCE
  // ═══════════════════════════════════════════
  function initLanguageChips() {
    const chips = document.querySelectorAll('.lang-chip');
    const chipObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chips.forEach((chip, i) => {
            setTimeout(() => {
              chip.style.transition = 'opacity 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, color 0.2s ease';
              chip.style.opacity = '1';
              chip.style.transform = 'translateY(0)';
            }, i * 80);
          });
          chipObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    if (chips.length > 0) chipObserver.observe(chips[0].parentElement);
  }

  // ═══════════════════════════════════════════
  // 11. CONTACT SECTION ANIMATION
  // ═══════════════════════════════════════════
  function initContactAnimation() {
    const heading = document.getElementById('contact-heading');
    const items = document.querySelectorAll('.contact-item');

    if (heading) {
      const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heading.classList.add('animate');
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
              }, 400 + i * 80);
            });
            contactObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      contactObserver.observe(heading);
    }
  }

  // ═══════════════════════════════════════════
  // 12. NAVBAR SCROLL BEHAVIOR
  // ═══════════════════════════════════════════
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    let ticking = false;

    function onScroll() {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      if (scrollIndicator && !prefersReducedMotion) {
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 300);
      }

      let currentSection = '';
      sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) {
          currentSection = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === currentSection) {
          link.classList.add('active');
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  window.closeMobile = function () {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // ═══════════════════════════════════════════
  // 13. MOBILE INTERACTIVE OVERLAYS & ACCORDIONS
  // ═══════════════════════════════════════════
  function initProjectCardsMobile() {
    const cards = document.querySelectorAll('.card-wrapper');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (window.innerWidth >= 768) return;

        const closeBtn = e.target.closest('.card-back-close');
        const ctaLink = e.target.closest('.card-back-cta');

        if (closeBtn) {
          e.stopPropagation();
          card.classList.remove('active-overlay');
          return;
        }

        if (ctaLink) {
          return;
        }

        const isFlipped = card.classList.contains('active-overlay');
        cards.forEach(c => c.classList.remove('active-overlay'));

        if (!isFlipped) {
          card.classList.add('active-overlay');
        }
      });
    });
  }

  function initSkillsAccordion() {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
      const header = card.querySelector('.skill-card-header');
      if (!header) return;

      header.addEventListener('click', () => {
        if (window.innerWidth >= 768) return;

        const isExpanded = card.classList.contains('expanded');

        cards.forEach(c => {
          c.classList.remove('expanded');
          const pills = c.querySelector('.skill-pills');
          if (pills) {
            pills.style.maxHeight = null;
            pills.style.opacity = '0';
          }
        });

        if (!isExpanded) {
          card.classList.add('expanded');
          const pills = card.querySelector('.skill-pills');
          if (pills) {
            pills.style.opacity = '1';
            pills.style.maxHeight = pills.scrollHeight + 'px';
          }
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        cards.forEach(card => {
          card.classList.remove('expanded');
          const pills = card.querySelector('.skill-pills');
          if (pills) {
            pills.style.maxHeight = null;
            pills.style.opacity = null;
          }
        });
      }
    });
  }

  // ═══════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════
  function init() {
    initLoadSequence();
    initNavbar();
    initCursor();
    initScrollAnimations();
    initTilt();
    initParticles();
    initAboutShape();
    initProjectCardsMobile();
    initSkillsAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
