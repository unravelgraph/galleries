const fs = require("fs");
const path = require("path");

const assetsPath = "./assets";
const outputPath = "./data.js";

const people = [];

const folders = fs.readdirSync(assetsPath);

folders.forEach(folder => {

    const personPath = path.join(assetsPath, folder);

    // Ignore files
    if (!fs.statSync(personPath).isDirectory()) return;

    const person = {
        id: folder.toLowerCase().replace(/\s+/g, "-"),
        folder: folder,
        folders: {}
    };


    // Look for person.json
    const jsonPath = path.join(personPath, "person.json");

    if (fs.existsSync(jsonPath)) {
        Object.assign(
            person,
            JSON.parse(fs.readFileSync(jsonPath, "utf8"))
        );
    }


    // Scan image folders
    fs.readdirSync(personPath).forEach(subfolder => {

        const subfolderPath = path.join(personPath, subfolder);

        if (!fs.statSync(subfolderPath).isDirectory()) return;

        let latestDate = null;

        const files = fs.readdirSync(subfolderPath)
            .filter(file =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            )
            .map(file => {

                const filePath = path.join(subfolderPath, file);

                const stats = fs.statSync(filePath);

                // Check if this file is newer
                if (!latestDate || stats.mtime > latestDate) {
                    latestDate = stats.mtime;
                }

                return file;

            });


        person.folders[subfolder] = files;

    });

    if (latestDate) {
        person.lastAdded = latestDate
        .toISOString()
        .split("T")[0];
    }

    people.push(person);

});


const output =
`const PEOPLE = ${JSON.stringify(people, null, 4)};`;

fs.writeFileSync(outputPath, output);

console.log("Generated data.js");