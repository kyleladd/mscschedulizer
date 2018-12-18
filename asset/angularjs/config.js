/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({
    paths: {
        // 'domReady': '../lib/requirejs-domready/domReady',
        'jquery':'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
        'angular':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min',
        'ngRoute':'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.min',
        'ngSanitize':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-sanitize.min',
        'ngAnimate':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min',
        'ngAria':'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-aria.min',
        'ngMessages': 'https://cdnjs.cloudflare.com/ajax/libs/angular-messages/1.6.1/angular-messages.min',
        'ngMaterial':'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.10/angular-material.min',
        'underscore':'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        'lodash':'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',
        'ui.router':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.20/angular-ui-router.min',
        'angular-ui-select':'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min',
        'lscache': 'https://cdnjs.cloudflare.com/ajax/libs/lscache/1.3.0/lscache.min',
        'node_generic_functions': '../../node_modules/node_generic_functions/genericfunctions'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'lscache': {
            deps: [],
            exports: 'lscache'
        },
        'ngMessages': ['angular'],
        'ngAnimate': ['angular'],
        'ngAria': ['angular'],
        'ngMdIcons': ['angular'],
        'ngSanitize': ['angular'],
        'ngMaterial': {
             deps: ['ngAnimate', 'ngAria']
         },
         'mdDataTable':['angular','ngMaterial'],
         // 'node_generic_functions':{
         //    exports: 'node_generic_functions'
         // },
         // 'mdDataTable': {
         //     deps: ['angular'],
         //     exports: 'mdDataTable'

         // },
         'ngRoute': ['angular'],
         'ui.router': ['angular'],
         'angular-ui-select': ['angular']
    },
    // deps: [
    //     './bootstrap'
    // ]
});
