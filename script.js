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

    const navbar = document.querySelector(".navbar");
    navbar.innerHTML = `<span><a href="index.html">galleries</a></span><a href="misc.html" class="misc-link">fourre-tout</a>`;

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

            <div class="fcethnicity">${person.ethnicity}</div>

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
    let searchText = "";

    const iso = new Isotope(container, {
        itemSelector: ".gallery-card",
        layoutMode: "vertical",

        getSortData: {
            name: function(itemElem) {

                return itemElem
                    .querySelector(".fcname")
                    .textContent
                    .trim()
                    .toLocaleLowerCase();

            }
        },
        sortBy: "name",
        sortAscending: true,

        filter: function(itemElem) {


            const matchesEthnicity =
                selectedEthnicity === "*" ||
                itemElem.matches(selectedEthnicity);

            const name = normalize(
                itemElem.querySelector(".fcname").textContent
            );

            const matchesSearch =
                name.includes(normalize(searchText));

            return (
                matchesEthnicity &&
                matchesSearch
            );

        }

    });

    const searchInput = document.querySelector("#search");

    searchInput.addEventListener("input", () => {

        searchText = searchInput.value
            .trim()
            .toLowerCase();

        iso.arrange();

    });

    function normalize(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    document.querySelectorAll("#filters button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const filterValue = button.dataset.filter;

                selectedEthnicity = filterValue;

                iso.arrange();

            });

        });

});