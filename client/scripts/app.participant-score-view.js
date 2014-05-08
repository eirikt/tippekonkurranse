/* global define:false */
define(["jquery", "underscore", "backbone", "app.models.scoreModel", "app.result"],
    function ($, _, Backbone, ScoreModel, ParticipantResult) {
        "use strict";

        var RatingTendencyView = Backbone.View.extend({
            tagName: 'span',
            template: _.template('' +
                    '<span class="tendency-arrow"></span>' +
                    '<small>&nbsp;<%= ratingDiff %></small>'
            ),
            render: function () {
                var plusThreshold = 3,
                    upwardTendency = this.model.previousRating - this.model.ratingHidden,
                    downwardTendency = this.model.ratingHidden - this.model.previousRating,
                    $tendency,
                    ratingDiff = this.model.previousRating - this.model.ratingHidden;

                this.model.ratingDiff = "";
                if (ratingDiff !== 0) {
                    if (ratingDiff > 0) {
                        ratingDiff = "+" + ratingDiff;
                    }
                    this.model.ratingDiff = ratingDiff;
                }

                this.$el.append(this.template(this.model));
                $tendency = this.$('span.tendency-arrow');

                if (upwardTendency >= plusThreshold) {
                    $tendency.addClass('icon-up-plus');

                } else if (upwardTendency > 0) {
                    $tendency.addClass('icon-up');

                } else if (downwardTendency >= plusThreshold) {
                    $tendency.addClass('icon-down-plus');

                } else if (downwardTendency > 0) {
                    $tendency.addClass('icon-down');
                }
                $tendency.removeClass('tendency-arrow');

                return this;
            }
        });


        var SumTendencyView = Backbone.View.extend({
            tagName: 'span',
            template: _.template('<small><%= sumDiff %></small>'),
            render: function () {
                var sumDiff = this.model.sum - this.model.previousSum;
                this.model.sumDiff = "";
                if (sumDiff !== 0) {
                    if (sumDiff > 0) {
                        sumDiff = "+" + sumDiff;
                    }
                    this.model.sumDiff = "(" + sumDiff + "p)";
                }
                this.$el.append(this.template(this.model));
                return this;
            }
        });


        var PredictionsModel = Backbone.Model.extend({
            url: function () {
                if (!this.get("userId")) {
                    throw new Error("Missing userId");
                }
                return "/api/predictions/" + this.get("userId");
            }
        });


        var ModalPredictionsTableView = Backbone.View.extend({
            template: _.template('' +
                    '<div class="modal-dialog">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <button type="button" class="close" style="font-size:xx-large;font-weight:bold;" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '      <h4 class="modal-title" id="predictionsLabel"><strong><%= userId %>s tippetips <%= year %></strong></h4>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '      <table>' +
                    '        <tr>' +
                    '          <td>' +
                    '            <p style="margin-left:.8rem;">Tippeliga:<br/><strong><%= tabell %></strong></p>' +
                    '          </td>' +
                    '          <td style="vertical-align:top;padding-left:4rem;">' +
                    '            <p>Toppskårer:</p>' +
                    '            <p><strong><%= toppscorer %></strong></p>' +
                    '            <p style="margin-top:4rem;">Opprykk:</p>' +
                    '            <p><strong><%= opprykk %></strong></p>' +
                    '            <p style="margin-top:4rem;">Cupmester:</p>' +
                    '            <p><strong><%= cup %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
            ),
            initialize: function () {
                this.listenTo(this.model, "change", this.render);
            },
            render: function () {
                // Pretty user name presentation
                this.model.set("userId", ParticipantResult.printableName(this.model.get("userId")), { silent: true });

                // Pretty tabell presentation
                var prettyTabell = this.model.get("tabell");
                prettyTabell = _.reduce(prettyTabell, function (result, team, index) {
                    if (index < 3 || index > 13) {
                        return result +=
                            "<tr>" +
                            "  <td style='font-weight:bold;text-align:right;'>" + (index + 1) + ".&nbsp;</td>" +
                            "  <td style='font-weight:bold;'>" + team + "</td>" +
                            "</tr>";
                    } else {
                        return result +=
                            "<tr>" +
                            "  <td style='color:#5c5c5c;font-weight:bold;text-align:right;'>" + (index + 1) + ".&nbsp;</td>" +
                            "  <td style='color:#5c5c5c;font-weight:bold;'>" + team + "</td>" +
                            "</tr>";
                    }
                }, "<table>");
                prettyTabell += "</table>";
                this.model.set("tabell", prettyTabell, { silent: true });

                // Pretty opprykk presentation
                var prettyOpprykk = this.model.get("opprykk");
                prettyOpprykk = _.reduce(prettyOpprykk, function (result, team, index) {
                    return index > 0 ? result += " og " + team : result += team;
                }, "");
                this.model.set("opprykk", ParticipantResult.printableName(prettyOpprykk), { silent: true });

                this.$el.empty().append(this.template(this.model.toJSON()));
                return this;
            }
        });


        return Backbone.View.extend({
            tagName: 'tr',

            // TODO: use dynamic/common properties names for this
            template: _.template('' +
                    '<td style="padding-left:2rem;text-align:right;"><span style="font-weight:bold;font-size:larger;"><%= rating %></span></td>' +
                    '<td><span style="font-weight:bold;font-size:larger;"><%= name %></span></td>' +
                    '<td class="rating-tendency"></td>' +
                    '<td>' +
                    '  <span style="white-space:nowrap;">' +
                    '    <span style="font-weight:bold;font-size:larger;margin-right:.3rem;"><%= sum %></span>' +
                    '    <span class="sum-tendency"></span>' +
                    '  </span>' +
                    '</td>' +
                    '<td class="prediction" style="padding-left:3rem;">' +
                    '  <button type="button" class="btn btn-sm btn-primary" data-id="<%= userId %>" data-toggle="modal" data-target="#predictionsTable"><%= name %>s tips</button>' +
                    '</td>' +
                    '<td style="color:darkgray;text-align:center;"><%= tabell %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= pall %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= nedrykk %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= toppscorer %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= opprykk %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= cup %></td>'
            ),

            predictionsModel: null,

            modalPredictionsView: null,

            initialize: function () {
                this.predictionsModel = new PredictionsModel({ userId: this.model.userId, year: this.model.year });
                this.modalPredictionsView = new ModalPredictionsTableView({
                    el: $("#predictionsTable"),
                    model: this.predictionsModel
                });
            },

            render: function () {
                var self = this;

                this.$el.append(this.template(this.model));

                // Add rating tendency marker
                this.$(".rating-tendency").append(new RatingTendencyView({ model: this.model }).render().el);

                // Add sum tendency marker
                this.$(".sum-tendency").append(new SumTendencyView({ model: this.model }).render().el);

                // Configure modal predictions view
                this.$(".prediction").on("click", function () {
                    self.predictionsModel.fetch({ reset: true });
                });

                // Smoothly fades in content (default jQuery functionality) (OK)
                var $div = $('<div>').hide();
                this.$el.find('td').wrapInner($div);
                this.$el.find('div').fadeIn('slow');

                // TODO: with CSS3 animations please ...
                // See: http://easings.net/nb
                //this.$el.find("td").wrapInner("<div class='hidden'></div>");
                //this.$el.find("div").removeClass("hidden").addClass("my-slide-in-effect");

                return this;
            }
        });
    }
);
