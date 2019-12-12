 
import {renderHome} from "./renderHome.js";
import {renderLeague} from "./renderLeague.js";
import {renderTeam} from "./renderTeam.js";
import {renderMatchup} from "./renderMatchup.js";
import {renderProfile} from "./renderProfile.js";
import { makeUser } from "./makeUser.js";
import {renderPlayers} from "./renderPlayers.js";

export const makeCookie = function(cName,cValue) {
    document.cookie = cName + "=" + cValue;
};

export const getCookie = function(cName) {
    let name = cName +"=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export const deleteCookie = function(cName) {
    let expires = "expires = Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = cName + "=" + ";" + expires;
};

export const makeDiv = function(i,c,v) {
    let div = $("<div></div>").attr({
        id: i,
        class: c,
        value: v
    });
    return div;
};

export const makeButton = function(i, c, v) {
    let button  = $("<button></button>").attr({
        id: i,
        class: c,
        value: v
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
    let loginButton = makeButton("","button").append("LOG IN").attr({
        value: "loginRenderForm"
    }).css({
        "width": "70%",
        "border-radius": "1em",
        "margin": "2% 15%"
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
            "width": "70%",
            "border-radius": "1em",
            "margin": "2% 15%"
        }).attr({
            value: "login"
        }).append("LOG IN").on("click", handleLoginButton);
        let cancel = makeButton("", "button").css({
            "width": "70%",
            "border-radius": "1em",
            "margin": "2% 15%"
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
            makeCookie(data.name,data.jwt);
            $(event.target).closest("#navBar").replaceWith(makeNavUserBar(data.name));
        }).catch(data => {
            let error = makeDiv().append("Username and/or password is incorrect").css({
                "color": "white",
            });
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
            "width": "70%",
            "border-radius": "1em",
            "margin": "2% 15%"
        }).append("CANCEL").on("click", handleCancelButton);
        buttons.append(signup,cancel);
        
        formDiv.append(form, buttons);

        $(event.target).closest("#navButtons").replaceWith(formDiv);
    } else {
        //make ajax call
        //do something with data to access userstuff
        //then have navBar change to logined view
        //have page render profile form
        let user = $("#user")[0].value;
        let password = $("#pass")[0].value;
        makeUser(user, password);

        //have navBar show instruction after signing up
        //$("#navBar").replaceWith(makeNavUserBar(user));
        $("#content").replaceWith(renderProfile(user));
        //$("#navBar").empty();
    };
};

export const handleCancelButton = function(event) {
    event.preventDefault();
    let id = event.target.value;
    $(event.target).closest("#navBar").replaceWith(makeSideNavBar());
};

//this is when user is active
export const makeNavUserBar = function(user) {
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

    let homeButton = makeButton("","navButtons button", "home").append("HOME").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let lButton = makeButton(user,"navButtons button", "league").append("LEAGUE").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let tButton = makeButton(user,"navButtons button", "team").append("TEAM").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let mButton = makeButton(user,"navButtons button", "matchup").append("MATCHUP").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let playersButton = makeButton(user,"navButtons button", "players").append("PLAYERS").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let profileButton = makeButton(user,"navButtons button", "profile").append("PROFILE").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);
    let signoutButton = makeButton(user,"navButtons button", "signout").append("SIGN OUT").css({
        "width": "90%",
        "border-radius": "0.75em",
        "margin": "2% 5%"
    }).on("click", handleUserNavButton);

    let buttons = makeDiv().css({
        "margin": "30% 0%"
    });
    buttons.append(homeButton, lButton, tButton, mButton, playersButton, profileButton, signoutButton);

    navBar.append(buttons);

    return navBar;
};

export const handleUserNavButton = function(event) {
    event.preventDefault;
    let value = event.target.value;
    if (value == "home") {
        $("#content").replaceWith(renderHome());
    } else if (value == "league") {
        $("#content").replaceWith(renderLeague(event.target.id));
    } else if (value == "team") {
        $("#content").replaceWith(renderTeam(event.target.id));
    } else if (value == "matchup") {
        $("#content").replaceWith(renderMatchup(event.target.id));
    } else if (value == "players") {
        $("#content").replaceWith(renderPlayers(event.target.id));
    } else if (value == "profile") {
        $("#content").replaceWith(renderProfile(event.target.id));
    } else if (value == "signout") {
        deleteCookie(event.target.id);
        $("#content").replaceWith(renderHome());
        $("#navBar").replaceWith(makeSideNavBar());
    };
};


