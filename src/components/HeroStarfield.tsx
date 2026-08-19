"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 320;
const ORB_COUNT = 14;

/**
 * HeroStarfield
 * ─────────────
 * Subtle WebGL starfield — tiny shimmering stars + soft glowing orbs.
 * Additive blending keeps it atmospheric without overpowering the hero text.
 */
export default function HeroStarfield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Shader: soft circular points with per-star twinkle ──
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new THREE.Color("#00ff88") },
        uWhite: { value: new THREE.Color("#ededed") },
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aTint;

        uniform float uTime;

        varying float vTwinkle;
        varying float vTint;
        varying float vScale;

        void main() {
          vTint = aTint;
          vScale = aScale;
          vTwinkle = 0.35 + 0.65 * abs(sin(uTime * aSpeed + aPhase));

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aScale * (280.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uAccent;
        uniform vec3 uWhite;

        varying float vTwinkle;
        varying float vTint;
        varying float vScale;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);

          // Soft glow falloff — tighter core for stars, wider halo for orbs
          float falloff = vScale > 6.0 ? 0.55 : 0.45;
          if (dist > falloff) discard;

          float glow = 1.0 - smoothstep(0.0, falloff, dist);
          glow = pow(glow, vScale > 6.0 ? 1.4 : 2.2);

          vec3 color = mix(uWhite, uAccent, vTint);
          float alpha = glow * vTwinkle * (vScale > 6.0 ? 0.22 : 0.45);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const positions = new Float32Array((STAR_COUNT + ORB_COUNT) * 3);
    const scales = new Float32Array(STAR_COUNT + ORB_COUNT);
    const phases = new Float32Array(STAR_COUNT + ORB_COUNT);
    const speeds = new Float32Array(STAR_COUNT + ORB_COUNT);
    const tints = new Float32Array(STAR_COUNT + ORB_COUNT);

    let i = 0;

    // Tiny stars — scattered across the view
    for (let s = 0; s < STAR_COUNT; s++, i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      scales[i] = 0.6 + Math.random() * 2.2;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 1.8;
      tints[i] = Math.random() > 0.72 ? 1.0 : 0.0;
    }

    // Larger glowing orbs — sparse, slow shimmer
    for (let o = 0; o < ORB_COUNT; o++, i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      scales[i] = 7 + Math.random() * 9;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.45;
      tints[i] = 0.35 + Math.random() * 0.65;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const start = performance.now();

    const animate = (now: number) => {
      material.uniforms.uTime.value = (now - start) * 0.001;
      points.rotation.y = (now - start) * 0.000015;
      points.rotation.x = Math.sin((now - start) * 0.00008) * 0.02;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 opacity-70"
      aria-hidden="true"
    />
  );
}
