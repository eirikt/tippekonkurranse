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
                    'echo Essential Grunt tasks are:',
                    'echo   install:client   installs client resources via Bower                 (requires Git in path)',
                    'echo   test             installs, builds, and executes all Mocha tests      (using PhantomJS for client-side specifications)',
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
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        maxBuffer: Infinity
                    }
                },
                command: 'mongod.exe --dbpath data/db'
            },
            run: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        maxBuffer: Infinity
                    }
                },
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
                    { expand: true, cwd: 'shared', src: ['**'], dest: 'client' }
                ]
            },
            'to-build': {
                files: [
                    { expand: true, cwd: 'client', src: ['**'], dest: 'build' },
                    { expand: true, cwd: 'shared', src: ['**'], dest: 'build' },

                    // These are under RequireJS control, version folder added:
                    { expand: true, cwd: 'shared', src: ['**'], dest: 'build/<%= pkg.version %>/scripts' },
                    {
                        expand: true,
                        cwd: 'client/bower_components',
                        src: ['**'],
                        dest: 'build/<%= pkg.version %>/bower_components'
                    },
                    { expand: true, cwd: 'client/scripts', src: ['**'], dest: 'build/<%= pkg.version %>/scripts' },
                    { expand: true, cwd: 'client/styles', src: ['**'], dest: 'build/<%= pkg.version %>/styles' }
                ]
            }
        },

        clean: {
            options: {
                'no-write': false
            },
            build: {
                src: ['build']
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

                node: true,
                browser: true,
                jquery: true,
                mocha: true,

                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                //es3: true,        // ES3 not relevant for Node.js
                //es5: true,        // Default
                forin: true,
                freeze: true,
                funcscope: true,
                futurehostile: true,
                globals: false,
                globalstrict: false,
                immed: true,
                indent: true,
                latedef: true,
                newcap: true,
                noarg: true,
                nocomma: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: true,
                //qoutmark: true,   // Not forcing consistent use of 'single' or 'double' as of now ...
                singleGroups: true,
                undef: true,
                //unused: true,     // Don't know how to avoid this one - does not fit with hoisted variables/CommonJS style ...
                strict: true,
                trailing: true,

                maxcomplexity: 30,  // TODO: Target should be 5 or thereabout ...
                maxdepth: 4,
                maxlen: 350,        // I have a laarge screen ...
                maxparams: 14,      // I loove currying ...
                maxstatements: 40   // Default is 30 ...
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
                    'tests/server/specs/norwegian-soccer-service.spec.js',
                    'tests/server/specs/string-extensions.spec.js',
                    'tests/server/specs/tippekonkurranse.spec.js',
                    'tests/server/specs/utils.spec.js'
                ]
            }
        },

        // Client-side test coverage
        // TODO: Not working as of now ...
        blanket_mocha: {
            all: ['tests/client/test.html'],
            //all: [ 'tests/client/test-amd.html' ]

            options: {
                threshold: 10
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: [clientTestUrl],
                    testname: 'Tippekonkurranse',
                    tags: ['master'],
                    build: process.env.TRAVIS_JOB_ID,
                    'max-duration': 360,
                    browsers: [
                        { platform: 'Windows 10', browserName: 'chrome', version: '55.0' },
                        { platform: 'Windows 10', browserName: 'firefox', version: '50.0' },
                        { platform: 'Windows 10', browserName: 'MicrosoftEdge', version: '38.14393' },
                        { platform: 'Windows 8.1', browserName: 'internet explorer', version: '11.0' },
                        {
                            platform: 'macOS 10.12',
                            browserName: 'safari',
                            version: '10.0'
                        },
                        {
                            platform: 'OS X 10.10',
                            browserName: 'iphone',
                            version: '9.2',
                            deviceName: 'iPhone 6',
                            deviceOrientation: 'portrait'
                        },
                        {
                            platform: 'OS X 10.10',
                            browserName: 'iphone',
                            version: '9.2',
                            deviceName: 'iPad Retina',
                            deviceOrientation: 'portrait'
                        },
                        {
                            platform: 'Linux',
                            browserName: 'android',
                            version: '5.1',
                            deviceName: 'Android Emulator',
                            deviceOrientation: 'portrait'
                        }
                    ]
                }
            }
        },

        uglify: {
            myUglifyTask: {
                files: {
                    // Minified version not available via Bower ...
                    'build/<%= pkg.version %>/bower_components/requirejs/require.js': 'build/<%= pkg.version %>/bower_components/requirejs/require.js',

                    'build/<%= pkg.version %>/scripts/fun.js': 'build/<%= pkg.version %>/scripts/fun.js',
                    'build/<%= pkg.version %>/scripts/comparators.js': 'build/<%= pkg.version %>/scripts/comparators.js',
                    'build/<%= pkg.version %>/scripts/string-extensions.js': 'build/<%= pkg.version %>/scripts/string-extensions.js',
                    'build/<%= pkg.version %>/scripts/utils.js': 'build/<%= pkg.version %>/scripts/utils.js',

                    'build/<%= pkg.version %>/scripts/app.models.js': 'build/<%= pkg.version %>/scripts/app.models.js',

                    'build/<%= pkg.version %>/scripts/app.config.js': 'build/<%= pkg.version %>/scripts/app.config.js',
                    'build/<%= pkg.version %>/scripts/app.controller.js': 'build/<%= pkg.version %>/scripts/app.controller.js',
                    'build/<%= pkg.version %>/scripts/app.header-view.js': 'build/<%= pkg.version %>/scripts/app.header-view.js',
                    'build/<%= pkg.version %>/scripts/app.js': 'build/<%= pkg.version %>/scripts/app.js',
                    'build/<%= pkg.version %>/scripts/app.navigator-view.js': 'build/<%= pkg.version %>/scripts/app.navigator-view.js',
                    'build/<%= pkg.version %>/scripts/app.pre-season-participant-row-view.js': 'build/<%= pkg.version %>/scripts/app.pre-season-participant-row-view.js',
                    'build/<%= pkg.version %>/scripts/app.pre-season-table-view.js': 'build/<%= pkg.version %>/scripts/app.pre-season-table-view.js',
                    'build/<%= pkg.version %>/scripts/app.rating-history-collection.js': 'build/<%= pkg.version %>/scripts/app.rating-history-collection.js',
                    'build/<%= pkg.version %>/scripts/app.rating-history-view.js': 'build/<%= pkg.version %>/scripts/app.rating-history-view.js',
                    'build/<%= pkg.version %>/scripts/app.result.js': 'build/<%= pkg.version %>/scripts/app.result.js',
                    'build/<%= pkg.version %>/scripts/app.result-collection.js': 'build/<%= pkg.version %>/scripts/app.result-collection.js',
                    'build/<%= pkg.version %>/scripts/app.scores-header-row-view.js': 'build/<%= pkg.version %>/scripts/app.scores-header-row-view.js',
                    'build/<%= pkg.version %>/scripts/app.scores-participant-row-view.js': 'build/<%= pkg.version %>/scripts/app.scores-participant-row-view.js',
                    'build/<%= pkg.version %>/scripts/app.scores-table-view.js': 'build/<%= pkg.version %>/scripts/app.scores-table-view.js',
                    'build/<%= pkg.version %>/scripts/app.soccer-table-views.js': 'build/<%= pkg.version %>/scripts/app.soccer-table-views.js',
                    'build/<%= pkg.version %>/scripts/backbone.bootstrap.views.js': 'build/<%= pkg.version %>/scripts/backbone.bootstrap.views.js',
                    'build/<%= pkg.version %>/scripts/backbone.fetch-local-copy.js': 'build/<%= pkg.version %>/scripts/backbone.fetch-local-copy.js',
                    'build/<%= pkg.version %>/scripts/client-utils.js': 'build/<%= pkg.version %>/scripts/client-utils.js'
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/styles/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/styles/'
            }
        },

        jsdoc: {
            dist: {
                //src: ['server/scripts/*.js', 'client/scripts/*.js'],
                src: ['server/scripts/*.js'],
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
                tasks: ['copy']
            },
            tests: {
                files: [
                    'client/scripts/*.js',
                    'shared/scripts/*.js',
                    'tests/**/*'
                ],
                tasks: ['test']
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


    grunt.registerTask('help', ['shell:help']);
    grunt.registerTask('install:client', ['shell:install-client']);
    grunt.registerTask('db', ['shell:createDataDir', 'shell:createDbDir', 'shell:mongod']);

    grunt.registerTask('build:development', ['clean', 'copy:to-client', 'copy:to-build']);
    grunt.registerTask('build:client', ['build:development', 'uglify', 'cssmin']);

    grunt.registerTask('lint:js', ['jshint']);
    grunt.registerTask('lint', ['lint:js']);

    grunt.registerTask('test:client', ['connect', 'shell:mocha-phantomjs']);
    grunt.registerTask('test:client-development', ['build:development', 'test:client']);
    grunt.registerTask('test:client-watch', ['connect', 'watch']);
    grunt.registerTask('test:server', ['mochaTest']);
    grunt.registerTask('test', ['install:client', 'build:client', 'test:server', 'test:client']);
    grunt.registerTask('test:sauce', ['connect', 'saucelabs-mocha']);
    grunt.registerTask('coverage:server', ['mochacov:report']);

    grunt.registerTask('build:travis', ['test', 'saucelabs-mocha', /*'blanket_mocha',*/ 'mochacov:travis', 'jshint', 'jsdoc']);

    grunt.registerTask('deploy:development', ['install:client', 'copy:to-client', 'shell:run']);
    grunt.registerTask('deploy:local', ['env:prod', 'install:client', 'build:client', 'shell:run']);
    grunt.registerTask('deploy:production', ['env:prod', 'install:client', 'build:client']);

    /*
     * Using npm trick described in:
     * http://stackoverflow.com/questions/13784600/how-to-deploy-node-app-that-uses-grunt-to-heroku
     */
    grunt.registerTask('deploy:heroku', ['deploy:production']);

    grunt.registerTask('run', ['deploy:development']);

    grunt.registerTask('default', ['help']);
};
