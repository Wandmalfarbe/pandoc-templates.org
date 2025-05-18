import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import htmlmin from "html-minifier";
import CleanCSS from "clean-css";

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

let dateOptionsLong = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
let dateOptionsMedium = {year: 'numeric', month: 'long', day: 'numeric'};

export default function (config) {

    config.addPassthroughCopy("src/css/fonts");
    config.addPassthroughCopy("*.woff2");
    config.addPassthroughCopy("src/js");
    config.addPassthroughCopy("src/*.png");
    config.addPassthroughCopy("src/favicon.*");
    config.addPassthroughCopy("src/files");

    config.addTemplateFormats('css');

    config.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
        }
        return content;
    });

    config.addExtension('css', {
        outputFileExtension: 'css',
        compile: async (content, outputPath) => {
            return async () => {
                if (outputPath.endsWith(".css") && !outputPath.endsWith(".min.css")) {
                    return new CleanCSS({level: 2}).minify(content).styles;
                }
                return content;
            };
        }
    });

    config.addFilter("timeAgo", function (dateInput) {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        return timeAgo.format(date);
    });

    config.addFilter("cssClassTimeAgo", function (dateInput) {
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

    config.addFilter("dateWarning", function (dateInput) {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        const now = new Date();
        const diffInDays = Math.floor(Math.abs(now - date) / 86400000); // milliseconds in a day

        return diffInDays > 728;
    });

    config.addFilter("dateNow", function () {
        return new Date().toLocaleString("en-GB", dateOptionsLong);
    });

    config.addFilter("dateToTimestamp", function (dateInput) {
        if (!dateInput) return "";
        return new Date(dateInput).getTime().toString();
    });

    config.addFilter("dateToHumanReadableLong", function (dateInput) {
        if (!dateInput) return "";
        return new Date(dateInput).toLocaleString("en-GB", dateOptionsLong);
    });

    config.addFilter("dateToHumanReadableMedium", function (dateInput) {
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
