import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyCNnbyJH4Y8L4KC2HBRkSTUW6rQRzpentI",
    authDomain: "curso-ac001.firebaseapp.com",
    projectId: "curso-ac001",
    storageBucket: "curso-ac001.appspot.com",
    messagingSenderId: "72358010712",
    appId: "1:72358010712:web:f7b9b61842fa2d1b4b8f2d",
    measurementId: "G-FQEMNXGRTZ"
  };

  if(!firebase.apps.length){
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

export default firebase;