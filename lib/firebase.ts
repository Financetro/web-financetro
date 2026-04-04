import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDzvVYmzkaB4jSW1uFg3z1-5pznlhMBAik",
  authDomain: "financetro.firebaseapp.com",
  databaseURL: "https://financetro-default-rtdb.firebaseio.com",
  projectId: "financetro",
  storageBucket: "financetro.firebasestorage.app",
  messagingSenderId: "662862194800",
  appId: "1:662862194800:web:becdcf1b579dc0ad7d6cb5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Messaging initialization done conditionally for SSR safety
const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export { app, auth, db, storage, messaging };
