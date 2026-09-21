import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 32;

const DOT_LIGHT = "rgba(99, 102, 241, 0.34)";
const DOT_DARK = "rgba(129, 140, 248, 0.42)";

type Dot = {
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  sway: number;
};

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let animationId: number | null = null;
    let time = 0;

    const random = (min: number, max: number) => {
      return min + Math.random() * (max - min);
    };

    const isInsideTextZone = (x: number, y: number) => {
      const xMin = width * 0.2;
      const xMax = width * 0.8;
      const yMin = height * 0.3;
      const yMax = height * 0.7;

      return (
        x > xMin &&
        x < xMax &&
        y > yMin &&
        y < yMax
      );
    };

    const createDot = (): Dot => {
      const isLeftSide = Math.random() < 0.5;

      const x = isLeftSide
        ? random(20, width * 0.25)
        : random(width * 0.75, width - 20);

      const y = random(0, height);

      return {
        x,
        y,
        r: random(1.6, 2.8),
        speedY: random(0.04, 0.12),
        speedX: random(-0.02, 0.02),
        sway: random(0.4, 1.1),
      };
    };

    const createDots = () => {
      dots = Array.from(
        { length: PARTICLE_COUNT },
        createDot
      );
    };

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      if (dots.length === 0) {
        createDots();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark =
        document.documentElement.classList.contains("dark");

      ctx.fillStyle = isDark
        ? DOT_DARK
        : DOT_LIGHT;

      for (const dot of dots) {
        const x =
          dot.x +
          Math.sin(
            time * 0.003 + dot.y * 0.01
          ) *
          dot.sway *
          8;

        ctx.beginPath();

        ctx.arc(
          x,
          dot.y,
          dot.r,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    };

    const animate = () => {
      time++;

      for (const dot of dots) {
        dot.y -= dot.speedY;

        dot.x +=
          dot.speedX +
          Math.sin(
            time * 0.002 + dot.y * 0.005
          ) *
          0.03;

        if (dot.y < -10) {
          dot.y = height + 10;
        }

        if (dot.x < -10) {
          dot.x = width + 10;
        }

        if (dot.x > width + 10) {
          dot.x = -10;
        }
      }

      draw();

      animationId =
        requestAnimationFrame(animate);
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    if (reducedMotion) {
      draw();
    } else {
      animationId =
        requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="hero-glow"
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="hero-particles"
      />
    </>
  );
}