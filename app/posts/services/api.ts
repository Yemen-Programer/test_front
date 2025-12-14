// services/api.ts
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

class ApiService {
  private getUserId(): number | null {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    }
    return null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const userId = this.getUserId();
      
      const config: RequestInit = {
        ...options,
      };

      // إذا كان الطلب يحتوي على FormData، لا نضيف Content-Type header
      // إذا لم يكن FormData، نضيف Content-Type: application/json
      if (!(options.body instanceof FormData)) {
        config.headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };
      } else {
        config.headers = {
          ...options.headers,
        };
      }

      // إضافة userId إلى body إذا كان الطلب يحتاجه
      if (options.body && typeof options.body === 'string' && userId) {
        const bodyObj = JSON.parse(options.body);
        bodyObj.userId = userId;
        config.body = JSON.stringify(bodyObj);
      }

      console.log(`Making request to: ${API_BASE_URL}${endpoint}`, config);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Posts APIs
  async getPosts(page: number = 1, limit: number = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(content: string, imageFile?: File) {
    const userId = this.getUserId();
    if (!userId) {
      alert('يجب تسجيل الدخول أولاً');
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', imageFile);
      formData.append('userId', userId.toString());
      
      return this.request('/posts', {
        method: 'POST',
        body: formData,
      });
    } else {
      return this.request('/posts', {
        method: 'POST',
        body: JSON.stringify({ content, userId }),
      });
    }
  }

  async likePost(postId: string) {
    const userId = this.getUserId();
    if (!userId) {
      alert('يجب تسجيل الدخول أولاً');
    }
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async commentOnPost(postId: string, content: string) {
       const userId = this.getUserId();
        if (!userId) {
      alert('يجب تسجيل الدخول أولاً');
    }
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async sharePost(postId: string, sharedContent?: string) {
       const userId = this.getUserId();
        if (!userId) {
      alert('يجب تسجيل الدخول أولاً');
    }
    return this.request(`/posts/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ sharedContent }),
    });
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Notifications APIs - بحسب المستخدم الحالي
  async getNotifications(page: number = 1, limit: number = 10) {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    return this.request(`/notifications?userId=${userId}&page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  }

  async markAllNotificationsAsRead() {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    return this.request('/notifications/read-all', {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    });
  }
  
  async searchContent(query: string) {
    try {
      const response = await fetch(`http://localhost:5000/search/content?query=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('Search API error:', error);
      return { success: false, message: 'حدث خطأ في البحث' };
    }
  }
  
  async getUnreadCount() {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    return this.request(`/notifications/unread-count?userId=${userId}`);
  }
  
  async updatePost(postId: string, content: string, imageFile?: File) {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', imageFile);
      formData.append('userId', userId.toString());
      
      return this.request(`/posts/${postId}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      return this.request(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ content, userId }),
      });
    }
  }
}

export const apiService = new ApiService();