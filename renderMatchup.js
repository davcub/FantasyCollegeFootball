import {getCookie} from "./pages.js";
import {makeDiv} from "./pages.js";


let u = "";
let l = "";
export const renderMatchup = function(user) {
    let content = makeDiv("content");
    u = user;
    let token = "Bearer " + getCookie(user);
    axios({
        method: "get",
        url: "http://localhost:3000/user/stuff/leagueName/",
        headers: {
            "Authorization":  token
            }
    }).then(data => {
        l = data.data.result[0];   
        let week = 14;
        let panel = makeDiv("week", "field");
        panel.addClass("select");
        panel.addClass("is-rounded");
        let select = $('<select></select>').change(handleWeekChange);
        for (let i = 1; i < 15; i++) {
            if (i == week) {
                select.append($('<option selected="selected"></option').append("Week " + i));
            } else {
                select.append($('<option></option>').append("Week " + i));
            };
        };
        panel.append(select);
        let matchup = makeDiv("matchup");
        axios({
            method: 'get',
            url: "http://localhost:3000/private/leagues/" + l,
            headers: {
                Authorization: token
            }
        }).then(data => {
            let userRoster = data.data.result.users[u].roster;
            let schedule = data.data.result.schedule[week-1];
            let opp = "";
            for (let i = 0; i < schedule.length; i++) {
                if(schedule[i][0] == u) {
                    opp = schedule[i][1];
                } else if(schedule[i][1] == u) {
                    opp = schedule[i][0];
                };
            };
            let oppRoster = data.data.result.users[opp].roster;
            axios({
                method: 'get',
                url: "http://localhost:3000/public/players",
            }).then(data => {
                let matchupPanel = makeDiv("", "matchupPage");
                let uTeam = makeTeamDiv(data.data.result, userRoster, week, u);
                let oTeam = makeTeamDiv(data.data.result, oppRoster, week, opp);
                matchupPanel.append(uTeam, oTeam);
                matchup.append(matchupPanel);
            });
        });
        content.append(panel, matchup);
    });
    return content;
};

export const makeMatchupTab = function(week) {
    let panel = makeDiv("matchupTab");
    let select = $('<select></select>').change(handleWeekChange);
    for (let i = 1; i < 15; i++) {
        if (i == week) {
            select.append($('<option selected="selected"></option').append("Week " + i));
        } else {
            select.append($('<option></option>').append("Week " + i));
        };
    };
    panel.append(select);
    return panel;
}

export const handleWeekChange = function(event) {
    event.preventDefault();
    let weekNum = $(event.target)[0].value.substr(5,6);
    let token = "Bearer " + getCookie(u);
    axios({
        method: 'get',
        url: "http://localhost:3000/private/leagues/" + l,
        headers: {
            Authorization: token
        }
    }).then(data => {
        let userRoster = data.data.result.users[u].roster;
        let schedule = data.data.result.schedule[weekNum-1];
        let opp = "";
        for (let i = 0; i < schedule.length; i++) {
            if(schedule[i][0] == u) {
                opp = schedule[i][1];
            } else if(schedule[i][1] == u) {
                opp = schedule[i][0];
            };
        };
        let oppRoster = data.data.result.users[opp].roster;
        axios({
            method: 'get',
            url: "http://localhost:3000/public/players",
        }).then(data => {
            let panel = makeDiv("", "matchupPage");
            let uTeam = makeTeamDiv(data.data.result, userRoster, weekNum, u);
            let oTeam = makeTeamDiv(data.data.result, oppRoster, weekNum, opp);
            panel.append(uTeam, oTeam);
            $('#matchup').empty();
            $('#matchup').append(panel);
        });
    });
    //user's player's stats
    //opponent's player's stat
}

export const makeTeamDiv = function(players, roster, week, player) {
    let team = makeDiv("", "matchupTeamCard");
    let starters = makeDiv("", "matchupHeader").append("Starters:");
    let bench = makeDiv("", "matchupHeader").append("Bench:");
    let total = 0;
    for (let key in roster) {
        if (key != "Bench") {
            let player = players[roster[key]];
            if (player != undefined) {
                let points = player.statsPerWeek[week].points;
                if (points != undefined) {
                    total += points;
                }
                let name = player.first + " " + player.last;
                let position = player.position;
                starters.append(makeCard(position, name, points).addClass("even"));
            } else {
                starters.append(makeCard(key, "Empty", 0).addClass("even"));
            }
        } else {
            for (let i = 0; i < roster[key].length; i++) {
                let player = players[roster[key][i]];
                let points = player.statsPerWeek[week].points;
                let name = player.first + " " + player.last;
                let position = player.position;
                bench.append(makeCard(position, name, points).addClass("odd"));
            }
        }
    }
    total = Math.round(total*100) / 100.0;
    team.append(makeDiv("", "summary").append(player + " - " + total + " pts"));
    team.append(starters, bench);
    return team;
}

export const makeCard = function(pos, name, points) {
    let panel = makeDiv("", "matchupPlayerCard");
    let nameDiv = makeDiv("", "matchupPlayerCardName").append(name + " - " + pos);
    let pointsDiv = makeDiv("", "matchupPlayerCardPoints");
    if (points == undefined || points == 0) {
        pointsDiv.append("0.00");
    } else {
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
        pointsDiv.append(points);
    }
    panel.append(nameDiv, pointsDiv);
    return panel;
}