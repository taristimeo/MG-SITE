"use client";

import { useEffect, useRef, useState } from "react";
import { NAME_FRAG, VERT } from "./glsl";

/**
 * LE NOM EN GRAIN — l'ouverture du site.
 *
 * « Mauvais Grain » n'est pas écrit : il se dépose. Une poussière d'argent
 * sur la feuille se rassemble en lettres géantes, et la main qui passe les
 * disperse en grains, qui reviennent se poser. Le texte est dessiné dans un
 * canvas 2D (Gloock) et sert de masque au shader.
 */

const INK: [number, number, number] = [0.125, 0.102, 0.071];
const PAPER: [number, number, number] = [0.988, 0.984, 0.973];
const MAX_PTS = 8;

class NameRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private mask: WebGLTexture | null = null;
  private maskCanvas = document.createElement("canvas");
  private raf = 0;
  private start = performance.now();
  private settleStart = -1;
  private settle = 0;
  private pts = new Float32Array(MAX_PTS * 3);
  private ptHead = 0;
  private reduced = false;
  private paused = false;
  private dpr = 1;
  private lines: string[] = [];
  private family = "serif";

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;
    this.gl = gl;
    if (!this.build()) {
      this.gl = null;
      return;
    }
    this.loop();
  }

  get ok() {
    return this.gl !== null;
  }

  private build(): boolean {
    const gl = this.gl;
    if (!gl) return false;
    const mk = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        if (process.env.NODE_ENV !== "production") console.warn(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = mk(gl.VERTEX_SHADER, VERT);
    const fs = mk(gl.FRAGMENT_SHADER, NAME_FRAG);
    if (!vs || !fs) return false;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    this.prog = prog;
    gl.useProgram(prog);
    for (const n of ["uMask", "uRes", "uTime", "uSettle", "uReduced", "uPts", "uInk", "uPaper"]) {
      this.u[n] = gl.getUniformLocation(prog, n);
    }
    gl.uniform1i(this.u.uMask, 0);
    gl.uniform3f(this.u.uInk, ...INK);
    gl.uniform3f(this.u.uPaper, ...PAPER);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.mask = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.mask);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return true;
  }

  /** Dessine les lignes du nom dans le masque, calées à la marge et en bas. */
  setText(lines: string[], family: string) {
    this.lines = lines;
    this.family = family;
    this.drawMask();
  }

  private drawMask() {
    const gl = this.gl;
    if (!gl || !this.mask || !this.lines.length) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w < 2 || h < 2) return;
    const mc = this.maskCanvas;
    mc.width = w;
    mc.height = h;
    const ctx = mc.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    const gutter = this.cssVar("--gutter", 24) * this.dpr;
    const cssW = w / this.dpr;
    const cssH = h / this.dpr;
    // Taille : la ligne la plus longue tient dans la largeur ; plafonnée par la
    // hauteur pour que les deux lignes restent sur la feuille.
    const lineH = 0.86;
    let size = Math.min(cssW * 0.9, (cssH * 0.62) / (this.lines.length * lineH));
    ctx.font = `400 100px ${this.family}`;
    const widest = Math.max(...this.lines.map((l) => ctx.measureText(l).width)) / 100;
    size = Math.min(size, ((cssW - 2 * (gutter / this.dpr)) / widest) * 1.0);
    size = Math.max(size, 40);
    const px = size * this.dpr;

    ctx.font = `400 ${px}px ${this.family}`;
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    const bottom = h - gutter * 1.15;
    const n = this.lines.length;
    this.lines.forEach((line, i) => {
      const y = bottom - (n - 1 - i) * px * lineH;
      ctx.fillText(line, gutter - px * 0.04, y);
    });

    gl.bindTexture(gl.TEXTURE_2D, this.mask);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mc);
  }

  private cssVar(name: string, fallback: number) {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  }

  /** Lance la pose des grains. */
  begin() {
    if (this.settleStart < 0) this.settleStart = performance.now();
  }

  /** Un passage de la main. x, y en 0..1 (y vers le haut), force 0..1. */
  touch(x: number, y: number, force = 1) {
    const i = this.ptHead * 3;
    this.pts[i] = x;
    this.pts[i + 1] = y;
    this.pts[i + 2] = Math.max(this.pts[i + 2], force);
    this.ptHead = (this.ptHead + 1) % MAX_PTS;
  }

  setReduced(v: boolean) {
    this.reduced = v;
  }
  setPaused(v: boolean) {
    this.paused = v;
  }

  resize() {
    const gl = this.gl;
    if (!gl) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * this.dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * this.dpr));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    gl.viewport(0, 0, w, h);
    this.drawMask();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const gl = this.gl;
    if (!gl || !this.prog || this.paused || document.hidden) return;
    const now = performance.now();
    const t = (now - this.start) / 1000;

    if (this.settleStart >= 0) {
      const dur = this.reduced ? 400 : 2600;
      const k = Math.min(1, (now - this.settleStart) / dur);
      this.settle = 1 - Math.pow(1 - k, 3);
    }
    // Les points s'éteignent : la poussière revient se poser.
    for (let i = 2; i < this.pts.length; i += 3) this.pts[i] *= 0.955;

    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.mask);
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uTime, t);
    gl.uniform1f(this.u.uSettle, this.settle);
    gl.uniform1f(this.u.uReduced, this.reduced ? 1 : 0);
    gl.uniform3fv(this.u.uPts, this.pts);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    const gl = this.gl;
    if (!gl) return;
    if (this.mask) gl.deleteTexture(this.mask);
    if (this.prog) gl.deleteProgram(this.prog);
    this.gl = null;
  }
}

export function NameGrain({ lines = ["Mauvais", "Grain"] }: { lines?: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!canvas || !wrap || !probe) return;
    const r = new NameRenderer(canvas);
    if (!r.ok) {
      setGl(false);
      r.destroy();
      return;
    }
    let alive = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMq = () => r.setReduced(mq.matches);
    applyMq();
    mq.addEventListener("change", applyMq);

    // La police du logotype, telle que next/font l'a nommée.
    const family = getComputedStyle(probe).fontFamily;
    const primary = family.split(",")[0].trim();
    const ready: Promise<unknown> = document.fonts?.load(`400 100px ${primary}`).catch(() => undefined) ?? Promise.resolve();
    Promise.race([ready, new Promise((res) => setTimeout(res, 1500))]).then(() => {
      if (!alive) return;
      r.resize();
      r.setText(lines, family);
      setGl(true);
      r.begin();
    });

    const ro = new ResizeObserver(() => r.resize());
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => {
      r.setPaused(!e.isIntersecting);
      document.documentElement.dataset.hero = e.isIntersecting && e.intersectionRatio > 0.4 ? "1" : "0";
    }, { threshold: [0, 0.4] });
    io.observe(wrap);

    let last = { x: 0, y: 0, t: 0 };
    const touch = (clientX: number, clientY: number, force: number) => {
      const b = wrap.getBoundingClientRect();
      r.touch((clientX - b.left) / b.width, 1 - (clientY - b.top) / b.height, force);
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dt = Math.max(1, now - last.t);
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 1.2);
      last = { x: e.clientX, y: e.clientY, t: now };
      if (e.pointerType === "mouse" && !e.buttons && speed < 0.02) return;
      touch(e.clientX, e.clientY, 0.55 + 0.45 * speed);
    };
    const onDown = (e: PointerEvent) => touch(e.clientX, e.clientY, 1);
    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      alive = false;
      mq.removeEventListener("change", applyMq);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      delete document.documentElement.dataset.hero;
      r.destroy();
    };
  }, [lines]);

  return (
    <div ref={wrapRef} className="relative h-full w-full touch-pan-y">
      {/* Sonde : porte la famille Gloock telle que chargée. */}
      <span ref={probeRef} className="font-wide pointer-events-none absolute h-px w-px opacity-0" aria-hidden>
        A
      </span>
      {/* Le nom existe aussi en HTML : lisible par tous, visible si WebGL manque. */}
      <h1
        className={`t-giant absolute bottom-[calc(var(--gutter)*1.15)] left-[var(--gutter)] m-0 transition-opacity duration-700 ${
          gl ? "opacity-0" : "opacity-100"
        }`}
        aria-label={lines.join(" ")}
      >
        {lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </h1>
      <canvas ref={canvasRef} className={`gl ${gl ? "is-on" : ""}`} aria-hidden />
    </div>
  );
}
