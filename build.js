const fs = require("fs");
const path = require("path");

const assetsPath = "./assets";
const miscPath = "./assets/misc";
const outputPath = "./data.js";

const misc = fs.readdirSync(miscPath)
    .filter(file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
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
    let latestDate = null;

    fs.readdirSync(personPath).forEach(subfolder => {

        const subfolderPath = path.join(personPath, subfolder);

        if (!fs.statSync(subfolderPath).isDirectory()) return;

        const files = fs.readdirSync(subfolderPath)
            .filter(file =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            )
            .map(file => {

                const filePath = path.join(subfolderPath, file);
                const stats = fs.statSync(filePath);

                if (!latestDate || stats.mtime > latestDate) {
                    latestDate = stats.mtime;
                }

                return {
                    name: file,
                    date: stats.mtime
                        .toISOString()
                        .split("T")[0]
                };

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
`const PEOPLE = ${JSON.stringify(people, null, 4)};

const MISC = ${JSON.stringify(misc, null, 4)};`;

fs.writeFileSync(outputPath, output);

console.log("Generated data.js");