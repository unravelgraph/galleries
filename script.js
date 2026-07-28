const USER="uravelgraph";
const REPO="galleries";
const ROOT="assets";

const DEBUG = true;
function debug(...args) {
    if (DEBUG) {
        console.log("[Gallery Debug]", ...args);
    }
}

function calculateAge(dob) {

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}


document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector("#gallery-grid");

    //debug("Container:", container);


    // Generate filters
    const filterContainer = document.querySelector("#filters");
    debug("Filter container:", filterContainer);

    const ethnicity = new Set();

    PEOPLE.forEach(person => {

        (person.ethnicity || [])
            .forEach(e => ethnicity.add(e));

    });


    // Add "All" button first
    filterContainer.innerHTML = `
        <button data-filter="*">
            All
        </button>
    `;


    ethnicity.forEach(ethnicity => {

        const button = document.createElement("button");

        button.dataset.filter = "." + ethnicity.replace(/\s+/g, "-");

        button.textContent = ethnicity;

        filterContainer.appendChild(button);

    });

    debug("Ethnicities:", [...ethnicity]);


    // Add Cards
    //debug("People:", PEOPLE);
    PEOPLE.forEach(person => {

        debug("Adding:", person.name);

        const card = document.createElement("div");

        const age = calculateAge(person.dob);
        card.dataset.age = age;

        const ethnicityClasses = (person.ethnicity || [])
            .map(e => e.replace(/\s+/g, "-"))
            .join(" ");

        card.className = `gallery-card ${ethnicityClasses}`;

        card.innerHTML = `
            <div class="fcname">${person.name}</div>
            <div class="dob">${person.dob}</div>
            <div class="lastupdate">${person.lastAdded}</div>
        `;

        container.appendChild(card);

    });

    let selectedEthnicity = "*";

    let minAge = 18;
    let maxAge = 100;

    const iso = new Isotope(container, {
        itemSelector: ".gallery-card",
        layoutMode: "vertical",
        filter: function(itemElem) {

            const matchesEthnicity =
                selectedEthnicity === "*" ||
                itemElem.classList.contains(
                    selectedEthnicity.replace(".", "")
                );


            const age = Number(itemElem.dataset.age);


            const matchesAge =
                age >= minAge &&
                age <= maxAge;


            return matchesEthnicity && matchesAge;

        }
    });

    const minSlider = document.querySelector("#min-age");
    const maxSlider = document.querySelector("#max-age");
    const ageValue = document.querySelector("#age-value");


    function updateAgeFilter() {

        minAge = Number(minSlider.value);
        maxAge = Number(maxSlider.value);


        // Prevent min going above max
        if (minAge > maxAge) {
            minAge = maxAge;
            minSlider.value = minAge;
        }


        ageValue.textContent = `${minAge} - ${maxAge}`;


        iso.arrange();

    }


    minSlider.addEventListener(
        "input",
        updateAgeFilter
    );


    maxSlider.addEventListener(
        "input",
        updateAgeFilter
    );


    updateAgeFilter();

    document.querySelectorAll("#filters button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const filterValue = button.dataset.filter;

                selectedEthnicity = filterValue;

                iso.arrange();

            });

        });

});