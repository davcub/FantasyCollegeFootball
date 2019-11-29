
let fullTeams = ["Clemson", "Syracuse", "NC State", 
"Duke", "Virginia", "Boston College", "Wake Forest", "Georgia Tech", 
"Miami", "Pittsburgh", "Virginia Tech", "Florida State", "North Carolina", "Louisville"];

let teamURL = ["clemson", "syracuse", "nc%20state", 
"duke", "virginia", "boston%20college", 
"wake%20forest", "georgia%20tech", "miami", 
"pittsburgh", "virginia%20tech", "florida%20state",
"north%20carolina", "louisville"];

export const priRoot = new axios.create({
    baseURL: "http://localhost:3000/private"
});

export const deleteLeague = async function(leagueName) {
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
            url: "http://localhost:3000/private/" + leagueName,
            headers: {
                Authorization: token
            }
        }).then(data => {
            console.log(data);
        });
    });
};

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

//params should be league name and username, password
export const addLeague = async function(token,user, leagueName) {
    await axios({
        method: "get",
        url: "http://localhost:3000/private/leagues/" + leagueName,
        headers: {
            Authorization: token
        }
    }).then(data => {
        // if league already exist have user join the league
        let d = data.data.result;
        let newSize = d.size + 1;
        addTeam(leagueName, user, token) 
        new axios({
            method: 'post',
            url: "http://localhost:3000/private/leagues/" + leagueName + "/size/",
            headers: {
                Authorization: token
            },
            data: {
                data: newSize
            }
        });
    }).catch(error => {
        startLeague(leagueName, user, token);
        addTeam(leagueName, user, token);
        getPlayers(leagueName, token);
    });
};

export const startLeague = async function(leagueName,user,token) {
    await axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName,
        headers: {
            Authorization: token
        },
        data: {
            data:{
                owner: user,
                size: 1,
                teams: {},
                players: {},
            }
        }
    });
}; 

export const addTeam = function(leagueName, user, token) {
    new axios({
        method: 'post',
        url: "http://localhost:3000/private/leagues/" + leagueName + "/teams/" + user,
        headers: {
            Authorization: token
        },
        data: {
            data:{}
        }
    });
};

export const getPlayers = async function(leagueName, token) {
 
    for (let a = 0; a < fullTeams.length; a++) {
        await axios({
            method: "get",
            url: "https://api.collegefootballdata.com/roster?team=" + teamURL[a]
        }).then(data => {
            let playerdata = data.data;
            let l = Object.keys(playerdata).length;

            for (let players = 0; players < l; players++) {
                let position = playerdata[players].position;
                let first = playerdata[players].first_name;
                let last  = playerdata[players].last_name;
                let jersey = playerdata[players].jersey;
                let id = playerdata[players].id;
                if (position == "QB") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'first': first,
                        'last': last,
                        'position': position,
                        'id': id 
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "RB") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'first': first,
                        'last': last,
                        'position': position,
                        'id': id 
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "WR") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'first': first,
                        'last': last,
                        'position': position,
                        'id': id 
                    };
                    addPlayer(p, leagueName, token);
                } else if(position == "TE") {
                    let p = {
                        'owner': "",
                        'owned': false,
                        'first': first,
                        'last': last,
                        'position': position,
                        'id': id 
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
        position = "quarterbacks";
    } else if (position == "RB") {
        position = "runningbacks";
    } else if (position == "WR") {
        position = "widerecievers";
    } else if (position == "TE") {
        position = "tightends";
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

//deleteLeague();
//deleteLeagues();


