const config = {
    apiKey: "AIzaSyC6FU1-40uPqWLeRgqB6FLxfGxQTyPx6yk",
    authDomain: "rps-multiplayer-51f18.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-51f18.firebaseio.com",
    projectId: "rps-multiplayer-51f18",
    storageBucket: "rps-multiplayer-51f18.appspot.com",
    messagingSenderId: "266663354042"
  };
  
const STATE = {RESTART:0,OPEN:1, CLOSE:2,DONE:3}

firebase.initializeApp(config);
const database = firebase.database();


const RESULTS = {
  SP:"Scissors cuts paper",
  PR:"paper covers rock",
  RL:"rock crushes lizard",
  LSp:"lizard poisons Spock",
  SpS:"Spock smashes scissors",
  SL:"scissors decapitates lizard",
  LP:"lizard eats paper",
  PSp:"paper disproves Spock",
  SpR:"Spock vaporizes rock",
  RS:"rock crushes scissors"
}

