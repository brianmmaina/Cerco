// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8KDZdBi6UE8z2ZhD4N-kQGMlEvyuk1ow",
    authDomain: "cerco-5fab2.firebaseapp.com",
    projectId: "cerco-5fab2",
    storageBucket: "cerco-5fab2.firebasestorage.app",
    messagingSenderId: "330193448317",
    appId: "1:330193448317:web:84a02dc9040dbeb7f0b014",
    measurementId: "G-JWGQLVE3VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);