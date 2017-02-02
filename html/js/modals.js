var modals = (function ($) {
    var selectors = {
            document: document,
            body: 'body',
            modal: '.modal',
            show: '.js-show-modal',
            close: '.js-close-modal'
        },
        classes = {
            open: 'modal-open',
            active: 'modal--active',
            visible: 'modal--visible',
            complete: 'modal--complete'
        },
        settings = {
            transition: 200
        },
        timeout,
        nodes;

    function showModal(event, modalId) {
        var trigger = $(this),
            modal = $(modalId ? modalId : (trigger.data('modal') ? trigger.data('modal') : '#modal-generic')),
            id = modal.attr('id'),
            transition = settings.transition;

        if (event && !trigger.is('label')) {
            event.preventDefault();
        }

        if (modal.length <= 0) {
            return;
        }

        clearTimeout(timeout);

        $.publish('/modals/modalOpening', [id, trigger]);

        // video
        if (trigger.data('video')) {
            var src = trigger.attr('href');

            modal.find('.modal__content').mustache('video-template', {src: src}, {method: 'html'});
        }

        // image
        if (trigger.data('image')) {
            var src = trigger.attr('href');

            modal.find('.modal__content').mustache('image-template', {src: src}, {method: 'html'});
        }

        nodes.body.addClass(classes.open);
        modal.addClass(classes.active);

        setTimeout(function () {
            modal.addClass(classes.visible);

            $.publish('/modals/modalOpen', [id, trigger]);

            timeout = setTimeout(function () {
                modal.addClass(classes.complete);
            }, transition);
        }, 10);
    }

    function closeModal(event) {
        if (event) {
            event.preventDefault();
        }

        var modal = $('.' + classes.complete),
            id = modal.attr('id'),
            transition = settings.transition;

        if (modal.length <= 0) {
            return;
        }

        clearTimeout(timeout);

        $.publish('/modals/modalClosing', [id]);

        nodes.body.removeClass(classes.open);
        modal.removeClass(classes.complete);
        modal.removeClass(classes.visible);

        timeout = setTimeout(function () {
            if (modal.attr('id') === 'modal-generic') {
                modal.find('.modal__content').html('');
            }

            modal.removeClass(classes.active);

            $.publish('/modals/modalClosed', [id]);
        }, transition);
    }

    return {
        init: function () {
            nodes = utils.createNodes(selectors);

            // show
            nodes.document.on('click', selectors.show, showModal);

            $.subscribe('/modals/showModal', showModal);


            // close
            nodes.modal.find('.modal__inner:not(.modal__inner--no-dismiss)').on('click', closeModal);

            nodes.modal.find('.modal__content').on('click', '> *', function (event) {
                event.stopPropagation();
            });

            nodes.document.on('click', selectors.close, closeModal);

            $.subscribe('/closeAll', closeModal);

            $.subscribe('/modals/closeModal', closeModal);
        }
    };

})(jQuery);

jQuery(function () {
    modals.init();
});
