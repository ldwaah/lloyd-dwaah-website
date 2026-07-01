import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  RoundedBox,
  MeshReflectorMaterial,
  useTexture,
  AdaptiveDpr,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { avatarConfig } from "../data/site.js";
import { usePointerRef, useScrollRef, isMobile, prefersReducedMotion } from "../lib/input.js";
import { heroScrollState } from "../lib/heroScroll.js";

const damp = THREE.MathUtils.damp;

// =====================================================================
//  Scene3D — a real 3D "digital studio" that lives behind the content.
//  The portrait exists inside this scene. Camera, lights and particles
//  all respond to the cursor; the camera glides as the page scrolls.
// =====================================================================
export default function Scene3D({ variant = "default", onPortraitReady, useHeroScroll = false }) {
  const pointer = usePointerRef();
  const scroll = useScrollRef();
  const [mobile] = useState(isMobile);
  const reduced = prefersReducedMotion();
  const hero = variant === "hero";

  const readScroll = () => (useHeroScroll ? heroScrollState.current : scroll.current);

  return (
    <div
      className={`pointer-events-none z-0 ${
        hero ? "absolute inset-0 h-full w-full" : "fixed inset-0"
      }`}
    >
      <Canvas
        shadows={false}
        dpr={mobile ? [1, 1.4] : [1, 1.9]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, hero ? 5.2 : 6], fov: hero ? 48 : 38 }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color("#203140");
          scene.fog = new THREE.FogExp2("#16242f", 0.045);
        }}
      >
        <Suspense fallback={null}>
          <CameraRig pointer={pointer} readScroll={readScroll} reduced={reduced} hero={hero} />
          <Lighting pointer={pointer} readScroll={readScroll} hero={hero} />
          <StudioEnvironment />
          <LightShafts scrollReader={readScroll} hero={hero} />

          <PortraitStage
            pointer={pointer}
            readScroll={readScroll}
            mobile={mobile}
            hero={hero}
            onPortraitReady={onPortraitReady}
          />

          {!hero && (
            <TravelField readScroll={readScroll} pointer={pointer} mobile={mobile} />
          )}
          <Particles pointer={pointer} readScroll={readScroll} count={mobile ? 280 : 700} hero={hero} />
          <Floor />
        </Suspense>

        {!mobile && (
          <EffectComposer disableNormalPass>
            <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.2} intensity={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={hero ? 0.55 : 0.85} />
          </EffectComposer>
        )}
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}

// ---- Camera: parallax with cursor + glide on scroll -----------------------
function CameraRig({ pointer, readScroll, reduced, hero }) {
  useFrame((state, dt) => {
    const p = pointer.current;
    const sp = readScroll();
    const k = reduced ? 0.15 : 1;
    const sway = Math.sin(sp * Math.PI * 2) * 0.5 * k;
    const heroPull = hero ? sp : 0;
    const tx = p.x * (hero ? 0.55 : 0.7) * k + sway;
    const ty = (hero ? 0.15 : 0.3) + p.y * 0.45 * k - heroPull * 0.85;
    const tz = (hero ? 5.2 : 6) + heroPull * 2.8 + sp * (hero ? 0 : 2.4);
    state.camera.position.x = damp(state.camera.position.x, tx, 3, dt);
    state.camera.position.y = damp(state.camera.position.y, ty, 3, dt);
    state.camera.position.z = damp(state.camera.position.z, tz, 4, dt);
    state.camera.fov = damp(state.camera.fov, hero ? 48 - heroPull * 6 : 38, 3, dt);
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(0, 0.1 - heroPull * 0.45 - sp * (hero ? 0 : 0.6), 0);
    state.camera.rotation.z += sway * 0.03;
  });
  return null;
}

function Lighting({ pointer, readScroll, hero }) {
  const key = useRef();
  const rim = useRef();
  const fill = useRef();
  useFrame((state, dt) => {
    const p = pointer.current;
    const sp = readScroll();
    const heroPull = hero ? sp : 0;
    if (key.current) {
      key.current.position.x = damp(key.current.position.x, p.x * 5 + heroPull * 2, 4, dt);
      key.current.position.y = damp(key.current.position.y, 1 + p.y * 4 - heroPull * 2.5, 4, dt);
      key.current.intensity = damp(key.current.intensity, 60 - heroPull * 18, 3, dt);
    }
    if (rim.current) {
      rim.current.position.x = damp(
        rim.current.position.x,
        Math.sin(sp * Math.PI * 2) * 7 + heroPull * 3,
        3,
        dt
      );
      rim.current.intensity = damp(rim.current.intensity, 28 + heroPull * 22, 3, dt);
    }
    if (fill.current) {
      fill.current.intensity = damp(fill.current.intensity, 0.35 + heroPull * 0.25, 3, dt);
    }
  });
  return (
    <>
      <ambientLight ref={fill} intensity={0.35} />
      <pointLight ref={key} position={[2, 3, 4]} intensity={60} distance={18} decay={1.6} color="#bfeaff" />
      <pointLight ref={rim} position={[-6, -1, 2]} intensity={28} distance={16} decay={1.8} color="#2bb8e6" />
      <directionalLight position={[3, 5, 2]} intensity={0.4} color="#ffffff" />
    </>
  );
}

// ---- Procedural studio environment (reflections, no external HDRI) --------
function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={3} position={[0, 4, -6]} scale={[12, 6, 1]} color="#5eeaff" />
      <Lightformer intensity={1.2} position={[-6, 2, 1]} scale={[3, 6, 1]} color="#2bb8e6" />
      <Lightformer intensity={1} position={[6, 1, 1]} scale={[3, 6, 1]} color="#ffffff" />
      <Lightformer intensity={0.6} position={[0, -4, 2]} scale={[10, 3, 1]} color="#16244a" />
    </Environment>
  );
}

// ---- The portrait, sitting on glass, in 3D space --------------------------
function PortraitStage({ pointer, readScroll, mobile, hero, onPortraitReady }) {
  const [ready, setReady] = useState(false);
  const notified = useRef(false);

  useEffect(() => {
    if (avatarConfig.mode === "glb") return;
    const img = new Image();
    img.onload = () => setReady(true);
    img.onerror = () => setReady(true);
    img.src = avatarConfig.image;
  }, []);

  useEffect(() => {
    if (!ready || !onPortraitReady || notified.current) return;
    notified.current = true;
    onPortraitReady();
  }, [ready, onPortraitReady]);

  return ready ? (
    <Suspense fallback={<PortraitPlaceholder pointer={pointer} readScroll={readScroll} mobile={mobile} hero={hero} />}>
      <TexturedPortrait pointer={pointer} readScroll={readScroll} mobile={mobile} hero={hero} />
    </Suspense>
  ) : (
    <PortraitPlaceholder pointer={pointer} readScroll={readScroll} mobile={mobile} hero={hero} />
  );
}

function usePortraitMotion(group, { pointer, readScroll, mobile, hero }) {
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    const sp = readScroll();
    const heroPull = hero ? sp : 0;
    const targetX = hero ? p.x * 0.35 : mobile ? 0 : 1.75;
    const targetY = hero ? p.y * 0.2 - heroPull * 0.35 : (mobile ? 1.15 : 0.15) - sp * 5;
    const targetZ = hero ? heroPull * 0.65 : 0;
    g.position.x = damp(g.position.x, targetX, 3, dt);
    g.position.y = damp(g.position.y, targetY, 3, dt);
    g.position.z = damp(g.position.z, targetZ, 3, dt);
    g.rotation.y = damp(g.rotation.y, p.x * (hero ? 0.22 : 0.32) + heroPull * 0.08, 3, dt);
    g.rotation.x = damp(g.rotation.x, -p.y * (hero ? 0.14 : 0.2) - heroPull * 0.04, 3, dt);
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    const baseScale = hero ? (mobile ? 1.15 : 1.35 + heroPull * 0.12) : mobile ? 0.78 : 1;
    if (!g.userData.breatheApplied || g.userData.heroMode !== hero) {
      g.userData.baseScale = baseScale;
      g.userData.breatheApplied = true;
      g.userData.heroMode = hero;
    }
    const s = (g.userData.baseScale || baseScale) * breathe;
    g.scale.set(s, s, s);

    const fade = hero
      ? THREE.MathUtils.clamp(1 - heroPull * 0.55, 0.35, 1)
      : THREE.MathUtils.clamp(1 - (sp - 0.04) * 6, 0.35, 1);
    g.traverse((o) => {
      if (o.material) {
        if (o.userData.base === undefined) o.userData.base = o.material.opacity ?? 1;
        o.material.transparent = true;
        o.material.opacity = o.userData.base * fade;
      }
    });
    g.visible = fade > 0.05;
  });
}

function TexturedPortrait(props) {
  const group = useRef();
  const tex = useTexture(avatarConfig.image);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  usePortraitMotion(group, props);

  const aspect = tex.image ? tex.image.width / tex.image.height : 0.82;
  const h = props.hero ? (props.mobile ? 5.8 : 7.2) : 3.3;
  const w = h * aspect;

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Float speed={1.1} rotationIntensity={props.hero ? 0.08 : 0.18} floatIntensity={props.hero ? 0.25 : 0.45}>
        <PortraitFrame w={w} h={h} minimal={props.hero}>
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial map={tex} transparent toneMapped={false} />
          </mesh>
        </PortraitFrame>
      </Float>
    </group>
  );
}

function PortraitPlaceholder(props) {
  const group = useRef();
  usePortraitMotion(group, props);
  const w = props.hero ? (props.mobile ? 4.2 : 5.2) : 2.6;
  const h = props.hero ? (props.mobile ? 5.8 : 7.2) : 3.3;
  return (
    <group ref={group} position={[0, 0, 0]}>
      <Float speed={1.1} rotationIntensity={props.hero ? 0.08 : 0.18} floatIntensity={props.hero ? 0.25 : 0.45}>
        <PortraitFrame w={w} h={h} minimal={props.hero}>
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial color="#0e1424" roughness={0.4} metalness={0.2} emissive="#0a1a26" />
          </mesh>
          <mesh position={[0, 0.2, 0.13]}>
            <ringGeometry args={[0.5, 0.53, 48]} />
            <meshBasicMaterial color="#8fe6ff" transparent opacity={0.5} />
          </mesh>
        </PortraitFrame>
      </Float>
    </group>
  );
}

// Shared glass backing + glowing edge for the portrait.
function PortraitFrame({ w, h, children, minimal = false }) {
  if (minimal) {
    return <group>{children}</group>;
  }
  return (
    <group>
      {/* Glass backing panel with real depth */}
      <RoundedBox args={[w + 0.34, h + 0.34, 0.22]} radius={0.13} smoothness={4} position={[0, 0, -0.05]}>
        <meshPhysicalMaterial
          transparent
          opacity={0.4}
          roughness={0.08}
          metalness={0}
          transmission={0.7}
          thickness={0.6}
          ior={1.35}
          clearcoat={1}
          color="#0e1424"
        />
      </RoundedBox>
      {/* Glowing rim */}
      <RoundedBox args={[w + 0.4, h + 0.4, 0.02]} radius={0.15} smoothness={4} position={[0, 0, -0.07]}>
        <meshBasicMaterial color="#5eeaff" transparent opacity={0.18} />
      </RoundedBox>
      {children}
    </group>
  );
}

// ---- Travel field: layered glass panels you move through on scroll --------
// The whole field translates toward the camera as the page scrolls, so the
// panels stream past at different depths. This is what turns scrolling into
// "moving through a space" rather than down a page.
function TravelField({ readScroll, pointer, mobile }) {
  const group = useRef();
  const panels = useMemo(() => {
    const count = mobile ? 7 : 14;
    const seeded = [];
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      seeded.push({
        p: [
          side * (2.6 + Math.random() * 3.4),
          (Math.random() - 0.5) * 9,
          -2 - Math.random() * 12, // spread deep into the scene
        ],
        s: [0.8 + Math.random() * 1.1, 1.0 + Math.random() * 1.4, 0.1],
        r: (Math.random() - 0.5) * 0.8,
        speed: 0.7 + Math.random() * 0.9,
      });
    }
    return seeded;
  }, [mobile]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const sp = readScroll();
    const p = pointer.current;
    // Stream the field toward the camera as you scroll.
    g.position.z = damp(g.position.z, sp * 16, 3, dt);
    g.position.x = damp(g.position.x, -p.x * 0.6, 2, dt);
    g.position.y = damp(g.position.y, sp * 4 + p.y * 0.4, 2, dt);
    g.rotation.y = damp(g.rotation.y, p.x * 0.05, 3, dt);
  });

  return (
    <group ref={group}>
      {panels.map((sh, i) => (
        <Float key={i} speed={sh.speed} rotationIntensity={0.4} floatIntensity={0.9}>
          <RoundedBox
            args={sh.s}
            radius={0.08}
            smoothness={3}
            position={sh.p}
            rotation={[0, sh.r, sh.r]}
          >
            <meshPhysicalMaterial
              transparent
              opacity={0.24}
              roughness={0.05}
              metalness={0}
              transmission={0.88}
              thickness={0.4}
              ior={1.4}
              clearcoat={1}
              color="#16244a"
            />
          </RoundedBox>
        </Float>
      ))}
    </group>
  );
}

// ---- Volumetric light shafts (read as god rays through the bloom pass) -----
function LightShafts({ scrollReader, hero }) {
  const group = useRef();
  const shafts = useMemo(
    () => [
      { p: [-2.5, 2, -6], r: 0.5, s: [1.2, 16, 1] },
      { p: [3, 1, -7], r: -0.4, s: [0.9, 16, 1] },
      { p: [0.5, 3, -8], r: 0.2, s: [0.7, 16, 1] },
    ],
    []
  );

  useFrame((state, dt) => {
    if (!group.current || !hero || !scrollReader) return;
    const sp = scrollReader();
    group.current.rotation.z = damp(group.current.rotation.z, sp * 0.12, 3, dt);
    group.current.children.forEach((mesh, i) => {
      if (mesh.material) {
        mesh.material.opacity = 0.04 + sp * 0.06 + i * 0.01;
      }
    });
  });

  return (
    <group ref={group}>
      {shafts.map((sh, i) => (
        <mesh key={i} position={sh.p} rotation={[0, 0, sh.r]} scale={sh.s}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#5eeaff"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---- Particle field reacting to the cursor --------------------------------
function Particles({ pointer, readScroll, count, hero }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = pointer.current;
    const sp = readScroll();
    g.rotation.y += dt * (0.02 + (hero ? sp * 0.04 : 0));
    g.position.x = damp(g.position.x, p.x * 0.5, 2, dt);
    g.position.y = damp(g.position.y, p.y * 0.4 - (hero ? sp * 0.8 : 0), 2, dt);
    g.position.z = damp(g.position.z, hero ? sp * 1.2 : 0, 2, dt);
    if (g.material) {
      g.material.opacity = hero ? 0.35 + (1 - sp) * 0.35 : 0.55;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        color="#8fe6ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---- Reflective studio floor ----------------------------------------------
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        resolution={512}
        blur={[360, 110]}
        mixBlur={1}
        mixStrength={18}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        roughness={0.95}
        color="#16242f"
        metalness={0.55}
        mirror={0.45}
      />
    </mesh>
  );
}
