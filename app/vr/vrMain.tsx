"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const ThreeJS360Viewer = ({
  panoramaImage,
  hotspots = [],
  onHotspotClick,
  className = "",
  height = "100vh",
  autoRotate = false,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });

  // keep references to created DOM icons so we can cleanup
  const createdIconsRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // cleanup previous icons if any
    createdIconsRef.current.forEach((el) => el.remove());
    createdIconsRef.current = [];

    // reset scene
    let animationId;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      90,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    if (renderer.outputColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    let sphereMesh = null;

    loader.load(
      panoramaImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;

        const geometry = new THREE.SphereGeometry(1000, 128, 128);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        sphereMesh = new THREE.Mesh(geometry, material);
        sphereMesh.scale.x = -1;
        scene.add(sphereMesh);

        hotspots.forEach((hotspot) => {
          const phi = THREE.MathUtils.degToRad(90 - (hotspot.pitch || 0));
          const theta = THREE.MathUtils.degToRad(hotspot.yaw || 0);
          const radius = 900;
          const x = -radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);

          const icon = document.createElement("div");
          icon.className = "hotspot-icon absolute flex items-center justify-center";
          icon.style.position = "absolute";
          icon.style.transform = "translate(-50%,-50%)";
          icon.style.pointerEvents = "auto";

          icon.setAttribute("role", "button");
          icon.setAttribute("aria-label", hotspot.title || hotspot.id || "hotspot");

          // inner HTML حسب النوع
          if (hotspot.type === "info") {
            icon.innerHTML = `
              <div style="background: rgba(37,99,235,0.85); padding:8px; border-radius:999px; display:flex; align-items:center; justify-content:center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="8"></line>
                </svg>
              </div>`;
          } else {
            const rot = (hotspot.yaw || 0) + 90;
            icon.innerHTML = `
              <div style="background: rgba(16,185,129,0.9); padding:8px; border-radius:999px; display:flex; align-items:center; justify-content:center; transform: rotate(${rot}deg);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>`;
          }

          // Tooltip عند hover
          const tooltip = document.createElement("span");
          tooltip.className = "hotspot-tooltip absolute bg-black text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none";
          tooltip.innerText = hotspot.title || "";
          icon.appendChild(tooltip);

          icon.addEventListener("mouseenter", () => {
            tooltip.style.opacity = "1";
            tooltip.style.bottom = "100%";
          });
          icon.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
          });

          icon.onclick = (e) => {
            e.stopPropagation();
            if (typeof onHotspotClick === "function") {
              onHotspotClick({ ...hotspot });
            }
          };

          mountRef.current.appendChild(icon);
          createdIconsRef.current.push(icon);

          hotspot._position3 = new THREE.Vector3(x, y, z);
        });

        setIsLoading(false);
      },
      (progress) => {
        if (progress && progress.total) {
          setLoadProgress((progress.loaded / progress.total) * 100);
        }
      },
      (err) => {
        console.error("Texture load error:", err);
        setIsLoading(false);
      }
    );

    const render = () => {
      animationId = requestAnimationFrame(render);

      if (autoRotate && !isDraggingRef.current) rotation.current.y += 0.001;

      cameraRef.current.rotation.order = "YXZ";
      cameraRef.current.rotation.y = rotation.current.y;
      cameraRef.current.rotation.x = rotation.current.x;

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      createdIconsRef.current.forEach((el, idx) => {
        const hotspot = hotspots[idx];
        if (!hotspot || !hotspot._position3) return;
        const pos = hotspot._position3.clone();
        pos.project(cameraRef.current);
        const x = (pos.x * 0.5 + 0.5) * mountRef.current.clientWidth;
        const y = (-pos.y * 0.5 + 0.5) * mountRef.current.clientHeight;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        const camToPoint = hotspot._position3.clone().sub(cameraRef.current.position);
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
        const visible = camToPoint.dot(forward) > 0;
        el.style.display = visible ? "block" : "none";
      });
    };

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
      mountRef.current.style.cursor = "grabbing";
    };
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      rotation.current.y += deltaX * 0.005;
      rotation.current.x += deltaY * 0.005;
      rotation.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotation.current.x));
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
      mountRef.current.style.cursor = "grab";
    };
    const onWheel = (e) => {
      e.preventDefault();
      const cam = cameraRef.current;
      cam.fov = THREE.MathUtils.clamp(cam.fov + e.deltaY * 0.05, 30, 120);
      cam.updateProjectionMatrix();
    };

    mountRef.current.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    mountRef.current.addEventListener("wheel", onWheel, { passive: false });

    render();

    return () => {
      cancelAnimationFrame(animationId);
      mountRef.current.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      mountRef.current.removeEventListener("wheel", onWheel);
      createdIconsRef.current.forEach((el) => el.remove());
      createdIconsRef.current = [];
      sceneRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      rendererRef.current && rendererRef.current.dispose();
    };
  }, [panoramaImage, JSON.stringify(hotspots || []), autoRotate]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 z-20 text-white text-center">
          <div>
            <div className="animate-spin border-b-2 border-white rounded-full h-10 w-10 mx-auto mb-4" />
            تحميل الجولة... {Math.round(loadProgress)}%
          </div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full relative overflow-hidden" style={{ cursor: "grab" }} />
    </div>
  );
};

export default ThreeJS360Viewer;
