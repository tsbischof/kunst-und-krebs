/**
 * @typedef {string} reCaptchaKey
 * @typedef {string} reCaptchaTheme
 * @typedef {string} reCaptchaSize
 * @typedef {string} reCaptchaBadge
 */
reCaptchaCallback = function () {
    let cryptoObj = window.crypto || window.msCrypto;
    let cryptKey  = new Uint32Array(1);
    cryptoObj.getRandomValues(cryptKey);

    let $theForm           = $('form.reCaptchaLoading');
    let $captchaContainer  = $('.reCaptchaContainer', $theForm);
    let $captchaModal      = $('.reCaptchaModal', $theForm);
    let reCaptchaContainer = 'reCaptchaContainer' + cryptKey[0];
    $captchaContainer.attr('id', reCaptchaContainer);

    let reCaptchaOptions = {
        'sitekey': reCaptchaKey,
        'callback': function () {
            $captchaModal.modal('hide');
            $theForm.data('reCaptchaConfirmed', true);
            $theForm.submit();
        },
        'size': reCaptchaSize,
    };
    if (typeof reCaptchaTheme !== 'undefined') {
        reCaptchaOptions.theme = reCaptchaTheme;
    }
    if (typeof reCaptchaBadge !== 'undefined') {
        reCaptchaOptions.badge = reCaptchaBadge;
    }
    let reCaptchaWidgetID = grecaptcha.render(reCaptchaContainer, reCaptchaOptions);
    $theForm.data('reCaptchaWidgetID', reCaptchaWidgetID);
    $('.reCaptchaSend', $theForm).on('click', function () {
        if (reCaptchaOptions.size === 'invisible') {
            grecaptcha.execute(reCaptchaWidgetID);
        }
        $captchaModal.modal('hide');
        $theForm.data('reCaptchaConfirmed', true);
        $theForm.submit();
    });
    if (reCaptchaOptions.size === 'invisible') {
        $captchaModal.on('shown.bs.modal', function () {
            window.setTimeout(function () {
                grecaptcha.execute(reCaptchaWidgetID);
            }, 800);
        });
    }
    $theForm.removeClass('reCaptchaLoading');
    $captchaModal.modal('show');
};

createCaptchaPopup = function ($theForm) {
    let $captchaContainer = $('.reCaptchaContainer', $theForm);
    let $captchaModal     = $('.reCaptchaModal', $theForm);
    if ($captchaContainer.length) {
        $theForm.addClass('reCaptchaLoading');
        let $script = $('head #' + reCaptchaKey);
        if ($script.length === 0) {
            let script = document.createElement('script');
            script.setAttribute('type', 'application/javascript');
            script.setAttribute('id', reCaptchaKey);
            script.setAttribute('async', 'async');
            script.setAttribute('defer', 'defer');
            script.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=reCaptchaCallback&render=explicit');
            document.getElementsByTagName('head')[0].appendChild(script);
        } else {
            let reCaptchaWidgetID = $theForm.data('reCaptchaWidgetID');
            if (reCaptchaWidgetID === undefined) {
                reCaptchaCallback();
            } else {
                grecaptcha.reset(reCaptchaWidgetID);
                $theForm.removeClass('reCaptchaLoading');
                $captchaModal.modal('show');
            }
        }
        return false;
    }
    return true;
};

$(document).ready(function () {
    $(document).on('submit', 'form', function (ev) {
        let $theForm = $(ev.target);
        if (!$theForm.data('reCaptchaConfirmed')) {
            let $captchaContainer = $('.reCaptchaContainer', $theForm);
            if ($captchaContainer.length === 0) {
                return true;
            }
            if (typeof CM !== 'undefined') {
                if (CM.getSettings('recaptcha') === false) {
                    CM.openConfirmationModal('recaptcha', function() {
                        document.dispatchEvent(new CustomEvent('consent.updated', { detail: { recaptcha: true } }));
                        createCaptchaPopup($theForm);
                    });
                    return false;
                }
            }
            return createCaptchaPopup($theForm);
        }
        return true;
    });
});
