document.addEventListener("DOMContentLoaded", () => {

    loadLanguage();
    
    const overlay = document.querySelector("#popup-overlay");
    const agree = document.querySelector("#popup-agree");

    if (!overlay || !agree) return;


    if (sessionStorage.getItem("popupAgreed") === "true") {
        overlay.style.display = "none";
    }


    agree.addEventListener("click", () => {

        overlay.style.display = "none";

        sessionStorage.setItem(
            "popupAgreed",
            "true"
        );

    });

});