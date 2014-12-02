/**
 * RequireJS Configuration
 */
requirejs.config({
    baseUrl:'/static/js/client',
    paths:{
        'conditioner':'../vendor/rikschennink/conditioner',
        'conditioner/tests':'../vendor/rikschennink/tests',
        'async': '../vendor/millermedeiros/async',
        'reqwest':'../vendor/ded/reqwest',
        'text':'../vendor/jrburke/text',
        'h5f':'../vendor/ryanseddon/h5f',
        'moment':'../vendor/momentjs/moment',
        'hammer':'../vendor/eightmedia/hammer'
    }
});

/**
 * ConditionerJS Init
 */

define(['conditioner'],function(conditioner) {
    'use strict';

    require(['config'],function(config){
        conditioner.init(config);
    });

});