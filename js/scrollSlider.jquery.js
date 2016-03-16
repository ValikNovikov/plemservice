
//////// Gallery with thumbnails /////////
 (function($){
    $.scrollSlider = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("scrollSlider", base);

        base.init = function () {
            base.options = $.extend({}, $.scrollSlider.defaultOptions, options);
            var images = base.$el.find('img');
            var scrollSliderWrapper = $('<div class="scroll-slider-wrapper"></div>');
            var slides = $('<div class="slides"></div>');
            scrollSliderWrapper.append(slides);
            var scrollBar = $('<div class="scroll-bar"><div class="scroll-button"></div></div>');
            if(base.options.thumbs)
                var thumbnails = $('<div class="thumbnails"></div>');
            var currentSlide;
            var currentThumb;
            var currentThumbShadow;
            var currentImageWrapper;
            images.each(function () {
                currentSlide = $('<div class="slide"><span class="img-middle-helper"></span></div>');
                $(this).appendTo(currentSlide);
                slides.append(currentSlide);
                if(base.options.thumbs){
                    currentThumb = $('<div class="thumb"></div>');
                    currentThumbShadow = $('<div class="thumb-shadow"><span></span></div>').click(function(){
                        var slideIndex = thumbnails.children().index($(this).parent());
                        firstSlide.animate({
                            "margin-top": (-slideHeight*slideIndex) + 'px'
                        }, 500);
                    });
                    currentThumb.append(currentThumbShadow);
                    currentImageWrapper = $('<div class="thumb-image-wrapper"></div>');
                    var thumb = $(this).clone();
                    thumb.appendTo(currentImageWrapper);
                    currentImageWrapper.appendTo(currentThumb);
                    currentThumb.appendTo(thumbnails);
                    changeThumbSize(thumb[0]);
                }
            });
            base.$el.append(scrollSliderWrapper);
            base.$el.append(scrollBar);
            if(base.options.thumbs)
                base.$el.append(thumbnails);

            base.$el.find('.scroll-button').draggable({
                axis: "y",
                containment: "#"+base.$el.attr('id')+" .scroll-bar",
                drag: checkSlide,
                stop: checkSlide
            });
            var firstSlide = base.$el.find('.slides .slide:first-child');
            var firstSlideMarginTop = parseInt(firstSlide.css('margin-top'));
            var firstThumb = base.$el.find('.thumbnails .thumb:first-child');
            var firstThumbMarginTop = parseInt(firstThumb.css('margin-top'));
            var thumbsHeight = base.$el.find('.thumbnails').height();
            var slideHeight = base.$el.find('.slide').height();
            var scrollStepHeight = base.$el.find('.scroll-bar').innerHeight() / (images.length + 2);
            var currentSlideNumber = 1;
            var lastSlidePos = 0;
            function checkSlide() {
                var scrollPosition = base.$el.find('.scroll-button').position().top - parseInt(base.$el.find('.scroll-bar').css('padding-top'));
                if (scrollPosition > lastSlidePos && scrollPosition > scrollStepHeight * (currentSlideNumber - 1))
                    nextSlide();
                if (scrollPosition < lastSlidePos && scrollPosition < scrollStepHeight * (currentSlideNumber - 1))
                    prevSlide();
                lastSlidePos = scrollPosition;
            }

           function nextSlide() {
                firstSlide.animate({
                    "margin-top": (firstSlideMarginTop -= slideHeight) + "px"
                }, 500);
                if (currentSlideNumber % 2 == 0){
                    base.$el.find('.thumbnails .thumb').each(function(index){
                        if(index > currentSlideNumber && index <= currentSlideNumber + 3)
                            changeThumbSize($(this).find('img')[0]);
                    });
                    firstThumb.animate({
                        "margin-top": (firstThumbMarginTop -= thumbsHeight) + 'px'
                    });
                }
                currentSlideNumber++;
            }

            function prevSlide() {
                currentSlideNumber--;
                firstSlide.animate({
                    "margin-top": (firstSlideMarginTop += slideHeight) + "px"
                }, 500);
                if (currentSlideNumber % 2 == 0)
                    firstThumb.animate({
                        "margin-top": (firstThumbMarginTop += thumbsHeight) + 'px'
                    });
            }

            function changeThumbSize(img){
                if(img.width == 0)
                    return;
                if (img.width > img.height)
                    img.height = base.options.thumbSize;
                else
                    img.width = base.options.thumbSize;
            }
        };
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        //
        // };

        // Run initializer
        base.init();
    };

    $.scrollSlider.defaultOptions = {
        radius: "20px",
        thumbSize : 180,
        thumbs: true
    };

    $.fn.scrollSlider = function(options){
        return this.each(function(){
            (new $.scrollSlider(this, options));

            // HAVE YOUR PLUGIN DO STUFF HERE


            // END DOING STUFF

        });
    };

})(jQuery);

  


//////// Slider on top of gallery /////////
jQuery(document).ready(function ($) {
    var slideCount = $('#scroll-slider-wrapper img').length;
    var slideWidth = $('#scroll-slider-wrapper img').width();
    var slideHeight = $('#scroll-slider-wrapper img').height();
    var sliderUlWidth = slideCount * slideWidth;
    
    $('.scroll-slider-wrapper').css({ width: slideWidth, height: slideHeight });
    
    $('.slides').css({ width: sliderUlWidth, marginLeft: - slideWidth });
    
    $('.slides .slide:last-child > img').prependTo('#scroll-slider-wrapper');

    function moveLeft() {
        $('.slides').animate({
            left: + slideWidth
        }, 200, function () {
            $('.slides .slide:last-child > img').prependTo('.slides');
            $('.slides').css('left', '');
        });
    };

    function moveRight() {
        $('.slides').animate({
            left: - slideWidth
        }, 200, function () {
            $('.slides .slide:last-child > img').appendTo('.slides');
            $('.slides').css('left', '');
        });
    };

    $('a.control_prev').click(function (e) {
        e.preventDefault();
        moveLeft();
    });

    $('a.control_next').click(function (e) {
        e.preventDefault();
        moveRight();
    });

});   
