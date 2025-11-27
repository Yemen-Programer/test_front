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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let model: THREE.Object3D | null = null;
    let animationFrameId: number;

    const mount = mountRef.current;
    if (!mount) return;

    // إنشاء فيديو للكاميرا
    const video = document.createElement('video');
    videoRef.current = video;
    video.setAttribute('playsinline', 'true');
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    mount.appendChild(video);

    // Scene
    scene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 0);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, 0, -0.5); // وضع المودل أمام الكاميرا
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("❌ Failed to load model:", error);
        setError("فشل تحميل النموذج ثلاثي الأبعاد");
      }
    );

    // بدء تشغيل الكاميرا الخلفية
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment', // استخدام الكاميرا الخلفية
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.play();

        // إنشاء texture من الفيديو
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;

        // إنشاء خلفية المشهد من الفيديو
        const videoGeometry = new THREE.PlaneGeometry(2, 2);
        const videoMaterial = new THREE.MeshBasicMaterial({ 
          map: videoTexture,
          transparent: true,
          opacity: 1
        });
        const videoBackground = new THREE.Mesh(videoGeometry, videoMaterial);
        videoBackground.position.set(0, 0, -1);
        scene.add(videoBackground);

        // Animation loop
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          if (model) {
            // تدوير المودل تلقائياً
            model.rotation.y += 0.01;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };
        animate();

      } catch (err) {
        console.error('❌ Camera error:', err);
        setError('تعذر الوصول إلى الكاميرا الخلفية');
      }
    };

    startCamera();

    // Handle window resize
    const handleResize = () => {
      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      
      if (videoRef.current && mount.contains(videoRef.current)) {
        mount.removeChild(videoRef.current);
      }
    };
  }, [cameraAllowed, modelUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          المحاولة مرة أخرى
        </button>
      </div>
    );
  }

  if (!cameraAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <CameraPermissionButton onGranted={() => setCameraAllowed(true)} />
        <p className="mt-4 text-gray-600 text-center px-4">
          يرجى السماح بالوصول إلى الكاميرا الخلفية لعرض النموذج ثلاثي الأبعاد في الواقع المعزز
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mountRef}
        style={{ 
          width: "100vw", 
          height: "100vh", 
          overflow: "hidden",
          position: "relative"
        }}
      />
      
      {/* معلومات للمستخدم */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded text-center">
        <p>النموذج ثلاثي الأبعاد معروض على الكاميرا الخلفية</p>
        <p className="text-sm opacity-75">حرك الهاتف لرؤية النموذج من زوايا مختلفة</p>
      </div>
    </div>
  );
};

export default ARWebXR;
