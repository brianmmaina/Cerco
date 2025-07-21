// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";           // ← add this
import { getFirestore } from "firebase/firestore"; // ← and this

const firebaseConfig = {
apiKey: "AIzaSyA8KDZdBi6UE8z2ZhD4N-kQGMlEvyuk1ow",
authDomain: "cerco-5fab2.firebaseapp.com",
projectId: "cerco-5fab2",
storageBucket: "cerco-5fab2.appspot.com",
messagingSenderId: "330193448317",
appId: "1:330193448317:web:84a02dc9040dbeb7f0b014",
measurementId: "G-JWGQLVE3VM"
};

const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db   = getFirestore(app);
