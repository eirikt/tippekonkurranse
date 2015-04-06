/* global define:false */
define(['jquery', 'underscore', 'moment', 'backbone', 'marionette'],
    function ($, _, Moment, Backbone, Marionette) {
        'use strict';

        return Marionette.ItemView.extend({
            tagName: 'div',
            className: 'clearfix',

            template: function (scores) {
                var scoresTemplate = '' +
                    '<span style="white-space:nowrap;">' +
                    '  <span class="heading"><a href="/#/scores/current">Tippekonkurranse <%= args.year %></a></span>' +
                    '  <span class="heading-extra">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= args.round %></span>' +
                    '  <span class="dimmed heading-extra">&nbsp;av 30</span>' +
                    '  <span id="offlineScoresNotification" class="hidden" ' +
                    'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                    'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;"></span>' +
                    '</span>' +

                    '<span class="countdown pull-right" style="white-space:nowrap;">' +
                        // TODO: This is a view!
                    '  <span id="autoPageRefresh" class="x-small">' +
                        //'    <span>Nye data om</span>' +
                        //'    <em><span id="autoPageRefreshCountdown"></span></em>' +
                        //'    <span>sekunder</span>' +
                    '  </span>' +

                    '  <span class="pull-right" style="margin-left:.4rem;">' +
                    '    <input id="autoPageRefreshToggler" type="checkbox" />' +
                    '    <button id="pageRefresher" type="button" class="btn btn-default" style="width:10rem;margin-left:2rem;">Oppdater nå!</button>' +
                    '  </span>' +
                    '</span>';

                var preSeasonTemplate = '' +
                    '<span class="heading"><a href="/#/scores/current">Tippekonkurranse <%= args.year %></a></span>' +
                    '<span class="heading-extra">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= args.round %></span>' +
                    '<span class="dimmed heading-extra">&nbsp;av 30</span>' +
                    '<span id="offlineScoresNotification" class="hidden" ' +
                    'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                    'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;"></span>' +

                    '<div class="countdown pull-right">' +
                    '  <span><em>Til seriestart:&nbsp;</em></span>' +
                    '  <span id="countdown"></span>' +
                    '</div>';

                var ratingHistoryTemplate = '' +
                    '<div>' +
                    '  <span class="heading"><a href="/#/scores/current">Tippekonkurranse <%= args.year %></a></span>' +
                    '  <span class="heading-extra">&nbsp;&nbsp;|&nbsp;&nbsp;poengtrend</span>' +
                    '</div>';

                if (scores.isRatingHistory) {
                    return _.template(ratingHistoryTemplate, {
                        year: scores ? scores.year : '?'
                    }, { variable: 'args' });
                }
                if (!window.app.model.get('currentTippeligaSeasonHasStarted')) {
                    return _.template(preSeasonTemplate, {
                        year: scores ? scores.year : '?',
                        round: scores ? scores.round : '?'
                    }, { variable: 'args' });
                }
                return _.template(scoresTemplate, {
                    year: scores ? scores.year : '?',
                    round: scores ? scores.round : '?'
                }, { variable: 'args' });
            },

            events: {
                'click #pageRefresher': function (event) {
                    window.app.execute('getTippekonkurranseScores');
                }
            },

            onRender: function () {
                // TODO: Is this a view?
                this.$('#countdown').countdown(window.app.model.get('currentTippeligaSeasonStartDate'), function (event) {
                    if (event.type === "finish") {
                        console.warn("FINISHED!");
                        window.location.reload();
                    }
                    $(this).html(event.strftime(
                        '<span class="contrast"><strong>%w</strong></span> uker ' +
                        '<span class="contrast"><strong>%d</strong></span> dager ' +
                        '<span class="contrast"><strong>%H</strong></span> timer ' +
                        '<span class="contrast"><strong>%M</strong></span> minutter ' +
                        '<span class="contrast"><strong>%S</strong></span> sekunder'));
                });
            },

            onShow: function () {
                var $autoPageRefresh = $('#autoPageRefresh'),
                    $autoPageRefreshToggler = $('#autoPageRefreshToggler'),
                    autoEnabledInModel = window.app.autoPageRefreshEnabled;//,
                //autoEnabledInView = $autoPageRefreshToggler.is(':checked');

                //console.log("onShow :: autoEnabledInModel=" + autoEnabledInModel);
                //console.log("onShow :: autoEnabledInView=" + autoEnabledInView);
                if (autoEnabledInModel) {
                    $autoPageRefresh.empty().append('<span>Nye data om&nbsp;</span>' +
                    '<span id="autoPageRefreshCountdown" style="font-style:italic;"></span>' +
                    '<span>&nbsp;sekunder</span>');

                    //$('#autoPageRefreshToggler').attr('checked', true);
                    $autoPageRefreshToggler.prop('checked', true);
                    //var autoEnabledInView = $('#autoPageRefreshToggler').is(':checked');
                    //console.log("onShow :: autoEnabledInView=" + autoEnabledInView);
                }

                $autoPageRefreshToggler.bootstrapSwitch({
                    size: 'mini',
                    labelText: 'auto-oppdatering',
                    onSwitchChange: function (event, value) {
                        event.preventDefault();
                        console.log('auto-refresh.value: ' + value + ', auto-refresh.isDefaultPrevented: ' + event.isDefaultPrevented());
                        if (value) {
                            window.app.autoPageRefreshEnabled = true;
                            window.app.autoPageRefreshCountdown();
                            $autoPageRefresh.empty().append('<span>Nye data om&nbsp;</span>' +
                            '<span id="autoPageRefreshCountdown" style="font-style:italic;"></span>' +
                            '<span>&nbsp;sekunder</span>');
                            $autoPageRefresh.show();

                        } else {
                            window.app.autoPageRefreshEnabled = false;
                            $autoPageRefresh.hide();
                        }
                    }
                });
            }
        });
    }
);
