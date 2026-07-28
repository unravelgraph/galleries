async function loadLanguage() {

    const browserLanguage =
        navigator.language || navigator.userLanguage;


    // French variants: fr, fr-FR, fr-CA, etc.
    const lang =
        browserLanguage.startsWith("fr")
            ? "fr"
            : "en";


    const response = await fetch(
        `lang\${lang}.json`
    );


    const translations = await response.json();


    document.querySelectorAll("[data-lang]")
        .forEach(element => {

            const key = element.dataset.lang;

            element.textContent =
                translations[key] || key;

        });

}