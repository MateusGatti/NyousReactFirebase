import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAdnUPpJITdYxbsLil3ZpDD3Y2fhNRz8MM",
    authDomain: "nyous-bede6.firebaseapp.com",
    projectId: "nyous-bede6",
    storageBucket: "nyous-bede6.appspot.com",
    messagingSenderId: "329816559216",
    appId: "1:329816559216:web:fc99b454aff440bcb9aeb5"
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();

export default firebaseConfig;