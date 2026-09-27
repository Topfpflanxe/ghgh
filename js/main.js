/* =====================================================
STERNE
===================================================== */

function makeStars(id) {

    const container =
        document.getElementById(id);

    if (!container) return;

    for (let i = 0; i < 100; i++) {

        const star =
            document.createElement("div");

        star.className =
            "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animationDelay =
            Math.random() * 5 + "s";

        star.style.animationDuration =
            2 + Math.random() * 4 + "s";

        container.appendChild(star);
    }
}

makeStars("stars");
makeStars("starsHome");


/* =====================================================
PASSWORT SCREEN ÖFFNEN
===================================================== */

function openPassword() {

    const intro =
        document.getElementById("intro");

    const passwordPage =
        document.getElementById("passwordPage");

    if (!intro || !passwordPage) return;

    intro.classList.add("hidden");
    passwordPage.classList.remove("hidden");

    setTimeout(() => {

        const pass =
            document.getElementById("pass");

        if (pass) {
            pass.focus();
        }

    }, 300);
}


/* =====================================================
ENTER-TASTE
===================================================== */

const passInput =
    document.getElementById("pass");

if (passInput) {

    passInput.addEventListener(
        "keydown",
        function(e) {

            if (e.key === "Enter") {

                e.preventDefault();

                unlock();
            }

        }
    );
}


/* =====================================================
PASSWÖRTER
===================================================== */

const MAIN_PASSWORD =
    "HappyB-Day40";

const SECRET_PASSWORD =
    "G1234";

let secretMode = false;


/* =====================================================
UNLOCK
===================================================== */

let unlocking = false;

function unlock() {

    if (unlocking) return;

    const passElement =
        document.getElementById("pass");

    const error =
        document.getElementById("error");

    if (!passElement || !error) return;

    const pass =
        passElement.value;


    if (
        pass !== MAIN_PASSWORD &&
        pass !== SECRET_PASSWORD
    ) {

        error.textContent =
            "Hmm... das war noch nicht richtig. ♡";

        passElement.value = "";

        passElement.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },
                {
                    transform:
                        "translateX(-8px)"
                },
                {
                    transform:
                        "translateX(8px)"
                },
                {
                    transform:
                        "translateX(-5px)"
                },
                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration: 350
            }
        );

        return;
    }


    unlocking = true;

    error.textContent = "";

    document.body.style.overflow =
        "hidden";


    secretMode =
        pass === SECRET_PASSWORD;


    const transition =
        document.getElementById(
            "unlockTransition"
        );

    const passwordPage =
        document.getElementById(
            "passwordPage"
        );

    const home =
        document.getElementById(
            "home"
        );


    if (
        !transition ||
        !passwordPage ||
        !home
    ) {
        unlocking = false;
        return;
    }


    passwordPage.classList.remove(
        "hidden"
    );

    home.classList.add(
        "hidden"
    );


    transition.style.display =
        "block";

    transition.classList.remove(
        "play"
    );

    void transition.offsetWidth;

    transition.classList.add(
        "play"
    );


    setTimeout(() => {

        passwordPage.classList.add(
            "hidden"
        );

        home.classList.remove(
            "hidden"
        );

        const app =
            document.getElementById("app");

        if (app) {
            app.scrollTop = 0;
        }

        home.style.animation =
            "pageIn 1.4s cubic-bezier(.2,.8,.2,1)";

        setTimeout(() => {

            home.style.animation =
                "";

        }, 1500);


        if (secretMode) {

            console.log(
                "Geheimer Zugang aktiviert."
            );
        }

    }, 3500);


    setTimeout(() => {

        transition.classList.remove(
            "play"
        );

        transition.style.display =
            "none";

        unlocking = false;

        document.body.style.overflow =
            "hidden";

        confetti();

    }, 5200);
}


/* =====================================================
TIMELINE-BILDER
===================================================== */

/*
    Bilder liegen hier:

    assets/images/timeline/

    Normal:
    Titel -> Bild

    Geburt       -> Geburt.jpeg
    Konfirmation -> Konfirmation.jpeg

    2026 ist ein Sonderfall:
    Titel ist "Dieses Jahr",
    Bild heißt aber "2026.jpeg".
*/

const TIMELINE_IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp"
];


function loadTimelineImage(
    container,
    fileName
) {

    if (!container || !fileName) {
        return;
    }


    container.textContent =
        "FOTO";


    let extensionIndex = 0;


    function tryNextImage() {

        if (
            extensionIndex >=
            TIMELINE_IMAGE_EXTENSIONS.length
        ) {

            console.warn(
                "Kein Timeline-Bild gefunden für:",
                fileName
            );

            return;
        }


        const extension =
            TIMELINE_IMAGE_EXTENSIONS[
                extensionIndex
            ];

        extensionIndex++;


        const image =
            new Image();


        image.alt =
            fileName;

        image.className =
            "timeline-image";

        image.decoding =
            "async";


        image.onload =
            function() {

                container.replaceChildren(
                    image
                );
            };


        image.onerror =
            function() {

                tryNextImage();
            };


        image.src =
            "assets/images/timeline/" +
            encodeURIComponent(
                fileName
            ) +
            "." +
            extension;
    }


    tryNextImage();
}


function initTimelineImages() {

    const events =
        document.querySelectorAll(
            "#timeline .event"
        );


    events.forEach(
        function(event) {

            const titleElement =
                event.querySelector(
                    ".event-info h3"
                );

            const yearElement =
                event.querySelector(
                    ".event-info .year"
                );

            const imageContainer =
                event.querySelector(
                    ".event-img"
                );


            if (
                !titleElement ||
                !imageContainer
            ) {
                return;
            }


            const title =
                titleElement
                    .textContent
                    .trim();


            const year =
                yearElement
                    ? yearElement
                        .textContent
                        .trim()
                    : "";


            /*
                WICHTIG:

                2026 heißt sichtbar:
                "Dieses Jahr"

                Das Bild heißt aber:
                "2026.jpeg"

                Deshalb verwenden wir hier
                ausdrücklich das Jahr.
            */

            let imageName;


            if (year === "2026") {

                imageName =
                    "2026";

            } else {

                imageName =
                    title;
            }


            loadTimelineImage(
                imageContainer,
                imageName
            );
        }
    );
}


/*
    Erst laden, wenn das komplette
    HTML vorhanden ist.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initTimelineImages
    );

} else {

    initTimelineImages();
}


/* =====================================================
TIMELINE MEMORY LIGHTBOX
===================================================== */

function openMemory(
    year,
    title,
    text,
    source
) {

    const modal =
        document.getElementById(
            "memoryModal"
        );

    const yearElement =
        document.getElementById(
            "memoryYear"
        );

    const titleElement =
        document.getElementById(
            "memoryTitle"
        );

    const textElement =
        document.getElementById(
            "memoryText"
        );

    const image =
        document.getElementById(
            "memoryImage"
        );


    if (
        !modal ||
        !yearElement ||
        !titleElement ||
        !textElement ||
        !image
    ) {
        return;
    }


    yearElement.textContent =
        year;

    titleElement.textContent =
        title;

    textElement.textContent =
        text;


    if (source) {

        image.innerHTML =
            source.innerHTML;

    } else {

        image.innerHTML =
            "FOTO";
    }


    const img =
        image.querySelector("img");


    if (img) {

        img.style.width =
            "100%";

        img.style.height =
            "100%";

        img.style.objectFit =
            "cover";

        img.style.display =
            "block";
    }


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";
}


function closeMemory() {

    const modal =
        document.getElementById(
            "memoryModal"
        );

    if (!modal) return;

    modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


const memoryModal =
    document.getElementById(
        "memoryModal"
    );


if (memoryModal) {

    memoryModal.addEventListener(
        "click",
        function(e) {

            if (
                e.target.id ===
                "memoryModal"
            ) {

                closeMemory();
            }

        }
    );
}


/* =====================================================
ESCAPE SCHLIESST MEMORY
===================================================== */

document.addEventListener(
    "keydown",
    function(e) {

        if (
            e.key === "Escape"
        ) {

            closeMemory();
        }

    }
);


/* =====================================================
NAVIGATION
===================================================== */

function go(id) {

    const pages = [
        "home",
        "about",
        "timeline",
        "gallery",
        "secret",
        "video",
        "final"
    ];


    pages.forEach(
        function(page) {

            const element =
                document.getElementById(
                    page
                );

            if (element) {

                element.classList.add(
                    "hidden"
                );
            }

        }
    );


    const target =
        document.getElementById(
            id
        );


    if (target) {

        target.classList.remove(
            "hidden"
        );


        const app =
            document.getElementById(
                "app"
            );

        if (app) {
            app.scrollTop = 0;
        }


        animatePage(
            target
        );
    }
}


/* =====================================================
SEITEN-ANIMATION
===================================================== */

function animatePage(page) {

    if (!page) return;

    page.style.animation =
        "none";

    void page.offsetWidth;

    page.style.animation =
        "pageIn .8s cubic-bezier(.2,.8,.2,1)";
}


/* =====================================================
POPUP
===================================================== */

function message(text) {

    const popupText =
        document.getElementById(
            "popupText"
        );

    const popup =
        document.getElementById(
            "popup"
        );


    if (
        !popupText ||
        !popup
    ) {
        return;
    }


    popupText.textContent =
        text;

    popup.classList.remove(
        "hidden"
    );
}


function closePopup() {

    const popup =
        document.getElementById(
            "popup"
        );

    if (!popup) return;

    popup.classList.add(
        "hidden"
    );
}


const popup =
    document.getElementById(
        "popup"
    );


if (popup) {

    popup.addEventListener(
        "click",
        function(e) {

            if (
                e.target.id ===
                "popup"
            ) {

                closePopup();
            }

        }
    );
}


/* =====================================================
CONFETTI
===================================================== */

function confetti() {

    const colors = [
        "#f29ddd",
        "#c45db9",
        "#9a62c5",
        "#fff",
        "#eeb3e5",
        "#e99a75"
    ];


    for (
        let i = 0;
        i < 65;
        i++
    ) {

        const c =
            document.createElement(
                "div"
            );

        c.className =
            "confetti";


        c.style.left =
            Math.random() *
            100 +
            "vw";


        c.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        c.style.animationDuration =
            2 +
            Math.random() * 3 +
            "s";


        c.style.animationDelay =
            Math.random() * .7 +
            "s";


        document.body.appendChild(
            c
        );


        setTimeout(
            function() {

                c.remove();

            },
            5000
        );
    }
}


/* =====================================================
SWIPE AUF STARTSCREEN
===================================================== */

let touchStart = 0;


const app =
    document.getElementById(
        "app"
    );


if (app) {

    app.addEventListener(
        "touchstart",
        function(e) {

            touchStart =
                e.touches[0]
                    .clientY;

        },
        {
            passive: true
        }
    );


    app.addEventListener(
        "touchend",
        function(e) {

            const touchEnd =
                e.changedTouches[0]
                    .clientY;


            const diff =
                touchStart -
                touchEnd;


            if (
                Math.abs(diff) < 80
            ) {
                return;
            }


            const intro =
                document.getElementById(
                    "intro"
                );


            if (
                intro &&
                !intro.classList.contains(
                    "hidden"
                ) &&
                diff > 0
            ) {

                openPassword();
            }

        },
        {
            passive: true
        }
    );
}


/* =====================================================
DOPPELTIPPEN-ZOOM VERHINDERN
===================================================== */

let lastTouchEnd = 0;


document.addEventListener(
    "touchend",
    function(e) {

        const now =
            Date.now();


        if (
            now - lastTouchEnd <= 300
        ) {

            e.preventDefault();
        }


        lastTouchEnd =
            now;

    },
    {
        passive: false
    }
);
