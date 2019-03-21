var config = {
    apiKey: "AIzaSyC6FU1-40uPqWLeRgqB6FLxfGxQTyPx6yk",
    authDomain: "rps-multiplayer-51f18.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-51f18.firebaseio.com",
    projectId: "rps-multiplayer-51f18",
    storageBucket: "rps-multiplayer-51f18.appspot.com",
    messagingSenderId: "266663354042"
  };
  
var STATE = {OPEN:1, CLOSE:2,WAITING:3,DONE:4}

firebase.initializeApp(config);
var database = firebase.database();

