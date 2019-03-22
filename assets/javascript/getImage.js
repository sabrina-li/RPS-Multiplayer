function getImage(svgObject,hand){
    
    //Zoom
    //center this hand
    //TODO: animation of zoom //fadeout other elements
    var handPos = hand.getBoundingClientRect();
    var boxPos=document.getElementById("myselection").getBoundingClientRect();
    
    // console.log(handPos.top, handPos.height);
    // console.log(boxPos.height,boxPos.width);
    svgObject.style.transform=`scale(2) translate(${boxPos.width/2-handPos.left-handPos.width/2}px,
                                       ${boxPos.height/2-handPos.top-handPos.height/2}px)`;
    // let test = document.createElement("p");
    //     test.innerHTML = "test";
    //     test.style.position = "fixed";
    //     test.style.top = boxPos.top;
    //     test.style.left = boxPos.left;
    //     document.getElementById("gameDiv").appendChild(test);
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
}