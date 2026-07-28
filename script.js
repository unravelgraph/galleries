const USER="uravelgraph";
const REPO="galleries";
const ROOT="assets";

const DEBUG = true;
function debug(...args) {
    if (DEBUG) {
        console.log("[Gallery Debug]", ...args);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector("#gallery-grid");

    //debug("Container:", container);


    // Generate filters
    const filterContainer = document.querySelector("#filters");
    debug("Filter container:", filterContainer);

    const ethnicities = new Set();

    PEOPLE.forEach(person => {

        (person.ethnicities || [])
            .forEach(e => ethnicities.add(e));

    });


    // Add "All" button first
    filterContainer.innerHTML = `
        <button data-filter="*">
            All
        </button>
    `;


    ethnicities.forEach(ethnicity => {

        const button = document.createElement("button");

        button.dataset.filter = "." + ethnicity.replace(/\s+/g, "-");

        button.textContent = ethnicity;

        filterContainer.appendChild(button);

    });

    debug("Ethnicities:", [...ethnicities]);


    // Add Cards
    //debug("People:", PEOPLE);
    PEOPLE.forEach(person => {

        debug("Adding:", person.name);

        const card = document.createElement("div");

        const ethnicityClasses = (person.ethnicities || [])
            .map(e => e.replace(/\s+/g, "-"))
            .join(" ");

        card.className = `gallery-card ${ethnicityClasses}`;

        card.innerHTML = `
            <h2>${person.name}</h2>
            <p>${person.dob}</p>
            <p>${person.lastAdded}</p>
        `;

        container.appendChild(card);

    });

    const iso = new Isotope(container, {
        itemSelector: ".gallery-card",
        layoutMode: "vertical"
    });

    document.querySelectorAll("#filters button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const filterValue = button.dataset.filter;

                iso.arrange({
                    filter: filterValue
                });

            });

        });

});