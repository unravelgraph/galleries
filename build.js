const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");

const assetsPath = "./assets";
const miscPath = "./misc";

const optimizedPath = "./optimized";
const thumbsPath = "./thumbs";

const outputPath = "./data.js";

const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;


// ---------- Helpers ----------

function gitDate(filePath) {

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


function ensureFolder(folder) {

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {
            recursive: true
        });
    }

}


// ---------- Convert normal images ----------

async function convertImage(input, output) {

    await sharp(input)
        .resize({
            width: 800,
            withoutEnlargement: true
        })
        .webp({
            quality: 82,
            effort: 6
        })
        .toFile(output);

}


// ---------- Convert animated GIF ----------

function convertGif(input, output) {

    execSync(
        `ffmpeg -y -i "${input}" -vf "scale='min(800,iw)':-2" -c:v libwebp -q:v 70 -loop 0 "${output}"`,
        {
            stdio: "inherit"
        }
    );

}


// ---------- Thumbnail ----------

async function createThumb(input, output) {

    await sharp(input)
        .resize({
            width: 250,
            withoutEnlargement: true
        })
        .webp({
            quality: 70
        })
        .toFile(output);

}


// ---------- Process file ----------

async function processFile(
    input,
    optimized,
    thumb
) {

    ensureFolder(path.dirname(optimized));
    ensureFolder(path.dirname(thumb));


    if (
        path.extname(input).toLowerCase() === ".gif"
    ) {

        convertGif(
            input,
            optimized
        );

    } else {

        await convertImage(
            input,
            optimized
        );

    }


    await createThumb(
        input,
        thumb
    );

}


// ---------- Misc ----------

async function buildMisc() {

    const misc = [];

    if (!fs.existsSync(miscPath)) {
        return misc;
    }


    const files = fs.readdirSync(miscPath)
        .filter(file => imageExtensions.test(file));


    for (const file of files) {

        const input =
            path.join(
                miscPath,
                file
            );


        const output =
            path.join(
                optimizedPath,
                "misc",
                file.replace(
                    imageExtensions,
                    ".webp"
                )
            );


        const thumb =
            path.join(
                thumbsPath,
                "misc",
                file.replace(
                    imageExtensions,
                    ".webp"
                )
            );


        await processFile(
            input,
            output,
            thumb
        );


        misc.push({

            name: file.replace(
                imageExtensions,
                ".webp"
            ),

            url: output.replaceAll("\\", "/"),

            thumb: thumb.replaceAll("\\", "/"),

            date: gitDate(input)

        });

    }


    return misc;

}


// ---------- People ----------

async function buildPeople() {

    const people = [];


    if (!fs.existsSync(assetsPath)) {
        return people;
    }


    const folders =
        fs.readdirSync(assetsPath);


    for (const folder of folders) {


        const personPath =
            path.join(
                assetsPath,
                folder
            );


        if (
            !fs.statSync(personPath).isDirectory()
        ) {
            continue;
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


        const subfolders =
            fs.readdirSync(personPath);


        for (const subfolder of subfolders) {


            const subfolderPath =
                path.join(
                    personPath,
                    subfolder
                );


            if (
                !fs.statSync(subfolderPath).isDirectory()
            ) {
                continue;
            }


            const files = [];


            const images =
                fs.readdirSync(subfolderPath)
                .filter(file =>
                    imageExtensions.test(file)
                );


            for (const file of images) {


                const input =
                    path.join(
                        subfolderPath,
                        file
                    );


                const webpName =
                    file.replace(
                        imageExtensions,
                        ".webp"
                    );


                const optimized =
                    path.join(
                        optimizedPath,
                        folder,
                        subfolder,
                        webpName
                    );


                const thumb =
                    path.join(
                        thumbsPath,
                        folder,
                        subfolder,
                        webpName
                    );


                await processFile(
                    input,
                    optimized,
                    thumb
                );


                const date =
                    gitDate(input);


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

                    name: webpName,

                    url:
                        optimized
                        .replaceAll("\\", "/"),

                    thumb:
                        thumb
                        .replaceAll("\\", "/"),

                    date

                });

            }


            person.folders[subfolder] =
                files;

        }


        person.lastAdded =
            latestDate;


        people.push(person);

    }


    return people;

}


// ---------- Build ----------

async function build() {


    console.log("Building gallery...");


    const people =
        await buildPeople();


    const misc =
        await buildMisc();


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


build()
    .then(() => {

        console.log(
            "Build complete"
        );

    })
    .catch(err => {

        console.error(err);

        process.exit(1);

    });