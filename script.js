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

            <div class="fcname">${person.ethnicity}</div>

            <div class="dob">
                ${person.dob} <i>(${age} yo)</i>
            </div>

            <div class="fcgalleries">
            ${
                Object.entries(person.folders)
                .map(([folder, files]) => `

                    <a 
                        class="fc${folder}galleries"
                        href="gallery.html?person=${person.id}&folder=${folder}">
                        ${files.length} ${folder}
                    </a>

                `)
                .join("")
            }
            </div>

            <div class="lastupdate">
                <i>last update:</i> ${person.lastAdded}
            </div>
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

            const age = Number(itemElem.dataset.age);

            const matchesAge =
                age >= minAge &&
                age <= maxAge;

            const matchesEthnicity =
                selectedEthnicity === "*" ||
                itemElem.matches(selectedEthnicity);

            return matchesAge && matchesEthnicity;
        }
    });

    let minAge = 18;
    let maxAge = 100;

    const ageSlider = document.querySelector("#age-slider");
    const ageRange = document.querySelector("#age-range");

    noUiSlider.create(ageSlider, {
        start: [18, 100],
        connect: true,
        step: 1,
        range: {
            min: 18,
            max: 100
        }
    });

    ageSlider.noUiSlider.on("update", (values) => {

        minAge = Math.round(values[0]);
        maxAge = Math.round(values[1]);

        ageRange.textContent = `${minAge} – ${maxAge}`;

        iso.arrange();

    });

    document.querySelectorAll("#filters button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const filterValue = button.dataset.filter;

                selectedEthnicity = filterValue;

                iso.arrange();

            });

        });

});