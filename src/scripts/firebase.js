import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBH4Vjv3eweQ5UN0QlCJjxWjwJ0TDPFLws",
    authDomain: "phrasebook-82943.firebaseapp.com",
    databaseURL: "https://phrasebook-82943.firebaseio.com",
    projectId: "phrasebook-82943",
    storageBucket: "phrasebook-82943.appspot.com",
    messagingSenderId: "670875707051"
};
firebase.initializeApp(config);

export default firebase;