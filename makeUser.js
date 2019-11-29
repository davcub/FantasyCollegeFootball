
import {makeNavUserBar} from "./pages.js";
import {makeCookie} from "./pages.js";

export const makeUser = async function(user, password, event) {
    await axios({
        method: 'post',
        url: 'http://localhost:3000/account/create',
        data: {
            name: user,
            pass: password,
        }
    }).then(data => {         
        axios({
            method: 'post',
            url: 'http://localhost:3000/account/login',
            data: {
                name: user,
                pass: password,
            }
        }).then(data => {
            let d= data.data;
            let token =  "Bearer " + d.jwt;
            makeCookie(d.name,d.jwt);
            axios({
                method: 'post',
                url: "http://localhost:3000/user/stuff",
                headers: {
                    Authorization: token
                },
                data: {
                    data:{
                        username: user,
                        teamName: "",
                        league: "",
                        pic: "",
                        inLeague: false,
                        schedule: {},
                        team: {
                            //these position will be filled with object once the user has joined or make a league
                            QB: "",
                            RB: "",
                            WR: "",
                            TE: "",
                        }
                    }
                }
            });
            $(event.target).closest("#navBar").replaceWith(makeNavUserBar(d.name));
        });
    }); 
};

export const addUsertoLeague = async function(token, leagueName) {
    await new axios({
        method: 'post',
        url: "http://localhost:3000/user/stuff/league/",
        headers: {
            Authorization: token
        },
        data: {
            data: leagueName
        }
    });
    await new axios({
        method: 'post',
        url: "http://localhost:3000/user/stuff/inLeague/",
        headers: {
            Authorization: token
        },
        data: {
            data: true
        }
    });
};

export const getRandomPlayers = async function(user, token) {
    await axios({
        method: "get",
        url: "http://localhost:3000/user/stuff",
        headers: {
            Authorization: token
        }
    }).then(data => {
        let d = data.data.result;
        let league = d.league;
        let position = ['tightends', "runningbacks", "quarterbacks", "widerecievers"];
        for (let i = 0; i < position.length; i++) {
            makeRandom(league, position[i], token, user);
        }    
    });
};

export const makeRandom = async function(league, position, token, user) {
    await axios({
        method: "get", 
        url: "http://localhost:3000/private/leagues/" + league + "/players/" + position, 
        headers: {
            Authorization: token
        }
    }).then(data => {
        let d = data.data.result;
        //put the id's in an array then get a random number out of the array;
        let idArray = [];
        for (let key in d) {
            let player = d[key];
            if (player.owned == false) {
                idArray.push(player.id);
            };
        };

        let randomNum = Math.floor((Math.random() * (idArray.length - 1)) + 0);
        let p = idArray[randomNum];
        axios ({
            method: "get",
            url: "http://localhost:3000/private/leagues/" + league + "/players/" + position + "/" + p, 
            headers: {
                Authorization: token
            }
        }).then(data => {
            let d = data.data.result;   
            //change player info in private/league: owner, owned
            changePlayerInfo(league, position, d, user, token)
            //change user team to have players
            putPlayer(d, token);
        });
    });
};

export const putPlayer = async function(player, token) {
    let position = player.position;
    new axios({
        method: "post",
        url: "http://localhost:3000/user/stuff/team/" + position,
        headers: {
            Authorization: token
        }, 
        data: {
            data: player.id
        }
    });
};

export const changePlayerInfo = async function(league, position, player, owner, token) {
    let p = player.id;
    await new axios({
        method: "post",
        url: "http://localhost:3000/private/leagues/" + league + "/players/" + position + "/" + p + "/owned", 
        headers: {
            Authorization: token
        },
        data: {
            data: true
        }
    });
    await new axios({
        method: "post",
        url: "http://localhost:3000/private/leagues/" + league + "/players/" + position + "/" + p + "/owner", 
        headers: {
            Authorization: token
        },
        data: {
            data: owner
        } 
    });
};


