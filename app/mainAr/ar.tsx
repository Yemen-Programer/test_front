"use client";

import React, { useState, useEffect, useRef } from "react";
import CameraPermissionButton from "./btn";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ARWebXRProps {
  modelUrl: string;
  onClose?: () => void;
}

const ARWebXR: React.FC<ARWebXRProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controller: THREE.Group | null = null;
    let reticle: THREE.Mesh;
    let model: THREE.Object3D | null = null;

    // ⭐ منع أي مشكلة بسبب null
    const mount = mountRef.current;
    if (!mount) return;

    // Scene + Renderer
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera();

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
      },
      undefined,
      () => console.error("❌ Failed to load model:", modelUrl)
    );

    // Reticle
    const geo = new THREE.RingGeometry(0.08, 0.1, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    reticle = new THREE.Mesh(geo, mat);
    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);

const sessionInit: XRSessionInit = {
  requiredFeatures: ["hit-test", "local-floor"],
  optionalFeatures: ["dom-overlay", "camera-access"],
  domOverlay: { root: mount }
};

navigator.xr?.requestSession("immersive-ar", sessionInit).then((session) => {
        if (!renderer) return;

        renderer.xr.setSession(session);

        // Controller
        controller = renderer.xr.getController(0);
        controller.addEventListener("select", () => {
          if (model && reticle.visible) {
            const clone = model.clone();
            clone.position.copy(reticle.position);
            scene.add(clone);
          }
        });
        scene.add(controller);

        let hitTestSource: XRHitTestSource | null = null;
        let referenceSpace: XRReferenceSpace;

        // Request viewer space
        session.requestReferenceSpace("viewer").then((space) => {
          // TS-safe check
          const anySession = session as any;

          if (typeof anySession.requestHitTestSource === "function") {
            anySession
              .requestHitTestSource({ space })
              .then((source: XRHitTestSource) => {
                hitTestSource = source;
              })
              .catch(() => console.warn("Hit-test not available"));
          }
        });

        // Local space for animation
        session.requestReferenceSpace("local-floor").then((refSpace) => {
          referenceSpace = refSpace;

          renderer!.setAnimationLoop((time, frame) => {
            if (!frame || !hitTestSource) {
              renderer!.render(scene, camera);
              return;
            }

            const viewerPose = frame.getViewerPose(referenceSpace);
            if (!viewerPose) {
              renderer!.render(scene, camera);
              return;
            }

            const hits = frame.getHitTestResults(hitTestSource);

            if (hits.length > 0) {
              const hitPose = hits[0].getPose(referenceSpace);
              if (hitPose) {
                reticle.visible = true;
                reticle.position.set(
                  hitPose.transform.position.x,
                  hitPose.transform.position.y,
                  hitPose.transform.position.z
                );
              }
            } else {
              reticle.visible = false;
            }

            renderer!.render(scene, camera);
          });
        });
      })
      .catch(() => console.error("❌ AR session not available"));

    // Cleanup
    return () => {
      renderer?.dispose();
    };
  }, [cameraAllowed]);

  if (!cameraAllowed)
    return <CameraPermissionButton onGranted={() => setCameraAllowed(true)} />;

  return (
    <div
      ref={mountRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default ARWebXR;
