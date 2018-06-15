let left, right, up, down;
let arrows;
let currentContentPosition, currentPagePosition;
let pageCount, contentCount;
let pageDir;

async function initContent(resolve, reject, contentID = undefined) {
    return new Promise((resolve, reject) => {
        console.log("Initializing contents...");

        // Add default elements
        $(navContainer).html(contents["nav"]);
        $(footerContainer).html(contents["footer"]);

        if (arrows === undefined) {
            $(contents["arrows"]).appendTo($("body"));

            arrows = {
                up: $("body a#up-button").on("click", () => { updateContent(pageContentMap[up]); updateNavigation(); }),
                down: $("body a#down-button").on("click", () => { updateContent(pageContentMap[down]); updateNavigation(); }),
                left: $("body a#left-button").on("click", () => { pageDir = -1; updatePage(contentMap.layout[left]); updateNavigation(); }),
                right: $("body a#right-button").on("click", () => { pageDir = 1; updatePage(contentMap.layout[right]); updateNavigation(); })
            };
        }

        $(window).on ("mousewheel", function (event) {
            // Called when the window is scrolled
            // Make sure the values are integers
            let x = parseInt(event.deltaX);
            let y = parseInt(event.deltaY);
            console.log("mouse scrolling", x, y);

            // - deltaX -> left; + deltaX -> right; + deltaY -> up; - deltaY -> down
            if (currentContentPosition === 0) {
                if (x < 0) { // enable left
                    pageDir = -1; updatePage(contentMap.layout[left]); updateNavigation();
                }
                if (x > 0) { // enable right
                    pageDir = 1; updatePage(contentMap.layout[right]); updateNavigation();
                }
            } else if (y > 0) { // enable up
                // enable up
                updateContent(pageContentMap[up]); updateNavigation();
            }
            if (currentContentPosition < contentCount - 1 && y < 0) {
                // enable down
                updateContent(pageContentMap[down]); updateNavigation();
            }
        });

        console.log(getHash());
        // 1. figure out page and swap to page, and place content
        updatePage();

        // 2. update navigation
        updateNavigation();

        resolve();
    });
}

function updateNavigation() {
    console.log("Updating navigation...");
    for (let dir in arrows) {
        if (arrows.hasOwnProperty(dir)) {
            updateArrow(dir);
        }
    }
}

function updateArrow(dir) {
    let display = "none";
    switch (dir) {
        case "up":
            if (currentContentPosition > 0) {
                display = "initial";
            }
            break;
        case "down":
            if (currentContentPosition < contentCount - 1) {
                display = "initial"
            }
            break;
        case "left":
        case "right":
            if (currentContentPosition === 0) {
                display = "initial";
            }
            break;

        default: console.error("Unknown direction: " + dir); return;
    }

    $(arrows[dir]).css("display", display);
}

function changePages(targetPage = 0) {
    // Play page transition
    let dir = (pageDir > 0) ? "right" : "left";
    console.log(targetPage, dir);

    let cover = $("<div id='cover'></div>").appendTo('body').css(dir, "-100vw");

    let slideIn = {};
    slideIn[dir] = "0";

    let slideOut = {};
    slideOut[dir] = "100vw";

    $(cover).animate(slideIn, 500,function() {
        new Promise((resolve, reject) => {
            // Update contents
            console.log("Page: " + currentPage, "ID: " + currentContentID);
            $(headerContainer).html(contents[currentPage + "-header"]).attr("id", currentPage + "-header");
            $(mainContainer).html("");
            for (let i = 0; i < contents[currentPage + "-main"].length; i++) {
                $(mainContainer).append($(contents[currentPage + "-main"][i]).attr("id", currentPage + "-main-0"));
            }
            resolve();
        }).then(
            $(cover).animate(slideOut, 500, function() {
                cover.remove();
                updateContent();
        }));
    });


}
function scrollToContent(position = 0) {
    // Smooth scroll to element or position
    let contentID = $("#" + pageContentMap[position]);

    if (contentID.length > 0) {
        console.log("Scrolling to " + contentID.attr("id"));
        let targetY = contentID.offset().top;
        $('html, body').animate({scrollTop: targetY},
            function() {document.location.hash = contentID.attr("id");});
    } else {
        console.warn(contentID, "not found");
    }
}

function updatePage(pageName) {
    // Test for listed substring of index in content map layout
    if (pageName === undefined) {
        pageName = getHash();
    }
    let regex = new RegExp ("(" + contentMap.layout.join("|") + ")","i");
    let pageMatch = pageName.match(regex);

    // Test for listed page name successful?
    if (pageMatch !== null) {
        pageName = pageMatch[0];
    } else {
        console.warn("No page found for '" + getHash() + "', showing default page instead.");
        pageName = contentMap.default;
    }

    // No need to change page if already active
    if (pageName === currentPage) {
        console.log("Page " + pageName + " is already active" + currentPage + "!");
        return;
    }

    console.log("Page focus change", currentPage + "=>" + pageName);
    currentPage = pageName;

    // Update page positions
    currentPagePosition = $.inArray(currentPage, contentMap.layout);
    pageCount = contentMap.layout.length;

    // Avoid negative or too big values
    left = (currentPagePosition + pageCount - 1) % pageCount;
    right = (currentPagePosition + pageCount + 1) % pageCount;

    console.log("Page position: " + currentPagePosition + " (" + currentPage + ")\n",
        "Previous: " + left + " (" + contentMap.layout[left] +")\n",
        "Next: " + right + " (" + contentMap.layout[right] +")");

    pageContentMap = [currentPage + "-header"];
    for (let i = 0; i < contentMap[currentPage].main.length; i++) {
        pageContentMap.push(currentPage + "-main-" + i);
    }
    pageContentMap.push("bottom");

    console.log(pageContentMap);

    changePages(currentPagePosition);
}

function updateContent(contentID) {
    // Test for listed substring of index in page content map
    if (contentID === undefined) {
        contentID = getHash();
    }
    let regex = new RegExp ("(" + pageContentMap.join("|") + ")","i");
    let contentMatch = contentID.match(regex);
    console.log(contentID, regex, contentMatch);

    // Test for listed content id successful?
    if (contentMatch !== null) {
        contentID = contentMatch[0];
    } else {
        console.warn("No content found for '" + getHash() + "', showing page header instead.");
        contentID = currentPage + "-header";
    }

    // No need to change content if already active
    if (currentContentID === contentID) {
        console.log("Page " + contentID + " is already active" + currentContentID + "!");
        return;
    }

    console.log("Page focus change", currentContentID + "=>" + contentID);
    currentContentID = contentID;

    // Update content positions
    currentContentPosition = $.inArray(currentContentID, pageContentMap);
    contentCount = pageContentMap.length;

    // Avoid negative or too big values
    up = (currentContentPosition + contentCount - 1) % contentCount;
    down = (currentContentPosition + contentCount + 1) % contentCount;

    console.log("Content position: " + currentContentPosition + " (" + currentContentID + ")\n",
        "Previous: " + up + " (" + pageContentMap[up] +")\n",
        "Next: " + down + " (" + pageContentMap[down] +")");

    scrollToContent(currentContentPosition);
}

function getHash() {
    return window.location.hash;
}