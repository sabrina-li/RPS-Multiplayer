document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("createUser").addEventListener('click', function (event) {
        firebase.auth().createUserWithEmailAndPassword("test@gmail.com", "password")
            .then(function (user) {
                user.updateProfile({
                    displayName: "testuser"
                }).then(function () {
                    // Update successful.
                }, function (error) {
                    // An error happened.
                });
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
    })
    document.getElementById("loginBtn").addEventListener('click', function (event) {
        firebase.auth().signInWithEmailAndPassword("test@gmail.com", "password")
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
    })

    document.getElementById("logoutBtn").addEventListener('click', function (event) {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            let user = sessionStorage.getItem("playerKey");
            var con = database.ref('/players/'+user);
            sessionStorage.setItem("loggedIn", false);
            con.update({
                online: false,
            }).then(function(){
                //reload page after user signed out
                location.reload();
            })
        }).catch(function (error) {
            // An error happened.
        });
    })



    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // remove current anoynymouse user
            //User is signed in. set user to this user
            document.getElementById("createUser").style.display="none";
            document.getElementById("loginBtn").style.display="none";
            document.getElementById("logoutBtn").style.display="initial";

            var con = database.ref('/players/'+user.uid);
            
            con.onDisconnect().update({
                online: false,
            })
            con.update({
                    online: true,
                    displayName: user.displayName,
                    player: user.email
            });

            sessionStorage.setItem("playerKey", user.uid);
            sessionStorage.setItem("loggedIn", true);
        } else {
            // No user is signed in. set user to anounymouse
            document.getElementById("createUser").style.display="initial";
            document.getElementById("loginBtn").style.display="initial";
            document.getElementById("logoutBtn").style.display="none";

            var con = playerRef.push();
            con.onDisconnect().remove()
            con.set({
                online: true,
                player: "Anonymouse"
            })
            
            sessionStorage.setItem("playerKey", con.key);
            sessionStorage.setItem("loggedIn", false);
        }
    });


})



//


//         //TODO:remove the games when all user disconnects