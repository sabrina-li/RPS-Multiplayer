
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