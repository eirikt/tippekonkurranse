/* global define:false */

define([ "jquery", "underscore", "backbone" ],
    function ($, _, Backbone) {
        "use strict";

        /**
         * TODO: Document!
         *
         * Kind of crappy function ...
         *
         * Expecting model with: ...
         *
         */
        var SimpleTableView = Backbone.View.extend({
            // TODO: tagName does not seem to work!?
            //tagName: "table",
            //className: "simple-table",

            numberOfRowsInTable: 15,
            defaultEmphasizeFormat: "0+0",

            initialize: function () {
                this.emphasizeFormat = _.toArray(arguments)[ 0 ].emphasizeFormat || this.defaultEmphasizeFormat;
                if (this.model instanceof Backbone.Model) {
                    this.model = this.model.toJSON();
                } else if (_.isArray(this.model)) {
                    var teams = _.clone(this.model);
                    var self = this;
                    this.model = [];
                    _.each(teams, function (team, index) {
                        if (_.isObject(team)) {
                            self.model.push(team);
                        } else {
                            self.model.push({ no: index + 1, name: team });
                        }
                    });
                }
            },
            getNormalTableRow: function (team) {
                if (team && team.matches) {
                    return '' +
                        '<tr>' +
                        '  <td style="text-align:right;">' + team.no + '.&nbsp;</td>' +
                        '  <td>(' + team.matches + ')&nbsp;</td>' +
                        '  <td>' + team.name + '</td>' +
                        '</tr>';
                } else {
                    return '' +
                        '<tr>' +
                        '  <td style="text-align:right;">' + team.no + '.&nbsp;</td>' +
                        '  <td>' + team.name + '</td>' +
                        '</tr>';
                }
            },
            getEmphasizedTableRow: function (team) {
                if (team && team.matches) {
                    return '' +
                        '<tr>' +
                        '  <td style="font-weight:bold;text-align:right;">' + team.no + '.&nbsp;</td>' +
                        '  <td style="font-weight:bold;">(' + team.matches + ')&nbsp;</td>' +
                        '  <td style="font-weight:bold;">' + team.name + '</td>' +
                        '</tr>';
                } else {
                    return '' +
                        '<tr>' +
                        '  <td style="font-weight:bold;text-align:right;">' + team.no + '.&nbsp;</td>' +
                        '  <td style="font-weight:bold;">' + team.name + '</td>' +
                        '</tr>';
                }
            },
            render: function () {
                var self = this,
                    teamEmphasizeArray = this.emphasizeFormat.split("+", 2),
                    numberOfTeamsToEmphasizeAtStart = parseInt(teamEmphasizeArray[ 0 ], 10),
                    numberOfTeamsToEmphasizeAtEnd = parseInt(teamEmphasizeArray[ 1 ], 10);

                this.$el.empty();
                _.each(this.model, function (team, index) {
                    if (numberOfTeamsToEmphasizeAtStart > index) {
                        self.$el.append(self.getEmphasizedTableRow(team));
                    } else if (numberOfTeamsToEmphasizeAtEnd > self.numberOfRowsInTable - index) {
                        self.$el.append(self.getEmphasizedTableRow(team));
                    } else {
                        self.$el.append(self.getNormalTableRow(team));
                    }
                });

                this.$el.wrapInner("<table/>");

                return this;
            }
        });

        return {
            SimpleTableView: SimpleTableView
        };
    }
);
