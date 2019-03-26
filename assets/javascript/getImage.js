function getImage(hand){
    xhr = new XMLHttpRequest();
    xhr.open("GET","assets/images/rpsls.svg",false);
    // Following line is just to be on the safe side;
    // not needed if your server delivers SVG with correct MIME type
    xhr.overrideMimeType("image/svg+xml");
    xhr.send("");
    svgObject = xhr.responseXML.documentElement
    
    //Zoom//center this hand
    //TODO: animation of zoom //fadeout other elements

    
    // svgObject.style.transform = "scale(0.5)";
    // svgObject.style.transform=`translate(${boxPos.width/2-handPos.left-handPos.width}px,
                                        // ${boxPos.height/2-handPos.top/2-handPos.height/2}px)`;
    
    var handPos;
    var boxPos;

    let elements = svgObject.getElementsByClassName("arrow")
    for(var i=0;i<elements.length;i++){  
        elements[i].setAttribute("style","display:none");
    }

    let hands = svgObject.getElementsByClassName("hand")
    for(var i=0;i<hands.length;i++){  
        // console.log(hands[i]);
        if(hands[i].id !== hand){
            hands[i].setAttribute("style","display:none");
        }else{
            // console.log(hands[i])
            switch(hands[i].id){
                case "spock":
                    hands[i].style.transform="matrix(0,0.283393,-0.283393,0,400.69481,-85.870476)";
                    break;
                case "sissors":
                    hands[i].style.transform="matrix(0,0.283393,-0.283393,0,571.15154,-173.972742)";
                    break;
                case "papper":
                    hands[i].style.transform="matrix(0,0.283393,-0.283393,0,570.95892,-10.90237)"
                    break;
                case "rock":
                    hands[i].style.transform="matrix(0,0.283393,-0.283393,0,607.46772,170.158)"
                    break;
                case "lizard":
                    hands[i].style.transform="matrix(0,0.283393,-0.283393,0,432.399766,115.24694)"
                    break;
            }
            
        }
    }

    svgObject.classList.add("singleHand");
    return svgObject;
}