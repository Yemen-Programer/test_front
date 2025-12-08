// components/CreatePost.tsx
import { useState, useRef } from 'react';

interface CreatePostProps {
  onPostCreate: (content: string, imageFile?: File) => void;
}

export default function CreatePost({ onPostCreate }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      setSelectedImage(file);
      
     
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((content.trim() || selectedImage) && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onPostCreate(content, selectedImage || undefined);
        setContent('');
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('حدث خطأ أثناء إنشاء المنشور');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#774230' }}>
        إنشاء منشور جديد
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ماذا تريد مشاركته؟"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none resize-none transition-colors focus:border-[#3c1053]"
          style={{ 
            minHeight: '100px'
          }}
          rows={4}
          disabled={isSubmitting}
        />
        
        {/* معاينة الصورة */}
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
            >
              ×
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
       
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
              className="p-2 text-gray-500 hover:text-[#3c1053] hover:bg-[#3c1053]/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          <button
            type="submit"
            className=" rounded- py-2 px-6 bg-[#3c1053] rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-sm w-full sm:w-auto text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
           
            disabled={(!content.trim() && !selectedImage) || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري النشر...
              </span>
            ) : (
              'نشر'
            )}
          </button>
        </div>

     
        {(content.trim() || selectedImage) && (
          <p className="text-xs text-gray-500 text-center">
            {selectedImage ? 'سيتم نشر الصورة والنص معاً' : 'سيتم نشر النص فقط'}
          </p>
        )}
      </form>
    </div>
  );
}