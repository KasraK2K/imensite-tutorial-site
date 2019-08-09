/*----------------------------------------*
*            OWL Carousel code            *
*-----------------------------------------*/


/*----------------------------------------*
*            BOOTSTRAP JS code            *
*-----------------------------------------*/


/*----------------------------------------*
*               OWN js code               *
*-----------------------------------------*/

$(function () {
    // tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // popover
    $('[data-toggle="popover"]').popover();

    // comment carousel
    let comments = $('#comments');
    if (comments.length && $.fn.owlCarousel) {
        comments.owlCarousel({
            rtl: true,
            nav: true,
            items: 1,
            dots: false,
            navText: ['<span class="ti-arrow-right"></span>', '<span class="ti-arrow-left"></span>']
        });
    }

    // gallery carousel
    let postCarousel = $('#postCarousel .owl-carousel');
    if (postCarousel.length && $.fn.owlCarousel) {
        postCarousel.owlCarousel({
            rtl: true,
            nav: true,
            items: 3,
            dots: false,
            navText: ['<i class="fa fa-angle-right" aria-hidden="true"></i>' , '<i class="fa fa-angle-left" aria-hidden="true"></i>'],
            center: true,
            autoplay: false,
            autoplayHoverPause: false,
            loop: true,
            smartSpeed: 1000,
            lazyLoad: false,
            startPosition: 0,
            responsive: {
                0: {items: 1},
                768: {items: 2, center: false},
                992: {items: 3, startPosition: 1, center: true}
            }
        });
    }

    // add active class to active menuItem
    // var activeItem = document.querySelector(`a[href='${location.pathname}']`);
    // activeItem.parentElement.classList.add('active');
    document.querySelector(`a[href='${location.pathname}']`).parentElement.classList.add('active');
});
