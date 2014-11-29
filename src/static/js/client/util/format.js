/**
 * Based on: https://gist.github.com/tbranyen/1049426
 * format("{0} is a {1} and likes to {2}","Tim", "programmer", "kick potatoes");
 * first argument should be string, following arguments are parameters or a single Array
 */
define(function() {

    'use strict';

    return function() {
        var str = arguments[0],
            isArr = arguments[1].length && !arguments[2],
            arr = isArr ? arguments[1] : arguments,
            i = isArr ? 0 : 1,
            l = arr.length;
        for (;i<l;i++) {
            str = str.replace(new RegExp('\\{'+ i +'\\}', 'g'), arr[i]);
        }
        return str;
    };

});