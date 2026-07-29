const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const assetsPath = "./assets";
const miscPath = "./misc";
const outputPath = "./data.js";

const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;

function getFileDate(filePath) {

    try {

        const gitDate = execSync(
            `git log -1 --format=%cs -- "${filePath}"`,
            {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"]
            }
        ).trim();

        if (gitDate) {
            return gitDate;
        }

    } catch (e) {
        // Ignore and fall back to filesystem date
    }

    return fs.statSync(filePath)
        .mtime
        .toISOString()
        .split("T")[0];

}

const people = [];
let misc = [];

// ---------- Misc ----------
if (fs.existsSync(miscPath)) {

    misc = fs.readdirSync(miscPath)
        .filter(file => IMAGE_REGEX.test(file))
        .map(file => {

            const filePath = path.join(miscPath, file);

            return {
                name: file,
                date: getFileDate(filePath)
            };

        })
        .sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

}

// ---------- People ----------
if (fs.existsSync(assetsPath)) {

    fs.readdirSync(assetsPath).forEach(folder => {

        const personPath = path.join(assetsPath, folder);

        if (!fs.statSync(personPath).isDirectory()) {
            return;
        }

        const person = {
            id: folder.toLowerCase().replace(/\s+/g, "-"),
            folder,
            folders: {}
        };

        // person.json
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

        fs.readdirSync(personPath).forEach(subfolder => {

            const subfolderPath = path.join(personPath, subfolder);

            if (!fs.statSync(subfolderPath).isDirectory()) {
                return;
            }

            const files = fs.readdirSync(subfolderPath)
                .filter(file => IMAGE_REGEX.test(file))
                .map(file => {

                    const filePath = path.join(
                        subfolderPath,
                        file
                    );

                    const date = getFileDate(filePath);

                    if (
                        !latestDate ||
                        new Date(date) > new Date(latestDate)
                    ) {
                        latestDate = date;
                    }

                    return {
                        name: file,
                        date
                    };

                })
                .sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );

            person.folders[subfolder] = files;

        });

        person.lastAdded = latestDate;

        people.push(person);

    });

}

// ---------- Sort people alphabetically ----------
people.sort((a, b) =>
    (a.name || a.folder).localeCompare(
        b.name || b.folder
    )
);

// ---------- Output ----------
const output = `const PEOPLE = ${JSON.stringify(people, null, 4)};

const MISC = ${JSON.stringify(misc, null, 4)};`;

fs.writeFileSync(outputPath, output);

console.log(
    `Generated data.js (${people.length} people, ${misc.length} misc files)`
);