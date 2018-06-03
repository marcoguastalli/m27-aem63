/**
 *
 * Functionality to manage the mobile toggle
 *
 * required plugins - jQuery
 *
 *
 *
 */

(function ($) {
    'use strict';
    window.nn = nn || {};
    nn.mobiletoggle = nn.mobiletoggle|| {};
    $.extend(nn.mobiletoggle, {
    	
        init: function (c, options) {
            $.extend(true, this.options, options);
            this.element = c;
            c.click(function(e) {
            	nn.mobiletoggle.toggleMobileFlyout(e);
            });
            
        },
        
        toggleMobileFlyout: function (e) {
        	e.preventDefault();
        	var section = nn.global.cache.dataSelectors.filter('[data-nn-selector="header-flyout-mobile"]');
        	section.toggle();
        }
    });
})(nn.jQuery || jQuery);