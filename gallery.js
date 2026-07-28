document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);


    const personId = params.get("person");
    const folderName = params.get("folder");


    const person = PEOPLE.find(
        p => p.id === personId
    );


    if (!person) {
        console.error("Person not found");
        return;
    }


    const files = person.folders[folderName]
    .sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );


    if (!files) {
        console.error("Folder not found");
        return;
    }


    const navbar = document.querySelector(".navbar");
    navbar.innerHTML = `
        <a href="index.html">Galleries</a>
        <a href="#">${person.name} - ${folderName} (${files.length})</a>
    `;

    const container = document.querySelector("#gallery-images");
    container.className = `${folderName}`;

    files.forEach(file => {

        const img = document.createElement("img");

        img.src =
            `assets/${person.folder}/${folderName}/${file.name}`;

        img.alt = `${person.name} ${folderName}`;
        img.loading = "lazy";

        container.appendChild(img);

    });


});