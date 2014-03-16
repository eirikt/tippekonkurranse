module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {
            help: {
                options: { stdout: true, stderr: true, failOnError: true },
                command: [
                    'echo.',
                    'echo #######################################',
                    'echo       <%= pkg.name %> v<%= pkg.version %>',
                    'echo #######################################',
                    'echo.',
                    'echo Essential grunt tasks are:',
                    'echo   foreman   (local Heroku) (blocking command)'
                ].join('&&')
            },
            foreman: {
                options: { stdout: true, stderr: true, failOnError: true },
                command: 'foreman start'
            }
        },

        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'client', src: ['**'], dest: 'build' }
                ]
            }
        },

        clean: {
            options: {
                "no-write": false
            },
            build: {
                src: ['build']
            }
        },

        jshint: {
            all: [
                //'Gruntfile.js'
                'server/scripts/*.js',
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
                maxdepth: 5,
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

        /*
         uglify: {
         options: {
         banner: '! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n'
         },
         build: {
         src: 'client/scripts/*.js',
         dest: 'dist/<%= pkg.name %>.min.js'
         }
         }
         */
        uglify: {
            options: {
                mangle: true,
                compress: {
                }
            },
            myUglifyTask: {
                files: {
                    'build/scripts/app.config.js': 'build/scripts/app.config.js',
                    'build/scripts/app.js': 'build/scripts/app.js'
                }
            }
        },

        'scripts': {
            'postinstall': "echo postinstall time; ./node_modules/grunt/bin/grunt deploy:heroku"
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('help', ['shell:help']);
    grunt.registerTask('foreman', ['shell:foreman']);

    grunt.registerTask('build:travis', ['jshint', 'jsdoc', 'clean', 'copy', 'uglify', 'mocha']);
    grunt.registerTask('deploy:local', ['clean', 'copy', 'uglify', 'foreman']);
    grunt.registerTask('deploy:heroku', ['clean', 'copy', 'uglify']);

    grunt.registerTask('default', ['help']);
};
