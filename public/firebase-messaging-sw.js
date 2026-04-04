importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

try {
  firebase.initializeApp({
    apiKey: "AIzaSyDzvVYmzkaB4jSW1uFg3z1-5pznlhMBAik",
    authDomain: "financetro.firebaseapp.com",
    projectId: "financetro",
    storageBucket: "financetro.firebasestorage.app",
    messagingSenderId: "662862194800",
    appId: "1:662862194800:web:becdcf1b579dc0ad7d6cb5"
  });
} catch (e) {
  console.error('[firebase-messaging-sw.js] Initialization failed:', e);
}

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
