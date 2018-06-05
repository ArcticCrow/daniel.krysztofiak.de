let pages = [ // Initialized after load
    {id: "default", nav: undefined, content: undefined},
    {id: "programming", nav: undefined, content: undefined},
    {id: "game-development", nav: undefined, content: undefined},
    {id: "game-design", nav: undefined, content: undefined}
];
let pageNavs = [];
let contentNavs = [];
let $activePageID;
let $activeContentID;
let $topBtn;

$(function() {
    // Document ready
    console.log(pages);
    $topBtn = $("#topBtn");
    $activePageID = $('#navbarSupportedContent .active')[0];
    console.log($activePageID);

    for (let index in pages) {
        let p = pages[index];
        p.nav = $('#navbarSupportedContent a[href="#' + p.id + '"]')[0];
        p.content = $("#" + p.id)[0];
        pageNavs.push(p.nav);
        contentNavs.push($("nav", p.content));
        console.log(p, pageNavs, contentNavs);
    }



    $(window).on( "scroll", function() {
        let $scroll = $('html, body').scrollTop();

        if ($scroll > $("header").height()) {
            $topBtn.css("visibility", "visible");
            $topBtn.fadeIn("slow");
        } else {
            $topBtn.fadeOut("slow");
        }

        /*for (let index in pages) {
            if ($)
        }*/
    });

});

function scrollToTop(id = "#top") {
    let position = $(id).position().top - $("nav").height();

    $('html, body').animate({
        scrollTop: position
    }, 500);
}