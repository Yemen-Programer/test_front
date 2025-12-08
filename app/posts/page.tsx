// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import ShareModal from './components/ShareModal';
import { Post, Notification } from './types';
import { apiService } from './services/api';
import Header from '../components/header';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [shareModal, setShareModal] = useState<{isOpen: boolean; post: Post | null}>({
    isOpen: false,
    post: null
  });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // تحميل المنشورات والإشعارات
  useEffect(() => {
    getCurrentUserId();
    loadPosts();
    loadNotifications();
    loadUnreadCount();
  }, []);

  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      setCurrentUserId(userId ? parseInt(userId) : null);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
      setUnreadCount(0);
    }
  };

  // إنشاء منشور جديد
  const addPost = async (content: string, imageFile?: File) => {
    try {
      const response = await apiService.createPost(content, imageFile);
      setPosts(prevPosts => [response.data, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('حدث خطأ أثناء إنشاء المنشور');
    }
  };

  // تحديث منشور
  const updatePost = async (postId: number, content: string, imageFile?: File) => {
    try {
      const response = await apiService.updatePost(postId.toString(), content, imageFile);
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  // حذف منشور
  const deletePost = async (postId: number) => {
    try {
      await apiService.deletePost(postId.toString());
      
      setPosts(prevPosts => 
        prevPosts.filter(post => post.id !== postId)
      );
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('حدث خطأ أثناء حذف المنشور');
    }
  };

  // إضافة إعجاب
  const addLike = async (postId: number) => {
    try {
      const response = await apiService.likePost(postId.toString());
      
      if (response.data.liked) {
        // تحديث حالة الإعجاب محلياً
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likesCount: post.likesCount + 1,
                  likes: [...(post.likes || []), { id: Date.now(), userId: currentUserId!, postId, createdAt: new Date().toISOString() }]
                }
              : post
          )
        );
      } else {
        // إزالة الإعجاب
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likesCount: Math.max(0, post.likesCount - 1),
                  likes: post.likes?.filter(like => like.userId !== currentUserId) || []
                }
              : post
          )
        );
      }

      // تحديث الإشعارات
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  // إضافة تعليق
  const addComment = async (postId: number, content: string) => {
    try {
      const response = await apiService.commentOnPost(postId.toString(), content);
      
      // تحديث المنشور محلياً بإضافة التعليق
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                commentsCount: post.commentsCount + 1,
                comments: [...(post.comments || []), response.data]
              }
            : post
        )
      );

      // تحديث الإشعارات
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('حدث خطأ أثناء إضافة التعليق');
    }
  };

  const openShareModal = (post: Post) => {
    setShareModal({ isOpen: true, post });
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, post: null });
  };

  const handleShare = async (postId: number, sharedContent?: string) => {
    try {
      const response = await apiService.sharePost(postId.toString(), sharedContent);
      
      // إضافة المنشور المشترك إلى البداية
      setPosts(prevPosts => [response.data.sharedPost, ...prevPosts]);

      // تحديث المنشور الأصلي بعدد المشاركات
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, sharesCount: post.sharesCount + 1 }
            : post
        )
      );

      // تحديث الإشعارات
      loadNotifications();
      loadUnreadCount();
      
      closeShareModal();
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('حدث خطأ أثناء مشاركة المنشور');
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId.toString());
      
      // تحديث حالة الإشعار محلياً
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // تحديث العدد
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header />

      {/* المحتوى الرئيسي */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* إنشاء منشور جديد */}
          <div className="animate-fade-in">
            <CreatePost onPostCreate={addPost} />
          </div>

          {/* قائمة المنشورات */}
          <div className="space-y-6">
            {loading ? (
              // عرض مؤشر التحميل
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c1053]"></div>
              </div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard
                      post={post}
                      onLike={addLike}
                      onComment={addComment}
                      onShare={openShareModal}
                      onEdit={updatePost}
                      onDelete={deletePost}
                      currentUserId={currentUserId}
                    />
                  </div>
                ))}
              </>
            )}

            {/* رسالة عندما لا يوجد منشورات */}
            {!loading && posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منشورات بعد</h3>
                <p className="text-gray-500">كن أول من ينشر وشاركنا أفكارك!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* نافذة مشاركة المنشور */}
      <ShareModal
        isOpen={shareModal.isOpen}
        post={shareModal.post}
        onClose={closeShareModal}
        onShare={handleShare}
      />

      {/* إضافة الأنيميشن في الـ CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}