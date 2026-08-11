const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const assetsPath = "./assets";
const miscPath = "./misc";

const optimizedPath = "./optimized";
const outputPath = "./data.js";

const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;


// ---------- Helpers ----------

function ensureFolder(folder) {

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {
            recursive: true
        });
    }

}


function encodePath(filePath) {

    return filePath
        .replaceAll("\\", "/")
        .split("/")
        .map(part => encodeURIComponent(part))
        .join("/");

}


function getGitDate(filePath) {

    try {

        return execSync(
            `git log -1 --format=%cs -- "${filePath}"`,
            {
                encoding: "utf8"
            }
        ).trim();

    } catch {

        return null;

    }

}


// ---------- FFmpeg conversion ----------

function convertToWebp(input, output) {

    if (fs.existsSync(output)) {

        const inputTime =
            fs.statSync(input).mtime;

        const outputTime =
            fs.statSync(output).mtime;


        if (outputTime >= inputTime) {

            console.log("Skipping:", output);
            return;

        }

    }


    console.log("Converting:");
    console.log(input);
    console.log("→", output);


    ensureFolder(
        path.dirname(output)
    );


    const isGif =
        path.extname(input).toLowerCase() === ".gif";


    if (isGif) {

        execSync(
            `ffmpeg -y -i "${input}" -vcodec libwebp -lossless 0 -q:v 70 -loop 0 -an "${output}"`,
            {
                stdio: "inherit"
            }
        );

    } else {

        execSync(
            `ffmpeg -y -i "${input}" -vcodec libwebp -lossless 0 -q:v 75 "${output}"`,
            {
                stdio: "inherit"
            }
        );

    }

}


// ---------- Misc ----------
// Keeps original files

function buildMisc() {

    const misc = [];


    if (!fs.existsSync(miscPath)) {
        return misc;
    }


    fs.readdirSync(miscPath)
        .filter(file => imageExtensions.test(file))
        .forEach(file => {


            const input =
                path.join(
                    miscPath,
                    file
                );


            misc.push({

                name: file,

                url:
                    encodePath(input),

                date:
                    getGitDate(input)

            });


        });


    return misc;

}


// ---------- People ----------

function buildPeople() {

    const people = [];


    if (!fs.existsSync(assetsPath)) {
        return people;
    }


    fs.readdirSync(assetsPath)
    .forEach(folder => {


        const personPath =
            path.join(
                assetsPath,
                folder
            );


        if (
            !fs.statSync(personPath).isDirectory()
        ) {
            return;
        }



        const person = {

            id:
                folder
                .toLowerCase()
                .replace(/\s+/g, "-"),

            folder,

            folders: {}

        };



        const jsonPath =
            path.join(
                personPath,
                "person.json"
            );


        if (fs.existsSync(jsonPath)) {

            Object.assign(
                person,
                JSON.parse(
                    fs.readFileSync(
                        jsonPath,
                        "utf8"
                    )
                )
            );

        }



        let latestDate = null;



        fs.readdirSync(personPath)
        .forEach(subfolder => {


            const subfolderPath =
                path.join(
                    personPath,
                    subfolder
                );


            if (
                !fs.statSync(subfolderPath).isDirectory()
            ) {
                return;
            }



            const files = [];



            fs.readdirSync(subfolderPath)
            .filter(file => imageExtensions.test(file))
            .forEach(file => {



                const input =
                    path.join(
                        subfolderPath,
                        file
                    );



                const name =
                    file.replace(
                        imageExtensions,
                        ".webp"
                    );



                const output =
                    path.join(
                        optimizedPath,
                        folder,
                        subfolder,
                        name
                    );



                convertToWebp(
                    input,
                    output
                );



                const date =
                    getGitDate(input);



                if (
                    date &&
                    (
                        !latestDate ||
                        new Date(date) >
                        new Date(latestDate)
                    )
                ) {

                    latestDate = date;

                }



                files.push({

                    name,

                    url:
                        output.replaceAll("\\", "/"),

                    date

                });



            });



            person.folders[subfolder] =
                files;



        });



        person.lastAdded =
            latestDate;



        people.push(person);



    });



    return people;

}


// ---------- Build ----------

function build() {


    console.log(
        "Building gallery..."
    );


    const people =
        buildPeople();



    const misc =
        buildMisc();



    const output =
`const PEOPLE = ${JSON.stringify(
    people,
    null,
    4
)};

const MISC = ${JSON.stringify(
    misc,
    null,
    4
)};`;



    fs.writeFileSync(
        outputPath,
        output
    );



    console.log(
        "Generated data.js"
    );


}



try {

    build();

    console.log(
        "Build complete"
    );


} catch(error) {

    console.error(error);

    process.exit(1);

}