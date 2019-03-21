window.addEventListener('load',function(){
    console.log(sessionStorage.getItem("gameKey"));

    var svgObject = document.getElementById('svg-object')
     var svgDoc = svgObject.contentDocument;
    var element = svgDoc.getElementsByClassName('hand');
    // console.log(element);
    
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
            selectHand(svgObject,this.parentElement);
        })
        
    }
    
})



function waitForPlayer(){
    //show waiting page on left
    //show game rules when hover
}

function playGame(){
    
    
}
function roomFull(){

}

function selectHand(svgObject,hand){
    //Zoom
    
    //center this hand
    // console.log("obj:", svgObject);
    var handPos = hand.getBoundingClientRect();
    var boxPos=document.getElementById("myselection").getBoundingClientRect();
    // // console.log(svgObject);
    
    console.log(handPos.top, handPos.height);
    console.log(boxPos.height,boxPos.width);
    svgObject.style.transform=`scale(2) translate(${boxPos.width/2-handPos.left-handPos.width/2}px,
                                       ${boxPos.height/2-handPos.top-handPos.height/2}px)`;
    
    let elements = svgObject.contentDocument.getElementsByClassName("arrow")
    for(var i=0;i<elements.length;i++){  
        elements[i].setAttribute("style","display:none");
    }

    let hands = svgObject.contentDocument.getElementsByClassName("hand")
    for(var i=0;i<hands.length;i++){  
        if(hands[i].id !== hand.id){
            hands[i].setAttribute("style","display:none");
        }
    }
    
    //svgObject.getElementById("rock").style.display="none"
    //svgObject.getElementsByClassName("arrow").style.display="none"
                                   
    // svgObject.style.transformOrigin=`${boxPos.top + boxPos.height/2}px ${boxPos.left+boxPos.width/2}px`;
    // svgObject.style.transform ="scale(2)";
    // svgObject.classList.add("zoomInHand");
    // console.log("obj:", svgObject.style);
    // console.log("hand",hand.id);

    //fadeout other elements

}



