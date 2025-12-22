import fs from 'node:fs';

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

async function checkGithubAuth() {
    const res = await fetch('https://api.github.com/user', httpOptions);
    if (res.status === 401) {
        console.error('GitHub authentication failed: invalid or expired token');
        process.exit(1);
    }
    if (!res.ok) {
        console.error(`GitHub auth check failed: ${res.status} ${res.statusText}`);
        process.exit(1);
    }
    await res.json();
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
    console.error(`Error retrieving response from '${url}'`);
    console.error(response);
}

(async () => {
    await checkGithubAuth()
    await downloadMetadata(pandocTemplates)
})();


