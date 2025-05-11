import fs from 'fs';

const pandocTemplatesData = fs.readFileSync('./src/_data/templates.json', {encoding: 'utf8', flag: 'r'});
const outputFormatsData = fs.readFileSync('./src/_data/formats.json', {encoding: 'utf8', flag: 'r'});

let pandocTemplates = JSON.parse(pandocTemplatesData);
let outputFormats = JSON.parse(outputFormatsData);

for (let pandocTemplate of pandocTemplates) {

    // Tag metadata
    if (pandocTemplate.formats) {
        pandocTemplate.formats = pandocTemplate.formats
            .map((currentFormat) => {

                // Already converted this format
                if (typeof currentFormat !== 'string') {
                    return currentFormat;
                }

                let foundFormat = outputFormats.find(outputFormat => outputFormat.id === currentFormat);
                if (!foundFormat) {
                    console.error("Unrecognized format", currentFormat);
                    return {
                        "id": "unknown",
                        "name": "Unknown",
                        "color": "orange"
                    };
                }
                return foundFormat;
            });
    }
}

fs.writeFileSync('./src/_data/templates.json', JSON.stringify(pandocTemplates));
