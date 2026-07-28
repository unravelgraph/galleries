const USER="uravelgraph";
const REPO="galleries";
const ROOT="assets";

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector("#gallery-grid");

    PEOPLE.forEach(person => {

        const card = document.createElement("div");

        card.className = "gallery-card";

        card.innerHTML = `
            <h2>${person.name}</h2>
            <p>${person.dob}</p>
            <p>${person.lastAdded}</p>
        `;

        container.appendChild(card);

    });

});