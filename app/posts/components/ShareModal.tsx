// components/ShareModal.tsx
import { useState } from 'react';
import { Post } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onShare: (postId: number, sharedContent?: string) => void;
}

export default function ShareModal({ isOpen, post, onClose, onShare }: ShareModalProps) {
  const [sharedContent, setSharedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !post) return null;

  const handleShare = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await onShare(post.id, sharedContent);
        setSharedContent('');
      } catch (error) {
        console.error('Error sharing post:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setSharedContent('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* الهيدر */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold" style={{ color: '#774230' }}>
            مشاركة المنشور
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-4">
          {/* معاينة المنشور الأصلي */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#774230] to-[#3c1053] rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {post.user?.name?.[0] || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium" style={{ color: '#2A0F38' }}>
                  {post.user?.name || 'مستخدم'}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
            {post.image && (
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                تحتوي على صورة
              </div>
            )}
          </div>

          {/* نص المشاركة */}
          <textarea
            value={sharedContent}
            onChange={(e) => setSharedContent(e.target.value)}
            placeholder="اكتب تعليقك على هذه المشاركة (اختياري)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none resize-none transition-colors"
            style={{ focusRingColor: '#3c1053' }}
            rows={3}
            disabled={isSubmitting}
          />

          {/* خيارات المشاركة */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">مشاركة إلى:</h4>
            <div className="flex space-x-2">
              <button 
                className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                <span className="text-sm">المنشورات العامة</span>
              </button>
              <button 
                className="flex-1 flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                <span className="text-sm">الأصدقاء فقط</span>
              </button>
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex space-x-3 p-4 border-t">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#3c1053' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري المشاركة...' : 'مشاركة الآن'}
          </button>
        </div>
      </div>
    </div>
  );
}