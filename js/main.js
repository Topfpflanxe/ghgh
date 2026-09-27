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

    document
        .getElementById("intro")
        .classList.add("hidden");

    document
        .getElementById("passwordPage")
        .classList.remove("hidden");

    setTimeout(() => {

        document
            .getElementById("pass")
            .focus();

    }, 300);
}


/* =====================================================
ENTER-TASTE
===================================================== */

document
    .getElementById("pass")
    .addEventListener(
        "keydown",
        function(e) {

            if (e.key === "Enter") {

                e.preventDefault();

                unlock();
            }

        }
    );


/* =====================================================
PASSWÖRTER
===================================================== */

const MAIN_PASSWORD =
    "HappyB-Day40";

const SECRET_PASSWORD =
    "G1234";

let secretMode = false;


/* =====================================================
🔐 UNLOCK
===================================================== */

let unlocking = false;

function unlock() {

    if (unlocking) return;

    const pass =
        document
            .getElementById("pass")
            .value;

    const error =
        document
            .getElementById("error");


    if (
        pass !== MAIN_PASSWORD &&
        pass !== SECRET_PASSWORD
    ) {

        error.textContent =
            "Hmm... das war noch nicht richtig. ♡";

        const input =
            document
                .getElementById("pass");

        input.value = "";

        input.animate(
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

        document
            .getElementById("app")
            .scrollTop = 0;

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
🖼️ TIMELINE-BILDER AUTOMATISCH LADEN
===================================================== */

/*
   Bilder kommen automatisch aus:
   assets/images/timeline/

   Der Dateiname entspricht dabei exakt dem Titel der Timeline:
   Geburt     -> Geburt.jpeg
   Hochzeit   -> Hochzeit.jpg
   etc.

   Unterstützte Endungen: jpg, jpeg, png, webp
*/

const TIMELINE_IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp"
];

function loadTimelineImage(container, title) {

    if (!container || !title) return;

    const fileName = title.trim();
    let extensionIndex = 0;

    // Platzhalter erst einmal behalten, bis ein Bild wirklich geladen wurde.
    container.textContent = "FOTO";

    function tryNextImage() {

        if (extensionIndex >= TIMELINE_IMAGE_EXTENSIONS.length) {
            console.warn(
                "Kein Timeline-Bild gefunden für:",
                fileName
            );
            return;
        }

        const extension =
            TIMELINE_IMAGE_EXTENSIONS[extensionIndex++];

        const image = new Image();

        image.alt = fileName;
        image.className = "timeline-image";
        image.decoding = "async";

        image.onload = function() {
            container.replaceChildren(image);
        };

        image.onerror = function() {
            tryNextImage();
        };

        /*
           Wichtig: kein loading="lazy".
           Die Timeline liegt beim Start auf display:none.
           Lazy-Loading kann bei solchen versteckten Bereichen
           dazu führen, dass das Bild erst gar nicht geladen wird.
        */
        image.src =
            "assets/images/timeline/" +
            encodeURIComponent(fileName) +
            "." +
            extension;
    }

    tryNextImage();
}

function initTimelineImages() {

    const events =
        document.querySelectorAll("#timeline .event");

    events.forEach(event => {

        const titleElement =
            event.querySelector(".event-info h3");

        const imageContainer =
            event.querySelector(".event-img");

        if (!titleElement || !imageContainer) return;

        loadTimelineImage(
            imageContainer,
            titleElement.textContent
        );
    });
}

/*
   Sicherstellen, dass das komplette HTML vorhanden ist,
   bevor die Timeline-Bilder gesucht werden.
*/
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initTimelineImages
    );
} else {
    initTimelineImages();
}


/* =====================================================
⭐ TIMELINE MEMORY LIGHTBOX
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

    modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


document
    .getElementById("memoryModal")
    .addEventListener(
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


    pages.forEach(page => {

        const element =
            document.getElementById(page);

        if (element) {

            element.classList.add(
                "hidden"
            );
        }

    });


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.remove(
            "hidden"
        );

        document
            .getElementById("app")
            .scrollTop = 0;

        animatePage(target);
    }
}


/* =====================================================
SEITEN-ANIMATION
===================================================== */

function animatePage(page) {

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

    document
        .getElementById("popupText")
        .textContent = text;

    document
        .getElementById("popup")
        .classList.remove(
            "hidden"
        );
}


function closePopup() {

    document
        .getElementById("popup")
        .classList.add(
            "hidden"
        );
}


document
    .getElementById("popup")
    .addEventListener(
        "click",
        e => {

            if (
                e.target.id ===
                "popup"
            ) {

                closePopup();
            }

        }
    );


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

        document.body.appendChild(c);


        setTimeout(() => {

            c.remove();

        }, 5000);
    }
}


/* =====================================================
SWIPE AUF STARTSCREEN
===================================================== */

let touchStart = 0;


document
    .getElementById("app")
    .addEventListener(
        "touchstart",
        e => {

            touchStart =
                e.touches[0]
                    .clientY;

        },
        {
            passive: true
        }
    );


document
    .getElementById("app")
    .addEventListener(
        "touchend",
        e => {

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
                document
                    .getElementById(
                        "intro"
                    );


            if (
                !intro.classList.contains(
                    "hidden"
                )
                &&
                diff > 0
            ) {

                openPassword();
            }

        },
        {
            passive: true
        }
    );


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


        lastTouchEnd = now;

    },
    {
        passive: false
    }
);
