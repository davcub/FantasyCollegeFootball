import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";

export const renderPlayers = function(user) {
    let panel = makeDiv("content");
    loadPage(panel);
    return panel;
};

let butVal = "All";
let searchVal = "";

export const renderWeekForm = function() {
    let panel = $('<div class="weekForm field"></div>');
    let buttonDiv = makeDiv("playersButton");
    buttonDiv.append(makeButton("player-All", "playersButtonG").append("All").on('click', handleButtonPress));
    buttonDiv.append(makeButton("player-QB", "playersButtonG").append("QB").on('click', handleButtonPress));
    buttonDiv.append(makeButton("player-RB", "playersButtonG").append("RB").on('click', handleButtonPress));
    buttonDiv.append(makeButton("player-WR", "playersButtonG").append("WR").on('click', handleButtonPress));
    buttonDiv.append(makeButton("player-TE", "playersButtonG").append("TE").on('click', handleButtonPress));
    let searchDiv = makeDiv("", "control");
    let searchBar = $('<input type="text" placeholder="Search for player here..." class="searchBar input is-medium">').keyup(handleSearchKeyPress);
    searchDiv.append(searchBar)
    panel.append(searchDiv, buttonDiv);
    return panel;
}

let timeout;
export const debounce = function(func) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        func();
    }, 500);
}

export const handleSearchKeyPress = function(event) {
    searchVal = event.target.value;
    debounce(renderResults);
}

export const renderResults = function() {
    $('#content').append(renderPlayerList());
}

export const handleButtonPress = function(event) {
    event.preventDefault();
    butVal = event.target.id.split('-').pop();
    $('#content').append(renderPlayerList());
}

export const renderPlayerList = function() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/public/players',
    }).then(data => { 
        let players = Object.entries(data.result);
        let playerArray = [];
        for (let i = 0; i < players.length; i++) {
            let name = players[i][1].first + " " + players[i][1].last;
            name = name.toLowerCase();
            let string = searchVal.toLowerCase();
            if (name.includes(string)) {
                if (players[i][1].position == butVal) {
                    playerArray.push(players[i]);
                } else if (butVal == "All") {
                    playerArray.push(players[i]);
                }
            }
        }
        for (let i = 0; i < playerArray.length; i++) {
            let total = 0;
            let playerStats = playerArray[i][1].statsPerWeek;
            for (let key in playerStats) {
                if (playerStats[key].points != undefined) {
                    total += playerStats[key].points;
                }
            }
            playerArray[i][1]["points"] = Math.round((total)*100) / 100.0;
        }
        playerArray.sort((a, b) => (a[1].points < b[1].points) ? 1 : -1);
        let panel = $('<div class="allPlayers"></div>');
        let numPlayers = 100;
        if (playerArray.length < numPlayers) {
            numPlayers = playerArray.length;
        }
        for (let i = 0; i < numPlayers; i++) {
            panel.append(renderPlayerCard(playerArray[i][1], i));
        }
        $('#content')[0].children[1].remove();
        $("#content").append(panel);  
    });
}

export const filterPos = function(position) {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/public/players',
    }).then(data => {
        let players = Object.entries(data.result);
        let playerArray = [];
        let string = $('.searchBar')[0].value;
        for (let i = 0; i < players.length; i++) {
            let name = players[i][1].first + " " + players[i][1].last;
            name = name.toLowerCase();
            string = string.toLowerCase();
            if (name.includes(string)) {
                if (players[i][1].position == position) {
                    playerArray.push(players[i]);
                } else if (position == "All") {
                    playerArray.push(players[i]);
                }
            }
        }
        for (let i = 0; i < playerArray.length; i++) {
            let total = 0;
            let playerStats = playerArray[i][1].statsPerWeek;
            for (let key in playerStats) {
                if (playerStats[key].points != undefined) {
                    total += playerStats[key].points;
                }
            }
            playerArray[i][1]["points"] = Math.round((total)*100) / 100.0;
        }
        playerArray.sort((a, b) => (a[1].points < b[1].points) ? 1 : -1);
        let panel = $('<div class="allPlayers"></div>');
        let numPlayers = 100;
        if (playerArray.length < numPlayers) {
            numPlayers = playerArray.length;
        }
        for (let i = 0; i < numPlayers; i++) {
            panel.append(renderPlayerCard(playerArray[i][1], i));
        }
        $("#content").append(panel);
    });
    
}

export const renderPlayerCard = function(player, rank) {
    let panel = $('<div class="playerSearchCard"></div>');
    let rankDiv = makeDiv("", "playerSearchCardG").append(rank+1);
    let name = player.first + " " + player.last;
    let nameDiv = makeDiv("", "playerSearchCardG").append(name);
    let posDiv = makeDiv("", "playerSearchCardG").append(player.position);
    let points = player.points;
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
    let pointsDiv = makeDiv("", "playerSearchCardG").append(points);
    return panel.append(rankDiv, nameDiv, posDiv, pointsDiv);
}

export const loadPage = function(panel) {
    panel.append(renderWeekForm());
    panel.append(filterPos("All"));
}

