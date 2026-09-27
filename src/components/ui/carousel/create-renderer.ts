import * as THREE from "three";
import { LENS, HORIZONTAL_ASPECT, REPEATS, hexToNumber } from "./constants";
import { LENS_VERTEX, LENS_FRAGMENT } from "./shaders";
import type { LiquidGlassCarouselItem, Source, PoolItem } from "./types";

export interface ThreeContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  rt: THREE.WebGLRenderTarget;
  lensScene: THREE.Scene;
  lensCam: THREE.OrthographicCamera;
  lensMat: THREE.ShaderMaterial;
  lensQuad: THREE.Mesh;
  lensUniforms: Record<string, { value: any }>;
  sources: Source[];
  pool: PoolItem[];
  dpr: number;
}

export function createRendererAndScene(
  mount: HTMLElement,
  W: number,
  H: number,
  background: string,
  reduced: boolean,
  items: LiquidGlassCarouselItem[],
  onTextureLoaded: () => void
): ThreeContext | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch {
    return null;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H);
  renderer.setClearColor(hexToNumber(background), 1);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "pan-y";
  renderer.domElement.style.userSelect = "none";
  renderer.domElement.setAttribute("aria-hidden", "true");
  mount.style.touchAction = "pan-y";
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -W / 2,
    W / 2,
    H / 2,
    -H / 2,
    -100,
    100
  );
  camera.position.z = 10;

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  const sources: Source[] = items.map((img) => {
    const s: Source = {
      tex: null,
      aspect: img.aspect || HORIZONTAL_ASPECT,
      locked: img.aspect != null,
    };
    loader.load(
      img.src,
      (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.colorSpace = THREE.SRGBColorSpace;
        if (!s.locked && tex.image) {
          s.aspect = tex.image.width / tex.image.height;
        }
        s.tex = tex;
        onTextureLoaded();
      },
      undefined,
      () => {
        s.aspect = s.aspect || HORIZONTAL_ASPECT;
      }
    );
    return s;
  });

  const pool: PoolItem[] = [];
  for (let r = 0; r < REPEATS; r++) {
    for (let i = 0; i < sources.length; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), mat);
      mesh.visible = false;
      scene.add(mesh);
      pool.push({ mesh, mat, srcIndex: i, bound: false });
    }
  }

  const rt = new THREE.WebGLRenderTarget(W * dpr, H * dpr);
  const lensScene = new THREE.Scene();
  const lensCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const lensUniforms: Record<string, { value: any }> = {
    uTex: { value: rt.texture },
    uRes: { value: new THREE.Vector2(W * dpr, H * dpr) },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uSizeX: { value: LENS.sizeX },
    uSizeY: { value: LENS.sizeY },
    uShape: { value: 0 },
    uSquareRound: { value: 0 },
    uRotation: { value: 0 },
    uAspect: { value: W / H },
    uZoom: { value: LENS.zoom },
    uDispersion: { value: LENS.dispersion },
    uBlur: { value: LENS.blur },
    uGlow: { value: LENS.glow },
    uWhiteGlow: { value: LENS.whiteGlow },
    uNovaSize: { value: LENS.novaSize },
    uBlueRing: { value: LENS.blueRing },
    uRingRadius: { value: LENS.ringRadius },
    uRingWidth: { value: LENS.ringWidth },
    uShimmer: { value: reduced || !LENS.shimmer ? 0 : 1 },
    uShimmerFreq: { value: LENS.shimmerFreq },
    uShimmerSpeed: { value: LENS.shimmerSpeed },
    uShimmerDepth: { value: LENS.shimmerDepth },
    uTime: { value: 0 },
    uRimStart: { value: LENS.rimStart },
    uRimTangential: { value: LENS.rimTangential },
    uRimInward: { value: LENS.rimInward },
    uRimFreq1: { value: LENS.rimFreq1 },
    uRimFreq2: { value: LENS.rimFreq2 },
    uBlueColor: { value: new THREE.Color(LENS.blueColor) },
    uRimLine: { value: LENS.rimLine },
    uRimLinePos: { value: LENS.rimLinePos },
    uRimLineWidth: { value: LENS.rimLineWidth },
    uVignette: { value: LENS.vignette },
    uVignetteSize: { value: LENS.vignetteSize },
    uSamples: { value: LENS.samples },
  };
  const lensMat = new THREE.ShaderMaterial({
    uniforms: lensUniforms as unknown as THREE.ShaderMaterial["uniforms"],
    vertexShader: LENS_VERTEX,
    fragmentShader: LENS_FRAGMENT,
  });
  const lensQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensMat);
  lensScene.add(lensQuad);

  return {
    renderer,
    scene,
    camera,
    rt,
    lensScene,
    lensCam,
    lensMat,
    lensQuad,
    lensUniforms,
    sources,
    pool,
    dpr,
  };
}
