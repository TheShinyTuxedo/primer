var sticky = (function ($) {
    var selectors = {
            window: window,
            document: document,
            body: 'body',
            sticky: '.sticky',
            placeholder: '.sticky__placeholder'
        },
        classes = {
            pinned: 'sticky--pinned',
            reset: 'sticky--reset'
        },
        nodes = {},
        stickyPinned = false;

    function scrollSticky() {
        var scroll = nodes.body.scrollTop();

        nodes.placeholder.each(function () {
            var placeholder = $(this),
                sticky = placeholder.data('sticky'),
                pinned = placeholder.data('pinned'),
                position = placeholder.data('position'),
                offset = 0,
                setPin = false,
                unsetPin = false;

            switch (position) {
                case 'top':
                    setPin = (!pinned && (scroll + offset) >= placeholder.offset().top);
                    unsetPin = (pinned && (scroll + offset) < placeholder.offset().top);
                    break;

                case 'bottom':
                    offset = nodes.window.height() - placeholder.outerHeight();
                    setPin = (!pinned && (scroll + offset) < placeholder.offset().top);
                    unsetPin = (pinned && (scroll + offset) >= placeholder.offset().top);
                    break;
            }

            if (setPin) {
                sticky.addClass(classes.pinned);
                placeholder.data('pinned', true);
            }

            if (unsetPin) {
                sticky.removeClass(classes.pinned);
                placeholder.data('pinned', false);
            }
        });
    }

    function setSticky() {
        nodes.sticky.each(function () {
            var sticky = $(this),
                placeholder = sticky.next(selectors.placeholder),
                overlap = sticky.hasClass('sticky--overlap');

            if (placeholder.length <= 0) {
                placeholder = $('<div class="sticky__placeholder" />');

                sticky.after(placeholder);
            }

            sticky.addClass(classes.reset);

            // set dimensions
            var width = sticky.outerWidth() + 'px',
                height = sticky.outerHeight() + 'px';

            sticky.css({
                width: width,
                height: height
            });

            placeholder.css('height', height)
                .data('position', (sticky.hasClass('sticky--bottom') ? 'bottom' : 'top'))
                .data('sticky', sticky);

            if (overlap) {
                placeholder.css('margin-bottom', '-' + height);
            }

            sticky.removeClass(classes.reset);
        });

        setTimeout(function () {
            nodes.placeholder = $(selectors.placeholder);

            scrollSticky();
        }, 10);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);


            // create and resize
            setSticky();
            nodes.window.on('resize', setSticky);


            // scroll
            nodes.document.on('scroll', scrollSticky);
            $.subscribe('/page/repositionStickyItems', scrollSticky);
        }
    };
})(jQuery);

jQuery(function () {
    sticky.init();
});
