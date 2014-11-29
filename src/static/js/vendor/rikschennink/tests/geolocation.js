
/**
 * Tests if navigator.geolocation is supported.
 * @module tests/media
 */
define(function(){

    'use strict';

    return {

        _support:false,

        /**
         * Does this browser supports navigator.geolocation
         */
        setup:function() {
            this._support = 'geolocation' in navigator;
        },

        /**
         * Tests if matches
         * @param {String} expected
         * @returns {Boolean}
         */
        assert:function(expected) {
            return expected === 'true' && this._support;
        }

    };

});
