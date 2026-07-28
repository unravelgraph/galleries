const navbar = document.querySelector("#navbar");

    if (!navbar) return;


    fetch("navbar.html")
        .then(response => response.text())
        .then(html => {

            navbar.innerHTML = html;

        });