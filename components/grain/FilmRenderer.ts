import { FILM_FRAG, VERT } from "./glsl";

/**
 * LE RÉVÉLATEUR (côté machine).
 *
 * Un rendu WebGL2 plein cadre qui tient deux plans — le sortant et l'entrant —
 * et fait passer de l'un à l'autre par déplacement. Chaque plan posé se
 * « développe » depuis le papier blanc. Sans dépendance : un triangle et un
 * fragment suffisent.
 *
 * Toute méthode est sans effet si le contexte n'a pas pu être obtenu : c'est
 * l'appelant qui décide du repli (une image DOM dessous).
 */

type Slot = { tex: WebGLTexture | null; w: number; h: number };

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);
const PAPER: [number, number, number] = [0.988, 0.984, 0.973];

export class FilmRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};

  private a: Slot = { tex: null, w: 1, h: 1 };
  private b: Slot = { tex: null, w: 1, h: 1 };
  private cache = new Map<string, Slot>();

  private videoTex: WebGLTexture | null = null;
  private video: HTMLVideoElement | null = null;
  private videoReady = false;

  private raf = 0;
  private start = performance.now();
  private prog01 = 1;
  private tStart = 0;
  private duration = 900;

  private dev = 0; // développement courant
  private devFrom = 0;
  private devTo = 1;
  private devStart = 0;
  private devDuration = 1400;

  private light = { x: 0.5, y: 0.5, on: 0, target: 0 };

  private reduced = false;
  private paused = false;
  private lost = false;
  private dirty = true;

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
    canvas.addEventListener("webglcontextlost", this.onLost);
    canvas.addEventListener("webglcontextrestored", this.onRestored);
    if (!this.build()) {
      this.gl = null;
      return;
    }
    this.resize();
    this.loop();
  }

  get ok() {
    return this.gl !== null;
  }

  private build(): boolean {
    const gl = this.gl;
    if (!gl) return false;
    const vs = this.shader(gl.VERTEX_SHADER, VERT);
    const fs = this.shader(gl.FRAGMENT_SHADER, FILM_FRAG);
    if (!vs || !fs) return false;
    const prog = gl.createProgram();
    if (!prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    this.prog = prog;
    gl.useProgram(prog);
    for (const name of [
      "uTexA", "uTexB", "uSizeA", "uSizeB", "uRes", "uProg", "uTime",
      "uGrain", "uAber", "uReduced", "uDevelop", "uLight", "uLightOn", "uPaper",
    ]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(this.u.uTexA, 0);
    gl.uniform1i(this.u.uTexB, 1);
    gl.uniform3f(this.u.uPaper, ...PAPER);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.vao = vao;

    // Du papier en attendant la première image : jamais de cadre noir.
    const paper = this.makeTexture(new Uint8Array([252, 251, 248, 255]), 1, 1);
    this.a = { tex: paper, w: 1, h: 1 };
    this.b = { tex: paper, w: 1, h: 1 };
    return true;
  }

  private shader(type: number, src: string) {
    const gl = this.gl!;
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(gl.getShaderInfoLog(sh));
      }
      return null;
    }
    return sh;
  }

  private makeTexture(px: Uint8Array, w: number, h: number) {
    const gl = this.gl!;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
    this.texParams();
    return tex;
  }

  private texParams() {
    const gl = this.gl!;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  // ── Images ──────────────────────────────────────────────────────────

  load(url: string): Promise<Slot | null> {
    const gl = this.gl;
    if (!gl) return Promise.resolve(null);
    const hit = this.cache.get(url);
    if (hit) return Promise.resolve(hit);
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!this.gl || this.lost) return resolve(null);
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        this.texParams();
        const slot: Slot = { tex, w: img.naturalWidth, h: img.naturalHeight };
        this.cache.set(url, slot);
        resolve(slot);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  /** Pose un plan et le développe depuis le papier. */
  async set(url: string, developMs = 1500) {
    const slot = await this.load(url);
    if (!slot) return;
    this.a = slot;
    this.b = slot;
    this.prog01 = 1;
    this.videoReady = false;
    this.develop(developMs, true);
  }

  /** Fait passer au plan suivant par déplacement (sans redévelopper). */
  async go(url: string, ms = 900) {
    const slot = await this.load(url);
    if (!slot) return;
    this.a = this.currentSlot();
    this.b = slot;
    this.videoReady = false;
    this.prog01 = 0;
    this.duration = Math.max(1, this.reduced ? 220 : ms);
    this.tStart = performance.now();
    if (this.dev < 1) this.develop(600, false);
    this.dirty = true;
  }

  /** Relance le développement (depuis le papier si `fromPaper`). */
  develop(ms = 1500, fromPaper = true) {
    this.devFrom = fromPaper ? 0 : this.dev;
    this.devTo = 1;
    this.devStart = performance.now();
    this.devDuration = Math.max(1, this.reduced ? 300 : ms);
    if (fromPaper) this.dev = 0;
    this.dirty = true;
  }

  /** Repasse au papier vierge (sortie de champ). */
  blank() {
    this.dev = 0;
    this.devFrom = 0;
    this.devTo = 0;
    this.dirty = true;
  }

  private currentSlot(): Slot {
    if (this.videoReady && this.videoTex && this.video) {
      return { tex: this.videoTex, w: this.video.videoWidth, h: this.video.videoHeight };
    }
    return this.prog01 >= 0.5 ? this.b : this.a;
  }

  // ── Extrait vidéo ───────────────────────────────────────────────────

  attachVideo(video: HTMLVideoElement | null) {
    this.video = video;
    this.videoReady = false;
    const gl = this.gl;
    if (!gl || !video) return;
    if (!this.videoTex) {
      this.videoTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([252, 251, 248, 255]));
      this.texParams();
    }
  }

  private pumpVideo() {
    const gl = this.gl;
    const v = this.video;
    if (!gl || !v || !this.videoTex) return;
    if (v.readyState < 2 || v.videoWidth === 0 || v.paused) return;
    gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
    this.videoReady = true;
  }

  // ── Réglages ────────────────────────────────────────────────────────

  setReduced(v: boolean) {
    this.reduced = v;
  }

  /** La lumière suit la main. x, y en 0..1 dans le cadre (y vers le haut). */
  setLight(x: number, y: number, on: boolean) {
    this.light.x = x;
    this.light.y = y;
    this.light.target = on ? 1 : 0;
    this.dirty = true;
  }

  /** Hors champ : on arrête de dessiner, l'image reste telle quelle. */
  setPaused(v: boolean) {
    this.paused = v;
    if (!v) this.dirty = true;
  }

  resize() {
    const gl = this.gl;
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    gl.viewport(0, 0, w, h);
    this.dirty = true;
  }

  // ── Boucle ──────────────────────────────────────────────────────────

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const gl = this.gl;
    if (!gl || this.lost || !this.prog) return;
    if (document.hidden || this.paused) return;

    const now = performance.now();
    const t = (now - this.start) / 1000;

    if (this.prog01 < 1) {
      const k = Math.min(1, (now - this.tStart) / this.duration);
      this.prog01 = EASE(k);
    }
    if (this.dev !== this.devTo) {
      const k = Math.min(1, (now - this.devStart) / this.devDuration);
      this.dev = this.devFrom + (this.devTo - this.devFrom) * (1 - Math.pow(1 - k, 2));
    }
    this.light.on += (this.light.target - this.light.on) * 0.08;

    this.pumpVideo();

    const useVideo = this.videoReady && this.videoTex && this.video;
    const bTex = useVideo ? this.videoTex! : this.b.tex;
    const bW = useVideo ? this.video!.videoWidth : this.b.w;
    const bH = useVideo ? this.video!.videoHeight : this.b.h;

    gl.useProgram(this.prog);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bTex);

    gl.uniform2f(this.u.uSizeA, this.a.w, this.a.h);
    gl.uniform2f(this.u.uSizeB, bW || 1, bH || 1);
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uProg, this.prog01);
    gl.uniform1f(this.u.uTime, t);
    gl.uniform1f(this.u.uGrain, this.reduced ? 0.04 : 0.065);
    gl.uniform1f(this.u.uAber, 0.005);
    gl.uniform1f(this.u.uReduced, this.reduced ? 1 : 0);
    gl.uniform1f(this.u.uDevelop, this.dev);
    gl.uniform2f(this.u.uLight, this.light.x, this.light.y);
    gl.uniform1f(this.u.uLightOn, this.light.on);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  private onLost = (e: Event) => {
    e.preventDefault();
    this.lost = true;
  };

  private onRestored = () => {
    this.lost = false;
    this.cache.clear();
    this.videoTex = null;
    this.videoReady = false;
    if (this.build()) this.resize();
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onRestored);
    const gl = this.gl;
    if (!gl) return;
    for (const s of this.cache.values()) if (s.tex) gl.deleteTexture(s.tex);
    if (this.videoTex) gl.deleteTexture(this.videoTex);
    if (this.prog) gl.deleteProgram(this.prog);
    this.cache.clear();
    this.gl = null;
  }
}
