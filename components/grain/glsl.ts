// Les shaders du site. Un seul triangle plein cadre : toute la matière est
// dans les fragments.

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const COMMON = /* glsl */ `
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash2(vec2 p) {
  float h = hash(p);
  return vec2(h, hash(p + h + 17.17));
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}`;

/**
 * LE RÉVÉLATEUR.
 *
 * L'image n'est pas affichée : elle se développe. Sur le papier blanc, des
 * grains d'argent apparaissent, se densifient, et l'image sort du bain
 * (uDevelop 0 → 1). Le passage d'un plan à l'autre se fait par déplacement
 * (uProg), la lumière suit la main (uLight) et le grain vit en permanence.
 */
export const FILM_FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform vec2  uSizeA;
uniform vec2  uSizeB;
uniform vec2  uRes;
uniform float uProg;     // 0 = plan sortant, 1 = plan entrant
uniform float uTime;
uniform float uGrain;
uniform float uAber;
uniform float uReduced;  // 1 = mouvement réduit
uniform float uDevelop;  // 0 = papier vierge, 1 = image développée
uniform vec2  uLight;    // position de la lumière (uv)
uniform float uLightOn;  // 0..1
uniform vec3  uPaper;

${COMMON}

vec2 coverUv(vec2 uv, vec2 texSize) {
  float rTex = texSize.x / max(texSize.y, 1.0);
  float rRes = uRes.x / max(uRes.y, 1.0);
  vec2 s = rTex > rRes ? vec2(rRes / rTex, 1.0) : vec2(1.0, rTex / rRes);
  return (uv - 0.5) * s + 0.5;
}

vec3 sampleFilm(sampler2D tex, vec2 size, vec2 uv, float aber) {
  vec2 c = coverUv(uv, size);
  vec2 dir = c - 0.5;
  vec2 off = dir * dot(dir, dir) * aber;
  vec3 col;
  col.r = texture(tex, clamp(c + off, 0.0, 1.0)).r;
  col.g = texture(tex, clamp(c, 0.0, 1.0)).g;
  col.b = texture(tex, clamp(c - off, 0.0, 1.0)).b;
  return col;
}

void main() {
  vec2 uv = vUv;
  float p = clamp(uProg, 0.0, 1.0);
  float aspect = uRes.x / max(uRes.y, 1.0);

  // Turbulence qui guide le déplacement et la percée du plan entrant.
  float n = fbm(vec2(uv.x * 2.2, uv.y * 5.5) + uTime * 0.03);
  float wave = sin(p * 3.14159265);
  float amp = 0.15 * wave * (1.0 - uReduced);
  vec2 disp = vec2((n - 0.5) * amp, (n - 0.5) * amp * 0.18);
  float aber = (uAber + 0.05 * wave) * (1.0 - uReduced * 0.75);

  vec3 a = sampleFilm(uTexA, uSizeA, uv + disp * p, aber * (1.0 + p));
  vec3 b = sampleFilm(uTexB, uSizeB, uv - disp * (1.0 - p), aber * (2.0 - p));
  float edge = mix(smoothstep(0.0, 1.0, p * 1.35 - n * 0.35), p, uReduced);
  vec3 img = mix(a, b, clamp(edge, 0.0, 1.0));

  // La lumière : une main qui s'approche éclaire le tirage, le reste
  // s'éloigne légèrement vers le papier.
  vec2 ld = (uv - uLight) * vec2(aspect, 1.0);
  float L = exp(-dot(ld, ld) * 6.0);
  img *= 1.0 + 0.10 * L * uLightOn;
  img = mix(img, mix(img, uPaper, 0.10), (1.0 - L) * uLightOn);

  // Vignette très douce — un tirage, pas un écran.
  vec2 vd = (uv - 0.5) * vec2(aspect, 1.0);
  float vig = smoothstep(1.05, 0.3, length(vd));
  img *= mix(0.9, 1.0, vig);

  // Grain vivant, plus présent dans les demi-teintes.
  float g = hash(uv * uRes + fract(uTime) * 137.0) - 0.5;
  float lum = dot(img, vec3(0.299, 0.587, 0.114));
  img += g * uGrain * (0.35 + 0.65 * (1.0 - abs(lum * 2.0 - 1.0)));

  // Le développement : le bain gagne la feuille de façon inégale (fbm), et à
  // l'intérieur, chaque grain bascule à son tour (hash par cellule). Pendant
  // la montée, le grain grouille (hash temporel) ; à la fin, tout est stable.
  float d = clamp(uDevelop * 1.45 - fbm(uv * vec2(3.0 * aspect, 3.0) + 7.3) * 0.45, 0.0, 1.0);
  vec2 cell = floor(gl_FragCoord.xy / 1.6);
  float crawl = (1.0 - d) * d * 4.0;
  float gr = mix(hash(cell), hash(cell + floor(uTime * 18.0) * 0.731), crawl * (1.0 - uReduced));
  float show = smoothstep(gr - 0.10, gr + 0.10, d * 1.08);
  // Les grains qui viennent d'apparaître sont plus sombres : l'argent sort noir.
  vec3 fresh = img * mix(1.0 - 0.45 * (1.0 - d), 1.0, smoothstep(0.0, 0.35, d - gr));
  vec3 col = mix(uPaper, fresh, show);

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

/**
 * LE NOM EN GRAIN.
 *
 * Le logotype est une poussière d'argent qui se dépose : au début, des grains
 * épars sur toute la feuille ; ils se rassemblent dans les lettres (uSettle),
 * jusqu'au noir plein — mais jamais tout à fait : les bords et quelques grains
 * continuent de vivre. Sous la main (uPts), les grains se dispersent, par
 * cellule, chacun à sa manière, et reviennent se poser quand elle s'éloigne.
 */
export const NAME_FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uMask;
uniform vec2  uRes;
uniform float uTime;
uniform float uSettle;   // 0 = poussière, 1 = posé
uniform float uReduced;
uniform vec3  uPts[8];   // x, y (uv), force
uniform vec3  uInk;
uniform vec3  uPaper;

${COMMON}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  float s = uSettle;

  // La cellule-grain : ~1.5 px-appareil. Chaque cellule a son hasard.
  vec2 cell = floor(gl_FragCoord.xy / 1.5);
  vec2 rnd = hash2(cell);

  // Dispersion sous la main : par cellule, direction radiale + un peu de
  // turbulence, force décroissante avec la distance et l'âge du point.
  vec2 off = vec2(0.0);
  float scatter = 0.0;
  for (int i = 0; i < 8; i++) {
    vec3 pt = uPts[i];
    if (pt.z <= 0.001) continue;
    vec2 d = (uv - pt.xy) * vec2(aspect, 1.0);
    float r = length(d);
    float f = pt.z * smoothstep(0.17, 0.0, r);
    if (f <= 0.0) continue;
    vec2 dir = r > 0.0001 ? d / r : vec2(0.0, 1.0);
    float turb = fbm(uv * 14.0 + uTime * 0.6 + float(i)) - 0.5;
    dir = normalize(dir + turb * 1.2 + (rnd - 0.5) * 0.9);
    off += dir * f * (0.03 + 0.11 * rnd.x) / vec2(aspect, 1.0);
    scatter = max(scatter, f);
  }

  // Convergence : avant d'être posés, les grains flottent autour des lettres.
  float drift = (1.0 - s) * (1.0 - uReduced);
  vec2 wander = (vec2(fbm(uv * 6.0 + uTime * 0.25), fbm(uv * 6.0 - uTime * 0.21 + 3.1)) - 0.5) * 0.12 * drift;
  wander += (rnd - 0.5) * 0.05 * drift;

  // Densité d'encre à la position d'où vient le grain.
  float dens = texture(uMask, uv - off - wander).a;

  // Le grain qui vit : il s'anime aux bords et dans la poussière, et quelques
  // grains à l'intérieur des lettres clignotent.
  float jitter = hash(cell + floor(uTime * 16.0) * 0.618);
  float dust = 0.035 * (1.0 - s) + 0.0018;
  float prob = mix(dust, dens, smoothstep(0.0, 1.0, s));
  prob *= 1.0 - scatter * 0.82;
  // Grains chassés : ils réapparaissent autour, épars.
  prob += scatter * 0.12 * step(0.7, rnd.y);
  prob -= 0.04 * step(0.985, jitter) * (1.0 - uReduced);

  float ink = step(jitter, prob);
  // Bord des lettres légèrement adouci quand tout est posé.
  float soft = smoothstep(0.35, 0.65, dens) * s * (1.0 - scatter);
  float a = max(ink, soft * step(0.5, dens));

  vec3 col = mix(uPaper, uInk, a);
  fragColor = vec4(col, 1.0);
}`;
