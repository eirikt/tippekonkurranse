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
                    'echo   mongodb          starts a MongoDB instance using a local data folder (blocking command)',
                    'echo   run              starts up local Node.js runtime                     (blocking command)'
                ].join('&&')
            },
            createDataDir: {
                options: { stdout: true, stderr: true, failOnError: false },
                command: [
                    'mkdir data',
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
                'client/scripts/**/*.js', '!client/scripts/app.models.js', '!client/scripts/comparators.js', '!client/scripts/fun.js', '!client/scripts/string-extensions.js',
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
                maxparams: 12,
                maxdepth: 3,
                maxstatements: 30,
                maxcomplexity: 5,
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
                    'tests/server/specs/string-extensions.spec.js',
                    'tests/server/specs/comparators.spec.js',
                    'tests/server/specs/utils.spec.js',

                    'tests/server/specs/app.models.spec.js',
                    'tests/server/specs/tippekonkurranse-service.spec.js'
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
                    'tests/server/specs/string-extensions.spec.js',
                    'tests/server/specs/comparators.spec.js',
                    'tests/server/specs/utils.spec.js',
                    'tests/server/specs/tippekonkurranse-service.spec.js'
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
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 2,
                    testname: 'Tippekonkurranse',
                    tags: [ 'master' ],
                    browsers: [
                        { platform: 'Windows XP', browserName: 'Chrome', version: '38' },
                        { platform: 'Windows XP', browserName: 'Firefox', version: '33' },
                        { platform: 'Windows 7', browserName: 'Safari', version: '5' },
                        { platform: 'Windows 8.1', browserName: 'Internet Explorer', version: '11' }
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

                    'build/scripts/fun.js': 'build/scripts/fun.js',
                    'build/scripts/comparators.js': 'build/scripts/comparators.js',
                    'build/scripts/string-extensions.js': 'build/scripts/string-extensions.js',

                    'build/scripts/app.models.js': 'build/scripts/app.models.js',

                    'build/scripts/app.config.js': 'build/scripts/app.config.js',
                    'build/scripts/app.header-view.js': 'build/scripts/app.header-view.js',
                    'build/scripts/app.js': 'build/scripts/app.js',
                    'build/scripts/app.participant-score-view.js': 'build/scripts/app.participant-score-view.js',
                    'build/scripts/app.rating-history-collection.js': 'build/scripts/app.rating-history-collection.js',
                    'build/scripts/app.rating-history-view.js': 'build/scripts/app.rating-history-view.js',
                    'build/scripts/app.result.js': 'build/scripts/app.result.js',
                    'build/scripts/app.result-collection.js': 'build/scripts/app.result-collection.js',
                    'build/scripts/app.results-view.js': 'build/scripts/app.results-view.js',
                    'build/scripts/app.router.js': 'build/scripts/app.router.js',
                    'build/scripts/app.soccer-table-views.js': 'build/scripts/app.soccer-table-views.js',
                    'build/scripts/backbone.bootstrap.views.js': 'build/scripts/backbone.bootstrap.views.js',
                    'build/scripts/backbone.fetch-local-copy.js': 'build/scripts/backbone.fetch-local-copy.js',
                    'build/scripts/utils.js': 'build/scripts/utils.js'
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
                    'client/scripts/*.js', '!client/scripts/app.models.js', '!client/scripts/comparators.js', '!client/scripts/fun.js', '!client/scripts/string-extensions.js',
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
    grunt.registerTask('mongodb', [ 'shell:createDataDir', 'shell:mongod' ]);

    grunt.registerTask('build:client', [ 'clean', 'copy:to-client', 'copy:to-build', 'uglify', 'cssmin' ]);

    grunt.registerTask('test:client', [ 'connect', 'shell:mocha-phantomjs' ]);
    grunt.registerTask('test:client-watch', [ 'connect', 'watch' ]);
    grunt.registerTask('test:server', [ 'mochaTest' ]);
    grunt.registerTask('coverage:server', [ 'mochacov:report' ]);
    grunt.registerTask('test', [ 'install:client', 'build:client', 'test:server', 'test:client' ]);
    grunt.registerTask('test:saucelabs', [ 'connect', 'saucelabs-mocha' ]);

    grunt.registerTask('build:travis', [ 'test', 'saucelabs-mocha', /*'blanket_mocha',*/ 'mochacov:travis', 'jshint', 'jsdoc' ]);

    grunt.registerTask('deploy:development', [ 'env:dev', 'install:client', 'copy:to-client', 'shell:run' ]);
    grunt.registerTask('deploy:local', [ 'env:prod', 'install:client', 'build:client', 'shell:run' ]);
    grunt.registerTask('deploy:production', [ 'install:client', 'build:client' ]);
    grunt.registerTask('deploy:heroku', [ 'deploy:production' ]);

    /*
     * http://stackoverflow.com/questions/13784600/how-to-deploy-node-app-that-uses-grunt-to-heroku
     *
     * =>
     * Heroku buildpack: Node.js with grunt support
     * https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt
     */
    //>D:\workspace\Tippekonkurranse [master +11 ~2 -0 !]> heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
    //>Setting config vars and restarting tippekonkurranse... done, v19
    //>BUILDPACK_URL: https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
    //>D:\workspace\Tippekonkurranse [master +11 ~2 -0 !]> heroku labs:enable user-env-compile
    //>Enabling user-env-compile for tippekonkurranse... done
    //>WARNING: This feature is experimental and may change or be removed without notice.
    //>For more information see: http://devcenter.heroku.com/articles/labs-user-env-compile
    //>D:\workspace\Tippekonkurranse [master +11 ~2 -0 !]> heroku config:set NODE_ENV=production
    //>Setting config vars and restarting tippekonkurranse... done, v20
    //>NODE_ENV: production
    //>D:\workspace\Tippekonkurranse [master +11 ~2 -0 !]>
    //grunt.registerTask('heroku:development', 'clean less mincss');
    grunt.registerTask('heroku:production', [ 'deploy:heroku' ]);

    grunt.registerTask('run', [ 'deploy:development' ]);

    grunt.registerTask('default', [ 'help' ]);
};
