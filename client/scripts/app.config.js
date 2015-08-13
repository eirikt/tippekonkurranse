/* jshint -W031 */

window.console.log('app.config.js');

require.config({

    // RequireJS HTTP Cache issue:

    // Development solution : Use Chrome and e.g. https://chrome.google.com/webstore/detail/cppjkneekbjaeellbfkmgnhonkkjfpdn
    // RequireJS 'hack' for forcing fetching a new version each request, works poorly with Chrome breakpoints though ...
    //urlArgs: 'bust=' +  (new Date()).getTime(),

    // Production solution  : http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts
    //    ...not the approved answer, but below using 'baseUrl': https://groups.google.com/forum/#!msg/requirejs/3E9dP_BSQoY/36ut2Gtko7cJ
    // Implemented in this application

    // Development ('grunt [run|deploy:development]' and IDE execution):
    //baseUrl: 'scripts',
    // Standard:
    baseUrl: '1.3.7/scripts',

    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore-min',
        'backbone': '../bower_components/backbone/backbone-min',
        'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/locale/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jquery.countdown': '../bower_components/jquery.countdown/dist/jquery.countdown.min',
        'jquery.bootstrap.switch': '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot.min'
        // TODO: Make the jqplot cursor work ...
        //'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        //'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        //'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: '$'
        },
        jqplot: {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.bootstrap.switch': {
            deps: ['jquery', 'bootstrap'],
            exports: '$'
        },
        enforceDefine: true
    },
    config: {
        moment: {
            noGlobal: true
        }
    }
});


require(['underscore', 'jquery', 'backbone', 'marionette', 'toastr', 'jqplot', 'jquery.countdown', 'jquery.bootstrap.switch', 'backbone.bootstrap.views', 'backbone.fetch-local-copy', 'app', 'app.controller'],
    function (_, $, Backbone, Marionette, Toastr, $jqplot, $countdown, $bootstrapSwitch, BootstrapViews, BackboneFetchLocalCopy, app, clientSideRequestHandler) {
        'use strict';

        window.console.log('app.config.js :: Application configuration and start ...');

        // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
        Toastr.options = {
            'positionClass': 'toast-top-full-width',
            'timeOut': 6000
        };

        app.start();

        new Marionette.AppRouter({
            appRoutes: {
                'scores/current': 'showCurrentScores',
                'scores/:year/:round': 'showScores',
                'ratinghistory/:year/:round': 'showRatingHistory'
            },
            controller: clientSideRequestHandler
        });

        Backbone.history.start({
            pushState: false,
            hashChange: true,

            root: '/'
        });

        $(document).ready(function () {
            console.log('DOM ready!');

            BackboneFetchLocalCopy.listenToServerConnectionDropouts([
                '#offlineScoresNotification',
                '#offlineCurrentResultsNotification'
            ]);

            // Strict AppCache updateready modal window
            var appCache = window.applicationCache,
                bootstrapModalContainerView1,
                bootstrapModalContainerView2,
                ReloadNotificationView1,
                ReloadNotificationView2,
                reloadNotificationView1,
                reloadNotificationView2;

            if (appCache) {
                appCache.addEventListener('error', function () {
                    // Strict AppCache error modal window
                    bootstrapModalContainerView1 = new BootstrapViews.ModalContainerView({
                        parentSelector: 'body',
                        id: 'reloadNotification1',
                        ariaLabelledBy: 'reloadNotificationLabel1'
                    });
                    bootstrapModalContainerView1.attach();

                    ReloadNotificationView1 = Marionette.ItemView.extend({
                        template: _.template('' +

                        '<div class="modal-dialog" style="width:450px;text-align:center;margin-top:150px">' +
                        '  <div class="modal-content">' +
                        '    <div class="modal-header">' +
                        '      <h2 id="reloadNotificationLabel1" class="modal-title" style="color:red;font-style:italic;">Noe har tryna ...</h2>' +
                        '    </div>' +
                        '    <div class="modal-body">' +
                        '      <div style="text-align:left;font-size:x-large;">Prøv:</div>' +
                        '      <ol style="text-align:left;font-size:large;">' +
                        '        <li>Trykk "Prøv igjen!" nedenfor en gang eller to.</li>' +
                        '        <li>Hvis ingen endring til det bedre, kontakt Eirik T. - skjell han ut! Lurest å kreve pengene tilbake også.</li>' +
                        '      </ol>' +
                        '    </div>' +
                        '    <div class="modal-footer" style="text-align:center;">' +
                        '      <button id="reload1" type="button" class="btn btn-danger" data-dismiss="modal" style="font-size:large;">Prøv igjen!</button>' +
                        '    </div>' +
                        '  </div>' +
                        '</div>'),

                        onRender: function () {
                            var self = this;
                            this.$el.modal({ keyboard: false })
                                .on('click', '#reload1', function () {
                                    window.location.reload();
                                })
                                .on('shown.bs.modal', function () {
                                    self.$('button').focus();
                                }
                            );
                        }
                    });

                    reloadNotificationView1 = new ReloadNotificationView1({
                        el: $('#' + bootstrapModalContainerView1.id)
                    });
                    reloadNotificationView1.render();
                    // /Strict AppCache error modal window
                }, false);

                appCache.addEventListener('updateready', function () {
                    // Strict AppCache updateready modal window
                    if (appCache.status === appCache.UPDATEREADY) {
                        bootstrapModalContainerView2 = new BootstrapViews.ModalContainerView({
                            parentSelector: 'body',
                            id: 'reloadNotification2',
                            ariaLabelledBy: 'reloadNotificationLabel2'
                        });
                        bootstrapModalContainerView2.attach();

                        ReloadNotificationView2 = Marionette.ItemView.extend({
                            template: _.template('' +
                            '<div class="modal-dialog" style="width:400px;text-align:center;margin-top:150px">' +
                            '  <div class="modal-content">' +
                            '    <div class="modal-header">' +
                            '      <h3 id="reloadNotificationLabel2" class="modal-title">' +
                            '        En ny versjon av Tippekonkurranse er klar ...' +
                            '      </h3>' +
                            '    </div>' +
                            '    <div class="modal-footer" style="text-align:center;">' +
                            '      <button id="reload2" type="button" class="btn btn-default" data-dismiss="modal" style="font-size:large;">OK, greit!</button>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>'),

                            onRender: function () {
                                var self = this;
                                this.$el.modal({ keyboard: false })
                                    .on('click', '#reload2', function () {
                                        window.location.reload();
                                    })
                                    .on('shown.bs.modal', function () {
                                        self.$('button').focus();
                                    }
                                );
                            }
                        });

                        reloadNotificationView2 = new ReloadNotificationView2({
                            el: $('#' + bootstrapModalContainerView2.id)
                        });
                        reloadNotificationView2.render();
                    }
                    // /Strict AppCache updateready modal window
                }, false);
            }

            // OK, bring the page alive!
            $('#splashscreen').addClass('animated fadeOut')
                // When animation ends:
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                    $(e.target).addClass('hidden');
                });

            setTimeout(function () {
                $('#main').removeClass('hidden').addClass('animated fadeIn');
                $('#mainSection').removeClass('hidden').addClass('animated fadeIn');
                $('#roundFooter').removeClass('hidden').addClass('animated fadeIn');
                $('#seasonFooter').removeClass('hidden').addClass('animated fadeIn');
                $('footer').removeClass('hidden').addClass('animated fadeIn');
            }, 1000);
        });
    }
);
