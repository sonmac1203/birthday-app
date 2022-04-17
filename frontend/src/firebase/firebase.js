// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAkdwsjJqicejw68xUeLPbE34oM3dLhtT0',
  authDomain: 'birthday-project-ecf08.firebaseapp.com',
  projectId: 'birthday-project-ecf08',
  storageBucket: 'birthday-project-ecf08.appspot.com',
  messagingSenderId: '146639735968',
  appId: '1:146639735968:web:45f277b0cdfbce59ad4dc5',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
