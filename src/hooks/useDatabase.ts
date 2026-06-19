import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post, Category, ContactMessage } from '../types';
import { SEED_CATEGORIES, SEED_POSTS } from '../seedData';

export function useDatabase() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFirestore, setUsingFirestore] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load and sync data directly from Firestore
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setDbError(null);

        // 1. Fetch categories
        const catSnap = await getDocs(collection(db, 'categories'));
        const fetchedCategories: Category[] = [];
        catSnap.forEach((docSnap) => {
          fetchedCategories.push({ id: docSnap.id, ...docSnap.data() } as Category);
        });

        // 2. Fetch posts
        const postsSnap = await getDocs(collection(db, 'posts'));
        const fetchedPosts: Post[] = [];
        postsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedPosts.push({
            id: docSnap.id,
            ...data,
            // Convert Firestore timestamps to string ISO safely if exists
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
          } as Post);
        });

        // Fallback to Seeds in-memory ONLY if database is empty to prevent blank screen
        const finalCategories = fetchedCategories.length > 0 ? fetchedCategories : [...SEED_CATEGORIES];
        const finalPosts = fetchedPosts.length > 0 ? fetchedPosts : [...SEED_POSTS];

        // Ensure posts are sorted by createdAt descending
        finalPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCategories(finalCategories);
        setPosts(finalPosts);
        setUsingFirestore(fetchedCategories.length > 0 || fetchedPosts.length > 0);
      } catch (err: any) {
        console.error('Firestore initial load failed:', err);
        setDbError('تعذر الاتصال بـ Firestore جراء قيود الحماية أو انقطاع الشبكة. تم تحميل نسخة الحفظ المؤقت التلقائي.');
        // Still load seeds in-memory on failure so the user doesn't get a blank page, but expose the error
        setCategories([...SEED_CATEGORIES]);
        const sortedSeeds = [...SEED_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(sortedSeeds);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Create or Update Category
  const saveCategory = async (categoryData: Omit<Category, 'id'>, existingId?: string) => {
    const catId = existingId || categoryData.slug || `cat-${Date.now()}`;
    const cleanPayload = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description
    };

    // 1. Write directly to Firestore first. This will throw an error if write fails.
    await setDoc(doc(db, 'categories', catId), cleanPayload);

    // 2. Update React State only on success
    const newCat: Category = {
      id: catId,
      ...cleanPayload
    };

    setCategories(prev => {
      const isNew = !existingId;
      if (isNew) {
        return [...prev, newCat];
      } else {
        return prev.map(c => c.id === catId ? newCat : c);
      }
    });
  };

  // Delete Category
  const removeCategory = async (catId: string) => {
    // 1. Perform database delete first
    await deleteDoc(doc(db, 'categories', catId));

    // 2. Update local state on success
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  // Create or Update Post
  const savePost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => {
    const isNew = !existingId;
    const postId = existingId || postData.slug || `post-${Date.now()}`;
    const firestoreDocRef = doc(db, 'posts', postId);

    // Prepare metadata payload
    const payload: any = {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      featuredImage: postData.featuredImage,
      category: postData.category,
      tags: postData.tags,
      metaTitle: postData.metaTitle,
      metaDescription: postData.metaDescription,
      status: postData.status,
      updatedAt: serverTimestamp()
    };

    if (isNew) {
      payload.createdAt = serverTimestamp();
    }
    // Note: On updates, we DO NOT write payload.createdAt, which preserves the original value in Firestore!

    // 1. Write to Firestore first
    await setDoc(firestoreDocRef, payload, { merge: true });

    // 2. Sync React State upon successful write
    const nowISO = new Date().toISOString();
    setPosts(prev => {
      if (isNew) {
        const currentPost: Post = {
          id: postId,
          ...postData,
          createdAt: nowISO,
          updatedAt: nowISO
        };
        return [currentPost, ...prev];
      } else {
        const original = prev.find(p => p.id === postId);
        const currentPost: Post = {
          id: postId,
          ...postData,
          createdAt: original ? original.createdAt : nowISO,
          updatedAt: nowISO
        };
        return prev.map(p => p.id === postId ? currentPost : p);
      }
    });
  };

  // Delete Post
  const removePost = async (postId: string) => {
    // 1. Perform database delete first
    await deleteDoc(doc(db, 'posts', postId));

    // 2. Update local state on success
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Submit Contact Form
  const submitContactForm = async (contact: Omit<ContactMessage, 'createdAt'>) => {
    const msgId = `msg-${Date.now()}`;
    await setDoc(doc(db, 'contacts', msgId), {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: serverTimestamp()
    });
  };

  return {
    posts,
    categories,
    loading,
    usingFirestore,
    dbError,
    savePost,
    removePost,
    saveCategory,
    removeCategory,
    submitContactForm
  };
}
