/* global define: false */
define(["underscore", "backbone"],
    function (_, Backbone) {
        "use strict";

        return Backbone.View.extend({
            tagName: 'tr',
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
            /*
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
            */
            render: function () {
                this.$el.append(this.todoTemplate(this.model));
                //this.$el.append(this.template(this.model));
                return this;
            }
        });
    }
);
