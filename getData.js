
import axios from 'axios';

let fullTeams = ["Clemson", "Syracuse", "NC State", 
"Duke", "Virginia", "Boston College", "Wake Forest", "Georgia Tech", 
"Miami", "Pittsburgh", "Virginia Tech", "Florida State", "North Carolina", "Louisville"];

export const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
});

export const getPlayers = async function() {
    let teamURL = ["clemson", "syracuse", "nc%20state", 
    "duke", "virginia", "boston%20college", 
    "wake%20forest", "georgia%20tech", "miami", 
    "pittsburgh", "virginia%20tech", "florida%20state",
    "north%20carolina", "louisville"];

    let allTeams = ["Clemson", "Syracuse", "North Carolina State", 
    "Duke", "Virginia", "Boston College", "Wake Forest", 
    "Georgia Tech", "Miami", "Pittsburgh", "Virginia Tech", 
    "Florida State", "North Carolina", "Louisville"];

    for (let a = 0; a < fullTeams.length; a++) {
        await axios({
            method: "get",
            url: "https://api.collegefootballdata.com/roster?team=" + teamURL[a]
        }).then(data => {
            let d = data.data;
            let l = Object.keys(d).length;
            for (let players = 0; players < l; players++) {
                let position = d[players].position;
                if (position == "QB" || position == "RB" || position == "WR" || position == "TE") {
                    let first = d[players].first_name;
                    let last  = d[players].last_name;
                    let jersey = d[players].jersey;
                    let id = d[players].id;
                    let stats = createStatObject();
                    pubRoot.post(`/players/`+ id, {
                        data: {"first": first, "last": last, "position" : position, "jersey": jersey, "team": allTeams[a], "statsPerWeek": stats}
                    });
                   
                };
            };
        });
    };    
};

export const createStatObject = function() {
    let statsPerWeek = {};
    let stat = {
        pyd: 0,
        ptd: 0,
        runyd: 0,
        runtd: 0,
        ryd: 0,
        rytd: 0,
        rec: 0
    };
    for (let i = 1; i < 15; i++) {
        statsPerWeek[i] = stat;
    };
    return statsPerWeek;
};

export const createTeam = function(id, teamCity, teamName, winPercent, division, teamColors, schedule, pic) {
    pubRoot.post(`/teams/`+teamCity, {
        data: {id, teamCity, teamName, winPercent, division, teamColors, schedule, pic}
    });
};

export const getTeams = async function() {
  
    let clemsonC = ["#F56600","#522D80"];
    let syracuseC = ["#D44500","#3E3D3C", "#6F777D", "#ADB3B8", "#3E3D3C"];
    let ncstateC = ["#CC0000","#000000", "#FFFFFF"];
    let dukeC = ["#003087","#000000"];
    let virginiaC = ["#232D4B","#F84C1E", "#FFFFFF"];
    let bostonC = ["#98002E","#BC9B6A", "#726158"];
    let wakeforestC = ["#9E7E38","#000000"];
    let georgiaC = ["#A28D5B","#003057"];
    let miamiC = ["#F47321","#005030", "#FFFFFF"];
    let pittC = ["#1C2957","#CDB87D"];
    let vtC = ["#630031","#CF4420"];
    let floridaC = ["#782F40","#CEB888", "#FFFFFF", "#000000"];
    let ncC = ["#7BAFD4","#FFF"];
    let louisvilleC = ["#AD0000","#000000", "#FDB913"];

    let teamColors = [clemsonC, syracuseC, ncstateC, dukeC, virginiaC, bostonC,
        wakeforestC, georgiaC, miamiC, pittC, vtC, floridaC, ncC, louisvilleC];
    
    let teamPics = ["teamLogos/clemson.png", "teamLogos/syracuse.png","teamLogos/ncstate.png",
    "teamLogos/duke.png","teamLogos/virginia.png","teamLogos/bostoncollege.png","teamLogos/wakeforest.png",
    "teamLogos/georgiatech.png","teamLogos/miami.png","teamLogos/pitt.png","teamLogos/virginiatech.png",
    "teamLogos/floridastate.png","teamLogos/unc.png","teamLogos/louisville.png"];
    
    await axios({
        method: "get",
        url: 'http://api.sportradar.us/ncaafb-t1/teams/FBS/2018/REG/standings.json?api_key=sg8pf7bdjt5u8ueedttyytwx',
    }).then(data => {
        let teams = data.data.division.conferences[0].teams;
    
        for (let i = 0; i < teams.length; i++) {
            let market = teams[i].market;
            if (teams[i].market == "Miami (FL)") {
                market = "Miami";
            }
            if (teams[i].market == "North Carolina State") {
                market = "NC State";
            }
            let subDivision = "";

            if (teams[i].subdivision == "ACC-ATLANTIC") {
                subDivision = "ATLANTIC";
            } else {
                subDivision = "COASTAL";
            };
            createTeam(i, market, teams[i].name, 0, subDivision, teamColors[i], [], teamPics[i]);
        }
    });
};

export const getSchedule = async function() {
    await axios({
    method: "get",
        url: 'https://api.collegefootballdata.com/games?year=2019&seasonType=regular&conference=ACC',
    }).then(data => {
        for (let i = 0; i < data.data.length; i++) {
            let game = data.data[i];
            for (let j = 0; j < fullTeams.length; j++) {
                if (game.home_team == fullTeams[j]) {
                    pubRoot.post('/teams/' + fullTeams[j] + "/schedule/" + game.week.toString(), {
                        "data": {
                            home: "true",
                            opponent: game.away_team,
                            thisScore: game.home_points,
                            oppScore: game.away_points,
                        },
                    })
                } else if (game.away_team == fullTeams[j]) {
                    pubRoot.post('/teams/' + fullTeams[j] + "/schedule/" + game.week.toString(), {
                        "data": {
                            home: "false",
                            opponent: game.home_team,
                            thisScore: game.away_points,
                            oppScore: game.home_points,
                        },
                    });
                };
            };
        };
    });
};

export const getStats = async function() {
    for (let a = 1; a < 15; a++) {
        await axios({
            method: "get",
            url: "https://api.collegefootballdata.com/games/players?year=2019&week=" + a + "&seasonType=regular&conference=ACC",
        }).then(data => {
            for (let b = 0; b < data.data.length; b++) {
                let game = data.data[b];
                for (let c = 0; c < game.teams.length; c++) {
                    if(game.teams[c].conference == "ACC") {
                        let teamStat = game.teams[c].categories;
                    
                        let rtd = 0;
                        let ryd = 0;
                        let rec = 0;
    
                        let runtd = 0;
                        let runyd = 0;
                        
                        let ptd = 0;
                        let pyd = 0;
    
                        for (let d = 0; d < teamStat.length; d++) {
                            if (teamStat[d].name == "receiving") {
                                let receiving = teamStat[d];
                                for (let e = 0; e < receiving.types.length; e++) {
                                    if (receiving.types[e].name == "TD") {
                                        rtd = receiving.types[e].athletes;
                                    } else if (receiving.types[e].name == "YDS") {
                                        ryd = receiving.types[e].athletes;
                                    } else if (receiving.types[e].name == "REC") {
                                        rec = receiving.types[e].athletes;
                                    };
                                };
                            } else if (teamStat[d].name == "rushing") {
                                let rushing = teamStat[d];
                                for (let e = 0; e < rushing.types.length; e++) {
                                    if (rushing.types[e].name == "TD") {
                                        runtd = rushing.types[e].athletes;
                                    } else if (rushing.types[e].name == "YDS") {
                                        runyd = rushing.types[e].athletes;
                                    };
                                };
                            } else if (teamStat[d].name == "passing") {
                                let passing = teamStat[d];
                                for (let e = 0; e < passing.types.length; e++) {
                                    if (passing.types[e].name == "TD") {
                                        ptd = passing.types[e].athletes;
                                    } else if (passing.types[e].name == "YDS") {
                                        pyd = passing.types[e].athletes;
                                    };
                                };
                            }; 
                        };
    
                        let tempStats = {};
                        updateStat(rtd, "rtd", tempStats);
                        updateStat(ryd, "ryd", tempStats);
                        updateStat(rec, "rec", tempStats);
                        updateStat(runtd, "runtd", tempStats);
                        updateStat(runyd, "runyd", tempStats);
                        updateStat(ptd, "ptd", tempStats);
                        updateStat(pyd, "pyd", tempStats);

                        for (let key in tempStats) {
                            tempStats[key]["points"] = Math.round(makePoints(tempStats[key])*100) / 100.0;
                        };

                        for (let key in tempStats) {
                            pubRoot.post("/players/" + key + "/statsPerWeek/" + a, {
                                data: tempStats[key],
                            });
                        };                 
                    };
                };
            };
        });
    };    
};

export const makePoints = function(stats) {
    let total = 0;
    total += (stats["pyd"]*0.04);
    total += (stats["ptd"]*4);
    total += (stats["runyd"]*0.1);
    total += (stats["runtd"]*6);
    total += (stats["ryd"]*0.1);
    total += (stats["rtd"]*6);
    total += (stats["rec"]*1);
    return total;
};

export const updateStat = function(s, type, tempStats) {
    for (let z = 0; z < s.length; z++) {
        if (s[z].id > 0) {
            if(tempStats[s[z].id] == undefined) {
                tempStats[s[z].id] = {
                    pyd: 0,
                    ptd: 0,
                    runyd: 0,
                    runtd: 0,
                    ryd: 0,
                    rtd: 0,
                    rec: 0,
                };
            };
            tempStats[s[z].id][type] = parseInt(s[z].stat);
        };
    };
};

export const addByes = async function() {
    for (let i = 0; i < fullTeams.length; i++) {
         let schedule = await pubRoot.get("/teams/" + fullTeams[i] + "/schedule/");
         let sched = schedule.data.result;
         let schedCount = 0;
         for (let j = 1; j < 15; j++) {
             if (sched[schedCount] != j.toString()) {
                 pubRoot.post("/teams/" + fullTeams[i] + "/schedule/" + j, {
                     data: {
                        opponent: "BYE",
                        thisScore: 0,
                        oppScore: 0,
                     }
                 });
                 schedCount--;
             };
             schedCount++;
         };
    };
 };

//pubRoot.delete(`/players`);
//pubRoot.delete(`/teams`);
//getPlayers();
getStats();
//getTeams();
//getSchedule();
//addByes();


// these 2 functions below is what Chris help us with
export const putUser = async function() {
    await axios({
        method: 'post',
        url: 'http://localhost:3000/account/login',
        data: {
            name: "testrun",
            pass: "testrun",
        }
    }).then(data => {
        let d= data.data;
        let token = "Bearer " + d.jwt;

        axios.post('http://localhost:3000/user/cats',
        {data: {name: "hello"}}
        , {headers: {
            Authorization: token
        }}).catch(error => {
            console.log(error);
        });
    });
};

export const putUser2 = async function() {
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
        console.log(d);
        // makeUserOwner(token, false);
        // makeUserName(token, "Davidcubrilla");
        // makeUserTeam(token);
        // makeUserLeague(token);

        //getUser(token);
        startUsersData(token, user);
    });
};











