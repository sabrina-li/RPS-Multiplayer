//TODO create private rooms
var connectedRef = database.ref(".info/connected");
var gamesRef = database.ref("/games");
var playerRef = database.ref("/players");




//TODO FB log in

document.addEventListener('DOMContentLoaded',function(){


    
    var newGameBtn = document.getElementById('newGameBtn');
    newGameBtn.addEventListener('click',function(){
        console.log("click");
        let thisPlayer = sessionStorage.getItem("playerKey");
        let newGameRef = gamesRef.push();
        newGameRef.child('/player').onDisconnect().update(
            {[thisPlayer]:null})
        newGameRef.onDisconnect().update(
                {state:STATE.OPEN})
        newGameRef.set({
            state:STATE.OPEN,
            player:{
                [thisPlayer]:false
            }
        });
        goToGame(thisPlayer,newGameRef.key);
    })
})

function goToGame(thisPlayer,key){
    document.getElementById("gameDiv").style.visibility = "initial";
    console.log("enter game",key);
    sessionStorage.setItem("gameKey", key);
    document.getElementById("sessionDiv").style.display = "none";
    // document.getElementById("gameDiv").removeAttribute("style");
    addAnimation();
    addUserListner();
    addGameListener(key);
    chatHandler(thisPlayer,key);
}



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
        let thisPlayer = sessionStorage.getItem("playerKey");
        gamesRef.child('/'+val).onDisconnect().update(
            {state:STATE.OPEN})
        gamesRef.child('/'+val+'/player').onDisconnect().update(
            {[thisPlayer]:null})
        
        gamesRef.child('/'+val).transaction(function(game){
            if(game.state == STATE.OPEN){
                game.state=STATE.CLOSE;
                game.player[thisPlayer]=false;
            }
            return game
        })
        
        goToGame(thisPlayer,val);
    })

}



function removeFromGame(val){
    //remove button
    document.getElementById(val).outerHTML = "";

}
