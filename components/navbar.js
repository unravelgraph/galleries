const navbar = document.querySelector("#navbar");

fetch("components/navbar.html")
        .then(response => response.text())
        .then(html => {

            navbar.innerHTML = html;

        });