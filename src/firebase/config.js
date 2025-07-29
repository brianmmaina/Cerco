// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyA8KDZdBi6UE8z2ZhD4N-kQGMlEvyuk1ow',
    authDomain: 'cerco-5fab2.firebaseapp.com',
    projectId: 'cerco-5fab2',
    storageBucket: 'cerco-5fab2.appspot.com',
    messagingSenderId: '330193448317',
    appId: '1:330193448317:web:84a02dc9040dbeb7f0b014',
    measurementId: 'G-JWGQLVE3VM',
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore as before
export const db = getFirestore(app);
