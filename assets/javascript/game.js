document.addEventListener('DOMContentLoaded',function(){
    document.addEventListener('click', function (e) {
        if(e.target.getAttribute("id") == "restart"){
            let thisGame = sessionStorage.getItem("gameKey");
            database.ref("/games/" + thisGame).update({ state: STATE.RESTART });
        }
    })

})



function addGameListener(thisGame) {
    var thisPlayer = sessionStorage.getItem("playerKey");
    let gameRef = database.ref("/games/" + thisGame);
    let myhand = false;
    let opponenthand = false;
    gameRef.on('value', function (snap) {

        let val = snap.val();
        if (val.state == STATE.OPEN) {
            document.getElementById("opponenttitle").innerHTML = "<h3>Awaiting Other Players to Join</h3>"
        }else if (val.state == STATE.RESTART){
            document.getElementById('svg-object').style.position = "relative";
            document.getElementById('svg-object').style.visibility = "visible";
            //TODO this is a workaround, the hover listener does not get attached if called immediately after set visibility
            //svg somehow does now show up after setting to visible and below don't work....
            setTimeout(() => {
                addAnimation();
            }, 500);
            
            let handsToRemove = document.getElementsByClassName("singleHand")
            let l = handsToRemove.length
            for (var i = 0; i < l; i++) {
                // console.log(handsToRemove[0])
                handsToRemove[0].outerHTML = "";
            }
            if(document.getElementById("resultStr")){
                document.getElementById("resultStr").outerHTML="";
            }
            document.getElementById("resultDiv").style.display = "none";
            database.ref("/games/" + thisGame + "/player").update({ [thisPlayer]: false });
            database.ref("/games/" + thisGame).update({ state: STATE.CLOSE });
            
        } else if (val.state == STATE.CLOSE) {
            
            playerArr = Object.keys(val.player)
            playerArr.forEach(function (pID) {
                if (thisPlayer && pID !== thisPlayer) {
                    opponenthand = val.player[pID];
                } else {
                    myhand = val.player[pID]
                }
            });

            if (opponenthand == false) {
                document.getElementById("opponenttitle").innerHTML = "<h3>Awaiting Other Player to Choose</h3>"
            } else {
                document.getElementById("opponenttitle").innerHTML = "<h3>Hurry up! The Other Player Has Chosen</h3>"
            }
            if (opponenthand !== false && myhand !== false) {
                document.getElementById("opponenttitle").innerHTML = "<p>Opponent Chose: <br>" + opponenthand + "</p>";
                // document.getElementById("opponent").innerHTML = "";
                let w = document.getElementById("opponent").offsetWidth
                console.log("offsetwidth is: ",w);
                document.getElementById("opponent").style.maxHeight = (parseInt(w)+50) + "px";
                document.getElementById("opponent").appendChild(getImage(opponenthand));

                compareHands(myhand, opponenthand);
                gameRef.update({state: STATE.DONE });
            }
        }

    })
}

function addUserListner() {

    var thisPlayer = sessionStorage.getItem("playerKey");
    var playerRef = database.ref('/players/' + thisPlayer);
    playerRef.on('value', function (snap) {
        // console.log(snap.val().wins || 0);
        document.getElementById("wincount").innerHTML = snap.val().wins || 0;
        document.getElementById("losecount").innerHTML = snap.val().loses || 0;
        document.getElementById("tiecount").innerHTML = snap.val().ties || 0;

    })
}








function compareHands(myhand, opponenthand) {
    switch (myhand) {
        case "rock":
            if (opponenthand == "sissors") { handleWin(RESULTS.RS); }
            else if (opponenthand == "lizard") { handleWin(RESULTS.RL); }
            else if (opponenthand == "papper") { handleLose(RESULTS.PR); }
            else if (opponenthand == "Spock") { handleLose(RESULTS.SpR); }
            else { handleTie() }
            break;
        case "papper":
            if (opponenthand == "rock") { handleWin(RESULTS.PR); }
            else if (opponenthand == "spock") { handleWin(RESULTS.PSp); }
            else if (opponenthand == "sissors") { handleLose(RESULTS.SP); }
            else if (opponenthand == "lizard") { handleLose(RESULTS.LP); }
            else { handleTie() }
            break;
        case "sissors":
            if (opponenthand == "papper") { handleWin(RESULTS.SP); }
            else if (opponenthand == "lizard") { handleWin(RESULTS.SL); }
            else if (opponenthand == "spock") { handleLose(RESULTS.SpS); }
            else if (opponenthand == "rock") { handleLose(RESULTS.RS); }
            else { handleTie() }
            break;
        case "lizard":
            if (opponenthand == "papper") { handleWin(RESULTS.LP); }
            else if (opponenthand == "spock") { handleWin(RESULTS.LSp); }
            else if (opponenthand == "rock") { handleLose(RESULTS.RL); }
            else if (opponenthand == "sissors") { handleLose(RESULTS.SL); }
            else { handleTie() }
            break;
        case "spock":
            if (opponenthand == "sissors") { handleWin(RESULTS.SpS); }
            else if (opponenthand == "rock") { handleWin(RESULTS.SpR); }
            else if (opponenthand == "papper") { handleLose(RESULTS.PSp); }
            else if (opponenthand == "lizard") { handleLose(RESULTS.LSp); }
            else { handleTie() }
            break;
        default:
            console.error("invalid hands", myhand, opponenthand);
            break
    }

    

}

function handleWin(result) {
    var thisPlayer = sessionStorage.getItem("playerKey");
    let winRef = database.ref('/players/' + thisPlayer).child("wins");
    winRef.transaction(function (wins) {
        return (wins || 0) + 1;
    })
    let d = document.createElement("h3");
    d.innerHTML = "You Win!!!!  " + result;
    d.setAttribute("id","resultStr");
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleLose(result) {
    var thisPlayer = sessionStorage.getItem("playerKey");
    let losesRef = database.ref('/players/' + thisPlayer).child("loses");
    losesRef.transaction(function (loses) {
        return (loses || 0) + 1;
    })
    let d = document.createElement("h3");
    d.innerHTML = "You Lose!!!!  " + result;
    d.setAttribute("id","resultStr");
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleTie() {
    var thisPlayer = sessionStorage.getItem("playerKey");
    let winRef = database.ref('/players/' + thisPlayer).child("ties");
    winRef.transaction(function (ties) {
        return (ties || 0) + 1;
    })
    let d = document.createElement("h3");
    d.innerHTML = "You Tied!!!!  ";
    d.setAttribute("id","resultStr");
    document.getElementById("resultDiv").prepend(d);
    document.getElementById("resultDiv").style.display = "initial";
}


