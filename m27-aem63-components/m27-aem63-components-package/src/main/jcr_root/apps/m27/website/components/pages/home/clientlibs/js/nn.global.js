(function ($) {
    'use strict';

    nn.global = nn.global || {};
    nn.global.modules = nn.global.modules || [];

    /**
     * cache often used elements on the page
     *
     * dataSelectors - (jQuery element) - elements with data-nn-selector attribute
     */
    nn.global.cache = nn.global.cache || {};
    $.extend(nn.global.cache, {
        dataSelectors: false,
        dataClonedSelectors: false,

        /**
         * define custom caching functions for often used elements
         * gets called on page init
         */
        setCache: function (c) {
            this.dataSelectors = $(c).find('[data-nn-selector]');
            this.dataClonedSelectors = this.dataSelectors.filter('[data-nn-selector-params="clone"]').clone();
        }
    });

    /**
     * define environments that can be used to decide if modules get initialized
     *
     * publish (boolean) - page is on publish
     * cqEdit (boolean) - page is in AEM edit mode
     * cqPreview (boolean) - page is in AEM preview mode
     * cqDesign (boolean) - page is in AEM design mode
     * tracking (boolean) - tracking is allowed on page
     * menusupported (boolean) - mobile menu is supported by browser
     */
    nn.global.env = nn.global.env || {}; // add here all environment variables
    $.extend(nn.global.env, {
        publish: true,
        cqEdit: false,
        cqPreview: false,
        cqDesign: false,
        tracking: false,
        menusupported: true,

        /**
         * define custom env functions for project specific environments.
         * gets called on page init
         */
        setEnv: function () {
        }
    });

    /**
     * set status variables that get used and reused multiple times on a page
     *
     * debug (boolean) - status of the debug mode
     * initialized (boolean) - page initialization finished
     * setupComplete (boolean) - global caching, setting of environments and status variables finished
     * iframe (boolean) - the current page is inside an iframe
     * svg (boolean) - the browser supports svg images
     * direction (string 'ltr'/'rtl') - reading direction on the current page
     * login (boolean) - a user is logged in on the current page
     * placeholderSupport (boolean) - the browser supports placeholders
     * rootDomain (string) - root domain of the current page
     */
    nn.global.status = nn.global.status || {}; // add here all statuses
    $.extend(nn.global.status, {
        debug: false,
        initialized: false,
        setupComplete: false,
        iframe: false,
        svg: false,
        direction: 'ltr',
        login: false,
        placeholderSupport: true,
        rootDomain: '',
        textzoom: 1, //Temp homepage global variables
        storageEnabled: false, //Temp homepage global variables,
        isIE: false,

        /**
         * define custom status functions for project specific status variables.
         * gets called on page init
         */
        setStatus: function () {
        	
        }
    });

}(nn.jQuery || jQuery));