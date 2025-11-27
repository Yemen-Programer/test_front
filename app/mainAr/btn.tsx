// btn.tsx
"use client";

interface CameraPermissionButtonProps {
  onGranted: () => void;
}

const CameraPermissionButton: React.FC<CameraPermissionButtonProps> = ({ onGranted }) => {
  const requestCameraPermission = async () => {
    try {
      // اختبار بسيط للإذن أولاً
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إيقاف الفيديو مباشرة بعد الحصول على الإذن
      stream.getTracks().forEach(track => track.stop());
      
      onGranted();
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      alert('يجب السماح بالوصول إلى الكاميرا لاستخدام خاصية الواقع المعزز');
    }
  };

  return (
    <button
      onClick={requestCameraPermission}
      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold transition-colors w-full"
    >
      🔓 تفعيل الكاميرا
    </button>
  );
};

export default CameraPermissionButton;
