var config = {
    apiKey: "AIzaSyC6FU1-40uPqWLeRgqB6FLxfGxQTyPx6yk",
    authDomain: "rps-multiplayer-51f18.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-51f18.firebaseio.com",
    projectId: "rps-multiplayer-51f18",
    storageBucket: "rps-multiplayer-51f18.appspot.com",
    messagingSenderId: "266663354042"
  };
  
var STATE = {EMPTY:0,OPEN:1, CLOSE:2,DONE:3}

firebase.initializeApp(config);
var database = firebase.database();

