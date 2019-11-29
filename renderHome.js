import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";

export const makeCoastal = function() {
    
    let panel = makeDiv("coastal").css({
        "margin-top": "20%"
    });

    let title = $("<h1>COASTAL</h1>").css({
        "border-color": "white",
        "border-radius": ".5em",
        "background-color": "white",
        "font-size": "1.5em", 
        "width": "80%",
        "margin": "1% 10%",
        "text-align": "center"
    });
    let coast = makeDiv().append(title);
   
    let categories = makeDiv();

    let rank = makeDiv().append("Rank").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let team = makeDiv().append("Teams").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let record = makeDiv().append("Record").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });

    categories.append(rank, team, record);

    panel.append(coast,categories);
    
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/public/teams"
    }).then(data => {
        let teams = makeTeams("COASTAL",data.result);
        for (let i = 0; i < teams.length; i++) {
            panel.append(makeTeamResult(teams[i], i));
        };
    });
    return panel;
};

export const makeAtlantic = function() {
    let panel = makeDiv("atlantic").css({
        "margin-top": "10%"
    });

    let title = $("<h1>ATLANTIC</h1>").css({
        "border-color": "white",
        "border-radius": ".5em",
        "background-color": "white",
        "font-size": "1.5em", 
        "width": "80%",
        "margin": "1% 10%",
        "text-align": "center"
    });;
    let coast = makeDiv().append(title);
   
    let categories = makeDiv();

    let rank = makeDiv().append("Rank").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let team = makeDiv().append("Teams").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let record = makeDiv().append("Record").css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });

    categories.append(rank, team, record);

    panel.append(coast,categories);
    
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/public/teams"
    }).then(data => {
        let teams = makeTeams("ATLANTIC",data.result);
        for (let i = 0; i < teams.length; i++) {
            panel.append(makeTeamResult(teams[i], i));
        };
    });
    return panel;
};

export const makeTeams = function(division, teams) {
    let cTeams = [];
    for(let key in teams) {
        let team = teams[key];
        if (team.division == division) {
            let w = 0;
            let l = 0;
            let s = team.schedule;
            for (let i = 1; i < 15; i++) {
                if (s[i].thisScore > s[i].oppScore) {
                    w++;
                } else {
                    l++;
                };
                team.winPercent = w/ (w+l)
            };
            cTeams.push(team);
        }; 
    };
    cTeams.sort((a, b) => (a.winPercent < b.winPercent) ? 1: -1);
    return cTeams;
};

export const makeTeamResult = function(team, rank) {
    let teamDiv = makeDiv();
    let ranks = makeDiv().append(rank+1).css({
        "font-size": ".75em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let teamName = makeDiv().append(team.teamCity).css({
        "font-size": "1em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });
    let wins = 0;
    let losses = 0;
    let s = team.schedule;
    for (let i = 1; i < 15; i++) {
        if (s[i].thisScore > s[i].oppScore) {
            wins++;
        } else if (s[i].thisScore < s[i].oppScore) {
            losses++;
        };
    };
    let record = wins + " - " + losses;
    let recordDiv = makeDiv().append(record).css({
        "font-size": "0.75em",
        "display": "inline-block",
        "width": "32%",
        "text-align": "center"
    });;
   
    teamDiv.append(ranks, teamName, recordDiv);
    return teamDiv;
};

export const makeACCStanding = function() {
    let div1 = makeDiv();

    let coastal = makeCoastal();
    let atlantic = makeAtlantic();

    div1.append(coastal, atlantic);
    return div1;
};

//everything above this line is for the first div in the right


export const makeTeamsSection = function(week) {
    let div2 = makeDiv();
    let cardsSection = makeDiv("cards");

    for (let i = 0; i < 7; i++) {
        let id = "row" + i;
        let row = makeDiv(id, "columns").css({
            "width": "90%",
            "margin": "2% 0 0 10%"
        });
        cardsSection.append(row);
    };

    $.ajax({
        method: "GET",
        url: "http://localhost:3000/public/teams"
    }).then(data => {
        let teams = data.result;
        let count = 0;
        let rowCount = 0;
        for (let key in teams) {
            let team = teams[key];
            let teamCard = makeTeamCard(team, week);
            if (count == 2) {
                rowCount++;
                count = 0;
            }; 
            let row = "#row" + rowCount;
            $(row).append(teamCard);
            count++;
        };
    });

    div2.append(cardsSection);
    return div2;
};

export const makeTeamCard = function(team, week) {

    let wk = "";
    for (let key in team.schedule) {
        if (key == week) {
            wk = team.schedule[key];
        };
    };

    let teamCard = makeDiv().css({
        "border-color": "#e8e8e8",
        "background-color": "#e8e8e8",
        "border-radius": ".3em",
        "width": "42.5%",
        "margin": "0 10% 0 0"
    });

    let result = makeDiv();
    let w = makeDiv();
    let score = makeDiv();

    let teamName = makeDiv().append(team.teamCity + " " + team.teamName);
    let image = $("<img>").attr({
        src: team.pic
    });

    let teamP = $("<figure></figure>").append(image).attr({
        class: "image"
    }).css({
        "width": "30%",
        "border-radius": "1em",
        "border-color": "black",
        "border-style": "solid"
    });
    let teamPic = makeDiv().append(teamP);
    
    let opp = makeDiv().css({
        "width": "50%",
        "float": "right",
    });

    let buttomSection = makeDiv();
    let what = makeDiv().css({
        "width": "50%",
        "float": "left"
    });

    if (wk.thisScore > wk.oppScore) {
        w.append("W").css({
            "width" : "50%",
            "float": "left",
            "color": "green"
        });
        score.append(wk.thisScore + " - " + wk.oppScore).css({
            "width" : "50%",
            "float": "right"
        });
        result.append(w,score);

        opp.append(wk.opponent);
        if (wk.home == "true") {
            what.append("v.s");
        } else {
            what.append("@");
        };
        buttomSection.append(what, opp);
        teamCard.append(teamName, teamPic, buttomSection, result);
    } else if (wk.opponent == "BYE") {
        w.append("BYE");
        result.append(w);
        teamCard.append(teamName, teamPic, result);
    } else if (wk.thisScore == null) {
        w.append("TBD");
        result.append(w);

        opp.append(wk.opponent);
        if (wk.home == "true") {
            what.append("v.s");
        } else {
            what.append("@");
        };

        buttomSection.append(what, opp);
        teamCard.append(teamName, teamPic, buttomSection, result);
    } else if (wk.thisScore < wk.oppScore) {
        w.append("L").css({
            "width" : "50%",
            "float": "left",
            "color": "red"
        });
        score.append(wk.thisScore + " - " + wk.oppScore).css({
            "width" : "50%",
            "float": "right"
        });
        result.append(w,score);

        opp.append(wk.opponent);
        if (wk.home == "true") {
            what.append("v.s");
        } else {
            what.append("@");
        };
        buttomSection.append(what, opp);
        teamCard.append(teamName, teamPic, buttomSection, result);
    };

    return teamCard;
};

export const weekForm = function(week) {
    let panel = makeDiv("","select is-rounded weekForm").attr({
        id : "selectWeek"
    }).css({
        "width": "14%",
        "margin": "0 45%"
    });
    let select = $('<select></select>').change(handleWeekChange);
    for (let i = 1; i < 15; i++) {
        if (i == week) {
            select.append($('<option selected="selected"></option').append("Week " + i));
        } else {
            select.append($('<option></option').append("Week " + i));
        };
    };
    panel.append(select);
    return panel;
};

export const handleWeekChange = function(event) {
    event.preventDefault();
    let weekNum = $(event.target)[0].value.substr(5,6);
    $("#selectWeek").replaceWith(weekForm(weekNum));
    $('#cards').replaceWith(makeTeamsSection(weekNum));
};

export const renderHome = function() {
    let home = makeDiv("content").css({
        "color": "black",
        "width": "85%"
    });

    let buttonSection = makeDiv().append(weekForm(1));
    let div1 = makeACCStanding().css({
        "display": "inline-block",
        "float": "left",
        "width": "25%",
        "background-color": "#e8e8e8",
        "height": "100%",
        "position": "fixed",
        "z-index": "1",
        "top": "0",
        "left": "0",
        "overflow-x": "hidden",
    });
    let div2 = makeTeamsSection(1).prepend(buttonSection).css({
        "display": "inline-block",
        "margin": "0 0 0 30%",
        "float": "right",
        "width": "70%",
        "background-color": "#ffffff"
    }).attr({
        id: "teamsSection"
    });
    home.append(div1, div2);
    return home;
};
