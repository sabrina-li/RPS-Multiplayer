//TODO create private rooms

var connectedRef = database.ref(".info/connected");
var gamesRef = database.ref("/games");
var playerRef = database.ref("/players");
var thisPlayer = "anonymouse";//TODO FB log in


document.addEventListener('DOMContentLoaded',function(){
   
    // var con = null;
    document.getElementById("gameDiv").style.visibility = "hidden";
    


    connectedRef.on("value", function(snap) {
        if (snap.val()) {
            var con = playerRef.push(
                {
                    online:true,
                    player:thisPlayer
                }
            )
            thisPlayer = con.key;//TODO: on lock gin, push to DB, change this player,
            sessionStorage.setItem("playerKey",thisPlayer);
            console.log("this player id",thisPlayer);
            con.onDisconnect().remove()
            //TODO:remove the games when all user disconnects
        }
    });


    var newGameBtn = document.getElementById('newGameBtn');
    
    newGameBtn.addEventListener('click',function(){
        console.log("click");
        let newGameRef = gamesRef.push();
        newGameRef.set({
            state:STATE.OPEN,
        }).then(function(con){
            //goto game page
            newGameRef.push({player:thisPlayer});
        });
        goToGame(newGameRef.key);
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
        gamesRef.child(val).push({player:thisPlayer});
        gamesRef.child(val).update({state:STATE.CLOSE});  
        goToGame(val);
    })
}
function goToGame(key){
    document.getElementById("gameDiv").removeAttribute("style");
    console.log("enter game",key);
    sessionStorage.setItem("gameKey", key);
    document.getElementById("sessionDiv").style.display = "none";
    // document.getElementById("gameDiv").removeAttribute("style");
    addAnimation();


}


function removeFromGame(val){
    //remove button
}

