import {getCookie} from "./pages.js";
import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";
import {renderLeague} from "./renderLeague.js";

let user = "";
let league = "";
let mainQueue = [];
let mainTeams = {};
let mainPlayers = [];

export const makeTeamButtonSection = function(user) {
    let buttonSection = makeDiv("buttonSection");
    let draft = makeButton(user, "draftNowButton button", "renderDraftBoard").append("Draft Now").css({
        "width": "50%",
        "border-radius": "0.75em",
        "margin-top": "50px"
    }).on("click", handleTeamButton);
    buttonSection.append(draft);
    return buttonSection;
};

export const handleTeamButton = function(event) {
    event.preventDefault();
    $('#content').empty();
    let value = event.target.value;
    let u = event.target.id;
    let token = "Bearer " + getCookie(u);
    user = u;
    if (value == "renderDraftBoard") {
        axios({
            method: "get",
            url: "http://localhost:3000/user/stuff/leagueName/",
            headers: {
                Authorization: token
            }
        }).then(data => {
            //render draft board
            league = data.data.result[0];
            loadDraftPage();
        });
    };

};
 
export const renderTeam = function(user) {
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
            if (u.hasTeam) {
                //if has a team then show team status
                getUserTeam(user);
            } else {
                //show draft now button
                let buttonSection = makeTeamButtonSection(user).css({
                    "background-color": "#e8e8e8",
                    "width": "50%",
                    "height": "150px",
                    "margin": "20% 25%",
                    "border-radius": "0.75em",
                    "text-align": "center",
                });
                league.append(buttonSection);
            };
        } else {
            //if not in league
            renderLeague(user);
        };
    });
    return league;
};
  
export const getUserTeam = function(u) {
    let token = "Bearer " + getCookie(u);
    user = u;
    axios({
        method: 'get',
        url: "http://localhost:3000/user/stuff/leagueName/",
        headers: {
            "Authorization": token
        }
    }).then(data => {
        league = data.data.result[0];
        axios({
            method: 'get',
            url: 'http://localhost:3000/private/leagues/' + league + '/users/' + user + '/roster',
            headers: {
                Authorization: token
            }
        }).then(data => {
            $('#content').append(makeDiv("teamHeader").append("My Team"));
            makeUserTeam(data.data.result);
        });
    });
}

export const makeUserTeam = function(team) {
    axios({
        method: 'get',
        url: "http://localhost:3000/public/players"
    }).then(data => {
        let result = data.data.result;
        let panel = makeDiv("draftTeam");
        panel.append(makePlayerTeamCard(result[team["QB"]], "QB"), makePlayerTeamCard(result[team["RB"]], "RB"), makePlayerTeamCard(result[team["WR"]], "WR"), makePlayerTeamCard(result[team["TE"]], "TE"));
        let bench = team["Bench"];
        for (let i = 0; i < bench.length; i++) {
            panel.append(makePlayerTeamCard(result[bench[i]], "Bench"));
        }
        $('#content').append(panel);
    });
    
}

export const makePlayerTeamCard = function(player, position) {
    let playerCard = makeDiv("", "teamPlayerCard");
    let positionDiv = makeDiv("", "teamPlayerCardG");
    let nameDiv = makeDiv("", "teamPlayerCardG");
    let schoolDiv = makeDiv("", "teamPlayerCardG");
    if (player != undefined) {
        positionDiv.append(position);
        nameDiv.append(player.first + " " + player.last);
        schoolDiv.append(player.team);

    } else {
        positionDiv.append(position);
        nameDiv.append("Empty");
        schoolDiv.append("N/A");
    }
    playerCard.append(positionDiv, nameDiv, schoolDiv);
    return playerCard;
}

export const makeTeam = function() {
    let a = {
        roster: {
            QB: "",
            RB: "",
            WR: "",
            TE: "",
            Bench: []
        }
    }
    return a;
}

let timer;

export const makeTimer = function() {
    let panel = makeDiv("timer");
    
    let counter = $('<div id="counter"></div>').text("Time Remaining: 1:00").css({
        "width": "30%",
        "font-size": "200%",
        "display": "inline-block",
        "margin-left": "35%"
    });

    let count = 59;

    //update display

    timer = setTimeout(update, 1000);
    //this allows for 'clearTimeout' if needed

    function update() {
        if (count > 0 && count < 10) {
            $("#counter").text("Time Remaining: 0:0"+count--).css({
                "color": "red",
            });
            timer = setTimeout(update, 1000);
        } else if (count >= 10) {
            $("#counter").text("Time Remaining:  0:"+count--);
            timer = setTimeout(update, 1000);
        } else {
            autoDraft(user);
            clearTimeout(timer);
            $("#timer").remove();
            mainQueue.shift();
            loadAutoDraftManager();
        }
    }
    panel.append(counter);
    return panel;
}

export const autoDraft = function(team) {
    let current = 0;
    while (true) {
        let position = mainPlayers[current][1].position;
        if (mainTeams[team].roster[position] == "") {
            draft(team, mainPlayers[current]);
            break;
        } else if (mainTeams[team].roster["QB"] != "" && mainTeams[team].roster["RB"] != "" && mainTeams[team].roster["WR"] != "" && mainTeams[team].roster["TE"] != "") {
            draft(team, mainPlayers[current]);
            break;
        }
        current++;
    }
}

export const draft = function(team, player) {
    let position = player[1].position;
    if (mainTeams[team].roster[position] != "") {
        mainTeams[team].roster["Bench"].push(player[0]);
    } else {
        mainTeams[team].roster[position] = player[0];
    }
    let index = mainPlayers.indexOf(player);
    mainPlayers.splice(index, 1);
    let id = player[0];
    $('#'+id).remove();
    $('#draftQueue')[0].children[1].remove();
    if (team == user) {
        if ($("#"+position).text().length <= 4) {
            $("#"+position).append(player[1].first + " " + player[1].last);
        } else {
            $("#"+position).append(", " + player[1].first + " " + player[1].last);
        }
    }
}

export const makeDraftBoard = function() {
    axios({
        method: "get",
        url: "http://localhost:3000/public/players"
    }).then(data => {
        let players = Object.entries(data.data.result);
        let allPlayers = [];
        for (let i = 0; i < players.length; i++) {
            let total = 0;
            let playerStats = players[i][1].statsPerWeek;
            for (let key in playerStats) {
                if (playerStats[key].points != undefined) {
                    total += playerStats[key].points;
                }
            }
            players[i][1]["points"] = Math.round((total)*100) / 100.0;
            allPlayers.push(players[i]);
        }
        allPlayers.sort((a, b) => (a[1].points < b[1].points) ? 1 : -1);
        $('#draftBoard').empty();
        $('#draftBoard').append(makeDiv("draftBoardHeader").append("Draft Board"));
        for (let i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i][1].first != undefined) {
                $('#draftBoard').append(makePlayerDraftCard(allPlayers[i]));
                mainPlayers.push(allPlayers[i]);
            }
        }
    });
}

export const makePlayerDraftCard = function(player) {
    let panel = makeDiv(player[0], "draftPlayerCardGrid");

    let nameDiv = makeDiv().append(player[1].first + " " + player[1].last + " - " + player[1].position);
    let schoolDiv = makeDiv().append(player[1].team);
    let column1 = makeDiv("","draftCardC1").append(nameDiv, schoolDiv);
    let points = player[1].points;
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
    let pointDiv = makeDiv("","draftCardPoint").append(player[1].points);
    //let overallPointDiv = makeDiv("", "draftPlayerCardElements").append(point, pointDiv);

    let draftButton = makeButton("", "draftButton").append("Draft");
    let buttonDiv = makeDiv("","draftCardButton").append(draftButton);
    //let nameSchool = makeDiv("", "draftPlayerCardElements").append(nameDiv, schoolDiv);
    //panel.append(nameSchool, overallPointDiv, buttonDiv);
    panel.append(column1, pointDiv, buttonDiv);
    return panel;
}

export const makeDraftQueue = function() {
    let token = "Bearer " + getCookie(user);
    axios({
        method: "get",
        url: "http://localhost:3000/private/leagues/" + league + "/users/",
        headers: {
            Authorization: token
        }
    }).then(data => {
        let teams = data.data.result;
        for (let i = 0; i < teams.length; i++) {
            mainTeams[teams[i]] = makeTeam();
        }
        for (let i = 0; i < 8; i++) {
            for (let i = 0; i < teams.length; i++) {
                mainQueue.push(teams[i]);
            }
        }
        for (let i = 0; i < mainQueue.length; i++) {
            $('#draftQueue').append(makeQueueDraftCard(i+1, mainQueue[i]));
        }
    });
}

export const makeQueueDraftCard = function(number, name) {
    let panel = makeDiv("", "draftQueueCard");
    let pickDiv = makeDiv("", "pickNumber").append(number);
    let nameDiv = makeDiv("", "pickUser").append(name);
    panel.append(pickDiv, nameDiv);
    return panel;
}

export const loadAutoDraftManager = function() {
    let token  = "Bearer " + getCookie(user);
    while (mainQueue[0] != user) {
        let team = mainQueue[0];
        setTimeout(function() {
            autoDraft(team)
        }, 500);
        mainQueue.shift();
        if (mainQueue.length == 0 && mainTeams != {}) {
            setTimeout(function() {
                axios({
                    method: 'get',
                    url: 'http://localhost:3000/public/players',
                }).then(data => {
                    let players = data.data.result;
                    for (let key in mainTeams) {
                        let owner = key;
                        let team = mainTeams[key];
                        let points = [];
                        for (let i = 1; i < 15; i++) {
                            points[i] = 0;
                            if (players[mainTeams[key].roster["QB"]] != undefined) {
                                let qb = mainTeams[key].roster["QB"];
                                let p = players[qb].statsPerWeek[i].points;
                                if (p != undefined) {
                                    points[i] += p;
                                }
                            }
                            if (players[mainTeams[key].roster["RB"]] != undefined) {
                                let rb = mainTeams[key].roster["RB"];
                                let p = players[rb].statsPerWeek[i].points;
                                if (p != undefined) {
                                    points[i] += p;
                                }
                            }
                            if (players[mainTeams[key].roster["WR"]] != undefined) {
                                let wr = mainTeams[key].roster["WR"];
                                let p = players[wr].statsPerWeek[i].points;
                                if (p != undefined) {
                                    points[i] += p;
                                }
                            }
                            if (players[mainTeams[key].roster["TE"]] != undefined) {
                                let te = mainTeams[key].roster["TE"];
                                let p = players[te].statsPerWeek[i].points;
                                if (p != undefined) {
                                    points[i] += p;
                                }
                            }
                            points[i] = Math.round(points[i]*100) / 100.0;
                        }
                        mainTeams[key].points = points;
                    }
                }).then(data => {
                        axios({
                        method: 'post',
                        url: "http://localhost:3000/private/leagues/" + league + "/users",
                        headers: {
                            Authorization: token
                        },
                        data: {
                            data: mainTeams
                        }
                    }).then(data =>{
                        $('#content').empty();
                        getUserTeam(user);
                    });
                });
                axios({
                    method: 'post',
                    url: "http://localhost:3000/user/stuff/hasTeam",
                    headers: {
                        Authorization: token
                    },
                    data: {
                        data: true
                    }
                });
                axios({
                    method: "get",
                    url: "http://localhost:3000/private/leagues/" + league + "/users/",
                    headers: {
                        Authorization: token
                    }
                }).then(data => {
                    let teams = data.data.result;
                    let schedule = makeSchedule();
                    let leagueSched = [];
                    for (let i = 0; i < schedule.length; i++) {
                        let weekSched = [];
                        for (let j = 0; j < 4; j++) {
                            weekSched.push(makeMatchup(teams[schedule[i][j][0]-1], teams[schedule[i][j][1]-1]))
                        }
                        leagueSched.push(weekSched);
                    }
                    axios({
                        method: "post",
                        url: "http://localhost:3000/private/leagues/" + league + "/schedule/",
                        headers: {
                            Authorization: token
                        },
                        data: {
                            data: leagueSched
                        }
                    })
                });
            },500);
            break;
        }
    }
    $('#content').prepend(makeTimer());
}

export const makeMatchup = function(team1, team2) {
    let matchup = [team1, team2];
    return matchup;
}

export const makeSchedule = function() {
    let sched = [];
    let w1 = [[1,2],[3,4],[5,6],[7,8]];
    let w2 = [[1,3],[2,4],[5,7],[6,8]];
    let w3 = [[1,4],[2,3],[6,7],[5,8]];
    let w4 = [[1,5],[2,7],[3,6],[4,8]];
    let w5 = [[1,6],[2,5],[4,7],[3,8]];
    let w6 = [[1,7],[3,5],[4,6],[2,8]];
    let w7 = [[1,8],[2,6],[3,7],[4,5]];
    sched.push(w1, w2, w3, w4, w5, w6, w7, w1, w2, w3, w4, w5, w6, w7);
    return sched;
}

export const handleDraftEvent = function(event) {
    let id = $(event.target).closest('.draftPlayerCardGrid')[0].id;
    let player;
    for (let i = 0; i < mainPlayers.length; i++) {
        if (mainPlayers[i][0] == id) {
            player = mainPlayers[i];
            break;
        }
    }
    draft(user, player);
    clearTimeout(timer);
    $('#timer').remove();
    mainQueue.shift();
    loadAutoDraftManager();
}

export const lookAtTeam = function() {
    let panel = $('<div id="currentTeam"></div>').append(makeDiv("draftTeamHeader").append("Your Team"));
    let qbDiv = $('<div id="QB" class="odd draftTeam"></div>').append("QB: ");
    let rbDiv = $('<div id="RB" class="even draftTeam"></div>').append("RB: ");
    let wrDiv = $('<div id="WR" class="odd draftTeam"></div>').append("WR: ");
    let teDiv = $('<div id="TE" class="even draftTeam"></div>').append("TE: ");
    panel.append(qbDiv, rbDiv, wrDiv, teDiv);
    return panel;
}

export const loadDraftPage = function() {
    let $home = $('#content');

    let container = makeDiv("draftContainer");

    makeDraftQueue();

    let queueHeader = makeDiv("draftQueueHeader").append("Queue")
    container.append(makeDiv("draftQueue").append(queueHeader));

    makeDraftBoard("", "All");

    container.append(makeDiv("draftBoard").append("Draft Board"));

    container.on('click', '.draftButton', handleDraftEvent);


    $home.append(container);

    setTimeout(function() {
        loadAutoDraftManager()
    }, 1500);

    $home.append(lookAtTeam());

}

