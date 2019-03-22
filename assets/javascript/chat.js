function chatHandler(thisPlayer,thisGame){
    var chatRef = database.ref("/games/"+thisGame+'/chat');

    document.getElementById("chatSubmit").addEventListener('click',function(event){
        event.preventDefault();
        message = document.getElementById("chatInput").value;


        chatRef.onDisconnect().set(null);
        chatRef.push().set({
            player:thisPlayer,
            message:message
        });
    })

    database.ref('/games/'+thisGame+'/chat/').on("child_added",function(snap){
        let message = snap.val().message;
        let playerID = snap.val().player;
        var username = "me";
        if(playerID !== thisPlayer){
            firebase.database().ref('/players/' + playerID).once('value').then(function(snapshot) {
                username = (snapshot.val() && snapshot.val().player) || 'Anonymous';
                let messageDiv = document.createElement("div");
                messageDiv.innerHTML=`<strong>${username}</strong>: ${message}`
                document.getElementById("chatMessages").appendChild(messageDiv);
            })
        }else{
            let messageDiv = document.createElement("div");
                messageDiv.innerHTML=`<strong>${username}</strong>: ${message}`
                document.getElementById("chatMessages").appendChild(messageDiv);
        }
    })
        

    database.ref('/games/'+thisGame+'/chat/').on("child_removed",function(snap){
        document.getElementById("chatMessages").innerHTML="";
    })
}




