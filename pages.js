 
import {renderHome} from "./renderHome.js";
import {renderLeague} from "./renderLeague.js";

export const makeDiv = function(i,c) {
    let div = $("<div></div>").attr({
        id: i,
        class: c
    }).css({
        "width": "100%"
    });
    return div;
};

export const makeButton = function(i, c, v) {
    let button  = $("<button></button>").attr({
        id: i,
        class: c,
        value: v
    }).css({
        "width": "100%"
    });
    return button;
};

//this is when their not login; 
export const makeSideNavBar = function() {
    let navBar = makeDiv("navBar").css({
        "height": "100%",
        "position": "fixed",
        "z-index": "1",
        "top": "0",
        "right": "0",
        "overflow-x": "hidden",
        "width": "15%",
        "font-family": "fantasy",
        "background-color": "#05386b"
    });

    let logo = makeDiv().css({
        "color": "white",
        "font-size": "2em",
        "margin": "2em 0"
    });
    let line1 = makeDiv();
    let l1 = $("<h1>ACC</h1>");
    let line2 = makeDiv();
    let l2 = $("<h1>FANTASY</h1>")
    let line3 = makeDiv()
    let l3 = $("<h1>FOOTBALL</h1>");
    line1.append(l1);
    line2.append(l2);
    line3.append(l3);
    logo.append(line1,line2,line3);

    let buttons = makeDiv("navButtons");
    let loginButton = makeButton("","button").append("LOGIN").attr({
        value: "loginRenderForm"
    }).css({
        "width": "50%",
        "border-radius": "1em",
        "margin": "2% 25%"
    }).on("click", handleLoginButton);
    let signButton = makeButton("","button").attr({
        value: "signuprenderForm"
    }).append("SIGN UP").css({
        "width": "70%",
        "border-radius": "1em",
        "margin": "2% 15%"
    }).on("click", handleSignButton);
    buttons.append(loginButton, signButton);

    let contactBox = makeDiv().css({
        "color": "white",
    });
    let david = makeDiv().append("David Cubrilla");
    let timmy = makeDiv().append("Timmy Wilmot");
    contactBox.append(david, timmy);

    navBar.append(logo, buttons);
    return navBar;
};

export const handleLoginButton = async function(event) {
    event.preventDefault();
    let id = event.target.value;

    if (id == "loginRenderForm") {
        let formDiv = makeDiv("", "loginF");

        let form = $("<form></form>").attr({
            id: "loginForm"
        });
        let user = $("<input></input").css({
            "border-radius": "1em",
            "width": "100%",
            "margin": "2% 0",
            "padding": ".5em"
        }).attr({
            id: "user",
            placeHolder: "Username"
        });
        let pass = $("<input></input>").css({
            "border-radius": "1em",
            "width": "100%",
            "margin": "2% 0",
            "padding": ".5em"
        }).attr({
            id: "pass",
            placeHolder: "Password"
        });
        form.append(user, pass);

        let buttons = makeDiv();
        let login  = makeButton("", "button").css({
            "width": "50%",
            "border-radius": "1em",
            "margin": "2% 25%"
        }).attr({
            value: "login"
        }).append("LOGIN").on("click", handleLoginButton);
        let cancel = makeButton("", "button").css({
            "width": "60%",
            "border-radius": "1em",
            "margin": "2% 20%"
        }).append("CANCEL").on("click", handleCancelButton);
        buttons.append(login,cancel);
        
        formDiv.append(form, buttons);

        $(event.target).closest("#navButtons").replaceWith(formDiv);
    } else {
        //make ajax call
        //do something with data to access userstuff
        //then have navBar change to logined view
        let user = $("#user")[0].value;
        let password = $("#pass")[0].value;
        await $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/account/login',
            data: {
                name: user,
                pass: password,
            }
        }).then(data => {
            $(event.target).closest("#navBar").replaceWith(makeNavUserBar());
        }).catch(data => {
            let error = makeDiv().append("Username and/or password is incorrect");
            $(".loginF").append(error);
        });
    };
};

export const handleSignButton = async function(event) {
    event.preventDefault();
    let id = event.target.value;

    if (id == "signuprenderForm") {
        let formDiv = makeDiv("", "signupF");

        let form = $("<form></form>").attr({
            id: "signupForm"
        });
        let user = $("<input></input").css({
            "border-radius": "1em",
            "width": "100%",
            "margin": "2% 0",
            "padding": ".5em"
        }).attr({
            id: "user",
            placeHolder: "Username"
        });
        let pass = $("<input></input>").css({
            "border-radius": "1em",
            "width": "100%",
            "margin": "2% 0",
            "padding": ".5em"
        }).attr({
            id: "pass",
            placeHolder: "Password"
        });
        form.append(user, pass);

        let buttons = makeDiv();
        let signup  = makeButton("", "button").css({
            "width": "70%",
            "border-radius": "1em",
            "margin": "2% 15%"
        }).attr({
            value: "signup"
        }).append("SIGN UP").on("click", handleSignButton);
        let cancel = makeButton("", "button").css({
            "width": "60%",
            "border-radius": "1em",
            "margin": "2% 20%"
        }).append("CANCEL").on("click", handleCancelButton);
        buttons.append(signup,cancel);
        
        formDiv.append(form, buttons);

        $(event.target).closest("#navButtons").replaceWith(formDiv);
    } else {
        //make ajax call
        //do something with data to access userstuff
        //then have navBar change to logined view
        let user = $("#user")[0].value;
        let password = $("#pass")[0].value;
        await $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/account/create',
            data: {
                name: user,
                pass: password,
            }
        }).then(data => {
            console.log(data);
        }).catch(data => {
            let error = makeDiv("Username already exist");
            $(".signupF").append(error);
        });
    };
};

export const handleCancelButton = function(event) {
    event.preventDefault();
    let id = event.target.value;
    $(event.target).closest("#navBar").replaceWith(makeSideNavBar());
};

//this is when user is active
export const makeNavUserBar = function(event) {
    let navBar = makeDiv("navBar").css({
        "height": "100%",
        "position": "fixed",
        "z-index": "1",
        "top": "0",
        "right": "0",
        "overflow-x": "hidden",
        "width": "15%",
        "font-family": "fantasy"
    });

    let homeButton = makeButton("","navButtons button", "home").append("HOME").css({
        "margin": "2%"
    });
    let lButton = makeButton("","navButtons button", "league").append("LEAGUE").css({
        "margin": "2%"
    }).on("click", handleUserNavButton);
    let tButton = makeButton("","navButtons button", "team").append("TEAMS").css({
        "margin": "2%"
    });
    let mButton = makeButton("","navButtons button", "matchup").append("MATCHUPS").css({
        "margin": "2%"
    });
    let playersButton = makeButton("","navButtons button", "players").append("PLAYERS").css({
        "margin": "2%"
    });
    let profileButton = makeButton("","navButtons button", "profile").append("PROFILE").css({
        "margin": "2%"
    });
    let signoutButton = makeButton("","navButtons button", "signout").append("SIGN OUT").css({
        "margin": "2%"
    });

    let buttons = makeDiv();
    buttons.append(homeButton, lButton, tButton, mButton, playersButton, profileButton, signoutButton);

    navBar.append(buttons);

    return navBar;
};

export const handleUserNavButton = function(event) {
    event.preventDefault;
    let id = event.target.value;
    if (id == "home") {

    } else if (id == "home") {

    } else if (id == "league") {
        $("#root").append(renderLeague());
    } else if (id == "team") {

    } else if (id == "matchup") {

    } else if (id == "players") {

    } else if (id == "profies") {

    } else if (id == "signout") {

    };
};

// import {renderLeague} from "./renderLeague";
// import {renderTeam} from "./renderTeam";
// import {renderMatchup} from "./renderMatchup";
// import {renderPlayers} from "./renderPlayers";

