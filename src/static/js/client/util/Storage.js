define(['util/Cookie'],function(Cookie){

    'use strict';

    return {

        /**
         * Write to storage.
         * @memberof Cookie
         * @param {String} The id of the storage-item to set.
         * @param {String} The value of the storage-item to set.
         * @static
         * @public
         */

        write:function (key, value) {

            if (window.localStorage) {

                // write to local storage
                localStorage.setItem(key, value);

                // also write cookie because DEV can't access localStorage :(
                Cookie.write(key, value);

            } else {

                Cookie.write(key, value);

            }

        },

        /**
         * Read from storage.
         * @memberof Cookie
         * @param {String} The id of the storage-item to get.
         * @return {String} The value of the storage-item.
         * @static
         * @public
         */

        read:function (key) {

            if (window.localStorage) {
                return localStorage.getItem(key);
            } else {
                return Cookie.read(key);
            }

        }
    };

});
