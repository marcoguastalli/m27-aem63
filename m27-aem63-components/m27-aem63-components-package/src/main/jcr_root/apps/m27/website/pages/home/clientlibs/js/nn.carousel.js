(function($, granite) {
    'use strict';

    $(document)
            .ready(
                    function() {
                        var CAROUSEL_CONTAINER = '.carousel-container', 
                        $carousel = $(CAROUSEL_CONTAINER), 
                        $newpar = $carousel.find('.newpar'), 
                        carouselLoaded = false;

                        // if this is loaded not within an iframe directly load the carousel
                        if (window === top) {
                            loadCarousel();
                        } else {
                            // otherwise listen to the message being emitted from the touch UI outer window
                            if (granite) {
                                var command = granite.author.command;
                                var delegetee = command.toggleClass;
                                
                                command.toggleClass = function(path, msg) {
                                    delegetee.apply(this, arguments);
                                    
                                    // check message params
                                    var cmd = msg.data;
                                    
                                    if (cmd.condition === true) {
                                        if (cmd.className == "aem-AuthorLayer-Edit" || cmd.className == "aem-AuthorLayer-Layouting") {
                                            // for mode edit we do not want to rely on the slick library (no carousel visualization)
                                            destroyCarousel();
                                        } else {
                                            // for all other modes use slick to expose the carousel
                                            loadCarousel();
                                        }
                                    }
                                }
                            }
                        }

                        function loadCarousel() {
                            if ($carousel.length && !carouselLoaded) {
                                // remove newpar if existing
                                if ($newpar.length) {
                                    $newpar.remove();
                                }
                                $carousel.slick({
                                            prevArrow : '<i class="carousel-prev ion-ios-arrow-thin-left"></i>',
                                            nextArrow : '<i class="carousel-next ion-ios-arrow-thin-right"></i>',
                                            dots : true,
                                            dotsClass : 'carousel-dots',
                                            adaptiveHeight : true
                                        });
                                carouselLoaded = true;
                            }
                        }

                        function destroyCarousel() {
                            if ($carousel.length && carouselLoaded) {
                                $carousel.slick('unslick');
                                $carousel.append($newpar);
                                carouselLoaded = false;
                            }
                        }
                    });

}(jQuery, window.Granite));