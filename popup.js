document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.querySelector("#popup-overlay");
    const close = document.querySelector("#popup-close");

    if (!overlay || !close) return;

    if (sessionStorage.getItem("popupClosed") === "true") {
        overlay.style.display = "none";
    }


    close.addEventListener("click", () => {

        overlay.style.display = "none";

        sessionStorage.setItem(
            "popupClosed",
            "true"
        );

    });

});