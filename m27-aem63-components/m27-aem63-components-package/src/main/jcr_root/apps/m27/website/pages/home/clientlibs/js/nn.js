window.nn = window.nn || {};

jQuery.extend(nn, {
//    releasing $: Completely move jQuery to a new namespace in another object. Restores jQuery's globally scoped
//    variables to the first loaded jQuery. Only needed when two jQuery Versions in parallel are used
//       jQuery: jQuery.noConflict(true)
    jQuery: jQuery
});

// Fallback for creating Objects
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        'use strict';
        function F() {}
        F.prototype = o;
        return new F();
    };
}

(function ($) {
    'use strict';

    // documentready init
    $(document).ready(function () {
        nn.init.all('body', 'documentready');
    });
}(nn.jQuery || jQuery));