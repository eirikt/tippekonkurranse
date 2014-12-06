/* global define:false */
define([ 'jquery', 'underscore', 'backbone' ],
    function ($, _, Backbone) {
        'use strict';

        /** @see http://getbootstrap.com/javascript/#modals */
        var ModalContainerView = Backbone.View.extend({
            tagName: 'div',
            className: 'modal fade',
            parentSelector: null,
            ariaLabelledBy: null,
            attributes: function () {
                return {
                    id: this.id,
                    tabindex: -1,
                    role: 'dialog',
                    'aria-labelledby': this.ariaLabelledBy,
                    'aria-hidden': true
                };
            },
            initialize: function (attr) {
                this.parentSelector = attr.parentSelector;
            },
            reset: function () {
                $('#' + this.id).empty().remove();
                $(this.parentSelector).append(this.el);
            }
        });

        return {
            ModalContainerView: ModalContainerView
        };
    }
);
