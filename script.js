const USER="uravelgraph";
const REPO="galleries";
const ROOT="assets";

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector("#gallery-grid");

    console.log("Container:", container);
    console.log("People:", PEOPLE);

    PEOPLE.forEach(person => {

        console.log("Adding:", person.name);

        const card = document.createElement("div");

        card.className = "gallery-card";

        card.innerHTML = `
            <h2>${person.name}</h2>
            <p>${person.dob}</p>
            <p>${person.lastAdded}</p>
        `;

        console.log("Card created:", card);

        container.appendChild(card);

        console.log("Container now:", container.innerHTML);

    });

});