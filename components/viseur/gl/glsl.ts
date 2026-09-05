// Les deux étages du rendu. Un simple quad plein cadre : toute la matière se
// joue dans le fragment.

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/**
 * Le plan passe par une fenêtre de projection, pas par une balise <img> :
 *
 * - cadrage « cover » calculé ici, donc sans dépendre de la mise en page ;
 * - transition par DÉPLACEMENT : la nouvelle image perce l'ancienne le long
 *   d'une turbulence étirée à l'horizontale, comme un changement de plan qui
 *   file dans la fenêtre du projecteur ;
 * - aberration chromatique qui s'ouvre pendant le mouvement et se referme à
 *   l'arrêt — c'est ce qui donne l'impression d'un objectif, pas d'un écran ;
 * - souffle du projecteur : une variation de luminance minuscule et
 *   irrégulière, celle d'une lampe qui respire ;
 * - grain argentique enfin, plus présent dans les demi-teintes que dans les
 *   noirs et les blancs — comme sur une vraie émulsion.
 */
export const FRAG = /* glsl */ `#version 300 es
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
uniform float uFlicker;
uniform float uAber;
uniform float uReduced;  // 1 = mouvement réduit demandé par le système
uniform float uFade;     // fondu d'ouverture, 0 = noir

// Cadrage « cover » : l'image remplit toujours le cadre, on rogne le surplus.
vec2 coverUv(vec2 uv, vec2 texSize) {
  float rTex = texSize.x / max(texSize.y, 1.0);
  float rRes = uRes.x / max(uRes.y, 1.0);
  vec2 s = rTex > rRes ? vec2(rRes / rTex, 1.0) : vec2(1.0, rTex / rRes);
  return (uv - 0.5) * s + 0.5;
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
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
}

// Un échantillon d'image, pris par un objectif : les trois couches ne se
// superposent pas exactement, et l'écart croît vers les bords.
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

  // La turbulence qui guide le déplacement ET la percée du plan entrant.
  float n = fbm(vec2(uv.x * 2.2, uv.y * 5.5) + uTime * 0.03);

  // Maximale au milieu de la transition, nulle aux deux extrémités.
  float wave = sin(p * 3.14159265);
  float amp = 0.15 * wave * (1.0 - uReduced);
  vec2 disp = vec2((n - 0.5) * amp, (n - 0.5) * amp * 0.18);

  float aber = (uAber + 0.05 * wave) * (1.0 - uReduced * 0.75);

  vec3 a = sampleFilm(uTexA, uSizeA, uv + disp * p, aber * (1.0 + p));
  vec3 b = sampleFilm(uTexB, uSizeB, uv - disp * (1.0 - p), aber * (2.0 - p));

  // Le fondu suit la turbulence : le plan entrant perce par bandes au lieu
  // de recouvrir uniformément. En mouvement réduit, fondu droit.
  float edge = mix(
    smoothstep(0.0, 1.0, p * 1.35 - n * 0.35),
    p,
    uReduced
  );
  vec3 col = mix(a, b, clamp(edge, 0.0, 1.0));

  // Le souffle de la lampe — deux fréquences, jamais un battement régulier.
  float flick = 1.0 + uFlicker * (sin(uTime * 3.1) * 0.6 + sin(uTime * 8.3) * 0.4);
  col *= flick;

  // Vignettage doux, corrigé du format pour rester circulaire.
  vec2 vd = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  float vig = smoothstep(0.98, 0.22, length(vd));
  col *= mix(0.52, 1.0, vig);

  // Le grain : il vit dans les demi-teintes, s'efface dans les noirs profonds
  // et les hautes lumières.
  float g = hash(uv * uRes + fract(uTime) * 137.0) - 0.5;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col += g * uGrain * (0.35 + 0.65 * (1.0 - abs(lum * 2.0 - 1.0)));

  fragColor = vec4(max(col, 0.0) * uFade, 1.0);
}`;
