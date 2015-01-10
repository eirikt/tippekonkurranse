/* global define:false, */
define([ 'jquery', 'underscore', 'backbone', 'marionette' ],
    function ($, _, Backbone, Marionette) {
        'use strict';

        return Marionette.ItemView.extend({
            jqplotId: 'jqplot',
            graphFilteringId: 'graphFiltering',
            graphHeight: 400,
            collection: null,
            originalCollection: null,
            graphFilteringTemplate: null,

            template: false,

            events: {
                'click div.checkbox-inline': function (event) {
                    var show = $(event.target).is(':checked'),
                        userId = $(event.target).attr('name'),
                        model = this.originalCollection.findWhere({ userId: userId });
                    if (show) {
                        this.collection.add(model);
                    } else {
                        this.collection.remove(model);
                    }
                }
            },

            collectionEvents: {
                'add': '_renderJqplot',
                'remove': '_renderJqplot'
            },

            initialize: function () {
                this.originalCollection = this.collection.clone();
                this.graphFilteringTemplate = _.template(this._getUsersAsCheckboxes());
            },

            onRender: function () {
                this.$el.empty();
                this.$el.append('<div id="' + this.jqplotId + '">');
                this.$el.append('<div id="' + this.graphFilteringId + '" style="margin-top:2rem;margin-bottom:2rem;margin-left:8rem;">');

                this.$('#' + this.jqplotId).css({ height: this.graphHeight + 'px' });
            },

            onDomRefresh: function () {
                // Graph
                this._renderJqplot({ animation: true });

                // Filtering options
                this.$('#' + this.graphFilteringId).empty().append(this.graphFilteringTemplate());

                // Parent element modifications
                var elTotalHeight = this.graphHeight + this.$('#' + this.graphFilteringId).height() + 10 + 'px';
                this.$el.css({ height: elTotalHeight });
            },

            _getJqPlotConfig: function () {
                this.collection.round = parseInt(this.collection.round, 10);
                return {
                    seriesDefaults: {
                        rendererOptions: {
                            smooth: true,
                            animation: {
                                show: false
                            }
                        }
                    },
                    series: this.collection.getJqPlotSeries(),
                    //title: '<p style="padding-bottom:1rem;">The awful truth ...</p>',
                    legend: {
                        show: true
                    },
                    axes: {
                        xaxis: {
                            label: 'Tippeligarunde',
                            min: 0,
                            max: this.collection.round + 4,
                            numberTicks: this.collection.round + 5
                        },
                        yaxis: {
                            label: '&nbsp;&nbsp;&nbsp;&nbsp;Poeng',
                            min: 100,
                            max: 30,
                            numberTicks: 8
                        }
                    }//,
                    // TODO: Get highlightning and/or cursor values to work ...
                    //highlighter: {
                    //    show: true,
                    //    sizeAdjust: 7.5
                    //},
                    //cursor: {
                    //    show: true,
                    //    tooltipLocation: 'sw'
                    //}
                };
            },

            // TODO: Rewrite to CollectionView ...
            // TODO: Restyle with nice overlay ...
            _getUsersAsCheckboxes: function () {
                // TODO: Rewrite to using reduce ...
                var checkBoxes = _.map(this.collection.pluck('userId'), function (userId) {
                    return '' +
                        '<div class="checkbox-inline">' +
                        '  <label class="checkbox-inline">' +
                        '    <input type="checkbox" name="' + userId + '" checked>' + userId.unSnakify().toTitleCase() +
                        '  </label>' +
                        '</div>';
                });
                checkBoxes.unshift('<form id="graphSeriesFiltering">');
                checkBoxes.push('</form>');
                return checkBoxes.join("");
            },

            _renderJqplot: function (options) {
                // Graph
                var jqPlotConfig = this._getJqPlotConfig();
                if (options && options.animation) {
                    jqPlotConfig.seriesDefaults.rendererOptions.animation.show = true;
                }
                this.$('#' + this.jqplotId).empty().css({ height: this.graphHeight + 'px' });
                $.jqplot(this.jqplotId, this.collection.getJqPlotPlot(), jqPlotConfig);
            }
        });
    }
);
