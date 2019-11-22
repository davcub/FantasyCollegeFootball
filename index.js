
import {makeSideNavBar} from "./pages.js";
import {renderHome} from "./renderHome.js";

export const renderEverything = function() {
    let $root = $('#root');
    
    $root.append(renderHome(),makeSideNavBar())
};

$(function() {
    renderEverything();
});