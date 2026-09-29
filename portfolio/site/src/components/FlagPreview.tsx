import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, Vector2, WebGLRenderer } from 'three';

interface FlagPreviewProps {
  /** Image to show, or null to hide. */
  image: string | null;
  calm: boolean;
}

// Square side in CSS px; the canvas is larger so waves and trailing bends have room.
const SIDE = 300;
const CANVAS = SIDE * 1.9;
// Where the square sits relative to the cursor (its center), so it never hides the text being hovered.
const OFFSET = new Vector2(SIDE * 0.62, 0);

const vertexShader = /* glsl */ `
uniform float uTime,uShow,uCalm;
uniform vec2 uVel;
varying vec2 vUv;
varying float vShade;
void main(){
  vUv=uv;
  vec3 p=position;
  float speed=length(uVel);
  vec2 dir=speed>1e-4?uVel/speed:vec2(1.,0.);
  // 0 at the edge leading the motion, 1 at the trailing edge: the cloth drags behind.
  float t=clamp(.5-dot(p.xy,dir),0.,1.);
  // Trailing bend against the motion, growing toward the free edge.
  p.xy-=uVel*t*t*.9;
  // Travelling ripple: always a little alive, stronger the faster it moves.
  float amp=(.018+min(speed*.55,.16))*(1.-uCalm);
  float wave=sin(t*7.5-uTime*7.+p.y*2.2)*amp*t+sin(t*13.-uTime*11.+p.x*3.)*amp*.35*t;
  p.z+=wave;
  vShade=cos(t*7.5-uTime*7.+p.y*2.2)*amp*t*6.;
  p.xy*=mix(.86,1.,uShow);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uTex;
uniform float uShow;
varying vec2 vUv;
varying float vShade;
void main(){
  vec4 c=texture2D(uTex,vUv);
  // Folds catch and lose the light.
  c.rgb*=1.+vShade*.9;
  gl_FragColor=vec4(c.rgb,c.a*uShow);
}
`;

/**
 * Square preview that follows the cursor like a flag: a subdivided plane whose far edge trails
 * behind the motion and ripples, more the faster it moves. Hidden on devices without hover.
 */
export function FlagPreview({ image, calm }: FlagPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ image, calm });
  state.current = { image, calm };

  useEffect(() => {
    if (!matchMedia('(hover: hover)').matches) return;
    const canvas = canvasRef.current!;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(CANVAS, CANVAS, false);

    // Frame the scene so one plane unit spans SIDE px of the canvas.
    const camera = new PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.z = CANVAS / SIDE / (2 * Math.tan((15 * Math.PI) / 180));
    const scene = new Scene();
    const uniforms = {
      uTex: { value: new Texture() }, uTime: { value: 0 }, uShow: { value: 0 }, uCalm: { value: 0 }, uVel: { value: new Vector2() },
    };
    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
    const geometry = new PlaneGeometry(1, 1, 48, 48);
    scene.add(new Mesh(geometry, material));

    const loader = new TextureLoader();
    const textures = new Map<string, Texture>();
    let shown: string | null = null;
    const textureFor = (src: string) => {
      let tex = textures.get(src);
      // Left as raw color: the raw ShaderMaterial writes it straight out, so no sRGB decode here.
      if (!tex) {
        tex = loader.load(src);
        textures.set(src, tex);
      }
      return tex;
    };

    const mouse = new Vector2(-9999, -9999), pos = new Vector2(), prev = new Vector2(), vel = new Vector2(), smooth = new Vector2();
    let placed = false, raf = 0, last = performance.now();
    const onMove = (e: PointerEvent) => {
      mouse.set(e.clientX, e.clientY);
      if (!placed) { pos.copy(mouse); prev.copy(mouse); placed = true; }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;
      const { image: target, calm } = state.current;
      if (target && target !== shown) { uniforms.uTex.value = textureFor(target); shown = target; }
      const show = uniforms.uShow.value + ((target ? 1 : 0) - uniforms.uShow.value) * (1 - Math.exp(-10 * dt));
      uniforms.uShow.value = show;
      if (show < 0.002 && !target) { canvas.style.visibility = 'hidden'; placed = false; return; }
      canvas.style.visibility = 'visible';

      // Follow with a little lag; the lag's velocity drives the cloth.
      pos.lerp(mouse, 1 - Math.exp(-11 * dt));
      vel.subVectors(pos, prev).divideScalar(dt);
      prev.copy(pos);
      smooth.lerp(vel, 1 - Math.exp(-7 * dt));
      // px/s → plane units, y flipped to GL; capped so fast flicks bend but don't fold over.
      uniforms.uVel.value.set(smooth.x / SIDE, -smooth.y / SIDE).multiplyScalar(0.18);
      if (uniforms.uVel.value.length() > 0.45) uniforms.uVel.value.setLength(0.45);
      uniforms.uTime.value += dt;
      uniforms.uCalm.value = calm ? 1 : 0;

      canvas.style.transform = `translate3d(${pos.x + OFFSET.x - CANVAS / 2}px, ${pos.y + OFFSET.y - CANVAS / 2}px, 0)`;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      textures.forEach((t) => t.dispose());
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);

  // Rendered on <body>: it is fixed-positioned and must not count as part of the section's layout.
  return createPortal(
    <canvas ref={canvasRef} className="flag-preview" aria-hidden="true" style={{ width: CANVAS, height: CANVAS }} />,
    document.body,
  );
}
