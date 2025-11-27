// btn.tsx
"use client";

interface CameraPermissionButtonProps {
  onGranted: () => void;
}

const CameraPermissionButton: React.FC<CameraPermissionButtonProps> = ({ onGranted }) => {
  const requestCameraPermission = async () => {
    try {
      // طلب الإذن أولاً بدون عرض الفيديو
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إيقاف الفيديو مباشرة بعد الحصول على الإذن
      stream.getTracks().forEach(track => track.stop());
      
      onGranted();
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      alert('يجب السماح بالوصول إلى الكاميرا لاستخدام هذه الميزة');
    }
  };

  return (
    <button
      onClick={requestCameraPermission}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      🔓 تفعيل الكاميرا للواقع المعزز
    </button>
  );
};

export default CameraPermissionButton;
