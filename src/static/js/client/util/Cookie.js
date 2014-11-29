/**
 * Cookie
 * https://github.com/jgallen23/cookie-monster/blob/master/lib/monster.js
 * @class Session
 */
define(function(){

    'use strict';

    return {

        /**
         * Write cookie.
         * @memberof Cookie
         * @param {String} The id of the cookie.
         * @param {String} The value of the cookie.
         * @param {Number} The expiration time of the cookie in days.
         * @param {String} The domain for wihch the cookie is set. Default is '/'.
         * @static
         * @public
         */

        write: function(key,value,days,path) {
            var date = new Date(),
                expires = '',
                type = typeof(value),
                valueToUse = '';
            path = path || '/';
            if (days) {
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }
            if(type === 'object'  && type !== 'undefined') {
                valueToUse = JSON.stringify({v:value});
            }
            else {
                valueToUse = encodeURIComponent(value);
            }
            document.cookie = key + '=' + valueToUse + expires + '; path=' + path;
        },

        /**
         * Read cookie.
         * @memberof Cookie
         * @param {String} The id of the cookie.
         * @static
         * @public
         */

        read: function(key) {
            var nameEQ = key + '=',
                ca = document.cookie.split(';'),
                value = '',
                firstChar = '',
                parsed={};
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' '){
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    value = c.substring(nameEQ.length, c.length);
                    firstChar = value.substring(0, 1);
                    if(firstChar=='{'){
                        parsed = JSON.parse(value);
                        if('v' in parsed){
                            return parsed.v;
                        }
                    }
                    if(value=='undefined'){
                        return undefined;
                    }
                    return decodeURIComponent(value);
                }
            }
            return null;
        },

        /**
         * Remove cookie.
         * @memberof Cookie
         * @param {String} The id of the cookie.
         * @static
         * @public
         */

        remove: function(key) {
            this.write(key, '', -1);
        }

    };

});
