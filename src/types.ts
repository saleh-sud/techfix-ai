export type PostStatus = 'draft' | 'published';

export interface Category {
  id: string; // Firestore document ID
  name: string;
  slug: string;
  description: string;
}

export interface Post {
  id: string; // Firestore document ID
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string; // Category ID
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  status: PostStatus;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}
