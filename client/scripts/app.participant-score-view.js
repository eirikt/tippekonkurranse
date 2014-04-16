/* global define:false */
define(["jquery", "underscore", "backbone"],
    function ($, _, Backbone) {
        "use strict";

        var RatingTendencyView = Backbone.View.extend({
            tagName: 'span',
            template: _.template('' +
                    '<span class="tendency-arrow"></span>' +
                    '&nbsp;&nbsp;' +
                    '<small>(<%= previousRating %>)</small>'
            ),
            render: function () {
                var plusThreshold = 4,
                    upwardTendency = this.model.previousRating - this.model.ratingHidden,
                    downwardTendency = this.model.ratingHidden - this.model.previousRating,
                    statusQuo = upwardTendency === 0 && downwardTendency === 0,
                    $tendency;

                if (!statusQuo) {
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
                    $tendency.removeClass('tendency-arrow')
                        .parent().attr('title', 'Plasseringen fra  tippeligarunde ' + (this.model.round - 1) + ' i parentes');
                }
                return this;
            }
        });

        return Backbone.View.extend({
            tagName: 'tr',
            // TODO: use dynamic/common properties names for this
            template: _.template('' +
                    '<td style="padding-left:2rem;"><%= rating %></td>' +
                    '<td><strong><%= name %></strong></td>' +
                    '<td style="text-align:right;"><strong><%= sum %></strong></td>' +
                    '<td class="tendency"></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= tabell %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= pall %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= nedrykk %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= toppscorer %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= opprykk %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= cup %></td>'
            ),
            render: function () {
                this.$el.append(this.template(this.model));

                // Add tendency marker
                this.$(".tendency").append(new RatingTendencyView({ model: this.model }).render().el);

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
