//TODO create private rooms
var connectedRef = database.ref(".info/connected");
var gamesRef = database.ref("/games");
var playerRef = database.ref("/players");
var thisPlayer = "Anonymous";//TODO FB log in

document.addEventListener('DOMContentLoaded',function(){
   
    //hide main play area
    // document.getElementById("gameDiv").style.visibility = "hidden";

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

    var newGameBtn = document.getElementById('newGameBtn');
    newGameBtn.addEventListener('click',function(){
        console.log("click");
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
        goToGame(newGameRef.key);
    })
})

function goToGame(key){
    document.getElementById("gameDiv").style.visibility = "initial";
    console.log("enter game",key);
    sessionStorage.setItem("gameKey", key);
    document.getElementById("sessionDiv").style.display = "none";
    // document.getElementById("gameDiv").removeAttribute("style");
    addAnimation();
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
            // console.log(obj[game]);
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
