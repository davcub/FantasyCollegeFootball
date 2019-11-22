
import {makeDiv} from "./pages.js";
export const makeButtonSection = function() {

};
export const makeStanding = function() {

};
export const makeMatchup = function() {

};
export const makeTranscation = function() {

};

export const renderLeague = function(player) {
    let league = makeDiv();
    league.append(player);
    console.log(player);
    return league;
};