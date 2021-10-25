import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDHeTRgCyTUjACcCJ3dGg6KVolM4O9ZfEw",
    authDomain: "instagram-clone-react-e9c4f.firebaseapp.com",
    projectId: "instagram-clone-react-e9c4f",
    storageBucket: "instagram-clone-react-e9c4f.appspot.com",
    messagingSenderId: "196709912788",
    appId: "1:196709912788:web:6a704f80376dc5a5906b41",
    measurementId: "G-LLGJNRS9VE"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

//export default db;