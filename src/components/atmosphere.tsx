import { useEffect, useRef } from "react";

const RAYS = 16;
const DOTS = 42;

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 };
    const dots = Array.from({ length: DOTS }, () => ({
      angle: Math.random() * Math.PI * 2,
      depth: 0.2 + Math.random() * 0.8,
      speed: 0.00022 + Math.random() * 0.00035,
      size: 0.7 + Math.random() * 1.1,
    }));

    let frame = 0;
    let alive = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = event.clientY / window.innerHeight;
    };

    const onScroll = () => {
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };

    const draw = (time: number) => {
      if (!alive) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      const cx = w * (0.5 + (pointer.x - 0.5) * 0.06);
      const cy = h * (0.36 + (pointer.y - 0.5) * 0.04);

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
      glow.addColorStop(0, "rgba(61, 207, 142, 0.14)");
      glow.addColorStop(0.4, "rgba(61, 207, 142, 0.045)");
      glow.addColorStop(1, "rgba(61, 207, 142, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      if (!reduce) {
        const drift = time * 0.000015;
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(61, 207, 142, 0.22)";
        ctx.shadowBlur = 10;
        for (let i = 0; i < RAYS; i++) {
          const angle = (i / RAYS) * Math.PI * 2 + drift;
          ctx.strokeStyle = "rgba(61, 207, 142, 0.16)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * w * 1.2, cy + Math.sin(angle) * h * 1.2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        for (const dot of dots) {
          dot.depth -= dot.speed;
          if (dot.depth < 0.05) {
            dot.depth = 1;
            dot.angle = Math.random() * Math.PI * 2;
          }
          const reach = dot.depth * Math.max(w, h) * 0.78;
          const x = cx + Math.cos(dot.angle) * reach;
          const y = cy + Math.sin(dot.angle) * reach * 0.7;
          ctx.fillStyle = `rgba(210, 242, 224, ${(1 - dot.depth) * 0.55})`;
          ctx.fillRect(x, y, dot.size, dot.size);
        }
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    draw(performance.now());

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
      <div ref={barRef} aria-hidden className="scroll-progress" />
    </>
  );
}
