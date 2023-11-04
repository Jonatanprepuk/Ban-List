import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDOMfDOEQSbXVY6MclZ_hufgtGQj-d3G1Y",
    authDomain: "ban-list-47d62.firebaseapp.com",
    projectId: "ban-list-47d62",
    storageBucket: "ban-list-47d62.appspot.com",
    messagingSenderId: "919273766343",
    appId: "1:919273766343:web:8adcca5fb9cd68a7556de2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
export { auth, db };
