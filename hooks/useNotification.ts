import { collection, addDoc } from 'firebase/firestore';
import { onMessage, getToken } from 'firebase/messaging';
import { auth, db, messaging } from '@/lib/firebase';
import { useEffect, useCallback } from 'react';

export const useNotification = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const initFCM = useCallback(async () => {
    try {
      const messagingInstance = await messaging();
      if (!messagingInstance) return;

      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      // TODO: Replace with your actual VAPID key from Firebase Console
      // Project Settings -> Cloud Messaging -> Web Push certificates
      const vapidKey = 'BAkWCoE6lMcED2E_0LP-hZxUoh1lzbFvUPG4-I6atbK4xQGgKnlNUvoB31w9SCKO1fLxh6tuDknpf6jLObkrCo0'; // Put your key here

      if (vapidKey) {
        try {
          console.log("Checking service worker availability...");
          const swResponse = await fetch("/firebase-messaging-sw.js", { method: "HEAD" });
          if (!swResponse.ok) {
            throw new Error("Service worker file (/firebase-messaging-sw.js) not found in public directory. Check your /public folder.");
          }

          console.log("Initializing FCM service worker...");
          // Register the service worker
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });

          // Wait for the service worker to be fully activated and ready
          await navigator.serviceWorker.ready;

          console.log("Requesting FCM token...");
          const token = await getToken(messagingInstance, {
            vapidKey,
          });

          if (token) {
            console.log("FCM Token initialized successfully.");
          }
        } catch (regError: any) {
          if (regError.message?.includes("push service error")) {
            // console.log("FCM Push service not available in this browser environment.");
          } else {
            console.warn("FCM registration failed:", regError);
          }
        }
      } else {
        console.warn('Firebase VAPID key (vapidKey) is missing in useNotification hook. Push notifications may not work correctly.');
      }

      onMessage(messagingInstance, (payload) => {
        console.log('Foreground message received:', payload);
        if (payload.notification) {
          sendNotification(payload.notification.title || 'New Notification', {
            body: payload.notification.body,
          });
        }
      });
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  }, [requestPermission]);

  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, `users/${user.uid}/notifications`), {
          title,
          body: options?.body || '',
          type: 'app',
          read: false,
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.error('Error saving notification:', e);
      }
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initFCM();
    }
  }, [initFCM]);

  return { sendNotification };
};
