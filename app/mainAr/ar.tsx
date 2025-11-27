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
  const [sessionActive, setSessionActive] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (!cameraAllowed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let model: THREE.Object3D | null = null;
    let controller: THREE.Group | null = null;
    let reticle: THREE.Mesh | null = null;
    let currentSession: XRSession | null = null;

    const mount = mountRef.current;
    if (!mount) return;

    const initWebXR = async () => {
      try {
        console.log("🚀 Starting WebXR AR initialization...");
        setDebugInfo("جاري التحقق من دعم WebXR...");

        // التحقق من دعم WebXR
        if (!navigator.xr) {
          throw new Error("WebXR غير مدعوم في هذا المتصفح");
        }

        // التحقق من دعم AR
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!supported) {
          throw new Error("الواقع المعزز (AR) غير مدعوم في هذا الجهاز");
        }

        console.log("✅ WebXR AR supported");
        setDebugInfo("WebXR مدعوم - جاري التهيئة...");

        // تهيئة Three.js
        scene = new THREE.Scene();
        
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        
        mount.innerHTML = '';
        mount.appendChild(renderer.domElement);

        // الكاميرا
        camera = new THREE.PerspectiveCamera(
          70, 
          window.innerWidth / window.innerHeight, 
          0.01, 
          100
        );

        // الإضاءة
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);

        // 🔴 نموذج اختباري
        const testGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const testCube = new THREE.Mesh(testGeometry, testMaterial);
        testCube.visible = false; // مخفي حتى يتم وضعه
        scene.add(testCube);

        // Reticle (الدائرة الخضراء للإشارة)
        const ringGeometry = new THREE.RingGeometry(0.05, 0.1, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, 
          transparent: true, 
          opacity: 0.8 
        });
        reticle = new THREE.Mesh(ringGeometry, ringMaterial);
        reticle.rotation.x = -Math.PI / 2;
        reticle.visible = false;
        scene.add(reticle);

        // تحميل النموذج 3D
        console.log("📦 Loading 3D model:", modelUrl);
        setDebugInfo("جاري تحميل النموذج ثلاثي الأبعاد...");

        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            console.log("✅ 3D Model loaded successfully");
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            model.visible = false; // مخفي حتى يتم وضعه
            scene.add(model);
            setModelLoaded(true);
            setDebugInfo("النموذج محمل - انقر لوضعه في العالم الحقيقي");
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total) * 100;
              setDebugInfo(`جاري تحميل النموذج... ${percent.toFixed(1)}%`);
            }
          },
          (error) => {
            console.error("❌ Model loading failed:", error);
            setDebugInfo("فشل تحميل النموذج - استخدم النموذج الاختباري");
            setModelLoaded(false);
          }
        );

        // بدء جلسة WebXR
        setDebugInfo("جاري بدء جلسة الواقع المعزز...");
        
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'local-floor'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        });

        currentSession = session;
        setSessionActive(true);
        setLoading(false);

        console.log("✅ WebXR session started");
        setDebugInfo("جلسة AR نشطة - ابحث عن سطح مستوٍ");

        // ربط الجلسة مع Renderer
        await renderer.xr.setSession(session);

        // إعداد الـ Controller
        controller = renderer.xr.getController(0);
        controller.addEventListener('select', onSelect);
        scene.add(controller);

        // إعداد Hit Test
        let hitTestSource: XRHitTestSource | null = null;
        let localSpace: XRReferenceSpace | null = null;

        session.requestReferenceSpace('viewer').then((referenceSpace) => {
          session.requestHitTestSource({ space: referenceSpace }).then((source) => {
            hitTestSource = source;
          });
        });

        session.requestReferenceSpace('local-floor').then((referenceSpace) => {
          localSpace = referenceSpace;
        });

        // دالة وضع النموذج
        let modelPlaced = false;
        function onSelect() {
          if (reticle.visible && !modelPlaced) {
            if (model && modelLoaded) {
              const clone = model.clone();
              clone.position.copy(reticle.position);
              clone.visible = true;
              scene.add(clone);
            } else {
              // استخدام النموذج الاختباري
              testCube.position.copy(reticle.position);
              testCube.visible = true;
            }
            modelPlaced = true;
            setDebugInfo("✅ النموذج موضع في العالم الحقيقي!");
          }
        }

        // Animation Loop
        renderer.setAnimationLoop((time, frame) => {
          if (!frame) return;

          if (reticle && hitTestSource && localSpace) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            
            if (hitTestResults.length > 0) {
              const hit = hitTestResults[0];
              const pose = hit.getPose(localSpace);
              
              if (pose) {
                reticle.visible = true;
                reticle.position.set(
                  pose.transform.position.x,
                  pose.transform.position.y,
                  pose.transform.position.z
                );
              }
            } else {
              reticle.visible = false;
            }
          }

          renderer.render(scene, camera);
        });

        // التعامل مع نهاية الجلسة
        session.addEventListener('end', () => {
          setSessionActive(false);
          setCameraAllowed(false);
        });

      } catch (err) {
        console.error('❌ WebXR AR initialization failed:', err);
        setError(`خطأ في WebXR: ${err instanceof Error ? err.message : 'حدث خطأ غير معروف'}`);
        setLoading(false);
      }
    };

    initWebXR();

    // التنظيف
    return () => {
      console.log("🧹 Cleaning up WebXR session");
      
      if (currentSession) {
        currentSession.end();
      }
      
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      
      setSessionActive(false);
      setModelLoaded(false);
    };
  }, [cameraAllowed, modelUrl]);

  // عرض شاشة الخطأ
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">عذراً، WebXR غير مدعوم</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            تأكد من استخدام متصفح يدعم WebXR مثل Chrome على Android
          </p>
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
              onClick={() => {
                // العودة للوضع التقليدي
                window.location.href = "/ar-fallback";
              }}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              استخدام الوضع التقليدي
            </button>
          </div>
        </div>
      </div>
    );
  }

  // طلب الإذن
  if (!cameraAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">تجربة الواقع المعزز (WebXR)</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            ضع النموذج ثلاثي الأبعاد في عالمك الحقيقي باستخدام تقنية WebXR المتقدمة
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ يتطلب متصفحاً يدعم WebXR مثل Chrome على Android
            </p>
          </div>
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">جاري تهيئة WebXR</h3>
            <p className="text-gray-600 text-sm">{debugInfo}</p>
          </div>
        </div>
      )}
      
      {/* تعليمات الاستخدام */}
      {sessionActive && (
        <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-2xl z-20 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">🎯 تعليمات الاستخدام</h3>
            <div className="text-sm space-y-1">
              <p>1. ابحث عن سطح مستوٍ (أرضية، طاولة)</p>
              <p>2. انقر على الشاشة لوضع النموذج</p>
              <p>3. تحرك حول النموذج لمشاهدته من جميع الزوايا</p>
            </div>
          </div>
        </div>
      )}

      {/* معلومات الحالة */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-center z-20 backdrop-blur-sm">
        <div className="text-sm">
          <div className="flex justify-between items-center mb-1">
            <span>جلسة AR:</span>
            <span className={sessionActive ? "text-green-400" : "text-yellow-400"}>
              {sessionActive ? "✅ نشطة" : "⏳ جاري التهيئة"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>النموذج:</span>
            <span className={modelLoaded ? "text-green-400" : "text-yellow-400"}>
              {modelLoaded ? "✅ محمل" : "🔴 اختباري"}
            </span>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-75">{debugInfo}</p>
      </div>

      {/* زر الإغلاق */}
      <button
        onClick={() => {
          setCameraAllowed(false);
          setSessionActive(false);
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
