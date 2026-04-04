import { NextResponse } from 'next/server';

export async function GET() {
  const sw_content = `
    importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

    firebase.initializeApp({
      apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
      authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
      databaseURL: "${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}",
      projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
      storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}"
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico'
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  `;

  return new NextResponse(sw_content, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
