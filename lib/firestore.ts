import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  getDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export interface ContentItem {
  id?: string;
  userId: string;
  title: string;
  content: string;
  platform: string;
  folder: string;
  tags: string[];
  isFavorite: boolean;
  isEvergreen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationResult {
  platform: string;
  content: string;
  characterCount: number;
  status: 'draft' | 'staged' | 'live';
  publishDate?: Date;
}

export interface HistoryItem {
  id?: string;
  userId: string;
  topic: string;
  results: GenerationResult[];
  favorite: boolean;
  timestamp: Date;
}

export interface SubscriptionStatus {
  isPro: boolean;
  status: 'active' | 'cancelled' | 'expired' | 'none';
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
  paddleCustomerId?: string;
  paddleSubscriptionId?: string;
  renewsAt?: Date;
  endsAt?: Date;
}

export interface StagedPost {
  id?: string;
  userId: string;
  historyId: string;
  platform: string;
  content: string;
  status: 'staged' | 'live';
  stagedAt: Date;
  publishedAt?: Date;
}

export interface ScheduledPost {
  id?: string;
  userId: string;
  date: string;
  time: string;
  platform: string;
  content: string;
  createdAt: Date;
}

export interface BrandVoice {
  id?: string;
  userId: string;
  name: string;
  tone: string;
  keywords: string[];
  style: string;
  brandGuide?: string; // Markdown or raw text guide for RAG
  isDefault: boolean;
  createdAt: Date;
}

// Content Library
export async function saveContent(userId: string, content: Omit<ContentItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const contentRef = collection(db, 'content');
  const docRef = await addDoc(contentRef, {
    ...content,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getUserContent(userId: string): Promise<ContentItem[]> {
  const contentRef = collection(db, 'content');
  const q = query(
    contentRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate()
  })) as ContentItem[];
}

export async function updateContent(contentId: string, updates: Partial<ContentItem>) {
  const contentRef = doc(db, 'content', contentId);
  await updateDoc(contentRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function deleteContent(contentId: string) {
  const contentRef = doc(db, 'content', contentId);
  await deleteDoc(contentRef);
}

// Brand Voice
export async function saveBrandVoice(userId: string, voice: Omit<BrandVoice, 'id' | 'userId' | 'createdAt'>) {
  const voiceRef = collection(db, 'brandVoices');
  const docRef = await addDoc(voiceRef, {
    ...voice,
    userId,
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getUserBrandVoices(userId: string): Promise<BrandVoice[]> {
  const voiceRef = collection(db, 'brandVoices');
  const q = query(voiceRef, where('userId', '==', userId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as BrandVoice[];
}

export async function updateBrandVoice(voiceId: string, updates: Partial<BrandVoice>) {
  const voiceRef = doc(db, 'brandVoices', voiceId);
  await updateDoc(voiceRef, updates);
}

export async function deleteBrandVoice(voiceId: string) {
  const voiceRef = doc(db, 'brandVoices', voiceId);
  await deleteDoc(voiceRef);
}

// User Stats
export async function incrementGenerationCount(userId: string) {
  const userRef = doc(db, 'users', userId);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Use setDoc with merge so the field is created if missing and atomically increment
  await setDoc(userRef, {
    generationCounts: {
      [monthKey]: increment(1)
    },
    lastGeneratedAt: Timestamp.now()
  }, { merge: true });
}

// History
export async function saveHistory(userId: string, history: Omit<HistoryItem, 'id' | 'userId' | 'timestamp'>) {
  const historyRef = collection(db, 'history');
  const docRef = await addDoc(historyRef, {
    ...history,
    userId,
    timestamp: Timestamp.now()
  });
  return docRef.id;
}

export async function getUserHistory(userId: string): Promise<HistoryItem[]> {
  const historyRef = collection(db, 'history');
  const q = query(
    historyRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate()
  })) as HistoryItem[];
}

export async function toggleHistoryFavorite(historyId: string, favorite: boolean) {
  const historyRef = doc(db, 'history', historyId);
  await updateDoc(historyRef, { favorite });
}

export async function updateHistoryResults(historyId: string, results: GenerationResult[]) {
  const historyRef = doc(db, 'history', historyId);
  await updateDoc(historyRef, { results });
}

// Staging Queue
export async function saveStagedPost(userId: string, post: Omit<StagedPost, 'id' | 'userId' | 'stagedAt'>) {
  const stagingRef = collection(db, 'stagedPosts');
  const docRef = await addDoc(stagingRef, {
    ...post,
    userId,
    stagedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getStagedPosts(userId: string): Promise<StagedPost[]> {
  const stagingRef = collection(db, 'stagedPosts');
  const q = query(
    stagingRef,
    where('userId', '==', userId),
    orderBy('stagedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    stagedAt: doc.data().stagedAt.toDate(),
    publishedAt: doc.data().publishedAt?.toDate()
  })) as StagedPost[];
}

export async function updateStagedPostStatus(postId: string, status: 'staged' | 'live') {
  const postRef = doc(db, 'stagedPosts', postId);
  await updateDoc(postRef, {
    status,
    publishedAt: status === 'live' ? Timestamp.now() : null
  });
}

export async function deleteStagedPosts(postIds: string[]) {
  const batch = writeBatch(db);
  postIds.forEach(id => {
    const postRef = doc(db, 'stagedPosts', id);
    batch.delete(postRef);
  });
  await batch.commit();
}

export async function updateStagedPostsStatus(postIds: string[], status: 'staged' | 'live') {
  const batch = writeBatch(db);
  postIds.forEach(id => {
    const postRef = doc(db, 'stagedPosts', id);
    batch.update(postRef, {
      status,
      publishedAt: status === 'live' ? Timestamp.now() : null
    });
  });
  await batch.commit();
}

// Subscription Management
export async function updateSubscriptionStatus(userId: string, subscription: SubscriptionStatus) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    subscription
  }, { merge: true });
}

export async function getUserSubscription(userId: string): Promise<SubscriptionStatus> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return { isPro: false, status: 'none' };
  }

  const data = userDoc.data();
  if (!data.subscription) {
    return { isPro: false, status: 'none' };
  }

  return {
    ...data.subscription,
    renewsAt: data.subscription.renewsAt?.toDate(),
    endsAt: data.subscription.endsAt?.toDate()
  } as SubscriptionStatus;
}

// Scheduled Posts
export async function schedulePost(userId: string, post: Omit<ScheduledPost, 'id' | 'userId' | 'createdAt'>) {
  const scheduledRef = collection(db, 'scheduledPosts');
  const docRef = await addDoc(scheduledRef, {
    ...post,
    userId,
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
  const scheduledRef = collection(db, 'scheduledPosts');
  const q = query(scheduledRef, where('userId', '==', userId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as ScheduledPost[];
}

export async function deleteScheduledPost(postId: string) {
  const postRef = doc(db, 'scheduledPosts', postId);
  await deleteDoc(postRef);
}

export async function updateScheduledPost(postId: string, updates: Partial<ScheduledPost>) {
  const postRef = doc(db, 'scheduledPosts', postId);
  await updateDoc(postRef, updates);
}
