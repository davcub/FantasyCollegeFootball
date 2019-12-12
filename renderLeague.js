import {getCookie} from "./pages.js";
import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";

import {addUsertoLeague} from "./makeUser.js";

import {makeLeague} from "./makePrivate2.js";
import {joinALeague} from "./makePrivate2.js";

import {renderTeam} from "./renderTeam.js";

 
export const makeLeagueButtonSection = function(user) {
    let buttonSection = makeDiv("buttonSection");
    let make = makeButton(user,"leagueButton button", "renderMakeLeagueForm").css({
        "width": "50%",
        "border-radius": "0.75em",
        "margin-top": "50px"
    }).append("Create a league").on("click", handleLeagueButton);
   
    buttonSection.append(make);
    return buttonSection;
};

export const handleLeagueButton = function(event) {
    event.preventDefault();
    let value = event.target.value;
    let user = event.target.id;
    let token = "Bearer " + getCookie(user);
    if (value == "renderJoinLeagueForm") {
        $("#buttonSection").replaceWith(renderLeagueForm(user, value));
    } else if (value == "renderMakeLeagueForm") {
        $("#buttonSection").replaceWith(renderLeagueForm(user, value));
    } else if (value == "join") {
        let leagueName = $("#leagueName")[0].value;
        joinALeague(user, token, leagueName);
        addUsertoLeague(token, leagueName);
        $("#leagueForm").replaceWith(renderLeague(user));
    } else if (value == "make") {
        let leagueName = $("#leagueName")[0].value;
        makeLeague(user, token, leagueName);
        addUsertoLeague(token, leagueName);
        $("#content").replaceWith(renderTeam(user));
    } else if (value == "cancel") {
        let buttonSection = makeLeagueButtonSection(user).css({
            "background-color": "#e8e8e8",
            "width": "50%",
            "height": "150px",
            "margin": "20% 25%",
            "border-radius": "0.75em",
            "text-align": "center",
        });
        $("#leagueForm").replaceWith(buttonSection);
    };
};

export const makeLeagueForm = function(user, value, onButton) {
    let leagueForm = makeDiv("leagueForm").css({
        "background-color": "#e8e8e8",
        "width": "50%",
        "height": "150px",
        "margin": "20% 25%",
        "border-radius": "0.75em",
        "text-align": "center",
    });
    let buttons = makeDiv();
    let form = $("<form></form>");
    let leagueName = $("<input></input").css({
        "border-radius": "1em",
        "width": "80%",
        "margin": "2% 10%",
        "padding": ".5em"
    }).attr({
        id: "leagueName",
        placeHolder: "League Name"
    });
    form.append(leagueName);
    let button = makeButton(user, "formButton button", value).css({
        "width": "50%",
        "border-radius": "0.75em",
        "margin-top": "2%"
    }).append(onButton).on("click", handleLeagueButton);
    let cancel = makeButton(user, "formButton button", "cancel").css({
        "width": "50%",
        "border-radius": "0.75em",
        "margin-top": "2%"
    }).append("Cancel").on("click", handleLeagueButton);
    buttons.append(button, cancel);
    leagueForm.append(form, buttons);
    return leagueForm;
};

export const renderLeagueForm = function(user, value) {
    let leagueForm = "";
    if (value == "renderJoinLeagueForm") {
        leagueForm = makeLeagueForm(user, "join", "Join");
    } else if (value == "renderMakeLeagueForm") {
        leagueForm = makeLeagueForm(user, "make", "Make");
    };

    return leagueForm;
};

export const makeStanding = function(user, league) {
    let token = "Bearer " + getCookie(user);
    let panel = makeDiv();

    axios({
        method: 'get',
        url: "http://localhost:3000/private/leagues/" + league,
        headers: {
            Authorization: token
        }
    }).then(data => {
        //look at each user and find their record, pts for and pts against
        let board = makeLeaderBoard(data.data.result);
        panel.append(board);
    });
    
    return panel;
};

export const makeLeaderBoard = function(teams) {
    let board = makeDiv("table");
    let header = makeDiv();
    let rank = makeDiv("", "leagueHeaders").append("Rank");
    let team = makeDiv("", "leagueHeaders").append("Teams");
    let winLose = makeDiv("", "leagueHeaders").append("Record");
    let pointsFor = makeDiv("", "leagueHeaders").append("Pts For");
    let pointsAgainst = makeDiv("", "leagueHeaders").append("Pts Against");
    header.append(rank, team, winLose, pointsFor, pointsAgainst);

    let table = makeDiv();
    // let allTeams = [];
    // for (let key in teams) {
    //     allTeams.push(teams[key]);
    //     //let row =  makeTableRow(teams[key].points);
    //     //table.append(row);
    // };
    board.append(header, makeTableRows(teams));
    return board;
};

export const makeTableRows = function(teams) {
    let row = makeDiv();
    let allTeams = teams.users;
    let schedule = teams.schedule;
    let mainTeams = [];
    for (let key in allTeams) {
        let player = allTeams[key];
        let opp;
        let wins = 0;
        let losses = 0;
        let ptsFor = 0;
        let ptsAg = 0;
        for (let i = 1; i < 15; i++) {
            for (let j = 0; j < 4; j++) {
                if (schedule[i-1][j][0] == key) {
                    opp = schedule[i-1][j][1];
                } else if (schedule[i-1][j][1] == key) {
                    opp = schedule[i-1][j][0];
                }
            }
            opp = allTeams[opp];
            ptsFor += player.points[i];
            ptsAg += opp.points[i];
            if (opp.points[i] > player.points[i]) {
                losses++;
            } else {
                wins++;
            }
        }
        ptsAg = Math.round(ptsAg * 100) / 100.0;
        ptsFor = Math.round(ptsFor * 100) / 100.0;
        allTeams[key].ptsFor = ptsFor;
        allTeams[key].ptsAg = ptsAg;
        allTeams[key].wins = wins;
        allTeams[key].losses = losses;
        allTeams[key].name = key;
        mainTeams.push(allTeams[key]);
    }
    mainTeams.sort((a, b) => (a.wins < b.wins) ? 1 : -1);
    for (let i = 0; i < mainTeams.length; i++) {
        row.append(makeTeam(mainTeams[i], i+1));
    }
    return row;
};

export const makeTeam = function(team, rank) {
    let panel = makeDiv("", "leagueTeamCard");
    let rankDiv = makeDiv("", "leagueHeaders").append(rank);
    let nameDiv = makeDiv("", "leagueHeaders").append(team.name);
    let winLossDiv = makeDiv("", "leagueHeaders").append(team.wins + "-" + team.losses);
    let points = team.ptsFor;
    points = points.toString();
    if (points.indexOf(".") != -1) {
        let strEnd = points.split('.').pop();
        let strBeg = points.split('.').shift();
        while (strEnd.length < 2) {
            strEnd += "0";    
        }
        points = strBeg + "." + strEnd;
    } else {
        points += ".00";
    }
    let ptsForDiv = makeDiv("", "leagueHeaders").append(points);
    points = team.ptsAg;
    points = points.toString();
    if (points.indexOf(".") != -1) {
        let strEnd = points.split('.').pop();
        let strBeg = points.split('.').shift();
        while (strEnd.length < 2) {
            strEnd += "0";    
        }
        points = strBeg + "." + strEnd;
    } else {
        points += ".00";
    }
    let ptsAgDiv = makeDiv("", "leagueHeaders").append(points);
    if (rank%2 == 1) {
        panel.addClass("odd");
    } else {
        panel.addClass("even");
    }
    panel.append(rankDiv, nameDiv, winLossDiv, ptsForDiv, ptsAgDiv);
    return panel;
}

export const makeLeagueMatchup = function() {

};

export const renderLeague = function(user) {
    let league = makeDiv("content");

    let token = "Bearer " + getCookie(user);
    axios({
        method: "get",
        url: "http://localhost:3000/user/stuff",
        headers: {
            Authorization: token
        }
    }).then(data => {
        let u = data.data.result;
        if (u.inLeague) {
            //show their leagues status
            let standings = makeStanding(user, Object.values(u.leagueName)[0]);
            league.append(standings);
        } else {
            //just have the buttonSection
            let buttonSection = makeLeagueButtonSection(user).css({
                "background-color": "#e8e8e8",
                "width": "50%",
                "height": "150px",
                "margin": "20% 25%",
                "border-radius": "0.75em",
                "text-align": "center",
            });
            league.append(buttonSection);
        }
    });
    return league;
};