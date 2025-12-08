// types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  likes?: Like[];
  comments?: Comment[];
  shares?: Share[];
  originalPost?: Post;
  originalPostId?: number;
}


export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user?: User;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Share {
  id: number;
  userId: number;
  postId: number;
  sharedContent?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Notification {
  id: number;
  userId: number;
  targetUserId: number;
  type: 'like' | 'comment' | 'share' | 'new_post';
  message: string;
  read: boolean;
  postId?: number;
  commentId?: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  targetUser?: User;
  post?: Post;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}