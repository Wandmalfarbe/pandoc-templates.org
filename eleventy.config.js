import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import htmlmin from "html-minifier";

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

let dateOptionsLong = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
let dateOptionsMedium = {year: 'numeric', month: 'long', day: 'numeric'};

export default function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/*.png");
    eleventyConfig.addPassthroughCopy("src/favicon.*");
    eleventyConfig.addPassthroughCopy("src/files");

    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
        }
        return content;
    });

    eleventyConfig.addFilter("timeAgo", function (dateInput) {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        return timeAgo.format(date);
    });

    eleventyConfig.addFilter("cssClassTimeAgo", function (dateInput) {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        const now = new Date();
        const diffInDays = Math.floor(Math.abs(now - date) / 86400000); // milliseconds in a day

        if (diffInDays <= 183) {
            return "text-success";
        } else if (diffInDays <= 728) {
            return "text-warning";
        } else {
            return "text-danger";
        }
    });

    eleventyConfig.addFilter("dateNow", function () {
        return new Date().toLocaleString("en-GB", dateOptionsLong);
    });

    eleventyConfig.addFilter("dateToTimestamp", function (dateInput) {
        if (!dateInput) return "";
        return new Date(dateInput).getTime().toString();
    });

    eleventyConfig.addFilter("dateToHumanReadableLong", function (dateInput) {
        if (!dateInput) return "";
        return new Date(dateInput).toLocaleString("en-GB", dateOptionsLong);
    });

    eleventyConfig.addFilter("dateToHumanReadableMedium", function (dateInput) {
        if (!dateInput) return "";
        return new Date(dateInput).toLocaleString("en-GB", dateOptionsMedium);
    });

    return {
        templateFormats: ["liquid"],
        dir: {
            input: "src",
            output: "dist"
        }
    }
}
