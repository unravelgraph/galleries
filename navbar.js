const navbar = document.querySelector("#navbar");

fetch("navbar.html")
        .then(response => response.text())
        .then(html => {

            navbar.innerHTML = html;

        });