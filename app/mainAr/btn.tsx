// btn.tsx
"use client";

interface CameraPermissionButtonProps {
  onGranted: () => void;
}

const CameraPermissionButton: React.FC<CameraPermissionButtonProps> = ({ onGranted }) => {
  const requestWebXRAccess = async () => {
    try {
      // التحقق من دعم WebXR أولاً
      if (!navigator.xr) {
        throw new Error("WebXR غير مدعوم في هذا المتصفح");
      }

      // التحقق من دعم AR
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) {
        throw new Error("الواقع المعزز (AR) غير مدعوم في هذا الجهاز");
      }

      // طلب الإذن للكاميرا (مطلوب لـ WebXR)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إيقاف الفيديو مباشرة بعد الحصول على الإذن
      stream.getTracks().forEach(track => track.stop());
      
      onGranted();
    } catch (error) {
      console.error('❌ WebXR access denied:', error);
      alert('تعذر الوصول إلى WebXR. تأكد من استخدام متصفح مدعوم مثل Chrome على Android');
    }
  };

  return (
    <button
      onClick={requestWebXRAccess}
      className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition-colors w-full"
    >
      🔮 تفعيل WebXR AR
    </button>
  );
};

export default CameraPermissionButton;
