import fs from 'fs';

let pandocTemplates = JSON.parse(fs.readFileSync('./data/templates.json', {encoding: 'utf8', flag: 'r'}));

if(!process.env.GH_ACCESS_TOKEN){
    throw new Error("GH_ACCESS_TOKEN is not set");
}

async function download(pandocTemplates) {
    for (const pandocTemplate of pandocTemplates) {
        if (pandocTemplate.github_repository) {
            const response = await fetch('https://api.github.com/repos/' + pandocTemplate.github_repository,
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.GH_ACCESS_TOKEN}`,
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                });
            if (response.ok) {
                pandocTemplate.github_repository_json = await response.json();
            } else {
                console.log("Error downloading " + pandocTemplate.github_repository);
                console.log(response);
                return;
            }
        }
    }
    fs.writeFileSync('./data/all.json', JSON.stringify(pandocTemplates));
}

(async () => {
    await download(pandocTemplates)
})();


