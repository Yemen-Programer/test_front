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
  const [loading, setLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let model: THREE.Object3D | null = null;
    let animationFrameId: number;

    const mount = mountRef.current;
    if (!mount) return;

    // تنظيف أي عناصر موجودة مسبقاً
    mount.innerHTML = '';

    // إنشاء فيديو للكاميرا
    const video = document.createElement('video');
    videoRef.current = video;
    video.setAttribute('playsinline', 'true');
    video.style.position = 'absolute';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '1';
    mount.appendChild(video);

    // Scene
    scene = new THREE.Scene();

    // Renderer - مع خلفية شفافة
    renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '2'; // فوق الفيديو
    mount.appendChild(renderer.domElement);

    // Camera - مع إعدادات مناسبة للواقع المعزز
    camera = new THREE.PerspectiveCamera(
      45, // مجال رؤية أوسع
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );
    camera.position.set(0, 0, 0);

    // إضاءة محسنة
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // نقطة مرجعية للمساعدة في التصحيح
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    // شبكة للمساعدة في التصحيح
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    console.log("🚀 Starting model load:", modelUrl);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        console.log("✅ Model loaded successfully:", gltf);
        model = gltf.scene;
        
        // ضبط المقياس والموضع
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, -2); // أبعد قليلاً عن الكاميرا
        
        // تدوير المودل ليكون في الاتجاه الصحيح
        model.rotation.set(0, 0, 0);
        
        scene.add(model);
        setModelLoaded(true);
        setLoading(false);
        
        console.log("🎯 Model added to scene at position:", model.position);
      },
      (progress) => {
        // تتبع التقدم في التحميل
        console.log("📥 Loading progress:", progress);
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📥 Model loading: ${percent.toFixed(2)}%`);
        }
      },
      (error) => {
        console.error("❌ Failed to load model:", error);
        setError(`فشل تحميل النموذج: ${error.message}`);
        setLoading(false);
      }
    );

    // بدء تشغيل الكاميرا الخلفية
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment', // استخدام الكاميرا الخلفية
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
          video.play();
          console.log("📹 Camera started successfully");
        };

        // Animation loop محسنة
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          if (model) {
            // تدوير المودل ببطء
            model.rotation.y += 0.005;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };
        
        animate();

      } catch (err) {
        console.error('❌ Camera error:', err);
        setError('تعذر الوصول إلى الكاميرا الخلفية');
        setLoading(false);
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
      }
    };
  }, [cameraAllowed, modelUrl]);

  // إضافة console.log للتتبع
  console.log("🔄 Component state:", { cameraAllowed, modelLoaded, loading, error });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => {
            setError(null);
            setCameraAllowed(false);
          }}
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
          position: "relative",
          background: "black" // خلفية سوداء مؤقتة
        }}
      />
      
      {/* شاشة التحميل */}
      {loading && (
        <div className="absolute top-4 left-4 right-4 bg-blue-500 text-white p-3 rounded text-center z-30">
          <p>جاري تحميل النموذج ثلاثي الأبعاد...</p>
        </div>
      )}
      
      {/* معلومات للمستخدم */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded text-center z-30">
        {modelLoaded ? (
          <p>✅ النموذج ثلاثي الأبعاد معروض بنجاح!</p>
        ) : (
          <p>📹 الكاميرا الخلفية نشطة - جاري تحميل النموذج...</p>
        )}
        <p className="text-sm opacity-75 mt-1">حرك الهاتف لرؤية النموذج من زوايا مختلفة</p>
      </div>

      {/* زر الإغلاق */}
      <button
        onClick={() => setCameraAllowed(false)}
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full z-30"
      >
        ✕
      </button>
    </div>
  );
};

export default ARWebXR;
