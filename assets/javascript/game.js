
function addAnimation(){
    var svgObject = document.getElementById('svg-object');
    var svgDoc = svgObject.contentDocument;
    var element = svgDoc.getElementsByClassName('hand');

    console.log("playgame called")
    for(var i=0;i<element.length;i++){  
        //TODO show hint on hover
        element[i].children[0].addEventListener("mouseleave", function (){
            this.style.strokeWidth = 11;
        })
        element[i].children[0].addEventListener("mouseover", function (){
            this.style.strokeWidth = 30;
        })
        element[i].children[0].addEventListener("click", function (){
            this.style.strokeWidth = 30;
            selectHand(this.parentElement);
        })
        
    }
    
}



function addGameListener(thisGame){
    var thisPlayer = sessionStorage.getItem("playerKey");
    let gameRef = database.ref("/games/"+thisGame);
    let myhand = false;
    let opponenthand= false;
    gameRef.on('value',function(snap){
        
        let val = snap.val();
        
        if(val.state == STATE.OPEN){
            document.getElementById("opponent").innerHTML="<h2>Awaiting Other Players to Join</h2>"
        }else if (val.state !== STATE.DONE){
            playerArr = Object.keys(val.player)
            playerArr.forEach(function(pID){
                if(thisPlayer && pID !== thisPlayer){
                    opponenthand = val.player[pID];
                }else{
                    myhand=val.player[pID]
                }
            });
            
            if(opponenthand == false){
                document.getElementById("opponent").innerHTML="<p>Awaiting Other Player to Choose</p>"
            }else{
                document.getElementById("opponent").innerHTML="<h2>Hurry up! The Other Player Has Chosen</h2>"
            }
            if( opponenthand !== false && myhand !== false){
                document.getElementById("opponenttitle").innerHTML="<p>Opponent Chose: <br>"+opponenthand+"</p>";
                document.getElementById("opponent").innerHTML="";
                let w = document.getElementById("opponent").offsetWidth
                document.getElementById("opponent").style.maxHeight=w+"px";
                document.getElementById("opponent").appendChild(getImage(opponenthand));
                
                compareHands(myhand,opponenthand);
                gameRef.update({state:STATE.DONE});
            }
        }else if(val.state == STATE.RESTART){
            gameRef.child("/player").update({[thisPlayer]:false})
            .then(function(){
                addAnimation();
                addGameListener(thisGame);
                addUserListner();
                chatHandler(thisPlayer,thisGame);
            });
            
        }
        
    })
}

function addUserListner(){

var thisPlayer = sessionStorage.getItem("playerKey");
var playerRef  = database.ref('/players/'+thisPlayer);
playerRef.on('value',function(snap){
    // console.log(snap.val().wins || 0);
    document.getElementById("wincount").innerHTML = snap.val().wins || 0;
    document.getElementById("losecount").innerHTML = snap.val().loses|| 0;
    document.getElementById("tiecount").innerHTML = snap.val().ties|| 0;

})
}

function selectHand(hand){
    var thisPlayer = sessionStorage.getItem("playerKey");
    var thisGame = sessionStorage.getItem("gameKey");
    var gameRef = database.ref("/games/"+thisGame);
    
    document.getElementById("myselectiontitle").innerHTML="<p>You Chose: <br>"+hand.id+"</p>";
    document.getElementById("svg-object").style.visibility="hidden";
    document.getElementById("svg-object").style.position="fixed";
    let w = document.getElementById("myselection").offsetWidth
    document.getElementById("myselection").style.maxHeight=w+"px";
    document.getElementById("myselection").appendChild(getImage(hand.id));
    

    //push this players selection to db
    gameRef.child("player").update({[thisPlayer]:hand.id})
}



function removeFromGame(val){
    //remove button
    document.getElementById(val).outerHTML = "";

}






function compareHands(myhand,opponenthand){
    switch (myhand){
        case "rock":
            if (opponenthand == "sissors"){handleWin(RESULTS.RS);}
            else if (opponenthand == "lizard"){handleWin(RESULTS.RL);}
            else if (opponenthand == "papper"){handleLose(RESULTS.PR);}
            else if (opponenthand == "Spock"){handleLose(RESULTS.SpR);}
            else{handleTie()}
            break;
        case "papper":
            if (opponenthand == "rock"){handleWin(RESULTS.PR);}
            else if(opponenthand == "spock"){handleWin(RESULTS.PSp);}
            else if (opponenthand == "sissors"){handleLose(RESULTS.SP);}
            else if (opponenthand == "lizard"){handleLose(RESULTS.LP);}
            else{handleTie()}
            break;
        case "sissors":
            if (opponenthand == "papper"){handleWin(RESULTS.SP);}
            else if (opponenthand == "lizard"){handleWin(RESULTS.SL);}
            else if (opponenthand == "spock"){handleLose(RESULTS.SpS);}
            else if (opponenthand == "rock"){handleLose(RESULTS.RS);}
            else{handleTie()}
            break;
        case "lizard":
            if (opponenthand == "papper"){handleWin(RESULTS.LP);}
            else if (opponenthand == "spock"){handleWin(RESULTS.LSp);}
            else if (opponenthand == "rock"){handleLose(RESULTS.RL);}
            else if (opponenthand == "sissors"){handleLose(RESULTS.SL);}
            else{handleTie()}
            break;
        case "spock":
            if (opponenthand == "sissors"){handleWin(RESULTS.SpS);}
            else if (opponenthand == "rock"){handleWin(RESULTS.SpR);}
            else if (opponenthand == "papper"){handleLose(RESULTS.PSp);}
            else if (opponenthand == "lizard"){handleLose(RESULTS.LSp);}
            else{handleTie()}
            break;
        default:
            console.error("invalid hands",myhand,opponenthand);
            break  
    }
    document.getElementById("restart").addEventListener('click',function(){
        document.getElementById('svg-object').style.position = "relative";
        document.getElementById('svg-object').style.visibility = "visible";
        let game = sessionStorage.getItem("gameKey");

        
        let handsToRemove = document.getElementsByClassName("singleHand")
        let l = handsToRemove.length
        for(var i = 0; i < l; i++){
            // console.log(handsToRemove[0])
            handsToRemove[0].outerHTML="";
        }
        
        database.ref("/games/"+game).update({state:STATE.DONE});
        
        
        
    })

}

function handleWin(result){
    var thisPlayer = sessionStorage.getItem("playerKey");
    let winRef  = database.ref('/players/'+thisPlayer).child("wins");
    winRef.transaction(function(wins){
        return (wins||0) +1;
    })
    let d = document.createElement("p");
    d.innerHTML="You Win!!!!" + result;
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleLose(result){
    var thisPlayer = sessionStorage.getItem("playerKey");
    let losesRef  = database.ref('/players/'+thisPlayer).child("loses");
    losesRef.transaction(function(loses){
        return (loses||0) +1;
    })
    let d = document.createElement("p");
    d.innerHTML="You Lose!!!!" + result;
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleTie(){
    var thisPlayer = sessionStorage.getItem("playerKey");
    let winRef  = database.ref('/players/'+thisPlayer).child("ties");
    winRef.transaction(function(ties){
        return (ties||0) +1;
    })
    let d = document.createElement("p");
    d.innerHTML="You Tied!!!!";
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}



