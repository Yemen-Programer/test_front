// services/api.ts
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // مهم لإرسال الكوكيز
        ...options,
      };

      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);

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

  // Auth APIs
  async signup(name: string, email: string, password: string, confirmPassword: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async checkAuth() {
    return this.request('/auth/check');
  }

  async updateProfile(name: string, email: string) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Posts APIs
  async getPosts(page: number = 1, limit: number = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(content: string, imageFile?: File) {
    if (imageFile) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', imageFile);
      
      return this.request('/posts', {
        method: 'POST',
        body: formData,
      });
    } else {
      return this.request('/posts', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    }
  }


}

export const apiService = new ApiService();