import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDSJK5Fb1c5QRybLgu9PNLqwhRyzRL2wI",
  authDomain: "fir-coffee-f32db.firebaseapp.com",
  projectId: "fir-coffee-f32db",
  storageBucket: "fir-coffee-f32db.firebasestorage.app",
  messagingSenderId: "90491728487",
  appId: "1:90491728487:web:d07f75aa34954d8aabdac2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };