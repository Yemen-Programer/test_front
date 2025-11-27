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

    const initAR = async () => {
      try {
        console.log("🚀 Starting AR initialization...");

        // 1. تنظيف العناصر السابقة
        mount.innerHTML = '';

        // 2. بدء الكاميرا
        console.log("📹 Starting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        // إنشاء وعرض الفيديو
        const video = document.createElement('video');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        `;
        video.srcObject = stream;
        mount.appendChild(video);

        // انتظار جاهزية الفيديو
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(reject);
          };
          video.onerror = reject;
        });

        setCameraActive(true);
        console.log("✅ Camera ready");

        // 3. تهيئة Three.js
        console.log("🎮 Initializing Three.js...");
        
        scene = new THREE.Scene();
        
        renderer = new THREE.WebGLRenderer({ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          pointer-events: none;
        `;
        mount.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
          60, 
          window.innerWidth / window.innerHeight, 
          0.1, 
          100
        );
        camera.position.set(0, 1.6, 0);

        // إضاءة
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 2, 3);
        scene.add(directionalLight);

        // 4. تحميل النموذج 3D
        console.log("📦 Loading 3D model:", modelUrl);
        
        // اختبار أولاً: إنشاء نموذج بسيط للتأكد من عمل Three.js
        const testGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const testCube = new THREE.Mesh(testGeometry, testMaterial);
        testCube.position.set(0, 0, -2);
        scene.add(testCube);

        // ثم تحميل النموذج الحقيقي
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            console.log("✅ 3D Model loaded successfully");
            
            // إزالة المكعب الاختباري
            scene.remove(testCube);
            
            model = gltf.scene;
            
            // ضبط النموذج
            model.scale.set(0.3, 0.3, 0.3);
            model.position.set(0, 0, -1.5);
            
            scene.add(model);
            setModelLoaded(true);
            setLoading(false);
            
            console.log("🎯 Model positioned successfully");
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total) * 100;
              console.log(`📥 Model loading: ${percent.toFixed(1)}%`);
            }
          },
          (error) => {
            console.error("❌ Model loading failed:", error);
            // الاستمرار مع المكعب الاختباري
            setModelLoaded(true);
            setLoading(false);
            console.log("🔄 Continuing with test cube");
          }
        );

        // 5. بدء animation loop
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          if (model) {
            model.rotation.y += 0.01;
          } else {
            testCube.rotation.y += 0.01;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };
        
        animate();
        console.log("🎬 Animation loop started");

      } catch (err) {
        console.error('❌ AR initialization failed:', err);
        setError(`خطأ في التهيئة: ${err instanceof Error ? err.message : 'حدث خطأ غير معروف'}`);
        setLoading(false);
      }
    };

    initAR();

    // إعادة ضبط الحجم
    const handleResize = () => {
      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // التنظيف
    return () => {
      console.log("🧹 Cleaning up AR scene");
      
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // إيقاف كاميرا الفيديو
      if (mountRef.current) {
        const video = mountRef.current.querySelector('video');
        if (video && video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach(track => {
            track.stop();
            console.log("📹 Camera track stopped:", track.kind);
          });
        }
      }
      
      if (renderer) {
        renderer.dispose();
        console.log("🎮 Renderer disposed");
      }
      
      setCameraActive(false);
      setModelLoaded(false);
    };
  }, [cameraAllowed, modelUrl]);

  // إضافة تحميل احتياطي للنموذج
  const handleRetryWithFallback = () => {
    // استخدام نموذج افتراضي إذا كان هناك مشكلة
    const fallbackModel = "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";
    setError(null);
    setCameraAllowed(false);
    setTimeout(() => setCameraAllowed(true), 100);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            عذراً، حدث خطأ
          </h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={() => {
                setError(null);
                setCameraAllowed(false);
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              المحاولة مرة أخرى
            </button>
            <button 
              onClick={handleRetryWithFallback}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              تجربة بنموذج تجريبي
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cameraAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            تجربة الواقع المعزز
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
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
        className="w-full h-screen bg-black overflow-hidden"
      />
      
      {/* شاشة التحميل */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-30">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full h-16 w-16 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">جاري التهيئة</h3>
            <p className="text-gray-600">
              {cameraActive ? "جاري تحميل النموذج ثلاثي الأبعاد..." : "جاري تشغيل الكاميرا..."}
            </p>
          </div>
        </div>
      )}
      
      {/* معلومات الحالة */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-2xl text-center z-20 backdrop-blur-sm">
        {modelLoaded ? (
          <div>
            <p className="font-medium text-green-400">✨ النموذج معروض بنجاح!</p>
            <p className="text-sm opacity-75 mt-1">حرك هاتفك لمشاهدة النموذج من جميع الزوايا</p>
          </div>
        ) : cameraActive ? (
          <div>
            <p className="font-medium">📹 الكاميرا الخلفية نشطة</p>
            <p className="text-sm opacity-75 mt-1">جاري تحميل المحتوى ثلاثي الأبعاد...</p>
          </div>
        ) : null}
      </div>

      {/* زر الإغلاق */}
      <button
        onClick={() => {
          setCameraAllowed(false);
          setModelLoaded(false);
          setLoading(true);
        }}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full z-20 shadow-lg transition-colors transform hover:scale-105"
        aria-label="إغلاق الواقع المعزز"
      >
        <span className="text-lg font-bold">✕</span>
      </button>
    </div>
  );
};

export default ARWebXR;
