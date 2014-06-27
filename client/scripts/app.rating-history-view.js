/* global define:false, */

define(['jquery', 'underscore', 'backbone'],
    function ($, _, Backbone) {
        'use strict';

        return Backbone.View.extend({
            id: 'jqplot',
            graphHeight: '400px',

            initialize: function () {
                this.listenTo(this.collection, 'reset', this.render);
            },

            render: function () {
                this.$el.css({ height: this.graphHeight });
                $.jqplot(this.id, this.collection.getJqPlotPlot(),
                    {
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
                                max: 14,
                                numberTicks: 15
                            },
                            yaxis: {
                                label: '&nbsp;&nbsp;&nbsp;&nbsp;Poeng',
                                min: 100,
                                max: 40,
                                numberTicks: 6
                            }
                        }
                    }
                );
                return this;
            }
        });
    }
);
