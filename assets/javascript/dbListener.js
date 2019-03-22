var connectedRef = database.ref(".info/connected");
var gamesRef = database.ref("/games");
var playerRef = database.ref("/players");
var thisPlayer = "anonymouse";//TODO FB log in



connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var con = playerRef.push();
        con.onDisconnect().remove()
        con.set({
                online:true,
                player:thisPlayer
            })
        thisPlayer = con.key;//TODO: on lock gin, push to DB, change this player,
        sessionStorage.setItem("playerKey",thisPlayer);
        console.log("this player id",thisPlayer);
        
        //TODO:remove the games when all user disconnects
    }
});


gamesRef.orderByChild("state").equalTo(STATE.OPEN).on('child_added',function(snap){
    appendToGames(snap.key,snap.val().player);
})
gamesRef.orderByChild("state").equalTo(STATE.OPEN).on('child_removed',function(snap){
    removeFromGame(snap.key);
})

gamesRef.orderByChild("state").equalTo(STATE.OPEN).on('value',function(snap){
    let obj = snap.val()
    if (obj !== null){
        let games=  Object.keys(obj)
        games.forEach(function(game){
            console.log(obj[game]);
            if (obj[game].player==null){
                console.log("null players!");
                gamesRef.child("/"+game).remove();
            }
        })  
    }
    
})


//input is game key
function appendToGames(val,player){
        var gamebtn = document.createElement("button");
        gamebtn.setAttribute("id",val);
        gamebtn.innerHTML=val;
        document.getElementById("games").appendChild(gamebtn);
        gamebtn.addEventListener('click',function(){
            // gamesRef.child(val).push({player:thisPlayer});
            gamesRef.child('/'+val+'/player').onDisconnect().update(
                {[thisPlayer]:null})
            gamesRef.child('/'+val).onDisconnect().update(
                    {state:STATE.OPEN})
            gamesRef.child('/'+val+'/player').update({[thisPlayer]:false});
            gamesRef.child(val).update({state:STATE.CLOSE});  
            goToGame(val);
        })
    
}



function removeFromGame(val){
    //remove button
    document.getElementById(val).outerHTML = "";

}


function addGameListener(thisGame){
    // var thisPlayer = sessionStorage.getItem("playerKey");
    let gameRef = database.ref("/games/"+thisGame);
    let myhand = false;
    let opponenthand= false;
    gameRef.on('value',function(snap){

        // console.log("on change for this game:",snap.val());
        let val = snap.val();
        console.log(val);
        if(val.state == STATE.OPEN){
            document.getElementById("opponent").innerHTML="<h2>Awaiting Other Players to Join</h2>"
        }else if (val.state !== STATE.DONE){
            playerArr = Object.keys(val.player)
            playerArr.forEach(function(pID){
                if(pID !== thisPlayer){
                    opponenthand = val.player[pID];
                }else{
                    myhand=val.player[pID]
                }
                // gameRef.child("/player").update({[pID]:false});
            });
            
            if(opponenthand == false){
                document.getElementById("opponent").innerHTML="<h2>Awaiting Other Player to Choose</h2>"
            }else{
                document.getElementById("opponent").innerHTML="<h2>Hurry up! The Other Player Has Chosen</h2>"
            }
            if( opponenthand !== false && myhand !== false){
                document.getElementById("opponent").innerHTML="<h2>"+opponenthand+"</h2>";
                compareHands(myhand,opponenthand);
                gameRef.update({state:STATE.DONE});
            }
        }
        
    })
}

function compareHands(myhand,opponenthand){
    switch (myhand){
        case "rock":
            if (opponenthand == "sissors" || opponenthand == "lizard"){handleWin(myhand,opponenthand);}
            else if (opponenthand == "papper" || opponenthand == "lizard"){handleLose(myhand,opponenthand);}
            else{handleTie()}
            break;
        case "papper":
            if (opponenthand == "rock" || opponenthand == "spock"){handleWin(myhand,opponenthand);}
            else if (opponenthand == "sissors" || opponenthand == "lizard"){handleLose(myhand,opponenthand);}
            else{handleTie()}
            break;
        case "sissors":
            if (opponenthand == "papper" || opponenthand == "lizard"){handleWin(myhand,opponenthand);}
            else if (opponenthand == "spock" || opponenthand == "rock"){handleLose(myhand,opponenthand);}
            else{handleTie()}
            break;
        case "lizard":
            if (opponenthand == "papper" || opponenthand == "spock"){handleWin(myhand,opponenthand);}
            else if (opponenthand == "rock" || opponenthand == "sissors"){handleLose(myhand,opponenthand);}
            else{handleTie()}
            break;
        case "spock":
            if (opponenthand == "sissors" || opponenthand == "rock"){handleWin(myhand,opponenthand);}
            else if (opponenthand == "paper" || opponenthand == "lizard"){handleLose(myhand,opponenthand);}
            else{handleTie()}
            break;
        default:
            console.error("invalid hands",myhand,opponenthand);
            break  
    }
    
}

function handleWin(myhand,opponenthand){
    let d = document.createElement("p");
    d.innerHTML="<p>win</p>";
    document.getElementById("resultDiv").appendChild(d);
}
function handleLose(myhand,opponenthand){
    let d = document.createElement("p");
    d.innerHTML="<p>lose</p>";
    document.getElementById("resultDiv").appendChild(d);
}
function handleTie(myhand,opponenthand){
    let d = document.createElement("p");
    d.innerHTML="<p>tie</p>";
    document.getElementById("resultDiv").appendChild(d);
}