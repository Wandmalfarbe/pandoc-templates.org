import fs from 'fs';

let pandocTemplates = JSON.parse(fs.readFileSync('./src/_data/templates-unprocessed.json', {encoding: 'utf8', flag: 'r'}));

if (!process.env.GH_ACCESS_TOKEN) {
    throw new Error("GH_ACCESS_TOKEN is not set");
}

const httpOptions = {
    headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${process.env.GH_ACCESS_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28"
    }
}

async function downloadMetadata(pandocTemplates) {
    for (const pandocTemplate of pandocTemplates) {
        if (pandocTemplate.github_repository) {
            pandocTemplate.github_repository_json = await fetchGithubJson(`https://api.github.com/repos/${pandocTemplate.github_repository}`)
            pandocTemplate.github_repository_releases_json = await fetchGithubJson(`https://api.github.com/repos/${pandocTemplate.github_repository}/releases`)
        }
    }
    fs.writeFileSync('./src/_data/templates.json', JSON.stringify(pandocTemplates));
}

async function fetchGithubJson(url) {
    const response = await fetch(url, httpOptions);
    if (response.ok) {
        return await response.json();
    }
    console.log(`Error retrieving response from '${url}'`);
    console.log(response);
}

(async () => {
    await downloadMetadata(pandocTemplates)
})();


