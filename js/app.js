let headerContainer, navContainer, mainContainer, footerContainer;
let contentMap;
let pageContentMap;
let contents = {};
let modals = {};
let currentPage = "";
let currentContentID = "";

$.getJSON("./components/content.map.json", (json) => {
    contentMap = json;

    headerContainer = $("header#top")[0];
    navContainer = $("nav#page-nav")[0];
    mainContainer = $("main#content")[0];
    footerContainer = $("footer#bottom")[0];
    //console.log(headerContainer, navContainer, mainContainer, footerContainer);

    $.getScript("js/loader.js", () => {
        load().then(() => {
                new Promise(initContent);
            })
            .catch((reason) => {
                console.error("Something went wrong:" + reason);
            });
    });
});