var preloader = (function ($) {
    var selectors = {
            body: 'body',
            preloader: '.preloader'
        },
        classes = {
            ready: 'page-ready',
            complete: 'preloader--complete'
        },
        nodes;

    function complete() {
        window.setTimeout(function () {
            nodes.body.addClass(classes.ready);

            nodes.preloader.addClass(classes.complete);

            window.setTimeout(function () {
                nodes.preloader.remove();
            }, 500);
        }, 500);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            $(window).on('load', complete);
        }
    }
})(jQuery);

jQuery(function () {
    preloader.init();
});
