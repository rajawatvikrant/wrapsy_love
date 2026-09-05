import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FallingItem {
  object: THREE.Object3D;
  baseX: number;
  currentY: number;
  speedY: number;
  swayFreq: number;
  swayAmp: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  phase: number;
  zDepth: number;
}

/**
 * Proper, beautiful celebration falling elements across the hero banner:
 * - 3D Gift boxes with lids & bows, 3D hearts, curled silk ribbons, hand-tied bows, and gold stars.
 * - Solid, vibrant materials with standard depth testing (no clipping).
 * - Robust sizing (never NaN or 0), immediate page-load falling, and smooth continuous recycling.
 */
export default function HeartField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Guaranteed non-zero dimensions
    let width = Math.max(mount.clientWidth || 0, window.innerWidth || 1200);
    let height = Math.max(mount.clientHeight || 0, Math.round(window.innerHeight * 0.86) || 700);

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    // VIBRANT THEME PALETTE
    const colors = {
      rose: 0xf27d96,
      blush: 0xf8bccb,
      crimson: 0xc43056,
      gold: 0xf6bd60,
      antiqueGold: 0xdfa13d,
      cream: 0xfffaf2,
      peach: 0xfac5b2,
    };

    // SOLID MATERIALS WITH DEPTH TESTING
    const matRose = new THREE.MeshStandardMaterial({
      color: colors.rose,
      roughness: 0.32,
      metalness: 0.15,
    });

    const matBlush = new THREE.MeshStandardMaterial({
      color: colors.blush,
      roughness: 0.35,
      metalness: 0.1,
    });

    const matCrimson = new THREE.MeshStandardMaterial({
      color: colors.crimson,
      roughness: 0.3,
      metalness: 0.18,
    });

    const matGold = new THREE.MeshStandardMaterial({
      color: colors.gold,
      roughness: 0.22,
      metalness: 0.45,
    });

    const matCream = new THREE.MeshStandardMaterial({
      color: colors.cream,
      roughness: 0.38,
      metalness: 0.08,
    });

    const matPeach = new THREE.MeshStandardMaterial({
      color: colors.peach,
      roughness: 0.35,
      metalness: 0.12,
    });

    const matRibbonGold = new THREE.MeshStandardMaterial({
      color: colors.gold,
      roughness: 0.2,
      metalness: 0.45,
      side: THREE.DoubleSide,
    });

    const matRibbonRose = new THREE.MeshStandardMaterial({
      color: colors.rose,
      roughness: 0.25,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });

    // 1. 3D BEVELED HEART
    function createHeartGeometry() {
      const shape = new THREE.Shape();
      const x = 0, y = 0;
      shape.moveTo(x + 0.25, y + 0.25);
      shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
      shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.16,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.045,
        bevelThickness: 0.045,
      });
      geo.center();
      return geo;
    }
    const heartGeo = createHeartGeometry();

    // 2. 3D GIFT BOX WITH LID & BOW
    function createGiftBox(variantIdx: number) {
      const group = new THREE.Group();

      const boxMat = variantIdx % 2 === 0 ? matRose : matCream;
      const lidMat = variantIdx % 2 === 0 ? matCrimson : matPeach;
      const bowMat = matGold;

      // Base Box
      const baseGeo = new THREE.BoxGeometry(0.85, 0.75, 0.85);
      const baseMesh = new THREE.Mesh(baseGeo, boxMat);
      baseMesh.position.y = 0;

      // Lid
      const lidGeo = new THREE.BoxGeometry(0.92, 0.2, 0.92);
      const lidMesh = new THREE.Mesh(lidGeo, lidMat);
      lidMesh.position.y = 0.44;

      // Center Knot
      const knotGeo = new THREE.SphereGeometry(0.12, 12, 10);
      const knot = new THREE.Mesh(knotGeo, bowMat);
      knot.position.set(0, 0.58, 0);

      // Bow Loops
      const loopGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 16, Math.PI * 1.5);
      const loop1 = new THREE.Mesh(loopGeo, bowMat);
      loop1.position.set(-0.14, 0.64, 0);
      loop1.rotation.set(0.2, 0.3, 0.85);

      const loop2 = new THREE.Mesh(loopGeo, bowMat);
      loop2.position.set(0.14, 0.64, 0);
      loop2.rotation.set(-0.2, -0.3, -0.85);

      group.add(baseMesh, lidMesh, knot, loop1, loop2);
      return group;
    }

    // 3. CURLED SILK RIBBON STREAMER
    function createRibbonGeometry() {
      const geom = new THREE.BufferGeometry();
      const segments = 28;
      const vertices: number[] = [];
      const indices: number[] = [];
      const ribbonWidth = 0.16;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 3.5;
        const cx = Math.sin(angle) * 0.35;
        const cy = (t - 0.5) * 2.1;
        const cz = Math.cos(angle) * 0.35;

        const tx = Math.cos(angle) * ribbonWidth;
        const tz = -Math.sin(angle) * ribbonWidth;

        vertices.push(cx - tx, cy, cz - tz);
        vertices.push(cx + tx, cy, cz + tz);

        if (i < segments) {
          const a = i * 2;
          const b = i * 2 + 1;
          const c = (i + 1) * 2;
          const d = (i + 1) * 2 + 1;
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
      geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return geom;
    }
    const ribbonGeo = createRibbonGeometry();

    // 4. HAND-TIED BOW
    function createTiedBow() {
      const group = new THREE.Group();

      const knotGeo = new THREE.SphereGeometry(0.14, 12, 10);
      const knot = new THREE.Mesh(knotGeo, matGold);
      knot.scale.set(1, 0.85, 0.85);
      group.add(knot);

      const loopGeo = new THREE.TorusGeometry(0.28, 0.065, 8, 18, Math.PI * 1.5);
      const loop1 = new THREE.Mesh(loopGeo, matCrimson);
      loop1.position.set(-0.24, 0.1, 0);
      loop1.rotation.set(0.2, 0.3, 0.85);
      group.add(loop1);

      const loop2 = new THREE.Mesh(loopGeo, matCrimson);
      loop2.position.set(0.24, 0.1, 0);
      loop2.rotation.set(-0.2, -0.3, -0.85);
      group.add(loop2);

      return group;
    }

    // 5. 4-POINT STAR SPARKLE
    function createStarGeometry() {
      const shape = new THREE.Shape();
      const pts = 8;
      for (let i = 0; i < pts; i++) {
        const r = i % 2 === 0 ? 0.55 : 0.16;
        const a = (i * Math.PI) / 4;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelSize: 0.025,
        bevelThickness: 0.025,
        bevelSegments: 2,
      });
      geo.center();
      return geo;
    }
    const starGeo = createStarGeometry();

    // BOUNDS CALCULATION
    const getBounds = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleH = 2 * Math.tan(vFov / 2) * 19;
      const visibleW = visibleH * camera.aspect;
      return {
        halfW: visibleW / 2 + 1.5,
        halfH: visibleH / 2 + 2.0,
      };
    };

    let bounds = getBounds();
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // DEFINITIONS OF PROPER VISIBLE FALLING OBJECTS
    // Desktop: 11 items | Tablet: 7 items | Mobile: 5 items
    const itemDefs = isMobile
      ? [
          { type: "box", variant: 0, scale: 0.85 },
          { type: "heart", mat: matRose, scale: 0.8 },
          { type: "ribbon", mat: matRibbonGold, scale: 0.8 },
          { type: "bow", scale: 0.85 },
          { type: "star", scale: 0.75 },
        ]
      : isTablet
        ? [
            { type: "box", variant: 0, scale: 0.95 },
            { type: "heart", mat: matRose, scale: 0.9 },
            { type: "ribbon", mat: matRibbonGold, scale: 0.88 },
            { type: "bow", scale: 0.95 },
            { type: "box", variant: 1, scale: 0.92 },
            { type: "heart", mat: matBlush, scale: 0.88 },
            { type: "star", scale: 0.85 },
          ]
        : [
            // Desktop: 11 authentic, properly scaled celebration objects across full width
            { type: "box", variant: 0, scale: 1.05 },
            { type: "heart", mat: matRose, scale: 0.95 },
            { type: "ribbon", mat: matRibbonGold, scale: 0.92 },
            { type: "bow", scale: 1.0 },
            { type: "box", variant: 1, scale: 1.0 },
            { type: "heart", mat: matCrimson, scale: 0.9 },
            { type: "ribbon", mat: matRibbonRose, scale: 0.92 },
            { type: "star", scale: 0.9 },
            { type: "box", variant: 0, scale: 0.98 },
            { type: "heart", mat: matBlush, scale: 0.92 },
            { type: "bow", scale: 0.95 },
          ];

    const items: FallingItem[] = [];

    itemDefs.forEach((def, i) => {
      let obj: THREE.Object3D;
      if (def.type === "box") {
        obj = createGiftBox(def.variant ?? 0);
      } else if (def.type === "heart") {
        obj = new THREE.Mesh(heartGeo, def.mat ?? matRose);
      } else if (def.type === "ribbon") {
        obj = new THREE.Mesh(ribbonGeo, def.mat ?? matRibbonGold);
      } else if (def.type === "bow") {
        obj = createTiedBow();
      } else {
        obj = new THREE.Mesh(starGeo, matGold);
      }

      obj.scale.setScalar(def.scale);

      // Stagger horizontally across full width
      const spread = (i / itemDefs.length) * 2 - 1;
      const x = spread * bounds.halfW * 0.92 + (Math.random() - 0.5) * 1.5;

      // Stagger vertically so items are immediately falling on load
      const startY = bounds.halfH + 2.0 - (i / itemDefs.length) * (bounds.halfH * 2.4);
      const z = -4.5 + Math.random() * 2.5;

      obj.position.set(x, startY, z);
      obj.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      scene.add(obj);

      items.push({
        object: obj,
        baseX: x,
        currentY: startY,
        speedY: 0.012 + Math.random() * 0.008,
        swayFreq: 0.6 + Math.random() * 0.5,
        swayAmp: 0.45 + Math.random() * 0.5,
        rotSpeedX: 0.007 + Math.random() * 0.008,
        rotSpeedY: 0.009 + Math.random() * 0.01,
        rotSpeedZ: 0.005 + Math.random() * 0.006,
        phase: (i * Math.PI * 2) / itemDefs.length,
        zDepth: z,
      });
    });

    // LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0xfff8f5, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(6, 12, 10);
    scene.add(mainLight);

    const warmFill = new THREE.DirectionalLight(0xffdcd0, 0.95);
    warmFill.position.set(-6, -4, 6);
    scene.add(warmFill);

    const goldRim = new THREE.PointLight(0xf6bd60, 1.4, 35);
    goldRim.position.set(0, 4, 8);
    scene.add(goldRim);

    // MOUSE BREEZE PHYSICS
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetPointerX = px * bounds.halfW * 0.8;
      targetPointerY = py * bounds.halfH * 0.8;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // RESIZE OBSERVER FOR PERFECT MOUNT HANDLING
    const updateDimensions = () => {
      if (!mount) return;
      width = Math.max(mount.clientWidth || 0, window.innerWidth || 1200);
      height = Math.max(mount.clientHeight || 0, Math.round(window.innerHeight * 0.86) || 700);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      bounds = getBounds();
    };

    const ro = new ResizeObserver(updateDimensions);
    ro.observe(mount);
    window.addEventListener("resize", updateDimensions);

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (reduce) {
        renderer.render(scene, camera);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.08);
      const time = clock.getElapsedTime();

      currentPointerX += (targetPointerX - currentPointerX) * 0.05;
      currentPointerY += (targetPointerY - currentPointerY) * 0.05;

      items.forEach((item) => {
        // Continuous downward fall
        item.currentY -= item.speedY * (delta * 60);

        // Sinusoidal lateral drift
        const swayX = Math.sin(time * item.swayFreq + item.phase) * item.swayAmp;
        const swayZ = Math.cos(time * item.swayFreq * 0.7 + item.phase) * 0.3;

        // Gentle cursor breeze
        const dx = item.baseX + swayX - currentPointerX;
        const dy = item.currentY - currentPointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let repelX = 0;
        let repelY = 0;
        if (dist < 4.5 && dist > 0.01) {
          const force = (1 - dist / 4.5) * 0.7;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force * 0.4;
        }

        item.object.position.x = item.baseX + swayX + repelX;
        item.object.position.y = item.currentY + repelY;
        item.object.position.z = item.zDepth + swayZ;

        // 3D rotation
        item.object.rotation.x += item.rotSpeedX * (delta * 60);
        item.object.rotation.y += item.rotSpeedY * (delta * 60);
        item.object.rotation.z += item.rotSpeedZ * (delta * 60);

        // RECYCLE WHEN PAST BOTTOM
        if (item.currentY < -bounds.halfH - 2.5) {
          item.currentY = bounds.halfH + 2.5 + Math.random() * 2.0;
          item.baseX = (Math.random() * 2 - 1) * bounds.halfW * 0.9;
          item.speedY = 0.012 + Math.random() * 0.008;
          item.phase = Math.random() * Math.PI * 2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", updateDimensions);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  );
}
