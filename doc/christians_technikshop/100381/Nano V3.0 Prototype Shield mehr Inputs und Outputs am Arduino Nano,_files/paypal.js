(function () {
    'use strict';

    var PayPal = function (options) {
        this.init(options);
    };

    PayPal.prototype = {
        ppplus: 'https://www.paypalobjects.com/webstatic/ppplus/ppplus.min.js',

        constructor: PayPal,

        init: function (options) {
            this.options = $.extend({}, { selector: '' }, options || {});
        },

        loadPaymentWall: function (loaded) {
            if (typeof PAYPAL != 'undefined' && typeof PAYPAL.apps != 'undefined') {
                return (typeof loaded == 'function') ? loaded() : true;
            }
            this.getScript(this.ppplus).done(function () {
                var validate = function () {
                    if (typeof PAYPAL == 'undefined' || typeof PAYPAL.apps == 'undefined') {
                        window.setTimeout(function () {
                            validate();
                        }, 100);
                    } else if (typeof loaded == 'function') {
                        loaded();
                    }
                }
                validate();
            });
        },

        getInstallments: function (amount, currency) {
            $.evo.io().call('jtl_paypal_get_presentment', [amount, currency], this, function (error, data) {
                if (error) {
                    return;
                }
                $(data.options.selector)
                    .html(data.response || '');
            });
        },

        getScript: function (url, options) {
            return jQuery.ajax($.extend(options || {}, {
                dataType: "script",
                cache: true,
                url: url
            }));
        }
    };

    window.jtl_paypal = function (options) {
        return new PayPal(options);
    };

    $(document).on("evo:changed.price.article", function (e, price) {
        jtl_paypal({ selector: '.ppf-loader' }).getInstallments(price);
    });
})(jQuery);
