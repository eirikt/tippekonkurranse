/* global define:false, */

define([ 'jquery', 'underscore', 'backbone', 'marionette' ],
    function ($, _, Backbone, Marionette) {
        'use strict';

        return Marionette.ItemView.extend({
            jqplotId: 'jqplot',
            graphFilteringId: 'graphFiltering',
            graphHeight: 400,
            originalCollection: null,
            //graphFilteringTemplate: null,

            template: false,

            // TODO: Reactivate and fix
            //events: {
            //    "click #graphSeriesFiltering": function (event) {
            //        var show = $($(event.target).get(0)).is(':checked'),
            //            userId = $($(event.target).get(0)).attr('name'),
            //            model = this.originalCollection.findWhere({ userId: userId });
            //        if (show) {
            //            this.collection.add(model);
            //        } else {
            //            this.collection.remove(model);
            //        }
            //    }
            //},

            onBeforeRender: function () {
                //console.log('"onBeforeRender"');
                this.originalCollection = this.collection.clone();
                //this.graphFilteringTemplate = _.template(this._getUsersAsCheckboxes());
                this.$el.empty();
                this.$el.append('<div id="' + this.jqplotId + '">');
                //this.$el.append('<div id="' + this.graphFilteringId + '" style="margin-top:2rem;margin-bottom:2rem;margin-left:8rem;">');

                this.$('#' + this.jqplotId).css({ height: this.graphHeight + 'px' });
            },
            onRender: function () {
                //console.log('"onRender"');
            },
            onBeforeDestroy: function () {
                //console.log('"onBeforeDestroy"');
            },
            onDestroy: function () {
                //console.log('"onDestroy"');
            },
            onShow: function () {
                // react to when a view has been shown
                //console.log('"onShow"');

                // Graph
                $.jqplot(this.jqplotId, this.collection.getJqPlotPlot(), this.getJqPlotConfig());

                // Filtering options
                //this.$('#' + this.graphFilteringId).empty().append(this.graphFilteringTemplate());

                // Parent element modifications
                var elTotalHeight = this.graphHeight + this.$('#' + this.graphFilteringId).height() + 10 + 'px';
                this.$el.css({ height: elTotalHeight });
            },
            onDomRefresh: function () {
                // manipulate the `el` here. it's already
                // been rendered, and is full of the view's
                // HTML, ready to go.
                //console.log('"onDomRefresh"');
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

            getJqPlotConfig: function () {
                this.collection.round = parseInt(this.collection.round, 10);
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

            /*
             initAndRender: function () {
             this.originalCollection = this.collection.clone();
             this.graphFilteringTemplate = _.template(this._getUsersAsCheckboxes());
             this.$el.empty();

             this.$el.append('<div id="' + this.jqplotId + '">');
             this.$el.append('<div id="' + this.graphFilteringId + '" style="margin-top:2rem;margin-bottom:2rem;margin-left:8rem;">');

             this.render();
             },
             */

            /*
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
             */

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
