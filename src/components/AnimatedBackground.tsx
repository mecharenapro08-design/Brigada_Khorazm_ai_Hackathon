import React, { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  theme?: "light" | "dark";
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme = "dark" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<"light" | "dark">(theme);

  // Keep themeRef updated and sync with classList
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const SYMBOLS = [
      "E=mc²",
      "π",
      "∑",
      "√x",
      "c²=a²+b²",
      "AI",
      "λ",
      "∞",
      "f(x)",
      "H₂O",
      "Ω",
      "Δt",
      "{ }",
      "</>",
      "∫dx",
      "sin(θ)",
      "NaCl",
      "F=ma",
      "hv",
      "CO₂",
      "lim x→0",
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      symbol: string;
      isSymbol: boolean;
      opacity: number;
      baseOpacity: number;
      color: string;
      glowColor: string;
      rotation: number;
      rotSpeed: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
    }

    // Rich deep blue / cyan / indigo palette
    const DARK_COLORS = [
      { fill: "rgba(56, 189, 248, ", glow: "#38bdf8" }, // Sky cyan
      { fill: "rgba(96, 165, 250, ", glow: "#60a5fa" }, // Blue
      { fill: "rgba(129, 140, 248, ", glow: "#818cf8" }, // Indigo
      { fill: "rgba(45, 212, 191, ", glow: "#2dd4bf" }, // Teal
      { fill: "rgba(167, 139, 250, ", glow: "#a78bfa" }, // Purple
      { fill: "rgba(147, 197, 253, ", glow: "#93c5fd" }, // Ice blue
    ];

    const LIGHT_COLORS = [
      { fill: "rgba(37, 99, 235, ", glow: "#2563eb" },
      { fill: "rgba(14, 165, 233, ", glow: "#0ea5e9" },
      { fill: "rgba(79, 70, 229, ", glow: "#4f46e5" },
      { fill: "rgba(13, 148, 136, ", glow: "#0d9488" },
    ];

    const particleCount = 52;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const isSymbol = i % 2 === 0;
      const themeColor = DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)];
      const baseOpacity = isSymbol ? Math.random() * 0.45 + 0.45 : Math.random() * 0.4 + 0.3;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSymbol ? Math.floor(Math.random() * 6) + 14 : Math.random() * 2.5 + 2,
        vx: (Math.random() - 0.5) * 0.55,
        vy: -(Math.random() * 0.45 + 0.2),
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        isSymbol,
        opacity: baseOpacity,
        baseOpacity,
        color: themeColor.fill,
        glowColor: themeColor.glow,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.007,
      };
    });

    // Ambient accent glowing orbs (cyan & indigo)
    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: 380, color: "rgba(99, 102, 241, 0.22)", vx: 0.18, vy: 0.14 }, // Indigo accent
      { x: width * 0.8, y: height * 0.35, r: 400, color: "rgba(6, 182, 212, 0.20)", vx: -0.16, vy: 0.18 }, // Cyan accent
      { x: width * 0.5, y: height * 0.75, r: 360, color: "rgba(168, 85, 247, 0.18)", vx: 0.14, vy: -0.16 }, // Violet accent
      { x: width * 0.88, y: height * 0.85, r: 320, color: "rgba(14, 165, 233, 0.18)", vx: -0.14, vy: 0.12 }, // Sky accent
    ];

    let shootingStars: ShootingStar[] = [];
    let lastSpawnTime = Date.now();

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.85 + width * 0.05,
        y: Math.random() * (height * 0.35),
        len: Math.random() * 140 + 90,
        speed: Math.random() * 9 + 14,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 0.95,
        life: 0,
        maxLife: Math.random() * 30 + 40,
      });
    };

    const render = () => {
      // Check current theme or DOM state
      const isLight =
        themeRef.current === "light" &&
        !document.documentElement.classList.contains("dark");

      if (isLight) {
        // Pure crisp snow-white background (faqat oppoq oq fon)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        const centerGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.35,
          40,
          width * 0.5,
          height * 0.35,
          Math.max(width, height) * 0.75
        );
        centerGlow.addColorStop(0, "#ffffff");
        centerGlow.addColorStop(0.8, "#ffffff");
        centerGlow.addColorStop(1, "#ffffff");
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, width, height);
      } else {
        // True deep black background (qora esa qora) with subtle ambient indigo/cyan color accents
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        const centerGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.35,
          60,
          width * 0.5,
          height * 0.45,
          Math.max(width, height) * 0.85
        );
        // Subtle ambient indigo and cyan glowing colors on pure black
        centerGlow.addColorStop(0, "rgba(30, 27, 75, 0.4)"); // Subtle deep indigo glow
        centerGlow.addColorStop(0.35, "rgba(8, 47, 73, 0.3)"); // Subtle deep cyan glow
        centerGlow.addColorStop(0.75, "rgba(2, 6, 23, 0.7)"); // Dark edge blend
        centerGlow.addColorStop(1, "#000000"); // Pure pitch black edge
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Render glowing deep blue / cyan orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -150 || orb.x > width + 150) orb.vx *= -1;
        if (orb.y < -150 || orb.y > height + 150) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        if (isLight) {
          grad.addColorStop(0, orb.color.replace(/[\d\.]+\)$/, "0.06)"));
          grad.addColorStop(0.6, orb.color.replace(/[\d\.]+\)$/, "0.015)"));
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          grad.addColorStop(0, orb.color);
          grad.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, "0.08)"));
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Constellation lines between particles (blue/cyan glowing grid mesh)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const alpha = (1 - dist / 135) * (isLight ? 0.18 : 0.4);
            ctx.strokeStyle = isLight
              ? `rgba(37, 99, 235, ${alpha})`
              : `rgba(56, 189, 248, ${alpha})`; // Glowing cyan-blue constellation line
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Render floating particles and formulas
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotSpeed;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < 160) {
          const force = (1 - distToMouse / 160) * 2.2;
          p.x += (dx / distToMouse) * force;
          p.y += (dy / distToMouse) * force;
          p.opacity = Math.min(1, p.baseOpacity + 0.35);

          // Glowing laser connection to user cursor in electric blue/cyan
          ctx.strokeStyle = isLight
            ? `rgba(37, 99, 235, ${(1 - distToMouse / 160) * 0.35})`
            : `rgba(56, 189, 248, ${(1 - distToMouse / 160) * 0.5})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        } else {
          p.opacity = p.baseOpacity;
        }

        // Wrap edges smoothly
        if (p.y < -40) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isSymbol) {
          ctx.font = `bold ${p.size}px 'Outfit', 'Inter', monospace, sans-serif`;
          ctx.shadowColor = isLight ? "rgba(37, 99, 235, 0.25)" : p.glowColor;
          ctx.shadowBlur = isLight ? 4 : 14;
          ctx.fillStyle = isLight
            ? `rgba(30, 64, 175, ${p.opacity * 0.9})`
            : `${p.color}${p.opacity})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.symbol, 0, 0);
        } else {
          ctx.shadowColor = isLight ? "rgba(37, 99, 235, 0.25)" : p.glowColor;
          ctx.shadowBlur = isLight ? 4 : 12;
          ctx.fillStyle = isLight
            ? `rgba(37, 99, 235, ${p.opacity * 0.75})`
            : `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = isLight
            ? `rgba(37, 99, 235, ${p.opacity})`
            : `rgba(255, 255, 255, ${p.opacity * 0.95})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Shooting stars across the sky
      const now = Date.now();
      if (now - lastSpawnTime > 2800) {
        spawnShootingStar();
        lastSpawnTime = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life++;

        const currentOpacity = star.opacity * (1 - star.life / star.maxLife);

        ctx.save();
        ctx.strokeStyle = isLight
          ? `rgba(37, 99, 235, ${currentOpacity * 0.7})`
          : `rgba(186, 230, 253, ${currentOpacity})`; // Bright cyan-white trail
        ctx.lineWidth = 2.2;
        ctx.shadowColor = isLight ? "#3b82f6" : "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.len,
          star.y - Math.sin(star.angle) * star.len
        );
        ctx.stroke();
        ctx.restore();

        if (star.life >= star.maxLife || star.x > width + 200 || star.y > height + 200) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isDark =
    theme === "dark" ||
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#050c1e]" : "bg-white"
      }`}
    >
      {/* Interactive animated canvas (stars, formulas, constellation mesh, glowing orbs) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Futuristic Deep Blue Sci-Fi Grid Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isDark ? "opacity-[0.18]" : "opacity-[0.05]"
        }`}
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(56, 189, 248, 0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.22) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(99, 102, 241, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.18) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Radial Deep Midnight Vignette (Dark only, completely clear on light) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isDark
            ? "bg-radial from-transparent via-[#050c1e]/30 to-[#040817]/85"
            : "bg-transparent"
        }`}
      />
    </div>
  );
};
