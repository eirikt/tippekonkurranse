module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                //'Gruntfile.js'
                //'server/scripts/*.js'
                'client/scripts/*.js'
                //'test/spec/**/*.js'
            ],
            options: {
                //reporter: 'jslint',
                reporter: 'checkstyle',
                //reporter: require('jshint-stylish'),

                //reporterOutput: 'dist/jshint.xml',

                browser: true,
                jquery: true,
                node: true,

                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                es3: false,
                forin: true,
                freeze: true,
                immed: true,
                indent: false,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: true,
                //qoutmark: true, // Not forcing consistent use of 'single' or 'double' as of now ...
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                maxparams: 14,
                maxdepth: 3,
                maxstatements: 20,
                maxcomplexity: 7,
                maxlen: 180,

                laxcomma: true,

                globals: {
                    require: false,
                    define: false,
                    prettyprintInteger: false
                }
            }
        },

        mocha: {
            test: {
                src: ['tests/**/*.html']
            }
        },

        jsdoc: {
            dist: {
                src: ['server/scripts/*.js', 'client/scripts/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'client/scripts/**/*.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build:travis', ['jshint', 'mocha', 'jsdoc', 'uglify']);
};
