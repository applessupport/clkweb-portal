import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC_51X9Nt7QfjWpQgDxPaM0Ss0VSJfRdE0",
  authDomain: "clkweb.firebaseapp.com",
  projectId: "clkweb",
  storageBucket: "clkweb.appspot.com",
  messagingSenderId: "469316312960",
  appId: "1:469316312960:web:35b108d8783930575aab65",
  measurementId: "G-J55LE8S6KY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
