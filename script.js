const USER="uravelgraph";
const REPO="galleries";
const ROOT="assets";

document.addEventListener("DOMContentLoaded", () => {


const container = document.querySelector("#gallery-grid");


PEOPLE.forEach(person => {


    const totalFiles = Object.values(person.folders)
        .reduce((sum, folder) => sum + folder.length, 0);


    const ethnicities = person.ethnicities
        .map(e => e.replace(/\s+/g, "-"))
        .join(" ");


    const card = document.createElement("div");


    card.className = `
        gallery-card
        ${ethnicities}
    `;


    card.innerHTML = `

        <h2>
            ${person.name}
        </h2>


        <p>
            <strong>DOB:</strong>
            ${person.dob}
        </p>


        <p>
            <strong>Ethnicity:</strong>
            ${person.ethnicities.join(", ")}
        </p>


        <p>
            <strong>Total:</strong>
            ${totalFiles} files
        </p>


        <ul>

        ${
            Object.entries(person.folders)
            .map(([folder, files]) => `

                <li>
                    ${folder}:
                    ${files.length}
                </li>

            `)
            .join("")
        }

        </ul>


        <p>
            Last added:
            ${person.lastAdded ?? "Unknown"}
        </p>



        <a href="gallery.html?person=${person.id}">
            View gallery
        </a>

    `;


    container.appendChild(card);


});





const iso = new Isotope(container, {

    itemSelector: ".gallery-card",

    layoutMode: "fitRows"

});





document.querySelectorAll("#filters button")
.forEach(button => {


    button.addEventListener("click", () => {


        const filter = button.dataset.filter;


        iso.arrange({
            filter: filter
        });


    });


});


});