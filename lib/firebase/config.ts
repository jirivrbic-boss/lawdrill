import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQpDBYP89uTo7kzhiSLwLMV_onLls6-t0",
  authDomain: "lawdrill-ca709.firebaseapp.com",
  projectId: "lawdrill-ca709",
  storageBucket: "lawdrill-ca709.firebasestorage.app",
  messagingSenderId: "468691257796",
  appId: "1:468691257796:web:fb298dae8f52b01c323c91",
  measurementId: "G-X8GSVB7WTF"
};

// Inicializace Firebase (funguje i na serveru pro Next.js SSR)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Auth a Firestore - pouze na klientovi
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;
