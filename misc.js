document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".navbar");
    navbar.innerHTML = `
        <a href="index.html">Galleries</a>
        <a href="#">fourre-tout</a>
    `;

    const container = document.querySelector("#misc-grid");


    MISC.forEach(file => {

        const item = document.createElement("div");

        item.className = "misc-item";

        item.innerHTML = `
            <img 
                src="assets/misc/${file}"
                loading="lazy"
            >
        `;

        container.appendChild(item);

    });


    const iso = new Isotope(container, {
        itemSelector: ".misc-item",
        layoutMode: "masonry",
        masonry: {
            columnWidth: ".misc-item",
            gutter: 10
        }

    });


});