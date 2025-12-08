// components/PostCard.tsx
import { useState, useRef } from 'react';
import { Post } from '../types';

const BASE_URL = "http://localhost:5000"; 

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
  onShare: (post: Post) => void;
  onEdit: (postId: number, content: string, imageFile?: File) => void;
  onDelete: (postId: number) => void;
  currentUserId?: number;
}

export default function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete, 
  currentUserId 
}: PostCardProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isLiked = post.likes?.some(like => like.userId === currentUserId) || false;
  const isOwner = post.userId === currentUserId;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment('');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() && !editImage) return;
    
    setIsSubmitting(true);
    try {
      await onEdit(post.id, editContent, editImage || undefined);
      setIsEditing(false);
      setEditImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('حدث خطأ أثناء تحديث المنشور');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة فقط');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }

      setEditImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEditImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditImage(null);
    setImagePreview(null);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      onDelete(post.id);
    }
  };

  const isSharedPost = post.originalPostId !== undefined && post.originalPostId !== null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 transition-all duration-300 hover:shadow-md">
 
      {isSharedPost && post.originalPost && (
        <div className="flex items-center text-sm text-gray-500 mb-3 p-2 bg-gray-50 rounded-lg">
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="flex-1">
            <span className="font-medium" style={{ color: '#774230' }}>
              {post.user?.name || 'مستخدم'}
            </span>
            {' '}شارك منشور{' '}
            <span className="font-medium" style={{ color: '#774230' }}>
              {post.originalPost.user?.name || 'مستخدم'}
            </span>
          </span>
        </div>
      )}


      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#774230] to-[#3c1053] rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {post.user?.name?.[0] || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: '#2A0F38' }}>
              {post.user?.name || 'مستخدم'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

     
        {isOwner && !isEditing && (
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                تعديل المنشور
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                حذف المنشور
              </button>
            </div>
          </div>
        )}
      </div>

 
      <div className="mb-4">
        {isEditing ? (
   
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c1053] focus:border-[#3c1053] focus:outline-none resize-none transition-colors"
              rows={4}
              placeholder="قم بتعديل منشورك..."
              disabled={isSubmitting}
            />
            
     
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="معاينة الصورة" 
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            )}

        
            {!imagePreview && post.image && (
              <div className="relative">
                <img 
                  src={`${BASE_URL}${post.image}`}
                  alt="الصورة الحالية"
                  className="w-full max-h-64 object-cover rounded-lg"
                  onError={handleImageError}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  الصورة الحالية
                </div>
              </div>
            )}

          
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              
              <button
                type="button"
                onClick={handleButtonClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#3c1053] transition-colors p-2 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{post.image ? 'تغيير الصورة' : 'إضافة صورة'}</span>
              </button>
            </div>

      
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting || (!editContent.trim() && !editImage)}
                className=" rounded- py-2 px-6 bg-[#3c1053] rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm w-full sm:w-auto text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ التعديلات'
                )}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
         
          <>
         
            {isSharedPost && post.originalPost ? (
              <>
           
                {post.content && (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-4 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-200">
                    {post.content}
                  </p>
                )}
                
         
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#774230] to-[#3c1053] rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {post.originalPost.user?.name?.[0] || '?'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium" style={{ color: '#2A0F38' }}>
                        {post.originalPost.user?.name || 'مستخدم'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.originalPost.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{post.originalPost.content}</p>
                  
                  {post.originalPost.image && (
                    <div className="mt-2">
                      <img
                        src={`${BASE_URL}${post.originalPost.image}`}
                        alt="صورة المنشور الأصلي"
                        className="rounded-lg w-full max-h-64 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
        
              <>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">{post.content}</p>
                {post.image && (
                  <div className="mt-3">
                    <img
                      src={`${BASE_URL}${post.image}`}
                      alt="صورة المنشور"
                      className="rounded-lg w-full max-h-96 object-cover"
                      onError={handleImageError}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* الإحصائيات */}
      {!isEditing && (
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex space-x-4">
            <span>{post.likesCount} إعجاب</span>
            <span>{post.commentsCount} تعليق</span>
            <span>{post.sharesCount} مشاركة</span>
          </div>
        </div>
      )}

      {/* أزرار التفاعل */}
      {!isEditing && (
        <div className="flex border-t border-b py-2 mb-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-1" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            أعجبني
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            تعليق
          </button>

          <button
            onClick={() => onShare(post)}
            className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            مشاركة
          </button>
        </div>
      )}

      {/* قسم التعليقات */}
      {showComments && !isEditing && (
        <div className="space-y-4">
          {/* إضافة تعليق جديد */}
          <form onSubmit={handleCommentSubmit} className="flex space-x-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تعليقك..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c1053] focus:border-[#3c1053] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#3c1053' }}
              disabled={!comment.trim()}
            >
              إرسال
            </button>
          </form>

          {/* قائمة التعليقات */}
          <div className="space-y-3">
            {post.comments?.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#774230] to-[#3c1053] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white">
                    {comment.user?.name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm" style={{ color: '#2A0F38' }}>
                      {comment.user?.name || 'مستخدم'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}

            {(!post.comments || post.comments.length === 0) && (
              <p className="text-center text-gray-500 text-sm py-4">
                لا توجد تعليقات بعد
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}