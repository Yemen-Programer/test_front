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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let model: THREE.Object3D | null = null;
    let animationFrameId: number;

    const mount = mountRef.current;
    if (!mount) return;

    // تنظيف أي عناصر موجودة مسبقاً
    mount.innerHTML = '';

    const initAR = async () => {
      try {
        // 1. أولاً: تشغيل الكاميرا
        console.log("📹 Starting camera...");
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setCameraActive(true);
        
        // إنشاء فيديو للكاميرا
        const video = document.createElement('video');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.style.position = 'absolute';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '1';
        video.srcObject = stream;
        mount.appendChild(video);

        // انتظار حتى يكون الفيديو جاهزاً
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            console.log("✅ Camera ready");
            resolve(true);
          };
        });

        // 2. ثانياً: تهيئة Three.js
        console.log("🚀 Initializing Three.js...");
        
        // Scene
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({ 
          alpha: true, 
          antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '2';
        renderer.domElement.style.pointerEvents = 'none'; // السماح بالتفاعل مع الفيديو
        mount.appendChild(renderer.domElement);

        // Camera
        camera = new THREE.PerspectiveCamera(
          60, 
          window.innerWidth / window.innerHeight, 
          0.1, 
          1000
        );
        camera.position.set(0, 1.5, 0);

        // إضاءة محسنة
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // إضافة شبكة للمساعدة في التوجيه (اختياري)
        const gridHelper = new THREE.GridHelper(10, 10);
        gridHelper.position.y = -1;
        scene.add(gridHelper);

        // 3. ثالثاً: تحميل النموذج 3D
        console.log("📦 Loading 3D model...");
        const loader = new GLTFLoader();
        
        loader.load(
          modelUrl,
          (gltf) => {
            console.log("✅ Model loaded successfully");
            model = gltf.scene;
            
            // ضبط المقياس والموضع
            model.scale.set(0.3, 0.3, 0.3);
            model.position.set(0, 0, -1.5); // وضع النموذج أمام الكاميرا
            
            // تدوير النموذج قليلاً
            model.rotation.y = Math.PI / 4;
            
            scene.add(model);
            setModelLoaded(true);
            setLoading(false);
            
            console.log("🎯 Model positioned at:", model.position);
          },
          (progress) => {
            // تتبع التقدم في التحميل
            const percent = progress.lengthComputable 
              ? (progress.loaded / progress.total) * 100 
              : 0;
            console.log(`📥 Model loading: ${percent.toFixed(1)}%`);
          },
          (error) => {
            console.error("❌ Failed to load model:", error);
            setError(`فشل تحميل النموذج: ${error.message}`);
            setLoading(false);
          }
        );

        // 4. رابعاً: بدء animation loop
        console.log("🎬 Starting animation loop...");
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          if (model) {
            // تدوير النموذج ببطء
            model.rotation.y += 0.01;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };
        
        animate();

      } catch (err) {
        console.error('❌ AR initialization error:', err);
        setError('تعذر الوصول إلى الكاميرا الخلفية أو حدث خطأ في التهيئة');
        setLoading(false);
      }
    };

    initAR();

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
      console.log("🧹 Cleaning up AR scene...");
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // إيقاف كاميرا الفيديو
      if (mountRef.current) {
        const video = mountRef.current.querySelector('video');
        if (video && video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      setCameraActive(false);
    };
  }, [cameraAllowed, modelUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <div className="text-red-600 text-xl mb-4 text-center">
          ⚠️ {error}
        </div>
        <button 
          onClick={() => {
            setError(null);
            setCameraAllowed(false);
            setLoading(true);
            setModelLoaded(false);
          }}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          المحاولة مرة أخرى
        </button>
      </div>
    );
  }

  if (!cameraAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            الواقع المعزز
          </h2>
          <p className="text-gray-600 mb-6">
            قم بتمكين الكاميرا الخلفية لعرض النموذج ثلاثي الأبعاد في بيئتك الحقيقية
          </p>
          <CameraPermissionButton onGranted={() => setCameraAllowed(true)} />
        </div>
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
          background: "black"
        }}
      />
      
      {/* شاشة التحميل */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
          <div className="bg-white rounded-2xl p-6 text-center max-w-xs">
            <div className="animate-spin border-b-2 border-blue-500 rounded-full h-12 w-12 mx-auto mb-4"></div>
            <p className="text-gray-800 font-medium">جاري التحميل...</p>
            <p className="text-gray-600 text-sm mt-2">
              {cameraActive ? "جاري تحميل النموذج 3D" : "جاري تهيئة الكاميرا"}
            </p>
          </div>
        </div>
      )}
      
      {/* معلومات للمستخدم */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-2xl text-center z-20">
        {modelLoaded ? (
          <div>
            <p className="font-medium">✅ النموذج ثلاثي الأبعاد معروض بنجاح!</p>
            <p className="text-sm opacity-75 mt-1">حرك الهاتف لرؤية النموذج من زوايا مختلفة</p>
          </div>
        ) : cameraActive ? (
          <div>
            <p className="font-medium">📹 الكاميرا الخلفية نشطة</p>
            <p className="text-sm opacity-75 mt-1">جاري تحميل النموذج ثلاثي الأبعاد...</p>
          </div>
        ) : (
          <div>
            <p className="font-medium">⏳ جاري التهيئة...</p>
          </div>
        )}
      </div>

      {/* زر الإغلاق */}
      <button
        onClick={() => {
          setCameraAllowed(false);
          setModelLoaded(false);
          setLoading(true);
        }}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full z-20 shadow-lg transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default ARWebXR;
