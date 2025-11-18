import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiCXRnhyyoIwY62bOyeyhbbwIAcARHQjo",
  authDomain: "tracking-assignments-4455d.firebaseapp.com",
  projectId: "tracking-assignments-4455d",
  storageBucket: "tracking-assignments-4455d.firebasestorage.app",
  messagingSenderId: "514164199884",
  appId: "1:514164199884:web:6f4e0e6ff2134360924d69",
  measurementId: "G-93SJWXRMN6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
