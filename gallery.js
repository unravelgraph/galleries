document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const personId = params.get("person");
    const folderName = params.get("folder");


    const person =
        PEOPLE.find(
            p => p.id === personId
        );


    if (!person) {
        console.error("Person not found:", personId);
        return;
    }


    const files =
        person.folders[folderName];


    if (!files) {
        console.error("Folder not found:", folderName);
        return;
    }



    // ---------- Navbar ----------

    const navbar =
        document.querySelector(".navbar");


    if (navbar) {

        navbar.innerHTML = `

            <a href="index.html">
                galleries
            </a>

            <a href="#">
                ${person.name || person.folder}
                - ${folderName}
                (${files.length})
            </a>

        `;

    }



    // ---------- Title ----------

    const title =
        document.querySelector(".gallery-title");


    if (title) {

        title.textContent =
            `${person.name || person.folder} - ${folderName}`;

    }



    // ---------- Gallery ----------

    const container =
        document.querySelector("#gallery");


    if (!container) {
        return;
    }


    files.forEach(file => {


        const img =
            document.createElement("img");


        // Uses optimized WebP URL
        // Handles spaces automatically
        img.src = encodeURI(file.url);


        img.alt =
            `${person.name || person.folder} ${folderName}`;


        img.loading =
            "lazy";


        container.appendChild(img);


    });



});