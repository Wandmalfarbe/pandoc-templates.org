import Mustache from 'mustache';
import TimeAgo from 'javascript-time-ago'
import fs from 'fs';
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

let templates = JSON.parse(fs.readFileSync('./data/all.json', 'utf8'));
let formats = JSON.parse(fs.readFileSync('./data/formats.json', 'utf8'));
let htmlTemplate = fs.readFileSync('./src/index.mustache', 'utf8');
let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const templateData = {
    "templates": templates,
    "formats": formats,
    "last_update_site": new Date(),
    "total_templates": templates.length,
    "timeAgo": function () {
        return function (dateText, render) {
            let dateString = render(dateText);
            if (!dateString) {
                return "";
            }
            let date = Date.parse(dateString);
            return timeAgo.format(date);
        }
    },
    "cssClassTimeAgo": function () {
        return function (dateText, render) {
            let dateString = render(dateText);
            if (!dateString) {
                return "";
            }
            let date = Date.parse(dateString);
            const diffInMillis = Math.abs(new Date() - date);
            const diffInDays = Math.floor(diffInMillis / 86400000);

            if (diffInDays <= 32) {
                return "time-new";
            } else if(diffInDays <= 183) { // half a year
                return "time-new";
            } else if(diffInDays <= 728) { // 2 years
                return "time-old";
            } else {
                return "time-older";
            }
        }
    },
    "toTimestamp": function () {
        return function (dateText, render) {
            let dateString = render(dateText);
            if (!dateString) {
                return "";
            }
            return Date.parse(dateString).toString();
        }
    },
    "toHumanReadable": function () {
        return function (dateText, render) {
            let dateString = render(dateText);
            if (!dateString) {
                return "";
            }
            return new Date(Date.parse(dateString)).toLocaleString("en-GB", dateOptions);
        }
    },
};

let output = Mustache.render(htmlTemplate, templateData);

fs.writeFile("./dist/index.html", output, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
