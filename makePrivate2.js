//import { getCookie } from "./pages";

//import axios from "axios";

let fullTeams = ["Clemson", "Syracuse", "NC State", 
"Duke", "Virginia", "Boston College", "Wake Forest", "Georgia Tech", 
"Miami", "Pittsburgh", "Virginia Tech", "Florida State", "North Carolina", "Louisville"];

let teamURL = ["clemson", "syracuse", "nc%20state", 
"duke", "virginia", "boston%20college", 
"wake%20forest", "georgia%20tech", "miami", 
"pittsburgh", "virginia%20tech", "florida%20state",
"north%20carolina", "louisville"];



export const makeLeaguesObject = async function(token) {
    await axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues",
        headers: {
            Authorization: token
        },
    });
};

//below is making a league
//needed makeLeague for a way to make leagues object when private json is empty
export const makeLeague = async function(user,token,leagueName) {
    let league = makeALeague(user, leagueName, token);
    if (!league) {
        makeLeaguesObject(token);
        makeALeague(user, leagueName, token);
    };
};

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

export const makeALeague = async function(user, leagueName, token) {
    let teams = {};
    teams[user] = makeTeam();
    let nameLibrary = ["KMP", "Aaron", "Burgess", "Stotts", "McMillan", "Kris", "Plaisted", "Pizer", "Timmy", "David"];
    for (let i = 0; i < 7; i++) {
        let rand = Math.floor(Math.random()*10);
        if (teams[nameLibrary[rand]] == undefined) {
            teams[nameLibrary[rand]] = makeTeam();
        } else {
            i--;
        }
    };
    await axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/",
        headers: {
            Authorization: token
        },
        data: {
            data: {
                owner: user,
                size: 8,
                users: teams,
                schedule: {},
            }
        }
    }).then(data => {
        //getPlayersForLeague(leagueName, token);
    }).catch(error => {
        return(false);
    });
    return true;
};

export const getPlayersForLeague = async function(leagueName, token) {
 
    for (let a = 0; a < fullTeams.length; a++) {
        await axios({
            method: "get",
            url: "https://api.collegefootballdata.com/roster?team=" + teamURL[a]
        }).then(data => {
            let playerdata = data.data;
            let l = Object.keys(playerdata).length;

            for (let players = 0; players < l; players++) {
                let position = playerdata[players].position;
                let id = playerdata[players].id;
                if (position == "QB") {
                    let p = {
                        'owner': "",
                        'owned': false,
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "RB") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'id': id,
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "WR") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'id': id,
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "TE") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'id': id,
                    };
                    addPlayer(p, leagueName, token);
                };
            };
        });
    };    
};

export const addPlayer = function(player, leagueName, token) {
    let position = player.position;
    if (position == "QB") {
        position = "QBs";
    } else if (position == "RB") {
        position = "RBs";
    } else if (position == "WR") {
        position = "WRs";
    } else if (position == "TE") {
        position = "TEs";
    };
    
    let playerID = player.id;
    new axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/players/" + position + "/" + playerID,
        headers: {
            Authorization: token
        },
        data: {
            data: player
        }
    });
};

//below is joining league
export const joinALeague = async function(user, token, leagueName) {
    await axios({
        method: "get",
        url: "http://localhost:3000/private/leagues/" + leagueName,
        headers: {
            Authorization: token
        }
    }).then(data => {
        let d = data.data.result;
        let newSize = d.size + 1;
        addUser(leagueName, user, token, newSize); 
    });
};

export const addUser = async function(leagueName, user, token, newSize) {
    await new axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/users/" + user,
        headers: {
            Authorization: token
        },
        data: {
            data:{}
        }
    });
    await new axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/size/",
        headers: {
            Authorization: token
        },
        data: {
            data: newSize
        }
    });
};




////////
//below is leaving league 
export const leaveALeague = async function(user, token, leagueName) {
    await axios({
        method: "get",
        url: "http://localhost:3000/private/leagues/" + leagueName,
        headers: {
            Authorization: token
        }
    }).then(data => {
        let d = data.data.result;
        let newSize = d.size - 1;
        removeUser(leagueName, user, token, newSize); 
    });
};

export const removeUser = async function(leagueName, user, token, newSize) {
    await new axios({
        method: 'delete',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/users/" + user,
        headers: {
            Authorization: token
        }
    });
    await new axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/size/",
        headers: {
            Authorization: token
        },
        data: {
            data: newSize
        }
    });
};

//deleting leagues object
export const deleteLeagues = async function() {
    await axios({
        method: 'post',
        url: 'http://localhost:3000/account/login',
        data: {
            name: "testrun",
            pass: "testrun",
        }
    }).then(data => {
        let d= data.data;
        let user = d.name;
        let token = "Bearer " + d.jwt;
        axios({
            method: "delete",
            url: "http://localhost:3000/private/leagues",
            headers: {
                Authorization: token
            }
        }).then(data => {
            console.log(data);
        });
    });
};

//below is deleting league
export const deleteALeague = async function(token, leagueName) {
    await axios({
        method: "delete",
        url: "http://localhost:3000/private/leagues/" + leagueName,
        headers: {
            Authorization: token
        }
    });
};
///////





//below is giving user randoms players according to their leagues
//this function should get random players from the private/leagues/leagueName/players 
// and change owned and owner 
// then put have user obtain the playerid
export const randomPlayers = async function(user, token, leagueName) {
    let positions = ["QBs", "RBs", "WRs", "TEs"];
    for (let p = 0; p < positions.length; p++) {
        await axios({
            method: "get",
            url: "http://localhost:3000/private/leagues/" + leagueName + "/players/" + positions[p],
            headers: {
                Authorization: token
            },
        }).then(data=> {
            let d = data.data.result;

            let idArray = [];
            //this for loops make sures that players that's isn't owned is put into the idArray
            for (let key in d) {
                let player = d[key];
                if (player.owned == false) {
                    idArray.push(player.id);
                };
            };
            let randomNum = Math.floor((Math.random() * (idArray.length - 1)) + 0);
            let position = positions[p];
            let playerid = idArray[randomNum];
            updateInfo(user, leagueName, position, playerid, token)

            //gives player id to 'user/stuff/leaguesName/league/team/position/playerid' in user json
            if (position == "QBs") {
                let position = "QB";
            } else if (position == "RBs") {
                let position = "QB";
            } else if (position == "WRs") {
                let position = "QB";
            } else if (position == "TEs") {
                let position = "QB";
            };
            new axios({
                method: "post",
                url: "http://localhost:3000/user/stuff/leagueName/" + leagueName + "/team/" + position,
                headers: {
                    Authorization: token
                },
                data: {
                    data: playerid
                } 
            });
        });
    };
};

//changes the info owned and owner in private json
export const updateInfo = async function(user, leagueName, position, playerid, token) {
    await new axios({
        method: "post",
        url: "http://localhost:3000/private/leagues/" + leagueName + "/players/" + position + "/" + playerid + "/owned",
        headers: {
            Authorization: token
        },
        data: {
            data: true
        }
    });
    await new axios({
        method: "post",
        url: "http://localhost:3000/private/leagues/" + leagueName + "/players/" + position + "/" + playerid + "/owner",
        headers: {
            Authorization: token
        },
        data: {
            data: user
        }
    });
};



