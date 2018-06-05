let pages = [
    {id: "default", nav: undefined},
    {id: "programming", nav: undefined},
    {id: "game-development", nav: undefined},
    {id: "game-design", nav: undefined}
];

let $topBtn;

$(function() {
    // Document ready
    console.log(pages);
    $topBtn = $("#topBtn");
});


$(window).on( "scroll", function() {
    let $scroll = $('html, body').scrollTop();

    if ($scroll > $("header").height()) {
        $topBtn.css("visibility", "visible");
        $topBtn.fadeIn("slow");
    } else {
        $topBtn.fadeOut("slow");
    }

});