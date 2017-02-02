var menu = (function ($) {
    var selectors = {
            slidingNav: '.sliding-nav',
            slideBack: '.sliding-nav__back'
        },
        classes = {
            level: 'slide-level--',
            active: 'nav-active'
        },
        settings = {
            transition: 300
        },
        nodes;

    function slideNav(event) {
        event.preventDefault();

        var item = $(this),
            parentItem = item.closest('li.mega').find('a.mega'),
            nav = item.closest('.level0'),
            level = getLevel(item);

        if (!item.is(selectors.slideBack)) {
            // show sub nav
            item.addClass(classes.active);

            nav.addClass(classes.level + level);

            // set min height
            nav.css('min-height', item.next('.childcontent').outerHeight() + 'px');
        } else {
            // hide sub nav
            if (parentItem) {
                setTimeout(function () {
                    parentItem.removeClass(classes.active);
                }, settings.transition);
            }

            nav.removeClass(classes.level + level);

            // reset min height
            nav.css('min-height', 0);
        }
    }

    function getLevel(item) {
        var group = item.closest('ul'),
            level = group.data('level');

        return level;
    }

    function setup() {
        nodes.slidingNav.each(function () {
            var nav = $(this),
                childcontent = nav.find('.childcontent'),
                parent = nav.find('a.haschild');

            childcontent.prepend('<a class="sliding-nav__back"><i class="icon-left"></i> Back</a>');

            parent.each(function () {
                var item = $(this),
                    href = item.attr('href');

                if (href && href !== '') {
                    item.next('.childcontent').find('.megamenu').first().prepend('<li><a href="' + href + '">' + item.html() + '</a>');
                }
            });
        });
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            setup();

            // slide events
            nodes.slidingNav.find('a.haschild').on('click', slideNav);

            nodes.slidingNav.on('click', selectors.slideBack, slideNav);
        }
    };

})(jQuery);

jQuery(function () {
    menu.init();
});
