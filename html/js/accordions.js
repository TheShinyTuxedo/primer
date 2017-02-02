var accordions = (function ($) {
    var selectors = {
            document: document,
            title: '.accordion__title',
            stepTitle: '.step--accordion .step__header'
        },
        classes = {
            active: 'active'
        },
        settings = {
            transition: 100
        },
        nodes = {};

    function toggle() {
        var accordion = $(this),
            content = (accordion.is('.accordion__title') ? accordion.next('.accordion__content') : accordion.next('.step__content'));

        accordion.toggleClass(classes.active);

        content.slideToggle(settings.transition, function () {
            $.publish('/page/repositionStickyItems');
        });
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            nodes.document.on('click', selectors.title, toggle);
            nodes.document.on('click', selectors.stepTitle, toggle);
        }
    };
})(jQuery);

jQuery(function () {
    accordions.init();
});
