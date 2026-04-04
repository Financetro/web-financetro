import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { collection, query, orderBy, onSnapshot, limit, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const useNotificationsList = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !auth.currentUser) return;

    const q = query(
      collection(db, `users/${user.uid}/notifications`),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationItem[];
      
      setNotifications(items);
      setUnreadCount(items.filter(i => !i.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/notifications`, id), {
      read: true
    });
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) {
        batch.update(doc(db, `users/${user.uid}/notifications`, n.id), { read: true });
      }
    });
    await batch.commit();
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
