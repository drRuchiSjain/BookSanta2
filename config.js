import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyCXw5DgeCApMRLgOi12J8UbFw-QXydhoZ4",
    authDomain: "booksanta-40b96.firebaseapp.com",
    databaseURL: "https://booksanta-40b96.firebaseio.com",
    projectId: "booksanta-40b96",
    storageBucket: "booksanta-40b96.appspot.com",
    messagingSenderId: "60879842308",
    appId: "1:60879842308:web:b782d0c021c951ca441951"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();