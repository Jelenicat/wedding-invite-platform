import { useEffect, useRef, useState } from "react";
import { clamp } from "./legendFantasyData";

export function useScene(threshold = .08) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      node.classList.toggle("is-active", entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, seen];
}

export function Ornament({ tree = false }) {
  return tree ? <svg className="lfp-tree" viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M50 82V28m0 30C36 55 36 36 23 32m27 36C68 60 68 42 80 36M50 49C38 43 43 27 32 20m18 22c11-5 12-13 16-21M50 64C27 64 24 49 16 46m34 8c20-1 26-4 31-12M50 73c-10 11-18 13-25 15m25-15c8 10 15 13 27 15M50 28l-5-10m5 16 6-18M33 45l-16-3m19 2-3-15m35 25 13 2M40 58l-15-4"/><path d="M18 88Q50 80 82 88"/></g>{[[50,8],[26,12],[75,12],[10,28],[89,28],[9,65],[92,64]].map(([x,y],i)=><path key={i} d={`M${x} ${y-3}l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z`} fill="currentColor"/>)}</svg> : <div className="lfp-ornament" aria-hidden="true"><i/><span>✧</span><i/></div>;
}

export function Chapter({ number, label, title, children, light = false }) {
  return <header className={`lfp-heading${light ? " lfp-heading--light" : ""}`}>
    <span className="lfp-kicker">{number && <b>{number}</b>}{label}</span>
    <h2>{title}</h2><Ornament/>{children && <p>{children}</p>}
  </header>;
}

export function Motes({ count = 22 }) {
  return <div className="lfp-motes" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={{ "--x": `${(i * 37 + 9) % 100}%`, "--y": `${(i * 57 + 17) % 100}%`, "--delay": `${-i * .73}s`, "--duration": `${6 + i % 7}s` }}/>)}</div>;
}

// Only visible canvases animate. DPR is capped; particle counts stay bounded.
export function FireCanvas({ mode = "beacon", burst = 0, letters = "", className = "" }) {
  const ref = useRef(null);
  const burstRef = useRef(null);
  useEffect(() => { burstRef.current?.(); }, [burst]);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 300, h = 180, raf = 0, visible = false, last = 0, elapsed = 0, cooldown = 0, first = true;
    let particles = [], stopped = false;
    const random = (a, b) => a + Math.random() * (b - a);
    const edge = x => h * .60 + Math.sin(x / w * 27) * h * .035 + Math.sin(x / w * 67) * h * .018;
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (media.matches) staticPaint();
    };
    const glow = (x, y, size, color, alpha = 1) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, size);
      g.addColorStop(0, `rgba(${color},${alpha})`); g.addColorStop(.25, `rgba(${color},${alpha * .55})`); g.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = g; ctx.fillRect(x - size, y - size, size * 2, size * 2);
    };
    const staticPaint = () => {
      ctx.clearRect(0, 0, w, h);
      if (mode !== "fireworks") drawBase(0);
    };
    const drawBase = t => {
      ctx.globalCompositeOperation = "source-over";
      if (mode === "seam") {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, edge(0));
        for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, edge(x));
        ctx.lineTo(w, 0); ctx.closePath(); ctx.fillStyle = "#dec89d"; ctx.fill();
        const stroke = (color, width, blur) => {
          ctx.beginPath(); for (let x = 0; x <= w + 4; x += 4) x ? ctx.lineTo(x, edge(x)) : ctx.moveTo(x, edge(x));
          ctx.strokeStyle = color; ctx.lineWidth = width; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.stroke(); ctx.shadowBlur = 0;
        };
        stroke("#423121", 17, 10); stroke("#e27128", 4, 17); stroke("#ffd28a", 1.5, 8);
      } else {
        glow(w * .5, h * .73, w * .48, "237,127,30", .22);

      }
    };
    const explode = (x = w * random(.25, .75), y = h * random(.20, .42), large = false) => {
      const count = large ? 105 : 65;
      for (let i = 0; i < count; i++) {
        const a = i / count * Math.PI * 2, speed = random(28, large ? 160 : 105) * Math.min(w / 400, 1.4);
        particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, age: 0, life: random(1.6, 3), size: random(.8, 1.8), spark: true });
      }
      if (particles.length > 600) particles.splice(0, particles.length - 600);
    };
    const monogram = () => {
      if (!letters) return;
      const mask = document.createElement("canvas"); mask.width = Math.min(420, w); mask.height = 130;
      const c = mask.getContext("2d"); if (!c) return;
      c.font = `italic ${Math.min(mask.width / 3, 110)}px Georgia`; c.textAlign = "center"; c.fillStyle = "white"; c.fillText(letters, mask.width / 2, 106);
      const data = c.getImageData(0, 0, mask.width, 130).data;
      for (let y = 10; y < 125; y += 6) for (let x = 0; x < mask.width; x += 6) if (data[(y * mask.width + x) * 4 + 3] > 128) particles.push({ x: (w - mask.width) / 2 + x, y: h * .32 + y, vx: random(-2, 2), vy: random(-3, 0), age: 0, life: 4, size: 1.25, spark: true, letter: true });
    };
    burstRef.current = () => {
      if (mode !== "fireworks" || media.matches) return;
      explode(w * .24, h * .28, true); explode(w * .77, h * .24); monogram();
    };
    const tick = now => {
      raf = 0;
      if (stopped || !visible || document.hidden || media.matches) return;
      const dt = clamp((now - (last || now)) / 1000, .008, .045); last = now; elapsed += dt; cooldown -= dt;
      ctx.clearRect(0, 0, w, h);
      if (mode !== "fireworks") {
        drawBase(elapsed);
        const count = mode === "seam" ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const x = mode === "seam" ? random(0, w) : w * .5 + random(-w * .1, w * .1);
          const spark = Math.random() > .85;
          particles.push({ x, y: mode === "seam" ? edge(x) : h * .82, vx: random(-14, 14), vy: random(-30, -100), age: 0, life: random(.35, 1.3), size: spark ? random(.6, 1.6) : random(1, mode === "seam" ? 4 : 7), spark });
        }
      } else if (cooldown < 0) {
        explode(); cooldown = random(2.8, 4.4);
        if (first) { monogram(); first = false; }
      }
      ctx.globalCompositeOperation = "lighter";
      particles = particles.filter(p => p.age < p.life);
      for (const p of particles) {
        p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (mode === "fireworks") p.vy += (p.letter ? 1 : 17) * dt;
        else p.x += Math.sin(p.age * 9 + elapsed * 3) * dt * 8;
        const alpha = Math.max(0, 1 - p.age / p.life);
        if (p.spark) {
          ctx.globalAlpha = alpha; ctx.fillStyle = "#ffe7ad"; ctx.fillRect(p.x, p.y, p.size, p.size * (mode === "fireworks" ? 1.4 : 2));
        } else glow(p.x, p.y, p.size * (1 - p.age / p.life) + 1, p.age < p.life * .35 ? "255,200,90" : "228,77,13", alpha * .65);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    const sync = () => { cancelAnimationFrame(raf); raf = 0; last = 0; if (visible && !document.hidden && !media.matches) raf = requestAnimationFrame(tick); else if (media.matches) staticPaint(); };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: "60px" }) : null;
    const ro = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    resize(); ro?.observe(canvas); observer?.observe(canvas);
    if (!observer) { visible = true; sync(); }
    window.addEventListener("resize", resize); document.addEventListener("visibilitychange", sync); media.addEventListener?.("change", sync);
    return () => { stopped = true; cancelAnimationFrame(raf); observer?.disconnect(); ro?.disconnect(); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", sync); media.removeEventListener?.("change", sync); burstRef.current = null; };
  }, [mode, letters]);
  return <canvas ref={ref} className={`lfp-fire-canvas ${className}`} aria-hidden="true"/>;
}

export function BurnSeam({ reverse = false }) {
  return <div className={`lfp-burn${reverse ? " lfp-burn--reverse" : ""}`} aria-hidden="true"><FireCanvas mode="seam"/></div>;
}
