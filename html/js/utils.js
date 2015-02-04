var utils = (function ($) {
    var $window = $(window),
        $document = $(document),
        $body = $('body');

    function limitScroll(event, $boundary) {
        var scroll = $window.scrollTop(),
            max = $boundary.outerHeight() - $window.height();

        if (scroll < 0) {
            $document.scrollTop(0);
        } else if (scroll > max) {
            $document.scrollTop(max);
        }
    }

    function isMobile() {
        return $window.width() < (40 * 16) || /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile/i.test(navigator.userAgent);
    }

    function createNodes(list) {
        var result = {};

        for (key in list) {
            result[key] = $(list[key]);
        }

        return result;
    }

    return {
        createNodes: createNodes,
        isMobile: isMobile,
        limitScroll: function ($boundary) {
            $window.on('scroll', function (event) {
                limitScroll(event, $boundary);
            });
        }
    }
})(jQuery);