let load = async function(resolve, reject){
    console.log("loading");
    // TODO Display cover screen

    // container for all async gets
    let gettersArray = [];

    let root = contentMap.folder;
    // kick off getters for page contents
    for (let i = 0; i < contentMap.layout.length; i++) {
        const pageKey = contentMap.layout[i];
        const pageRoot = root + contentMap[pageKey].folder;

        gettersArray.push($.get(pageRoot + contentMap[pageKey].header, (data) => {
            contents[pageKey + "-header"] = data;
        }));
        gettersArray.push($.get(pageRoot + contentMap[pageKey].nav, (data) => {
            contents[pageKey + "-nav"] = data;
        }));

        contents[pageKey + "-main"] = [];
        for (let j = 0; j < contentMap[pageKey].main.length; j++) {
            const file = pageRoot + contentMap[pageKey].main[j];
            gettersArray.push($.get(file, (data) => {
                contents[pageKey + "-main"][j] = data;
            }));
        }
    }

    gettersArray.push($.get(root + contentMap.footer, (data) => {
        contents["footer"] = data;
    }));
    gettersArray.push($.get(root + contentMap.nav, (data) => {
        contents["nav"] = data;
    }));
    gettersArray.push($.get(root + contentMap.arrows, (data) => {
        contents["arrows"] = data;
    }));


    // kick of getters for modals
    for (const modalKey in contentMap.modals) {
        gettersArray.push($.get(root + contentMap.modals[modalKey], (data) => {
            modals[modalKey] = data;
        }));
    }

    // load scripts
    gettersArray.push($.getScript("js/navigator.js"));

    // wait for all content to be loaded
    $.when.apply($, gettersArray).then((t, u, v, s) => {
        console.log(contents);
        // TODO Hide loading cover
        return resolve();
    }).catch((error) => {
        return reject(error)
    });
};