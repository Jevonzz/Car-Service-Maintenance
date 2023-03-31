// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyCURxAXF9Xg4LT5CKEkM231oPZoMFWHmkY',
  authDomain: 'car-service-management-42054.firebaseapp.com',
  projectId: 'car-service-management-42054',
  storageBucket: 'car-service-management-42054.appspot.com',
  messagingSenderId: '881484145481',
  appId: '1:881484145481:android:dc82eef9553854d3b93098',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const firebaseDB = getFirestore(app);