import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCoPcnsBfP9-zUBTLTAPiVR0gM4BfLy1fQ",
  authDomain: "pheist-1782829293.firebaseapp.com",
  projectId: "pheist-1782829293",
  storageBucket: "pheist-1782829293.firebasestorage.app",
  messagingSenderId: "818596857224",
  appId: "1:818596857224:web:bc7dada21f22ba7717e63d",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
