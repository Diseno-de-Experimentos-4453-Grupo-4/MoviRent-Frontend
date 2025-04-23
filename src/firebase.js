import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1TlZY5PhNSSJ9EsPEsXNiKWDdjpNLwAM",
  authDomain: "movirent-af794.firebaseapp.com",
  projectId: "movirent-af794",
  storageBucket: "movirent-af794.firebasestorage.app",
  messagingSenderId: "51590455332",
  appId: "1:51590455332:web:0eda22ff7166fa799f78b1",
  measurementId: "G-9JKJ3BPVLF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
