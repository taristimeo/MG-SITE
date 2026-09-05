import { FRAG, VERT } from "./glsl";

/**
 * LE PROJECTEUR.
 *
 * Un rendu WebGL2 plein cadre qui remplace la balise <img>/<video> du viseur.
 * Il tient deux plans à la fois — le sortant et l'entrant — et fait passer de
 * l'un à l'autre par déplacement, en appliquant grain, souffle de lampe et
 * aberration chromatique à l'ensemble.
 *
 * Volontairement sans dépendance : un quad et un fragment suffisent, là où
 * une bibliothèque 3D coûterait quelques centaines de kilo-octets pour rien.
 *
 * Toute méthode est sans effet si le contexte n'a pas pu être obtenu : c'est
 * l'appelant qui décide du repli (le viseur garde ses images en DOM dessous).
 */

type Slot = {
  tex: WebGLTexture | null;
  w: number;
  h: number;
};

const EASE = (t: number) => 1 - Math.pow(1 - t, 3); // décélération franche

export class FilmRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};

  private a: Slot = { tex: null, w: 1, h: 1 };
  private b: Slot = { tex: null, w: 1, h: 1 };

  /** Textures d'images déjà chargées, indexées par URL. */
  private cache = new Map<string, Slot>();

  /** La texture alimentée image par image quand un extrait est en lecture. */
  private videoTex: WebGLTexture | null = null;
  private video: HTMLVideoElement | null = null;
  private videoReady = false;

  private raf = 0;
  private start = performance.now();
  private prog01 = 1; // position dans la transition
  private from = 1;
  private to = 1;
  private tStart = 0;
  private duration = 900;
  private fade = 0; // fondu d'ouverture

  private reduced = false;
  private dpr = 1;
  private lost = false;

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

  // ── Construction ────────────────────────────────────────────────────

  private build(): boolean {
    const gl = this.gl;
    if (!gl) return false;

    const vs = this.shader(gl.VERTEX_SHADER, VERT);
    const fs = this.shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    const prog = gl.createProgram();
    if (!prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // Rien à réparer à l'exécution : on rend la main au repli DOM.
      return false;
    }
    this.prog = prog;
    gl.useProgram(prog);

    for (const name of [
      "uTexA", "uTexB", "uSizeA", "uSizeB", "uRes",
      "uProg", "uTime", "uGrain", "uFlicker", "uAber", "uReduced", "uFade",
    ]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(this.u.uTexA, 0);
    gl.uniform1i(this.u.uTexB, 1);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), // un seul triangle couvrant
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.vao = vao;

    // Un plan noir en attendant la première image : jamais de cadre vide.
    const black = this.makeTexture(new Uint8Array([6, 5, 4, 255]), 1, 1);
    this.a = { tex: black, w: 1, h: 1 };
    this.b = { tex: black, w: 1, h: 1 };
    return true;
  }

  private shader(type: number, src: string) {
    const gl = this.gl!;
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
    return sh;
  }

  private makeTexture(px: Uint8Array, w: number, h: number) {
    const gl = this.gl!;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
    this.texParams();
    return tex;
  }

  private texParams() {
    const gl = this.gl!;
    // Les images ne sont pas en puissance de deux : bord fixé, pas de mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  // ── Images ──────────────────────────────────────────────────────────

  /** Charge une image et la garde en cache. Résout même en cas d'échec. */
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

  /** Pose un plan sans transition (première image, ou saut direct). */
  async set(url: string) {
    const slot = await this.load(url);
    if (!slot) return;
    this.a = slot;
    this.b = slot;
    this.prog01 = 1;
    this.from = 1;
    this.to = 1;
  }

  /** Fait passer au plan suivant par déplacement. */
  async go(url: string, ms = 900) {
    const slot = await this.load(url);
    if (!slot) return;
    // Le plan affiché à l'instant devient le sortant.
    this.a = this.currentSlot();
    this.b = slot;
    this.videoReady = false; // l'extrait du plan précédent n'a plus cours
    this.from = 0;
    this.to = 1;
    this.prog01 = 0;
    this.duration = this.reduced ? 220 : ms;
    this.tStart = performance.now();
  }

  private currentSlot(): Slot {
    if (this.videoReady && this.videoTex && this.video) {
      return { tex: this.videoTex, w: this.video.videoWidth, h: this.video.videoHeight };
    }
    return this.prog01 >= 0.5 ? this.b : this.a;
  }

  // ── Extrait vidéo ───────────────────────────────────────────────────

  /**
   * Branche l'extrait du plan courant. Tant qu'il n'a pas de données, c'est
   * l'image fixe qui reste affichée — le repli est silencieux.
   */
  attachVideo(video: HTMLVideoElement | null) {
    this.video = video;
    this.videoReady = false;
    const gl = this.gl;
    if (!gl || !video) return;
    if (!this.videoTex) {
      this.videoTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([6, 5, 4, 255]),
      );
      this.texParams();
    }
  }

  private pumpVideo() {
    const gl = this.gl;
    const v = this.video;
    if (!gl || !v || !this.videoTex) return;
    // readyState >= 2 : au moins l'image courante est décodée.
    if (v.readyState < 2 || v.videoWidth === 0) return;
    gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
    this.videoReady = true;
  }

  // ── Réglages ────────────────────────────────────────────────────────

  setReduced(v: boolean) {
    this.reduced = v;
  }

  resize() {
    const gl = this.gl;
    if (!gl) return;
    // Plafonné : au-delà, on paie le double de pixels pour un grain qu'on ne
    // distingue plus.
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * this.dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * this.dpr));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  // ── Boucle ──────────────────────────────────────────────────────────

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const gl = this.gl;
    if (!gl || this.lost || !this.prog) return;
    if (document.hidden) return; // onglet en arrière-plan : rien à dessiner

    const now = performance.now();
    const t = (now - this.start) / 1000;

    if (this.prog01 < 1) {
      const k = Math.min(1, (now - this.tStart) / this.duration);
      this.prog01 = this.from + (this.to - this.from) * EASE(k);
    }
    // Fondu d'ouverture : la lampe monte, elle ne s'allume pas d'un coup.
    this.fade = Math.min(1, this.fade + (this.reduced ? 0.2 : 0.045));

    this.pumpVideo();

    // Quand l'extrait tourne, c'est LUI le plan entrant.
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
    gl.uniform1f(this.u.uGrain, this.reduced ? 0.05 : 0.075);
    gl.uniform1f(this.u.uFlicker, this.reduced ? 0 : 0.014);
    gl.uniform1f(this.u.uAber, 0.0055);
    gl.uniform1f(this.u.uReduced, this.reduced ? 1 : 0);
    gl.uniform1f(this.u.uFade, this.fade);

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
