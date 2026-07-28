async function loadLanguage() {

    const browserLanguage =
        navigator.language || navigator.userLanguage;


    // French variants: fr, fr-FR, fr-CA, etc.
    const lang =
        browserLanguage.startsWith("fr")
            ? "fr"
            : "en";


    const response = await fetch(
        `components/lang/${lang}.json`
    );


    const translations = await response.json();


    document.querySelectorAll("[data-lang]")
        .forEach(element => {

            const key = element.dataset.lang;

            element.innerHTML =
                (translations[key] || key)
                    .replace(/\n/g, "<br>");

        });

}