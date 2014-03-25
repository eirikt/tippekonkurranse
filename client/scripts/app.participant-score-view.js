/* global define: false */
define(["jquery", "underscore", "backbone"],
    function ($, _, Backbone) {
        "use strict";

        return Backbone.View.extend({
            tagName: 'tr',
            /*
             todoTemplate: _.template('' +
             '<td style="padding-left:2rem;">1</td>' +
             '<td><strong><%= name %></strong></td>' +
             '<td><strong>n/a</strong></td>' +
             '<td style="color:darkgray;">straks klart ...</td>' +
             '<td style="color:darkgray;">straks klart ...</td>' +
             '<td style="color:darkgray;">straks klart ...</td>' +
             '<td style="color:darkgray;">straks klart ...</td>' +
             '<td style="color:darkgray;">straks klart ...</td>' +
             '<td style="color:darkgray;">straks klart ...</td>'
             ),
             */
            template: _.template('' +
                    '<td style="padding-left:2rem;"><%= nr %></td>' +
                    '<td><strong><%= name %></strong></td>' +
                    '<td><strong><%= poengsum %></strong></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= tabell %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= pall %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= cup %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= toppscorer %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= opprykk %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= nedrykk %></td>'
            ),
            render: function () {
                //this.$el.append(this.todoTemplate(this.model));
                this.$el.append(this.template(this.model));

                // OK
                //this.$el.find("td").wrapInner("<div class='hidden'></div>");
                //this.$el.find("div").removeClass("hidden");
                //this.$el.find("div").fadeIn("slow");
                ////this.$el.find("div").show("slow");

                // OK
                var $div = $("<div></div>");
                $div.hide();
                this.$el.find("td").wrapInner($div);
                this.$el.find("div").fadeIn("slow");

                // TODO: with CSS3 animations please ...
                // See: http://easings.net/nb
                //this.$el.find("td").wrapInner("<div class='hidden'></div>");
                //this.$el.find("div").removeClass("hidden").addClass("my-slide-in-effect");

                return this;
            }
        });
    }
);
