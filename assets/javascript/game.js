
function addAnimation(){
    var svgObject = document.getElementById('svg-object')
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
                document.getElementById("opponent").innerHTML="<h2>Awaiting Other Player to Choose</h2>"
            }else{
                document.getElementById("opponent").innerHTML="<h2>Hurry up! The Other Player Has Chosen</h2>"
            }
            if( opponenthand !== false && myhand !== false){
                document.getElementById("opponent").innerHTML="<h2>Opponent Chose: <br>"+opponenthand+"</h2>";
                let w = document.getElementById("opponent").offsetWidth
                document.getElementById("opponent").style.maxHeight=w+"px";
                document.getElementById("opponent").appendChild(getImage(opponenthand));
                
                compareHands(myhand,opponenthand);
                gameRef.update({state:STATE.DONE});
            }
        }
        
    })
}


function selectHand(hand){
    var thisPlayer = sessionStorage.getItem("playerKey");
    var thisGame = sessionStorage.getItem("gameKey");
    var gameRef = database.ref("/games/"+thisGame);
    
    document.getElementById("myselection").innerHTML="<h2>You Chose: <br>"+hand.id+"</h2>";
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
            if (opponenthand == "papper"){handleWin(RESULTS.RS);}
            else if (opponenthand == "lizard"){handleWin(RESULTS.SL);}
            else if (opponenthand == "spock"){handleLose(RESULTS.SpS);}
            else if (opponenthand == "rock"){handleLose(RESULTS);}
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
    
}

function handleWin(result){
    let d = document.createElement("p");
    d.innerHTML="You Win!!!!" + result;
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleLose(result){
    let d = document.createElement("p");
    d.innerHTML="You Lose!!!!" + result;
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}
function handleTie(){
    let d = document.createElement("p");
    d.innerHTML="You Tied!!!!";
    document.getElementById("resultDiv").appendChild(d);
    document.getElementById("resultDiv").style.display = "initial";
}