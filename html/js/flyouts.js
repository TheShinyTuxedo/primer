var flyouts = (function ($) {
    var selectors = {
            document: document,
            body: 'body',
            overlay: '.page-overlay',
            toggleFlyout: '.js-toggle-flyout',
            showFlyout: '.js-show-flyout',
            closeFlyout: '.js-close-flyout'
        },
        classes = {
            open: 'flyout-open',
            openRight: 'flyout-open--right',
            active: 'flyout--active',
            visible: 'flyout--visible'
        },
        settings = {
            transition: 300,
            buffer: 10
        },
        nodes = {};

    function toggleFlyout(event) {
        if (event) {
            event.preventDefault();
        }

        var flyout = $('.' + classes.active),
            id = $(this).data('flyout');

        if (flyout.length <= 0) {
            showFlyout(false, id);
        } else {
            closeFlyout();
        }
    }

    function showFlyout(event, flyoutId) {
        if (event) {
            event.preventDefault();
        }

        var flyout = $((flyoutId || $(this).data('flyout'))),
            id = flyout.attr('id'),
            position = (flyout.hasClass('.flyout--right') ? 'right' : (flyout.hasClass('.flyout--top') ? 'top' : 'left'));

        if (flyout.length <= 0) {
            return;
        }

        $.publish('/flyouts/flyoutOpening', [id]);

        nodes.body.addClass(classes.open);

        if (position === 'right') {
            nodes.body.addClass(classes.openRight);
        }

        flyout.addClass(classes.active);

        setTimeout(function () {
            flyout.addClass(classes.visible);
            nodes.overlay.fadeIn(settings.transition);

            $.publish('/flyouts/flyoutOpen', [id]);
        }, settings.buffer);
    }

    function closeFlyout(event) {
        if (event) {
            event.preventDefault();
        }

        var flyout = $('.' + classes.visible),
            id = flyout.attr('id');

        if (flyout.length <= 0) {
            return;
        }

        $.publish('/flyouts/flyoutClosing', [id]);

        nodes.body.removeClass(classes.open);
        nodes.body.removeClass(classes.openRight);

        flyout.removeClass(classes.visible);
        nodes.overlay.fadeOut(settings.transition);

        setTimeout(function () {
            flyout.removeClass(classes.active);

            $.publish('/flyouts/flyoutClosed', [id]);
        }, settings.transition);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);


            // toggle
            nodes.document.on('click', selectors.toggleFlyout, toggleFlyout);


            // show
            nodes.document.on('click', selectors.showFlyout, showFlyout);

            $.subscribe('/flyouts/showFlyout', showFlyout);


            // close
            nodes.overlay.on('click', closeFlyout);

            nodes.document.on('click', selectors.closeFlyout, closeFlyout);

            $.subscribe('/closeAll', closeFlyout);

            $.subscribe('/flyouts/closeFlyout', closeFlyout);
        }
    };
})(jQuery);

jQuery(function () {
    flyouts.init();
});
