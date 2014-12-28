/* jshint -W071, -W106 */

module.exports = function (grunt) {
    'use strict';

    // Test setup
    var port = 9999,
        clientTestUri = '/tests/client/test.amd.html',
        clientTestUrl = 'http://127.0.0.1:' + port + clientTestUri;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                NODE_ENV: 'development'
            },
            prod: {
                NODE_ENV: 'production'
            }
        },

        connect: {
            server: {
                options: {
                    base: '',
                    port: port
                    //protocol: 'http',
                    //hostname: '127.0.0.1',
                    //base: '.',
                    //directory: null,
                    //keepalive: false,
                    //debug: true,
                    //livereload: false
                }
            }
        },

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
                    'echo   install:client   installs client resources via Bower',
                    'echo   test             installs, builds, and executes all Mocha tests',
                    'echo   db               starts a MongoDB instance using a local data folder (blocking command)',
                    'echo   run              starts up local Node.js runtime                     (blocking command)'
                ].join('&&')
            },
            createDataDir: {
                options: { stdout: true, stderr: true, failOnError: false },
                command: [
                    'mkdir data'
                ].join('&&')
            },
            createDbDir: {
                options: { stdout: true, stderr: true, failOnError: false },
                command: [
                    'cd data',
                    'mkdir db'
                ].join('&&')
            },
            mongod: {
                options: { stdout: true, stderr: true, failOnError: true },
                command: 'mongod.exe --dbpath data/db'
            },
            run: {
                options: { stdout: true, stderr: true, failOnError: true },
                command: 'npm start'
            },
            'install-client': {
                options: { stdout: true, stderr: true, failOnError: true },
                command: 'node ./node_modules/bower/bin/bower install'
            },
            'mocha-phantomjs': {
                options: { stdout: true, stderr: true, failOnError: true },
                command: 'node ./node_modules/mocha-phantomjs/bin/mocha-phantomjs -R spec ' + clientTestUrl
            }
        },

        copy: {
            'to-client': {
                files: [
                    { expand: true, cwd: 'shared', src: [ '**' ], dest: 'client' }
                ]
            },
            'to-build': {
                files: [
                    { expand: true, cwd: 'client', src: [ '**' ], dest: 'build' },
                    { expand: true, cwd: 'shared', src: [ '**' ], dest: 'build' }
                ]
            }
        },

        clean: {
            options: {
                'no-write': false
            },
            build: {
                src: [ 'build' ]
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'package.json',
                'bower.json',
                'server/scripts/**/*.js', '!server/scripts/vendor/**/*.js',
                'client/scripts/**/*.js', '!client/scripts/app.models.js', '!client/scripts/comparators.js', '!client/scripts/fun.js', '!client/scripts/string-extensions.js', '!client/scripts/utils.js',
                'shared/scripts/**/*.js',
                'tests/**/*.js'
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
                //unused: true,
                strict: true,
                trailing: true,
                maxparams: 14,
                maxdepth: 3,
                maxstatements: 30,
                maxcomplexity: 20, // TODO: Sigh, let us start all over again, target should be 5 or thereabout ...
                //maxlen: 180,

                laxcomma: true
            }
        },

        // Server-side/Node.js specs/tests
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'tests/server/specs/app-models.spec.js',
                    'tests/server/specs/comparators.spec.js',
                    'tests/server/specs/rq-fun.spec.js',
                    'tests/server/specs/string-extensions.spec.js',
                    'tests/server/specs/tippekonkurranse.spec.js',
                    'tests/server/specs/utils.spec.js'
                ]
            }
        },

        // Server-side/Node.js test coverage
        mochacov: {
            travis: {
                options: {
                    coveralls: {
                        serviceName: 'travis-ci'
                    }
                }
            },
            report: {
                options: {
                    log: true,
                    logErrors: true,
                    reporter: 'html-cov',
                    output: 'docs/server-coverage.html'
                }
            },
            options: {
                files: [
                    'tests/server/specs/app-models.spec.js',
                    'tests/server/specs/comparators.spec.js',
                    'tests/server/specs/rq-fun.spec.js',
                    'tests/server/specs/string-extensions.spec.js',
                    'tests/server/specs/tippekonkurranse.spec.js',
                    'tests/server/specs/utils.spec.js'
                ]
            }
        },

        // Client-side test coverage
        // TODO: Not working as of now ...
        blanket_mocha: {
            all: [ 'tests/client/test.html' ],
            //all: [ 'tests/client/test-amd.html' ]

            options: {
                threshold: 10
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: [ clientTestUrl ],
                    testname: 'Tippekonkurranse',
                    tags: [ 'master' ],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 2,
                    browsers: [
                        { platform: 'Windows 7', browserName: 'Chrome', version: '39' }                // OK
                        //{ platform: 'Windows 7', browserName: 'Firefox', version: '33' },               // Test exceeded maximum duration after 180 seconds
                        //{ platform: 'OS X 10.10', browserName: 'Safari', version: '8' },                // The Sauce VMs failed to start the browser or device For more info, please check https://docs.saucelabs.com/reference/troubleshooting-common-er
                        //{ platform: 'Windows 8.1', browserName: 'Internet Explorer', version: '11' }    // OK
                        //{ platform: 'Windows 8', browserName: 'Internet Explorer', version: '10' }    // Test exceeded maximum duration after 180 seconds
                        //{ platform: 'Windows 7', browserName: 'Internet Explorer', version: '9' }
                        //{ platform: 'Windows 7', browserName: 'Internet Explorer', version: '8' }
                        //{ platform: 'Windows XP', browserName: 'Internet Explorer', version: '7' }
                        //{ platform: 'Windows XP', browserName: 'Internet Explorer', version: '6' }
                        //{ platform: 'Linux', browserName: 'Android', version: '4.4' }
                    ]
                }
            }
        },

        uglify: {
            myUglifyTask: {
                files: {
                    // Minified versions not available via Bower ...
                    'build/bower_components/requirejs/require.js': 'build/bower_components/requirejs/require.js',
                    'build/bower_components/backbone/backbone.js': 'build/bower_components/backbone/backbone.js',
                    'build/bower_components/underscore/underscore.js': 'build/bower_components/underscore/underscore.js',

                    'build/scripts/fun.js': 'build/scripts/fun.js',
                    'build/scripts/comparators.js': 'build/scripts/comparators.js',
                    'build/scripts/string-extensions.js': 'build/scripts/string-extensions.js',
                    'build/scripts/utils.js': 'build/scripts/utils.js',

                    'build/scripts/app.models.js': 'build/scripts/app.models.js',

                    'build/scripts/app.config.js': 'build/scripts/app.config.js',
                    'build/scripts/app.controller.js': 'build/scripts/app.controller.js',
                    'build/scripts/app.header-view.js': 'build/scripts/app.header-view.js',
                    'build/scripts/app.js': 'build/scripts/app.js',
                    'build/scripts/app.participant-score-view.js': 'build/scripts/app.participant-score-view.js',
                    'build/scripts/app.rating-history-collection.js': 'build/scripts/app.rating-history-collection.js',
                    'build/scripts/app.rating-history-view.js': 'build/scripts/app.rating-history-view.js',
                    'build/scripts/app.result.js': 'build/scripts/app.result.js',
                    'build/scripts/app.result-collection.js': 'build/scripts/app.result-collection.js',
                    'build/scripts/app.result-carousel-view.js': 'build/scripts/app.result-carousel-view.js',
                    'build/scripts/app.results-view.js': 'build/scripts/app.results-view.js',
                    'build/scripts/app.soccer-table-views.js': 'build/scripts/app.soccer-table-views.js',
                    'build/scripts/backbone.bootstrap.views.js': 'build/scripts/backbone.bootstrap.views.js',
                    'build/scripts/backbone.fetch-local-copy.js': 'build/scripts/backbone.fetch-local-copy.js',
                    'build/scripts/client-utils.js': 'build/scripts/client-utils.js'
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/styles/',
                src: [ '*.css', '!*.min.css' ],
                dest: 'build/styles/'
            }
        },

        jsdoc: {
            dist: {
                //src: ['server/scripts/*.js', 'client/scripts/*.js'],
                src: [ 'server/scripts/*.js' ],
                options: {
                    destination: 'docs'
                }
            }
        },

        watch: {
            clientcode: {
                files: [
                    // Ignore the copied in files (shared JavaScript app libs)
                    'client/scripts/*.js', '!client/scripts/app.models.js', '!client/scripts/comparators.js', '!client/scripts/fun.js', '!client/scripts/string-extensions.js', '!client/scripts/utils.js',
                    'shared/scripts/*.js',
                    'client/styles/*.css',
                    'client/index.html',
                    'client/manifest.appcache'
                ],
                tasks: [ 'copy' ]
            },
            tests: {
                files: [
                    'client/scripts/*.js',
                    'shared/scripts/*.js',
                    'tests/**/*'
                ],
                tasks: [ 'test' ]//,
                //options: {
                //    interval : 5000,
                //    debounceDelay: 5000
                //}
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-blanket-mocha');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-jsdoc');


    grunt.registerTask('help', [ 'shell:help' ]);
    grunt.registerTask('install:client', [ 'shell:install-client' ]);
    grunt.registerTask('db', [ 'shell:createDataDir', 'shell:createDbDir', 'shell:mongod' ]);

    grunt.registerTask('build:development', [ 'clean', 'copy:to-client', 'copy:to-build' ]);
    grunt.registerTask('build:client', [ 'build:development', 'uglify', 'cssmin' ]);

    grunt.registerTask('test:client', [ 'connect', 'shell:mocha-phantomjs' ]);
    grunt.registerTask('test:client-development', [ 'build:development', 'test:client' ]);
    grunt.registerTask('test:client-watch', [ 'connect', 'watch' ]);
    grunt.registerTask('test:server', [ 'mochaTest' ]);
    grunt.registerTask('test', [ 'install:client', 'build:client', 'test:server', 'test:client' ]);
    grunt.registerTask('test:sauce', [ 'connect', 'saucelabs-mocha' ]);
    grunt.registerTask('coverage:server', [ 'mochacov:report' ]);

    grunt.registerTask('build:travis', [ 'test', 'saucelabs-mocha', /*'blanket_mocha',*/ 'mochacov:travis', 'jshint', 'jsdoc' ]);

    grunt.registerTask('deploy:development', [ 'env:dev', 'install:client', 'copy:to-client', 'shell:run' ]);
    grunt.registerTask('deploy:local', [ 'env:prod', 'install:client', 'build:client', 'shell:run' ]);
    grunt.registerTask('deploy:production', [ 'install:client', 'build:client' ]);

    /*
     * Using npm trick described in:
     * http://stackoverflow.com/questions/13784600/how-to-deploy-node-app-that-uses-grunt-to-heroku
     */
    grunt.registerTask('deploy:heroku', [ 'deploy:production' ]);

    grunt.registerTask('run', [ 'deploy:development' ]);

    grunt.registerTask('default', [ 'help' ]);
};
