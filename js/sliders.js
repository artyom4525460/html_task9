$('#slider-popular').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    prevArrow: false,
    nextArrow: false,
    responsive: [
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
                nextArrow: '<div class="arrow arrow-right"><img src="./images/left.svg" alt="Arrow"></div>',
                prevArrow: '<div class="arrow arrow-left"><img src="./images/left.svg" alt="Arrow"></div>'
            }
        }
    ]
})
