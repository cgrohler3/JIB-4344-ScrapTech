import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from "firebase/functions"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDaSjcfoG06JwZkIqz6XPVlBxSA87U3nDo",
    authDomain: "scraplanta-dashboard.firebaseapp.com",
    databaseURL: "https://scraplanta-dashboard-default-rtdb.firebaseio.com",
    projectId: "scraplanta-dashboard",
    storageBucket: "scraplanta-dashboard.firebasestorage.app",
    messagingSenderId: "1006997556473",
    appId: "1:1006997556473:web:e8241e6e4f163dd996e628",
    measurementId: "G-JDS830KVKE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth };