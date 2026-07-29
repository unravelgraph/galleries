const header = document.querySelector("#header");

fetch("components/header.html")
        .then(response => response.text())
        .then(html => {

            header.innerHTML = html;

        });