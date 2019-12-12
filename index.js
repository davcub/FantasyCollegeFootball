
import {makeSideNavBar} from "./pages.js";
import {renderHome} from "./renderHome.js";
import {makeDiv} from "./pages.js";
export const renderEverything = function() {
    let $root = $('#root');
    let content = makeDiv("content");
    content.append(renderHome());
    $root.append(content,makeSideNavBar());
};

$(function() {
    renderEverything();
});