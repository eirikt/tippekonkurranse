/* global define:false, */

define(['jquery', 'underscore', 'backbone'],
    function ($, _, Backbone) {
        'use strict';

        return Backbone.View.extend({
            id: 'jqplot',
            graphHeight:'400px',

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
                        title: '<p style="padding-bottom:1rem;">The awful truth ...</p>',
                        legend: {
                            show: true
                        },
                        axes: {
                            xaxis: {
                                label: 'Tippeligarunde',
                                min: 0,
                                max: 30,
                                numberTicks: 31
                            },
                            yaxis: {
                                label: '&nbsp;&nbsp;&nbsp;&nbsp;Poeng',
                                min: 100,
                                max: 1,
                                numberTicks: 10
                            }
                        }
                    }
                );
                return this;
            }
        });
    }
);

/*
 $.jqplot('chartdiv', [
 {
 // Give the plot a title.
 title: 'The awful truth ...',

 //highlighter: {
 //   show: true,
 //    sizeAdjust: 1,
 //    tooltipOffset: 9
 //},
 //grid: {
 //    background: 'rgba(57,57,57,0.0)',
 //    drawBorder: false,
 //    shadow: false,
 //    gridLineColor: '#666666',
 //    gridLineWidth: 2
 //},
 legend: {
 show: true//,
 //location: 'ne'//,     // compass direction, nw, n, ne, e, se, s, sw, w.
 //xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
 //yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
 },
 //legend: {
 //    show: true,
 //    placement: 'outside'
 //},
 seriesDefaults: {
 rendererOptions: {
 smooth: true,
 animation: {
 show: true
 }
 }//,
 //showMarker: true
 },
 series: [
 {
 //fill: true,
 label: 'Einar'
 },
 {
 label: 'Trond'
 },
 {
 label: 'Hans Brnhard'
 }
 ],

 // You can specify options for all axes on the plot at once with
 // the axesDefaults object.  Here, we're using a canvas renderer
 // to draw the axis label which allows rotated text.
 //axesDefaults: {
 //    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
 //},

 // An axes object holds options for all axes.
 // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
 // Up to 9 y axes are supported.
 axes: {
 // options for each axis are specified in seperate option objects.
 xaxis: {
 label: 'Tippeligarunde',
 min: 0,
 max: 30,
 numberTicks: 31//,
 //ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
 //tickOptions: {
 //    mark: 'outside',    // Where to put the tick mark on the axis 'outside', 'inside' or 'cross',
 //    showMark: true,
 //    showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
 //    markSize: 4,        // length the tick will extend beyond the grid in pixels.  For 'cross', length will be added above and below the grid boundary,
 //    show: true,         // wether to show the tick (mark and label),
 //    showLabel: true,    // wether to show the text label at the tick,
 //    formatString: ''   // format string to use with the axis tick formatter
 //},
 //showTicks: true,        // whether or not to show the tick labels,
 //showTickMarks: true    // wether or not to show the tick marks
 //tickRenderer: $.jqplot.CanvasAxisTickRenderer

 // Turn off "padding".  This will allow data point to lie on the
 // edges of the grid.  Default padding is 1.2 and will keep all
 // points inside the bounds of the grid.
 //pad: 0
 },
 yaxis: {
 label: 'Plassering',
 min: 13,
 max: 1,
 numberTicks: 13//,
 //ticks: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
 }//,

 // Turns on animatino for all series in this plot.
 //animate: true,

 // Will animate plot on calls to plot1.replot({resetAxes:true})
 //animateReplot: true
 }
 }
 );
 */