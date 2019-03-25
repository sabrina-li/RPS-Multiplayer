var auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("loginBtn").addEventListener('click', function (event) {
        event.preventDefault();
        //remove errormsg if any

        showLoginSection();
        document.getElementById("signupBtn").addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById("loginnamegroup").style.display = "initial";
            this.parentElement.style.visibility = "hidden";
            document.getElementById("loginOrSignupBtn").setAttribute("value", "Signup");
        })
        document.getElementById("loginOrSignupBtn").addEventListener('click', function (event) {
            event.preventDefault();
            if (this.getAttribute("value").toLowerCase() == "login") {
                loginUser();
            } else {
                signUpUser();
            }
        })

    })



    document.getElementById("logoutBtn").addEventListener('click', function (event) {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            let user = sessionStorage.getItem("playerKey");
            var con = database.ref('/players/' + user);
            con.update({
                online: false,
            }).then(function () {
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
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("logoutBtn").style.display = "initial";

            var con = database.ref('/players/' + user.uid);

            con.onDisconnect().update({
                online: false,
            })
            con.update({
                online: true,
                displayName: user.displayName,
                player: user.email
            });
            document.getElementById("loggedinUserName").innerHTML = user.displayName;

            sessionStorage.setItem("playerKey", user.uid);
            sessionStorage.setItem("loggedIn", true);
        } else {
            // No user is signed in. set user to anounymouse
            document.getElementById("loginBtn").style.display = "initial";
            document.getElementById("logoutBtn").style.display = "none";

            var con = playerRef.push();
            con.onDisconnect().remove()
            con.set({
                online: true,
                player: "Anonymouse"
            })

            sessionStorage.setItem("playerKey", con.key);
        }
    });


})



function signUpUser() {

    //ready from form and create user
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    //const username = email.split('@')[0];

    if (password && email) {
        auth.createUserWithEmailAndPassword(email, password)
            .then(function () {
                let user = auth.currentUser;
                pushUserToDB(user);
                user.updateProfile({
                    displayName: firstname + " " + lastname,
                }).then(function () {
                    // Update successful.
                    updateUserToDBwithName(user);
                    // loginHandler(true, user);
                }, function (error) {
                    const errorMessage = error.message;
                    showError("Can't set username", errorMessage);
                });
            })
            .catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                showError(errorCode, errorMessage);
                console.log(errorMessage);
            });
    } else {
        showError(0, "Please complete all the fields")
    }

}

function loginUser() {
    //ready from form and create user
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(function (u) {
            // Login successful.
            document.getElementById("loginForm").style.display = "none";
        })
        .catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            showError(errorCode, errorMessage);
        });
}

function showError(errorCode, errorMessage) {
    let error = $("<p>").attr("id", "errormsg");
    error.css("color", "red");
    error.text("Error Authenticate, code: " + errorCode + ". Error Message: " + errorMessage)
    $("#loginForm").append(error);
}


function showLoginSection() {
    const loginDiv = `<form id="loginForm" autocomplete="off"">
                    <button id="closelogin">x</button><br>
                    <div id="loginnamegroup">
                        <label id="firstNameLabel" for="firstname" >FirstName</label><br>
                        <input id="firstname" class="loginInput" type="text" placeholder="FirstName"><br>
                        <label id="lastNameLabel" for="lastname" >LastName</label><br>
                        <input id="lastname" class="loginInput" type="text" placeholder="LastName"><br>
                    </div>

                    <div id="logininfogroup">
                        <label for="email" >Email</label><br>
                        <input id="email" class="loginInput" type="text" placeholder="Email"><br>
                        <label for="password" >Password</label><br>
                        <input id="password" class="loginInput" type="password" placeholder="Password"><br>
                    </div>
                    
                    <input type="submit" value="Login" id="loginOrSignupBtn"></input><br>
                    
                    <span id="signupSpan">
                        <span>or </span>
                        <a id="signupBtn">SignUp</a>
                    </span>
                </form>`

    document.getElementById("loginpopup").innerHTML = loginDiv;
}






function pushUserToDB(user){
    database.ref('/players/'+user.uid).update({
        player:user.email,
        online:true
    })
}

function updateUserToDBwithName(user){
    const firstname = user.displayName.split(" ")[0];
    const lastname = user.displayName.split(" ")[1];
    const userRef = database.ref('/players/'+user.uid)
    if (firstname){
        userRef.update({
            firstname:firstname
        });
    }else{
        userRef.update({
            firstname:"Unknown"
        });
    }
    if (lastname){
        userRef.update({
            lastname:lastname
        });
    }else{
        userRef.update({
            lastname:"Unknown"
        });
    }

    
    
    
    
}