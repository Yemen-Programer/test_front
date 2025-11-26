"use client";

import React, { useState, useEffect, useRef } from "react";
import CameraPermissionButton from "./btn";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ARWebXRProps {
  modelUrl: string;
  onClose?: () => void;
}

const ARWebXR = ({ modelUrl }: ARWebXRProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controller: THREE.Group;
    let reticle: THREE.Mesh;
    let model: THREE.Object3D | null = null;

    if (!mountRef.current) return; // ⛔ منع الوصول لـ null

    // Scene + Renderer
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera();

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load model
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
    });

    // Reticle
    const geo = new THREE.RingGeometry(0.08, 0.1, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    reticle = new THREE.Mesh(geo, mat);
    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);

    // WebXR Session
    const sessionInit: XRSessionInit = {
      requiredFeatures: ["hit-test", "local-floor"],
    };

    navigator.xr?.requestSession("immersive-ar", sessionInit).then((session) => {
      renderer.xr.setSession(session);

      controller = renderer.xr.getController(0);
          (controller as any).addEventListener("select", () => {
          if (model && reticle.visible) {
            const clone = model.clone();
            clone.position.copy(reticle.position);
            scene.add(clone);
          }
        });


      scene.add(controller);

      let hitTestSource: XRHitTestSource | null = null;
      let referenceSpace: XRReferenceSpace;

      session.requestReferenceSpace("viewer").then((space) => {
        session.requestHitTestSource({ space }).then((source) => {
          hitTestSource = source;
        });
      });

      session.requestReferenceSpace("local-floor").then((refSpace) => {
        referenceSpace = refSpace;

        renderer.setAnimationLoop((time, frame) => {
          if (frame && hitTestSource) {
            const viewerPose = frame.getViewerPose(referenceSpace);

            if (viewerPose) {
              const hitTestResults = frame.getHitTestResults(hitTestSource);

              if (hitTestResults.length > 0) {
                const hitPose = hitTestResults[0].getPose(referenceSpace);
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
            }
          }

          renderer.render(scene, camera);
        });
      });
    });

    return () => {
      renderer?.dispose();
    };
  }, [cameraAllowed]);

  if (!cameraAllowed) {
    return <CameraPermissionButton onGranted={() => setCameraAllowed(true)} />;
  }

  return (
    <div
      ref={mountRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default ARWebXR;
