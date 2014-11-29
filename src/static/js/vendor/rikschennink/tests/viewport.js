
/**
 * Tests if viewport is app
 * @module tests/viewport
 */
define(function(){

    'use strict';

    var _type = 'web';

    return {

        /**
         * Is this a hybrid viewport
         */
        setup:function() {
            var isCordova = (new RegExp('"isCordova":true')).test(localStorage.getItem('app-context.json'));
            if (isCordova) {
                _type = navigator.userAgent.match(/(Android)/) ? 'android' : 'ios';
            }
        },

        /**
         * Tests if matches
         * @param {String} expected
         * @returns {Boolean}
         */
        assert:function(expected) {
            if (expected === 'hybrid') {
                return _type !== 'web';
            }
            return _type == expected;
        }

    };

});
