//TODO create private rooms

document.addEventListener('DOMContentLoaded',function(){
   
    //hide main play area
    // document.getElementById("gameDiv").style.visibility = "hidden";

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
}
