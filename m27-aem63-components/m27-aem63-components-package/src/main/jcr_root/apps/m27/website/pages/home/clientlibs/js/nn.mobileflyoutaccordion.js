/**
 *
 * Functionality to manage the mobile accordions
 *
 * required plugins - jQuery
 *
 */

(function ($) {
    'use strict';
    window.nn = nn || {};
    nn.mobileflyoutaccordion = nn.mobileflyoutaccordion || {};
    $.extend(nn.mobileflyoutaccordion, {

        init: function (c, options) {
            $.extend(true, this.options, options);
            this.element = c;
            c.click({index: options.index}, function(e) {
            	nn.mobileflyoutaccordion.toggleAccordionFlyout(e);
            });
            
        },
        
        toggleAccordionFlyout: function (e) {
            e.preventDefault();
            if (typeof e.data.index !== 'undefined') {
                var accordionArea = nn.global.cache.dataSelectors.filter('[data-nn-selector="mobile-accordion-area-'+e.data.index+'"]');
                var icon = nn.global.cache.dataSelectors.filter('[data-nn-selector="mobile-accordion-icon-'+e.data.index+'"]');
                if (accordionArea.is(":visible")) {
                    accordionArea.hide();
                    icon.toggleClass('ion-chevron-up ion-chevron-down');
                } else {
                    accordionArea.show();
                    icon.toggleClass('ion-chevron-down ion-chevron-up');
                }
             }
        }
    });
})(nn.jQuery || jQuery);