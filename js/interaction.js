let pages = { // Initialized after load
    "default": {nav: undefined, content: undefined},
    "programming": {nav: undefined, content: undefined},
    "game-development": {nav: undefined, content: undefined},
    "game-design": {nav: undefined, content: undefined}
};
let pageNavs = [];
let contentNavs = [];
let $activePageID;
let $activeContentID;
let $topBtn;

$(function() {
    // Document ready
    $topBtn = $("#topBtn");
    $activePageID = $('#pageNav .active').attr("href").substr(1);
    console.log($activePageID);

    for (let pageName in pages) {
        let p = pages[pageName];
        p.nav = $('#pageNav a[href="#' + pageName + '"]')[0];
        p.content = $("#" + pageName)[0];
        pageNavs.push(p.nav);
        contentNavs.push($("nav", p.content));
        console.log(p);
    }
    console.log("Pages", pages);
    console.log("Page Nav Links", pageNavs);
    console.log("Page Content Navs", contentNavs);


    $(window).on( "scroll", function() {
        let $scroll = $('html, body').scrollTop();

        if ($scroll > $("header").height()) {
            $topBtn.css("visibility", "visible");
            $topBtn.fadeIn("slow");
        } else {
            $topBtn.fadeOut("slow");
        }
    });

    $(pageNavs).on("click", switchToPage);

});

function switchToPage(event) {
    // Get and store the page ids
    let $lastActivePageID = $activePageID;
    $activePageID = $(event.target).attr('href').substr(1);

    // Cancel if page is already active
    if ($activePageID === $lastActivePageID) return;

    let lastActivePage = pages[$lastActivePageID];
    let activePage = pages[$activePageID];

    $(lastActivePage.nav).removeClass("active");
    $(activePage.nav).addClass("active");

    $(lastActivePage.content).fadeOut(100);
    $(activePage.content).fadeIn(100, () => setTimeout(function() {
        scrollToTop("#" + $activePageID + "-intro");
    }, 300));
}

function scrollToTop(id = "#top") {
    console.log("scrolling to", id, $(id), $(id).offset());
    let position = $(id).offset().top;
    console.log(position);


    $('html, body').animate({
        scrollTop: position
    }, );
}