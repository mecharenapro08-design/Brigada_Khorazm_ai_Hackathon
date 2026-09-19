// ==========================================
// 1. REAL 3D PYTHAGORAS VIEWPORT
// ==========================================
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Maximize2, Minimize2, Layers, Box as BoxIcon, Eye, RotateCcw } from "lucide-react";

// Canvas text sprite helper for high-clarity 3D labels
function createTextSprite(
  title: string,
  subtitle: string,
  bgColor: string,
  borderColor: string
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  // Background rounded rect
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 128, 24);
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, 256, 60);

  // Subtitle
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 24px monospace";
  ctx.fillText(subtitle, 256, 105);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5.5, 1.7, 1);
  return sprite;
}

// ==========================================
// 1. REAL 3D PYTHAGORAS VIEWPORT (ULTRA CLEAR)
// ==========================================
interface Pythagoras3DProps {
  pythA: number;
  pythB: number;
  isAutoRotate?: boolean;
}

export const Pythagoras3DReal: React.FC<Pythagoras3DProps> = ({
  pythA,
  pythB,
  isAutoRotate = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubesGroupRef = useRef<THREE.Group | null>(null);

  const [viewMode, setViewMode] = useState<"tiles" | "cubes">("tiles");
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAutoRotate, setLocalAutoRotate] = useState<boolean>(isAutoRotate);
  const autoRotateRef = useRef<boolean>(isAutoRotate);

  useEffect(() => {
    setLocalAutoRotate(isAutoRotate);
  }, [isAutoRotate]);

  useEffect(() => {
    autoRotateRef.current = localAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = localAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.4;
    }
  }, [localAutoRotate]);

  // Handle ESC to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060919);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(14, 20, 24);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 60;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(16, 28, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x6366f1, 2.5, 40);
    blueLight.position.set(-15, 10, -10);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 40);
    cyanLight.position.set(15, 10, 15);
    scene.add(cyanLight);

    // Ground Grid
    const grid = new THREE.GridHelper(36, 36, 0x6366f1, 0x1e293b);
    grid.position.y = -0.02;
    scene.add(grid);

    // Group for dynamic meshes
    const cubesGroup = new THREE.Group();
    scene.add(cubesGroup);
    cubesGroupRef.current = cubesGroup;

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.4;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update Geometry whenever pythA, pythB, viewMode, or showLabels change
  useEffect(() => {
    const group = cubesGroupRef.current;
    if (!group) return;

    // Clear previous objects
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    const a = pythA;
    const b = pythB;
    const c = Math.sqrt(a * a + b * b);
    const unitScale = 0.85;
    const sA = a * unitScale;
    const sB = b * unitScale;
    const sC = c * unitScale;

    // Center offset to keep everything balanced around origin (0, 0, 0)
    const offsetX = -sA * 0.35;
    const offsetZ = -sB * 0.35;

    const slabHeight = viewMode === "tiles" ? 0.35 : sA;
    const slabHeightB = viewMode === "tiles" ? 0.35 : sB;
    const slabHeightC = viewMode === "tiles" ? 0.35 : sC;
    const prismHeight = 0.45;

    // ====================================================
    // 1. MARKAZIY TO'G'RI BURCHAKLI UCHBURCHAK PRIZMASI
    // ====================================================
    // Triangle corners: (0,0) [90 deg], (sA, 0) [Katet A], (0, sB) [Katet B]
    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(sA, 0);
    triShape.lineTo(0, sB);
    triShape.closePath();

    const triGeom = new THREE.ExtrudeGeometry(triShape, {
      depth: prismHeight,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    triGeom.rotateX(-Math.PI / 2);

    const triMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.4,
      roughness: 0.25,
      transparent: true,
      opacity: 0.9,
    });
    const triMesh = new THREE.Mesh(triGeom, triMat);
    triMesh.position.set(offsetX, 0, offsetZ);
    triMesh.castShadow = true;
    triMesh.receiveShadow = true;
    group.add(triMesh);

    // Glowing edge lines on triangle
    const triEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(triGeom),
      new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })
    );
    triMesh.add(triEdges);

    // 90 DEGREE RIGHT ANGLE CORNER MARK (∟)
    const markSize = Math.min(sA, sB) * 0.22;
    const markShape = new THREE.Shape();
    markShape.moveTo(0, 0);
    markShape.lineTo(markSize, 0);
    markShape.lineTo(markSize, markSize);
    markShape.lineTo(0, markSize);
    markShape.closePath();

    const markGeom = new THREE.ExtrudeGeometry(markShape, {
      depth: prismHeight + 0.04,
      bevelEnabled: false,
    });
    markGeom.rotateX(-Math.PI / 2);
    const markMesh = new THREE.Mesh(
      markGeom,
      new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true })
    );
    markMesh.position.set(offsetX + 0.02, 0, offsetZ + 0.02);
    group.add(markMesh);

    // ====================================================
    // 2. KVADRAT A (Katet a = pythA, Yuza = a²)
    // Joylashuvi: X in [0, sA], Z in [-sA, 0] (Uchburchakdan tashqariga)
    // ====================================================
    const aBoxGeom = new THREE.BoxGeometry(sA, slabHeight, sA);
    const aBoxMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: viewMode === "tiles" ? 0.88 : 0.75,
    });
    const aBox = new THREE.Mesh(aBoxGeom, aBoxMat);
    aBox.position.set(offsetX + sA / 2, slabHeight / 2, offsetZ - sA / 2);
    aBox.castShadow = true;
    aBox.receiveShadow = true;
    group.add(aBox);

    const aEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(aBoxGeom),
      new THREE.LineBasicMaterial({ color: 0xc7d2fe, linewidth: 2 })
    );
    aBox.add(aEdges);

    // Agar tiles bo'lsa, a x a ta katakchalar to'ri
    if (viewMode === "tiles") {
      const stepA = sA / a;
      const tileLineMat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.6 });
      for (let i = 1; i < a; i++) {
        // chiziqlar X va Z bo'ylab
        const xPos = -sA / 2 + i * stepA;
        const lineGeomX = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xPos, slabHeight / 2 + 0.01, -sA / 2),
          new THREE.Vector3(xPos, slabHeight / 2 + 0.01, sA / 2),
        ]);
        aBox.add(new THREE.Line(lineGeomX, tileLineMat));

        const zPos = -sA / 2 + i * stepA;
        const lineGeomZ = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-sA / 2, slabHeight / 2 + 0.01, zPos),
          new THREE.Vector3(sA / 2, slabHeight / 2 + 0.01, zPos),
        ]);
        aBox.add(new THREE.Line(lineGeomZ, tileLineMat));
      }
    }

    // ====================================================
    // 3. KVADRAT B (Katet b = pythB, Yuza = b²)
    // Joylashuvi: X in [-sB, 0], Z in [0, sB] (Uchburchakdan tashqariga)
    // ====================================================
    const bBoxGeom = new THREE.BoxGeometry(sB, slabHeightB, sB);
    const bBoxMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: viewMode === "tiles" ? 0.88 : 0.75,
    });
    const bBox = new THREE.Mesh(bBoxGeom, bBoxMat);
    bBox.position.set(offsetX - sB / 2, slabHeightB / 2, offsetZ + sB / 2);
    bBox.castShadow = true;
    bBox.receiveShadow = true;
    group.add(bBox);

    const bEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bBoxGeom),
      new THREE.LineBasicMaterial({ color: 0xa5f3fc, linewidth: 2 })
    );
    bBox.add(bEdges);

    // Katakchalar to'ri B
    if (viewMode === "tiles") {
      const stepB = sB / b;
      const tileLineMatB = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 });
      for (let i = 1; i < b; i++) {
        const xPos = -sB / 2 + i * stepB;
        const lineGeomX = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xPos, slabHeightB / 2 + 0.01, -sB / 2),
          new THREE.Vector3(xPos, slabHeightB / 2 + 0.01, sB / 2),
        ]);
        bBox.add(new THREE.Line(lineGeomX, tileLineMatB));

        const zPos = -sB / 2 + i * stepB;
        const lineGeomZ = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-sB / 2, slabHeightB / 2 + 0.01, zPos),
          new THREE.Vector3(sB / 2, slabHeightB / 2 + 0.01, zPos),
        ]);
        bBox.add(new THREE.Line(lineGeomZ, tileLineMatB));
      }
    }

    // ====================================================
    // 4. KVADRAT C (Gipotenuza c = √(a²+b²), Yuza = c²)
    // Gipotenuzaga MUKAMMAL birikkan, tashqariga yo'nalgan
    // ====================================================
    const cBoxGeom = new THREE.BoxGeometry(sC, slabHeightC, sC);
    const cBoxMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: viewMode === "tiles" ? 0.88 : 0.75,
    });
    const cBox = new THREE.Mesh(cBoxGeom, cBoxMat);

    // Gipotenuza (sA, 0) dan (0, sB) gacha
    // O'rtasi:
    const midX = offsetX + sA / 2;
    const midZ = offsetZ + sB / 2;

    // Gipotenuza burchagi va tashqi normal vektor
    const angle = Math.atan2(sB, sA);
    const normX = Math.sin(angle);
    const normZ = Math.cos(angle);

    cBox.rotation.y = angle;
    cBox.position.set(
      midX + (normX * sC) / 2,
      slabHeightC / 2,
      midZ + (normZ * sC) / 2
    );
    cBox.castShadow = true;
    cBox.receiveShadow = true;
    group.add(cBox);

    const cEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(cBoxGeom),
      new THREE.LineBasicMaterial({ color: 0xfde68a, linewidth: 2 })
    );
    cBox.add(cEdges);

    // Katakchalar to'ri C
    if (viewMode === "tiles") {
      const stepC = sC / Math.round(c);
      const tileLineMatC = new THREE.LineBasicMaterial({ color: 0xfcd34d, transparent: true, opacity: 0.6 });
      const cCount = Math.round(c);
      for (let i = 1; i < cCount; i++) {
        const xPos = -sC / 2 + i * stepC;
        const lineGeomX = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xPos, slabHeightC / 2 + 0.01, -sC / 2),
          new THREE.Vector3(xPos, slabHeightC / 2 + 0.01, sC / 2),
        ]);
        cBox.add(new THREE.Line(lineGeomX, tileLineMatC));

        const zPos = -sC / 2 + i * stepC;
        const lineGeomZ = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-sC / 2, slabHeightC / 2 + 0.01, zPos),
          new THREE.Vector3(sC / 2, slabHeightC / 2 + 0.01, zPos),
        ]);
        cBox.add(new THREE.Line(lineGeomZ, tileLineMatC));
      }
    }

    // ====================================================
    // 5. 3D TEXT SPRITE YORLIQLARI (LABELS)
    // ====================================================
    if (showLabels) {
      // Katet A Label
      const spriteA = createTextSprite(
        `Katet a = ${a}`,
        `Yuza a² = ${a * a} katak`,
        "rgba(49, 46, 129, 0.85)",
        "#818cf8"
      );
      spriteA.position.set(offsetX + sA / 2, slabHeight + 1.2, offsetZ - sA / 2);
      group.add(spriteA);

      // Katet B Label
      const spriteB = createTextSprite(
        `Katet b = ${b}`,
        `Yuza b² = ${b * b} katak`,
        "rgba(8, 145, 178, 0.85)",
        "#22d3ee"
      );
      spriteB.position.set(offsetX - sB / 2, slabHeightB + 1.2, offsetZ + sB / 2);
      group.add(spriteB);

      // Gipotenuza C Label
      const spriteC = createTextSprite(
        `Gipotenuza c = ${c.toFixed(1)}`,
        `Yuza c² = ${a * a + b * b} katak`,
        "rgba(180, 83, 9, 0.85)",
        "#fbbf24"
      );
      spriteC.position.set(
        midX + (normX * sC) / 2,
        slabHeightC + 1.4,
        midZ + (normZ * sC) / 2
      );
      group.add(spriteC);

      // Right angle 90 deg label
      const spriteRightAngle = createTextSprite(
        "Toʻgʻri burchak",
        "90° (∟)",
        "rgba(6, 78, 59, 0.85)",
        "#34d399"
      );
      spriteRightAngle.scale.set(3.8, 1.2, 1);
      spriteRightAngle.position.set(offsetX + 0.5, prismHeight + 0.8, offsetZ + 0.5);
      group.add(spriteRightAngle);
    }
  }, [pythA, pythB, viewMode, showLabels]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 flex flex-col backdrop-blur-2xl"
          : "w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      }`}
    >
      {/* Top Controls Overlay inside Viewport */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md shadow-lg">
          <button
            onClick={() => setViewMode("tiles")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "tiles"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Katakli Plitalar (Isbot)</span>
          </button>
          <button
            onClick={() => setViewMode("cubes")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "cubes"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BoxIcon className="w-3.5 h-3.5" />
            <span>3D Fazoviy Kublar</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLocalAutoRotate(!localAutoRotate)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
              localAutoRotate
                ? "bg-indigo-950/90 border-indigo-500 text-indigo-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="3D fazoni avtomatik 360° aylantirish"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin text-cyan-400" : ""}`} />
            <span>{localAutoRotate ? "Avto Aylanish: Faol" : "Avto Aylantirish"}</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
              showLabels
                ? "bg-slate-900/90 border-slate-700 text-cyan-300"
                : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLabels ? "Yorliqlar: Ochiq" : "Yorliqlarni koʻrsatish"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            title={isFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Toʻliq ekran (Fullscreen)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      {/* Bottom Info Status Badge */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-indigo-300">a² ({pythA * pythA})</span>
          <span className="text-slate-400">+</span>
          <span className="font-bold text-cyan-300">b² ({pythB * pythB})</span>
          <span className="text-slate-400">=</span>
          <span className="font-bold text-amber-300">c² ({pythA * pythA + pythB * pythB})</span>
        </div>

        {isFullscreen && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-[11px] text-rose-300 font-bold backdrop-blur-md shadow-lg">
            Toʻliq ekrandan chiqish uchun ESC yoki oʻng yuqoridagi tugmani bosing
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. REAL 3D ATOM QUANTUM VIEWPORT
// ==========================================
interface Atom3DProps {
  element: "H" | "He" | "Li" | "C" | "O";
  orbitalSpeed: number;
  isAutoRotate?: boolean;
}

export const Atom3DReal: React.FC<Atom3DProps> = ({
  element,
  orbitalSpeed,
  isAutoRotate = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const atomGroupRef = useRef<THREE.Group | null>(null);
  const electronsRef = useRef<{ mesh: THREE.Mesh; radius: number; rotX: number; rotY: number; speed: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAutoRotate, setLocalAutoRotate] = useState<boolean>(isAutoRotate);
  const autoRotateRef = useRef<boolean>(isAutoRotate);

  useEffect(() => {
    setLocalAutoRotate(isAutoRotate);
  }, [isAutoRotate]);

  useEffect(() => {
    autoRotateRef.current = localAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = localAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.2;
    }
  }, [localAutoRotate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const elemConfig = {
    H: { p: 1, n: 0, e: 1, color: 0x38bdf8 },
    He: { p: 2, n: 2, e: 2, color: 0xfacc15 },
    Li: { p: 3, n: 4, e: 3, color: 0xec4899 },
    C: { p: 6, n: 6, e: 6, color: 0xa855f7 },
    O: { p: 8, n: 8, e: 8, color: 0x22c55e },
  }[element];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 30;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xf43f5e, 3, 20);
    scene.add(coreLight);

    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    atomGroupRef.current = atomGroup;

    // Background cosmic particle dust
    const starsCount = 300;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 40;
      starPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    scene.add(starPoints);

    // Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate starfield very slowly
      starPoints.rotation.y = elapsed * 0.02;

      // Animate electrons along orbital planes
      electronsRef.current.forEach((el, idx) => {
        const angle = elapsed * el.speed * orbitalSpeed + (idx * Math.PI * 2) / electronsRef.current.length;
        const x = Math.cos(angle) * el.radius;
        const z = Math.sin(angle) * el.radius;

        // Vector in orbit plane
        const pos = new THREE.Vector3(x, 0, z);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), el.rotX);
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), el.rotY);
        el.mesh.position.copy(pos);
      });

      // Pulse nucleus glow
      coreLight.intensity = 2.5 + Math.sin(elapsed * 4) * 0.8;

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.2;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Rebuild Nucleus & Orbitals on element change
  useEffect(() => {
    const group = atomGroupRef.current;
    if (!group) return;

    // Clear previous
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }
    electronsRef.current = [];

    // 1. Build Nucleus Cluster (Protons & Neutrons)
    const pCount = elemConfig.p;
    const nCount = elemConfig.n;
    const nucleonGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x9f1239,
      emissiveIntensity: 0.4,
    });
    const nMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.3,
    });

    const totalNucleons = pCount + nCount;
    for (let i = 0; i < totalNucleons; i++) {
      const isProton = i < pCount;
      const mesh = new THREE.Mesh(nucleonGeom, isProton ? pMat : nMat);

      if (totalNucleons === 1) {
        mesh.position.set(0, 0, 0);
      } else {
        // Fibonacci sphere / cluster layout
        const phi = Math.acos(-1 + (2 * i) / totalNucleons);
        const theta = Math.sqrt(totalNucleons * Math.PI) * phi;
        const rad = 0.55 * Math.pow(totalNucleons, 0.35);
        mesh.position.set(
          rad * Math.cos(theta) * Math.sin(phi),
          rad * Math.sin(theta) * Math.sin(phi),
          rad * Math.cos(phi)
        );
      }
      group.add(mesh);
    }

    // 2. Build Orbitals and Electrons
    const eCount = elemConfig.e;
    const orbitalConfigs = [
      { radius: 3.2, rotX: 0.4, rotY: 0.2, speed: 2.2 },
      { radius: 3.2, rotX: -0.6, rotY: 1.1, speed: -2.0 },
      { radius: 4.8, rotX: 1.2, rotY: -0.5, speed: 1.8 },
      { radius: 4.8, rotX: -0.3, rotY: 2.0, speed: -1.7 },
      { radius: 5.5, rotX: 0.8, rotY: 1.6, speed: 1.5 },
      { radius: 5.5, rotX: -1.0, rotY: -1.2, speed: -1.4 },
      { radius: 6.2, rotX: 0.5, rotY: 2.6, speed: 1.3 },
      { radius: 6.2, rotX: -0.7, rotY: 0.4, speed: -1.2 },
    ];

    const electronGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    for (let i = 0; i < eCount; i++) {
      const conf = orbitalConfigs[i % orbitalConfigs.length];

      // Draw Orbit Track Ring
      const ringGeom = new THREE.RingGeometry(conf.radius - 0.02, conf.radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.x += conf.rotX;
      ringMesh.rotation.y += conf.rotY;
      group.add(ringMesh);

      // Create Electron Sphere
      const eMesh = new THREE.Mesh(electronGeom, electronMat);
      // add halo point light to electron
      const eLight = new THREE.PointLight(0x06b6d4, 1, 3);
      eMesh.add(eLight);
      group.add(eMesh);

      electronsRef.current.push({
        mesh: eMesh,
        radius: conf.radius,
        rotX: conf.rotX,
        rotY: conf.rotY,
        speed: conf.speed,
      });
    }
  }, [element, elemConfig]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 flex flex-col backdrop-blur-2xl"
          : "w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      }`}
    >
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setLocalAutoRotate(!localAutoRotate)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
            localAutoRotate
              ? "bg-cyan-950/90 border-cyan-500 text-cyan-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="3D atom fazosini avtomatik 360° aylantirish"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin text-cyan-400" : ""}`} />
          <span>{localAutoRotate ? "Avto Aylanish: Faol" : "Avto Aylantirish"}</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title={isFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Toʻliq ekran (Fullscreen)"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Bohr Kvant Modeli ({element}): {elemConfig.p}p⁺, {elemConfig.n}n⁰, {elemConfig.e}e⁻</span>
        </div>

        {isFullscreen && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-[11px] text-rose-300 font-bold backdrop-blur-md shadow-lg">
            Toʻliq ekrandan chiqish uchun ESC yoki oʻng yuqoridagi tugmani bosing
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. REAL 3D OPTICAL PRISM & DISPERSION VIEWPORT
// ==========================================
interface Optics3DProps {
  prismAngle: number; // degrees
  prismMaterial: "crown" | "flint" | "diamond";
  isAutoRotate?: boolean;
}

export const Optics3DReal: React.FC<Optics3DProps> = ({
  prismAngle,
  prismMaterial,
  isAutoRotate = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raysGroupRef = useRef<THREE.Group | null>(null);
  const prismMeshRef = useRef<THREE.Mesh | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAutoRotate, setLocalAutoRotate] = useState<boolean>(isAutoRotate);
  const autoRotateRef = useRef<boolean>(isAutoRotate);

  useEffect(() => {
    setLocalAutoRotate(isAutoRotate);
  }, [isAutoRotate]);

  useEffect(() => {
    autoRotateRef.current = localAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = localAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.2;
    }
  }, [localAutoRotate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const nValues = { crown: 1.52, flint: 1.66, diamond: 2.42 };
  const baseN = nValues[prismMaterial];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(10, 15, 10);
    scene.add(spotLight);

    // Floor Laboratory Grid
    const grid = new THREE.GridHelper(24, 24, 0xf59e0b, 0x1e293b);
    grid.position.y = -2;
    scene.add(grid);

    // 1. 3D Glass Prism (Equilateral Triangle extruded along Z)
    const prismShape = new THREE.Shape();
    const side = 4;
    const h = (side * Math.sqrt(3)) / 2;
    prismShape.moveTo(0, h * (2 / 3));
    prismShape.lineTo(-side / 2, -h * (1 / 3));
    prismShape.lineTo(side / 2, -h * (1 / 3));
    prismShape.closePath();

    const prismExtrude = {
      depth: 3.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const prismGeom = new THREE.ExtrudeGeometry(prismShape, prismExtrude);
    prismGeom.center();

    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transmission: 0.85,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      ior: baseN,
      thickness: 3.5,
    });
    const prismMesh = new THREE.Mesh(prismGeom, prismMat);
    prismMesh.position.set(0, 0.5, 0);
    scene.add(prismMesh);
    prismMeshRef.current = prismMesh;

    // Prism Bevel Edges
    const prismEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(prismGeom),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    prismMesh.add(prismEdges);

    // 2. Laser Gun Stand (on the left)
    const gunGroup = new THREE.Group();
    const gunBodyGeom = new THREE.CylinderGeometry(0.3, 0.35, 2.5, 16);
    gunBodyGeom.rotateZ(Math.PI / 2);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const gunMesh = new THREE.Mesh(gunBodyGeom, gunMat);
    gunGroup.add(gunMesh);

    // Gun nozzle
    const nozzleGeom = new THREE.CylinderGeometry(0.18, 0.25, 0.5, 16);
    nozzleGeom.rotateZ(Math.PI / 2);
    const nozzleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nozzleMesh = new THREE.Mesh(nozzleGeom, nozzleMat);
    nozzleMesh.position.set(1.4, 0, 0);
    gunGroup.add(nozzleMesh);

    gunGroup.position.set(-8, 0.5, 0);
    scene.add(gunGroup);

    // 3. Projection Screen (on the right)
    const screenGeom = new THREE.BoxGeometry(0.2, 5, 8);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      metalness: 0.0,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(8.5, 0.5, 0);
    scene.add(screenMesh);

    // Group for rays
    const raysGroup = new THREE.Group();
    scene.add(raysGroup);
    raysGroupRef.current = raysGroup;

    // Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.2;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update Prism Material & Angle Rays
  useEffect(() => {
    const group = raysGroupRef.current;
    const prism = prismMeshRef.current;
    if (!group || !prism) return;

    // Rotate prism based on angle
    const angleRad = ((prismAngle - 45) * Math.PI) / 180;
    prism.rotation.z = angleRad;

    // Clear previous rays
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    // Helper to create glowing beam cylinder
    const createBeam = (p1: THREE.Vector3, p2: THREE.Vector3, color: number, radius = 0.05, opacity = 0.9) => {
      const dist = p1.distanceTo(p2);
      const geom = new THREE.CylinderGeometry(radius, radius, dist, 8);
      geom.translate(0, dist / 2, 0);
      geom.rotateX(Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(p1);
      mesh.lookAt(p2);
      return mesh;
    };

    // 1. Incident White Beam from Gun (-6.5, 0.5, 0) to Prism Face (-1.2, 0.5, 0)
    const gunStart = new THREE.Vector3(-6.5, 0.5, 0);
    const prismHit = new THREE.Vector3(-1.2, 0.5, 0);
    group.add(createBeam(gunStart, prismHit, 0xffffff, 0.08, 0.95));

    // Internal refracted point on exit face
    const exitPoint = new THREE.Vector3(1.2, 0.1, 0);
    group.add(createBeam(prismHit, exitPoint, 0xf1f5f9, 0.06, 0.8));

    // 2. Dispersed Spectrum Beams from exitPoint to Screen (at X = 8.4)
    // 7 colors of rainbow: Violet bends most (lowest Y), Red bends least (highest Y)
    const spectrum = [
      { name: "Qizil", color: 0xef4444, devY: 0.9, devZ: -1.2 },
      { name: "Zargʻaldoq", color: 0xf97316, devY: 0.6, devZ: -0.8 },
      { name: "Sariq", color: 0xeab308, devY: 0.3, devZ: -0.4 },
      { name: "Yashil", color: 0x22c55e, devY: 0.0, devZ: 0.0 },
      { name: "Zangori", color: 0x06b6d4, devY: -0.3, devZ: 0.4 },
      { name: "Koʻk", color: 0x3b82f6, devY: -0.6, devZ: 0.8 },
      { name: "Binafsha", color: 0x8b5cf6, devY: -0.9, devZ: 1.2 },
    ];

    const dispersionScale = (baseN - 1) * 1.5;

    spectrum.forEach((spec) => {
      const targetY = exitPoint.y + spec.devY * dispersionScale;
      const targetZ = exitPoint.z + spec.devZ * dispersionScale * 0.8;
      const screenTarget = new THREE.Vector3(8.4, targetY, targetZ);

      // Rainbow Beam
      group.add(createBeam(exitPoint, screenTarget, spec.color, 0.04, 0.85));

      // Glowing hit spot on the screen
      const spotGeom = new THREE.SphereGeometry(0.12, 12, 12);
      const spotMat = new THREE.MeshBasicMaterial({ color: spec.color });
      const spotMesh = new THREE.Mesh(spotGeom, spotMat);
      spotMesh.position.copy(screenTarget);
      group.add(spotMesh);
    });
  }, [prismAngle, prismMaterial, baseN]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 flex flex-col backdrop-blur-2xl"
          : "w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      }`}
    >
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setLocalAutoRotate(!localAutoRotate)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
            localAutoRotate
              ? "bg-amber-950/90 border-amber-500 text-amber-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="3D prizma fazosini avtomatik 360° aylantirish"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin text-amber-400" : ""}`} />
          <span>{localAutoRotate ? "Avto Aylanish: Faol" : "Avto Aylantirish"}</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title={isFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Toʻliq ekran (Fullscreen)"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>Optik Dispersiya: n={baseN}, Burchak={prismAngle}°, Nyuton 7 Rang Spektri</span>
        </div>

        {isFullscreen && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-[11px] text-rose-300 font-bold backdrop-blur-md shadow-lg">
            Toʻliq ekrandan chiqish uchun ESC yoki oʻng yuqoridagi tugmani bosing
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. REAL 3D PROJECTILE BALLISTICS VIEWPORT
// ==========================================
interface Projectile3DProps {
  velocity: number;
  angle: number; // degrees
  targetDist: number; // 65m
  isLaunching: boolean;
  onHitResult?: (hit: boolean, distanceDiff: number) => void;
  isAutoRotate?: boolean;
}

export const Projectile3DReal: React.FC<Projectile3DProps> = ({
  velocity,
  angle,
  targetDist,
  isLaunching,
  isAutoRotate = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cannonBarrelRef = useRef<THREE.Group | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const targetMeshRef = useRef<THREE.Group | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAutoRotate, setLocalAutoRotate] = useState<boolean>(isAutoRotate);
  const autoRotateRef = useRef<boolean>(isAutoRotate);

  useEffect(() => {
    setLocalAutoRotate(isAutoRotate);
  }, [isAutoRotate]);

  useEffect(() => {
    autoRotateRef.current = localAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = localAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [localAutoRotate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Physics scaling: 1m in physics = 0.3 units in Three.js
  const meterScale = 0.28;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b19);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-6, 10, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(8, 2, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    sunLight.position.set(10, 20, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Ground Runway Grid
    const grid = new THREE.GridHelper(40, 40, 0xe11d48, 0x1e293b);
    grid.position.set(10, 0, 0);
    scene.add(grid);

    // Distance Markers along the ground (10m, 20m, 30m, 40m, 50m, 60m, 70m)
    for (let m = 10; m <= 80; m += 10) {
      const markerGeom = new THREE.BoxGeometry(0.08, 0.4, 3);
      const markerMat = new THREE.MeshBasicMaterial({
        color: m === 65 ? 0xf59e0b : 0x475569,
      });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.set(-10 + m * meterScale, 0.2, 0);
      scene.add(markerMesh);
    }

    // 1. 3D Metal Cannon Assembly
    const cannonBase = new THREE.Group();
    cannonBase.position.set(-10, 0, 0);

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 24);
    wheelGeom.rotateX(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    const wheel1 = new THREE.Mesh(wheelGeom, wheelMat);
    wheel1.position.set(0, 0.7, 0.9);
    const wheel2 = new THREE.Mesh(wheelGeom, wheelMat);
    wheel2.position.set(0, 0.7, -0.9);
    cannonBase.add(wheel1);
    cannonBase.add(wheel2);

    // Carriage Base
    const carriageGeom = new THREE.BoxGeometry(1.8, 0.5, 1.4);
    const carriageMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const carriage = new THREE.Mesh(carriageGeom, carriageMat);
    carriage.position.set(0, 0.7, 0);
    cannonBase.add(carriage);

    // Pivoting Barrel Group
    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.9, 0);

    const barrelGeom = new THREE.CylinderGeometry(0.3, 0.45, 2.8, 20);
    barrelGeom.rotateZ(-Math.PI / 2);
    barrelGeom.translate(1.4, 0, 0);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const barrelMesh = new THREE.Mesh(barrelGeom, barrelMat);
    barrelPivot.add(barrelMesh);

    cannonBase.add(barrelPivot);
    scene.add(cannonBase);
    cannonBarrelRef.current = barrelPivot;

    // 2. 3D Target Pedestal at targetDist (65m)
    const targetGroup = new THREE.Group();
    const targetPosX = -10 + targetDist * meterScale;
    targetGroup.position.set(targetPosX, 0, 0);

    // Target Stand
    const postGeom = new THREE.CylinderGeometry(0.12, 0.15, 2.5, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const post = new THREE.Mesh(postGeom, postMat);
    post.position.y = 1.25;
    targetGroup.add(post);

    // Target Rings
    const ringOuterGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
    ringOuterGeom.rotateZ(Math.PI / 2);
    const ringOuterMat = new THREE.MeshStandardMaterial({ color: 0xe11d48 });
    const ringOuter = new THREE.Mesh(ringOuterGeom, ringOuterMat);
    ringOuter.position.y = 2.4;
    targetGroup.add(ringOuter);

    const ringInnerGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32);
    ringInnerGeom.rotateZ(Math.PI / 2);
    const ringInnerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const ringInner = new THREE.Mesh(ringInnerGeom, ringInnerMat);
    ringInner.position.y = 2.4;
    targetGroup.add(ringInner);

    const bullseyeGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 32);
    bullseyeGeom.rotateZ(Math.PI / 2);
    const bullseyeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const bullseye = new THREE.Mesh(bullseyeGeom, bullseyeMat);
    bullseye.position.y = 2.4;
    targetGroup.add(bullseye);

    scene.add(targetGroup);
    targetMeshRef.current = targetGroup;

    // 3. Projectile Ball
    const ballGeom = new THREE.SphereGeometry(0.28, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });
    const ballMesh = new THREE.Mesh(ballGeom, ballMat);
    ballMesh.position.set(-10, 0.9, 0);
    scene.add(ballMesh);
    ballMeshRef.current = ballMesh;

    // 4. Trajectory Line
    const lineGeom = new THREE.BufferGeometry();
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.3,
      gapSize: 0.15,
      linewidth: 2,
    });
    const trajectoryLine = new THREE.Line(lineGeom, lineMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.0;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update Barrel Rotation Angle and Precalculated Trajectory Arc
  useEffect(() => {
    const barrel = cannonBarrelRef.current;
    const line = trajectoryLineRef.current;
    if (!barrel || !line) return;

    const rad = (angle * Math.PI) / 180;
    barrel.rotation.z = rad;

    // Calculate trajectory arc
    const g = 9.8;
    const v0 = velocity;
    const tTotal = (2 * v0 * Math.sin(rad)) / g;
    const pointsCount = 60;
    const positions: number[] = [];

    const startX = -10 + 2.8 * Math.cos(rad) * meterScale;
    const startY = 0.9 + 2.8 * Math.sin(rad) * meterScale;

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * tTotal;
      const xMet = v0 * Math.cos(rad) * t;
      const yMet = v0 * Math.sin(rad) * t - 0.5 * g * t * t;
      positions.push(startX + xMet * meterScale, Math.max(0, startY + yMet * meterScale), 0);
    }

    line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    line.computeLineDistances();
  }, [velocity, angle]);

  // Projectile Flight Animation Loop
  useEffect(() => {
    if (!isLaunching) return;

    const ball = ballMeshRef.current;
    if (!ball) return;

    const rad = (angle * Math.PI) / 180;
    const g = 9.8;
    const v0 = velocity;
    const tTotal = (2 * v0 * Math.sin(rad)) / g;
    const startTime = Date.now();
    const duration = 1800; // ms

    const startX = -10 + 2.8 * Math.cos(rad) * meterScale;
    const startY = 0.9 + 2.8 * Math.sin(rad) * meterScale;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min(1, elapsed / duration);
      const curT = prog * tTotal;

      const xMet = v0 * Math.cos(rad) * curT;
      const yMet = v0 * Math.sin(rad) * curT - 0.5 * g * curT * curT;

      ball.position.set(startX + xMet * meterScale, Math.max(0.28, startY + yMet * meterScale), 0);

      if (prog >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isLaunching, velocity, angle]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 flex flex-col backdrop-blur-2xl"
          : "w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      }`}
    >
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setLocalAutoRotate(!localAutoRotate)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
            localAutoRotate
              ? "bg-rose-950/90 border-rose-500 text-rose-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="3D ballistika maydonini avtomatik 360° aylantirish"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin text-rose-400" : ""}`} />
          <span>{localAutoRotate ? "Avto Aylanish: Faol" : "Avto Aylantirish"}</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title={isFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Toʻliq ekran (Fullscreen)"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-rose-400" />}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          <span>3D Ballistika: v₀={velocity} m/s, α={angle}°, Nishon={targetDist} m</span>
        </div>

        {isFullscreen && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-[11px] text-rose-300 font-bold backdrop-blur-md shadow-lg">
            Toʻliq ekrandan chiqish uchun ESC yoki oʻng yuqoridagi tugmani bosing
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. REAL 3D HOOKE'S LAW SPRING VIEWPORT
// ==========================================
interface Spring3DProps {
  springMass: number;
  springK: number;
  springOffset: number; // offset in cm
  isAutoRotate?: boolean;
}

export const Spring3DReal: React.FC<Spring3DProps> = ({
  springMass,
  springK,
  springOffset,
  isAutoRotate = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const springMeshRef = useRef<THREE.Mesh | null>(null);
  const massMeshRef = useRef<THREE.Mesh | null>(null);
  const arrowUpRef = useRef<THREE.ArrowHelper | null>(null);
  const arrowDownRef = useRef<THREE.ArrowHelper | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAutoRotate, setLocalAutoRotate] = useState<boolean>(isAutoRotate);
  const autoRotateRef = useRef<boolean>(isAutoRotate);

  useEffect(() => {
    setLocalAutoRotate(isAutoRotate);
  }, [isAutoRotate]);

  useEffect(() => {
    autoRotateRef.current = localAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = localAutoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [localAutoRotate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040817);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2, 20);
    pointLight.position.set(4, 6, 6);
    scene.add(pointLight);

    // 1. Ceiling Beam Mount
    const beamGeom = new THREE.BoxGeometry(6, 0.4, 1.5);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(0, 7.5, 0);
    scene.add(beam);

    // Ceiling Hook
    const hookGeom = new THREE.TorusGeometry(0.3, 0.08, 12, 24, Math.PI);
    hookGeom.rotateZ(Math.PI);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const hook = new THREE.Mesh(hookGeom, hookMat);
    hook.position.set(0, 7.3, 0);
    scene.add(hook);

    // 2. Metric Ruler Stand on the right
    const rulerGeom = new THREE.BoxGeometry(0.1, 7, 0.4);
    const rulerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const ruler = new THREE.Mesh(rulerGeom, rulerMat);
    ruler.position.set(2.5, 4, 0);
    scene.add(ruler);

    for (let r = 0; r <= 14; r++) {
      const tickGeom = new THREE.BoxGeometry(0.15, 0.04, 0.3);
      const tickMat = new THREE.MeshBasicMaterial({ color: r % 2 === 0 ? 0x10b981 : 0x64748b });
      const tick = new THREE.Mesh(tickGeom, tickMat);
      tick.position.set(2.4, 0.8 + r * 0.45, 0);
      scene.add(tick);
    }

    // 3. Hanging Weight Mass Block
    const massGeom = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 24);
    const massMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const massMesh = new THREE.Mesh(massGeom, massMat);
    massMesh.position.set(0, 2.5, 0);
    scene.add(massMesh);
    massMeshRef.current = massMesh;

    // 4. Force Arrows (Restoring force up, Gravity down)
    const arrowUp = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-1.2, 2.5, 0),
      1.5,
      0x10b981,
      0.3,
      0.2
    );
    scene.add(arrowUp);
    arrowUpRef.current = arrowUp;

    const arrowDown = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(1.2, 2.5, 0),
      1.5,
      0xef4444,
      0.3,
      0.2
    );
    scene.add(arrowDown);
    arrowDownRef.current = arrowDown;

    // Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.0;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update 3D Spring Helix Mesh and Mass position as springOffset changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old spring mesh
    if (springMeshRef.current) {
      scene.remove(springMeshRef.current);
      springMeshRef.current.geometry.dispose();
    }

    // Top anchor is at Y = 7.0
    // Mass anchor is at Y = 3.5 + springOffset * 0.04
    const topY = 7.0;
    const curMassY = Math.max(1.0, 3.5 + springOffset * 0.04);
    const springLength = topY - curMassY;

    // Generate Helical 3D Curve
    const coils = 11;
    const radius = 0.55;
    const pointsCount = 180;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const theta = t * coils * 2 * Math.PI;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = topY - t * springLength;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.09, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.7,
      roughness: 0.2,
    });
    const springMesh = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(springMesh);
    springMeshRef.current = springMesh;

    // Update Mass Block position
    if (massMeshRef.current) {
      massMeshRef.current.position.set(0, curMassY - 0.6, 0);
    }

    // Update Force Arrows
    const restoringForce = Math.abs(springK * (springOffset / 100));
    const gravityForce = springMass * 9.8;

    if (arrowUpRef.current) {
      arrowUpRef.current.position.set(-1.2, curMassY - 0.6, 0);
      arrowUpRef.current.setLength(Math.max(0.5, Math.min(3.0, restoringForce * 0.08)), 0.25, 0.15);
    }
    if (arrowDownRef.current) {
      arrowDownRef.current.position.set(1.2, curMassY - 0.6, 0);
      arrowDownRef.current.setLength(Math.max(0.5, Math.min(3.0, gravityForce * 0.08)), 0.25, 0.15);
    }
  }, [springOffset, springMass, springK]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 flex flex-col backdrop-blur-2xl"
          : "w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      }`}
    >
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setLocalAutoRotate(!localAutoRotate)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
            localAutoRotate
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="3D prujina tebranish maydonini avtomatik 360° aylantirish"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin text-emerald-400" : ""}`} />
          <span>{localAutoRotate ? "Avto Aylanish: Faol" : "Avto Aylantirish"}</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title={isFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Toʻliq ekran (Fullscreen)"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Guk Qonuni: m={springMass} kg, k={springK} N/m, Δx={springOffset.toFixed(1)} sm</span>
        </div>

        {isFullscreen && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/80 text-[11px] text-rose-300 font-bold backdrop-blur-md shadow-lg">
            Toʻliq ekrandan chiqish uchun ESC yoki oʻng yuqoridagi tugmani bosing
          </div>
        )}
      </div>
    </div>
  );
};
