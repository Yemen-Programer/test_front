"use client";

import React, { useState, useEffect, useRef } from "react";
import CameraPermissionButton from "./btn";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ARWebXR = ({ modelUrl, onClose }) => {
  const mountRef = useRef(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  useEffect(() => {
    if (!cameraAllowed) return;

    // 🔥 كود WebXR يبدأ فقط بعد السماح بالكاميرا

    let renderer, scene, camera, controller, reticle, model;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
    });

    // reticle
    const geo = new THREE.RingGeometry(0.08, 0.1, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    reticle = new THREE.Mesh(geo, mat);
    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);

    const sessionInit = { requiredFeatures: ["hit-test", "local-floor"] };
    navigator.xr.requestSession("immersive-ar", sessionInit).then((session) => {
      renderer.xr.setSession(session);

      controller = renderer.xr.getController(0);
      controller.addEventListener("select", () => {
        if (model && reticle.visible) {
          const clone = model.clone();
          clone.position.copy(reticle.position);
          scene.add(clone);
        }
      });
      scene.add(controller);

      let hitTestSource = null;
      const referenceSpace = renderer.xr.getReferenceSpace();

      session.requestReferenceSpace("viewer").then((space) => {
        session.requestHitTestSource({ space }).then((src) => {
          hitTestSource = src;
        });
      });

      renderer.setAnimationLoop((t, frame) => {
        if (frame && hitTestSource) {
          const viewerPose = frame.getViewerPose(referenceSpace);
          const hits = frame.getHitTestResults(hitTestSource);

          if (hits.length > 0) {
            const hitPose = hits[0].getPose(referenceSpace);
            reticle.visible = true;
            reticle.position.set(
              hitPose.transform.position.x,
              hitPose.transform.position.y,
              hitPose.transform.position.z
            );
          } else {
            reticle.visible = false;
          }
        }
        renderer.render(scene, camera);
      });
    });

    return () => renderer.dispose();
  }, [cameraAllowed]);

  // 🔥 زر إذن الكاميرا يظهر أولاً
  if (!cameraAllowed) {
    return <CameraPermissionButton onGranted={() => setCameraAllowed(true)} />;
  }

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ARWebXR;
