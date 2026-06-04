import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACX_72dJEDUff1QcJGvG9vR6A9cApFd4A",
  authDomain: "goalqube.firebaseapp.com",
  projectId: "goalqube",
  storageBucket: "goalqube.firebasestorage.app",
  messagingSenderId: "538267438650",
  appId: "1:538267438650:web:0b378e4c1d02465ffa6f03",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;

export const db = getFirestore(app);