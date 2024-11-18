import firebase from 'firebase/compat/app';
import { getDatabase } from 'firebase/database';

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

if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

export { db }