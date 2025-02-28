module.exports = function (grunt) {

    grunt.initConfig({

        settings: {
            distDirectory: "dist",
            srcDirectory: "src"
        },

        clean: {
            dist: ["<%= settings.distDirectory %>"]
        },

        htmlmin: {
            dev: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    "<%= settings.distDirectory %>/index.html": "<%= settings.distDirectory %>/index.html"
                }
            }
        },

        cssmin: {
            dev: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/css",
                    src: ["*.css", "!*.min.css"],
                    dest: "<%= settings.distDirectory %>/css"
                }]
            }
        },

        uglify: {
            options: {
                beautify: false,
                mangle: true, // sadly has no effect https://github.com/gruntjs/grunt-contrib-uglify/issues/65
                compress: true
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/js",
                    src: ["*.js", "!*.min.js"],
                    dest: "<%= settings.distDirectory %>/js"
                }]
            }
        },

        run: {
            options: {},
            github_metadata: {
                cmd: 'node',
                args: [
                    'build-scripts/add-github-metadata.js'
                ]
            },
            local_metadata: {
                cmd: 'node',
                args: [
                    'build-scripts/add-local-metadata.js'
                ]
            },
            validate: {
                cmd: 'node',
                args: [
                    'build-scripts/validate.js'
                ]
            },
            render: {
                cmd: 'node',
                args: [
                    'build-scripts/render-template.js'
                ]
            }
        },
        copy: {
            from_temp_to_dist: {
                src: "<%= settings.distDirectory %>/index.html",
                dest: "<%= settings.distDirectory %>/index.html"
            },
            index: {
                src: "<%= settings.srcDirectory %>/index.html",
                dest: "<%= settings.distDirectory %>/index.html"
            },
            data: {
                files: [{
                    expand: true,
                    cwd: "data/files",
                    src: ["*", "**"],
                    dest: "<%= settings.distDirectory %>/data/files"
                }]
            },
            favicons: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/",
                    src: ["*.png", "*.svg", "*.ico"],
                    dest: "<%= settings.distDirectory %>/"
                }]
            },
            minified_js_files: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/js",
                    src: ["*.min.js"],
                    dest: "<%= settings.distDirectory %>/js"
                }]
            },
            minified_css_files: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/css",
                    src: ["*.min.css"],
                    dest: "<%= settings.distDirectory %>/css"
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: "<%= settings.srcDirectory %>/css/fonts",
                    src: ["*"],
                    dest: "<%= settings.distDirectory %>/css/fonts"
                }]
            }
        },

        assets_inline: {
            options: {
                inlineSvg: false,
                //assetsUrlPrefix: '<%= config.base %>/assets/'
            },
            dev: {
                files: {
                    "<%= settings.distDirectory %>/index.html": "<%= settings.distDirectory %>/index.html"
                }
            }
        }
    });

    // Minifiers
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Other
    grunt.loadNpmTasks("grunt-assets-inline");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-run');

    // tasks
    grunt.registerTask("build", [
        "copy:data",
        "copy:favicons",
        "cssmin",
        "copy:minified_css_files",
        "copy:fonts",
        "uglify",
        "copy:minified_js_files",
        "run",
        "copy:index",
        //"assets_inline",
        "htmlmin",
        "copy:from_temp_to_dist",
    ]);

    grunt.registerTask("default", [
        "build"
    ]);
};
