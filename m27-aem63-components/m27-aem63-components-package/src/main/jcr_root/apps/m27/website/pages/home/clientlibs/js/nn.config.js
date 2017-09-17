(function ($) {
    'use strict';

    nn.config = nn.config || {};
    $.extend(nn.config, {
        initModulesNotInDOM: false,
        init: function () {
            $.extend(nn.config, {
                module: {},
                loadFirst: [],
                loadLast: []
            });
        }
    });
}(nn.jQuery || jQuery));
