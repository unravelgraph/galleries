const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const assetsPath = "./assets";
const miscPath = "./misc";
const outputPath = "./data.js";

const people = [];

// ---------- Misc ----------
let misc = [];

if (fs.existsSync(miscPath)) {

    misc = fs.readdirSync(miscPath)
        .filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        )
        .map(file => {

            const filePath = path.join(miscPath, file);

            const gitDate = execSync(
                `git log -1 --format=%cs -- "${filePath}"`,
                { encoding: "utf8" }
            ).trim();

            return {
                name: file,
                date: gitDate
            };

        });

}

// ---------- People ----------
const folders = fs.readdirSync(assetsPath);

folders.forEach(folder => {

    const personPath = path.join(assetsPath, folder);

    if (!fs.statSync(personPath).isDirectory()) return;

    const person = {
        id: folder.toLowerCase().replace(/\s+/g, "-"),
        folder: folder,
        folders: {}
    };

    // Read person.json
    const jsonPath = path.join(personPath, "person.json");

    if (fs.existsSync(jsonPath)) {

        Object.assign(
            person,
            JSON.parse(
                fs.readFileSync(jsonPath, "utf8")
            )
        );

    }

    let latestDate = null;

    // Scan subfolders
    fs.readdirSync(personPath).forEach(subfolder => {

        const subfolderPath = path.join(personPath, subfolder);

        if (!fs.statSync(subfolderPath).isDirectory()) return;

        const files = fs.readdirSync(subfolderPath)
            .filter(file =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            )
            .map(file => {

                const filePath = path.join(subfolderPath, file);

                const gitDate = execSync(
                    `git log -1 --format=%cs -- "${filePath}"`,
                    { encoding: "utf8" }
                ).trim();

                if (
                    !latestDate ||
                    new Date(gitDate) > new Date(latestDate)
                ) {
                    latestDate = gitDate;
                }

                return {
                    name: file,
                    date: gitDate
                };

            });

        person.folders[subfolder] = files;

    });

    person.lastAdded = latestDate;

    people.push(person);

});

// ---------- Output ----------
const output =
`const PEOPLE = ${JSON.stringify(people, null, 4)};

const MISC = ${JSON.stringify(misc, null, 4)};`;

fs.writeFileSync(outputPath, output);

console.log("Generated data.js");