
function addAnimation(){
    var svgObject = document.getElementById('svg-object')
    var svgDoc = svgObject.contentDocument;
    var element = svgDoc.getElementsByClassName('hand');

    // var test = svgDoc.getElementsByTagName("svg")
    // //test.style.backgroundColor="red";
    // console.log(test[0].style.backgroundColor = "red");

    console.log("playgame called")
    for(var i=0;i<element.length;i++){  
        //TODO show hint on hover
        element[i].children[0].addEventListener("mouseleave", function (){
            // console.log("hover",this);
            this.style.strokeWidth = 11;
        })
        element[i].children[0].addEventListener("mouseover", function (){
            // console.log("over",this);
            this.style.strokeWidth = 30;
        })
        element[i].children[0].addEventListener("click", function (){
            // document.getElementById('svgitem').innerHTML = thisHand.innerHTML;
            this.style.strokeWidth = 30;
            selectHand(svgObject,this.parentElement);
        })
        
    }
    
}



// function waitForPlayer(){
//     //show waiting page on left
//     //show game rules when hover
// }

// function playGame(){
    
    
// }
// function roomFull(){

// }


function addGameListener(thisGame){
    // var thisPlayer = sessionStorage.getItem("playerKey");
    let gameRef = database.ref("/games/"+thisGame);
    let myhand = false;
    let opponenthand= false;
    gameRef.on('value',function(snap){

        // console.log("on change for this game:",snap.val());
        let val = snap.val();
        // console.log(val);
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


function selectHand(svgObject,hand){
    var thisPlayer = sessionStorage.getItem("playerKey");
    var thisGame = sessionStorage.getItem("gameKey");
    var gameRef = database.ref("/games/"+thisGame);
    
    // document.getElementById("myselection").innerHTML = 
    document.getElementById("resultDiv").appendChild(getImage(svgObject,hand.id));
    

    //push this players selection to db
    gameRef.child("player").update({[thisPlayer]:hand.id})
    //gameRef.child("player").update({state:STATE.WAITING});
}



function removeFromGame(val){
    //remove button
    document.getElementById(val).outerHTML = "";

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