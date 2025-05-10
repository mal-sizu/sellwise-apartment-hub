// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdzm9r8_Jh9n3Swb0Q4ckIJoFc9WAfdI8",
  authDomain: "project10-84980.firebaseapp.com",
  projectId: "project10-84980",
  storageBucket: "project10-84980.firebasestorage.app",
  messagingSenderId: "553387875767",
  appId: "1:553387875767:web:851590305362a8b5351c32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
