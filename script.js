const getElem = (selector) => document.querySelector(selector);
const getAllElems = (selector) => document.querySelectorAll(selector);

document.addEventListener('DOMContentLoaded', () => {
    handleSorozatBarat();
    handleOnlineFilmek();
});

///////////////////////////// SOROZATBARÁT /////////////////////////////

function handleSorozatBarat() {
    suppressAdblockerPopup();
    cleanMainPage();
    modifyEpisodePage();
    adjustAdflyLinks();
    tweakAdflyRedirect();
}

function suppressAdblockerPopup() {
    if (urlStartsWith('https://www.sorozat-barat.info')) {
        const popup = getElem('.block-detect-popup');
        if (popup) popup.style.display = 'none';
    }
}

function cleanMainPage() {
    if (isExactUrl('https://www.sorozat-barat.info/')) {
        applyStyles(`#banner, div[style="margin-top: 15px"], .textcontent, .textcontent + hr, .textcontent + hr + br, div[id*="leaderboard"] {
            display: none;
        }`);
    }
}

function modifyEpisodePage() {
    if (urlStartsWith('https://www.sorozat-barat.info/episode/')) {
        const headers = getAllElems('th');
        if (headers[3]) headers[3].textContent = "Hiba";

        applyStyles(`
            .block-detect-popup, .fb_iframe_widget, #banner {
                display: none !important;
            }
            .blank {
                background-color: rgb(197, 197, 197) !important;
            }
            .space {
                margin-left: 0px !important;
            }
            .vbuttons {
                display: flex;
                justify-content: center;
                column-gap: 5px;
            }
            tr:has([id*="leaderboard"], [id*="adsense"]) {
                display: none;
            }
            .vrating {
                margin: 0 !important;
                float: none !important;
                text-align: center !important;
            }
            td:has(.flags) {
                text-align: center;
            }
        `);
    }
}

function adjustAdflyLinks() {
    if (urlStartsWith('https://www.sorozat-barat.info/episode/')) {
        const links = getAllElems('[href^="/video/redirect/"]');
        links.forEach(link => {
            const newUrl = link.href.replace('/video/redirect/', 'https://www.sorozatom.online/ugras-a-videohoz/');
            link.href = newUrl;
        });
    }
}

function tweakAdflyRedirect() {
    if (urlStartsWith('https://www.sorozatom.online/ugras-a-videohoz/')) {
        const formElem = getElem('#searchform > *');
        if (formElem) {
            const originalHref = formElem.getAttribute('href');
            const sanitizedHref = originalHref.replace(/^[^http]*/, '');
            formElem.setAttribute('href', sanitizedHref);
        }
    }
}

///////////////////////////// ONLINE-FILMEK /////////////////////////////

function handleOnlineFilmek() {
    tweakEpisodesPage();
    modifyFilmTables();
}

function tweakEpisodesPage() {
    if (urlStartsWith('https://online-filmek.ac/')) {
        applyStyles(`
            .buttons2 {
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                row-gap: 5px;
            }
            #megoszto_link {
                width: fit-content;
                flex: auto;
            }
        `);
    }
}

function modifyFilmTables() {
    if (urlStartsWith('https://mozinet.me/') || urlStartsWith('https://filmvilag.me/')) {
        applyStyles(`
            .adslot_2 + div + table > thead {
                display: none;
            }
            .kep-play {
                vertical-align: -4px;
            }
            .container_12 div:has(.adslot_1), a:has(img[title*="Rosszlanyok.hu"]) {
                display: none;
            }
            .container_12 {
                width: min-content;
                padding: 0 50px;
            }
            #main_container iframe {
                width: 100% !important;
            }
            .leiras, .leiras a {
                color: white !important;
                background: transparent !important;
            }
            body {
                margin: 0;
            }
        `);
    }
}

//////////////////////////// EGYÉB ///////////////////////////

function isExactUrl(targetUrl) {
    return window.location.href === targetUrl;
}

function urlStartsWith(prefix) {
    return window.location.href.startsWith(prefix);
}

function applyStyles(css) {
    const styleElem = document.createElement('style');
    styleElem.textContent = css;
    document.head.appendChild(styleElem);
}
