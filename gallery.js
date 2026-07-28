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


    const files = person.folders[folderName];


    if (!files) {
        console.error("Folder not found");
        return;
    }


    document.querySelector("#gallery-title").textContent =
        `${person.name} - ${folderName}`;



    const container = document.querySelector("#gallery-images");


    files.forEach(file => {

        const img = document.createElement("img");

        img.src = 
            `assets/${person.folder}/${folderName}/${file}`;

        img.alt = person.name;


        container.appendChild(img);

    });


});