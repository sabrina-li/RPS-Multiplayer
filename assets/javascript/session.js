//TODO create private rooms
firebase.initializeApp(config);
var database = firebase.database();

var STATE = {OPEN:1, CLOSE:2}

var connectedRef = database.ref(".info/connected");
var gamesRef = database.ref("/games");
var playerRef = database.ref("/players");
var thisPlayer = "";


window.addEventListener('load',function(){
   
    // var con = null;


    connectedRef.on("value", function(snap) {
        if (snap.val()) {
            var con = playerRef.push(
                {
                    online:true,
                    player:"anonymouse"
                }
            )
            thisPlayer = con.key;
            console.log("this player id",thisPlayer);
            con.onDisconnect().remove()
           
            //TODO:remove the games when all user disconnects
           
        }
    });


    var newGameBtn = document.getElementById('newGameBtn');
    
    newGameBtn.addEventListener('click',function(){
        console.log("click");
        gamesRef.push({
            state:STATE.OPEN,
            player1:thisPlayer
        }).then(function(con){
            //goto game page
            goToGame(con.key);
        });
    })

    gamesRef.orderByChild("state").equalTo(STATE.OPEN).on('child_added',function(snap){
        appendToGames(snap.key);
    })
    gamesRef.orderByChild("state").equalTo(STATE.OPEN).on('child_removed',function(snap){
        removeFromGame(snap.key);
    })


})

//input is game key
function appendToGames(val){
    // console.log(val);
    var gamebtn = document.createElement("button");
    gamebtn.setAttribute("id",val);
    gamebtn.innerHTML=val;
    document.getElementById("games").appendChild(gamebtn);
    gamebtn.addEventListener('click',function(){
        gamesRef.child(val).update({player2:thisPlayer,state:STATE.CLOSE})
        goToGame(val);
    })
}
function goToGame(key){
    sessionStorage.setItem("gameKey", key);
    window.location.href="game.html";
}


function removeFromGame(val){
    //remove button
}

