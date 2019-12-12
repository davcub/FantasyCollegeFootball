import {getCookie} from "./pages.js";
import {makeDiv} from "./pages.js";
import {makeButton} from "./pages.js";
import {makeNavUserBar} from "./pages.js";
import {renderHome} from "./renderHome.js";

let user = "";
export const makeFavTeamSelector = function() {
    let teamSelect = $('<select></select>').attr({
        id: "profileTeamSelect"
    });

    let teams = ["Boston College", "Clemson", "Duke", "Florida State", "Georgia Tech", "Louisville", "Miami", 
                "North Carolina", "North Carolina State", "Pittsburgh", "Syracuse", "Virginia", "Virginia Tech", "Wake Forest"];

    for (let i = 0; i < teams.length; i++) {
        if (teams[i] == "North Carolina") {
            teamSelect.append($('<option selected="selected"></option').append(teams[i]));
        } else {
            teamSelect.append($("<option></option>").append(teams[i]));
        };
    };
    return teamSelect;
};

export const makeTeamLogoButtons = function(user) {
    let logos = makeDiv("logosFormButtons");
    let b1 = makeButton(user, "logoFormButton", "fas fa-football-ball").append("<i class='fas fa-football-ball fa-7x'></i>").on("click", handleLogoButton);
    let b2 = makeButton(user, "logoFormButton", "fas fa-quidditch").append("<i class='fas fa-quidditch fa-7x'></i>").on("click", handleLogoButton);
    let b3 = makeButton(user, "logoFormButton", "fas fa-dumbbell").append("<i class='fas fa-dumbbell fa-7x'></i>").on("click", handleLogoButton);
    let b4 = makeButton(user, "logoFormButton", "fas fa-graduation-cap").append("<i class='fas fa-graduation-cap fa-7x'></i>").on("click", handleLogoButton);
    let b5 = makeButton(user, "logoFormButton", "fas fa-utensils").append("<i class='fas fa-utensils fa-7x'></i>").on("click", handleLogoButton);
    let b6 = makeButton(user, "logoFormButton", "fas fa-dragon").append("<i class='fas fa-dragon fa-7x'></i>").on("click", handleLogoButton);
    let b7 = makeButton(user, "logoFormButton", "fas fa-dog").append("<i class='fas fa-dog fa-7x'></i>").on("click", handleLogoButton);
    let b8 = makeButton(user, "logoFormButton", "fas fa-hippo").append("<i class='fas fa-hippo fa-7x'></i>").on("click", handleLogoButton);
    logos.append(b1,b2,b3,b4,b5,b6,b7,b8);
    return logos;
};

export const handleLogoButton = function(event) {
    event.preventDefault();
    let token = "Bearer " + getCookie(user);
    let value = $(event.target).closest('.logoFormButton')[0].value;
    //make axios call to give user json the picture
    console.log(value);
    axios({
        method: 'post',
        url: 'http://localhost:3000/user/stuff/teamLogo',
        headers: {
            Authorization: token
        },
        data: {
           data: value
        }
    });
    $("#logosFormButtons").replaceWith(makeLogoForm(user, value));
};

export const makeLogoForm = function(user, pic) {
    let logoChange = makeDiv("logosForm");
    let picsize = pic + " fa-7x";
    let icon = $("<i></i>").attr({
        class: picsize,
        id: "pic"
    });
    if (pic == "") {
        icon = $("<i></i>").attr({
            class: "fas fa-user fa-7x",
            id: "pic"
        });
    }; 
    let p = makeDiv().attr({
        id: "profilePic"
    }).append(icon);
    let change = makeButton(user, "profileFormButton", "change").append("Change").on("click", handleFormButton);
    logoChange.append(p, change);
    return logoChange;
};

export const makeProfileForm = function(user) {

    let form = $("<form></form>").attr({
        id: "profileForm"
    });

    let title = makeDiv("profileFormTitle").append("Profile Page");

    let logoChange = makeLogoForm(user, "");    
    
    let fNtext = makeDiv("", "profileFormField").append("First name");
    let fN = $("<input></input>").attr({
        id: "fN",
        class: "profileFormField",
        placeholder: "Type here..."
    });
  
    let lNtext = makeDiv("", "profileFormField").append("Last name");
    let lN = $("<input></input>").attr({
        id: "lN",
        class: "profileFormField",
        placeholder: "Type here..."
    });

    let tNtext = makeDiv("", "profileFormField").append("Team name");
    let tN = $("<input></input>").attr({
        id: "tN",
        class: "profileFormField",
        placeholder: "Type here..."
    });

    let title2 = makeDiv("favTeamTitle").append("Favorite ACC Team");
    let teamSelect = makeFavTeamSelector();
    let teamFav = makeDiv().append(title2, teamSelect).attr({
        id: "favTeamDiv"
    });

    let submit = makeButton(user, "profileFormButton", "submit").append("Submit").on("click", handleFormButton);
 
    form.append(title, logoChange, fNtext, fN, lNtext, lN, tNtext, tN, teamFav, submit);
    return form;
};

export const handleFormButton = function(event) {
    event.preventDefault();
    let value = event.target.value;

    if (value == "submit") {
        let firstName = $("#fN")[0].value;
        let lastName = $("#lN")[0].value;
        let teamName = $("#tN")[0].value;
        let favTeam = $("#profileTeamSelect")[0].value;
        makeProfile(user, firstName, lastName, teamName, favTeam);
        $("#navBar").replaceWith(makeNavUserBar(user));
    } else if (value == "change") {
        $("#logosForm").replaceWith(makeTeamLogoButtons(user));
    };
};

export const makeProfile = async function(user, firstName, lastName, teamName, favTeam) {
    let token = "Bearer " + getCookie(user);
    let profile = {
        firstName: firstName,
        lastName: lastName,
        teamName: teamName,
        favoriteTeam: favTeam,
    };
    await axios({
        method: 'post',
        url: 'http://localhost:3000/user/stuff/profile',
        headers: {
            Authorization: token
        },
        data: {
           data: profile
        }
    }).then(data => {
        $("#content").replaceWith(renderHome(user));
    });
};

export const renderProfile = function(u) {
    user = u;
    let profile = makeDiv("content");
    
    let profileForm = makeProfileForm(user);
    profile.append(profileForm); 

    return profile;
};