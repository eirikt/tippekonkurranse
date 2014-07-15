/* global define:false, */

define(['jquery', 'underscore', 'backbone'],
    function ($, _, Backbone) {
        'use strict';

        return Backbone.View.extend({
            jqplotId: 'jqplot',
            graphFilteringId: 'graphFiltering',
            graphHeight: 400,
            originalCollection: null,
            graphFilteringTemplate: null,

            events: {
                "click #graphSeriesFiltering": function (event) {
                    var show = $($(event.target).get(0)).is(':checked'),
                        userId = $($(event.target).get(0)).attr('name'),
                        model = this.originalCollection.findWhere({ userId: userId });
                    if (show) {
                        this.collection.add(model);
                    } else {
                        this.collection.remove(model);
                    }
                }
            },

            initialize: function (options) {
                this.year = options.year;
                this.round = options.round;

                this.listenTo(this.collection, 'reset', this.initAndRender);
                this.listenTo(this.collection, 'add remove', this.immediateRender);
            },

            _getUsersAsCheckboxes: function () {
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

            getJqPlotConfig: function () {
                return {
                    seriesDefaults: {
                        rendererOptions: {
                            smooth: true,
                            animation: {
                                show: true
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
                            max: this.round + 2,
                            numberTicks: this.round + 3
                        },
                        yaxis: {
                            label: '&nbsp;&nbsp;&nbsp;&nbsp;Poeng',
                            min: 100,
                            max: 40,
                            numberTicks: 6
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

            initAndRender: function () {
                this.originalCollection = this.collection.clone();
                this.graphFilteringTemplate = _.template(this._getUsersAsCheckboxes());
                this.$el.empty();

                this.$el.append('<div id="' + this.jqplotId + '">');
                this.$el.append('<div id="' + this.graphFilteringId + '" style="margin-top:2rem;margin-bottom:2rem;margin-left:8rem;">');

                this.render();
            },

            render: function () {
                // Graph
                this.$('#' + this.jqplotId).css({ height: this.graphHeight + 'px' });
                $.jqplot(this.jqplotId, this.collection.getJqPlotPlot(), this.getJqPlotConfig());

                // Filtering options
                this.$('#' + this.graphFilteringId).empty().append(this.graphFilteringTemplate());

                // Parent element modifications
                var elTotalHeight = this.graphHeight + this.$('#' + this.graphFilteringId).height() + 10 + 'px';
                this.$el.css({ height: elTotalHeight });

                return this;
            },

            immediateRender: function () {
                // Graph
                var jqPlotConfig = this.getJqPlotConfig();
                jqPlotConfig.seriesDefaults.rendererOptions.animation.show = false;
                this.$('#' + this.jqplotId).empty().css({ height: this.graphHeight + 'px' });
                $.jqplot(this.jqplotId, this.collection.getJqPlotPlot(), jqPlotConfig);

                // Filtering options
                // ...

                // Parent element modifications
                // ...

                return this;
            }
        });
    }
);
