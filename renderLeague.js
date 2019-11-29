import {getCookie} from "./pages.js";
import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";
import {addLeague} from "./makePrivate.js";
import {addUsertoLeague} from "./makeUser.js";
import {getRandomPlayers} from "./makeUser.js";

export const makeButtonSection = function(user) {
    let buttonSection = makeDiv("buttonSection");
    let join = makeButton(user,"leagueButton", "renderJoinLeagueForm").append("Join a league").on("click", handleLeagueButton);
    let make = makeButton(user,"leagueButton", "renderMakeLeagueForm").append("Create a league").on("click", handleLeagueButton);
    buttonSection.append(join, make);
    return buttonSection;
};

export const handleLeagueButton = function(event) {
    event.preventDefault;
    let value = event.target.value;
    let user = event.target.id;
    if (value == "renderJoinLeagueForm") {
        $("#buttonSection").replaceWith(renderLeagueForm(user, value));
    } else if (value == "renderMakeLeagueForm") {
        $("#buttonSection").replaceWith(renderLeagueForm(user, value));
    } else if (value == "join") {
        let leagueName = $("#leagueName")[0].value;
        beInLeague(user, leagueName);
        $("#leagueForm").replaceWith(renderLeaveLeagueForm(user));
    } else if (value == "make") {
        let leagueName = $("#leagueName")[0].value;
        beInLeague(user, leagueName);
        $("#leagueForm").replaceWith(renderLeaveLeagueForm(user));
    } else if (value == "cancel") {
        $("#leagueForm").replaceWith(makeButtonSection(user));
    };
};

export const beInLeague = function(user, leagueName) {
    let token = "Bearer " + getCookie(user);
    //puts league info in private json
    addLeague(token, user, leagueName);
    //puts league info in user json
    addUsertoLeague(token, leagueName);
    //give user random players
    getRandomPlayers(user, token);
};

export const renderLeagueForm = function(user, value) {
    let leagueForm = makeDiv("leagueForm");
    let buttons = makeDiv();
    if (value == "renderJoinLeagueForm") {
        let form = $("<form></form>");
        let leagueName = $("<input></input").attr({
            id: "leagueName",
            placeHolder: "League Name"
        });
        form.append(leagueName);
        let join = makeButton(user, "formButton", "join").append("Join").on("click", handleLeagueButton);
        buttons.append(join);

        leagueForm.append(form, buttons);
    } else if (value == "renderMakeLeagueForm") {
        let form = $("<form></form>");
        let leagueName = $("<input></input").attr({
            id: "leagueName",
            placeHolder: "League Name"
        });
        form.append(leagueName);
        let make = makeButton(user, "formButton", "make").append("Create").on("click", handleLeagueButton);
        buttons.append(make);

        leagueForm.append(form, buttons);
    };

    let cancel = makeButton(user, "formButton", "cancel").append("cancel");
    buttons.append(cancel);

    return leagueForm;
};

export const renderLeaveLeagueForm = function(user, value) {
    let leaveLeagueForm = makeDiv();
    let leave = makeButton().append("Leave your League");
    leaveLeagueForm.append(leave);
    return leaveLeagueForm;
};


export const makeStanding = function() {

};
export const makeMatchup = function() {

};
export const makeTransaction = function() {

};

export const renderLeague = function(user) {
    let league = makeDiv("content");

    let token = "Bearer " + getCookie(user);
    axios({
        method: "get",
        url: "http://localhost:3000/user/stuff",
        headers: {
            "Authorization":  token
            }
    }).then(data => {
        let u = data.data.result;
        if (u.inLeague) {
            let leaveLeagueForm = renderLeaveLeagueForm(user);
            league.append(leaveLeagueForm);
        } else {
            let buttonSection = makeButtonSection(user);
            league.append(buttonSection);
        };
        //get league info and do whatever
        league.append(u.league);
    });

    return league;
};
