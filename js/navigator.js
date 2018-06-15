let left, right, up, down;
let arrows;
let currentContentPosition, currentPagePosition;
let pageCount, contentCount;

async function displayContent(resolve, reject, contentID = undefined) {
    if (contentID === undefined) {
        contentID = getHash();
    }

    // Test for listed substring of index in content map layout
    let regx = new RegExp ("(" + contentMap.layout.join("|") + ")","i");
    let contentMatch = contentID.match(regx);

    console.log(regx, contentMatch);

    if (contentMatch === null) {
        // TODO display 404 page or similar content?
        console.warn("No page found for '" + currentContentID + "', showing default page instead.");
        changePage(contentMap.default);
        changeContentID(contentMap.default + "-header");
    } else {
        changePage(contentMatch[0]);
        changeContentID(contentID.substr(1));
        if (currentContentID === "" || contents[currentContentID] === undefined) {
            changeContentID(currentPage + "-header");
        }
    }

    console.log("Page: " + currentPage, "ID: " + currentContentID);
    $(headerContainer).html(contents[currentPage + "-header"]).attr("id", currentPage + "-header");
    $(navContainer).html(contents["nav"]);
    $(mainContainer).html(contents[currentPage + "-main"][0]).attr("id", currentPage + "-main-0");
    $(footerContainer).html(contents["footer"]);

    if (arrows === undefined) {
        $(contents["arrows"]).appendTo($("body"));

        arrows = {
            up: $("body a#up-button"),
            down: $("body a#down-button"),
            left: $("body a#left-button"),
            right: $("body a#right-button")
        };

    }

    updateNavigation()
        .catch((reason) => {
            console.error("An error occurred while updating navigation:", reason);
    });
}


async function updateNavigation(resolve, reject) {

    console.log("Updating navigation");

    updatePositions();

    if (currentContentPosition > 0) {
        // Show top arrow
        $(arrows.up).css("display", "initial")
            .on("click", () => {
                scrollVertical(pageContentMap[up])
            })
            .attr("href", "#" + pageContentMap[up]);
        // Show content pill nav
        // Hide left and right arrows
        $(arrows.left).css("display", "none")
            .off("click", "**");
        $(arrows.right).css("display", "none")
            .off("click", "**");
    } else {
        // Hide top arrow and pill nav
        $(arrows.up).css("display", "none")
            .off("click", "**");

        // Show left and right arrows
        $(arrows.left).css("display", "initial")
            .on("click", () => {
                scrollHorizontal(contentMap.layout[left]);
            })
            .attr("href", "#" + contentMap.layout[left]);
        $(arrows.right).css("display", "initial")
            .on("click", () => {
                scrollHorizontal(contentMap.layout[right])
            })
            .attr("href", "#" + contentMap.layout[right]);
    }
    if (currentContentPosition === contentCount - 1){
        // Hide bottom arrow
        $(arrows.down).css("display", "none")
            .off("click", "**");
    } else {
        // Show bottom arrow
        $(arrows.down).css("display", "initial")
            .on("click", () => {
                scrollVertical(pageContentMap[down])
            })
            .attr("href", "#" + pageContentMap[down]);

    }
    console.log(arrows);

    $(window).mousewheel(function (event) {
        // called when the window is scrolled
        // Make sure the values are integers
        let x = parseInt(event.deltaX);
        let y = parseInt(event.deltaY);
        console.log("scrolling", x, y);

        /*
            - deltaX -> left
            + deltaX -> right
            + deltaY -> up
            - deltaY -> down
         */
        if (currentContentPosition === 0) {
            // enable left right
            if (x < 0) {
                scrollHorizontal(contentMap.layout[left]);
            }
            if (x > 0) {
                scrollHorizontal(contentMap.layout[right]);
            }

        } else if (y > 0) {
            // enable up
            scrollVertical(pageContentMap[up]);
        }
        if (currentContentPosition < contentCount - 1 && y < 0){
            // enable down
            scrollVertical(pageContentMap[down]);
        }
    });

    return resolve;
}

function scrollHorizontal(targetPage) {
    // Play page transition
    console.log(targetPage);
}
function scrollVertical(position = 0) {
    // Smooth scroll to element or position
    console.log(position);
    let targetY = position;
    if (isNaN(position)) {
        let id = "#" + position;
        if ($(id).length > 0) {
            targetY = $(id).offset().top;
        } else {
            console.warn(id, "not found");
        }
    }

    $('html, body').animate({
        scrollTop: targetY
    });
}

function changeContentID(contentID) {
    console.log("Content focus change", currentContentID + "=>" + contentID);

    //TODO run tests and checks
    currentContentID = contentID;
}

function changePage (pageName) {
    console.log("Page focus change", currentPage + "=>" + pageName);

    //TODO run tests and checks
    currentPage = pageName;
}

function updatePositions() {
    currentPagePosition = $.inArray(currentPage, contentMap.layout);
    pageCount = contentMap.layout.length;
    // avoid negative or too big values
    left = (currentPagePosition + pageCount - 1) % pageCount;
    right = (currentPagePosition + pageCount + 1) % pageCount;

    // Create a map for all current contents
    pageContentMap = [currentPage + "-header"];
    for (let i = 0; i < contentMap[currentPage].main.length; i++) {
        pageContentMap.push(currentPage + "-main-" + i);
    }

    // avoid negative or too big values
    currentContentPosition = $.inArray(currentContentID, pageContentMap);
    contentCount = pageContentMap.length;
    up = (currentContentPosition + contentCount - 1) % contentCount;
    down = (currentContentPosition + contentCount + 1) % contentCount;

    console.log(left, currentPagePosition, right);
    console.log(up, currentContentPosition, down);
    console.log(pageContentMap);
}

function getHash() {
    return window.location.hash;
}