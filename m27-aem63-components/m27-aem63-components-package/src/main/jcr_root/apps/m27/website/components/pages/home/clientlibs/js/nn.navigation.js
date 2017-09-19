/**
 *
 * Functionality to manage the navigations
 *
 * required plugins - jQuery
 *
 *
 *
 */

(function ($) {
    'use strict';
    window.nn = nn || {};
    nn.navigation = nn.navigation || {};
    $.extend(nn.navigation, {

        init: function (c, options) {
            $.extend(true, this.options, options);
            this.element = c;
            c.click({index: options.index}, function(e) {
                nn.navigation.toggleDesktopNavigationFlyout(e);
            });

        },

        toggleDesktopNavigationFlyout: function(e) {
            e.preventDefault();
            if (typeof e.data.index !== 'undefined') {
                var section = nn.global.cache.dataSelectors.filter('[data-nn-selector="header-flyout-'+e.data.index+'"]');
                if (!section.is(":visible")) {
                    $(".o-header__flyout").hide()
                }
                section.toggle();
            }
        }
    });
})(nn.jQuery || jQuery);